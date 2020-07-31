const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const saltRounds = 15;
const multer = require('multer');
const uploadBlog = multer({dest: __dirname + '/public/imgs/blog'});
const uploadRecipe = multer({dest: __dirname + '/public/imgs/recipe'});

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

const userSchema = {
  username: String,
  password: String
}

const Blog = mongoose.model("Blog", blogSchema);
const Recipe = mongoose.model("Recipe",recipeSchema);
const User = mongoose.model("User", userSchema);



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
  }).sort({date: -1});
});

app.post("/composeblog", uploadBlog.single('postImg'), function(req, res){
  const blog = new Blog({
      title: req.body.postTitle,
      date: Date.now(),
      content: req.body.postBody,
      img: req.file.filename
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

app.get("/recipes/recipe", function(req, res) {
  res.redirect("/recipes");
});

app.get("/recipes/recipe/:recipeId", function(req, res) {
  const recipePath = req.params.recipeId;
  Recipe.findOne({path: recipePath}, function(err, recipe) {
    if(err || recipe === null || recipe.title === null || recipe.img === null || recipe.ingredients === null || recipe.directions === null) {
      res.redirect("/recipes");
    } else {
      res.render("recipe", {
        recipe: recipe,
        relativePath: "../../"
      });
    }
  })
});

app.post("/composerecipe", uploadRecipe.single('postImg'), function(req, res){
  var ingredients = req.body.postIngredients.toString().split("|");
  var directions = req.body.postDirections.toString().split("|");
  var catagories = req.body.postCatagory.toString().split(",");
  const recipe = new Recipe({
       title: req.body.postTitle,
       img: req.file.filename,
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

// User Portal Endpoints
app.get("/createuser", function(req, res) {
  res.render('createuser', {relativePath: ""});
});

app.post("/createuser", function(req, res) {
  const hashPassword = bcrypt.hashSync(req.body.password, saltRounds)
  const user = new User({
      username: req.body.username,
      password: hashPassword
  });
  user.save(function(err){
      if(!err) {
          res.redirect("/composelogin");
      }
    });
});

app.get("/composelogin", function(req, res) {
  res.render("composelogin", {relativePath: ""});
});

app.post("/composelogin", function(req, res) {
  User.findOne({username: req.body.username}, function(err, user) {
      bcrypt.compare(req.body.password, user.password, function(err, result) {
        console.log(result);
        if(result) {
          if(req.body.compose === "composerecipe") {
            res.render("composerecipe");
          } else {
            res.render("composeblog");
          }
        } else {
          res.redirect("/composelogin");
        }
      })
  })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
