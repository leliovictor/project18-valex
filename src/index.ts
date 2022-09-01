import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";

import router from "./routes/index.js";
//import erroHandler from "./middlewares/erroHandler.middleware.js";

dotenv.config();

const app = express();

app.use(json());
app.use(cors());
app.use(router);
//app.use(erroHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server is up on port: ${port}`);
});
