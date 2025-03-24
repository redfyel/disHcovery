let exp = require("express");
let notesApp = exp.Router();
const { Db, ObjectId } = require("mongodb");

// Add a body parser middleware
notesApp.use(exp.json());

// Fetch all notes for a specific user
notesApp.get("/notes/:userId", async (req, res) => {
    const { userId } = req.params;

    try {
        const notesCollection = req.app.get('notesCollection');
        const parsedUserId = typeof userId === 'string' ? new ObjectId(userId) : userId; // Correct userId to Object
        const userNotesDoc = await notesCollection.findOne({ userId: parsedUserId });

        if (userNotesDoc) {
            // Extract the userNotes object and send it
            res.json({ message: "Notes fetched successfully", payload: userNotesDoc.notes || {} }); // Return the "notes" object
        } else {
            res.json({ message: "No notes found for this user", payload: {} });
        }
    } catch (error) {
        console.error("Error fetching notes:", error);
        res.status(500).json({ error: "Failed to fetch notes", details: error.message });
    }
});



// Add or update a note
notesApp.post("/notes", async (req, res) => {
    const { userId, recipeId, userNotes } = req.body;

    if (!userId || !recipeId) {
        return res.status(400).json({ error: "Missing userId or recipeId in request body" });
    }

    try {
        const notesCollection = req.app.get('notesCollection');

        const parsedUserId = typeof userId === 'string' ? new ObjectId(userId) : userId;
        const parsedRecipeId = typeof recipeId === 'string' ? new ObjectId(recipeId) : recipeId;

        // Create the key for the notes object: Make sure that the key is a String to prevent any issues with ObjectIDs as keys
        const recipeKey = parsedRecipeId.toString();

        // Use $set to update the specific note within the "notes" object
        const updateResult = await notesCollection.updateOne(
            { userId: parsedUserId },
            { $set: { [`notes.${recipeKey}`]: userNotes } }, // Using dot notation
            { upsert: true }
        );

        if (updateResult.modifiedCount === 0 && updateResult.upsertedCount === 0) {
            return res.status(500).json({ message: "Failed to update user notes" });
        }

        res.json({ message: "Note saved successfully!", updatedUser: "Test User" });

    } catch (error) {
        console.error("Error saving notes:", error);
        res.status(500).json({ message: "Error saving notes", error: error.message });
    }
});

module.exports = notesApp;