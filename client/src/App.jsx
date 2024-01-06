import { createContext, useEffect, useReducer, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import tankService from "./services/tank.service";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import Backdrop from "./components/Backdrop";
import Home from "./views/Home";
import Database from "./views/Database";
import TankAdjustment from "./views/TankAdjustment";
import ClientSupplierAdjustment from "./views/ClientSupplierAdjustment";
import { BiLoaderCircle } from "react-icons/bi";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";

export const AppContext = createContext();

function App() {
  const {
    user,
    isLoading,
    isAuthenticated,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0();
  // const [accessToken, setAccessToken] = useState();

  const [tanks, setTanks] = useState([]);
  const [openBackdrop, setOpenBackdrop] = useState(false);

  const [sideBarVisibility, setSideBarVisibility] = useState(true);
  const [navBarVisibility, setNavBarVisibility] = useState(true);

  const [getTanksError, setGetTanksError] = useState(false);
  const [errorViewMessage, setErrorViewMessage] = useState("");

  const [username, setUsername] = useState("");
  const [userPermissions, setUserPermissions] = useState([]);

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

  const getAccessToken = async () => {
    const accessToken = await getAccessTokenSilently();
    const decodedToken = jwtDecode(accessToken);
    localStorage.setItem("accessToken", accessToken);
    setUsername(decodedToken.username);
    setUserPermissions(decodedToken.permissions);
    return;
  };

  const getTankData = async () => {
    await getAccessToken();
    tankService
      .getTanks()
      .then((res) => {
        setTanks(res.data);
      })
      .catch((err) => {
        const { status, statusText } = err.response;
        setErrorViewMessage(`${status} - ${statusText}`);
        setGetTanksError(true);
      });
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect();
    } else if (isAuthenticated) {
      getTankData();
    }
  }, [isLoading]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKETIO_BACKEND_URL);

    socket.on("updatedTanks", (updatedTanks) => {
      setTanks(updatedTanks);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <AppContext.Provider
      value={{
        tanks,
        setTanks,
        openBackdrop,
        setOpenBackdrop,
        username,
        userPermissions,
      }}
    >
      {!isLoading && isAuthenticated ? (
        <div className="flex h-auto flex-col lg:h-screen">
          {!getTanksError ? (
            <>
              <Backdrop />
              <div
                className={`sticky top-0 z-30 h-14 flex-shrink-0 lg:static lg:top-auto ${
                  navBarVisibility ? "block" : "hidden"
                }`}
              >
                <NavBar dispatchSideBarState={dispatchSideBarState} />
              </div>
              <div className="flex flex-1 overflow-auto lg:overflow-hidden">
                <div
                  className={`${
                    sideBarState.onlyIcons
                      ? "lg:w-14 lg:hover:w-1/6"
                      : "w-0 lg:w-1/6"
                  } transition-all duration-300 ${
                    sideBarVisibility ? "block" : "hidden"
                  }`}
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
                        <Database
                          setNavBarVisibility={setNavBarVisibility}
                          setSideBarVisibility={setSideBarVisibility}
                        />
                      }
                    />
                    <Route path="/adjustment" element={<TankAdjustment />} />
                    <Route
                      path="/clientlist"
                      element={<ClientSupplierAdjustment target="clients" />}
                    />
                    <Route
                      path="/supplierlist"
                      element={<ClientSupplierAdjustment target="suppliers" />}
                    />
                  </Routes>
                </div>
              </div>
            </>
          ) : (
            <div className=" flex h-full flex-col justify-center text-center">
              <div className=" text-2xl font-bold text-red-500">Error</div>
              <div className="font-bold">{errorViewMessage}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white font-bold">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      )}
    </AppContext.Provider>
  );
}

export default App;
