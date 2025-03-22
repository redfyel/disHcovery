//create a mini express module here
let exp = require("express");
let userApp = exp.Router();
const { Db } = require("mongodb");
const bcryptjs = require("bcryptjs");
//const jwt = require('jsonwebtoken'); 
const expressAsyncHandler = require("express-async-handler");


//add a body parser middleware
userApp.use(exp.json());

//implementaion of routes
//create or register a user
userApp.post("/register", expressAsyncHandler(async (req, res) => {
    //get usersCollection Object first
    const usersCollection = req.app.get("usersCollection");

    //get new user data from req obj
    const newUser = req.body;

    newUser.saved_recipes = []; 
    newUser.roulette_recipes= []; 
    newUser.preferences = {}; 


    //verifying uniqueness
    let existingUser = await usersCollection.findOne({
      username: newUser.username,
    });

    //if user already existed
    if (existingUser !== null) {
      res.send({ message: "User already existed" });
    } else {
      // hashing the password
      let hashedpassword = await bcryptjs.hash(newUser.password, 7);

      //replace plain password with hashed password in newUser
      newUser.password = hashedpassword;

      //save user
      await usersCollection.insertOne(newUser);

      //temporarily I'm sending a message
      res.send({ message: "user created" });
    }
  })
);

//login route
userApp.post("/login", expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  const { username, password } = req.body;
  const user = await usersCollection.findOne({ username });

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const isPasswordValid = await bcryptjs.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token upon successful login
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY , { expiresIn: '1h' });

  const { password: _, ...userInfo } = user; 
  res.status(200).json({ message: "login success", user: userInfo, token });
}));

userApp.post("/preferences", expressAsyncHandler(async (req, res) => {
  // console.log("Received Preferences Data:", req.body); 

  const usersCollection = req.app.get("usersCollection");
  const { userId, ...preferences } = req.body;

  if (!userId || Object.keys(preferences).length === 0) {
    return res.status(400).json({ message: "Missing userId or preferences" });
  }

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure the user document has a preferences object
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $set: { preferences } } // Overwrites preferences object
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update preferences" });
    }

    res.status(200).json({ message: "Preferences saved successfully!", updatedPreferences: preferences });

  } catch (error) {
    console.error("Error saving preferences:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}));


const { ObjectId } = require("mongodb"); 
const jwt = require("jsonwebtoken");

userApp.post("/spin", expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  const { recipe } = req.body;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = new ObjectId(decoded.userId); 

    //console.log("Decoded JWT User ID:", userId);

    const user = await usersCollection.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.roulette_recipes) {
      await usersCollection.updateOne({ _id: userId }, { $set: { roulette_recipes: [] } });
    }

    const updateResult = await usersCollection.updateOne(
      { _id: userId },
      { $push: { roulette_recipes: recipe } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update user recipes" });
    }

    //console.log("Recipe successfully saved for user:", userId);
    res.status(200).json({ message: "Recipe saved successfully", updatedUser: user });

  } catch (error) {
   // console.error("Error saving recipe:", error);
    res.status(401).json({ message: "Invalid or expired token", error });
  }
}));

userApp.post('/save-recipe', expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get('usersCollection');
  const { recipe } = req.body;  
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const userId = new ObjectId(decoded.userId); 

    const user = await usersCollection.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the recipe is already saved
    const isAlreadySaved = user.saved_recipes.some(savedRecipe => savedRecipe._id === recipe._id);
    
    if (isAlreadySaved) {
      return res.status(400).json({ message: "Recipe already saved" });
    }

    const updateResult = await usersCollection.updateOne(
      { _id: userId },
      { $push: { saved_recipes: recipe } }
    );

    if (updateResult.modifiedCount === 0) {
      return res.status(500).json({ message: "Failed to update user saved recipes" });
    }

    res.status(200).json({ message: "Recipe saved successfully!", updatedUser: user });

  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token", error });
  }
}));

// fetch saved roulette recipes
userApp.get("/saved-roulette-recipes/:userId", expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  const { userId } = req.params;

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { roulette_recipes: 1 } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ payload: user.roulette_recipes || [] });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving saved roulette recipes", error });
  }
}));

// fetch saved recipes
userApp.get("/saved-recipes/:userId", expressAsyncHandler(async (req, res) => {
  const usersCollection = req.app.get("usersCollection");
  const { userId } = req.params;

  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) }, { projection: { saved_recipes: 1 } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ payload: user.saved_recipes || [] });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving saved recipes", error });
  }
}));




module.exports = userApp;