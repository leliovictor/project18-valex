import { Router } from "express";

import checkCompanyToken from "../middlewares/token.middleware.js";
import validateSchemaMiddleware from "../middlewares/schema.middleware.js";

import * as schema from "../schemas/recharge.schema.js";
import * as controller from "../controllers/recharge.controller.js";

const rechargeRouter = Router();

rechargeRouter.post(
  "/recharges",
  checkCompanyToken,
  validateSchemaMiddleware(schema.rechargeSchema),
  controller.postRecharge
);

export default rechargeRouter;
