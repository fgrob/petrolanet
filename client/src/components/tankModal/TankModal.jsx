import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoArrowBack } from "react-icons/io5";
import TransferView from "./TransferView";
import SelectorView from "./SelectorView";
import ClientSupplierView from "./ClientSupplierView";
import MeasureStick from "./MeasureStick";

const TankModal = ({ openModal, toggleModal, action, triggerTank }) => {
  const modalView = {
    SELECTOR: "SELECTOR",
    SALE: "SALE",
    REFILL: "REFILL",
    TRANSFER: "TRANSFER",
    MEASURE: "MEASURE",
  };

  const [selectedView, setSelectedView] = useState();
  const tankModalRef = useRef();
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  useEffect(() => {

    setIsConfirmationVisible(false);

    if (action === "measure") {
      setSelectedView(modalView.MEASURE);
    } else {
      setSelectedView(modalView.SELECTOR);
    }

    const handleClickOutside = (e) => {
      if (openModal) {
        if (!tankModalRef.current.contains(e.target)) {
          toggleModal();
        }
      }
    };

    const handleKeyESC = (e) => {
      if (openModal) {
        if (e.key === "Escape") {
          toggleModal();
        }
      }
    };

    document.addEventListener("keydown", handleKeyESC);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleKeyESC);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openModal]);

  useEffect(() => {
    // disables vertical scrolling (for movile)
    if (openModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [openModal]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-100 ease-in-out${
        openModal
          ? "visible opacity-100"
          : "pointer-events-none invisible opacity-0"
      }`}
    >
      <div
        ref={tankModalRef}
        className="relative mx-2 flex h-5/6 max-h-full w-full justify-center rounded-lg bg-white p-5 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] md:h-auto md:w-1/3"
        id="modal"
      >
        <button
          onClick={toggleModal}
          className="absolute right-1 top-1 z-50 h-9 w-9"
        >
          <IoClose className="h-full w-full" />
        </button>
        {selectedView !== modalView.SELECTOR && selectedView !== modalView.MEASURE && (
          <button
            onClick={() => {
              isConfirmationVisible
                ? setIsConfirmationVisible(false)
                : setSelectedView(modalView.SELECTOR);
            }}
            className="absolute left-1 top-1"
          >
            <IoArrowBack className="h-9 w-9" />
          </button>
        )}

        {/* MODAL DE SELECCION  */}
        {openModal && selectedView === modalView.SELECTOR && (
          <SelectorView
            action={action}
            modalView={modalView}
            setSelectedView={setSelectedView}
          />
        )}
        {/* MODAL DE TRANSFERENCIA  */}
        {openModal && selectedView === modalView.TRANSFER && (
          <TransferView
            action={action}
            triggerTank={triggerTank}
            toggleModal={toggleModal}
            openModal={openModal}
            isConfirmationVisible={isConfirmationVisible}
            setIsConfirmationVisible={setIsConfirmationVisible}
          />
        )}
        {/* MODAL CLIENTE PROVEEDOR */}
        {openModal &&
          (selectedView === modalView.REFILL ||
            selectedView === modalView.SALE) && (
            <ClientSupplierView
              action={action}
              triggerTank={triggerTank}
              toggleModal={toggleModal}
              isConfirmationVisible={isConfirmationVisible}
              setIsConfirmationVisible={setIsConfirmationVisible}
            />
          )}

        {/* MODAL DE MEDICION DE ESTANQUE */}
        {openModal && selectedView === modalView.MEASURE && (
          <MeasureStick triggerTank={triggerTank} toggleModal={toggleModal} />
        )}
      </div>
    </div>
  );
};

export default TankModal;
