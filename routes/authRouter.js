import express from "express";
import { protect, signIn, signUp } from "../controllers/authControler.js";

const Router = express.Router();

Router.route("/signup").post(signUp);
Router.route("/signin").post(signIn);

// example

Router.route("/protect").get(protect, (req, res) => {
  let user = req.user;

  res.json({
    user,
  });
});

export default Router;
