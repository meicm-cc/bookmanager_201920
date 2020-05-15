const axios = require('axios');
const convert = require('xml-js');
const xmldoc = require('xmldoc');
const GR_KEY = process.env.GR_KEY

const parseBookResults = (data) => {
  return new Promise((resolve, reject) => {
    let xml = new xmldoc.XmlDocument(data);
    let results = xml.childNamed('book');
    let json = JSON.parse(convert.xml2json(results, { compact: true, spaces: 2 }));
    let book = {
      id: json.book.id._text,
      publisher: json.book.publisher._text,
      avg_rating: json.book.average_rating._text,
      ratings: json.book.work.rating_dist._text,
      total_ratings: json.book.work.ratings_count._text
    };
    return resolve(book);
  })
}

const getBookData = (bookID) => {
  return new Promise((resolve, reject) => {
    axios.get(`https://www.goodreads.com/book/show/${bookID}.xml?key=${GR_KEY}`)
      .then(async (response) => {
        let parsedData = await parseBookResults(response.data);
        return resolve(parsedData);
      })
      .catch(error => {
        if (error) {
          return reject(error);
        }
      });
  });
}

module.exports = {
  getBookData: getBookData
}
