import { useState } from "react";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Home from "./views/Home";

function App() {
  const [openSideBar, setOpenSideBar] = useState(false);

  const toggleSideBar = () => {
    setOpenSideBar(!openSideBar);
  };
  
  return (
    <div className="grid grid-cols-6">
      <div className="col-span-6 h-14">
        <NavBar toggleSideBar={toggleSideBar} />
      </div>
      <div className="col-span-1 h-full">
        <SideBar openSideBar={openSideBar} toggleSideBar={toggleSideBar} />
      </div>
      <div className="col-span-6 font-bold md:col-span-5">
        <div className="p-4">
            <Home />
        </div>
        {/* <div className="border-2 border-green-800 bg-green-500 p-1">Footer</div> */}
      </div>
    </div>
  );
}

export default App;
