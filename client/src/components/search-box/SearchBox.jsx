import React, {
    useState,
    useRef,
    useEffect,
    useCallback,
    useMemo,
  } from "react";
  import ReactDOM from "react-dom";
  
  // --- Helper Functions ---
  const useOutsideClick = (ref, callback) => {
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      };
  
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  };
  
  // --- Search Box Component ---
  function SearchBox({ searchTerm, searchInputRef, searchInputWrapperWidth }) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
  
    // Ingredients list (memoized for performance)
    const ingredients = useMemo(
      () => [
        {
          name: "Onion",
          image:
            "https://gyanagri.com/wp-content/uploads/2021/03/onion-images.jpg",
        },
        {
          name: "Garlic",
          image:
            "https://png.pngtree.com/png-vector/20240528/ourmid/pngtree-garlic-varieties-from-softneck-to-hardneck-a-natural-remedy-for-cold-png-image_12535998.png",
        },
        {
          name: "Eggs",
          image:
            "https://www.incredibleegg.org/wp-content/uploads/2023/07/AEB-IE_SectionLanding-FoodServices_Mobile_879x760_Egg-Types.jpg",
        },
        {
          name: "Mayonnaise",
          image:
            "https://as2.ftcdn.net/jpg/04/08/21/53/1000_F_408215396_qWlXQzFi8dMcMbSlKm8Zla1I5B0e6MCm.jpg",
        },
        {
          name: "Soy Sauce",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREJ75Fonpqnxz0HqD_hDC3LYmDOAaj8QGgCg&s",
        },
        {
          name: "Olive Oil",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPD6Q2zPXoJSjqtFu-h05k3K8932P5lCFbWsbGtlFo6ooO6sP20_hxTxCDRv2I3pxWlEI&usqp=CAU",
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
          name: "Vegetable Oil",
          image:
            "https://img.freepik.com/premium-photo/vegetable-oil-glass-bottle-isolated-white-background-with-clipping-path-organic-healthy-food-cooking_622428-3581.jpg",
        },
        {
          name: "Cheese",
          image:
            "https://c8.alamy.com/comp/DEJ9F6/swiss-cheese-isolated-on-a-white-background-DEJ9F6.jpg",
        },
        {
          name: "Chicken",
          image:
            "https://embed.widencdn.net/img/beef/4hh1pywcnj/800x600px/Grind_Fine_85.psd?keep=c&u=7fueml",
        },
        {
          name: "Frozen Peas",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaaVK1x6-n8H2KVaUm60mbdkhbjGgDqJPeLQ&s",
        },
        {
          name: "Bread",
          image:
            "https://img.freepik.com/premium-photo/bakery-products-isolated-white-background_176402-2928.jpg",
        },
        {
          name: "Potatoes",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDGy0xAELslHyhNKv6z6PuEaw6k-QBYVHkTA&s",
        },
      ],
      []
    );
  
    // Filtered ingredients
    const filteredIngredients = useMemo(
      () =>
        ingredients.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        ),
      [searchTerm, ingredients]
    );
  
    // --- Event Handlers ---
    const handleItemClick = (itemName) => {
      alert(`Woww! You selected ${itemName}`);
      setIsDropdownOpen(false); // Close dropdown after selection
    };
  
    // --- Outside Click Detection ---
    useOutsideClick(dropdownRef, () => {
      setIsDropdownOpen(false);
    });
  
    useEffect(() => {
      setIsDropdownOpen(true); // Open dropdown when SearchBox mounts
    }, []);
  
    // --- Dropdown Positioning ---
    const rect = searchInputRef.current?.getBoundingClientRect();
    const dropdownTop = rect ? rect.bottom + window.scrollY : 0;
    const dropdownLeft = rect ? rect.left + window.scrollX : 0;
  
    // Width adjustments to account for border, padding, shadow
    let adjustedWidth = searchInputWrapperWidth;
    const borderWidth = 2; // 1px border on each side (example)
    const paddingWidth = 15; // 10px padding on each side (example)
    const shadowWidth = 10; // Approximate shadow width (example)
  
    adjustedWidth -= borderWidth + paddingWidth + shadowWidth;
  
    // --- Render ---
    return (
      <div className="searchbox-container" style={{ position: "relative" }}>
        {isDropdownOpen &&
          ReactDOM.createPortal(
            <div
              ref={dropdownRef}
              className="search-dropdown"
              style={{
                position: "absolute",
                top: `${dropdownTop}px`,
                left: `${dropdownLeft}px`,
                zIndex: 1000,
                backgroundColor: "white",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
                padding: "10px",
                width: `${adjustedWidth}px`, // Use adjusted width
                boxSizing: "border-box", // Include padding and border in the width
                maxHeight: 'none', //REMOVE: remove max height if set
                overflowY: 'visible',   //REMOVE: remove vertical scrolling if set
                height : 'auto' // added here for all the items show in the drop down
              }}
            >
              {filteredIngredients.length > 0 ? (
                <div
                  className="ingredients-list"
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    //maxHeight: "200px",   //REMOVE: remove the item to show all elements
                    //overflowY: "auto",  //REMOVE: remove scrolling
                  }}
                >
                  {filteredIngredients.map((item) => (
                    <div
                      key={item.name}
                      className="ingredient-item"
                      onClick={() => handleItemClick(item.name)}
                      style={{
                        alignItems: "center",
                        backgroundColor: "#f3f4f6",
                        borderRadius: "20px",
                        cursor: "pointer",
                        display: "flex",
                        gap: "6px",
                        padding: "6px 12px",
                        transition: "background-color 0.2s",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          border: "1px solid #d1d5db",
                          borderRadius: "50%",
                          height: "24px",
                          width: "24px",
                        }}
                      />
                      <span style={{ fontSize: "14px", color: "#374151" }}>
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="no-ingredients"
                  style={{ color: "#6b7280", padding: "8px" }}
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