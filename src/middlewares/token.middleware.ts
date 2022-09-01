import { Request, Response, NextFunction } from "express";

import { AppError } from "../middlewares/error.handler.middleware.js";

export default async function checkCompanyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["x-api-key"];

  if (!token) {
    throw new AppError(401, "Missed headers token", "Insert a valid token");
  }

  res.locals.apiKey = token;

  next();
}
