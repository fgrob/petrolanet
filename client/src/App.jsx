import { createContext, useEffect, useReducer, useState } from "react";
import { Route, Routes } from "react-router-dom";
import tankService from "./services/tank.service";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Backdrop from "./components/Backdrop";
import Home from "./views/Home";
import Database from "./views/Database";
import TankAdjustment from "./views/TankAdjustment";
import ClientSupplierAdjustment from "./views/ClientSupplierAdjustment";

export const AppContext = createContext();

function App() {
  const [tanks, setTanks] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [sideBarVisibility, setSideBarVisibility] = useState(true);
  const [navBarVisibility, setNavBarVisibility] = useState(true);

  const sideBarReducer = (state, action) => {
    switch (action.type) {
      case "TOGGLE_STATE":
        setOpenBackdrop(!openBackdrop);
        return {
          open: !state.open,
          onlyIcons: state.onlyIcons,
        };

      case "CLOSE_STATE":
        setOpenBackdrop(false);
        return {
          open: false,
          onlyIcons: state.onlyIcons,
        };

      case "ICONS_MODE":
        if (action.value !== undefined) {
          // Enables manual input of the 'true' or 'false' value
          // curently not in use
          return {
            open: state.open,
            onlyIcons: action.value,
          };
        } else {
          return {
            open: state.open,
            onlyIcons: !state.onlyIcons,
          };
        }

      default:
        return state;
    }
  };

  const [sideBarState, dispatchSideBarState] = useReducer(sideBarReducer, {
    open: false,
    onlyIcons: false,
  });

  useEffect(() => {
    tankService.getTanks().then((res) => {
      setTanks(res.data);
    });
  }, []);

  return (
    <AppContext.Provider
      value={{ tanks, setTanks, openBackdrop, setOpenBackdrop }}
    >
      <div className="flex h-auto flex-col lg:h-screen">
        <Backdrop />
        <div className={`sticky z-30 top-0 h-14 flex-shrink-0 lg:static lg:top-auto ${navBarVisibility ? "block" : "hidden"}`}>
          <NavBar dispatchSideBarState={dispatchSideBarState} />
        </div>
        <div className="flex flex-1 overflow-auto lg:overflow-hidden">
          <div
            className={`${
              sideBarState.onlyIcons ? "lg:w-14 lg:hover:w-1/6" : "w-0 lg:w-1/6"
            } transition-all duration-300 ${sideBarVisibility ? "block" : "hidden"}`}
          >
            <SideBar
              sideBarState={sideBarState}
              dispatchSideBarState={dispatchSideBarState}
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/database"
                element={
                  <Database setNavBarVisibility={setNavBarVisibility} setSideBarVisibility={setSideBarVisibility} />
                }
              />
              <Route path="/adjustment" element={<TankAdjustment />} />
              <Route path="/clientlist" element={<ClientSupplierAdjustment target="clients"/>} />
              <Route path="/supplierlist" element={<ClientSupplierAdjustment target="suppliers"/>} />
            </Routes>
          </div>
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
