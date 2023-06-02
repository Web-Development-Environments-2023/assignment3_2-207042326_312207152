
DROP TABLE mydb.users;
CREATE TABLE mydb.users(
  username VARCHAR(255),
  password VARCHAR(255),
  firstname VARCHAR(255),
  lastname VARCHAR(255),
  country VARCHAR(255),
  email VARCHAR(255),
  profilePic VARCHAR(255)
  );
DROP TABLE mydb.watched;
CREATE TABLE mydb.watched(
  recipe_id INT,
  username VARCHAR(255),
  date DATE
  );

DROP TABLE mydb.FavoriteRecipes;
CREATE TABLE mydb.FavoriteRecipes(
  username VARCHAR(255),
  recipe_id INT
  );

DROP TABLE mydb.RegularRecipes;
CREATE TABLE mydb.RegularRecipes(
    id INT,
    imageUrl VARCHAR(255),
    title VARCHAR(255),
    readyInMinutes VARCHAR(255),
    popularity VARCHAR(255),
    vegan BOOLEAN,
    vegetarian BOOLEAN,
    gluten_free BOOLEAN,
    servings INT,
    username VARCHAR(255)
  );

DROP TABLE mydb.IngredientsRecipes;
CREATE TABLE mydb.IngredientsRecipes(
    counter_recipe INT,
    ingredient VARCHAR(255)
  );

DROP TABLE mydb.InstructionRecipes;
CREATE TABLE mydb.InstructionRecipes(
    counter_recipe INT,
    counter_instruction INT,
    instruction VARCHAR(255)
  );


DROP TABLE mydb.FamilyRecipes;
CREATE TABLE mydb.FamilyRecipes(
    username VARCHAR(255),
    recipe_id INT
  );

DELETE FROM mydb.instructionrecipes;
DELETE FROM mydb.ingredientsrecipes;
DELETE FROM mydb.regularrecipes;
