import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import TransferView from "./TransferView";
import SelectorView from "./SelectorView";
import ClientSupplierView from "./ClientSupplierView";
import MeasureStick from "./MeasureStick";
import AdjustmentView from "./AdjustmentView";
import Modal from "../common/Modal";

const TankModal = ({ openModal, toggleModal, action, triggerTank }) => {
  const modalView = {
    SELECTOR: "SELECTOR",
    SALE: "SALE",
    REFILL: "REFILL",
    TRANSFER: "TRANSFER",
    MEASURE: "MEASURE",
    ADJUSTMENT: "ADJUSTMENT",
  };

  const [selectedView, setSelectedView] = useState();
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  useEffect(() => {
    setIsConfirmationVisible(false);

    if (action === "measure") {
      setSelectedView(modalView.MEASURE);
    } else if (action === "adjustment") {
      setSelectedView(modalView.ADJUSTMENT);
    } else {
      setSelectedView(modalView.SELECTOR);
    }

  }, [openModal]);

  return (
    <Modal openModal={openModal} toggleModal={toggleModal}>
      {/* Back Arrow */}
      {selectedView !== modalView.SELECTOR &&
        selectedView !== modalView.MEASURE &&
        selectedView !== modalView.ADJUSTMENT && (
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

      {/* MODAL DE AJUSTE DE ESTANQUE */}
      {openModal && selectedView === modalView.ADJUSTMENT && (
        <AdjustmentView toggleModal={toggleModal} />
      )}
    </Modal>
  );
};

export default TankModal;
