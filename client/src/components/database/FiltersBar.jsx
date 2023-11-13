import React, { useEffect, useState } from "react";
import Autocomplete from "../common/Autocomplete";
import { BiSolidCheckCircle } from "react-icons/bi";

const FiltersBar = ({
  filters,
  setFilters,
  clientSupplierList,
  eventLogs,
  generateFilteredEventLogs,
}) => {
  const [rut, setRut] = useState("");
  const [clientSupplier, setClientSupplier] = useState("");
  const [clientSupplierInputError, setClientSupplierInputError] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [openFiltersBar, setOpenFiltersBar] = useState(false);

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
    // handle the client-supplier selector filter
    // if (filters) {
    const newFilters = { ...filters };

    for (const option in newFilters["clientSupplierFilters"]) {
      const newFilters = { ...filters };

      clientSupplier
        ? (newFilters["clientSupplierFilters"][option] =
            clientSupplier === option)
        : (newFilters["clientSupplierFilters"][option] = true);

      setFilters(newFilters);
    }
    // }
  }, [clientSupplier]);

  useEffect(() => {
    if (dateFrom || dateTo) {
      handleDateFilter(); // this include the generateFilteredEventLogs
    } else {
      generateFilteredEventLogs(eventLogs);
    }
  }, [filters]);

  return (
    <div className="border-2 border-red-500">
      <div
        className={`${
          openFiltersBar ? "h-96" : "h-10"
        } flex flex-col border-4 border-blue-500 bg-orange-500 transition-all duration-300`}
      >
        {/* <div className="border-4 border-red-500"> */}
        <button
          className="bg-purple-500 p-1"
          onClick={() => setOpenFiltersBar(!openFiltersBar)}
        >
          Buscar o filtrar!
        </button>
        {/* </div> */}
        <div className="flex flex-col flex-wrap justify-evenly overflow-auto bg-ocean-green-50 p-2 md:flex-row">
          {/* Operation Selector */}
          <div>
            <label
              htmlFor="operationSelector"
              className="mb-2 block text-sm font-bold"
            >
              Operación
            </label>
            <select
              id="operationSelector"
              className="w-full rounded border border-gray-300 p-2"
              onChange={(e) =>
                handleFilterSelector("operationFilters", e.target.value)
              }
            >
              <option value="TODOS">TODOS</option>
              {Object.keys(filters.operationFilters).map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Type Selector */}
          <div className="mb-4 md:w-1/8">
            <label
              htmlFor="typeSelector"
              className="mb-2 block text-sm font-bold"
            >
              Tipo de estanque
            </label>
            <select
              id="typeSelector"
              className="w-full rounded border border-gray-300 p-2"
              onChange={(e) =>
                handleFilterSelector("typeFilters", e.target.value)
              }
            >
              <option value="TODOS">TODOS</option>
              {Object.keys(filters.typeFilters).map((value) => (
                <option value={value} key={value}>
                  {value.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Tank Selector */}
          <div className="mb-4 md:w-1/8">
            <label
              htmlFor="tankSelector"
              className="mb-2 block text-sm font-bold"
            >
              Estanque
            </label>
            <select
              id="tankSelector"
              className="w-full rounded border border-gray-300 p-2"
              onChange={(e) =>
                handleFilterSelector("tankFilters", e.target.value)
              }
            >
              <option value="TODOS">TODOS</option>
              {Object.keys(filters.tankFilters).map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {/* Document Type Selector */}
          <div className="mb-4 md:w-1/8">
            <label
              htmlFor="documentTypeSelector"
              className="mb-2 block text-sm font-bold"
            >
              Tipo de documento
            </label>
            <select
              id="documentTypeSelector"
              className="w-full rounded border border-gray-300 p-2"
              onChange={(e) =>
                handleFilterSelector("documentTypeFilters", e.target.value)
              }
            >
              <option value="TODOS">TODOS</option>
              {Object.keys(filters.documentTypeFilters).map((value) => (
                <option value={value}>{value}</option>
              ))}
            </select>
          </div>

          {/* Document Number Input */}
          <div className="mb-4 md:w-1/8">
            <label
              htmlFor="documentNumberInput"
              className="mb-2 block text-sm font-bold"
            >
              Folio
            </label>
            <input
              id="documentNumberInput"
              type="number"
              className="w-full rounded border border-gray-300 p-2"
              onChange={(e) => handleDocumentNumberFilter(e.target.value)}
            />
          </div>

          {/* User Selector */}
          <div className="mb-4 md:w-1/8">
            <label
              htmlFor="userSelector"
              className="mb-2 block text-sm font-bold"
            >
              Usuarios
            </label>
            <select
              id="userSelector"
              className="w-full rounded border border-gray-300 p-2"
              onChange={(e) =>
                handleFilterSelector("userFilters", e.target.value)
              }
            >
              <option value="TODOS">TODOS</option>
              {Object.keys(filters.userFilters).map((value) => (
                <option value={value}>{value}</option>
              ))}
            </select>
          </div>

          <div className="mb-4 flex flex-wrap items-center">
            {/* Client Supplier Filter*/}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap justify-center gap-1">
                <div>
                  <label
                    htmlFor="autocompleteInput"
                    className="mb-2 block text-sm font-bold"
                  >
                    Cliente / Proveedor
                  </label>
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
                </div>
                <div className="flex items-end relative">
                <BiSolidCheckCircle
                  className={`absolute right-4 top-8 h-6 w-6 text-green-600 transition-opacity duration-200 ease-in-out ${
                    clientSupplier ? "opacity-100" : "opacity-0"
                  }`}
                />
                <input
                  id="clientSupplierInput"
                  name="clientSupplierInput"
                  value={clientSupplier}
                  className="w-full rounded-lg border border-black bg-gray-200 px-3 py-2"
                  disabled
                />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="ml-2 rounded border border-red-400 p-2 text-xs font-bold text-red-500 shadow hover:bg-red-200"
                  onClick={clearDateFilter}
                >
                  Limpiar cliente
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center">
            {/* Date Filter*/}
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap justify-center gap-1">
                <div>
                  <label
                    htmlFor="inputDateFrom"
                    className="mb-2 block text-sm font-bold"
                  >
                    Desde:
                  </label>
                  <input
                    id="inputDateFrom"
                    onChange={(e) => setDateFrom(e.target.value)}
                    type="date"
                    value={dateFrom}
                    className="rounded border border-gray-300 p-2"
                  />
                </div>
                <div>
                  <label
                    htmlFor="inputDateTo"
                    className="mb-2 block text-sm font-bold"
                  >
                    Hasta:
                  </label>
                  <input
                    id="inputDateTo"
                    onChange={(e) => setDateTo(e.target.value)}
                    type="date"
                    value={dateTo}
                    className="rounded border border-gray-300 p-2"
                  />
                </div>
              </div>
              <div className="flex">
                <div className="flex flex-1 justify-end">
                  <button
                    className="rounded border border-ocean-green-400 p-2 text-xs font-bold text-ocean-green-500 shadow hover:bg-ocean-green-200"
                    onClick={handleDateFilter}
                  >
                    Filtrar por fecha
                  </button>
                </div>
                <button
                  className="ml-2 rounded border border-red-400 p-2 text-xs font-bold text-red-500 shadow hover:bg-red-200"
                  onClick={clearDateFilter}
                >
                  Limpiar fechas
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
