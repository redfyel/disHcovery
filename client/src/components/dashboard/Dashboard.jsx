import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import "./Dashboard.css"; // Import CSS
import { Wheel } from "react-custom-roulette";
import pointerIcon from "../../assets/images/pointer-icon.png";
import Breakfast from "../../assets/images/breakfast.jpg";
import Lunch from "../../assets/images/lunch.jpg";
import Dinner from "../../assets/images/dinner.jpg";
import Snacks from "../../assets/images/snacks.jpg";
import Desserts from "../../assets/images/dessert.jpg";
import Healthy from "../../assets/images/Healthy.jpg";
import { userLoginContext } from "../../contexts/UserLoginContext";
import UserEditModal from "../dashboard/UserEditModal";
import AccessDenied from "../protected/AccessDenied";
import CoolAI from "../ai-ingredients/CoolAI";
import "./Dashboard.css"; // Ensure your CSS is imported

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, loginStatus, setCurrentUser, token } =
    useContext(userLoginContext);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [input, setInput] = useState("");
  const [recipeHistory, setRecipeHistory] = useState([]);
  const [error, setError] = useState(null);
  const handleInput = (e) => setInput(e.target.value);

  useEffect(() => {
    if (currentUser && currentUser.roulette_recipes) {
      setRecipeHistory(currentUser.roulette_recipes);
    } else {
      setRecipeHistory([]);
    }
  }, [currentUser]);

  const handleSend = () => {
    if (!loginStatus) {
      sessionStorage.setItem("returnAfterLogin", location.pathname);
      navigate("/login");
      return;
    }

    if (input.trim().toLowerCase() === "hi") {
      navigate("/ai-ingredients");
    }
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const res = await fetch("http://localhost:4000/recipe-api/recipes");
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        const shuffled = data.payload
          .sort(() => 0.5 - Math.random())
          .slice(0, 8);
        setRecipes(shuffled);
      } catch (err) {
        console.error("Error fetching recipes:", err.message);
      }
    }

    fetchRecipes();
  }, []);

  const handleSpinClick = () => {
    if (recipes.length > 0) {
      setShowConfetti(false);
      setSelectedRecipe(null);
      const randomIndex = Math.floor(Math.random() * recipes.length);
      setPrizeNumber(randomIndex);
      setTimeout(() => setMustSpin(true), 50);
    }
  };

  const handleStopSpinning = async () => {
    setMustSpin(false);

    if (prizeNumber !== null && recipes[prizeNumber]) {
      const selected = recipes[prizeNumber];
      setShowConfetti(true);
      setConfettiOpacity(1);
      setSelectedRecipe(selected);

      try {
        if (!token) {
          console.error("No token found");
          return;
        }

        console.log("Sending token:", token);

        const res = await fetch("http://localhost:4000/user-api/spin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ recipe: selected }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to save spun recipe");
        }

        console.log("Recipe successfully saved to user:", data);

        setCurrentUser((prevUser) => ({
          ...prevUser,
          roulette_recipes: [...(prevUser.roulette_recipes || []), selected],
        }));
      } catch (error) {
        console.error("Error saving spun recipe:", error.message);
      }

      setTimeout(() => {
        setConfettiOpacity(0);
        setTimeout(() => setShowConfetti(false), 2500);
      }, 3000);
    } else {
      console.error("Error: Invalid prizeNumber or missing recipe data.");
    }
  };

  useEffect(() => {
    if (!loginStatus || !currentUser?._id) return;

    const fetchLikedRecipes = async () => {
      try {
        console.log("Fetching recipes for user:", currentUser._id);

        const likedRes = await fetch(
          `http://localhost:4000/user-api/liked-recipes/${currentUser._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!likedRes.ok)
          throw new Error(`Error ${likedRes.status}: ${likedRes.statusText}`);
        const likedData = await likedRes.json();
        setLikedRecipes(likedData?.payload ?? []);
      } catch (err) {
        console.error("Error fetching liked recipes:", err.message);
        setError(err.message);
      }
    };

    fetchLikedRecipes();
  }, [loginStatus, currentUser, token]);

  const categories = [
    { name: "Breakfast", img: Breakfast },
    { name: "Lunch", img: Lunch },
    { name: "Dinner", img: Dinner },
    { name: "Snacks", img: Snacks },
    { name: "Desserts", img: Desserts },
    { name: "Healthy", img: Healthy },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSaveDetails = (updatedUser) => {
    setIsEditModalOpen(false);
  };

  return loginStatus ? (
    <div className="dashboard">
      <aside className="sidebar">
      <CgProfile className="profile-icon large" style={{ fontSize: "100px", width: "100px", height: "100px" }} />
        <h2 className="user-name">{currentUser.username}</h2>
        <p className="user-email">{currentUser.email}</p>
        <button
          className="edit-profile"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Details ✎
        </button>
      </aside>

      <main className="main-content">
        <h2 className="homepage-section-title">What's Cooking!!</h2>
        <section className="categories-section">
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <Link
                  to={`/recipes/category/${category.name.toLowerCase()}`}
                  aria-label={`Explore ${category.name}`}
                >
                  <div className="category-circle">
                    <img
                      src={category.img}
                      alt={category.name}
                      className="category-image"
                      loading="lazy"
                    />
                  </div>
                  <h5 className="category-name">{category.name}</h5>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="liked-recipes">
          <div className="liked-recipes-container">
            <h2>Your Liked Recipes</h2>
            {likedRecipes.length > 0 ? (
              <ul className="liked-recipes-list">
                {likedRecipes.map((recipe) => (
                  <li
                    key={recipe._id}
                    className="liked-recipe-item"
                    onClick={() =>
                      navigate(
                        `/recipe/${encodeURIComponent(
                          recipe.title.replace(/\s+/g, "-").toLowerCase()
                        )}`
                      )
                    }
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="recipe-thumbnail"
                    />
                    <span className="recipe-title">{recipe.title}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No liked recipes yet.</p>
            )}
          </div>
        </section>
      </main>

      <aside className="right-sidebar">
        <section className="fridge-section">
          <div className="recipe-history">
            <div className="d-flex justify-content-center mt-3">
              {recipes.length > 0 && (
                <Wheel
                  mustStartSpinning={mustSpin}
                  prizeNumber={prizeNumber}
                  data={recipes.map((r) => ({
                    option:
                      r.title.length > 17
                        ? r.title.substring(0, 20) + "..."
                        : r.title,
                  }))}
                  onStopSpinning={handleStopSpinning}
                  outerBorderColor="#0A122A"
                  outerBorderWidth={8}
                  innerBorderColor="#698F3F"
                  radiusLineColor="#fff"
                  radiusLineWidth={2}
                  textDistance={55}
                  fontSize={16}
                  backgroundColors={[
                    "#0A122A",
                    "#E7DECD",
                    "#698F3F",
                    "#FBFAF8",
                  ]}
                  textColors={["#E7DECD", "#0A122A"]}
                  pointerProps={{ src: pointerIcon }}
                />
              )}
            </div>

            <div className="d-flex flex-column">
              <button
                onClick={handleSpinClick}
                className="btn w-100 mt-2"
                style={{
                  backgroundColor: "#0A122A",
                  color: "#F8F6F1",
                  fontSize: "18px",
                  padding: "10px",
                  textAlign: "center",
                }}
              >
                Spin
              </button>
            </div>
            <button
              className="w-100"
              style={{
                backgroundColor: "#0A122A",
                color: "#F8F6F1",
                fontSize: "18px",
                padding: "10px",
                marginTop: "10px",
              }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              Past Recipes {showDropdown ? "▲" : "▼"}
            </button>
            {showDropdown && (
              <div className="recipe-history-dropdown" ref={dropdownRef}>
                {recipeHistory.length > 0 ? (
                  recipeHistory.map((recipe, index) => (
                    <div key={index} className="recipe-history-item">
                      <Link
                        to={`/recipe/${encodeURIComponent(
                          recipe.title.replace(/\s+/g, "-").toLowerCase()
                        )}`}
                        className="dropdown-link"
                      >
                        {recipe.title}
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="recipe-history-item">No recipes yet!</div>
                )}
              </div>
            )}
          </div>

          <p>What's in your fridge?</p>
          <CoolAI />
          <div
            className="card p-4 shadow-lg"
            style={{
              width: "22rem",
              backgroundColor: "#FBFAF8",
              color: "#0A122A",
            }}
          >
            <button className="btn-close position-absolute top-0 end-0 m-2"></button>

            <h4
              className="text-center fw-bold"
              style={{ color: "#0A122A" }}
            >
              ✨ disHcovery
            </h4>
            <p
              className="text-center text-muted"
              style={{ color: "#698F3F" }}
            >
              Turn your ingredients into a delicious surprise!
            </p>

            {!loginStatus && (
              <div
                className="alert alert-warning text-center"
                role="alert"
                style={{
                  backgroundColor: "#E7DECD",
                  color: "#0A122A",
                }}
              >
                <AccessDenied compact />
              </div>
            )}

            <div className="d-flex align-items-center mt-3">
              <input
                type="text"
                placeholder="Text 'hi' to get started"
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                className="form-control text-center"
                style={{
                  width: "85%",
                  backgroundColor: "#F8F6F1",
                  color: "#0A122A",
                  borderColor: "#E7DECD",
                }}
                disabled={!loginStatus}
              />
              <button
                className="btn w-25 ms-2"
                style={{ backgroundColor: "#698F3F", color: "#FBFAF8" }}
                onClick={handleSend}
                disabled={!loginStatus}
              >
                Send
              </button>
            </div>
          </div>
        </section>
      </aside>

      {isEditModalOpen && (
        <UserEditModal
          user={currentUser}
          onSave={handleSaveDetails}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  ) : (
    <AccessDenied />
  );
};

export default Dashboard;