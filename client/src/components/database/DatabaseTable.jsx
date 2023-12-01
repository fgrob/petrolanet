import React, { useContext, useState } from "react";
import moment from "moment-timezone";
import { BiLoaderCircle } from "react-icons/bi";
import { MdOutlineComment } from "react-icons/md";
import { AppContext } from "../../App";
import Modal from "../common/Modal";

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

  const operationColorMap = {
    1: "bg-red-400 font-semibold px-2 py-1 rounded text-center", // COMPRA
    2: "bg-green-400 font-semibold px-2 py-1 rounded text-center", // VENTA
    3: "bg-purple-400 font-semibold px-2 py-1 rounded text-center", // TRASPASO
    4: "bg-yellow-400 text-gray-900 font-semibold px-2 py-1 rounded text-center", // AJUSTE
    5: "bg-blue-400 font-semibold px-2 py-1 rounded text-center", // MEDICION
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
              .map((eventlog, index) => (
                <tr
                  key={eventlog.id}
                  className={index % 2 === 0 ? "" : "bg-gray-100"}
                >
                  <td className="hidden whitespace-nowrap px-6 text-sm text-gray-900 md:block">
                    {eventlog.id}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {moment(eventlog.createdAt)
                      .tz("America/Santiago")
                      .format("DD/MM/yyyy - HH:mm")}
                  </td>
                  <td
                    className={`${
                      operationColorMap[eventlog.operation.id]
                    } whitespace-nowrap px-6 text-sm text-gray-900`}
                  >
                    {eventlog.operation.name}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {eventlog.user.username}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm font-bold text-gray-900">
                    {eventlog.tank.name}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {parseInt(eventlog.transaction_quantity).toLocaleString(
                      "es-CL",
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {parseInt(eventlog.balance).toLocaleString("es-CL")}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {eventlog.measured_balance &&
                      parseInt(eventlog.measured_balance).toLocaleString(
                        "es-CL",
                      )}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    <span
                      className={`${
                        eventlog.error_quantity < 0
                          ? "font-bold text-red-500"
                          : "font-bold text-green-500"
                      }`}
                    >
                      {eventlog.error_quantity && (
                        <span>
                          {parseInt(eventlog.error_quantity).toLocaleString(
                            "es-CL",
                          )}
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {eventlog.tank_number_to_date != 0 && (
                      <span>{eventlog.tank_number_to_date}</span>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {eventlog.document_type}
                  </td>
                  <td className="whitespace-nowrap px-6 text-end text-sm text-gray-900">
                    {eventlog.document_number}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {eventlog.client
                      ? eventlog.client.business_name
                      : eventlog.supplier && eventlog.supplier.business_name}
                  </td>
                  <td className="whitespace-nowrap text-gray-900">
                    {eventlog.notes && (
                      <div className="flex items-center justify-center">
                        <button onClick={() => handleOpenNote(eventlog.notes)}>
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
      <Modal openModal={openNotesModal} toggleModal={toggleModal} height="auto">
        <div className="overflow-hidden whitespace-normal break-words">
          {selectedNote}
        </div>
      </Modal>
    </div>
  );
};

export default DatabaseTable;
