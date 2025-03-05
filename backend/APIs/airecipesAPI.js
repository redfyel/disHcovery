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


// scale recipes
airecipesApp.post("/scale-recipe", async (req, res) => {
  try {
    const { recipe, scaleFactor } = req.body;

    if (!recipe || !scaleFactor) {
      return res.status(400).json({ error: "Recipe and scale factor are required." });
    }

    const scaledIngredients = scaleIngredients(recipe.ingredients, scaleFactor);

    // Determine servings number, before scaling
    let servings = recipe.servings;
    const parsedServings = parseServings(servings);

    // if parsedServings is an object, average the servings and use as one number
    if (typeof parsedServings === "object") {
      servings = (parsedServings.min + parsedServings.max) / 2;
    }

    // scale servings and truncate to two decimal places.
    const scaledServings = (servings * scaleFactor).toFixed(2);
    const scaledRecipe = {
      ...recipe,
      ingredients: scaledIngredients,
      servings: scaledServings
    };

    res.json({ scaledRecipe: scaledRecipe });

  } catch (error) {
    console.error("Error scaling recipe:", error);
    res.status(500).json({ error: "Failed to scale recipe.", details: error.message });
  }
});

function scaleIngredients(ingredients, scaleFactor) {
  return ingredients.map((ingredient) => {
    // Combine amount and unit and attempt to parse the amount
    const amountString = `${ingredient.amount} ${ingredient.unit}`.trim(); // "1 ½" cups

    //Convert Fraction to Decimal
    const parsedAmount = convertFractionToDecimal(amountString);


    if (isNaN(parsedAmount)) {
      // If parsing fails, return the original ingredient with a warning or handle appropriately
      console.warn(`Could not parse amount for ingredient: ${ingredient.name}`);
      return ingredient; // Or return a modified ingredient with a "scaling failed" flag
    }

    return {
      ...ingredient,
      amount: (parsedAmount * scaleFactor).toFixed(2), // Scale amount and limit to 2 decimal places
    };
  });
}

// Utility function to convert fractions to decimal.
function convertFractionToDecimal(amountString) {
  if (!amountString) return NaN;

  const trimmedAmountString = amountString.trim(); //Remove White Space
  const [whole, fraction] = trimmedAmountString.split(" "); // Split "1 1/2" into "1" and "1/2"
  let decimal = parseFloat(whole);

  if (isNaN(decimal)) return NaN;

  if (fraction) {
    const [num, den] = fraction.split("/"); // Split "1/2" into "1" and "2"
    decimal += parseInt(num) / parseInt(den);
  }

  return decimal;
}

//Parses servings if it is a range.
function parseServings(servings) {
  const rangeRegex = /^(\d+)\s*-\s*(\d+)$/;
  const match = rangeRegex.exec(servings);

  if (match) {
    const min = parseInt(match[1], 10);
    const max = parseInt(match[2], 10);
    return { min, max };
  }

  return parseInt(servings, 10);
}

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

    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-pro-latest";
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

    
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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


module.exports = airecipesApp;