import { useState, useContext } from "react"; 
import { useForm } from "react-hook-form";
import Confetti from "react-confetti";
import "./UserPreferences.css";
import { userLoginContext } from "../../contexts/UserLoginContext";

export default function UserPreferences({ onComplete }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const { register, handleSubmit } = useForm();
  const { loginStatus, currentUser, setCurrentUser, token } = useContext(userLoginContext);

  const [preferences, setPreferences] = useState({
    userId: localStorage.getItem("userId") || "",  // Retrieve from local storage or auth state
    diet: "",
    restrictions: "",
    sex: "",
    birthYear: "",
    activityLevel: "",
    cookingSkill: "",
  });
  
  const onSubmit = async (data) => {
    if (!currentUser || !currentUser._id) {
      console.error("❌ Error: User ID is missing!");
      return;
    }
  
    // Construct request payload
    const requestData = {
      userId: currentUser._id,  // Ensure userId is present
      diet: data.diet || "None",
      restrictions: data.restrictions || "",
      sex: data.sex || "Other",
      birthYear: data.birthYear || "", // Ensure it's in YYYY-MM-DD format
      height: parseInt(data.height, 10) || 0,
      weight: parseInt(data.weight, 10) || 0,
      activityLevel: data.activityLevel || "Sedentary",
      cookingSkill: parseInt(data.cookingSkill, 10) || 1,
    };
  
    console.log("📤 Sending Request Data:", requestData);
  
    try {
      const response = await fetch("http://localhost:4000/user-api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include token if needed
        },
        body: JSON.stringify(requestData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Server Error:", errorData);
        throw new Error(`Failed to save preferences: ${errorData.message}`);
      }
  
      console.log("✅ Preferences saved successfully!");
      localStorage.setItem("onboardingComplete", "true");
      setShowConfetti(true);
  
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 3000);
    } catch (error) {
      console.error("❌ Error saving preferences:", error);
    }
  };
  

  return (
    <div className="preferences-container">
      {showConfetti && <Confetti />}
      <div className="preferences-card animate-appear">
        <h2 className="preferences-title">Tell Us About You!</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="preferences-form">
          <label className="preferences-label">Do you follow a special diet?</label>
          <select {...register("diet")} className="preferences-input">
            <option value="None">None</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Vegan">Vegan</option>
            <option value="Keto">Keto</option>
            <option value="Paleo">Paleo</option>
            <option value="Gluten-Free">Gluten-Free</option>
          </select>

          <label className="preferences-label">Are you avoiding any ingredients?</label>
          <input
            {...register("restrictions")}
            className="preferences-input"
            placeholder="E.g., Dairy, Nuts, Soy"
          />

          <div className="preferences-grid">
            <div>
              <label className="preferences-label">Sex</label>
              <select {...register("sex")} className="preferences-input">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="preferences-label">Date of Birth</label>
              <input
                type="date"
                {...register("birthYear")}
                className="preferences-input"
              />
            </div>
          </div>

          <div className="preferences-grid">
            <div>
              <label className="preferences-label">Height (cm)</label>
              <input
                type="number"
                {...register("height")}
                className="preferences-input"
              />
            </div>
            <div>
              <label className="preferences-label">Weight (kg)</label>
              <input
                type="number"
                {...register("weight")}
                className="preferences-input"
              />
            </div>
          </div>

          <label className="preferences-label">Activity Level</label>
          <select {...register("activityLevel")} className="preferences-input">
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
            <option value="Super Active">Super Active</option>
          </select>

          <label className="preferences-label">Cooking Skill Level</label>
          <input
            type="range"
            {...register("cookingSkill")}
            min="1"
            max="3"
            step="1"
            className="preferences-slider"
          />
          <div className="slider-labels">
            <span>Beginner</span>
            <span>Intermediate</span>
            <span>Advanced</span>
          </div>

          <button type="submit" className="preferences-submit">Save & Continue</button>
        </form>
      </div>
    </div>
  );
}
