import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Herosection from "./components/Herosection";
import FavoriteRecipes from "./components/FavoriteRecipes";
import RecipeDatabase from "./components/RecipeDatabase";
import RecipeDetail from "./components/RecipeDetail";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/recipe-database" element={<RecipeDatabase />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/" element={<Herosection />} />
        <Route path="/favorites" element={<FavoriteRecipes />} />
      </Routes>
    </Router>
  );
}

export default App;
