const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const airecipesApp = express.Router();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


airecipesApp.post("/generate-recipe", async (req, res) => {
  try {
    const ingredients = req.body.ingredients;

    if (!ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: "No ingredients provided." });
    }

    
    const modelName = "gemini-1.5-pro-latest";
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig: {temperature: 0.3, topP: 0.8} }); 
    const prompt = `Given these ingredients: ${ingredients.join(", ")}, suggest a recipe.
    - IMPORTANT: The recipe MUST primarily use the ingredients provided. Minimize the use of entirely new ingredients. If a new ingredient is absolutely necessary, clearly indicate it as 'New Ingredient:' followed by the ingredient name and its purpose in the recipe.
    - Provide the recipe name.
    - Include a brief description of the recipe.
    - List the ingredients, including quantities if possible.  Clearly mark any 'New Ingredient:' with its quantity.
    - Provide step-by-step instructions.
    - IMPORTANT: Provide real, valid, and safe cooking instructions.  Do not suggest dangerous or impossible cooking methods or ingredient combinations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ recipe: text });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate recipe.", details: error.message });
  }
});

// scale recipes

// translate and Audio

// suggest alternate ingredients

// image to recipe 

// ingredients image to recipe



module.exports = airecipesApp;