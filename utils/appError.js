// this is our errors class which will save us from re-writing a lot of code.

class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // calls constructor on parent class
    this.statusCode = statusCode;

    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // e.g. user creating tour without a required field

    Error.captureStackTrace(this, this.constructor); // add this object to the stack
  }
}

module.exports = AppError;
