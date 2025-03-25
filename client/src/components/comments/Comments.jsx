import React, { useState, useEffect, useContext } from "react";
import { userLoginContext } from "../../contexts/UserLoginContext";
import { useToast } from "../../contexts/ToastProvider";
import "./Comments.css";
import Loading from "../loading/Loading";
import NoRecipesMessage from "../no-recipes/NoRecipesMessage";


function Comments({ recipeId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { loginStatus, currentUser } = useContext(userLoginContext);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadComments() {
      setLoading(true);
      try {
        const response = await fetch(`https://dishcovery-j22s.onrender.com/comments-api/${recipeId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.payload);
        } else {
          setError(`Failed to load comments: ${response.status}`);
        }
      } catch (error) {
        setError(`Error fetching comments: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    loadComments();
  }, [recipeId]);

  const handleAddComment = async () => {
    if (!loginStatus) {
      showToast("Please log in to add a comment.", "alert"); 
      return;
    }
    if (!newComment.trim()) return; 
  
    try {
      const response = await fetch("https://dishcovery-j22s.onrender.com/comments-api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId,
          userId: currentUser._id,
          username: currentUser.username,
          userComments: newComment,
        }),
      });
  
      if (response.ok) {
        setComments((prevComments) => [
          ...prevComments,
          {
            userId: currentUser._id,
            username: currentUser.username,
            userComments: newComment,
          },
        ]);
        setNewComment("");
        showToast("Comment added successfully!", "success");
      } else {
        setError(`Failed to add comment: ${response.status}`);
      }
    } catch (error) {
      setError(`Error adding comment: ${error.message}`);
    }
  };
  

  if (loading) return <Loading/>;
  if (error) return <p className="error-text">Error: {error}</p>;

  return (
    <div className="comments-container">
      <h3>Comments</h3>
      <ul className="comments-list">
  {comments.length > 0 ? (
    comments.map((comment, index) => (
      <li key={index} className="comment">
        <div className="comment-avatar">{comment.username.charAt(0).toUpperCase()}</div>
        <div className="comment-content">
          <p className="comment-author">{comment.username}</p>
          <p className="comment-text">{comment.userComments}</p>
        </div>
      </li>
    ))
  ) : (
<NoRecipesMessage type="comments" />

  )}
</ul>


      <div
        className={`add-comment-form ${!loginStatus ? "blurred" : ""}`}
        onClick={!loginStatus ? () => showToast("Please log in to add a comment.", "alert") : null}
      >
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add your comment..."
          disabled={!loginStatus}
        />
        <button onClick={handleAddComment}>
          Add Comment
        </button>
      </div>
    </div>
  );
}

export default Comments;
