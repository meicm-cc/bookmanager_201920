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

const APP_USER_PASS = process.env.APP_USER_PASS || 'password';

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



const insertBookTracking = (db, book) => {
    return new Promise((resolve, reject) => {
        const collection = db.collection('books');
        collection.findOne({ id: book.id }, (err, result) => {
            if (err) return reject(err);
            if (result) return resolve(result);
            collection.insertOne(book, (err, result) => {
                if (err) return reject(err);
                if (result) return resolve(result);
            })
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


const deleteBookTracking = (db, bookID) => {
    return new Promise((resolve, reject) => {
        const collection = db.collection('books');
        collection.findOneAndDelete({ id: bookID }, (err, result) => {
            if (err) return reject(err);
            return resolve(result);
        });
    });
}

module.exports = {
    connect: connect,
    insertBookTracking: insertBookTracking,
    getBooks: getBooks,
    deleteBookTracking: deleteBookTracking
}
