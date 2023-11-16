import React, { useEffect, useState } from "react";
import Autocomplete from "../common/Autocomplete";
import { BiSolidCheckCircle } from "react-icons/bi";
import useMountStatus from "../common/useMountStatus";

const FiltersBar = ({
  filters,
  setFilters,
  clientSupplierList,
  eventLogs,
  generateFilteredEventLogs,
  fetchEventLogs,
  setIsTableReloading,
}) => {
  const isFirstRender = useMountStatus();

  const [openFiltersBar, setOpenFiltersBar] = useState(false);
  const [rut, setRut] = useState("");
  const [clientSupplier, setClientSupplier] = useState("");
  const [clientSupplierInputError, setClientSupplierInputError] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");

  const handleFilterSelector = (filterType, selectedOption) => {
    const newFilters = { ...filters };

    for (const option in newFilters[filterType]) {
      newFilters[filterType][option] =
        selectedOption === "TODOS" || selectedOption === option;
    }
    setFilters(newFilters);
  };

  const clearClientSupplierFilter = () => {
    setClientSupplier("");
    setRut("");
  };

  const handleDocumentNumberFilter = () => {
    const newFilters = { ...filters };

    for (const option in newFilters["documentNumberFilters"]) {
      if (option.includes(documentNumber)) {
        newFilters["documentNumberFilters"][option] = true;
      } else {
        newFilters["documentNumberFilters"][option] = false;
      }
    }
    setFilters(newFilters);
  };

  const clearDocumentNumberFilter = () => {
    setDocumentNumber("");
  };

  const defaultDate = (
    setDefaultStartDate = true,
    setDefaultEndDate = true,
  ) => {
    let date = new Date().toLocaleDateString(); // for UTC differences management
    let [month, day, year] = date.split("/");

    if (setDefaultStartDate) {
      let startDateMonth = month;
      let startDateYear = year;

      if (month === "1") {
        // january case
        startDateMonth = "12";
        startDateYear = parseInt(year) - 1;
      } else {
        startDateMonth = parseInt(month) - 1;
        startDateMonth = startDateMonth.toString(); // the following padStart requires string
      }

      startDateMonth = startDateMonth.padStart(2, "0"); // add a leading zero if it is less than 10 (required):

      const startDate = `${startDateYear}-${startDateMonth}-01`;
      setStartDate(startDate);
    }

    if (setDefaultEndDate) {
      month = month.padStart(2, "0"); // add a leading zero if it is less than 10 (required):
      const endDate = `${year}-${month}-${day}`;
      setEndDate(endDate);
    }
  };

  const handleDate = () => {
    if (!startDate) {
      defaultDate(true, false); // setDefaultStartDate, setDefaultEndDate
    }

    if (!endDate) {
      defaultDate(false, true);
    }

    setIsTableReloading(true);
    fetchEventLogs(startDate, endDate);
  };

  const clearDateFilter = () => {
    defaultDate();
    setIsTableReloading(true);
    fetchEventLogs();
  };

  useEffect(() => {
    // set's the table data
    generateFilteredEventLogs(eventLogs);
  }, [filters]);

  useEffect(() => {
    // set's the dates in the inputs
    defaultDate();
  }, []);

  useEffect(() => {
    // handles the client-supplier selector filter
    if (!isFirstRender) {
      const newFilters = { ...filters };

      for (const option in newFilters["clientSupplierFilters"]) {
        clientSupplier
          ? (newFilters["clientSupplierFilters"][option] =
              clientSupplier === option) // only the matching value is true
          : (newFilters["clientSupplierFilters"][option] = true); // if no client supplier is assigned, then all values are considered true
      }
      setFilters(newFilters);
    }
  }, [clientSupplier]);

  useEffect(() => {
    // handles the document number input filter

    !isFirstRender && handleDocumentNumberFilter();
  }, [documentNumber]);

  return (
    <div className="border-2 border-red-500">
      <div
        className={`${
          openFiltersBar ? "h-auto" : "h-10 overflow-hidden"
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
        <div className="flex flex-wrap gap-3 bg-gray-100 p-2 md:justify-evenly">
          {/* All Filters  */}

          <div className="flex w-full flex-wrap gap-1">
            {/* Client Supplier Filter*/}
            <label
              htmlFor="autocompleteInput"
              className="mb-2 block w-full text-sm font-bold"
            >
              Cliente / Proveedor
            </label>
            <div className="w-full md:w-auto md:flex-1">
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
            <div className="relative flex-1">
              <BiSolidCheckCircle
                className={`absolute right-4 top-2 h-6 w-6 text-green-600 transition-opacity duration-200 ease-in-out ${
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
            <div className="flex w-full justify-end md:w-auto">
              <button
                className="rounded border border-red-400 p-2 text-xs font-bold text-red-500 shadow hover:bg-red-200"
                onClick={clearClientSupplierFilter}
              >
                Limpiar cliente
              </button>
            </div>
          </div>

          <div className="flex w-full gap-1 md:w-1/3">
            {/* User & Operation Filters  */}
            <div className="flex-1 gap-1">
              {/* User Selector */}
              <label
                htmlFor="userSelector"
                className="mb-2 block text-sm font-bold"
              >
                Usuario
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
            <div className="flex-1 gap-1">
              {/* Operation Selector */}
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
          </div>

          <div className="flex w-full gap-1 md:w-1/3">
            {/* Tank Type & Tank Filters  */}
            <div className="flex-1 gap-1">
              {/* Type Selector */}
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
            <div className="flex-1 gap-1">
              {/* Tank Selector */}
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
          </div>

          <div className="flex w-full flex-wrap gap-1 md:w-1/3">
            {/* Date Filters */}
            <div className="flex-1 gap-1">
              {/* At Date Selector  */}
              <label
                htmlFor="inputDateFrom"
                className="mb-2 block text-sm font-bold"
              >
                Desde:
              </label>
              <input
                id="inputDateFrom"
                onChange={(e) => setStartDate(e.target.value)}
                type="date"
                value={startDate}
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div className="flex-1 gap-1">
              {/* To Date Selector  */}
              <label
                htmlFor="inputDateTo"
                className="mb-2 block text-sm font-bold"
              >
                Hasta:
              </label>
              <input
                id="inputDateTo"
                onChange={(e) => setEndDate(e.target.value)}
                type="date"
                value={endDate}
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>
            <div className="flex w-full justify-end">
              <button
                className="rounded border border-ocean-green-400 p-2 text-xs font-bold text-ocean-green-500 shadow hover:bg-ocean-green-200"
                onClick={handleDate}
              >
                Filtrar por fecha
              </button>
              <button
                className="ml-2 rounded border border-red-400 p-2 text-xs font-bold text-red-500 shadow hover:bg-red-200"
                onClick={clearDateFilter}
              >
                Limpiar fechas
              </button>
            </div>
          </div>

          <div className="flex w-full flex-wrap gap-1 md:w-1/3">
            {/* Document Filters */}
            <div className="flex-1 gap-1">
              {/* Document Type Selector  */}
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
            <div className="flex-1 gap-1">
              {/* Document Number Selector  */}
              <label
                htmlFor="documentNumberInput"
                className="mb-2 block text-sm font-bold"
              >
                Folio
              </label>
              <input
                id="documentNumberInput"
                type="number"
                value={documentNumber}
                className="w-full rounded border border-gray-300 p-2"
                onChange={(e) => setDocumentNumber(e.target.value)}
              />
            </div>
            <div className="flex w-full justify-end">
              <button
                className="rounded border border-red-400 p-2 text-xs font-bold text-red-500 shadow hover:bg-red-200"
                onClick={clearDocumentNumberFilter}
              >
                Limpiar Folio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
