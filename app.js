const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017l/todolistDB", {useUnifiedTopology: true , useNewUrlParser:true, useFindAndModify: false});

app.get("/", function(req, res) {
    res.render("home");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
