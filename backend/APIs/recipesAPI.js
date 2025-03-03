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
  
      // Normalize the title extracted from the URL and convert to lowercase
      const normalizedDecodedTitle = decodedTitle
        .toLowerCase()
        .replace(/[^a-z\s]/g, " ") // Keep only letters and spaces, converting other characters to space
        .replace(/\s+/g, " ")       // Replace multiple spaces with single space
        .trim(); // Remove all spaces
  
  
    //   console.log("🔍 Searching for Recipe by Title:", normalizedDecodedTitle);
  
      //Search db with regex search since a match in name still means we want to query.
          const recipe = await recipesCollection.findOne({
              title: { $regex: new RegExp(`^${normalizedDecodedTitle.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}$`, 'i') }
          });
  
      if (!recipe) {
        // console.log("Recipe not found for title:", normalizedDecodedTitle);
        return res.status(404).send({ message: "Recipe not found" });
      }
  
    //   console.log("Recipe found:", recipe.title, "for query", normalizedDecodedTitle);
      res.send({ message: "Recipe found", payload: recipe });
  
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).send({ message: "Error fetching recipe", error });
    }
  });
module.exports = recipesApp;
