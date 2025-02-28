const exp = require("express");
const airecipesApp = exp.Router();
const expressAsyncHandler = require("express-async-handler");
const { ObjectId } = require("mongodb");

airecipesApp.use(exp.json());

// Save AI recipe in aiRecipesCollection
airecipesApp.post(
  "/save-ai-recipe",
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId, title, ingredients, instructions } = req.body;
      if (!userId || !title || !ingredients || !instructions)
        return res.status(400).json({ error: "Missing recipe data" });

      const aiRecipesCollection = req.app.get("aiRecipesCollection");

      // Convert userId to ObjectId
      const newRecipe = {
        userId: new ObjectId(userId),
        title,
        ingredients,
        instructions,
        createdAt: new Date(),
      };

      await aiRecipesCollection.insertOne(newRecipe);

      res.json({ message: "Recipe saved successfully!" });
    } catch (error) {
      console.error("Error saving AI-generated recipe:", error);
      res.status(500).json({ error: "Error saving AI-generated recipe" });
    }
  })
);

// Fetch AI-generated recipes for a user
airecipesApp.get(
  "/user-ai-recipes/:userId",
  expressAsyncHandler(async (req, res) => {
    try {
      const { userId } = req.params;
      const aiRecipesCollection = req.app.get("aiRecipesCollection");

      // Convert userId to ObjectId when querying
      const recipes = await aiRecipesCollection
        .find({ userId: new ObjectId(userId) })
        .toArray();

      res.json({ recipes });
    } catch (error) {
      console.error("Error fetching AI-generated recipes:", error);
      res.status(500).json({ error: "Error fetching AI-generated recipes" });
    }
  })
);

module.exports = airecipesApp;
