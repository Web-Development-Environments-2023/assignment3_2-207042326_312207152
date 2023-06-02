var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");
router.get("/", (req, res) => res.send("im here"));


/**
 * This path returns a full details of a 3 random recipe
 */
//localhost:3000/recipes/random
router.get("/random", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getThreeRandomRecipes();
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path gets a query and returns few recipies that answere it
 * number - int (5,10,15)
 */
router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.searchQuery;
    const number = parseInt(req.query.number);
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerances = req.query.intolerances;

    if (req.session && req.session.username){
      req.session.last_search = query;
    }

    const recipes = await recipes_utils.getSearchRecipes(query, number, cuisine, diet, intolerances);
    
    if (recipes.length == 0){
      res.send("There is no results!");
      return;
    }

    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of the 3 latest recipes ONLY if the user logged in
 */
//localhost:3000/recipes/watched
router.get("/watched", async (req, res, next) => {
  try {
    let recipes;
    if (req.session && req.session.username){
      recipes = await recipes_utils.getLastThreeRecipes(req.session.username);
    }
    let results = [];
    let i = 0;
    while (recipes && i<recipes.length){
        // console.log(recipes[i].recipe_id);
        results[i] = await recipes_utils.getFullDetailsOfRecipe(recipes[i].recipe_id);
        i++;
    }
    res.send(results);
  } catch (error) {
    next(error);
  }
});

/*
 * This path returns T if the recipes watched by the user
 * http://localhost:3000/recipes/isWatched?recipeId=150000
*/
router.get("/isWatched", async (req, res, next) => {
  try {
    if (req.session.username){
      const recipe = await recipes_utils.recipeWatchedByUser(req.session.username, req.query.recipeId);
      res.send(recipe);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the full details of a recipe by it's id
 * also add recipe to watched table
 * http://localhost:3000/recipes/fullDetailes?recipeid=150000
 */
router.get("/fullDetailes", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getFullDetailsOfRecipe(req.query.recipeid);
    if (req.session && req.session.username){
      recipes_utils.postLastRecipe(req.session.username, recipe.id);
    }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the full details of MY recipe by it's id
 * also add recipe to watched table
 * http://localhost:3000/recipes/myFullDetailes?recipeid=1
 */
 router.get("/myFullDetailes", async (req, res, next) => {
  try {
    console.log("recipe id is: " + req.query.recipeid);
    const recipe = await recipes_utils.getMyFullDetailsOfRecipe(req.query.recipeid);
    if (req.session && req.session.username){
      recipes_utils.postLastRecipe(req.session.username, recipe.id);
    }
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns a full details of a recipe by its id
 */
router.get("/:recipeId", async (req, res, next) => {
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
