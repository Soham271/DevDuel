import { error } from "console";
import exp from "constants";

// ErrorHandler class definition
export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error middleware to handle errors in the app
const ErrorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle specific error cases
  if (err.code === 11000) {
    // Duplicate entry error (MongoDB)
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "JsonWebTokenError") {
    // Invalid JWT error
    const message = `JWT token is Invalid! Try again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "TokenExpiredError") {
    // Expired JWT error
    const message = `JWT token is Expired! Try again`;
    err = new ErrorHandler(message, 400);
  }

  if (err.name === "CastError") {
    // Invalid object ID (MongoDB)
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Custom error messages for validation errors
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  // Send the response with the proper status code and error message
  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorMiddleware;
