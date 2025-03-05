const express = require('express');

let recipesApp = express.Router();

// Add JSON parser middleware
recipesApp.use(express.json());

// Fetch all recipes
recipesApp.get('/recipes', async (req, res) => {
    try {
        const recipesCollection = req.app.get('recipesCollection');
        let recipes = await recipesCollection.find({}).toArray();
        res.send({ message: "Here you gooo", payload: recipes });
    } catch (error) {
        res.status(500).send({ message: "Error fetching recipes", error });
    }
});

// fetch recipe by title
recipesApp.get('/recipe/:title', async (req, res) => {
  try {
      const recipesCollection = req.app.get('recipesCollection');
      const recipeTitle = req.params.title;
      const decodedTitle = decodeURIComponent(recipeTitle);

      // Normalize input title
      const normalizeTitle = (title) =>
          title
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") // Remove accents
              .toLowerCase()
              .replace(/[^a-z0-9\s]/g, " ") // Keep only letters, numbers, spaces
              .replace(/\s+/g, " ") // Replace multiple spaces with one
              .trim(); // Trim spaces

      const normalizedDecodedTitle = normalizeTitle(decodedTitle);
      // console.log("🔍 Searching for Recipe by Normalized Title:", normalizedDecodedTitle);

      // Fetch all recipes (only title field to optimize performance)
      const allRecipes = await recipesCollection.find({}, { projection: { title: 1 } }).toArray();

      // Find a match by normalizing database titles dynamically
      const matchingRecipe = allRecipes.find(recipe => 
          normalizeTitle(recipe.title) === normalizedDecodedTitle
      );

      if (!matchingRecipe) {
          // console.log("❌ Recipe not found for title:", normalizedDecodedTitle);
          return res.status(404).send({ message: "Recipe not found" });
      }

      // Fetch full recipe details now that we found a match
      const fullRecipe = await recipesCollection.findOne({ _id: matchingRecipe._id });

      // console.log("✅ Recipe found:", fullRecipe.title, "for query", normalizedDecodedTitle);
      res.send({ message: "Recipe found", payload: fullRecipe });

  } catch (error) {
      console.error("❌ Error fetching recipe:", error);
      res.status(500).send({ message: "Error fetching recipe", error });
  }
});


module.exports = recipesApp;
