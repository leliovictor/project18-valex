import { Request, Response, NextFunction } from "express";

import * as repository from "../repositories/companyRepository.js";
import { AppError } from "../middlewares/error.handler.middleware.js";

export async function checkCompanyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers['x-api-key'].toString();

  if (!token) {
    throw new AppError(
      "Missed headers token",
      401,
      "Missed headers token",
      "Insert a valid token"
    );
  }

  const company = await repository.findByApiKey(token);

  if(!company) {
    throw new AppError(
        "Invalid token",
        401,
        "Invalid token",
        "Insert a valid token"
      );
  }

  res.locals.company = company;

  next();
}
