
var express = require('express');
var app = express();
const mongoose = require("mongoose");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth");

//DB Connection
mongoose
  .connect("mongodb://localhost:27017/db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

  app.use("/", authRoutes);

//Middlewares

// set the view engine to ejs
app.set('view engine', 'ejs');

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

// about page
app.get('/dashboard', function(req, res) {
  res.render('pages/dashboard');
});
app.get('/register', function(req, res) {
  res.render('pages/register');
});


app.listen(8080);
console.log('Server is listening on port 8080');
