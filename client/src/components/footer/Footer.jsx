import { useState } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { Link } from "react-router-dom";

const Footer = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
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
    if (emptyIndices.length === 0) return; //If board is full AI can't make a move
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
    <footer className="bg-gradient-to-r from-orange-600 via-red-500 to-yellow-500 text-white py-6 px-4">
      <div className="container d-flex justify-content-between items-center flex-wrap">
        {/* Left Side: Food Tic-Tac-Toe */}
        <div className="d-flex flex-column align-items-center text-xl mb-3 mb-lg-0">
          {winner && (
            <div className="text-lg font-semibold mb-2">
              {winner} wins! 🎉
              <div className="text-sm italic opacity-70 mt-1">
                Fun Fact: {randomFact}
              </div>
            </div>
          )}

          <div className="tic-tac-toe-grid">
            {/* Tic-Tac-Toe grid */}
            {board.map((cell, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`cell ${cell ? "filled" : ""} ${
                  index === 0 ? "no-top no-left no-bottom no-right" : ""
                }
                 ${index === 1 ? "no-top no-bottom " : ""}
                 ${index === 2 ? "no-top no-left no-bottom no-right" : ""}
                 ${index === 3 ? " no-left no-right" : ""}
                  ${index === 5 ? " no-left no-right" : ""}
                 ${index === 6 ? "no-top no-left no-bottom no-right" : ""}
                  ${index === 7 ? "no-top no-bottom" : ""}
                  ${index === 8 ? "no-top no-left no-bottom no-right" : ""}
                `}
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
            <VscDebugRestart />
          </button>
        </div>

        {/* Right Side: disHcovery Links and Copyright */}
        <div className="d-flex flex-column align-items-center text-center">
          <h2 className="text-2xl font-extrabold tracking-wide drop-shadow-lg mb-3">
            🍽️ disHcovery
          </h2>
          <p className="text-sm mb-2">Discover, Create, Savor!</p>

          {/* Animated Ingredients */}
          <div className="d-flex justify-content-center gap-2 text-3xl mb-2">
            <span className="animate-wiggle">🥑</span>
            <span className="animate-wiggle">🍣</span>
            <span className="animate-wiggle">🍩</span>
            <span className="animate-wiggle">🍕</span>
            <span className="animate-wiggle">🥘</span>
          </div>

          {/* Links Section */}
          <div className="d-flex flex-column align-items-center mb-2 text-xs font-medium opacity-90">
            <a href="#" className="link">
              Home
            </a>
            <a href="#" className="link">
              Explore
            </a>
            <Link to = '/recipes' className="link">
              Recipes
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xxs opacity-60">
            © {new Date().getFullYear()} disHcovery.
          </p>
        </div>
      </div>

      {/* Keyframe Animations and Styles */}
      <style>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-8deg);
          }
          75% {
            transform: rotate(8deg);
          }
        }

        .animate-wiggle {
          display: inline-block;
          animation: wiggle 1.5s infinite ease-in-out;
        }

        .tic-tac-toe-grid {
          display: grid;
          grid-template-columns: repeat(3, 60px);
          grid-template-rows: repeat(3, 60px);
          gap: 4px;
          background-color: #0a122a;
          // padding: 4px;
          // width: 188px;
          transform: rotate(-5deg);
        }

        .cell {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 1.8rem;
          background-color: #0a122a;
          border: 2px solid #fff;
          cursor: pointer;
          user-select: none;
          border-top: 2px solid #fff;
          border-left: 2px solid #fff;
          border-right: 2px solid #fff;
          border-bottom: 2px solid #fff;
          transition: background-color 0.2s;
        }
        .cell.no-top {
          border-top: none;
        }
        .cell.no-left {
          border-left: none;
        }
        .cell.no-right {
          border-right: none;
        }
        .cell.no-bottom {
          border-bottom: none;
        }

        .restart-button {
          position: relative;
          top: 20;
          left: 50;
          bottom: 50;
          padding: 8px;
          background-color: rgba(230, 203, 203, 0.3);
          color: white;
          font-size: 0.9rem;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .cell:hover {
          background-color: rgba(97, 96, 96, 0.91);
          border: 2px solid #00-;
        }

        .link {
          color: #fff;
          text-decoration: none;
          margin-bottom: 4px;
          display: block;
          transition: color 0.2s;
        }

        .link:hover {
          color: #ffcc00;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
