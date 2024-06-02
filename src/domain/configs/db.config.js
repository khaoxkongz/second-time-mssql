const { MS_SQL_USER, MS_SQL_PASSWORD } = require('../utils/constants.util');
const { MS_SQL_SERVER, MS_SQL_PORT, MS_SQL_DATABASE } = require('../utils/constants.util');

const config = {
  user: MS_SQL_USER,
  password: MS_SQL_PASSWORD,
  server: MS_SQL_SERVER,
  port: parseInt(MS_SQL_PORT, 10),
  database: MS_SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

module.exports = { config };
