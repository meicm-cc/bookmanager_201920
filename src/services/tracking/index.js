const express = require('express');
const cors = require('cors')
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportHTTPBearer = require('passport-http-bearer').Strategy;
const bodyParser = require('body-parser');
const mongo = require('./database.js');

const SERVICE_PORT = process.env.SERVICE_PORT || 10000;
const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const start = async () => {
  const app = express();
  const mongoElements = await mongo.connect();

  passport.use(new passportHTTPBearer((token,done)=>{
    const users = mongoElements.db.collection('users');
    try{
      jwt.verify(token,JWT_SECRET);
    } catch(exception) {
      return done(exception);
    }
    users.findOne({token:token},(err,user)=>{
      if(err) return done(err);
      if(!user) return done(null,false);
      return done(null,user,{scope: 'all'});
    });
  }));

  app.use(cors())
  app.use(passport.initialize());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.post('/api/books', passport.authenticate('bearer',{session:false}), async (request, response) => {
    let book = request.body;
    const result = await mongo.insertBookTracking(mongoElements.db, book);
    return response.send({
      result:result
    })
  })

  app.delete('/api/books/:id', passport.authenticate('bearer',{session:false}), async (request, response) => {
    let bookID = request.params.id;
    const result = await mongo.deleteBookTracking(mongoElements.db, bookID);
    return response.send({
      result:result
    })
  })

  app.get('/api/books',passport.authenticate('bearer',{session:false}), async (request, response) => {
    const books = await mongo.getBooks(mongoElements.db);
    return response.send(books);
  })

  app.listen(SERVICE_PORT,()=> console.log(`Book Manager Micro Service listening on port ${SERVICE_PORT}`));
}
start();

