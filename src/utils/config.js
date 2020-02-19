require('dotenv').config();

const { PORT } = process.env;

const config = {
  port: PORT,
};

module.exports = config;
