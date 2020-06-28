const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const Streamings = require("../models/streaming");

const streamingRouter = express.Router();

streamingRouter.use(bodyParser.json());

streamingRouter
  .route("/")

  // show all the streamings

  .get((req, res, next) => {
    Streamings.find({})
      .then(
        (streamings) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(streamings);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // add a streaming by name and password

  .post((req, res, next) => {
    Streamings.create(req.body)
      .then(
        (streaming) => {
          console.log("Dish Created ", streaming);
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(streaming);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /streamings");
  })

  // delete all streamings

  .delete((req, res, next) => {
    Streamings.remove({})
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

// show streaming by id

streamingRouter
  .route("/:streamingId")
  .get((req, res, next) => {
    Streamings.findById(req.params.streamingId)
      .then(
        (streaming) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(streaming);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // edit streaming by id and body ... i.e. enter the id of the streaming in request url and the data in body ...

  .put((req, res, next) => {
    Streamings.findByIdAndUpdate(
      req.params.streamingId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then(
        (streaming) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(streaming);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })

  // delete streaming by id

  .delete((req, res, next) => {
    Streamings.findByIdAndRemove(req.params.streamingId)
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

module.exports = streamingRouter;
