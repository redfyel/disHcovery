import React, { useState, useRef, useEffect } from "react"; 
import { motion } from "framer-motion";
import { CheckCircleIcon, DocumentTextIcon, XIcon } from "@heroicons/react/solid";
import "./Notes.css";

const Notes = ({ userId, recipeId, initialOpen = false, setShowNotes }) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [note, setNote] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef(null);
  const hasInteracted = useRef(false);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    async function loadNote() {
      try {
        const response = await fetch(`https://dishcovery-j22s.onrender.com/notes-api/notes/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const userNotes = data.payload;
          setNote(userNotes[recipeId] || "");
          hasInteracted.current = false;
        } else {
          console.error("Failed to load notes:", response.status);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
    if (userId) {
      loadNote();
    }
  }, [userId, recipeId]);

  useEffect(() => {
    if (note !== "" && hasInteracted.current) {
      setIsSaving(true);
      const timeout = setTimeout(async () => {
        try {
          const response = await fetch("https://dishcovery-j22s.onrender.com/notes-api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, recipeId, userNotes: note })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to save note: ${response.status} - ${errorData.error}`);
          }
          
          setIsSaving(false);
          setSaved(true);
          setTimeout(() => setSaved(false), 2000);
        } catch (error) {
          console.error("Error saving note:", error);
        }
      }, 1000);

      return () => clearTimeout(timeout);
    } else {
      setIsSaving(false);
    }
  }, [note, userId, recipeId]);

  const handleChange = (e) => {
    setNote(e.target.value);
    hasInteracted.current = true;
  };

  return (
    <>
      {isOpen && (
        <motion.div className="notes-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            className="notes-modal"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="notes-header">
              <h2>
                <DocumentTextIcon className="icon" /> Chef’s Log
              </h2>
              <motion.button className="close-button p-2" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setShowNotes(false)}>
                <XIcon className="icon" />
              </motion.button>
            </div>

            <textarea
              ref={textareaRef}
              className="notes-textarea"
              placeholder="Jot down your thoughts, secret ingredients, or brilliant ideas..."
              value={note}
              onChange={handleChange}
            />

            <div className="notes-footer">
              <motion.button className="save-button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {isSaving ? "Saving..." : "Save"}
              </motion.button>

              {saved && (
                <motion.span className="saved-status" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <CheckCircleIcon className="icon" /> Saved!
                </motion.span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Notes;