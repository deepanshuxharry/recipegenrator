import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-orange-400 to-red-500 px-8 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-2xl font-bold text-white hover:scale-105 transition-transform duration-200"
          >
            Recipe Generator
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-white hover:text-orange-100 transition-colors duration-200 relative group
              ${location.pathname === "/" ? "font-semibold" : ""}`}
          >
            Home
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-white transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link
            to="/recipe-database"
            className={`text-white hover:text-orange-100 transition-colors duration-200 relative group
              ${
                location.pathname === "/recipe-database" ? "font-semibold" : ""
              }`}
          >
            Recipe Database
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-white transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link
            to="/favorites"
            className={`text-white hover:text-orange-100 transition-colors duration-200 relative group
              ${location.pathname === "/favorites" ? "font-semibold" : ""}`}
          >
            Favorites
            <span className="absolute bottom-[-4px] left-0 w-0 h-[2px] bg-white transition-all duration-200 group-hover:w-full"></span>
          </Link>
          <Link
            to="/"
            className="bg-white text-red-500 px-6 py-2 rounded-full font-semibold 
              hover:bg-red-500 hover:text-white transition-all duration-300 
              transform hover:scale-105 active:scale-95 shadow-md"
          >
            Generate Recipe
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-orange-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden mt-4">
          <Link
            to="/"
            className="block text-white py-2 px-4 hover:bg-orange-400"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/recipe-database"
            className="block text-white py-2 px-4 hover:bg-orange-400"
            onClick={() => setIsOpen(false)}
          >
            Recipe Database
          </Link>
          <Link
            to="/favorites"
            className="block text-white py-2 px-4 hover:bg-orange-400"
            onClick={() => setIsOpen(false)}
          >
            Favorites
          </Link>
        </div>
      )}
    </nav>
  );
}
