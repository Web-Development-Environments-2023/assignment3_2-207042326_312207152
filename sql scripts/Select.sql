SELECT * FROM mydb.users;
CREATE TABLE mydb.watched(
  req_id INT,
  user_name VARCHAR(255),
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
    id INT,
    ingredients VARCHAR(255)
  );

DROP TABLE mydb.InstructionRecipes;
CREATE TABLE mydb.InstructionRecipes(
    id INT,
    counter INT,
    instructions VARCHAR(255)
  );

DROP TABLE mydb.FamilyRecipes;

  CREATE TABLE FamilyRecipes(
    username VARCHAR(255),
    recipe_id INT
  )