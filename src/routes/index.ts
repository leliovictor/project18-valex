import { Router } from "express";

import cardRouter from "./card.router.js";
import paymentRouter from "./payment.router.js";
import rechargeRouter from "./recharge.router.js";

const router = Router();

router.use(cardRouter);
router.use(rechargeRouter);
router.use(paymentRouter);

export default router;
