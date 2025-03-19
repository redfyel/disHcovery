import { useState } from "react";
import { useForm } from "react-hook-form";
import Confetti from "react-confetti";
import "./UserPreferences.css";

export default function UserPreferences({ onComplete }) {
  const [showConfetti, setShowConfetti] = useState(false);
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log("User Preferences:", data);
    localStorage.setItem("onboardingComplete", "true");
    setShowConfetti(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
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
              <input type="date" {...register("birthYear")} className="preferences-input" />
            </div>
          </div>

          <div className="preferences-grid">
            <div>
              <label className="preferences-label">Height (cm)</label>
              <input type="number" {...register("height")} className="preferences-input" />
            </div>
            <div>
              <label className="preferences-label">Weight (kg)</label>
              <input type="number" {...register("weight")} className="preferences-input" />
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
