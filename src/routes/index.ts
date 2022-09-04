import { Router } from "express";

import cardRouter from "./card.router.js";
import paymentRouter from "./payment.router.js";
//import rechargeRouter from "./rechargeRouter.js";

const router = Router();

router.use(cardRouter);
router.use(paymentRouter);

//router.use(rechargeRouter);

export default router;
