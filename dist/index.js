import express, { json } from "express";
import "express-async-errors";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes/index.js";
import errorHandler from "./middlewares/error.handler.middleware.js";
dotenv.config();
var app = express();
app.use(json());
app.use(cors());
app.use(router);
app.use(errorHandler);
var port = process.env.PORT || 4000;
app.listen(port, function () {
    console.log("Server is up on port: ".concat(port));
});
