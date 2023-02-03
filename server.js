import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter.js";
dotenv.config();

const PORT = process.env.PORT || 4000;
const app = express();

// JSON
//--> req <---> res
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use("/api/v1", authRouter);

//Middleware: the code that can execute after the request but before the response
//  req <----> res

// app.get(
//   "/testMiddle",
//   (req, res, next) => {
//     console.log(`First Middleware`);
//     res.send("first Middleware");
//     next();
//   },
//   (req, res) => {
//     console.log(`thi is the second Middleware`);
//   }
// );

const runAPP = () => {
  import("./config/dbConfig.js");
  app.listen(PORT, console.log(`Server running on port: ${PORT}`));
};

runAPP();
