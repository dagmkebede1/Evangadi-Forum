import express from "express";
import authControler from "../controllers/authControler.js";

const Router = express.Router();

Router.route("/signup").post(authControler);

export default Router;
