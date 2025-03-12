import React, { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

function IngredientSelector({ selectedIngredients, setSelectedIngredients, setIngredients }) {
  const [customIngredient, setCustomIngredient] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Categorized ingredients
  const ingredientCategories = {
    protein: ["Chicken", "Beef", "Pork", "Salmon", "Shrimp", "Tofu", "Lentils", "Beans", "Eggs"],
    vegetables: ["Tomatoes", "Onions", "Garlic", "Bell Peppers", "Carrots", "Broccoli", "Spinach", "Mushrooms", "Avocado", "Corn", "Cucumber", "Zucchini"],
    carbs: ["Rice", "Pasta", "Potatoes", "Quinoa", "Bread", "Oats"],
    dairy: ["Cheese", "Milk", "Butter", "Yogurt", "Cream"],
    other: ["Lemon", "Lime", "Olive Oil", "Soy Sauce", "Honey", "Maple Syrup", "Nuts"]
  };

  // Non-vegetarian ingredients for warning
  const nonVegIngredients = ["Chicken", "Beef", "Pork", "Salmon", "Shrimp"];
  
  // Get all ingredients or filtered by category
  const getFilteredIngredients = () => {
    if (categoryFilter === "all") {
      return Object.values(ingredientCategories).flat();
    }
    return ingredientCategories[categoryFilter] || [];
  };

  // Handle clicking on ingredient chips
  const handleIngredientSelect = (ingredient) => {
    if (!selectedIngredients.includes(ingredient)) {
      const newSelected = [...selectedIngredients, ingredient];
      setSelectedIngredients(newSelected);
      setIngredients(newSelected.join(", "));
    }
  };

  // Remove an ingredient from the selection
  const removeIngredient = (ingredient) => {
    const newSelected = selectedIngredients.filter(item => item !== ingredient);
    setSelectedIngredients(newSelected);
    setIngredients(newSelected.join(", "));
  };

  // Add custom ingredient
  const addCustomIngredient = () => {
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient.trim())) {
      const newSelected = [...selectedIngredients, customIngredient.trim()];
      setSelectedIngredients(newSelected);
      setIngredients(newSelected.join(", "));
      setCustomIngredient("");
    }
  };

  // Handle custom ingredient input
  const handleCustomIngredientInput = (e) => {
    setCustomIngredient(e.target.value);
    if (e.key === 'Enter') {
      addCustomIngredient();
    }
  };

  // Check if there are non-veg ingredients in selection
  const hasNonVegIngredients = selectedIngredients.some(ing => 
    nonVegIngredients.includes(ing)
  );

  return (
    <div className="w-full">
      <div className="mb-4">
        <p className="text-gray-700 mb-2 font-medium">Select Ingredients:</p>
        
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button 
            onClick={() => setCategoryFilter("all")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              categoryFilter === "all" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setCategoryFilter("protein")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              categoryFilter === "protein" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Proteins
          </button>
          <button 
            onClick={() => setCategoryFilter("vegetables")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              categoryFilter === "vegetables" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Vegetables
          </button>
          <button 
            onClick={() => setCategoryFilter("carbs")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              categoryFilter === "carbs" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Carbs
          </button>
          <button 
            onClick={() => setCategoryFilter("dairy")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              categoryFilter === "dairy" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Dairy
          </button>
          <button 
            onClick={() => setCategoryFilter("other")}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              categoryFilter === "other" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Other
          </button>
        </div>
        
        {/* Custom ingredient input */}
        <div className="flex mb-4">
          <input
            type="text"
            value={customIngredient}
            onChange={(e) => setCustomIngredient(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addCustomIngredient()}
            placeholder="Add your own ingredient..."
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            onClick={addCustomIngredient}
            className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition-colors"
          >
            <FaPlus />
          </button>
        </div>
        
        {/* Ingredient selection */}
        <div className="flex flex-wrap gap-2 mb-4 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded-md">
          {getFilteredIngredients().map((ingredient) => (
            <button
              key={ingredient}
              onClick={() => handleIngredientSelect(ingredient)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedIngredients.includes(ingredient) 
                  ? "bg-orange-500 text-white" 
                  : nonVegIngredients.includes(ingredient)
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-orange-100 text-orange-700 hover:bg-orange-200"
              }`}
            >
              {nonVegIngredients.includes(ingredient) && "🍖 "}
              {ingredient}
            </button>
          ))}
        </div>
      </div>

      {/* Selected ingredients */}
      {selectedIngredients.length > 0 && (
        <div className="mt-4 mb-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-700 mb-2 font-medium">Your Selected Ingredients:</p>
            <button 
              onClick={() => {
                setSelectedIngredients([]);
                setIngredients("");
              }}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedIngredients.map((ingredient) => (
              <div
                key={ingredient}
                className={`flex items-center px-3 py-1 rounded-full ${
                  nonVegIngredients.includes(ingredient)
                    ? "bg-red-200 text-red-800"
                    : "bg-orange-200 text-orange-800"
                }`}
              >
                {nonVegIngredients.includes(ingredient) && "🍖 "}
                {ingredient}
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="ml-1 text-orange-700 hover:text-orange-900"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warning for non-veg ingredients */}
      {hasNonVegIngredients && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4 rounded">
          <p className="font-medium">Note:</p>
          <p className="text-sm">You've selected non-vegetarian ingredients. If you choose vegetarian or vegan dietary preferences, our system will suggest appropriate substitutes.</p>
        </div>
      )}
    </div>
  );
}

export default IngredientSelector;