import { Request, Response } from "express";

import { RechargeInsertData } from "../repositories/rechargeRepository.js";

import * as repository from "../repositories/rechargeRepository.js";

async function registerCredit(_req: Request, res: Response) {
  const body: RechargeInsertData = res.locals.body;
  await repository.insert(body);
  return res.sendStatus(200);
}

export { registerCredit };
