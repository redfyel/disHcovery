import { useEffect } from "react";
import { FaUtensils, FaClock, FaConciergeBell, FaUsers } from "react-icons/fa";
import logo from "../../assets/images/logo_og.png";

const Print = ({ recipe, onAfterPrint }) => {
  useEffect(() => {
    if (!recipe) return;

    // Create a hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);

    const printDocument = iframe.contentWindow.document;
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Print Recipe</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .print-container { max-width: 1200px; margin: auto; text-align: left; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
            .logo { width: auto; height: 100px; opacity: 0.7; }
            .recipe-image { width: 100%; max-width: 250px; display: block; margin: 15px auto; border-radius: 10px; }
            .info { display: flex; flex-wrap: wrap; gap: 8px; padding: 10px; background: #f8f8f8; border-radius: 8px; }
            .tag { display: flex; align-items: center; background: #fffae5; padding: 5px 10px; border-radius: 15px; font-size: 14px; font-weight: bold; margin: 4px; }
            .tag svg { margin-right: 5px; }
            h3 { margin-top: 15px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          </style>
        </head>
        <body>
          <div class="print-container">
            <div class="header">
              <h1>${recipe.title}</h1>
              <img class="logo" src=${logo} alt="Dishcovery Logo" />
            </div>
            <img class="recipe-image" src="${recipe.image}" alt="${
      recipe.title
    }" />
            <div class="info">
              <div class="tag"><FaUtensils /> ${recipe.cuisine}</div>
              <div class="tag"><FaConciergeBell /> ${recipe.mealType}</div>
              <div class="tag"><FaClock /> Prep: ${recipe.preparationTime}</div>
              <div class="tag"><FaClock /> Cook: ${recipe.cookingTime}</div>
              <div class="tag"><FaClock /> Total: ${recipe.totalTime}</div>
              <div class="tag"><FaUsers /> Servings: ${recipe.servings}</div>
            </div>
            <h3>Ingredients:</h3>
            <ul>
              ${recipe.ingredients
                .map((ing) => `<li>${ing.amount} ${ing.unit} ${ing.name}</li>`)
                .join("")}
            </ul>
            <h3>Steps:</h3>
            <ol>
              ${recipe.steps.map((step) => `<li>${step}</li>`).join("")}
            </ol>
            ${
              recipe.allergyWarnings && recipe.allergyWarnings.length
                ? `
              <h3>Allergy Warnings:</h3>
              <ul>
                ${recipe.allergyWarnings
                  .map((warn) => `<li>${warn}</li>`)
                  .join("")}
              </ul>
            `
                : ""
            }
          </div>
          <script>
            window.addEventListener('load', function() {
              window.print();
            });
            window.addEventListener('afterprint', function() {
              // Cleanup: Remove the iframe and call callback if provided
              window.parent.document.body.removeChild(document.currentScript.parentNode.parentNode);
              if (${
                onAfterPrint ? "true" : "false"
              }) {\n                window.parent.__onAfterPrintCallback();\n              }\n            });
          </script>
        </body>
      </html>
    `;

    // Pass the onAfterPrint callback via a temporary global (clean this up afterward)
    if (onAfterPrint) {
      window.__onAfterPrintCallback = () => {
        onAfterPrint();
        delete window.__onAfterPrintCallback;
      };
    }

    printDocument.open();
    printDocument.write(printContent);
    printDocument.close();

    // No cleanup needed here; the iframe is removed in the script's afterprint listener.
  }, [recipe, onAfterPrint]);

  // return null; // This component doesn't render anything visible.
};

export default Print;
