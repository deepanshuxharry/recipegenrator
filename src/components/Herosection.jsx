import React, { useState, useEffect } from "react";
import {
  FaCamera,
  FaSearch,
  FaClock,
  FaUtensils,
  FaStar,
  FaRegStar,
  FaFilter,
} from "react-icons/fa";
import IngredientSelector from "./IngredientSelector";
import RecipeService from "./RecipeService";

function Herosection() {
  const [ingredients, setIngredients] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [dietaryPreferences, setDietaryPreferences] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cookingTime: "all",
    difficulty: "all",
  });
  const [servingSize, setServingSize] = useState(4);
  const nonVegIngredients = [
    "chicken",
    "beef",
    "pork",
    "fish",
    "shrimp",
    "lamb",
    "turkey",
    "bacon",
  ];
  const [validationError, setValidationError] = useState(null);

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Non-Vegetarian",
    "Gluten-Free",
  ];

  // Load saved recipes from local storage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("savedRecipes");
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  // Add this useEffect to load favorites on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteRecipes");
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      // Update recipes with saved status
      setRecipes((prevRecipes) =>
        prevRecipes.map((recipe) => ({
          ...recipe,
          saved: parsedFavorites.some((fav) => fav.id === recipe.id),
          rating:
            parsedFavorites.find((fav) => fav.id === recipe.id)?.rating || 0,
        }))
      );
    }
  }, []);

  // Handle dietary preference selection
  const handleDietaryChange = (preference) => {
    setValidationError(null);

    // Check if switching to vegetarian/vegan with non-veg ingredients
    if (
      (preference === "Vegetarian" || preference === "Vegan") &&
      selectedIngredients.some((ing) =>
        nonVegIngredients.includes(ing.toLowerCase())
      )
    ) {
      setValidationError(
        "Cannot select Vegetarian/Vegan with non-vegetarian ingredients"
      );
      return;
    }

    // If selecting Non-Vegetarian with veg preferences
    if (
      preference === "Non-Vegetarian" &&
      (dietaryPreferences.includes("Vegetarian") ||
        dietaryPreferences.includes("Vegan"))
    ) {
      setDietaryPreferences((prev) => [
        ...prev.filter((p) => p !== "Vegetarian" && p !== "Vegan"),
        preference,
      ]);
      return;
    }

    // Normal toggle behavior for other cases
    setDietaryPreferences((prev) =>
      prev.includes(preference)
        ? prev.filter((p) => p !== preference)
        : [...prev, preference]
    );
  };

  // Generate recipes using the API
  const generateRecipes = async () => {
    if (selectedIngredients.length === 0) {
      setError("Please select at least one ingredient");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Log the inputs for debugging
      console.log("Generating recipes with:", {
        ingredients: selectedIngredients.join(", "),
        preferences: dietaryPreferences,
      });

      const processedRecipes = await RecipeService.generateRecipes(
        selectedIngredients.join(", "),
        dietaryPreferences,
        selectedIngredients
      );

      if (!processedRecipes || processedRecipes.length === 0) {
        throw new Error(
          "No recipes found. Try different ingredients or preferences."
        );
      }

      // Log successful recipes
      console.log("Generated recipes:", processedRecipes);

      setRecipes(processedRecipes);
      setError(null);
    } catch (err) {
      console.error("Recipe generation error:", err);
      setError(
        err.message ||
          "Failed to generate recipes. Please try different ingredients."
      );
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Save or unsave a recipe
  const toggleSaveRecipe = (recipe) => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favoriteRecipes") || "[]"
    );

    let updatedFavorites;
    if (recipe.saved) {
      // Remove from favorites
      updatedFavorites = savedFavorites.filter((fav) => fav.id !== recipe.id);
    } else {
      // Add to favorites
      updatedFavorites = [...savedFavorites, { ...recipe, saved: true }];
    }

    // Update localStorage
    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));

    // Update UI
    setRecipes((prevRecipes) =>
      prevRecipes.map((r) =>
        r.id === recipe.id ? { ...r, saved: !r.saved } : r
      )
    );
  };

  // Rate a recipe
  const rateRecipe = (recipe, rating) => {
    const savedFavorites = JSON.parse(
      localStorage.getItem("favoriteRecipes") || "[]"
    );
    const updatedFavorites = savedFavorites.map((fav) =>
      fav.id === recipe.id ? { ...fav, rating } : fav
    );

    if (!recipe.saved) {
      updatedFavorites.push({ ...recipe, rating, saved: true });
    }

    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));

    setRecipes((prevRecipes) =>
      prevRecipes.map((r) =>
        r.id === recipe.id ? { ...r, rating, saved: true } : r
      )
    );
  };

  // Get filtered recipes
  const filteredRecipes = RecipeService.filterRecipes(recipes, filters);

  return (
    <div className="min-h-[90vh] bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center px-4 py-8">
      <div className="text-center mb-8 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Transform Your Ingredients into Delicious Recipes
        </h1>
        <p className="text-lg text-gray-600">
          Select ingredients from our list to discover perfect recipe matches
        </p>
      </div>

      <div className="w-full max-w-2xl mb-8">
        {validationError && (
          <div className="text-red-500 bg-red-50 p-3 rounded-md mb-4">
            {validationError}
          </div>
        )}

        <IngredientSelector
          selectedIngredients={selectedIngredients}
          setSelectedIngredients={(ingredients) => {
            // Validate new ingredient selections
            const hasNonVeg = ingredients.some((ing) =>
              nonVegIngredients.includes(ing.toLowerCase())
            );
            if (
              hasNonVeg &&
              (dietaryPreferences.includes("Vegetarian") ||
                dietaryPreferences.includes("Vegan"))
            ) {
              setValidationError(
                "Cannot add non-vegetarian ingredients with vegetarian preferences"
              );
              return;
            }
            setValidationError(null);
            setSelectedIngredients(ingredients);
          }}
          setIngredients={setIngredients}
        />

        <div className="mt-6">
          <p className="text-gray-700 mb-2 font-medium">Dietary Preferences:</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {dietaryOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleDietaryChange(option)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                  ${
                    dietaryPreferences.includes(option)
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-700 border-2 border-orange-300 hover:bg-orange-100"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateRecipes}
          disabled={loading || selectedIngredients.length === 0}
          className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-4 rounded-full font-bold text-lg hover:from-orange-500 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Generating..." : "Generate Recipes"}
        </button>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>

      {/* Recipe Results Section */}
      {loading && (
        <div className="w-full max-w-6xl mt-12 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 bg-orange-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-orange-100 rounded w-2/3 mb-2"></div>
            <div className="h-4 bg-orange-100 rounded w-1/2 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-orange-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && recipes.length > 0 && (
        <div className="w-full max-w-6xl mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Your Personalized Recipes
            </h2>

            <div className="flex items-center gap-4">
              {/* Serving size adjustment */}
              <div className="flex items-center bg-white shadow-sm rounded-md px-2 py-1">
                <span className="text-sm text-gray-700 mr-2">Servings:</span>
                <button
                  onClick={() => setServingSize(Math.max(1, servingSize - 1))}
                  className="text-orange-500 hover:text-orange-700 px-2 py-1"
                >
                  -
                </button>
                <span className="font-medium text-gray-800 w-6 text-center">
                  {servingSize}
                </span>
                <button
                  onClick={() => setServingSize(servingSize + 1)}
                  className="text-orange-500 hover:text-orange-700 px-2 py-1"
                >
                  +
                </button>
              </div>

              {/* Filter button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 bg-white px-3 py-2 rounded-md shadow-sm hover:bg-gray-50"
              >
                <FaFilter className="text-orange-500" />
                <span className="text-gray-700">Filter</span>
              </button>
            </div>
          </div>

          {/* Filters section */}
          {showFilters && (
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    Cooking Time
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        setFilters({ ...filters, cookingTime: "all" })
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.cookingTime === "all"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, cookingTime: "quick" })
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.cookingTime === "quick"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Quick (&lt;30 min)
                    </button>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, cookingTime: "medium" })
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.cookingTime === "medium"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Medium (30-60 min)
                    </button>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, cookingTime: "slow" })
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.cookingTime === "slow"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Slow (&gt;60 min)
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">Difficulty</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setFilters({ ...filters, difficulty: "all" })
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.difficulty === "all"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, difficulty: "easy" })
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.difficulty === "easy"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Easy
                    </button>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, difficulty: "medium" })
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.difficulty === "medium"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Medium
                    </button>
                    <button
                      onClick={() =>
                        setFilters({ ...filters, difficulty: "hard" })
                      }
                      className={`px-3 py-1 rounded-full text-sm ${
                        filters.difficulty === "hard"
                          ? "bg-orange-500 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      Hard
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {filteredRecipes.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-gray-700">
                No recipes match your current filters.
              </p>
              <button
                onClick={() =>
                  setFilters({ cookingTime: "all", difficulty: "all" })
                }
                className="mt-4 text-orange-500 hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="bg-gradient-to-r from-orange-300 to-red-300 h-4"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {recipe.title}
                      </h3>
                      <button
                        onClick={() => toggleSaveRecipe(recipe)}
                        className={`ml-2 text-xl ${
                          recipe.saved
                            ? "text-orange-500"
                            : "text-gray-300 hover:text-orange-500"
                        }`}
                      >
                        ★
                      </button>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <div className="flex items-center mr-3">
                        <FaClock className="mr-1 text-orange-500" />
                        <span>{recipe.totalTime}</span>
                      </div>
                      <div className="flex items-center">
                        <FaUtensils className="mr-1 text-orange-500" />
                        <span>{recipe.difficulty}</span>
                      </div>
                    </div>

                    {/* Recipe rating */}
                    <div className="flex items-center mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => rateRecipe(recipe, star)}
                          className="text-lg text-orange-400 hover:text-orange-600"
                        >
                          {star <= recipe.rating ? <FaStar /> : <FaRegStar />}
                        </button>
                      ))}
                      <span className="ml-2 text-xs text-gray-500">
                        {recipe.rating > 0
                          ? `${recipe.rating}/5`
                          : "Rate this recipe"}
                      </span>
                    </div>

                    {/* Nutrition info */}
                    <div className="grid grid-cols-4 gap-1 text-xs text-center mb-4 bg-orange-50 rounded-md p-2">
                      <div>
                        <div className="font-semibold text-orange-800">
                          Calories
                        </div>
                        <div>{recipe.nutrition.calories}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-orange-800">
                          Protein
                        </div>
                        <div>{recipe.nutrition.protein}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-orange-800">
                          Carbs
                        </div>
                        <div>{recipe.nutrition.carbs}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-orange-800">Fat</div>
                        <div>{recipe.nutrition.fat}</div>
                      </div>
                    </div>

                    {/* Full Ingredients List */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-orange-600 mb-2">
                        Ingredients:
                      </h4>
                      <ul className="list-disc pl-5 text-gray-700 text-sm max-h-64 overflow-y-auto pr-2">
                        {RecipeService.adjustRecipeForServings(
                          recipe.ingredients,
                          servingSize
                        ).map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Full Instructions */}
                    <div>
                      <h4 className="font-semibold text-orange-600 mb-2">
                        Instructions:
                      </h4>
                      <div className="text-gray-700 text-sm max-h-96 overflow-y-auto pr-2">
                        {recipe.instructions.map((step, i) => (
                          <p key={i} className="mb-3">
                            <span className="font-medium">{i + 1}.</span> {step}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Herosection;
