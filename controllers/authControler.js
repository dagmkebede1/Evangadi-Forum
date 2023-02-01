import StatusCode from "http-status-codes";
import db from "../config/dbConfig.js";
import validator from "validator";
import moment from "moment";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// commonJS module  ---- > nodejs
// ES6 style module[import/export]

// a function to sign a token
const signToken = (email) => {
  return jwt.sign({ email: email }, process.env.SECRET_JWT, {
    expiresIn: "3d",
  });
};

const signUp = (req, res) => {
  let { firstName, lastName, email, password } = req.body;

  // checking for the presence of every input fields.
  if (!firstName || !lastName || !email || !password) {
    res.status(StatusCode.NOT_FOUND).json({
      status: "failed",
      message: "Please provide the required Fields",
    });
  }
  // checking the validity of the email the user provided
  if (!validator.isEmail(email)) {
    res.status(StatusCode.BAD_REQUEST).json({
      status: "failed",
      message: "Please provide a valid Email Address",
    });
  } else {
    // checking if the user exists in our database, previously signed up
    db.query(`SELECT * FROM Users WHERE email = '${email}'`, (err, results) => {
      if (err) {
        console.log(`ERROR: ${err.message}`);
      } else {
        if (results[0]) {
          res.status(StatusCode.NOT_FOUND).json({
            status: "failed",
            message: "there is a User with that Email address",
          });
        } else {
          // getting the current time and converting in to a format that MYSQL supports

          let currentTime = moment(Date.now()).format();

          // inserting the user
          let query = `INSERT INTO Users(create_time, firstName, lastName, email, password) VALUES (?)`;

          // Hashing/ Increpting the password
          let salt = bcrypt.genSaltSync(10);
          const hashedPassword = bcrypt.hashSync(password, salt);

          let values = [
            currentTime,
            firstName,
            lastName,
            email,
            hashedPassword,
          ];

          db.query(query, [values], (err) => {
            if (err) {
              console.log(`ERROR: ${err.message}`);
            } else {
              console.log(`User has been Saved to DB`);

              let token = signToken(email);

              const cookieOptions = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                //this will be true in the hosting and productions
                secure: false,
                httpOnly: true,
              };
              res.cookie("token", token, cookieOptions);

              res.status(StatusCode.OK).json({
                status: "success",
                token: token,
              });
            }
          });
        }
      }
    });
  }
};

const signIn = (req, res) => {
  const { email, password } = req.body;

  // checking for the presence of every input fields.
  if (!email || !password) {
    return res.status(StatusCode.NOT_FOUND).json({
      status: "failed",
      message: "Please provide the required Fields",
    });
  }
  let query = `SELECT firstName, lastName, email, password FROM Users WHERE email='${email}'`;
  db.query(query, (err, results) => {
    if (err) {
      console.log(`ERROR: ${err.message}`);
    } else {
      if (!results[0] || !bcrypt.compareSync(password, results[0].password)) {
        res.status(StatusCode.BAD_REQUEST).json({
          status: "failed",
          message: "Wrong Credentials, email or password is Incorrect !",
        });
      } else {
        let token = signToken(email);

        const cookieOptions = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          //this will be true in the hosting and productions
          secure: false,
          httpOnly: true,
        };
        res.cookie("token", token, cookieOptions);

        res.status(StatusCode.OK).json({
          status: "success",
          token: token,
        });
      }
    }
  });
};

export { signUp, signIn };
