const express = require('express');

class Router {
  _router = null;

  constructor() {
    this._router = express.Router();
  }

  router() {
    return this._router;
  }
}

module.exports = { Router };
