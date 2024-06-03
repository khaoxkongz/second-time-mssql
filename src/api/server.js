const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const { newRouterSelectorLocation } = require('./routes/selector_location.router');

const util = require('node:util');

class Server {
  _databaseInstance = null;
  _server = null;

  constructor(arg) {
    this._server = express();
    this._server.use(express.json());
    this._server.use(bodyParser.json());
    this._server.use(bodyParser.urlencoded({ extended: true }));
    this._server.use(cors());

    this._server.get('/', (_req, res) => res.status(200).json({ message: 'Hello World!' }).end());

    this._databaseInstance = arg.databaseInstance;

    this._server.use('/api/v1/selector/location', newRouterSelectorLocation(arg.ctrlSelectorLocation).router());
  }

  async connectDatabase() {
    try {
      await this._databaseInstance.connect();
      console.log('[TASK_2] Successfully connected to database.');
    } catch (err) {
      console.error('Database Connection Failed!', err);
      process.exit(1);
    }
  }

  async listenAndServe(port) {
    const server = this._server.listen(port, () => console.log(`[TASK_3] Server is running on port ${port}`));

    shutdown({ database: this._databaseInstance, server }, 'SIGINT');
    shutdown({ database: this._databaseInstance, server }, 'SIGTERM');
  }
}

async function shutdown({ database, server }, signal) {
  process.on(signal, async () => {
    console.log('');
    console.log(`[TASK_1] Received ${signal}.`);
    console.log(`[TASK_2] Shutting down server...`);

    await database.disconnect();
    console.log('[TASK_4] Successfully disconnected from database.');

    const closeServer = util.promisify(server.close.bind(server));
    await closeServer();

    console.log('[TASK_5] Server closed.');

    process.exit(0);
  });
}

module.exports = { Server };
