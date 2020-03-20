const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const convert = require('xml-js');
const xmldoc = require('xmldoc');
const path = require('path')
const mongo = require('./database.js');

const GR_KEY=process.env.GR_KEY

const start = async () => {
  const app = express();
  const port = 10000;
  const db = await mongo.connect();
 
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.use('/', express.static(path.join(__dirname, '../frontend')))

  const parseSearchResults = (data) => {
    return new Promise((resolve, reject) => {
      console.log(data)
      let xml = new xmldoc.XmlDocument(data);
      let results = xml.childNamed('search');
      let json = JSON.parse(convert.xml2json(results,{compact:true,spaces:2}));
      let books = [];
      for(let r of json.search.results.work){
        let book = {
          id: r.best_book.id._text,
          ratingsCount: parseInt(r.ratings_count._text),
          averageRating: parseFloat(r.average_rating._text),
          year: r.original_publication_year._text,
          title: r.best_book.title._text,
          author: r.best_book.author.name._text,
          image_url: r.best_book.image_url._text,
          thumbnail_url: r.best_book.small_image_url._text
        }
        books.push(book);
      }
      return resolve(books);
    })
  }


  const searchGoodReads = (search) => {
    return new Promise( (resolve, reject) => {
      request(`https://www.goodreads.com/search.xml?key=${GR_KEY}&q=${search}`, async (error, response, body)=>{
        if(error){
          return reject(error);
        }
        let parsedData = await parseSearchResults(body);
        return resolve(parsedData);
      }); 
    });
  }


  app.post('/api/search', async (request, response) => {
    let search = request.body.search;
    let data = await searchGoodReads(search);
    let bookSearch = {
      query: search,
      data: data,
      date: new Date()
    }
    await mongo.insertBookSearch(db.db,bookSearch);
    return response.send(data);
  });

  app.get('/api/history', async (request, response) => {
    
    let results = await mongo.getHistory(db.db);
    return response.send(results);   

  });


  app.listen(port,()=> console.log(`Book Manager API listening on port ${port}`));
}
start();

