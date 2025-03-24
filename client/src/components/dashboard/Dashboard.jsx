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
import NoRecipesMessage from "../no-recipes/NoRecipesMessage";
import "./Dashboard.css";

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

  // Roulette
  useEffect(() => {
    async function fetchRouRecipes() {
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

    fetchRouRecipes();
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

        // console.log("Sending token:", token);

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

        // console.log("Recipe successfully saved to user:", data);

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

  const onRecipeSelect = (recipe) => {
    if (!recipe || !recipe.title) return;
    const sanitizedTitle = recipe.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");
    navigate(`/recipe/${sanitizedTitle}`);
  };

  // liked recipes
  useEffect(() => {
    if (!loginStatus || !currentUser?._id) return;

    const fetchLikedRecipes = async () => {
      try {
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
      <aside className="dashboard-sidebar">
        <CgProfile
          className="profile-icon large"
          style={{ fontSize: "100px", width: "100px", height: "100px" }}
        />
        <h2 className="dashboard-user-name">{currentUser.username}</h2>
        <p className="dashboard-user-email">{currentUser.email}</p>
        <button
          className="dashboard-edit-profile"
          onClick={() => setIsEditModalOpen(true)}
        >
          Edit Details 
        </button>

        {/* Preferences Section */}
        <h3 className="mt-5">Your Preferences</h3>
  {currentUser.preferences && (
    <div className="dashboard-preferences">
      <ul className="preferences-list">
        <li>
          <strong>Diet:</strong> {currentUser.preferences.diet}
        </li>
        <li>
          <strong>Restrictions:</strong> {currentUser.preferences.restrictions}
        </li>
        <li>
          <strong>Sex:</strong> {currentUser.preferences.sex}
        </li>
        <li>
          <strong>Birth Year:</strong> {currentUser.preferences.birthYear}
        </li>
        <li>
          <strong>Height:</strong>{" "}
          {currentUser.preferences.height?.$numberInt || currentUser.preferences.height}
        </li>
        <li>
          <strong>Weight:</strong>{" "}
          {currentUser.preferences.weight?.$numberInt || currentUser.preferences.weight}
        </li>
        <li>
          <strong>Activity Level:</strong> {currentUser.preferences.activityLevel}
        </li>
        <li>
          <strong>Cooking Skill:</strong>{" "}
          {currentUser.preferences.cookingSkill?.$numberInt || currentUser.preferences.cookingSkill}
        </li>
      </ul>
    </div>
  )}
      </aside>

      <main className="dashboard-main-content">
        <h2 className="dashboard-homepage-section-title">What's Cooking?</h2>
        <section className="dashboard-categories-section">
          <div className="dashboard-categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="dashboard-category-card">
                <Link
                  to={`/recipes/category/${category.name.toLowerCase()}`}
                  aria-label={`Explore ${category.name}`}
                >
                  <div className="dashboard-category-circle">
                    <img
                      src={category.img}
                      alt={category.name}
                      className="dashboard-category-image"
                      loading="lazy"
                    />
                  </div>
                  <h5 className="dashboard-category-name">{category.name}</h5>
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-liked-recipes">
          <div className="dashboard-liked-recipes-container">
            <h2>Your Liked Recipes</h2>
            {likedRecipes.length > 0 ? (
              <ul className="dashboard-liked-recipes-list">
                {likedRecipes.map((recipe) => (
                  <li
                    key={recipe._id}
                    className="dashboard-liked-recipe-item"
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
                      className="dashboard-recipe-thumbnail"
                    />
                    <span className="dashboard-recipe-title">
                      {recipe.title}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <NoRecipesMessage type="liked" />
            )}
          </div>
        </section>
      </main>

      <aside className="dashboard-right-sidebar">
        <div className="dashboard-recipe-history">
          {/* Container that holds either the roulette wheel or the result */}
          <div className="d-flex justify-content-center mt-3">
            {!selectedRecipe ? (
              <div
                style={{ transform: "scale(0.85)", transformOrigin: "center" }}
              >
                {recipes && recipes.filter((r) => r && r.title).length > 0 && (
                  <Wheel
                    mustStartSpinning={mustSpin}
                    prizeNumber={prizeNumber}
                    data={recipes
                      .filter((r) => r && r.title)
                      .map((r) => ({
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
            ) : (
              <div style={{ textAlign: "center" }}>
                <h1 className="mt-2 rou-recipe-title">
                  You got{" "}
                  <span className="rou-recipe-name">
                    {selectedRecipe.title}
                  </span>
                  !
                </h1>
                <p style={{ color: "#0A122A" }}>Your dinner fate is sealed!</p>
                {selectedRecipe.image && (
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.title}
                    className="img-fluid rounded shadow mt-3"
                    style={{ maxHeight: "250px", objectFit: "cover" }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Button section */}
          <div className="d-flex flex-column mt-3">
            {!selectedRecipe ? (
              <button
                onClick={handleSpinClick}
                className="btn w-100"
                style={{
                  backgroundColor: "#0A122A",
                  color: "#FBFAF8",
                  fontSize: "20px",
                  padding: "10px",
                }}
              >
                Spin & Feast!
              </button>
            ) : (
              <div className="d-flex flex-column">
                <button
                  onClick={() => onRecipeSelect(selectedRecipe)}
                  className="btn w-100 mt-3"
                  style={{
                    backgroundColor: "#698F3F",
                    color: "#FBFAF8",
                    fontSize: "18px",
                    padding: "10px",
                  }}
                >
                  Get Cooking
                </button>
                <button
                  onClick={() => {
                    setSelectedRecipe(null);
                  }}
                  className="btn w-100 mt-2"
                  style={{
                    backgroundColor: "#0A122A",
                    color: "#F8F6F1",
                    fontSize: "18px",
                    padding: "10px",
                  }}
                >
                  Back 
                </button>
              </div>
            )}
          </div>

          {/* Past spun recipes dropdown */}
          <button
            className="w-50 mt-3"
            style={{
              backgroundColor: "#0A122A",
              color: "#F8F6F1",
              fontSize: "18px",
              padding: "10px",
              marginTop: "10px",
            }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            Past Spun Recipes {showDropdown ? "▲" : "▼"}
          </button>
          {showDropdown && (
            <div
              className="dashboard-recipe-history-dropdown"
              ref={dropdownRef}
            >
              {recipeHistory.length > 0 ? (
                recipeHistory.map((recipe, index) => (
                  <div key={index} className="dashboard-recipe-history-item">
                    <Link
                      to={`/recipe/${encodeURIComponent(
                        recipe.title.replace(/\s+/g, "-").toLowerCase()
                      )}`}
                      className="dashboard-dropdown-link"
                    >
                      {recipe.title}
                    </Link>
                  </div>
                ))
              ) : (
                <NoRecipesMessage type="roulette" />
              )}
            </div>
          )}
        </div>
        <hr />
        <h2>What's in your fridge?</h2>
        <div
          className="card p-4 shadow-lg"
          style={{
            width: "22rem",
            backgroundColor: "#FBFAF8",
            color: "#0A122A",
          }}
        >
          <button className="btn-close position-absolute top-0 end-0 m-2"></button>
          <h4 className="text-center fw-bold" style={{ color: "#0A122A" }}>
            ✨ disHcovery
          </h4>
          <p className="text-center text-muted" style={{ color: "#698F3F" }}>
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
