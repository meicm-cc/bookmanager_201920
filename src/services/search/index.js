const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')
const convert = require('xml-js')
const xmldoc = require('xmldoc')
const mongo = require('./database.js')

const GR_KEY = process.env.GR_KEY
const SERVICE_PORT = process.env.SERVICE_PORT || 10000

const start = async () => {
  const app = express();
  const mongoElements = await mongo.connect();

  app.use(cors())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  const parseSearchResults = (data) => {
    return new Promise((resolve, reject) => {
      let xml = new xmldoc.XmlDocument(data);
      let results = xml.childNamed('search');
      let json = JSON.parse(convert.xml2json(results, { compact: true, spaces: 2 }));
      let books = [];
      for (let r of json.search.results.work) {
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
    return new Promise((resolve, reject) => {
      axios.get(`https://www.goodreads.com/search.xml?key=${GR_KEY}&q=${search}`)
        .then(async (response) => {
          let parsedData = await parseSearchResults(response.data);
          return resolve(parsedData);
        })
        .catch(err => {
          return reject(err);
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
    await mongo.insertBookSearch(mongoElements.db, bookSearch);
    return response.send(data);
  });

  app.listen(SERVICE_PORT, () => console.log(`Book Manager Search Service listening on port ${SERVICE_PORT}`));
}
start();
