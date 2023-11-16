import { useRef, useEffect } from "react";
// Custom hook to determine if the component is in its initial render.
// Its main use is to prevent the execution of code during the first rendering of a useEffect

const useMountStatus = () => {
  
  const isMountRef = useRef(true); // Create a mutable reference that persists between renders
  useEffect(() => {
    
    isMountRef.current = false; // Set isMountRef.current to false after the first render
  }, []);

  // Return the current value of isMountRef. True on the first render
  return isMountRef.current;
};

export default useMountStatus;