import React, { useContext } from "react";
import { AppContext } from "../App";

const Backdrop = () => {
    const { openBackdrop } = useContext(AppContext);
  return (
    <div
      className={`fixed inset-0 h-screen w-screen bg-black transition-opacity duration-300 z-30 ${
         openBackdrop ? " opacity-80" : "pointer-events-none opacity-0"
      }`}
    ></div>
  );
};

export default Backdrop;