const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017l/PlantBasedTriathlete", {useUnifiedTopology: true , useNewUrlParser:true, useFindAndModify: false});

const blogSchema = {
  title: String,
  date: Date,
  content: String,
  img: String
};

const Blog = mongoose.model("Blog", blogSchema);

// Home endPoints
app.get("/", function(req, res) {
    res.render("home");
});


//Blog endPoints
app.get("/blog", function(req, res) {
  Blog.find({}, function(err, blogs) {
    res.render("blog", {
      blogs: blogs
    });
  }).sort({date: 1});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const blog = new Blog({
      title: req.body.postTitle,
      date: Date.now(),
      content: req.body.postBody,
      img: req.body.postImg
  });
  blog.save(function(err){
    if(!err) {
        res.redirect("/");
    }
  });
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
