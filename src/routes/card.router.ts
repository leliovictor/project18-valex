import { Router } from "express";
import checkCompanyToken from "../middlewares/token.middleware.js";
import validateSchemaMiddleware from "../middlewares/schema.middleware.js";

import * as schema from "../schemas/card.schema.js";
import * as controller from "../controllers/card.controller.js";

const cardRouter = Router();

cardRouter.post(
  "/cards",
  checkCompanyToken,
  validateSchemaMiddleware(schema.cardSchema),
  controller.postCard
);

cardRouter.post(
  "/cards/activation",
  validateSchemaMiddleware(schema.cardActivationSchema),
  controller.postActivationCard
);

cardRouter.post(
  "/cards/block",
  validateSchemaMiddleware(schema.cardBlockSchema),
  controller.postBlockCard
);

cardRouter.post(
  "/cards/unblock",
  validateSchemaMiddleware(schema.cardBlockSchema),
  controller.postUnblockCard
);

cardRouter.post(
  "/cards/balance",
  validateSchemaMiddleware(schema.cardBalanceSchema),
  controller.cardBalance
);

export default cardRouter;
