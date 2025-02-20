import React, { useState } from 'react';
import RecipeRoulette from '../recipe-roulette/RecipeRoulette';

function Search() {
  const [showRoulette, setShowRoulette] = useState(false);

  return (
    <div>
      {/* Floating Button to Open Modal */}
      Search Box Here
      <button
        onClick={() => setShowRoulette(true)}
        className="fixed bottom-10 right-10 p-3 bg-blue-500 text-white rounded-full shadow-lg z-50"
      >
        🎰
      </button>

      {/* Modal Overlay */}
      {showRoulette && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {/* Modal Box */}
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowRoulette(false)}
              className="absolute top-2 right-2 text-gray-500 text-xl"
            >
              ✖
            </button>

            {/* RecipeRoulette Component */}
            <RecipeRoulette />
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;
