import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import TransferView from "./TransferView";
import SelectorView from "./SelectorView";
import ClientSupplierView from "./ClientSupplierView";
import MeasureStick from "./MeasureStick";
import ErrorsView from "./ErrorsView";
import Modal from "../../components/Modal";
import EventsView from "./EventsView";

const TankModal = ({ openModal, toggleModal, action, triggerTank }) => {

  const [height, setHeight] = useState(null);

  const modalView = {
    SELECTOR: "SELECTOR",
    SALE: "SALE",
    REFILL: "REFILL",
    TRANSFER: "TRANSFER",
    MEASURE: "MEASURE",
    ERRORS: "ERRORS",
    EVENTLOGS: "EVENTLOGS",
  };

  const [selectedView, setSelectedView] = useState();
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);


  useEffect(() => {
    console.log('ejecutando useEffect del tankModal')
    console.log('a ver selectedView: ', selectedView)
    setIsConfirmationVisible(false);

    if (action === "measure") {
      setSelectedView(modalView.MEASURE);
    } else if (action === "errors") {
      setSelectedView(modalView.ERRORS);
    } else if (action === "eventlogs"){
      setSelectedView(modalView.EVENTLOGS);
    } else {
      setSelectedView(modalView.SELECTOR);
    }

    return (() => {
      console.log('...desmontando tankModal')
    })

  }, [openModal]);

  return (
    <Modal openModal={openModal} toggleModal={toggleModal} height={height}>
      
      {/* Back Arrow */}
      {selectedView !== modalView.SELECTOR &&
        selectedView !== modalView.MEASURE &&
        selectedView !== modalView.ERRORS && 
        selectedView !== modalView.EVENTLOGS && (
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

      {/* MODAL DE VISUALIZACION DE DIFERENCIAS */}
      {openModal && selectedView === modalView.ERRORS && (
        <ErrorsView setHeight={setHeight}/>
      )}
      {/* MODAL DE MOVIMIENTOS DEL DIA  */}
      {openModal && selectedView === modalView.EVENTLOGS && (
        <EventsView triggerTank={triggerTank} setHeight={setHeight}/>
      )}
    </Modal>
  );
};

export default TankModal;
