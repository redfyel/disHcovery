import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported

const Footer = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true); // Player starts first
  const [winner, setWinner] = useState(null);

  // Random disHcovery facts
  const facts = [
    "Did you know? disHcovery helps you discover new recipes based on ingredients you already have!",
    "Explore the world of flavors with disHcovery and find unique dishes from various cuisines.",
    "disHcovery is your ultimate kitchen companion, helping you create delicious meals with ease!",
    "Did you know? disHcovery's AI Recipe Creator generates recipes based on your ingredients!",
    "Cooking with disHcovery means never running out of meal ideas again!",
  ];

  // Function to handle cell click
  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return; // If the cell is filled, or there's a winner, or it's not player's turn, do nothing
    const newBoard = [...board];
    newBoard[index] = "🥩";
    setBoard(newBoard);
    setIsPlayerTurn(false); // Switch turn to AI
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner); // Set winner when game ends
    } else {
      // AI's turn
      aiMove(newBoard);
    }
  };

  // Function to calculate winner
  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Columns
      [0, 4, 8],
      [2, 4, 6], // Diagonals
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a]; // Return the winner
      }
    }
    return null;
  };

  // AI move (Basic AI, just picks the first empty spot)
  const aiMove = (newBoard) => {
    const emptyIndices = newBoard
      .map((value, index) => (value === null ? index : -1))
      .filter((index) => index !== -1);
    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    newBoard[randomIndex] = "🥗";
    setBoard(newBoard);
    setIsPlayerTurn(true); // Switch turn to player
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner); // Set winner when game ends
    }
  };

  // Random fact to show when someone wins
  const randomFact = facts[Math.floor(Math.random() * facts.length)];

  return (
    <footer className="bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 text-white py-10 px-6">
      <div className="container d-flex justify-content-between items-center flex-wrap">
        {/* Left Side: Food Tic-Tac-Toe */}
        <div className="d-flex flex-column align-items-center text-xl mb-4 mb-lg-0">
          {winner ? (
            <div className="text-xl font-semibold mb-4">
              {winner} wins! 🎉
              <div className="mt-4 text-lg font-medium">
                Fun Fact:{randomFact}
              </div>
            </div>
          ) : null}

          <div className="tic-tac-toe-grid">
            {/* Tic-Tac-Toe grid */}
            {board.map((cell, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`cell ${cell ? "" : ""}`}
              >
                {cell}
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              setBoard(Array(9).fill(null));
              setWinner(null);
              setIsPlayerTurn(true);
            }}
            className="restart-button"
          >
            Restart Game
          </button>
        </div>

        {/* Right Side: disHcovery Links and Copyright */}
        <div className="d-flex flex-column align-items-center text-center">
          <h2 className="text-3xl font-extrabold tracking-wide drop-shadow-lg mb-4">
            🍽️ disHcovery – Discover, Create, Savor! 🍲
          </h2>

          {/* Animated Ingredients */}
          <div className="d-flex justify-content-center gap-4 text-4xl mb-4 fs-5">
            <span className="animate-wiggle">🥑</span>
            <span className="animate-wiggle">🍣</span>
            <span className="animate-wiggle">🍩</span>
            <span className="animate-wiggle">🍕</span>
            <span className="animate-wiggle">🥘</span>
            <span className="animate-wiggle">🌮</span>
            <span className="animate-wiggle">🍔</span>
          </div>

          {/* Links Section */}
<div className="d-flex flex-column align-items-center mb-4 text-sm font-medium opacity-90">
  <a href="#" className="link">Home</a>
  <a href="#" className="link">Explore</a>
  <a href="#" className="link">Community</a>
  <a href="#" className="link">Recipe Roulette 🎲</a>
  <a href="#" className="link">AI Recipe with Ingredients 🤖</a>
</div>

          {/* Copyright */}
          <p className="text-xs opacity-60">
            © {new Date().getFullYear()} disHcovery. Cooked fresh with 🔥 & a
            sprinkle of magic ✨.
          </p>
        </div>
      </div>

      {/* Keyframe Animations */}
      <style jsx>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-10deg);
          }
          75% {
            transform: rotate(10deg);
          }
        }

        .link {
  color: #fff; /* White text color */
  text-decoration: none; /* Remove underline */
  padding: 10px 15px; /* Add padding for better click area */
  border-radius: 5px; /* Rounded corners */
  transition: background-color 0.3s, color 0.3s; /* Smooth transition for background and color */
}

.link:hover {
  background-color: rgba(255, 255, 255, 0.2); /* Light background on hover */
  color: #ffcc00; /* Change text color on hover */
}
        .animate-wiggle {
          display: inline-block;
          animation: wiggle 1.5s infinite ease-in-out;
        }

        .tic-tac-toe-grid {
          display: grid;
          grid-template-columns: repeat(3, 100px);
          grid-template-rows: repeat(3, 100px);
          gap: 0; /* Remove gap to make it look like a single board */
          background-color: #000; /* Set the background color of the grid */
          border: 2px solid #fff; /* Add a border around the grid */
        }

        .cell {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2.5rem;
          background-color: #000; /* Keep the cell background black */
          border: 2px solid #fff; /* White border for each cell */
          cursor: pointer;
          color: #fff; /* Set text color to white for better visibility */
          transition: background-color 0.3s; /* Add a transition effect */
        }

        .cell:hover {
          background-color: rgba(
            255,
            255,
            255,
            0.2
          ); /* Lighten the cell on hover */
        }
        .restart-button {
          padding: 10px 20px;
          background-color: #698f3f;
          color: white;
          font-size: 1.2rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          margin-top: 20px;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
