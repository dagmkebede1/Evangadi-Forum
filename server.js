import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import authRouter from "./routes/authRouter.js";
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(authRouter);

const runAPP = () => {
  import("./config/dbConfig.js");
  app.listen(PORT, console.log(`Server running on port: ${PORT}`));
};

runAPP();
