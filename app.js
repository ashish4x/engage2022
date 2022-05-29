//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("ejs");

var urlencodedParser = bodyParser.urlencoded({ extended: false });
const app = express();

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", urlencodedParser, function (req, res) {
  var fullName = req.body.fName;
  console.log(fullName);
  res.sendFile(__dirname + "/imgcapture.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000.");
});
