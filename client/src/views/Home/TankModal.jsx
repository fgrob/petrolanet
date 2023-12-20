import React, { useEffect, useState } from "react";
import { IoArrowBack } from "react-icons/io5";
import TransferView from "./TransferView";
import SelectorView from "./SelectorView";
import ClientSupplierView from "./ClientSupplierView";
import MeasureStick from "./MeasureStick";
import ErrorsView from "./ErrorsView";
import Modal from "../../components/Modal";
import EventsView from "./EventsView";

const TankModal = ({
  openModal,
  toggleModal,
  modalView,
  setModalView,
  modalViewOptions,
  action,
  triggerTank,
}) => {
  const [height, setHeight] = useState(null);
  const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);

  useEffect(() => {
    setIsConfirmationVisible(false);
  }, [openModal]);

  return (
    <Modal openModal={openModal} toggleModal={toggleModal} height={height}>
      {/* Back Arrow */}
      {modalView !== modalViewOptions.SELECTOR &&
        modalView !== modalViewOptions.MEASURE &&
        modalView !== modalViewOptions.ERRORS &&
        modalView !== modalViewOptions.EVENTLOGS && (
          <button
            onClick={() => {
              isConfirmationVisible
                ? setIsConfirmationVisible(false)
                : setModalView(modalViewOptions.SELECTOR);
            }}
            className="absolute left-1 top-1"
          >
            <IoArrowBack className="h-9 w-9" />
          </button>
        )}

      {/* MODAL DE SELECCION  */}
      {openModal && modalView === modalViewOptions.SELECTOR && (
        <SelectorView
          action={action}
          modalViewOptions={modalViewOptions}
          setModalView={setModalView}
        />
      )}
      {/* MODAL DE TRANSFERENCIA  */}
      {openModal && modalView === modalViewOptions.TRANSFER && (
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
        (modalView === modalViewOptions.REFILL ||
          modalView === modalViewOptions.SALE) && (
          <ClientSupplierView
            action={action}
            triggerTank={triggerTank}
            toggleModal={toggleModal}
            isConfirmationVisible={isConfirmationVisible}
            setIsConfirmationVisible={setIsConfirmationVisible}
          />
        )}

      {/* MODAL DE MEDICION DE ESTANQUE */}
      {openModal && modalView === modalViewOptions.MEASURE && (
        <MeasureStick triggerTank={triggerTank} toggleModal={toggleModal} />
      )}

      {/* MODAL DE VISUALIZACION DE DIFERENCIAS */}
      {openModal && modalView === modalViewOptions.ERRORS && (
        <ErrorsView setHeight={setHeight} />
      )}
      {/* MODAL DE MOVIMIENTOS DEL DIA  */}
      {openModal && modalView === modalViewOptions.EVENTLOGS && (
        <EventsView triggerTank={triggerTank} setHeight={setHeight} />
      )}
    </Modal>
  );
};

export default TankModal;
