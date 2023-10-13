import { createContext, useEffect, useReducer, useState } from "react";
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
  const [openBackdrop, setOpenBackdrop] = useState(false);
  const sideBarReducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE_STATE":
        console.log("modo tog");
        setOpenBackdrop(!openBackdrop);
        return state === "full"
          ? "hidden"
          : state === "hidden"
          ? "full"
          : state;

      case "ICONS_MODE":
        return state === "icons" ? "hidden" : "icons";
      default:
        return state;
    }
  };

  const [sideBarState, dispatchSideBarState] = useReducer(
    sideBarReducer,
    "hidden",
  );

  useEffect(() => {
    tankService.getTanks().then((res) => {
      setTanks(res.data);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{ tanks, setTanks, openBackdrop, setOpenBackdrop }}
    >
      <div className="flex h-screen flex-col">
        <Backdrop />
        <div className="h-14 flex-shrink-0">
          <NavBar dispatchSideBarState={dispatchSideBarState} />
        </div>
        <div className="flex flex-1 overflow-hidden border-2 border-yellow-500">
          {/* <div className={` ${sideBarState === "icons" ? "w-14 hover:w-1/8" : "w-1/8" } transition-all duration-300 `}> */}
          <div
            className={` ${
              sideBarState === "full"
                ? "w-0"
                : sideBarState === "icons"
                ? "hover:w-1/8 w-14"
                : "w-1/8"
            } transition-all duration-300 `}
          >
            <SideBar
              sideBarState={sideBarState}
              dispatchSideBarState={dispatchSideBarState}
            />
          </div>
          <div className="flex-1 overflow-y-scroll border border-red-500">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/database" element={<Database />} /> */}
            </Routes>
          </div>
        </div>
        {/* <div className="h-14 flex-shrink-0 border-2 border-red-500">Footer</div> */}
      </div>
    </AppContext.Provider>
  );
}

export default App;
