const Status = {
  Ok: 'success',
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
  InvalidField: 'invalid field',
};

class JSONResponse {
  _code = null;
  _body = null;
  _status = null;
  _message = null;

  constructor(code, body) {
    this._code = code;
    this._body = body;

    if (code < 400) {
      this._status = true;
      this._message = Status.Ok;
      return;
    }

    this._status = false;
    this._message = Status.Err;
  }

  async marshal(res, fieldName) {
    return res
      .status(this._code)
      .json(
        Object.fromEntries(
          new Map().set('status', this._status).set('message', this._message).set(fieldName, this._body)
        )
      );
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

async function BadRequest(res, param) {
  const body = `${Bodies.InvalidField}: '${param}'`;
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
  return new JSONResponse(Codes.NotFound, body).marshal(res, 'error');
}

async function InternalServerError(res, body) {
  return new JSONResponse(Codes.InternalServerError, body).marshal(res, 'error');
}

async function Unauthorized(res, body) {
  return new JSONResponse(Codes.Unauthorized, body).marshal(res, 'reason');
}

module.exports = {
  NotImplemented,
  MissingField,
  MissingParam,
  BadRequest,
  Ok,
  Created,
  Updated,
  Deleted,
  NotFound,
  InternalServerError,
  Unauthorized,
  Status,
};
