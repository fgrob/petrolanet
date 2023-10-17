import React, { useContext } from "react";
import { AppContext } from "../App";

const Backdrop = () => {
  const { openBackdrop } = useContext(AppContext);
  return (
    <div
      className={`fixed h-screen w-screen bg-black transition-opacity duration-300 z-40 ${
        openBackdrop ? "opacity-80 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    ></div>
  );
};

export default Backdrop;
