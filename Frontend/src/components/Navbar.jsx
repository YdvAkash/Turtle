import React from "react";
import { Link } from "react-router-dom";
import { Turtle } from "lucide-react";
import { useUser } from "./UserContext"; // Import UserContext
export default function Navbar() {
  const { user } = useUser();
  return (
    <nav className=" shadow-lg border-b bg-transparent">
      <div className="container mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-2xl font-bold text-gray-800">
          <Link to="/">
            <Turtle size={52} strokeWidth={1.5} />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="hidden px-20 py-2 md:flex space-x-14 rounded-md shadow-md	ring-2 ring-green-900">
          <Link to="/" className="text-gray-600 hover:text-gray-950 ">
            Home
          </Link>
          <Link to="/About" className="text-gray-600 hover:text-gray-950 ">
            About
          </Link>
          <Link to="/Explore" className="text-gray-600 hover:text-gray-950 ">
            Explore
          </Link>
          <Link to="/Explore" className="text-gray-600 hover:text-gray-950 ">
            WatchList
          </Link>
        </div>

        {/* Login or Username */}
        <div className="flex items-center space-x-4 text-gray-900 font-semibold hover:text-gray-950 hover:font-bold">
          {user ? (
            <span>{user.username}</span>
          ) : (
            <Link to="/Login" className="text-gray-600 hover:text-gray-950">
              Login
            </Link>
          )}
        </div>


        <div className="md:hidden">
          <button className="text-gray-600 hover:text-gray-900">☰</button>
        </div>
      </div>
    </nav>
  );
}
