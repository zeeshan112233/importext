const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Users = require("../models/users");

const userRouter = express.Router();

userRouter.use(bodyParser.json());

userRouter
  .route("/")

  // show all the users

  .get((req, res, next) => {
    Users.find({})
      .then(
        (users) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(users);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // add a user by name and password

  .post((req, res, next) => {
    Users.create(req.body)
      .then(
        (user) => {
          console.log("Dish Created ", user);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /users");
  })

  // delete all users

  .delete((req, res, next) => {
    Users.remove({})
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

//// by id operations carried here

// show user by id

userRouter
  .route("/:userId")
  .get((req, res, next) => {
    Users.findById(req.params.userId)
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // edit user by id and body ... i.e. enter the id of the user in request url and the data in body ...

  .put((req, res, next) => {
    Users.findByIdAndUpdate(
      req.params.userId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (user) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(user);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // delete user by id

  .delete((req, res, next) => {
    Users.findByIdAndRemove(req.params.userId)
      .then(
        (resp) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(resp);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  });

module.exports = userRouter;
