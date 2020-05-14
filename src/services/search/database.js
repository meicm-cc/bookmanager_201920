const MongoClient = require('mongodb').MongoClient;

// Connection URL
const SERVICE_DB_HOSTNAME = process.env.SERVICE_DB_HOSTNAME || 'localhost'
const SERVICE_DB_PORT = process.env.SERVICE_DB_PORT || 27017
const SERVICE_DB_NAME = process.env.SERVICE_DB_NAME || 'bookmanager'

const url = `mongodb://${SERVICE_DB_HOSTNAME}:${SERVICE_DB_PORT}`;

const mongoDBOptions = {
  reconnectInterval: 1000,
  reconnectTries: 60,
  autoReconnect: true
}

const connect = () => {
  return new Promise((resolve, reject) => {

    const client = new MongoClient(url,mongoDBOptions)

    client.connect((err) => {
      if (err) {
        return reject(err);
      }
      const db = client.db(SERVICE_DB_NAME);
      if (!db) {
        return reject("No database object returned from client")
      }
      console.log("Connected successfully to server");
      return resolve({ client: client, db, db });
    })
  })
}


const insertBookSearch = (db, bookSearch) => {
  return new Promise((resolve, reject) => {

    const collection = db.collection('searches');
    collection.insertOne(bookSearch, (err, result) => {
      if (err) {
        return reject(err);
      }
      return resolve(result);
    });
  });
}

module.exports = {
  connect: connect,
  insertBookSearch: insertBookSearch
}
