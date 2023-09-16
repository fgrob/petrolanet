import React, { useContext, useEffect, useRef, useState } from "react";
import { PiArrowSquareOutDuotone } from "react-icons/pi";
import { PiArrowSquareInDuotone } from "react-icons/pi";
import { PiArrowsCounterClockwiseFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import { TbArrowBigRightLinesFilled } from "react-icons/tb";
import { FaGasPump } from "react-icons/fa";
import { PiTruck } from "react-icons/pi"
import tankService from "../services/tank.service";
import { AppContext } from "../App";

const ModalTank = ({
  openModal,
  toggleModal,
  action,
  triggerTankId,
}) => {
  const modalView = {
    SELECTOR: "SELECTOR",
    SALE: "SALE",
    REFILL: "REFILL",
    TRANSFER: "TRANSFER",
  };

  console.log('ModalTank renderizado')

  const { tanks, setTanks } = useContext(AppContext);
  const [selectedView, setSelectedView] = useState(modalView.SELECTOR);
  const modalTankRef = useRef();

  const [selectedTankId, setselectedTankId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const TankObjectWithId = (id) => {
    const tank = tanks.find((tank) => tank.id == id);
    return tank ? tank : null;
  };

  const getTankIcon = (tank) =>
    tank && tank.type === "camion" ? (
      <PiTruck className="h-14 w-14" />
    ) : (
      <FaGasPump className="h-14 w-14" />
    );

  useEffect(() => {
    setSelectedView(modalView.SELECTOR);
    setselectedTankId("");
    setQuantity("");
    setError("");

    const handleClickOutside = (e) => {
      if (openModal) {
        if (!modalTankRef.current.contains(e.target)) {
          toggleModal();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal, toggleModal]);

  const handleTransfer = (event) => {

    if (!selectedTankId || !quantity) {
        setError('Favor completa todos los campos');
        return;
    } else if (selectedTankId == triggerTankId) {
        setError('El destino no puede ser igual al origen');
        return;
    }

    event.preventDefault();
    tankService.transfer(action, triggerTankId, selectedTankId, quantity)
        .then((res) => {
            setTanks(res.data);
            toggleModal();
        })
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        e.target.blur();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-100 ease-in-out${
        openModal
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      }`}
    >
      <div
        ref={modalTankRef}
        className="relative mx-2 flex h-5/6 w-full justify-center rounded-lg bg-white p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] md:w-1/3 md:h-auto"
      >
        <button onClick={toggleModal} className="absolute right-1 top-1">
          <IoClose className="h-9 w-9" />
        </button>
        {selectedView !== modalView.SELECTOR && (
          <button
            onClick={() => setSelectedView(modalView.SELECTOR)}
            className="absolute left-1 top-1"
          >
            <IoArrowBack className="h-9 w-9" />
          </button>
        )}

        {/* MODAL DE SELECCION  */}
        {openModal && selectedView === modalView.SELECTOR && (
          <div className="flex flex-col flex-wrap items-center justify-evenly gap-5 md:flex-row md:content-center">
            <div className="relative w-full text-center text-2xl font-bold">
              Tipo de {action === "load" ? "Carga" : "Descarga"}
              <div className="divider" />
            </div>
            {/* <div className="divider" /> */}
            <div>
              <button
                type="button"
                className="relative rounded-lg border-2 border-gray-500 p-10 shadow-md hover:opacity-50"
                onClick={() => {
                  setSelectedView(modalView.TRANSFER);
                }}
              >
                <PiArrowsCounterClockwiseFill className="h-28 w-28 text-gray-600 md:h-14 md:w-14" />
                <div className="absolute bottom-1 right-0 w-full font-bold text-gray-600">
                  Traspaso interno
                </div>
              </button>
            </div>
            <div>
              <button
                type="button"
                className="relative rounded-lg border-2 border-gray-600 p-10 shadow-md hover:opacity-50"
              >
                {action === "load" ? (
                  <>
                    <PiArrowSquareInDuotone className="h-28 w-28 text-gray-600 md:h-14 md:w-14" />
                    <div className="absolute bottom-1 right-0 w-full text-gray-600">
                      Proveedor
                    </div>
                  </>
                ) : (
                  <>
                    <PiArrowSquareOutDuotone className="h-28 w-28 text-gray-600 md:h-14 md:w-14" />
                    <div className="absolute bottom-1 right-0 w-full text-gray-600">
                      Cliente
                    </div>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {openModal && selectedView === modalView.TRANSFER && (
          <div className="w-full">
            <div className=" w-full text-center text-2xl font-bold">
              Transferencia Interna
            </div>
            <div className=" w-full text-center text-2xl font-bold">
              {action === "load" ? "(Carga)" : "(Descarga)"}
            </div>
            <form onSubmit={handleTransfer} className="grid gap-5">
              <div>
                {/* <label htmlFor="tank">Seleccionar Estanque</label> */}
                <select
                  id="tank"
                  name="tank"
                  value={selectedTankId}
                  onChange={(e) => setselectedTankId(e.target.value)}
                  className="mt-10 h-12 w-full rounded-lg border border-gray-600 bg-gray-50"
                  required
                >
                  <option value="">Seleccionar estanque {action === 'load' ? "origen" : "destino"}</option>
                  {tanks.map((tank) => (
                    <option key={tank.id} value={tank.id}>
                      {tank.name.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="quantity" className="text-gray-600">
                  Cantidad a transferir
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={quantity}
                  max={100000}
                  onChange={(e) => {
                    if (e.target.value <= 100000) {
                      setQuantity(e.target.value);
                    }
                  }}
                  onKeyDown={handleEnter}
                  className="p2 h-12 w-full rounded-lg border border-gray-600"
                  required
                />
              </div>
            </form>

            <div className="mt-10 flex flex-wrap justify-evenly">
              <div className="relative flex w-1/3 flex-wrap content-center justify-center rounded-lg border-2 border-gray-600 bg-gray-200">
                {action === "load"
                  ? getTankIcon(TankObjectWithId(selectedTankId))
                  : getTankIcon(TankObjectWithId(triggerTankId))}
                <div className=" h-fit w-full bg-red-400 text-center">
                  ORIGEN
                </div>
                <div className="absolute top-28 text-center text-lg">
                  {action === "load"
                    ? TankObjectWithId(selectedTankId)
                      ? TankObjectWithId(selectedTankId).name.toUpperCase()
                      : ""
                    : TankObjectWithId(triggerTankId).name.toUpperCase()}
                </div>
              </div>
              <div className="relative flex w-1/4 flex-wrap content-center justify-center">
                <TbArrowBigRightLinesFilled className="h-full w-full" />
                <div className="absolute top-28 mt-[2px] whitespace-nowrap text-lg">
                  {quantity && parseInt(quantity).toLocaleString("es-CL")} Lts
                </div>
              </div>
              <div className="relative flex h-28 w-1/3 flex-wrap content-center justify-center rounded-lg border-2 border-gray-600 bg-gray-200">
                {action === "unload"
                  ? getTankIcon(TankObjectWithId(selectedTankId))
                  : getTankIcon(TankObjectWithId(triggerTankId))}
                <div className="h-fit w-full bg-ocean-green-400 text-center">
                  DESTINO
                </div>
                <div className="absolute top-28 text-lg">
                  {action === "unload"
                    ? TankObjectWithId(selectedTankId)
                      ? TankObjectWithId(selectedTankId).name.toUpperCase()
                      : ""
                    : TankObjectWithId(triggerTankId).name.toUpperCase()}
                </div>
              </div>
              <div className="mt-12 flex w-full justify-center">
                <button className="btn-success" onClick={handleTransfer}>Transferir</button>
              </div>
              <div className="mt-3 flex w-full justify-center text-red-600 font-bold">
                {error}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalTank;
