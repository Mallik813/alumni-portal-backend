const express = require('express');
const cors = require('cors');
const config = require('./utils/config');

const app = express();
app.use(cors());

app.use('/api', (req, res) => {
  res.send("It's working");
});

app.get('*', (req, res) => {
  res.status(404).send('You did something wrong!');
});

const port = config.port || 3001;

// eslint-disable-next-line no-console
app.listen(port, () => console.log(`API server ready at http://localhost:${port}`));
