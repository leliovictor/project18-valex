import { Request, Response } from "express";

import * as service from "../services/payment.service.js";

export async function postPayment(_req: Request, res: Response) {
  const { cardId, password, businessId, amount } = res.locals.body;

  await service.payment(cardId, password, businessId, amount);

  return res.sendStatus(200);
}

export async function postOnlinePayment(_req: Request, res: Response) {
  const {number, cardholderName, expirationDate, CVC, businessId, amount} = res.locals.body;
 
  await service.onlinePayment(number, cardholderName, expirationDate, CVC, businessId, amount);

  return res.sendStatus(200);
}
