import React from "react";
import { FaGasPump } from "react-icons/fa";

const NavBar = () => {
  return (
    <nav className="fixed flex h-12 w-full justify-between bg-gray-900 text-white shadow-red-600">
      <div className="border border-red-500 text-xl font-bold">PETRLANET</div>
      <div className="border border-blue-500">chai</div>
    </nav>
  );
};

export default NavBar;
