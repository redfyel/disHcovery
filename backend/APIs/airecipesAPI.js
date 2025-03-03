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



module.exports = airecipesApp;