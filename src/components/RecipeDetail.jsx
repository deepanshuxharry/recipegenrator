import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client, urlFor } from "../../sanity-config/client";
import { FaClock, FaUtensils } from "react-icons/fa";
import { BiDish } from "react-icons/bi";
import { MdOutlineFoodBank } from "react-icons/md";

function RecipeDetail() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const query = `*[_type == "recipe" && _id == $id][0]`;
        const data = await client.fetch(query, { id });
        setRecipe(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Recipe not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="relative h-96">
          <img
            src={
              recipe.imageUrl
                ? urlFor(recipe.imageUrl).url()
                : "https://via.placeholder.com/800x400"
            }
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
        </div>

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {recipe.title}
          </h1>
          <p className="text-gray-600 mb-6">{recipe.description}</p>

          <div className="flex flex-wrap gap-4 mb-8">
            <span className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg">
              <FaClock /> {recipe.cookingTime}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
              <BiDish /> {recipe.difficulty}
            </span>
            <span className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
              <MdOutlineFoodBank /> {recipe.cuisine}
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ingredients
            </h2>
            <ul className="list-disc list-inside space-y-2">
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index} className="text-gray-600">
                  {ingredient}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Instructions
            </h2>
            <ol className="list-decimal list-inside space-y-4">
              {recipe.instructions?.map((step, index) => (
                <li key={index} className="text-gray-600">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeDetail;
