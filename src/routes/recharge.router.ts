import { Router } from "express";

import * as schema from "../schemas/recharge.schema.js";
import * as middleware from "../middlewares/recharge.middleware.js";
import * as controller from "../controllers/recharge.controller.js";

import checkCompanyToken from "../middlewares/token.middleware.js";
import validateSchemaMiddleware from "../middlewares/schema.middleware.js";

const rechargeRouter = Router();

rechargeRouter.post(
  "/recharge", 
  checkCompanyToken,
  validateSchemaMiddleware(schema.insertCredit),
  middleware.checkIfCardExists,
  middleware.checkIfCardIsActive,
  middleware.checkCardExpirationDate,
  controller.registerCredit  
  );

export default rechargeRouter;