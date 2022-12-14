import { Request, Response } from "express";

import * as service from "../services/card.service.js";

export async function postCard(_req: Request, res: Response) {
  const { employeeId, type } = res.locals.body;
  const { apiKey } = res.locals;

  const CVC = await service.addNewCard(employeeId, type, apiKey);

  return res.status(200).send(`Your card CVC is: ${CVC}, save for futures requests`);
}

export async function postActivationCard(_req: Request, res: Response) {
  const { id, CVC, password } = res.locals.body;

  await service.activateCard(id, CVC, password);

  return res.sendStatus(200);
}

export async function postBlockCard(_req: Request, res: Response) {
  const { id, password } = res.locals.body;

  await service.blockCard(id, password);

  return res.sendStatus(200);
}

export async function postUnblockCard(_req: Request, res: Response) {
  const { id, password } = res.locals.body;

  await service.unblockCard(id, password);

  return res.sendStatus(200);
}

export async function cardBalance(_req: Request, res: Response) {
  const { id } = res.locals.body;

  const balance = await service.balanceCard(id);

  return res.status(200).send(balance);
}
