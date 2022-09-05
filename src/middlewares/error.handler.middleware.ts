import { Request, Response, NextFunction } from "express";

class AppError {
  statusCode: number;
  message: string;
  details: string | {} | string[];

  constructor(
    statusCode: number,
    message: string,
    details: string | {} | string[]
  ) {
    this.statusCode = statusCode;
    this.message = message;
    this.details = details;
  }
}

function errorHandler(
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const { statusCode, message, details } = error;

  console.log(statusCode, message, details);

  return error.statusCode !== 500
    ? res.status(statusCode).send({ message, details })
    : res.status(500).send({
        message: "Internal server error",
        details: error,
      });
}

export { AppError };
export default errorHandler;
