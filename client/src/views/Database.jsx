import React, { useEffect, useState } from "react";
import eventLogService from "../services/eventLog.service";
import { BiLoaderCircle } from "react-icons/bi";
import moment from "moment-timezone";

const Database = () => {
  const [eventLogs, setEventLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    eventLogService
      .getEventLogs()
      .then((res) => {
        console.log(res.data);
        setEventLogs(res.data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto border-2 border-red-500">
      {isLoading ? (
        <div className="flex h-16 items-center justify-center">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <div className="">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr className="sticky top-0">
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider sticky top-0">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider sticky top-0">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Operación
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Estanque
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Movimiento
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Regla
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Numeral
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Folio
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Cliente / Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Notas
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {eventLogs.map((eventlog) => (
                <tr key={eventlog.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {moment(eventlog.createdAt)
                      .tz("America/Santiago")
                      .format("DD/MM/yyyy - HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.operation.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.tank.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {parseInt(eventlog.transaction_quantity).toLocaleString("es-CL")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {parseInt(eventlog.balance).toLocaleString("es-CL")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.measured_balance &&
                      parseInt(eventlog.measured_balance).toLocaleString("es-CL")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.tank_number_to_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.document_type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.document_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.client
                      ? eventlog.client.business_name
                      : eventlog.supplier && eventlog.supplier.business_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {eventlog.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Database;
