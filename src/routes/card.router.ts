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

export default cardRouter;
