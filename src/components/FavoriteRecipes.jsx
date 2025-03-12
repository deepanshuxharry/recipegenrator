import React, { useState, useEffect } from "react";
import { FaStar, FaRegStar, FaHeart, FaClock, FaUtensils } from "react-icons/fa";
import { Link } from "react-router-dom";

function FavoriteRecipes() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteRecipes");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const removeFromFavorites = (recipeId) => {
    const updatedFavorites = favorites.filter(
      (recipe) => recipe.id !== recipeId
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteRecipes", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-12">
          Your Favorite Recipes
        </h1>
        {favorites.length === 0 ? (
          <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
            <FaHeart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600 text-xl mb-6">Your recipe collection is empty</p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-medium hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg"
            >
              Discover Recipes
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((recipe) => (
              <div
                key={recipe.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="p-6 relative">
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromFavorites(recipe.id)}
                    className="absolute top-4 right-4 p-2 rounded-full text-red-500 hover:text-red-600 transition-colors"
                  >
                    <FaHeart className="w-5 h-5" />
                  </button>
  
                  {/* Recipe Name */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-4 pr-12 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>
  
                  {/* Rating Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex gap-1 text-orange-500">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star}>
                            {star <= recipe.rating ? (
                              <FaStar className="w-6 h-6" />
                            ) : (
                              <FaRegStar className="w-6 h-6" />
                            )}
                          </span>
                        ))}
                      </div>
                      <span className="ml-2 text-lg font-medium text-gray-600">
                        {recipe.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoriteRecipes;
