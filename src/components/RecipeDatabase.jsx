import React, { useState, useEffect } from "react";
import { client, urlFor } from "../../sanity-config/client";
import imageUrlBuilder from "@sanity/image-url";
import { useNavigate } from "react-router-dom";

import {
  FaClock,
  FaUtensils,
  FaHeart,
  FaRegHeart,
  FaSearch,
} from "react-icons/fa";
import { BiDish } from "react-icons/bi";
import { MdOutlineFoodBank } from "react-icons/md";

// const builder = imageUrlBuilder(client);
// const urlFor = (source) => builder.image(source);

function RecipeDatabase() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const query = `*[_type == "recipe"] {
        _id,
        title,
        description,
        cookingTime,
        difficulty,
        cuisine,
        imageUrl,
        likes,
        ingredients,
        instructions,
        category
      }`;
      const data = await client.fetch(query);
      setRecipes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setLoading(false);
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || recipe.category === filter;
    return matchesSearch && matchesFilter;
  });

  const handleViewRecipe = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Discover Delicious Recipes
          </h1>
          {/* Search and Filter Section */}
          <div className="flex flex-wrap gap-4 items-center justify-center mb-6 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="dessert">Dessert</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white rounded-xl shadow-lg p-4"
              >
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRecipes.map((recipe) => (
              <div
                key={recipe._id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden transform perspective-1000 hover:rotate-y-2 hover:scale-105 transition-all duration-500 hover:shadow-2xl"
              >
                {/* Image Section */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={
                      recipe.imageUrl
                        ? urlFor(recipe.imageUrl).url()
                        : "https://via.placeholder.com/400x300"
                    }
                    alt={recipe.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <span className="px-3 py-1 bg-white/90 text-orange-600 rounded-full text-sm font-medium backdrop-blur-sm">
                      {recipe.category}
                    </span>
                    <button className="p-2 bg-white/90 rounded-full text-red-500 hover:text-red-600 backdrop-blur-sm transition-colors">
                      <FaRegHeart size={20} />
                    </button>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Recipe Info Badges */}
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-lg text-sm">
                      <FaClock size={14} />
                      {recipe.cookingTime}
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm">
                      <BiDish size={14} />
                      {recipe.difficulty}
                    </span>
                    <span className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm">
                      <MdOutlineFoodBank size={14} />
                      {recipe.cuisine}
                    </span>
                  </div>

                  {/* View Recipe Button */}
                  <button
                    onClick={() => handleViewRecipe(recipe._id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-xl font-medium transition-all duration-300 transform hover:shadow-lg hover:-translate-y-0.5"
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeDatabase;
