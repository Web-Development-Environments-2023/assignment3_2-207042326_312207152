var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM users").then((users) => {
      if (users.find((x) => x.username === req.session.username)) {
        req.username = req.session.username;
        next();
      }
    }).catch(err => next(err));
  } else {
    res.sendStatus(401);
  }
});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user
 */
router.post('/favorites', async (req,res,next) => {
  try{
    const user_id = req.session.username;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite");
    } catch(error){
    next(error);
  }
})

/**
 * This path returns the favorites recipes that were saved by the logged-in user
 */
router.get('/favorites', async (req,res,next) => {
  try{
    const username = req.session.username;
    let favorite_recipes = {};
    const recipes_id = await user_utils.getFavoriteRecipes(username);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getPreviewRecipes(recipes_id_array);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

router.post('/myRecipes', async(req, res, next) =>{
  try{
    //Regular recipes
    const imageUrl = req.body.image;
    const title = req.body.title;
    const readyInMinutes = req.body.readyInMinutes;
    const popularity = req.body.popularity;
    const vegan = req.body.vegan;
    const vegetarian = req.body.vegetarian;
    const gluten_free = req.body.gluten_free;
    const ingredients = req.body.ingrediants;
    const instructions = req.body.instructions;
    const servings = req.body.servings;
    const username = req.session.username;

    console.log(req.body.ingrediants);
    console.log(ingredients);
    console.log(req.body.instructions);
    console.log(instructions);
  
    //Create the recipe
    await user_utils.createRecipes(imageUrl, title, readyInMinutes, popularity, vegan, vegetarian, gluten_free, ingredients, instructions, servings, username);
    res.status(200).send("Created successfully");

  } catch(error){
    next(error);
  }
});

router.get('/isAFavorites', async (req, res, next)=>{
  try{
    const result = await user_utils.isFavoriteRecipe(req.session.username, req.query.recipeId);
    res.status(200).send(result);
  } catch(error){
    next(error);
  }
});

/**
 * This path returns the recipes that were created by the logged-in user
 */
router.get('/myRecipes', async (req,res,next) => {
  try{
    // Gets the preview of all the recipes that were saved for that user
    console.log("in get/myRecipes, the user_name is: " + req.session.username);
    const results = await user_utils.getMyRecipes(req.session.username);
    res.status(200).send(results);
  } catch(error){
    next(error); 
  }
});

/**
 * This path returns the saved family recipes of the logged-in user
 */
router.get('/myFamilyRecipies', async (req,res,next) => {
  try {
    const user_name = req.session.username;
    const recipes_id = await user_utils.getMyFamilyRecipes(user_name);

    let arrRecipesIds = [];
    //arr of recipes ids
    recipes_id.map((element) => arrRecipesIds.push(element.recipe_id)); 

    const res = await recipes_utils.getPreviewRecipes(arrRecipesIds);
    res.status(200).send(res);
  } catch(err){
    next(err); 
  }
});

module.exports = router;
