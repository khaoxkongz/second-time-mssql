require('dotenv').config();

const { Server } = require('./api/server');
const { newDatabaseContext } = require('./data/sources/mssql/mssql.database');
const { init } = require('./init');

async function main() {
  const databaseInstance = newDatabaseContext();

  const serverInitializer = init(Server, { databaseInstance });

  await serverInitializer.connectDatabase();
  await serverInitializer.listenAndServe(process.env.NODE_PORT || 8888);

  return;
}

main()
  .then(() => setTimeout(() => console.log('[TASK_4] Application started!'), 1 * 1000))
  .catch((err) => console.error('Application failed to start!', err));
