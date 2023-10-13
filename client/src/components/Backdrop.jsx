import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";

const Backdrop = () => {
  const { openBackdrop } = useContext(AppContext);

  // useEffect(() => {
  //   if (openBackdrop) {

  //     const scrollbarWidth = getScrollbarWidth();

  //     document.body.style.overflowY = 'hidden';
  //     document.body.style.marginRight = `${scrollbarWidth}px`; // Agrega un margen derecho igual al ancho de la barra de desplazamiento
  //     // document.getElementById("navbar").style.paddingRight = `${scrollbarWidth}px`

  //     // const sidebar = document.getElementById("sidebar");
  //     // const currentSideBarWidth = sidebar.offsetWidth;
  //     // const adjustedSideBarWidth = currentSideBarWidth - scrollbarWidth;
  //     // sidebar.style.width = `${adjustedSideBarWidth}px`;

  //     // const sidebar = document.getElementById("sidebar");
  //   const documentWidth = document.documentElement.clientWidth; // Ancho del documento
  //   // const scrollbarWidth = getScrollbarWidth();
  //   const desiredSidebarWidth = (documentWidth - scrollbarWidth) / 6; // 1/6 del ancho del documento
    
  //   sidebar.style.width = `${desiredSidebarWidth}px`;

  //   } else {
  //     document.body.style.overflowY = 'auto';
  //     document.body.style.marginRight = '0'; // Restablece el margen derecho
  //     // document.getElementById("navbar").style.paddingRight = '0' // Restablece el padding del navbar
  //   }
  // }, [openBackdrop]);

  // Función para obtener el ancho de la barra de desplazamiento
  const getScrollbarWidth = () => {
    const scrollDiv = document.createElement("div");
    scrollDiv.style.width = "100px";
    scrollDiv.style.height = "100px";
    scrollDiv.style.overflow = "scroll";
    scrollDiv.style.position = "absolute";
    scrollDiv.style.top = "-9999px";
    document.body.appendChild(scrollDiv);
    const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  };

  return (
    <div
      className={`fixed h-screen w-screen bg-black transition-opacity duration-300 z-40 ${
        openBackdrop ? "opacity-80 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    ></div>
  );
};

export default Backdrop;
