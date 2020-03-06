const express = require('express');
const { MongoClient } = require('mongodb');
const config = require('../utils/config');

const router = express.Router();
const signup = require('./controllers/signup');
const login = require('./controllers/login');
const users = require('./controllers/user');
const userAuth = require('./middlewares/user-auth');
const posts = require('./controllers/posts');

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
    signup.handleSignup(req, res, db);
  });
  router.post('/login', (req, res) => {
    login(req, res, db);
  });
  router.get('/users', userAuth, (req, res) => {
    users(req, res, db);
  });
  router.post('/posts', userAuth, (req, res) => {
    posts(req, res, db);
  });
  router.get('/posts/:postID', userAuth, async (req, res) => {
    const post = await db.collection('posts').findOne({ _id: req.params.postID });
    res.send(post);
  });
  router.get('/user/:userID', userAuth, async (req, res) => {
    const user = await db
      .collection('users')
      .find({ _id: req.params.userID })
      .toArray();
    res.send(user);
  });
});

module.exports = router;
