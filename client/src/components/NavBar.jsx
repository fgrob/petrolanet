import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

const NavBar = ({ toggleSideBar }) => {

  console.log('NavBar renderizado')

  return (
    <nav className="from-ocean-green-900 to-ocean-green-500 fixed flex h-14 w-full items-center justify-between bg-gradient-to-r text-center text-white">
      <div className="flex items-center gap-1 pl-2 md:w-1/6 md:pl-4">
        <button onClick={toggleSideBar}>
          <HiOutlineMenuAlt2 className="h-11 w-11 md:hidden" />
        </button>
        <span className="hidden text-3xl md:block">PETROLANET</span>  
      </div>
      <div className="text-3xl">
        BASE DE DATOS* 
      </div>
      <div className="md:w-1/6">
        <a
          href="#"
          className="group flex items-center justify-end gap-1 mr-2 md:mr-4"
        >
          <span className="hidden transition duration-100 md:block group-hover:text-gray-200">
            fgrobc*
          </span>
          <FaUserCircle className="h-7 w-7 transition duration-100 group-hover:text-gray-200" />
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
