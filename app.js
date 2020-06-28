var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

//// db connectivity ;;;;;;;;;;;;;;;;l

const url = "mongodb://localhost:27017/";
const dbname = "importext";

MongoClient.connect(url, (err, client) => {
  assert.equal(err, null);

  console.log("Connected correctly to server");

  const db = client.db(dbname);
  const collection = db.collection("users");
  collection.insertOne(
    { name: "xxx", pass: "test" },

    (err, result) => {
      assert.equal(err, null);

      console.log("After Insert:\n");
      console.log(result.ops);

      collection.find({}).toArray((err, docs) => {
        assert.equal(err, null);

        console.log("Found:\n");
        console.log(docs);

        client.close();
      });
    }
  );
});
/////////-------------------------------db connect end
app.use("/", indexRouter);
app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
