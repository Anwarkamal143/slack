import { NODE_ENV } from "@/constants";
import { ErrorRequestHandler, Response } from "express";

const sendErrorDev = (err: Record<string, any>, res: Response) => {
  console.log(err, "error");
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    succes: false,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err: Record<string, any>, res: Response) => {
  // OPerational ,tursted error, send to client
  // like client send invalid data or like that.
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status || "fail",
      message: err.message || "Something went wrong!",
    });
    // programming or other unknown error: don't want to leak error details
  } else {
    // 1) Log error
    console.error("ERROR", err);
    // 2) Send generic message
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  //   console.log(err.stack);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  // console.log(err, 'error');
  if (NODE_ENV === "developmentt") {
    sendErrorDev(error, res);
    // } else if (process.env.NODE_ENV === 'production') {
  } else {
    console.log(error, "error name");

    sendErrorProd(error, res);
  }
};
