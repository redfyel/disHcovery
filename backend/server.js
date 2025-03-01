// import express module
const exp = require('express')
const app = exp()

// import environment variables
require('dotenv').config()

// middleware
const cors = require('cors')
app.use(cors())
app.use(exp.json());
// import MongoClient
const {MongoClient} = require('mongodb')

// create object to MongoClient class
let mongoclient = new MongoClient(process.env.DB_CONNECTION_STRING)

// connect to MongoDBserver
mongoclient.connect().then((connectionObj)=>{
    console.log("DB CONNECTION SUCCESS!");
    //connect to the db
    const db = connectionObj.db('dishcovery_db')

    // connect to collection
    const recipesCollection = db.collection('recipes')
    const usersCollection = db.collection('users')
    const ingredientsCollection  = db.collection('ingredients')
    const aiRecipesCollection = db.collection('ai-recipes')


    // share collection objects with the API
    app.set('recipesCollection', recipesCollection)
    app.set('usersCollection', usersCollection)
    app.set('ingredientsCollection', ingredientsCollection)
    app.set('aiRecipesCollection', aiRecipesCollection)


    // start HTTP server
    app.listen(process.env.PORT, () => console.log(`Server started on Port ${process.env.PORT}`))
}).catch((err)=>console.log("Error in DB Connection: ", err))

// import and mount recipe-related API routes
const recipesApp = require('./APIs/recipesAPI')
app.use('/recipe-api', recipesApp)

// Import and mount the user-related API routes
const userApp = require('./APIs/userAPI')
app.use('/user-api', userApp)

const ingreApp = require('./APIs/ingredientsAPI')
app.use('/ingredient-api', ingreApp)

const airecipesApp = require('./APIs/airecipesAPI')
app.use('/airecipes-api', airecipesApp)

// error handling middleware
// app.use((err, req, res, next) => res.status(500).send({message : "An error ocuured: ", errorMessage: err.message}))