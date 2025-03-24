let exp = require("express");
let commentsApp = exp.Router();
const { Db, ObjectId } = require("mongodb");

// Add a body parser middleware
commentsApp.use(exp.json());

// GET comments for a specific recipe
commentsApp.get("/:recipeId", async (req, res) => {
    const { recipeId } = req.params;

    try {
        const commentsCollection = req.app.get('commentsCollection');
        const parsedRecipeId = typeof recipeId === 'string' ? new ObjectId(recipeId) : recipeId;

        const recipeComments = await commentsCollection.findOne({ recipeId: parsedRecipeId });

        if (recipeComments) {
            res.status(200).json({ message: "Comments fetched successfully", payload: recipeComments.comments || [] });
        } else {
            res.status(200).json({ message: "No comments found for this recipe", payload: [] });
        }
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ error: "Failed to fetch comments", details: error.message });
    }
});

// POST a new comment for a specific recipe
commentsApp.post("/", async (req, res) => {
    const { recipeId, userId, username, userComments } = req.body;

    if (!recipeId || !userId || !username || !userComments) {
        return res.status(400).json({ error: "Missing required fields in request body" });
    }

    try {
        const commentsCollection = req.app.get('commentsCollection');

        const parsedRecipeId = typeof recipeId === 'string' ? new ObjectId(recipeId) : recipeId;
        const parsedUserId = typeof userId === 'string' ? new ObjectId(userId) : userId;

        const newComment = {
            userId: parsedUserId,
            username: username,
            userComments: userComments
        };

        // Add or update a note.
        const updateResult = await commentsCollection.updateOne(
            { recipeId: parsedRecipeId },
            { $push: { comments: newComment } },
            { upsert: true }
        );

        if (updateResult.modifiedCount === 0 && updateResult.upsertedCount === 0) {
            return res.status(500).json({ message: "Failed to add comment" });
        }

        res.status(201).json({ message: "Comment added successfully!" });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
});

module.exports = commentsApp;