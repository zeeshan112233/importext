const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var passport = require("passport");
var authenticate = require("../authenticate");

const Users = require("../models/users");

const userRouter = express.Router();

userRouter.use(bodyParser.json());

///////////////////////////////////////////////// file reading code starts
const DIR = "./public/";

var path = require("path");
var fs = require("fs");
var multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIR);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

var upload = multer({ storage: storage });

userRouter.post("/signup", upload.single("profilephoto"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  console.log(url);
  // var profilephoto = fs.readFileSync(req.file.path);
  // console.log(profilephoto);
  Users.register(
    new Users({
      username: req.body.username,
      //  profilephoto: profilephoto
      // profilephoto: req.file.path,
      profilephoto: url + "/public/" + req.file.filename,
    }),
    req.body.password,
    (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.json({ err: err });
      } else {
        passport.authenticate("local")(req, res, () => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json({ success: true, status: "Registration Successful!" });
        });
      }
    }
  );
});

// thsi login method will authenticate the username and password using local strategy of passport and create a new jwt token

userRouter.post("/login", passport.authenticate("local"), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.json({
    success: true,
    token: token,
    status: "You are successfully logged in!",
  });
});
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
