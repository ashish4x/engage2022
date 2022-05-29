//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const basePath = path.join(__dirname, "/public");
console.log(basePath);
const app = express();

app.use(express.static(basePath));

var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post("/", urlencodedParser, function (req, res) {
  res.sendFile(__dirname + "/public/imgcapture.html");
});

app.post("/imgcompare", function (req, res) {
  res.sendFile(__dirname + "/public/imgcompare.html");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000.");
});
