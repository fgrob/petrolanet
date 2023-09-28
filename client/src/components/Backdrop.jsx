import React, { useContext, useEffect } from "react";
import { AppContext } from "../App";

const Backdrop = () => {
    const { openBackdrop } = useContext(AppContext);

  useEffect(() => {
    if (openBackdrop) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  })

  return (
    <div
      className={`fixed inset-0 h-screen w-screen bg-black transition-opacity duration-300 z-30 ${
         openBackdrop ? " opacity-80 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    ></div>
  );
};

export default Backdrop;