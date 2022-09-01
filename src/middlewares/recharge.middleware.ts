import { Request, Response, NextFunction } from "express";
import { AppError } from "./error.handler.middleware";

import * as recharge_repository from "../repositories/rechargeRepository.js";
import * as card_repository from "../repositories/cardRepository.js";

async function checkIfCardExists(_req: Request, res: Response, next: NextFunction) {
  const cardId: number = res.locals.body.cardId;
  const data = await recharge_repository.findByCardId(cardId);
  console.log(data);
  if (!data) {
    throw new AppError(
      404,
      'Card does not found in database',
      'Enter a valid card id'
    )
  }
  next();
}

async function checkIfCardIsActive(_req: Request, res: Response, next: NextFunction) {
  const cardId: number = res.locals.body.cardId;
  const data = await card_repository.findById(cardId);
  console.log(data);
  if (!data.isBlocked) {
    throw new AppError(
      403,
      'Card does not active',
      'Enter a valid card'
    )
  }
  next();
}

async function checkCardExpirationDate(_req: Request, res: Response, next: NextFunction) {
  const expirationDate: string = res.locals.card_data.expirationDate;
  const [month, year] = expirationDate.split('/');
  const current_year = new Date().getFullYear().toString().slice(2);
  const current_month = new Date().getMonth().toString();
  console.log(expirationDate, current_year, current_month)
  const invalidExpirationDate: boolean = year < current_year || (year === current_year && month < current_month);
  if (invalidExpirationDate) {
    throw new AppError(
      403,
      'Invalid expiration date',
      'Enter a valid card'
    )
  }
  next();
}

export { checkIfCardExists, checkIfCardIsActive, checkCardExpirationDate };
