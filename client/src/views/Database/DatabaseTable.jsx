import React, { useContext, useState } from "react";
import moment from "moment-timezone";
import { BiLoaderCircle } from "react-icons/bi";
import { MdOutlineComment } from "react-icons/md";
import { AppContext } from "../../App";
import Modal from "../../components/Modal";
import { operationColorMap } from "../../components/formatting";

const DatabaseTable = ({ filteredEventLogs, isTableReloading }) => {
  const { openBackdrop, setOpenBackdrop } = useContext(AppContext);
  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const handleOpenNote = (note) => {
    setSelectedNote(note);
    toggleModal();
  };

  const toggleModal = () => {
    setOpenNotesModal(!openNotesModal);
    setOpenBackdrop(!openBackdrop);
  };

  return (
    <div className="flex-1 overflow-auto">
      {isTableReloading ? (
        <div className="flex h-full items-center justify-center">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <table className="w-full table-auto  divide-y divide-gray-200 overflow-scroll ">
          <thead className="sticky top-0 bg-gradient-to-r from-ocean-green-900 to-ocean-green-500 text-white">
            <tr className="text-xs uppercase tracking-wider">
              <th className="hidden px-6 py-3 md:block">ID</th>
              <th className="px-6 py-3 text-start">Fecha</th>
              <th className="px-6 py-3 text-start">Operación</th>
              <th className="px-6 py-3 text-start">Usuario</th>
              <th className="px-6 py-3 text-start">Estanque</th>
              <th className="px-6 py-3 text-start">Movimiento</th>
              <th className="px-6 py-3 text-start">Saldo</th>
              <th className="px-6 py-3 text-start">Regla</th>
              <th className="px-6 py-3 text-start">Diferencia</th>
              <th className="px-6 py-3 text-start">Numeral</th>
              <th className="px-6 py-3 text-start">Documento</th>
              <th className="px-6 py-3 text-start">Folio</th>
              <th className="px-6 py-3 text-start">Cliente / Proveedor</th>
              <th className="px-6 py-3 text-start">Notas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredEventLogs
              .sort((a, b) => b.id - a.id)
              .map((eventLog, index) => (
                <tr
                  key={eventLog.id}
                  className={index % 2 === 0 ? "" : "bg-gray-100"}
                >
                  <td className="hidden whitespace-nowrap px-6 text-sm text-gray-900 md:block">
                    {eventLog.id}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {moment(eventLog.createdAt)
                      .tz("America/Santiago")
                      .format("DD/MM/yyyy - HH:mm")}
                  </td>
                  <td
                    className={`${
                      operationColorMap[eventLog.operation.id]
                    } whitespace-nowrap px-6 text-sm text-gray-900`}
                  >
                    {eventLog.operation.name}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {eventLog.user}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm font-bold text-gray-900">
                    {eventLog.tank.name}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {parseInt(eventLog.transaction_quantity).toLocaleString(
                      "es-CL",
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {parseInt(eventLog.balance).toLocaleString("es-CL")}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {eventLog.measured_balance &&
                      parseInt(eventLog.measured_balance).toLocaleString(
                        "es-CL",
                      )}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    <span
                      className={`${
                        eventLog.error_quantity < 0
                          ? "font-bold text-red-500"
                          : "font-bold text-green-500"
                      }`}
                    >
                      {eventLog.error_quantity && (
                        <span>
                          {parseInt(eventLog.error_quantity).toLocaleString(
                            "es-CL",
                          )}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {eventLog.tank_number_to_date != 0 && (
                      <span>{eventLog.tank_number_to_date}</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {eventLog.document_type}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {eventLog.document_number}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {eventLog.client
                      ? eventLog.client.business_name
                      : eventLog.supplier && eventLog.supplier.business_name}
                  </td>
                  <td className="whitespace-nowrap text-gray-900">
                    {eventLog.notes && (
                      <div className="flex items-center justify-center">
                        <button onClick={() => handleOpenNote(eventLog.notes)}>
                          <MdOutlineComment />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
      <Modal
        openModal={openNotesModal}
        toggleModal={toggleModal}
        height="h-auto"
      >
        <div className="overflow-hidden whitespace-normal break-words p-5">
          {selectedNote}
        </div>
      </Modal>
    </div>
  );
};

export default DatabaseTable;
