import React, { useState, useEffect, useRef } from 'react';

function Notes({ userId, recipeId }) {
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const hasInteracted = useRef(false);

  useEffect(() => {
    async function loadNote() {
      try {
        const response = await fetch(`http://localhost:4000/notes-api/notes/${userId}`);
        if (response.ok) {
          const data = await response.json();
          const userNotes = data.payload;
          setNote(userNotes[recipeId] || '');
          hasInteracted.current = false;
        } else {
          console.error("Failed to load notes:", response.status);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }
    loadNote();
  }, [userId, recipeId]);

  useEffect(() => {
    if (note !== '' && hasInteracted.current) {
      setIsSaving(true);
      const timeout = setTimeout(async () => {
        try {
          const response = await fetch('http://localhost:4000/notes-api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, recipeId, userNotes: note })
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Failed to save note: ${response.status} - ${errorData.error}`);
          }

          setIsSaving(false);
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
    <div className="bg-[#F8F6F1] p-4 rounded-2xl shadow-lg w-full max-w-md mx-auto relative">
      <h3 className="text-lg font-semibold text-[#0A122A] mb-2">Your Notes</h3>
      <textarea
        value={note}
        onChange={handleChange}
        placeholder="Add your thoughts here... 🍽️✨"
        className="w-full h-40 p-3 rounded-lg border border-[#E7DECD] bg-[#FBFAF8] focus:ring-2 focus:ring-[#698F3F] focus:outline-none text-[#0A122A] text-sm placeholder:text-[#A0A0A0]"
      />
      <p className={`absolute right-4 bottom-4 text-sm ${isSaving ? 'text-[#698F3F]' : 'text-[#A0A0A0]'}`}>
        {isSaving ? 'Saving...' : 'Saved ✅'}
      </p>
    </div>
  );
}

export default Notes;
