const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcryptjs');

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

const loadUser = (db) => {
  return new Promise((resolve, reject) => {
    const users = db.collection('users');
    users.find({}).toArray((err, docs) => {
      if (err) return reject(err);
      if (!docs || !docs.length) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(APP_USER_PASS, salt);
        let user = {
          username: 'admin',
          password: hash,
          token: undefined
        };
        users.insert(user, (err, result) => {
          if (err) return reject(err);
          return resolve(result);
        });
      }
      return resolve(true);
    });
  });
}

const connect = () => {
  return new Promise((resolve, reject) => {

    const client = new MongoClient(url, mongoDBOptions)

    client.connect(async(err) => {
      if (err) {
        return reject(err);
      }
      const db = client.db(SERVICE_DB_NAME);
      if (!db) {
        return reject("No database object returned from client")
      }
      await loadUser(db);
      console.log("Connected successfully to server");
      return resolve({ client: client, db, db });
    })
  })
}

const updateUser = (db, user) => {
  return new Promise((resolve, reject) => {
    const users = db.collection('users');
    users.findOneAndReplace({ _id: user._id }, user, (err, result) => {
      if (err) return reject(err);
      return resolve(result);
    });
  })
}

module.exports = {
  connect: connect,
  updateUser: updateUser
}
