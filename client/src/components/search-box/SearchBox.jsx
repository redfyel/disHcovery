import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";

// --- Search Box Component ---
function SearchBox({
    searchTerm,
    searchInputRef,
    searchInputWrapperWidth,
    setRecipes,
    setIsDropdownVisible,
    dropdownRef,
}) {
    const navigate = useNavigate();
    const [selectedIngredients, setSelectedIngredients] = useState([]);

    // Toggle selection for an ingredient
    const handleItemClick = (itemName) => {
        setSelectedIngredients((prev) =>
            prev.includes(itemName)
                ? prev.filter((ing) => ing !== itemName)
                : [...prev, itemName]
        );
    };

    // Handler to navigate to the recipes page with selected ingredients
    const handleShowRecipes = (e) => {
        e.stopPropagation();
        // console.log("Show Recipes button clicked", selectedIngredients);
        navigate("/recipes/by-ingredients/" + selectedIngredients.join(","));
        setIsDropdownVisible(false);
    };

    const ingredients = useMemo(
        () => [
            { name: "Onion", image: "https://gyanagri.com/wp-content/uploads/2021/03/onion-images.jpg" },
            { name: "Garlic", image: "https://png.pngtree.com/png-vector/20240528/ourmid/pngtree-garlic-varieties-from-softneck-to-hardneck-a-natural-remedy-for-cold-png-image_12535998.png" },
            { name: "Eggs", image: "https://www.incredibleegg.org/wp-content/uploads/2023/07/AEB-IE_SectionLanding-FoodServices_Mobile_879x760_Egg-Types.jpg" },
           
            {
                name: "Potatoes",
                image:
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDGy0xAELslHyhNKv6z6PuEaw6k-QBYVHkTA&s",
            },
            {
                name: "Milk",
                image:
                    "https://media.istockphoto.com/id/183778031/photo/milk-bottle-clipping-path.jpg?s=612x612&w=0&k=20&c=RC3dmJPzsBSGnpfRtY0wjjb5G-LOLvxP4ZNmu_yJ8Qk=",
            },
            {
                name: "Butter",
                image:
                    "https://media.istockphoto.com/id/177834117/photo/butter-isolated-on-white.jpg?s=612x612&w=0&k=20&c=wKXNDSvB-tzfT9RPdmKsH2JAGpBv7OISdUmGdegupxg=",
            },
            {
                name: "Cheese",
                image:
                    "https://c8.alamy.com/comp/DEJ9F6/swiss-cheese-isolated-on-a-white-background-DEJ9F6.jpg",
            },
            {
                name: "Chicken",
                image:
                    "https://images.jdmagicbox.com/quickquotes/images_main/fresh-frozen-chicken-2219887756-p3zqtoc9.jpg",
            },
            {
                name: "Bread",
                image:
                    "https://img.freepik.com/premium-photo/bakery-products-isolated-white-background_176402-2928.jpg",
            },
            {
                name: "Beef",
                image:
                    "https://embed.widencdn.net/img/beef/4hh1pywcnj/800x600px/Grind_Fine_85.psd?keep=c&u=7fueml",
            },
            {
                name: "Lemon",
                image:
                    "https://media.istockphoto.com/id/1456512861/vector/lime-and-lemon-composition-fresh-citrus-fruits-whole-halves-and-slices-fruits-realistic-3d.jpg?s=612x612&w=0&k=20&c=ffBSgWnoBE7D0bdBMFES_O4_KeW1MUgcLVD4mxWNn8k=",
            },
            {
                name: "Tofu",
                image:
                    "https://thumbs.dreamstime.com/b/tofu-cheese-isolated-white-background-clipping-path-full-depth-field-181352721.jpg",
            },

        ],
        []
    );

    const filteredIngredients = useMemo(
        () => ingredients.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase())),
        [searchTerm, ingredients]
    );

    // Positioning the dropdown relative to the search input
    const rect = searchInputRef.current?.getBoundingClientRect();
    const dropdownTop = rect ? rect.bottom + window.scrollY : 0;
    const dropdownLeft = rect ? rect.left + window.scrollX : 0;

    return (
        <div style={{ position: "relative", width: "60%", display: "flex", justifyContent: "center" }}>
            {ReactDOM.createPortal(
                <div
                    ref={dropdownRef}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="search-dropdown"
                    style={{
                        position: "absolute",
                        top: `${dropdownTop}px`,
                        left: `${dropdownLeft}px`,
                        zIndex: 1000,
                        backgroundColor: "white",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        boxShadow: "0 2px 5px #698F3F",
                        padding: "10px",
                        width: searchInputWrapperWidth ? `${searchInputWrapperWidth}px` : "auto",
                        maxWidth: "400px",
                        boxSizing: "border-box",
                        maxHeight: "unset", // ❌ Remove fixed height
                        overflowY: "visible", // ❌ Remove scroll
                    }}
                >
                    {filteredIngredients.length > 0 ? (
                        <div
                            className="ingredients-list"
                            style={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                                justifyContent: "center",
                            }}
                        >
                            {filteredIngredients.map((item) => (
                                <div
                                    key={item.name}
                                    className="ingredient-item"
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleItemClick(item.name);
                                    }}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        backgroundColor: selectedIngredients.includes(item.name)
                                            ? "#79a54a"
                                            : "#f3f4f6",
                                        borderRadius: "20px",
                                        cursor: "pointer",
                                        padding: "4px 10px",
                                        transition: "background-color 0.2s",
                                        fontSize: "15px",
                                        flex: "1 1 90px",
                                        justifyContent: "center",
                                        minWidth: "70px",
                                    }}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            border: "1px solid #698F3F",
                                            borderRadius: "70%",
                                            height: "24px",
                                            width: "24px",
                                            marginRight: "6px",
                                        }}
                                    />
                                    <span style={{ color: "#0A122A" }}>{item.name}</span>
                                </div>
                            ))}
                            <button
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={handleShowRecipes}
                                style={{
                                    backgroundColor: "#698F3F",
                                    color: "white",
                                    padding: "10px 15px",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    marginTop: "10px",
                                    width: "100%",
                                    maxWidth: "400px",
                                }}
                            >
                                Show Recipes with ({selectedIngredients.length}) ingredients
                            </button>
                        </div>
                    ) : (
                        <div
                            className="no-ingredients"
                            style={{ color: "#6b7280", padding: "8px", textAlign: "center" }}
                        >
                            No ingredients found
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
}

export default SearchBox;
