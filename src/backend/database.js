const MongoClient = require('mongodb').MongoClient;



// Connection URL
const url = `mongodb://database:27017/bookmanager`;

const dbName = 'bookmanager';

const connect = () => {
  return new Promise((resolve,reject)=>{
    const client = new MongoClient(url);
    let db;
    // Use connect method to connect to the Server
    client.connect(function(err) {
      if(err) {
        return reject(err);
      }
      console.log("Connected successfully to server");
      db = client.db(dbName);
      return resolve({
        client:client,
        db:db
      });
    });
  })
}


const insertBookSearch = (db, bookSearch) => {
  return new Promise((resolve,reject)=> {

    const collection = db.collection('searches');
    collection.insertOne(bookSearch,(err,result)=>{
      if(err){
        return reject(err);
      }
      return resolve(result);
    });
  });
}


const getHistory = (db) => {
  return new Promise((resolve,reject) => {
    const collection = db.collection('searches');
    collection.find({}).toArray((err,results)=>{
      if(err){
        return reject(err);
      }
      return resolve(results);
    })
  });
}

module.exports = {
  connect: connect,
  insertBookSearch: insertBookSearch,
  getHistory: getHistory
}
