// create a mini express module here
let exp = require('express')
let recipesApp = exp.Router()

// add a body parser middleware
recipesApp.use(exp.json());

// fetch all recipes
recipesApp.get('/recipes', async(req, res) => {
    // connect to collection
    const recipesCollection = req.app.get('recipesCollection')

    let recipes = await recipesCollection.find({}).toArray()


    res.send({message : "Here you gooo", payload : recipes})
})
module.exports = recipesApp;