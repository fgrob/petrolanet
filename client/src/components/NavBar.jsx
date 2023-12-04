import React, { useEffect, useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { useLocation } from "react-router-dom";

const NavBar = ({ dispatchSideBarState }) => {
  const [header, setHeader] = useState("");
  const location = useLocation();

  const getHeader = () => {
    if (location.pathname === "/"){
      setHeader("Inicio")
    } else if (location.pathname === "/adjustment"){
      setHeader("Ajuste de Estanque")
    }
  };

  useEffect(() => {
    getHeader();
  }, [location])

  return (
    <nav
      id="navbar"
      className="flex h-full w-full items-center justify-between bg-gradient-to-r from-ocean-green-900 to-ocean-green-500 text-center text-white"
    >
      <div className="flex items-center gap-1 pl-2 md:w-1/6 md:pl-4">
        <button onClick={() => dispatchSideBarState({ type: "TOGGLE_STATE" })}>
          <HiOutlineMenuAlt2 className="h-11 w-11 md:hidden" />
        </button>
        <span className="hidden text-3xl md:block">PETROLANET</span>
      </div>
      <div className="text-3xl">
        {header}
      </div>
      <div className="md:w-1/6">
        <a
          href="#"
          className="group mr-2 flex items-center justify-end gap-1 md:mr-4"
        >
          <span className="hidden transition duration-100 group-hover:text-gray-200 md:block">
            fgrobc*
          </span>
          <FaUserCircle className="h-7 w-7 transition duration-100 group-hover:text-gray-200" />
        </a>
      </div>
    </nav>
  );
};

export default NavBar;
