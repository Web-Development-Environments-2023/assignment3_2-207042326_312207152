const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id){
    await DButils.execQuery(`insert into FavoriteRecipes values ('${user_id}',${recipe_id})`);
}

async function getFavoriteRecipes(user_id){
    const recipes_id = await DButils.execQuery(`select recipe_id from FavoriteRecipes where username='${user_id}'`);
    return recipes_id;
}

/*
 * This func create a new recipe by the logged-in user
*/
async function createRecipes(imageUrl, title, readyInMinutes, popularity, vegan, vegetarian, gluten_free, ingredients, instructions, servings, user_name){
    let id = await DButils.execQuery(`SELECT COUNT(*) as number FROM mydb.RegularRecipes`);
    id = id[0].number + 1;
    
    await DButils.execQuery(`insert into mydb.RegularRecipes values (${id},'${imageUrl}', '${title}', ${readyInMinutes}, ${popularity}, ${vegan}, ${vegetarian}, ${gluten_free}, ${servings}, '${user_name}')`);
    
    console.log(ingredients);
    
    for (let i = 0; i < ingredients.length; i++){
        await DButils.execQuery(`insert into mydb.ingredientsrecipes values (${id}, '${ingredients[i]}')`);
    }
    
    for (let i = 0; i < instructions.length; i++){
        
        await DButils.execQuery(`insert into mydb.instructionrecipes values (${id}, ${i + 1}, '${instructions[i]}')`);
    }
}

/*
 * This func return the true if the recipe (recipe_id) ia a favorite recipe for user_name and false if not
*/
async function isFavoriteRecipe(user_name, recipe_id){
    const count_favorites = await DButils.execQuery(`SELECT count(*) AS amount FROM FavoriteRecipes WHERE username='${user_name}' AND recipe_id='${recipe_id}'`);
    if (count_favorites[0].amount >= 1)
        return true;
    else
        return false;
}

/*
 * This func returns the all recipes of a logged-in user
*/
async function getMyRecipes(user_name){
    let res = [];
    let recipes_info = await DButils.execQuery(`SELECT * FROM mydb.RegularRecipes where username='${user_name}'`);

    if (recipes_info == []){
        return res;
    }
    
    for (let recipe of recipes_info){

        let recipe_dict = {
            id: recipe['id'],
            title: recipe['title'],
            image: recipe['imageUrl'],
            aggregateLikes: recipe['popularity'],
            vegan: recipe['vegan'],
            vegetarian: recipe['vegetarian'],
            gluten_free: recipe['glutenFree'],
            readyInMinutes: recipe['readyInMinutes'],
        }

        res.push(recipe_dict);
    }
    return res;
}


/*
 * returns the all recipes ids of my family recipes
*/
async function getMyFamilyRecipes(user_name){
    try {
        const recipesIds = await DButils.execQuery(`SELECT * from FamilyRecipes where username='${user_name}'`);
        return recipesIds;
    }
    catch(err){
        throw { status: 400, message: "Your family does not have even a single recipe!" };
    }

}

// /*
//  * This func returns if this recipe was watched by a specific user
// */
// async function isWatched(recipe_id, user_name){
//     const count = await DButils.execQuery(`SELECT COUNT(*) FROM watched WHERE (rec_id=${recipe_id}, username='${user_name})`);

//     if (count == 0)
//         return False;
//     else
//         return True;
// }

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.createRecipes = createRecipes;
// exports.isWatched = isWatched;
exports.isFavoriteRecipe = isFavoriteRecipe;
exports.getMyRecipes = getMyRecipes;
exports.getMyFamilyRecipes = getMyFamilyRecipes;

