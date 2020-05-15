const express = require('express');
const cors = require('cors')
const mongo = require('./database.js');
const agenda = require('./agenda.js');

const SERVICE_PORT = process.env.SERVICE_PORT || 10000;

const start = async () => {
  const app = express();
  const db = await mongo.connect();
  agenda.start(db);

  app.use(cors())
  app.get('/api/trigger', async (request, response) => {
    agenda.trigger();
    return response.send({msg:"DONE"});
  });

  app.listen(SERVICE_PORT,()=> console.log(`Data Gatherer Micro Service listening on port ${SERVICE_PORT}`));
}
start();

