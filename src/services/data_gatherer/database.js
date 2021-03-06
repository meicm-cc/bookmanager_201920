const MongoClient = require('mongodb').MongoClient;

const SERVICE_DB_HOSTNAME = encodeURIComponent(process.env.SERVICE_DB_HOSTNAME || 'localhost')
const SERVICE_DB_PORT = encodeURIComponent(process.env.SERVICE_DB_PORT || 27017)
const SERVICE_DB_NAME = process.env.SERVICE_DB_NAME || 'bookmanager'

const url = `mongodb://${SERVICE_DB_HOSTNAME}:${SERVICE_DB_PORT}`;

const mongoDBOptions = {
  reconnectInterval: 1000,
  reconnectTries: 60,
  autoReconnect: true
}

const connect = () => {
  return new Promise((resolve, reject) => {

    const client = new MongoClient(url, mongoDBOptions)

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

const getBooks = (db) => {
  return new Promise((resolve, reject) => {
    const collection = db.collection('books');
    collection.find({}).toArray((err, books) => {
      if (err) return reject(err);
      return resolve(books);
    })
  });
}

const getStatisticsByDay = (db, day) => {
  return new Promise((resolve, reject) => {
    const statistics = db.collection('statistics');
    statistics.findOne({ date: day }, (err, statistic) => {
      if (err) return reject(err);
      return resolve(statistic);
    });
  });
}

const insertStatistics = (db, statistic) => {
  return new Promise((resolve, reject) => {
    const statistics = db.collection('statistics');
    statistics.insertOne(statistic, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  });
}

const getLatestStatistic = (db) => {
  return new Promise((resolve, reject) => {
    const statistics = db.collection('statistics');
    statistics.find().sort({ date: -1 }).limit(1).next((err, doc) => {
      if (err) return reject(err);
      return resolve(doc);
    });
  });
}

const getStatistics = (db) => {
  return new Promise((resolve, reject) => {
    const statistics = db.collection('statistics');
    statistics.find({}).sort({ date: -1 }).limit(30).toArray((err, docs) => {
      if (err) return reject(err);
      return resolve(docs);
    });
  });
}

module.exports = {
  connect: connect,
  getBooks: getBooks,
  getStatisticsByDay: getStatisticsByDay,
  insertStatistics: insertStatistics,
  getLatestStatistic: getLatestStatistic,
  getStatistics: getStatistics
}
