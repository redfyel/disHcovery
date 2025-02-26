let exp = require("express");
let ingreApp = exp.Router();
const expressAsyncHandler = require('express-async-handler');

// display the pantry items category wise
ingreApp.get('/ingredients', expressAsyncHandler(async (req, res) =>{
    try {
        const ingredientsCollection = req.app.get('ingredientsCollection');
        const categories = await ingredientsCollection.find({}).toArray(); 
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}))
module.exports = ingreApp;