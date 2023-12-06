import React, { useEffect, useState } from "react";
import eventLogService from "../../services/eventLog.service";
import moment from "moment-timezone";
import { BiLoaderCircle } from "react-icons/bi";
import { operationColorMap } from "../common/formatting";
import ModalSimple from "../common/ModalSimple";
import { MdOutlineComment } from "react-icons/md";

const EventsView = ({ triggerTank, setHeight }) => {
  const [eventLogs, setEventLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openNotesModal, setOpenNotesModal] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");

  const getEventLogs = () => {
    let date = new Date().toLocaleDateString();
    eventLogService.getEventLogs(date, date, triggerTank.id).then((res) => {
      console.log("kiipa", res.data);
      setEventLogs(res.data);
      setIsLoading(false);
    });
  };

  const handleOpenNote = (note) => {
    setSelectedNote(note);
    toggleNotesModal();
  };

  const toggleNotesModal = () => {
    setOpenNotesModal(!openNotesModal);
  };

  useEffect(() => {
    console.log(triggerTank);
    setHeight("auto");
    getEventLogs();
    console.log("ESTANQUEDETONADOR: ", triggerTank); // boorrar
  }, []);

  return (
    <div className="overflow-hidden text-center">
      <div className="text-2xl text-ocean-green-500">Movimientos del día</div>
      <div className="mb-2 font-bold">{triggerTank.name}</div>
      {isLoading ? (
        <div className="flex justify-center">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <div className="max-h-96 w-full overflow-auto rounded-md shadow-md landscape:h-4/5">
          <table className="table-auto divide-y divide-gray-200">
            <thead className="sticky top-0 bg-gradient-to-r from-ocean-green-900 to-ocean-green-500 text-white">
              <tr className="text-xs uppercase tracking-wider">
                <th className="px-3 py-3">FECHA</th>
                <th className="px-3 py-3">OPERACIÓN</th>
                <th className="whitespace-nowrap px-3 py-3">MOVIMIENTO</th>
                <th className="px-3 py-3">CLIENTE / PROVEEDOR</th>
                <th className="px-3 py-3">NOTAS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {eventLogs.map((eventLog, index) => (
                <tr
                  key={eventLog.id}
                  className={index % 2 === 0 ? "" : "bg-gray-100"}
                >
                  <td className=" whitespace-nowrap">
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
                  <td>
                    {eventLog.transaction_quantity.toLocaleString("es-CL")}
                  </td>
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {eventLog.client
                      ? eventLog.client.business_name
                      : eventLog.supplier && eventLog.supplier.business_name}
                  </td>
                  <td>
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
        </div>
      )}
      {openNotesModal && (
        <ModalSimple content={selectedNote} toggleModal={toggleNotesModal} />
      )}
    </div>
  );
};

export default EventsView;
