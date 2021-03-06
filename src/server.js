const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const usersRouter = require("./usersRouter.js");
const loginRouter = require("./loginRouter.js");
const mongoose = require("mongoose");

const STATUS_USER_ERROR = 422;
const BCRYPT_COST = 11;

const server = express();
// to enable parsing of json bodies for post requests
server.use(bodyParser.json());
server.use(
  session({
    secret: "e5SPiqsEtjexkTj3Xqovsjzq8ovjfgVDFMfUzSmJO21dtXs4re"
  })
);

mongoose
  .connect("mongodb://localhost/users", { useMongoClient: true })
  .then(() => console.log("API CONNECTED DO DATABASE"))
  .catch(err => console.log("ERROR CONNECTING TO DB"));

/* Sends the given err, a string or an object, to the client. Sets the status
 * code appropriately. */
const sendUserError = (err, res) => {
  res.status(STATUS_USER_ERROR);
  if (err && err.message) {
    res.json({ message: err.message, stack: err.stack });
  } else {
    res.json({ error: err });
  }
};
const protected = function(msg) {
  return function(req, res, next) {
    if (req.session && req.session.name) {
      next();
    } else {
      res.status(401).json({ msg });
    }
  };
};

// TODO: implement routes
server.use("/users", usersRouter);
server.use("/log-in", loginRouter);

server.get("/restricted/*", protected("log in my dude."), (req, res) => {
  const path = req.path;
  if (path.includes("/restricted")) {
    console.log(req.session);
    res.json({ username: req.session.name, password: req.session.passwordHash });
  } else res.status(404).json({msg: "wrong path my man"});
});

// TODO: add local middleware to this route to ensure the user is logged in

// function checkPass(password) {
//   return function(req, res, next) {
//     if
//   }
// }

server.get("/me", protected("please log in"), (req, res) => {
  // Do NOT modify this route handler in any way.
  res.json(req.user);
});

module.exports = { server };
