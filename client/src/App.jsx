import { createContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Home from "./views/Home";
import Backdrop from "./components/Backdrop";
import tankService from "./services/tank.service";
import Database from "./views/Database";

export const AppContext = createContext();

function App() {
  const [tanks, setTanks] = useState([]);
  const [openSideBar, setOpenSideBar] = useState(false);
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const [newOpenSideBar, setNewOpenSideBar] = useState(false);

  useEffect(() => {
    tankService.getTanks().then((res) => {
      setTanks(res.data);
    });
  }, []);

  const toggleSideBar = () => {
    setOpenSideBar(!openSideBar);
    setOpenBackdrop(!openBackdrop);
  };

  return (
    <AppContext.Provider
      value={{ tanks, setTanks, openBackdrop, setOpenBackdrop }}
    >
      <div className="grid grid-cols-6 h-screen overflow-hidden">
        <Backdrop />
        <div className="col-span-6 h-14">
          <NavBar toggleSideBar={toggleSideBar} />
        </div>
        {}
        <div className="col-span-1 h-full">
          <SideBar openSideBar={openSideBar} toggleSideBar={toggleSideBar} />
        </div>
        {/* <div className="col-span-6 font-bold md:col-span-5"> */}
        <div className={`col-span-6 font-bold ${newOpenSideBar ? 'md:col-span-5' : 'md:col-span-6'}`}>
          <div className="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/database" element={<Database setOpenSideBar={setOpenSideBar} />} />
            </Routes>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
