import React, { useState, useEffect, useContext } from 'react';
import { userLoginContext } from "../../contexts/UserLoginContext";
import './Comments.css';
import { useToast } from "../../contexts/ToastContext";



function Comments({ recipeId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { loginStatus,currentUser } = useContext(userLoginContext);
    const {showToast} = useContext(useToast)

    useEffect(() => {
        async function loadComments() {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:4000/comments-api/${recipeId}`);
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
            const response = await fetch('http://localhost:4000/comments-api/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipeId: recipeId,
                    userId: currentUser._id,
                    username: currentUser.username,
                    userComments: newComment,
                }),
            });

            if (response.ok) {
                setComments(prevComments => [...prevComments, {
                    userId: currentUser._id,
                    username: currentUser.username,
                    userComments: newComment
                }]);
                setNewComment(''); 
            } else {
                setError(`Failed to add comment: ${response.status}`);
            }
        } catch (error) {
            setError(`Error adding comment: ${error.message}`);
        }
    };

    if (loading) return <p>Loading comments...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="comments-container">
            <h3>Comments</h3>
            <ul className="comments-list">
                {comments.map((comment, index) => (
                    <li key={index} className="comment">
                        <p className="comment-author">{comment.username}:</p>
                        <p className="comment-text">{comment.userComments}</p>
                    </li>
                ))}
            </ul>

            {currentUser && (
                <div className="add-comment-form">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add your comment..."
                    />
                    <button onClick={handleAddComment}>Add Comment</button>
                </div>
            )}
        </div>
    );
}

export default Comments;