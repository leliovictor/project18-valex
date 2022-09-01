import { Router } from "express";
import { checkCompanyToken } from "../middlewares/token.middleware.js";

const cardRouter = Router();

cardRouter.post("/cards", checkCompanyToken);

export default cardRouter;
