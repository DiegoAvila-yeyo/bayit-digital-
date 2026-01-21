class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Mantiene el stack trace limpio
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;