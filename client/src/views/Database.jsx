import React, { useEffect, useState } from "react";
import eventLogService from "../services/eventLog.service";
import { BiLoaderCircle } from "react-icons/bi";
import { BiFilter } from "react-icons/bi";
import moment from "moment-timezone";
import FilterDropdown from "../components/common/FilterDropdown";
import Autocomplete from "../components/common/Autocomplete";
import { BiSolidCheckCircle } from "react-icons/bi";

const Database = ({ dispatchSideBarState }) => {
  const [eventLogs, setEventLogs] = useState([]);
  const [filteredEventLogs, setFilteredEventLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [openSearchBar, setOpenSearchBar] = useState(false);

  const [filters, setFilters] = useState();

  const [openTankFilter, setOpenTankFilter] = useState(false);
  const [openOperationFilter, setOpenOperationFilter] = useState(false);
  const [openUserFilter, setOpenUserFilter] = useState(false);
  const [openClientSupplierFilter, setOpenClientSupplierFilter] =
    useState(false);
  const [openDocumentTypeFilter, setOpenDocumentTypeFilter] = useState(false);
  const [openTypeFilter, setOpenTypeFilter] = useState(false);

  const [rut, setRut] = useState("");
  const [clientSupplier, setClientSupplier] = useState("");
  const [clientSupplierList, setClientSupplierList] = useState([]);
  const [clientSupplierInputError, setClientSupplierInputError] = useState("");

  const [documentNumber, setDocumentNumber] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const createFiltersAndClientSupplierList = (eventLogs) => {
    const tankSet = new Set();
    const operationSet = new Set();
    const userSet = new Set();
    const clientSupplierSet = new Set();
    const documentTypeSet = new Set();
    const typeSet = new Set();
    const documentNumberSet = new Set();

    const preClientSupplierList = [];

    eventLogs.forEach((eventLog) => {
      tankSet.add(eventLog.tank.name);
      operationSet.add(eventLog.operation.name);
      userSet.add(eventLog.user.username);
      typeSet.add(eventLog.tank.type);

      if (eventLog.client) {
        clientSupplierSet.add(eventLog.client.business_name);
        preClientSupplierList.push({
          rut: eventLog.client.rut,
          business_name: eventLog.client.business_name,
        });
      }

      if (eventLog.supplier) {
        clientSupplierSet.add(eventLog.supplier.business_name);
        preClientSupplierList.push({
          rut: eventLog.supplier.rut,
          business_name: eventLog.supplier.business_name,
        });
      }

      eventLog.document_type && documentTypeSet.add(eventLog.document_type);
      eventLog.document_number &&
        documentNumberSet.add(eventLog.document_number);
    });

    const filters = {
      // First, we create an array using map with the values along with true, then we convert it into an object
      tankFilters: Object.fromEntries(
        [...tankSet].map((value) => [value, true]),
      ), // spread operator for make an array. A 'set' object is not an array
      typeFilters: Object.fromEntries(
        [...typeSet].map((value) => [value, true]),
      ),
      operationFilters: Object.fromEntries(
        [...operationSet].map((value) => [value, true]),
      ),
      userFilters: Object.fromEntries(
        [...userSet].map((value) => [value, true]),
      ),
      clientSupplierFilters: {
        "(SIN DATA)": true,
        ...Object.fromEntries(
          [...clientSupplierSet].map((value) => [value, true]),
        ),
      },
      documentTypeFilters: {
        "(SIN DATA)": true,
        ...Object.fromEntries(
          [...documentTypeSet].map((value) => [value, true]),
        ),
      },
      documentNumberFilters: {
        "(SIN DATA)": true,
        ...Object.fromEntries(
          [...documentNumberSet].map((value) => [value, true]),
        ),
      },
    };

    const uniqueValues = [];
    const clientSupplierList = preClientSupplierList.filter((element) => {
      const isDuplicate = uniqueValues.includes(element.rut);

      if (!isDuplicate) {
        uniqueValues.push(element.rut);
        return true;
      }
      return false;
    });

    return { filters, clientSupplierList };
  };

  const generateFilteredEventLogs = (eventLogs) => {
    // Filters the 'eventLogs' data based on selected filters and stores the result in the 'filteredEventLogs' state, which is used to construct the table.

    if (filters !== undefined) {
      console.log(filters); // BORRAR

      const filteredData = eventLogs.filter((eventLog) => {
        const isTankFiltered = filters.tankFilters[eventLog.tank.name];
        const isTypeFiltered = filters.typeFilters[eventLog.tank.type];
        const isOperationFiltered =
          filters.operationFilters[eventLog.operation.name];
        const isUserFiltered = filters.userFilters[eventLog.user.username];

        let isClientFiltered = true;
        let isSupplierFiltered = true;

        eventLog.client &&
          (isClientFiltered =
            filters.clientSupplierFilters[eventLog.client.business_name]);
        eventLog.supplier &&
          (isSupplierFiltered =
            filters.clientSupplierFilters[eventLog.supplier.business_name]);
        if (!eventLog.client && !eventLog.supplier) {
          isClientFiltered = filters.clientSupplierFilters["(SIN DATA)"];
          isSupplierFiltered = filters.clientSupplierFilters["(SIN DATA)"];
        }

        let isDocumentTypeFiltered = true;
        if (eventLog.document_type) {
          isDocumentTypeFiltered =
            filters.documentTypeFilters[eventLog.document_type];
        } else {
          isDocumentTypeFiltered = filters.documentTypeFilters["(SIN DATA)"];
        }

        let isDocumentNumberFiltered = true;
        if (eventLog.document_number) {
          isDocumentNumberFiltered =
            filters.documentNumberFilters[eventLog.document_number];
        } else {
          isDocumentNumberFiltered =
            filters.documentNumberFilters["(SIN DATA)"];
        }

        return (
          isTankFiltered &&
          isTypeFiltered &&
          isOperationFiltered &&
          isUserFiltered &&
          isClientFiltered &&
          isSupplierFiltered &&
          isDocumentTypeFiltered &&
          isDocumentNumberFiltered
        );
      });
      setFilteredEventLogs(filteredData);
    }
  };

  const handleFilter = (filterType, selectedOption) => {
    // (direct filters in the headers)
    const newFilters = { ...filters };
    newFilters[filterType][selectedOption] =
      !newFilters[filterType][selectedOption];
    setFilters(newFilters);
  };

  const handleFilterSelector = (filterType, selectedOption) => {
    const newFilters = { ...filters };

    for (const option in newFilters[filterType]) {
      newFilters[filterType][option] =
        selectedOption === "TODOS" || selectedOption === option;
    }
    setFilters(newFilters);
  };

  const handleDocumentNumberFilter = (value) => {
    const newFilters = { ...filters };

    for (const option in newFilters["documentNumberFilters"]) {
      if (option.includes(value)) {
        newFilters["documentNumberFilters"][option] = true;
      } else {
        newFilters["documentNumberFilters"][option] = false;
      }
    }
    setFilters(newFilters);
  };

  const handleDateFilter = () => {
    const parseCustomDate = (input) => {
      //To prevent the timezone differences when creating a new date directly from the date state
      const [year, month, day] = input.split("-").map(Number);
      return new Date(year, month - 1, day); // month's start in 0
    };

    let dateFromISO;
    let dateToISO;

    if (dateFrom) {
      dateFromISO = parseCustomDate(dateFrom);
    }

    if (dateTo) {
      dateToISO = parseCustomDate(dateTo);
    }

    const filteredByDate = eventLogs.filter((eventLog) => {
      const eventDate = new Date(eventLog.createdAt);
      eventDate.setHours(0, 0, 0, 0);

      if (dateFrom && dateTo) {
        return eventDate >= dateFromISO && eventDate <= dateToISO;
      } else if (dateFrom) {
        return eventDate >= dateFromISO;
      } else if (dateTo) {
        return eventDate <= dateToISO;
      } else {
        return true;
      }
    });
    generateFilteredEventLogs(filteredByDate);
  };

  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
    generateFilteredEventLogs(eventLogs);
  };

  useEffect(() => {
    eventLogService
      .getEventLogs()
      .then((res) => {
        console.log(res.data); // BORRAR
        setEventLogs(res.data);
        setFilteredEventLogs(res.data);

        const { filters, clientSupplierList } =
          createFiltersAndClientSupplierList(res.data);
        setFilters(filters);
        console.log(filters); // BORRAR
        setClientSupplierList(clientSupplierList);
      })
      .catch((err) => {
        console.log(err); // borrar ?
        // error management *
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (dateFrom || dateTo) {
      handleDateFilter(); // this include the generateFilteredEventLogs
    } else {
      generateFilteredEventLogs(eventLogs);
    }
  }, [filters]);

  useEffect(() => {
    // handle the client-supplier selector filter
    if (filters) {
      const newFilters = { ...filters };

      for (const option in newFilters["clientSupplierFilters"]) {
        const newFilters = { ...filters };

        clientSupplier
          ? (newFilters["clientSupplierFilters"][option] =
              clientSupplier === option)
          : (newFilters["clientSupplierFilters"][option] = true);

        setFilters(newFilters);
      }
    }
  }, [clientSupplier]);

  const operationColorMap = {
    1: "bg-green-400 font-semibold px-2 py-1 rounded", // CARGA
    2: "bg-red-400 font-semibold px-2 py-1 rounded", // DESCARGA
    3: "bg-purple-400 font-semibold px-2 py-1 rounded", // TRASPASO
    4: "bg-yellow-400 text-gray-900 font-semibold px-2 py-1 rounded", // AJUSTE
    5: "bg-blue-400 font-semibold px-2 py-1 rounded", // MEDICION
  };

  return (
    <div className="fixed left-0 top-0 flex h-full w-screen flex-col overflow-hidden border-2 border-green-500 bg-white">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <>
          <div
            className={`${
              openSearchBar ? "h-full" : "h-10"
            } flex flex-col bg-orange-500 transition-all duration-300`}
          >
            <div className="border-4 border-red-500">
              <button
                className="bg-purple-500 p-1"
                onClick={() => setOpenSearchBar(!openSearchBar)}
              >
                Buscar o filtrar!
              </button>
            </div>
            <div className="flex-1 border-4 border-blue-500">
              <label htmlFor="operationSelector" className="">
                Operaciones
              </label>
              <select
                id="operationSelector"
                className="rounded border border-gray-300 p-1"
                onChange={(e) =>
                  handleFilterSelector("operationFilters", e.target.value)
                }
              >
                <option value="TODOS">TODOS</option>
                {Object.keys(filters.operationFilters).map((value) => (
                  <option value={value}>{value}</option>
                ))}
              </select>

              <label htmlFor="tankSelector">Estanques</label>
              <select
                id="tankSelector"
                onChange={(e) =>
                  handleFilterSelector("tankFilters", e.target.value)
                }
              >
                <option value="TODOS">TODOS</option>
                {Object.keys(filters.tankFilters).map((value) => (
                  <option value={value}>{value}</option>
                ))}
              </select>

              <label htmlFor="userSelector">Usuarios</label>
              <select
                id="userSelector"
                onChange={(e) =>
                  handleFilterSelector("userFilters", e.target.value)
                }
              >
                <option value="TODOS">TODOS</option>
                {Object.keys(filters.userFilters).map((value) => (
                  <option value={value}>{value}</option>
                ))}
              </select>

              <label htmlFor="documentTypeSelector">Documentos</label>
              <select
                id="documentTypeSelector"
                onChange={(e) =>
                  handleFilterSelector("documentTypeFilters", e.target.value)
                }
              >
                <option value="TODOS">TODOS</option>
                {Object.keys(filters.documentTypeFilters).map((value) => (
                  <option value={value}>{value}</option>
                ))}
              </select>

              <label htmlFor="typeSelector">Tipo</label>
              <select
                id="typeSelector"
                onChange={(e) =>
                  handleFilterSelector("typeFilters", e.target.value)
                }
              >
                <option value="TODOS">TODOS</option>
                {Object.keys(filters.typeFilters).map((value) => (
                  <option value={value}>{value}</option>
                ))}
              </select>

              <Autocomplete
                inputValue={rut}
                setInputValue={setRut}
                setClientSupplier={setClientSupplier}
                suggestions={clientSupplierList.map((client) => ({
                  value: client.rut,
                  label: client.business_name,
                }))}
                autocompleteError={clientSupplierInputError}
                setAutocompleteError={setClientSupplierInputError}
              />

              <div className="relative w-full">
                <label htmlFor="clientSupplierInput" className="block">
                  Cliente / Proveedor
                </label>
                <BiSolidCheckCircle
                  className={`absolute right-4 top-8 h-6 w-6 text-green-600 transition-opacity duration-200 ease-in-out ${
                    clientSupplier ? "opacity-100" : "opacity-0"
                  }`}
                />
                <input
                  id="clientSupplierInput"
                  name="clientSupplierInput"
                  value={clientSupplier}
                  className="w-full rounded-lg border border-gray-400 px-3 py-2"
                  disabled
                />
              </div>

              <label>Folio</label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-400 px-3 py-2"
                onChange={(e) => handleDocumentNumberFilter(e.target.value)}
              />

              <label htmlFor="inputDateFrom">Desde:</label>
              <input
                id="inputDateFrom"
                onChange={(e) => setDateFrom(e.target.value)}
                type="date"
                value={dateFrom}
                className="w-full rounded-lg border border-gray-400 px-3 py-2"
              />
              <label htmlFor="inputDateTo">Hasta:</label>
              <input
                id="inputDateTo"
                onChange={(e) => setDateTo(e.target.value)}
                type="date"
                value={dateTo}
                className="w-full rounded-lg border border-gray-400 px-3 py-2"
              />
              <button className="btn-success" onClick={handleDateFilter}>
                Filtrar
              </button>
              <button className="btn-error" onClick={clearDateFilter}>
                Limpiar fechas
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full table-auto  divide-y divide-gray-200 overflow-scroll border-2 border-red-500">
              <thead className="sticky top-0 bg-gradient-to-r from-ocean-green-900 to-ocean-green-500 text-white">
                <tr className="text-xs uppercase tracking-wider">
                  <th className="hidden px-6 py-3 md:block">ID</th>
                  <th className="px-6 py-3 text-start">Fecha</th>
                  <th className="px-6 py-3 text-start">
                    Operación
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenOperationFilter(!openOperationFilter)
                        }
                      >
                        <BiFilter className="h-5 w-5 hover:bg-gray-500 " />
                      </button>
                      {openOperationFilter && (
                        <FilterDropdown
                          filters={filters.operationFilters}
                          handleFilter={handleFilter}
                          filterType={"operationFilters"}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-start">
                    Usuario
                    <div className="relative">
                      <button
                        onClick={() => setOpenUserFilter(!openUserFilter)}
                      >
                        <BiFilter className="h-5 w-5 hover:bg-gray-500" />
                      </button>
                      {openUserFilter && (
                        <FilterDropdown
                          filters={filters.userFilters}
                          handleFilter={handleFilter}
                          filterType={"userFilters"}
                        />
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
                          filterType={"tankFilters"}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-start">Movimiento</th>
                  <th className="px-6 py-3 text-start">Saldo</th>
                  <th className="px-6 py-3 text-start">Regla</th>
                  <th className="px-6 py-3 text-start">Numeral</th>
                  <th className="px-6 py-3 text-start">
                    Documento
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenDocumentTypeFilter(!openDocumentTypeFilter)
                        }
                      >
                        <BiFilter className="h-5 w-5 hover:bg-gray-500" />
                      </button>
                      {openDocumentTypeFilter && (
                        <FilterDropdown
                          filters={filters.documentTypeFilters}
                          handleFilter={handleFilter}
                          filterType={"documentTypeFilters"}
                        />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-start">Folio</th>
                  <th className="px-6 py-3 text-start">
                    Cliente / Proveedor
                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenClientSupplierFilter(!openClientSupplierFilter)
                        }
                      >
                        <BiFilter className="h-5 w-5 hover:bg-gray-500 " />
                      </button>
                      {openClientSupplierFilter && (
                        <FilterDropdown
                          filters={filters.clientSupplierFilters}
                          handleFilter={handleFilter}
                          filterType={"clientSupplierFilters"}
                        />
                      )}
                    </div>
                  </th>
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
                          : eventlog.supplier &&
                            eventlog.supplier.business_name}
                      </td>
                      <td className="whitespace-nowrap px-6 text-sm text-gray-900">
                        {eventlog.notes}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Database;
