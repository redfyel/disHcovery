import { useState } from "react";
import { VscDebugRestart } from "react-icons/vsc";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo_darkbg.png"; 

const Footer = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  // Random disHcovery facts
  const facts = [
    "Did you know? disHcovery lets you explore recipes by cuisine, meal type, and even dietary preferences!",
    "Spin the disHcovery Recipe Roulette and save all your spun recipes for later!",
    "With disHcovery AI, you can generate recipes by selecting ingredients, typing them in, or even uploading a photo!",
    "Your personalized dashboard stores all your saved recipes, spins, and ingredient-based dishes in one place!",
    "Did you know? You can get alternate ingredient suggestions for any recipe with disHcovery AI!",
    "Use our quick search bar and smart filters to find the perfect recipe in seconds!",
    "Like, comment, make notes, and share recipes with friends—disHcovery keeps cooking interactive!",
    "Find essential recipe details like nutrition, allergy warnings, and step-by-step guides in every dish!",
    "Cooking has never been easier—print your favorite recipes directly from disHcovery with a single click!",
    "Get inspired with disHcovery and never run out of meal ideas again!",
  ];

  // Function to handle cell click
  const handleClick = (index) => {
    if (board[index] || winner || !isPlayerTurn) return;
    const newBoard = [...board];
    newBoard[index] = "🥩";
    setBoard(newBoard);
    setIsPlayerTurn(false);
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    } else {
      aiMove(newBoard);
    }
  };

  // Function to calculate winner
  const calculateWinner = (board) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };

  // AI move (Basic AI, just picks a random empty spot)
  const aiMove = (newBoard) => {
    const emptyIndices = newBoard
      .map((value, index) => (value === null ? index : -1))
      .filter((index) => index !== -1);
    if (emptyIndices.length === 0) return;
    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    newBoard[randomIndex] = "🥗";
    setBoard(newBoard);
    setIsPlayerTurn(true);
    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
    }
  };

  // Random fact to show when someone wins
  const randomFact = facts[Math.floor(Math.random() * facts.length)];

  return (
    <footer className="w-full relative bg-[#0a122a] text-white py-6 px-4">
      <div className="container d-flex justify-content-between items-center flex-wrap">
        {/* Left Side: Food Tic-Tac-Toe */}
        <div className="d-flex flex-column align-items-center text-xl mb-1 mb-lg-0">
          {winner && (
            <div className="text-center mt-2 mb-0">
              <div className="text-2xl font-bold text-yellow-300 animate-bounce">
                {winner} wins! 🎉
              </div>
              <div className="text-sm italic text-gray-200 bg-gray-900/70 backdrop-blur-md p-3 rounded-lg mt-0 shadow-lg animate-fade-in">
                🌟 Fun Fact:{" "}
                <span className="font-semibold text-white">{randomFact}</span>
              </div>
            </div>
          )}

          <div className="tic-tac-toe-grid">
            {board.map((cell, index) => (
              <div
                key={index}
                onClick={() => handleClick(index)}
                className={`cell ${cell ? "filled" : ""} ${index === 0 ? "no-top no-left no-bottom no-right" : ""} ${index === 1 ? "no-top no-bottom" : ""} ${index === 2 ? "no-top no-left no-bottom no-right" : ""} ${index === 3 ? "no-left no-right" : ""} ${index === 5 ? "no-left no-right" : ""} ${index === 6 ? "no-top no-left no-bottom no-right" : ""} ${index === 7 ? "no-top no-bottom" : ""} ${index === 8 ? "no-top no-left no-bottom no-right" : ""}`}
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

        {/* Right Side: disHcovery Links */}
        <div className="d-flex flex-column align-items-center text-center">
          <img src={logo} alt="Dishcovery Logo" style={{ width: '280px', height: 'auto', filter: 'brightness(1.1)' }}/>
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
            <Link to="/recipes" className="link">
              Recipes
            </Link>
          </div>
        </div>
      </div>

      {/* Centered Copyright */}
      <div className="text-center mt-4">
        {/* <p className="text-xxs opacity-60"> */}
        © {new Date().getFullYear()} DisHcovery. All Rights Reserved.
        {/* </p> */}
      </div>

      {/* Keyframe Animations and Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-in-out;
        }
        @keyframes wiggle {
          0%, 100% {
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
          background-color:  #0a122a; 
          transform: rotate(-5deg);
          margin-top: 50px;
        }
        footer {
          position: relative;
          z-index: 10;
          background-color: #0a122a !important;
        }
        footer::after {
          content: "";
          display: block;
          clear: both;
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
          padding: 8px;
          background-color:#698F3F;
          color: white;
          font-size: 0.9rem;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 10px;
        }
        .cell:hover {
          background-color: rgba(97, 96, 96, 0.91);
        }
        .link {
          color: #fff;
          text-decoration: none;
          margin-bottom: 4px;
          display: block;
          transition: color 0.2s;
        }
        .link:hover {
          color: #698F3F;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
