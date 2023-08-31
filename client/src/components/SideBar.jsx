import React, { useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { RiMailSendFill } from "react-icons/ri";
import { AiFillDatabase } from "react-icons/ai";
import { AiTwotoneSetting } from "react-icons/ai";
import { HiOutlineMenuAlt2 } from "react-icons/hi";

const SideBar = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleMenu = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <aside className="h-screen w-56">
      <div className="h-full bg-gray-100 shadow-sm">
        <ul className="flex flex-col pt-10 font-medium">
          <li className="">
            <a href="#" className="group flex rounded-lg p-3 hover:bg-gray-200">
              <IoHomeSharp className="h-5 w-5 text-gray-500 transition duration-100 group-hover:text-gray-900" />
              <span className="ml-3">Inicio</span>
            </a>
          </li>
          <li>
            <a href="#" className="group flex rounded-lg p-3 hover:bg-gray-200">
              <RiMailSendFill className="h-5 w-5 text-gray-500 transition duration-100  group-hover:text-gray-900" />
              <span className="ml-3">Solicitudes</span>
            </a>
          </li>
          <li>
            <a href="#" className="group flex rounded-lg p-3 hover:bg-gray-200">
              <AiFillDatabase className="h-5 w-5 text-gray-500 transition duration-100 group-hover:text-gray-900" />
              <span className="ml-3">Base de datos</span>
            </a>
          </li>
          <li>
            <a href="#" className="group flex rounded-lg p-3 hover:bg-gray-200">
              <AiTwotoneSetting className="h-5 w-5 text-gray-500 transition duration-100 group-hover:text-gray-900" />
              <span className="ml-3">Recursos</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default SideBar;
