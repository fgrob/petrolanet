import React, { useEffect, useRef, useState } from "react";
import { IoHomeSharp } from "react-icons/io5";
import { RiMailSendFill } from "react-icons/ri";
import { AiFillDatabase } from "react-icons/ai";
import { AiTwotoneSetting } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";


const SideBar = ({ sideBarState, dispatchSideBarState }) => {
  const [openSubmenus, setOpenSubmenus] = useState({
    Ajustes: false,
  });
  const location = useLocation();

  const Menus = [
    { title: "Inicio", icon: IoHomeSharp, link: "/" },
    // { title: "Solicitudes", icon: RiMailSendFill, link: "/" },
    { title: "Base de datos", icon: AiFillDatabase, link: "/database" },
    {
      title: "Ajustes",
      icon: AiTwotoneSetting,
      submenus: [
        {
          title: "Ajustar Estanques",
          icon: AiFillDatabase,
          link: "/adjustment",
        },
        { title: "Clientes", icon: AiFillDatabase, link: "/adjustment" },
        { title: "Proveedores", icon: AiFillDatabase, link: "/adjustment" },
      ],
    },
  ];

  const handleSubmenuClick = (title) => {
    setOpenSubmenus((prevSubmenus) => {
      const isSubmenuOpen = prevSubmenus[title];
      return { ...prevSubmenus, [title]: !isSubmenuOpen };
    });
  };

  const sidebarRef = useRef();
  const startX = useRef(null);
  const startY = useRef(null);

  useEffect(() => {
    const handleTouchStart = (e) => {
      if (sideBarState.open) {
        startX.current = e.touches[0].clientX; // touches clientx property returns the X coordinate of the touch point relative to the viewport
        startY.current = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (sideBarState.open && startX.current !== null) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const deltaX = startX.current - currentX;
        const deltaY = Math.abs(startY.current - currentY);

        if (deltaX > 50 && deltaY < 30) {
          dispatchSideBarState({ type: "TOGGLE_STATE" });
          startX.current = null;
          startY.current = null;
        }
      }
    };

    const handleClickOutside = (e) => {
      if (sideBarState.open) {
        if (!sidebarRef.current.contains(e.target)) {
          // return true if the event.target is inside of the sidebarRef
          dispatchSideBarState({ type: "TOGGLE_STATE" });
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
  }, [sideBarState]);

  useEffect(() => {
    // disables vertical scrolling (for movile)
    if (sideBarState.open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [sideBarState]);

  useEffect(() => {
    // For mobile screens: If the location changes, close the sidebar and backdrop
    dispatchSideBarState({ type: "CLOSE_STATE" });
  }, [location])

  return (
    <aside
      id="sidebar"
      ref={sidebarRef}
      className={`${
        sideBarState.open ? "translate-x-0" : "-translate-x-full"
      } fixed top-0 z-40 h-full w-4/5 overflow-hidden bg-gray-100 shadow-[2px_3px_15px] shadow-gray-500 duration-200 md:static md:top-auto md:z-20 md:block md:w-full md:translate-x-0
        `}
    >
      <div className="mb-5 flex h-14 items-center justify-center bg-gradient-to-r from-ocean-green-900 to-ocean-green-500 text-center text-4xl text-white md:hidden">
        <button
          onClick={() => dispatchSideBarState({ type: "TOGGLE_STATE" })}
          className="absolute left-1 "
        >
          <IoClose className="h-14 w-11 text-white" />
        </button>
        <div>PETROLANET</div>
      </div>

      <div className="mt-5 flex flex-col">
        {Menus.map((Menu) => (
          <div key={Menu.title}>
            {Menu.submenus ? (
              <button
                className="group w-full flex whitespace-nowrap rounded-lg p-4 hover:bg-gray-200"
                onClick={() => handleSubmenuClick(Menu.title)}
              >
                <Menu.icon className="h-7 w-7 flex-shrink-0 text-gray-500 transition duration-100 group-hover:text-gray-900 md:h-6 md:w-6" />
                <span className="ml-4 text-2xl md:text-base md:font-bold">
                  {Menu.title}
                </span>
              </button>
            ) : (
              <Link
              to={Menu.link}
              className="group flex whitespace-nowrap rounded-lg p-4 hover:bg-gray-200"
            >
              <Menu.icon className="h-7 w-7 flex-shrink-0 text-gray-500 transition duration-100 group-hover:text-gray-900 md:h-6 md:w-6" />
              <span className="ml-4 text-2xl md:text-base md:font-bold">
                {Menu.title}
              </span>
            </Link>
            )}

            {/* Submenus */}
            {Menu.submenus && (
              <div
                className={`ml-8 overflow-hidden ${
                  openSubmenus[Menu.title] ? "max-h-60" : "invisible max-h-0"
                } transition-all duration-300 ease-in-out`}
              >
                {Menu.submenus.map((submenu, subIndex) => (
                  <Link
                    key={subIndex}
                    to={submenu.link}
                    className="group flex whitespace-nowrap rounded-lg px-4 py-2 hover:bg-gray-200"
                  >
                    <span className="ml-4 text-2xl md:text-base md:font-bold">
                      {submenu.title}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SideBar;
