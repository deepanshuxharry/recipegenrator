import axios from "axios";
const apiUrl = import.meta.env.VITE_APINAME;

export default class RecipeService {
  static createStructuredPrompt = (ingredients, dietaryPreferences) => {
    const dietText =
      dietaryPreferences.length > 0
        ? `Requirements: Must be ${dietaryPreferences.join(", ")}.`
        : "";

    return `You are a cooking expert. Create 8 recipes using these ingredients: ${ingredients}. ${dietText}
Make recipes that are practical and easy to follow.

Respond with a JSON object in this exact format:
{
  "recipes": [
    {
      "title": "Recipe Name",
      "ingredients": ["2 cups flour", "1 cup sugar"],
      "instructions": ["Step 1", "Step 2"],
      "prepTime": "30",
      "cookTime": "20",
      "difficulty": "Easy",
      "nutrition": {
        "calories": "300",
        "protein": "20g",
        "carbs": "30g",
        "fat": "10g"
      }
    }
  ]
}

IMPORTANT: 
- Return ONLY valid JSON
- All times should be numbers only (no text)
- Difficulty must be one of: Easy, Medium, Hard
- Each recipe must have all required fields`;
  };

  static processApiResponse = (responseData) => {
    try {
      if (!responseData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error("Invalid API response format");
      }

      const text = responseData.candidates[0].content.parts[0].text.trim();
      console.log("Raw text response:", text);

      // Clean up the text to ensure it's valid JSON
      let jsonText = text;
      // Remove any markdown code block markers
      jsonText = jsonText.replace(/```json\s*|\s*```/g, "");
      // Find the first { and last }
      const startIndex = jsonText.indexOf("{");
      const endIndex = jsonText.lastIndexOf("}");
      if (startIndex === -1 || endIndex === -1) {
        throw new Error("No valid JSON object found in response");
      }
      jsonText = jsonText.slice(startIndex, endIndex + 1);

      // Parse the cleaned JSON
      const jsonData = JSON.parse(jsonText);
      console.log("Parsed JSON data:", jsonData);

      if (!jsonData.recipes || !Array.isArray(jsonData.recipes)) {
        throw new Error("Invalid recipe data structure");
      }

      return jsonData.recipes.map((recipe) => ({
        id: Math.random().toString(36).substr(2, 9),
        ...recipe,
        prepTime: String(recipe.prepTime || "0").replace(/\D/g, ""),
        cookTime: String(recipe.cookTime || "0").replace(/\D/g, ""),
        totalTime: `${
          parseInt(String(recipe.prepTime || "0").replace(/\D/g, "")) +
          parseInt(String(recipe.cookTime || "0").replace(/\D/g, ""))
        } minutes`,
        rating: 0,
        saved: false,
        difficulty: recipe.difficulty || "Medium",
        nutrition: {
          calories: recipe.nutrition?.calories || "N/A",
          protein: recipe.nutrition?.protein || "N/A",
          carbs: recipe.nutrition?.carbs || "N/A",
          fat: recipe.nutrition?.fat || "N/A",
        },
      }));
    } catch (err) {
      console.error("Error processing response:", err);
      console.error(
        "Response text:",
        responseData?.candidates?.[0]?.content?.parts?.[0]?.text
      );
      throw new Error("Failed to process recipes from API response");
    }
  };

  static generateRecipes = async (
    ingredients,
    dietaryPreferences,
    selectedIngredients
  ) => {
    try {
      const prompt = RecipeService.createStructuredPrompt(
        selectedIngredients.join(", "),
        dietaryPreferences
      );

      console.log("Sending prompt:", prompt);

      // Direct request to the provided URL without modifications
      const response = await axios({
        url: apiUrl,
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        },
      });

      if (!response.data) {
        throw new Error("Empty response from API");
      }

      console.log("Raw API Response:", response.data);
      return RecipeService.processApiResponse(response.data);
    } catch (err) {
      console.error("API Error Details:", {
        status: err.response?.status,
        statusText: err.response?.statusText,
        data: err.response?.data,
        message: err.message,
      });
      throw new Error(
        err.response?.data?.error?.message ||
          "Failed to generate recipes. Please try again."
      );
    }
  };

  static adjustRecipeForServings = (
    ingredients,
    servingSize,
    originalServings = 4
  ) => {
    return ingredients.map((ingredient) => {
      const match = ingredient.match(/^([\d./]+)\s+(.+)/);
      if (!match) return ingredient;

      const quantity = parseFloat(match[1]);
      const rest = match[2];
      const newQuantity = ((quantity * servingSize) / originalServings).toFixed(
        1
      );
      return `${
        newQuantity.endsWith(".0") ? newQuantity.slice(0, -2) : newQuantity
      } ${rest}`;
    });
  };

  static filterRecipes = (recipes, filters) => {
    return recipes.filter((recipe) => {
      if (filters.cookingTime !== "all") {
        const totalMinutes = parseInt(recipe.totalTime);
        if (filters.cookingTime === "quick" && totalMinutes > 30) return false;
        if (
          filters.cookingTime === "medium" &&
          (totalMinutes <= 30 || totalMinutes > 60)
        )
          return false;
        if (filters.cookingTime === "slow" && totalMinutes <= 60) return false;
      }

      if (
        filters.difficulty !== "all" &&
        recipe.difficulty.toLowerCase() !== filters.difficulty.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
  };
}
