import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../App";
import eventLogService from "../../services/eventLog.service";

const ErrorsView = () => {
  const { tanks, setTanks } = useContext(AppContext);
  const [eventLogs, setEventLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getEventLogs = () => {
    eventLogService.getLastErrorEvents().then((res) => {
      setEventLogs(res.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    console.log("los tanques", tanks); // BORRAR
    getEventLogs();
  }, []);

  useEffect(() => { // BORRAR
    console.log("los eventos:", eventLogs);
  }, [eventLogs]);

  return (
    <div className="border-2 border-purple-500 text-center">
      <div className="mb-2 mt-5 text-2xl text-ocean-green-500">
        Ultimas mediciones
      </div>
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <div>
          <table className="w-full table-auto divide-y divide-gray-200 overflow-scroll border-2 border-ocean-green-950">
            <thead className="sticky top-0 bg-gradient-to-r from-ocean-green-900 to-ocean-green-500 text-white">
              <tr className="text-xs uppercase tracking-wider">
                <th className="px-6 py-3 text-start">created at</th>
                <th className="px-6 py-3 text-start">tank id</th>
                <th className="px-6 py-3 text-start">error_quantity</th>
                <th className="px-6 py-3 text-start">measured_quantity</th>
                <th className="px-6 py-3 text-start">balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {eventLogs.map((eventLog, index) => (
                <tr className={index % 2 === 0 ? "" : "bg-gray-100"}>
                  <td>{eventLog.createdAt}</td>
                  <td>{eventLog.tank_id}</td>
                  <td>{eventLog.error_quantity.toLocaleString("es-CL")}</td>
                  <td>{eventLog.measured_balance.toLocaleString("es-CL")}</td>
                  <td>{eventLog.balance.toLocaleString("es-CL")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ErrorsView;
