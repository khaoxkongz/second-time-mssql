const constUtilities = require('../utils/constants.util');

const config = {
  user: constUtilities.MS_SQL_USER,
  password: constUtilities.MS_SQL_PASSWORD,
  server: constUtilities.MS_SQL_SERVER,
  port: parseInt(constUtilities.MS_SQL_PORT, 10),
  database: constUtilities.MS_SQL_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

module.exports = { config };
