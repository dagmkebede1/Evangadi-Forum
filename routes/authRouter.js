import express from "express";
import { signIn, signUp } from "../controllers/authControler.js";

const Router = express.Router();

Router.route("/signup").post(signUp);
Router.route("/signin").post(signIn);

export default Router;
