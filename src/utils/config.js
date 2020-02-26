require('dotenv').config();

const { PORT, DB_HOST, DB_NAME } = process.env;

const config = {
  port: PORT,
  host: DB_HOST,
  dbName: DB_NAME,
};

module.exports = config;
