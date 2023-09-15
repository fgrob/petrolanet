import React, { useEffect, useRef } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { RiMailSendFill } from "react-icons/ri";
import { AiFillDatabase } from "react-icons/ai";
import { AiTwotoneSetting } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

const SideBar = ({ openSideBar, toggleSideBar }) => {
  const Menus = [
    { title: "Inicio", icon: IoHomeSharp },
    { title: "Solicitudes", icon: RiMailSendFill },
    { title: "Base de datos", icon: AiFillDatabase },
    { title: "Recursos", icon: AiTwotoneSetting },
  ];

  const sidebarRef = useRef();
  const startX = useRef(null);
  const startY = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (openSideBar) {
        startX.current = e.touches[0].clientX; // touches clientx property returns the X coordinate of the touch point relative to the viewport
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (openSideBar && startX.current !== null) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = startX.current - currentX;
        const deltaY = Math.abs(startY.current - currentY);

        if (deltaX > 50 && deltaY < 30) {
          toggleSideBar();
          startX.current = null;
          startY.current = null;
        }
      }
    };

    const handleClickOutside = (e) => {
      if (openSideBar) {
        if (!sidebarRef.current.contains(e.target)) {
          // return true if the event.target is inside of the sidebarRef
          toggleSideBar();
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSideBar, toggleSideBar]);

  useEffect(() => {
    if (openSideBar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openSideBar]);

  return (
      <aside
        ref={sidebarRef}
        className={`${
          openSideBar ? "translate-x-0" : "-translate-x-full"
        } fixed top-0 z-40 md:z-20 h-screen w-4/5  shadow-[2px_3px_15px] shadow-gray-500 bg-gray-100 duration-200 md:top-auto md:block md:w-1/6 md:translate-x-0 md:pt-5
        `}
      > 
        <div className="md:hidden text-4xl text-white h-14 text-center from-ocean-green-900 to-ocean-green-500 bg-gradient-to-r mb-5 flex items-center justify-center">
          <button onClick={toggleSideBar} className="absolute left-1 ">
            <IoClose className="text-white h-14 w-11"/>
          </button>
          <div>PETROLANET</div>
        </div>
        <div className="h-screen w-fullfont-medium flex flex-col gap-3 ">
          {Menus.map((Menu, index) => (
            <a
              href="#"
              key={index}
              className="group rounded-lg hover:bg-gray-200 flex p-2 pl-5"
            >
              <Menu.icon className="h-7 w-7 md:h-6 md:w-6 text-gray-500 transition duration-100 group-hover:text-gray-900" />
              <span className="text-2xl md:text-base md:font-bold ml-2">
                {Menu.title}
              </span>
            </a>
          ))}
        </div>
      </aside>
  );
};

export default SideBar;
