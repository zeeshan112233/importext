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

//// db connectivity ;;;;;;;;;;;;;;;;l

const mongoose = require("mongoose");

const Dishes = require("./models/dishes");

const url = "mongodb://localhost:27017/importext";
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log("Connected correctly to server");

  var newDish = Dishes({
    name: "Uthappizza",
    description: "test",
  });

  newDish
    .save()
    .then((dish) => {
      console.log(dish);

      return Dishes.find({});
    })
    .then((dishes) => {
      console.log(dishes);

      return Dishes.remove({});
    })
    .then(() => {
      return mongoose.connection.close();
    })
    .catch((err) => {
      console.log(err);
    });
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
