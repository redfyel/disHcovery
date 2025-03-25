import React, { useState, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import Confetti from "react-confetti";
import "./UserPreferences.css";
import { userLoginContext } from "../../contexts/UserLoginContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faBan, faVenusMars, faCalendar, faRulerVertical, faWeight, faRunning, faLevelUpAlt } from '@fortawesome/free-solid-svg-icons';

export default function UserPreferences({ onComplete }) {
    const [showConfetti, setShowConfetti] = useState(false);
    const { register, handleSubmit } = useForm();
    const { loginStatus, currentUser, setCurrentUser, token } = useContext(
        userLoginContext
    );

    const [preferences, setPreferences] = useState({
        userId: localStorage.getItem("userId") || "", // Retrieve from local storage or auth state
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
            userId: currentUser._id, // Ensure userId is present
            diet: data.diet || "None",
            restrictions: data.restrictions || "",
            sex: data.sex || "Other",
            birthYear: data.birthYear || "", // Ensure it's in YYYY-MM-DD format
            height: parseInt(data.height, 10) || 0,
            weight: parseInt(data.weight, 10) || 0,
            activityLevel: data.activityLevel || "Sedentary",
            cookingSkill: parseInt(data.cookingSkill, 10) || 1,
        };


        try {
            const response = await fetch(
                "https://dishcovery-j22s.onrender.com/user-api/preferences",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // Include token if needed
                    },
                    body: JSON.stringify(requestData),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Server Error:", errorData);
                throw new Error(`Failed to save preferences: ${errorData.message}`);
            }

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
        <div className="preferencesContainer">
            {showConfetti && <Confetti />}
            <div className="preferencesCard">
                <h2 className="preferencesTitle">Tell Us About You!</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="preferencesForm">
                    <label className="preferencesLabel">
                        <FontAwesomeIcon icon={faUtensils} className="icon" />
                        Do you follow a special diet?
                    </label>
                    <select
                        {...register("diet")}
                        className="preferencesInput"
                    >
                        <option value="None">None</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Vegan">Vegan</option>
                        <option value="Keto">Keto</option>
                        <option value="Paleo">Paleo</option>
                        <option value="Gluten-Free">Gluten-Free</option>
                    </select>

                    <label className="preferencesLabel">
                        <FontAwesomeIcon icon={faBan} className="icon" />
                        Are you avoiding any ingredients?
                    </label>
                    <input
                        {...register("restrictions")}
                        className="preferencesInput"
                        placeholder="E.g., Dairy, Nuts, Soy"
                    />

                    <div className="preferencesGrid">
                        <div>
                            <label className="preferencesLabel">
                                <FontAwesomeIcon icon={faVenusMars} className="icon" />
                                Sex
                            </label>
                            <select
                                {...register("sex")}
                                className="preferencesInput"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="preferencesLabel">
                                <FontAwesomeIcon icon={faCalendar} className="icon" />
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                {...register("birthYear")}
                                className="preferencesInput"
                            />
                        </div>
                    </div>

                    <div className="preferencesGrid">
                        <div>
                            <label className="preferencesLabel">
                                <FontAwesomeIcon icon={faRulerVertical} className="icon" />
                                Height (cm)
                            </label>
                            <input
                                type="number"
                                {...register("height")}
                                className="preferencesInput"
                            />
                        </div>
                        <div>
                            <label className="preferencesLabel">
                                <FontAwesomeIcon icon={faWeight} className="icon" />
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                {...register("weight")}
                                className="preferencesInput"
                            />
                        </div>
                    </div>

                    <label className="preferencesLabel">
                        <FontAwesomeIcon icon={faRunning} className="icon" />
                        Activity Level
                    </label>
                    <select
                        {...register("activityLevel")}
                        className="preferencesInput"
                    >
                        <option value="Sedentary">Sedentary</option>
                        <option value="Lightly Active">Lightly Active</option>
                        <option value="Moderately Active">Moderately Active</option>
                        <option value="Very Active">Very Active</option>
                        <option value="Super Active">Super Active</option>
                    </select>

                    <label className="preferencesLabel">
                        <FontAwesomeIcon icon={faLevelUpAlt} className="icon" />
                        Cooking Skill Level
                    </label>
                    <input
                        type="range"
                        {...register("cookingSkill")}
                        min="1"
                        max="3"
                        step="1"
                        className="preferencesSlider"
                    />
                    <div className="sliderLabels">
                        <span>Beginner</span>
                        <span>Intermediate</span>
                        <span>Advanced</span>
                    </div>

                    <button type="submit" className="preferencesSubmit">
                        Save & Continue
                    </button>
                </form>
            </div>
        </div>
    );
}