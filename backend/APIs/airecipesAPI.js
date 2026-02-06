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

    
    const modelName = "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName, generationConfig: {temperature: 0.3, topP: 0.8} }); 
    const prompt = `Given these ingredients: ${ingredients.join(", ")}, suggest a recipe.
    - IMPORTANT: The recipe MUST primarily use the ingredients provided. Minimize the use of entirely new ingredients. If a new ingredient is absolutely necessary, clearly indicate it as 'New Ingredient:' followed by the ingredient name and its purpose in the recipe.
    - Provide the recipe name.
    - Include a brief description of the recipe.
    - List the ingredients with no additional characters, including quantities if possible.  Clearly mark any 'New Ingredient:' with its quantity.
    - Provide step-by-step instructions.
    - IMPORTANT: Provide real, valid, and safe cooking instructions.  Do not suggest dangerous or impossible cooking methods or ingredient combinations.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let recipeText = response.text();

    // Basic cleaning to remove ** and leading/trailing whitespace
    recipeText = recipeText.replace(/\*\*/g, "");  // Remove **
    recipeText = recipeText.trim();  // Trim leading/trailing whitespace

    res.json({ recipe: recipeText });
    // console.log(recipeText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate recipe.", details: error.message });
  }
});


airecipesApp.post('/save-recipe', async (req, res) => {
  try {
    const { username, title, ingredients, instructions, description } = req.body;

    // Validate request body
    if (!username || !title || !Array.isArray(ingredients) || !Array.isArray(instructions)) {
      return res.status(400).json({ error: 'Missing or invalid required fields.' });
    }

    const AIcollection = req.app.get('aiRecipesCollection');
    const usersCollection = req.app.get('usersCollection');

    // Ensure the user exists in the database
    const userExists = await usersCollection.findOne({ username: username });
    if (!userExists) {
      return res.status(404).json({ error: 'User not found.' });
    }

    // Create a new recipe document
    const newRecipe = {
      username, 
      title,
      ingredients,
      instructions,
      description: description || "", 
      createdAt: new Date(),
    };

    // Insert the new recipe document
    const result = await AIcollection.insertOne(newRecipe);

    if (result.insertedId) {
      res.status(201).json({ message: 'Recipe saved successfully!', recipe: newRecipe });
    } else {
      res.status(500).json({ error: 'Failed to save recipe.' });
    }

  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ error: 'Internal Server Error.', details: error.message });
  }
});

// translate and Audio

// suggest alternate ingredients
airecipesApp.post("/get-ingredient-alternatives", async (req, res) => {
  try {
    const { recipe, ingredients } = req.body;

    if (!recipe || !ingredients || ingredients.length === 0) {
      return res.status(400).json({ error: "Recipe and ingredients are required." });
    }

    const prompt = `
      Given this recipe:
      Recipe Title: ${recipe.title}
      Ingredients: ${recipe.ingredients.map(i => `${i.amount} ${i.unit} ${i.name}`).join("\n")}
      Steps: ${recipe.steps.join("\n")}

      Suggest a logical alternative ingredient for each of these selected ingredients: ${ingredients.join(", ")}.
      Provide the alternatives in the following JSON format (without any extra text or code formatting):
      {
        "ingredient1": "alternative1",
        "ingredient2": "alternative2",
        ...
      }
    `;

    const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let alternativesText = response.text(); // Changed to let for modification

    // Remove Markdown code fences (if present)
    alternativesText = alternativesText.replace(/```json\n/g, "");
    alternativesText = alternativesText.replace(/```/g, "");

    try {
      const alternatives = JSON.parse(alternativesText);
      res.json({ alternatives });
    } catch (error) {
      console.error("Error parsing AI response:", error);
      res.status(500).json({ error: "Failed to parse AI response.", details: error.message });
    }

  } catch (error) {
    console.error("Error fetching ingredient alternatives:", error);
    res.status(500).json({ error: "Failed to get ingredient alternatives.", details: error.message });
  }
});

// image to recipe 

// ingredients image to recipe
airecipesApp.post("/generate-recipe-from-image", async (req, res) => {
  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "No image provided." });
    }
    const prompt = `Given the image, identify the ingredients and suggest a recipe. 
    -The recipe MUST primarily use the ingredients provided.
    -Minimize the use of entirely new ingredients.
    -If a new ingredient is absolutely necessary, clearly indicate it as 'New Ingredient:' followed by the ingredient name and its purpose in the recipe.
    -Provide the recipe name.
    -Provide a brief description.
    -List the ingredients with quantities if possible.  Clearly mark any 'New Ingredient:' with its quantity. Do not display extra characers.
    -Provide concise step-by-step instructions. Instructions MUST NOT be repeated.
    -The cooking instructions MUST be real, valid, and safe. Do not suggest dangerous or impossible cooking methods or ingredient combinations.
`;

    
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const parts = [
      {text: prompt},
      {
        inlineData: {
          data: image.split(',')[1],
          mimeType: "image/jpeg"
        },
      },
    ];
     const result = await model.generateContent({
          contents: [{ role: "user", parts: parts }],
        });
    const response = await result.response;
    let text = response.text();

     // Basic cleaning to remove ** and leading/trailing whitespace
     text = text.replace(/\*\*/g, "");  // Remove **
     text = text.trim();  // Trim leading/trailing whitespace
    // console.log(text);
    res.json({ recipe: text });
   
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate recipe.", details: error.message });
  }
});

// fetch the saved ai_recipes
airecipesApp.get("/ai-recipes/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const AIcollection = req.app.get("aiRecipesCollection");

    const recipes = await AIcollection.find({ username }).toArray();

    if (!recipes.length) {
      return res.status(404).json({ error: "No AI-generated recipes found." });
    }

    res.json({ payload: recipes });
  } catch (error) {
    console.error("Error fetching AI recipes:", error);
    res.status(500).json({ error: "Failed to fetch AI recipes." });
  }
});


module.exports = airecipesApp;
