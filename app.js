const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect("mongodb://localhost:27017l/todolistDB", {useUnifiedTopology: true , useNewUrlParser:true, useFindAndModify: false});


// Home endPoints
app.get("/", function(req, res) {
    res.render("home");
});


//Blog endPoints
app.get("/blog", function(req, res) {
    res.render("blog");
});

app.get("/blog:blogId", function(req, res) {
    res.render("blog");
});


// Recipes endPoints 
app.get("/recipes", function(req, res) {
    res.render("recipes");
});

app.get("/recipes/breakfast", function(req, res) {
    res.render("recipes");
});

app.get("/recipes/lunch", function(req, res) {
    res.render("recipes");
});

app.get("/recipes/dinner", function(req, res) {
    res.render("recipes");
});

app.get("/recipes/desert", function(req, res) {
    res.render("recipes");
});

app.get("/recipes/recipe:recipeId", function(req, res) {
    res.render("recipes");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
