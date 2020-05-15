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
  const db = await mongo.connect();
  
  passport.use(new passportHTTPBearer((token,done)=>{
    const users = db.db.collection('users');
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


  app.get('/api/statistics', passport.authenticate('bearer',{session:false}), async (request, response) => {
    return response.send(await mongo.getStatistics(db.db));
  });

  app.get('/api/statistics/latest', passport.authenticate('bearer',{session:false}), async (request, response) => {
    return response.send( await mongo.getLatestStatistic(db.db));
  });


  app.listen(SERVICE_PORT,()=> console.log(`Book Manager API listening on port ${SERVICE_PORT}`));
}
start();

