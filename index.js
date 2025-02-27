require("dotenv").config();
const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.model");
const express = require("express");
const app = express();

app.use(express.json());
initializeDatabase();

// function to create new recipe into database
async function createNewRecipe(recipe) {
  try {
    const newRecipe = new Recipe(recipe);
    const savedRecipe = await newRecipe.save();
    return savedRecipe;
  } catch (error) {
    console.log(error);
  }
}
// api route to create new recipe
app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createNewRecipe(req.body);
    if (savedRecipe) {
      res.status(200).json({
        message: "Recipe saved successfully into the database.",
        recipe: savedRecipe,
      });
    } else {
      res.status(400).json({ error: "Failed to save recipe." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to read all recipes from database
async function readAllRecipes() {
  try {
    const recipes = await Recipe.find();
    return recipes;
  } catch (error) {
    console.log(error);
  }
}
// api to get all recipes from database
app.get("/recipes", async (req, res) => {
  try {
    const recipes = await readAllRecipes();
    if (recipes.length != 0) {
      res.status(200).json({ recipes });
    } else {
      res.status(404).json({ error: "No recipes found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to get a recipe's details by its title.
async function readRecipeByTitle(recipeTitle) {
  try {
    const recipeByTitle = await Recipe.findOne({ title: recipeTitle });
    return recipeByTitle;
  } catch (error) {
    console.log(error);
  }
}
// api to get a recipe's details by its title.
app.get("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const recipeByTitle = await readRecipeByTitle(req.params.recipeTitle);
    if (recipeByTitle) {
      res
        .status(200)
        .json({ message: "Recipe found successfully.", recipe: recipeByTitle });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to get details of all the recipes by an author.
async function readAllRecipesByAuthor(recipeAuthor) {
  try {
    const recipesByAuthor = await Recipe.find({ author: recipeAuthor });
    return recipesByAuthor;
  } catch (error) {
    console.log(error);
  }
}
// api to get details of all the recipes by an author
app.get("/recipes/author/:recipeAuthor", async (req, res) => {
  try {
    const recipesByAuthor = await readAllRecipesByAuthor(
      req.params.recipeAuthor
    );
    if (recipesByAuthor.length != 0) {
      res
        .status(200)
        .json({ message: "Recipes found succesfully.", recipesByAuthor });
    } else {
      res.status(404).json({ error: "No recipes found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to get all the recipes that are of "Easy" difficulty level.
async function recipesByDifficultyLevel(difficultyLevel) {
  try {
    const recipes = await Recipe.find({ difficulty: difficultyLevel });
    return recipes;
  } catch (error) {
    console.log(error);
  }
}
// api to get all the recipes that are of "Easy" difficulty level.
app.get("/recipes/difficulty/:difficultyLevel", async (req, res) => {
  try {
    const recipes = await recipesByDifficultyLevel(req.params.difficultyLevel);
    if (recipes.length != 0) {
      res
        .status(200)
        .json({ message: "Recipes found succesfully.", recipes: recipes });
    } else {
      res.status(404).json({ error: "No recipe found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to update a recipe's difficulty level with the help of its id.
async function updateDifficultyLevel(recipeId, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      recipeId,
      dataToUpdate,
      { new: true }
    );
    return updatedRecipe;
  } catch (error) {
    console.log(error);
  }
}
// api to update a recipe's difficulty level with the help of its id.
app.post("/recipes/:recipeId", async (req, res) => {
  try {
    const updatedRecipe = await updateDifficultyLevel(
      req.params.recipeId,
      req.body
    );
    if (updatedRecipe) {
      res
        .status(200)
        .json({ message: "Recipe updated succesfully", updatedRecipe });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to update a recipe's prep time and cook time with the help of its title
async function updatePrepTimeAndCookTime(recipeTitle, dataToUpdate) {
  try {
    const updatedRecipe = await Recipe.findOneAndUpdate(
      { title: recipeTitle },
      dataToUpdate,
      { new: true }
    );
    return updatedRecipe;
  } catch (error) {
    console.log(error);
  }
}
app.post("/recipes/title/:recipeTitle", async (req, res) => {
  try {
    const updatedRecipe = await updatePrepTimeAndCookTime(
      req.params.recipeTitle,
      req.body
    );
    if (updatedRecipe) {
      res
        .status(200)
        .json({ message: "Recipe updated succesfully.", updatedRecipe });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// function to delete a recipe with the help of a recipe id
async function deleteRecipeById(recipeId) {
  try {
    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    return deletedRecipe;
  } catch (error) {
    console.log(error);
  }
}
// api to delete a recipe with the help of a recipe id
app.delete("/recipes/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipeById(req.params.recipeId);
    if (deletedRecipe) {
      res.status(200).json({ message: "Recipe deleted successfully." });
    } else {
      res.status(404).json({ error: "Recipe not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// code to run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
