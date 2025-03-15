const express = require('express');
const { ObjectId } = require("mongodb");

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

// fetch saved recipes
recipesApp.get("/saved-recipes/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const usersCollection = req.app.get('usersCollection');

        // Find the user
        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Return the saved recipes from the user object
        res.status(200).json({ success: true, payload: user.recipes || [] });
    } catch (error) {
        console.error("Error fetching saved recipes:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


// save a recipe
recipesApp.post("/save-recipe", async (req, res) => {
    try {
        console.log("Incoming save request:", req.body); // Log incoming request
        
        const { userId, recipeId } = req.body;
        const usersCollection = req.app.get('usersCollection');

        if (!userId || !recipeId) {
            return res.status(400).json({ error: "userId and recipeId are required" });
        }

        const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        await usersCollection.updateOne(
            { _id: new ObjectId(userId) },
            { $addToSet: { savedRecipes: new ObjectId(recipeId) } } // Ensures no duplicates
        );

        res.json({ message: "Recipe saved successfully" });
    } catch (error) {
        console.error("Error saving recipe:", error);
        res.status(500).json({ error: "Failed to save recipe", details: error.message });
    }
});
// fetch recipes by category
// Fetch recipes by category (case-insensitive, partial match)
recipesApp.get("/recipes/category/:category", async (req, res) => {
    try {
        const recipesCollection = req.app.get("recipesCollection");
        const category = req.params.category.trim();
        // console.log("Fetching recipes for category:", category);

        // Query to match category as a part of mealType (case-insensitive)
        const recipes = await recipesCollection.find({
            mealType: { $regex: new RegExp(`\\b${category}\\b`, "i") }
        }).toArray();

        if (recipes.length === 0) {
            // console.log("No recipes found for category:", category);
            return res.status(404).json({ message: "No recipes found for this category." });
        }

        res.status(200).json({ payload: recipes });
    } catch (error) {
        // console.error("Error fetching recipes by category:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



module.exports = recipesApp;
