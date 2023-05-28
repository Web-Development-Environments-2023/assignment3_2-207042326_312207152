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
 * This path gets a query and returns few recipies which are ansewring it
 * number - int (5,10,15)
 */
router.get("/search", async (req, res, next) => {
  try {
    const query = req.query.searchQuery;
    const number = parseInt(req.query.number);
    const cuisine = req.query.cuisine;
    const diet = req.query.diet;
    const intolerances = req.query.intolerances;

    //Maybe Not Needed!!!!!!!!!!!
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
 * This path returns a full details of the 3 latest recipes
 */
//localhost:3000/recipes/170000
router.get("/watched", async (req, res, next) => {
  try {
    const recipes = await recipes_utils.getLastThreeRecipes(req.session.username);
    console.log(recipes);
    let results = [];
    for (let i = 0; i < recipes.length; i++){
      console.log(recipes[i].rec_id);
      results[i] = await recipes_utils.getFullDetailsOfRecipe(recipes[i].rec_id);
    }
    res.send(results);
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns T if the recipes watched by the user
 */
//localhost:3000/recipes/170000
router.get("/isWatched", async (req, res, next) => {
  try {
    if (req.session.username){
      const recipe = await recipes_utils.recipeWachedByUser(req.session.username, req.query.recipeId);
      res.send(recipe);
    }
  } catch (error) {
    next(error);
  }
});

/**
 * This path returns the full details of a recipe by it's id
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
 * This path returns the full details of my recipe by it's id
 */
 router.get("/myFullDetailes", async (req, res, next) => {
  try {
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
