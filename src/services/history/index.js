const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const mongo = require('./database.js');

const SERVICE_PORT = process.env.SERVICE_PORT || 10000;

const start = async () => {
  const app = express();
  const mongoElements = await mongo.connect();
 
  app.use(cors())
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.get('/api/history', async (request, response) => {
    let results = await mongo.getHistory(mongoElements.db);
    return response.send(results);   
  });

  app.listen(SERVICE_PORT,() => console.log(`Book Manager History Service listening on port ${SERVICE_PORT}`));
}
start();

