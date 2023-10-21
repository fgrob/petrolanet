import React, { useEffect, useState } from "react";
import eventLogService from "../services/eventLog.service";
import { BiLoaderCircle } from "react-icons/bi";
import { BiFilter } from "react-icons/bi";
import moment from "moment-timezone";
import FilterDropdown from "../components/common/FilterDropdown";

const Database = ({ dispatchSideBarState }) => {
  const [eventLogs, setEventLogs] = useState([]);
  const [filteredEventLogs, setFilteredEventLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState();

  const [filterOptions, setFilterOptions] = useState([]);
  const [openTankFilter, setOpenTankFilter] = useState(false);
  const [openOperationFilter, setOpenOperationFilter] = useState(false);
  const [openUserFilter, setOpenUserFilter] = useState(false);

  useEffect(() => {
    eventLogService
      .getEventLogs()
      .then((res) => {
        console.log(res.data);
        setEventLogs(res.data);
        setFilteredEventLogs(res.data);
        return res.data;
      })
      .then((data) => {
        // Filters creation
        const tankSet = new Set();
        const operationSet = new Set();
        const userSet = new Set();

        data.forEach((eventLog) => {
          tankSet.add(eventLog.tank.name);
          operationSet.add(eventLog.operation.name);
          userSet.add(eventLog.user.username);
        });

        setFilters({
          // Primero hacemos un array con map de los valores junto con el true, luego lo convertimos en un objeto
          tankFilters: Object.fromEntries(
            [...tankSet].map((value) => [value, true]),
          ), // spread operator for make an array. A 'set' object is not
          operationFilters: Object.fromEntries(
            [...operationSet].map((value) => [value, true]),
          ),
          userFilters: Object.fromEntries(
            [...userSet].map((value) => [value, true]),
          ),
        });

        console.log(filters);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log("primera ejecucion del use efect filteres");
    if (filters !== undefined) {
      console.log("segunda ejecucion. Filters ahora tiene valores");
      console.log(filters);

      const filteredData = eventLogs.filter((eventLog) => {
        const isTankFiltered = filters.tankFilters[eventLog.tank.name];
        const isOperationFiltered =
          filters.operationFilters[eventLog.operation.name];
        const isUserFiltered = filters.userFilters[eventLog.user.username];

        return isTankFiltered && isOperationFiltered && isUserFiltered;
      });

      setFilteredEventLogs(filteredData);
    }
  }, [filters]);

  const handleFilter = (filterType, selectedOption) => {
    const newFilters = { ...filters };
    newFilters[filterType][selectedOption] =
      !newFilters[filterType][selectedOption];
    setFilters(newFilters);
  };

  const operationColorMap = {
    1: "bg-green-400 font-semibold px-2 py-1 rounded", // CARGA
    2: "bg-red-400 font-semibold px-2 py-1 rounded", // DESCARGA
    3: "bg-purple-400 font-semibold px-2 py-1 rounded", // TRASPASO
    4: "bg-yellow-400 text-gray-900 font-semibold px-2 py-1 rounded", // AJUSTE
    5: "bg-blue-400 font-semibold px-2 py-1 rounded", // MEDICION
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-screen flex-col overflow-hidden border-2 border-green-500 bg-white">
      <div className="bg-orange-500">ola</div>
      <div className="flex-1 overflow-auto">
        <table className="w-full table-auto  divide-y divide-gray-200 overflow-scroll border-2 border-red-500">
          <thead className="sticky top-0 bg-gradient-to-r from-ocean-green-900 to-ocean-green-500 text-white">
            <tr className="text-xs uppercase tracking-wider">
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3 text-start">Fecha</th>
              <th className="px-6 py-3 text-start">
                Operación
                <div className="relative">
                  <button
                    onClick={() => setOpenOperationFilter(!openOperationFilter)}
                  >
                    <BiFilter className="h-5 w-5 hover:bg-gray-500 " />
                  </button>
                  {openOperationFilter && (
                    <FilterDropdown
                      filters={filters.operationFilters}
                      handleFilter={handleFilter}
                      filterType={'operationFilters'}
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-start">
                Usuario
                <div className="relative">
                  <button onClick={() => setOpenUserFilter(!openUserFilter)}>
                    <BiFilter className="h-5 w-5 hover:bg-gray-500" />
                  </button>
                  {openUserFilter && (
                    <FilterDropdown filters={filters.userFilters} handleFilter={handleFilter} filterType={'userFilters'} />
                  )}
                </div>
              </th>
              <th className="flex items-center justify-between border border-yellow-500 px-6 py-3 text-start">
                <span className="border border-blue-500">Estanque</span>
                <div className="relative border border-red-500">
                  <button
                    className=""
                    onClick={() => setOpenTankFilter(!openTankFilter)}
                  >
                    <BiFilter className="h-5 w-5 hover:bg-gray-500 " />
                  </button>
                  {openTankFilter && (
                    <FilterDropdown
                      filters={filters.tankFilters}
                      handleFilter={handleFilter}
                      filterType={'tankFilters'}
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-start">Movimiento</th>
              <th className="px-6 py-3 text-start">Saldo</th>
              <th className="px-6 py-3 text-start">Regla</th>
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
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
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
                    {eventlog.tank_number_to_date}
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
                  <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                    {eventlog.notes}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="fixed left-0 top-0 w-full border-4 border-red-500">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <div className="h-full w-full overflow-scroll border-2 border-blue-500 bg-gray-50 text-center">
          <div className="w-full border-2 border-yellow-500">
            esto es un div!
          </div>

          <table className="divide-y divide-gray-200">
            <thead className="sticky top-0 bg-gray-300">
              <tr className="text-xs uppercase tracking-wider">
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Fecha</th>
                <th className="px-6 py-3">Operación</th>
                <th className="px-6 py-3">Usuario</th>
                <th className="px-6 py-3">Estanque</th>
                <th className="px-6 py-3">Movimiento</th>
                <th className="px-6 py-3">Saldo</th>
                <th className="px-6 py-3">Regla</th>
                <th className="px-6 py-3">Numeral</th>
                <th className="px-6 py-3">Documento</th>
                <th className="px-6 py-3">Folio</th>
                <th className="px-6 py-3">Cliente / Proveedor</th>
                <th className="px-6 py-3">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {eventLogs
                .sort((a, b) => b.id - a.id)
                .map((eventlog, index) => (
                  <tr
                    key={eventlog.id}
                    className={index % 2 === 0 ? "" : "bg-gray-100"}
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {eventlog.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {moment(eventlog.createdAt)
                        .tz("America/Santiago")
                        .format("DD/MM/yyyy - HH:mm")}
                    </td>
                    <td
                      className={`${
                        operationColorMap[eventlog.operation.id]
                      } whitespace-nowrap px-6 py-4 text-sm text-gray-900`}
                    >
                      {eventlog.operation.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {eventlog.user.username}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                      {eventlog.tank.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-gray-900">
                      {parseInt(eventlog.transaction_quantity).toLocaleString(
                        "es-CL",
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {parseInt(eventlog.balance).toLocaleString("es-CL")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {eventlog.measured_balance &&
                        parseInt(eventlog.measured_balance).toLocaleString(
                          "es-CL",
                        )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {eventlog.tank_number_to_date}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {eventlog.document_type}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {eventlog.document_number}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {eventlog.client
                        ? eventlog.client.business_name
                        : eventlog.supplier && eventlog.supplier.business_name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
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
