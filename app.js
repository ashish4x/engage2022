//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

var urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/imgcapture", function (req, res) {});

app.post("/", urlencodedParser, function (req, res) {
  var fullName = req.body.fName;

  res.sendFile(__dirname + "/imgcapture.html");
  //   res.sendFile(__dirname + "/imgcapture.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000.");
});
