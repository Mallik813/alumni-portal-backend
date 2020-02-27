const express = require('express');
const { MongoClient } = require('mongodb');
const config = require('../utils/config');

const router = express.Router();
const signup = require('./controllers/signup');
const login = require('./controllers/login');
const user = require('./controllers/user');
const userAuth = require('./middlewares/user-auth');

const url = config.host;

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    throw err;
  }
  // eslint-disable-next-line no-console
  console.log('Database connected successfully!');
  const db = client.db(config.dbName);

  router.get('/', (req, res) => res.send('welcome'));

  router.post('/signup', (req, res) => {
    signup(req, res, db);
  });
  router.post('/login', (req, res) => {
    login(req, res, db);
  });
  router.get('/user', userAuth, (req, res) => {
    user(req, res, db);
  });
});

module.exports = router;
