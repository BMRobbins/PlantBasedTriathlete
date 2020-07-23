const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const path = require('path');


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

const recipeSchema = {
  title: String,
  img: String,
  path: String,
  ingredients:[String],
  directions:[String],
  catagory:[String],
  video:String
};

const Blog = mongoose.model("Blog", blogSchema);
const Recipe = mongoose.model("Recipe",recipeSchema);



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

app.get("/composeblog", function(req, res){
  res.render("composeblog");
});

app.post("/composeblog", function(req, res){
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
  Recipe.find({}, function(err, recipes) {
    res.render("recipes", {
      recipes: recipes,
      relativePath: "../"
    });
  })
});

app.get("/recipes/breakfast", function(req, res) {
  Recipe.find({catagory:"breakfast"}, function(err, recipes) {
    res.render("recipes", {
      recipes: recipes,
      relativePath: "../"
    });
  })
});

app.get("/recipes/lunch", function(req, res) {
  Recipe.find({catagory:"lunch"}, function(err, recipes) {
    res.render("recipes", {
      recipes: recipes,
      relativePath: "../"
    });
  })
});

app.get("/recipes/dinner", function(req, res) {
  Recipe.find({catagory:"dinner"}, function(err, recipes) {
    res.render("recipes", {
      recipes: recipes,
      relativePath: "../"
    });
  })
});

app.get("/recipes/snackanddesserts", function(req, res) {
  Recipe.find({catagory:"snack"}, function(err, recipes) {
    res.render("recipes", {
      recipes: recipes,
      relativePath: "../"
    });
  })
});

app.get("/recipes/recipe/:recipeId", function(req, res) {
  const recipePath = req.params.recipeId;
  Recipe.findOne({path: recipePath}, function(err, recipe) {
    res.render("recipe", {
      recipe: recipe,
      relativePath: "../../"
    });
  })
});

app.get("/composerecipe", function(req, res){
  res.render("composerecipe");
});

app.post("/composerecipe", function(req, res){
  var ingredients = req.body.postIngredients.toString().split("|");
  var directions = req.body.postDirections.toString().split("|");
  var catagories = req.body.postCatagory.toString().split(",");
  const recipe = new Recipe({
       title: req.body.postTitle,
       img: req.body.postImg,
       path: req.body.postPath,
       ingredients: ingredients,
       directions: directions,
       catagory: catagories,
       video: req.body.postVideo
  });
  recipe.save(function(err){
     if(!err) {
         res.redirect("/");
     }
   });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
