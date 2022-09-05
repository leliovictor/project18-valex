import { Router } from "express";

import validateSchemaMiddleware from "../middlewares/schema.middleware.js";

import * as schema from "../schemas/payment.schema.js";
import * as controller from "../controllers/payment.controller.js";

const paymentRouter = Router();

paymentRouter.post(
  "/payments",
  validateSchemaMiddleware(schema.paymentSchema),
  controller.postPayment
);

export default paymentRouter;
