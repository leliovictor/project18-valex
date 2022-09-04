import { Request, Response } from "express";

import * as service from "../services/recharge.service.js";

export async function postRecharge(_req: Request, res: Response) {
  const {cardId, amount} = res.locals.body;
  const { apiKey } = res.locals;

  await service.rechargeCard(cardId, amount, apiKey);
  
  return res.sendStatus(200);
}
