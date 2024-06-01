const Status = {
  Ok: 'ok',
  Err: 'error',
};

const Codes = {
  Ok: 200,
  Created: 201,
  Updated: 204,
  Deleted: 204,
  BadRequest: 400,
  Unauthorized: 401,
  NotFound: 404,
  InternalServerError: 500,
};

const Bodies = {
  NotImplemented: 'api not yet implemented',
  MissingField: 'missing field',
  MissingParam: 'missing param',
};

class JSONResponse {
  _code = null;
  _body = null;
  _status = null;

  constructor(code, body) {
    this._code = code;
    this._body = body;

    if (code < 400) {
      this._status = Status.Ok;
      return;
    }

    this._status = Status.Err;
  }

  async marshal(res, fieldName) {
    return res
      .status(this._code)
      .json(Object.fromEntries(new Map().set('status', this._status).set(fieldName, this._body)));
  }
}

async function NotImplemented(res, usecase) {
  const body = `${Bodies.NotImplemented}: ${usecase}`;
  return new JSONResponse(Codes.InternalServerError, body).marshal(res, 'error');
}

async function MissingField(res, field) {
  const body = `${Bodies.MissingField}: '${field}'`;
  return new JSONResponse(Codes.BadRequest, body).marshal(res, 'error');
}

async function MissingParam(res, param) {
  const body = `${Bodies.MissingParam}: '${param}'`;
  return new JSONResponse(Codes.BadRequest, body).marshal(res, 'error');
}

async function Ok(res, body) {
  return new JSONResponse(Codes.Ok, body).marshal(res, 'data');
}

async function Created(res, body) {
  return new JSONResponse(Codes.Created, body).marshal(res, 'resource');
}

async function Updated(res, body) {
  return new JSONResponse(Codes.Updated, body).marshal(res, 'resource');
}

async function Deleted(res, body) {
  return new JSONResponse(Codes.Deleted, body).marshal(res, 'resource');
}

async function NotFound(res, body) {
  return new JSONResponse(Codes.NotFound, body).marshal(res, 'message');
}

async function InternalServerError(res, body) {
  return new JSONResponse(Codes.InternalServerError, body).marshal(res, 'message');
}

async function Unauthorized(res, body) {
  return new JSONResponse(Codes.Unauthorized, body).marshal(res, 'reason');
}

module.exports = {
  NotImplemented,
  MissingField,
  MissingParam,
  Ok,
  Created,
  Updated,
  Deleted,
  NotFound,
  InternalServerError,
  Unauthorized,
  Status,
};
