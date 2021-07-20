import express from 'express';
import { HTTPStatusCodes } from './enums';
import { flintError } from './flintgg';

export class FlintError extends Error {
  statusCode: HTTPStatusCodes;

  constructor(m: string, httpCode: HTTPStatusCodes) {
    super(m);
    // Set the prototype explicitly as extending build-ins is broken at the moment
    Object.setPrototypeOf(this, FlintError.prototype);
    this.statusCode = httpCode;
  }

  static handleResponse(error: Error, res: express.Response, titl: string) {
    // First log the error
    console.error(error);
    // Determine the HTTP status code to send
    let title: string;
    let httpCode: HTTPStatusCodes;
    if (error instanceof FlintError) {
      httpCode = error.statusCode;
      title = error.name;
    } else {
      title = titl;
      httpCode = HTTPStatusCodes.defaultError;
    }
    res.status(httpCode).json({
      // we leave the status out, since we send that in the actual request
      error: { title, detail: error.message } as flintError,
    });
  }
}
