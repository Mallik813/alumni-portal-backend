const express = require('express');
const { MongoClient } = require('mongodb');
const config = require('../utils/config');

const router = express.Router();
const register = require('./controllers/register');

const url = config.host;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    throw err;
  }
  // eslint-disable-next-line no-console
  console.log('Database connected successfully!');
  const db = client.db(config.dbName);

  router.get('/', (req, res) => res.send('welcome'));

  router.post('/register', (req, res) => {
    register(req, res, db);
  });
});

module.exports = router;
