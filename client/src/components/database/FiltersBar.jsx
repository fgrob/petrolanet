import React, { useEffect, useRef, useState } from "react";
import Autocomplete from "../common/Autocomplete";
import { BiSolidCheckCircle } from "react-icons/bi";
import useMountStatus from "../common/useMountStatus";
import { IoHomeSharp } from "react-icons/io5";

import { Link } from "react-router-dom";

const FiltersBar = ({
  filters,
  setFilters,
  clientSupplierList,
  eventLogs,
  generateFilteredEventLogs,
  fetchEventLogs,
  setIsTableReloading,
}) => {
  const isFirstRender = useMountStatus(); // añadir esta wea a notion
  const [openFiltersBar, setOpenFiltersBar] = useState(false);
  const [isAnyFilterApplied, setIsAnyFilterApplied] = useState(false);

  const [rut, setRut] = useState("");
  const prevRut = useRef(rut);
  const [selectedClientSupplier, setSelectedClientSupplier] = useState("");
  const [clientSupplierInputError, setClientSupplierInputError] = useState("");

  const [selectedUser, setSelectedUser] = useState("TODOS");
  const prevSelectedUser = useRef(selectedUser);
  const [selectedOperation, setSelectedOperation] = useState("TODOS");
  const prevSelectedOperation = useRef(selectedOperation);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedTankType, setSelectedTankType] = useState("TODOS");
  const prevSelectedTankType = useRef(selectedTankType);
  const [selectedTank, setSelectedTank] = useState("TODOS");
  const prevSelectedTank = useRef(selectedTank);

  const [selectedDocumentType, setSelectedDocumentType] = useState("TODOS");
  const prevSelectedDocumentType = useRef(selectedDocumentType);
  const [documentNumber, setDocumentNumber] = useState("");
  const prevDocumentNumber = useRef(documentNumber);

  const handleFilterSelector = (filterType, selectedValue) => {
    const newFilters = { ...filters };

    for (const option in newFilters[filterType]) {
      if (filterType === "clientSupplierFilters") {
        selectedValue
          ? (newFilters["clientSupplierFilters"][option] =
              selectedValue === option) // only the matching value is true
          : (newFilters["clientSupplierFilters"][option] = true); // if no client/supplier is assigned, then all values are true
      } else if (filterType === "documentNumberFilters") {
        if (option.includes(selectedValue)) {
          newFilters["documentNumberFilters"][option] = true;
        } else {
          newFilters["documentNumberFilters"][option] = false;
        }
      } else {
        newFilters[filterType][option] =
          selectedValue === "TODOS" || selectedValue === option; // when TODOS is selected, it sets all options to 'true'
      }
    }
    setFilters(newFilters);
  };

  const handleDateFilter = () => {
    if (!startDate) {
      defaultDate(true, false); // setDefaultStartDate, setDefaultEndDate
    }

    if (!endDate) {
      defaultDate(false, true);
    }

    setIsTableReloading(true);
    fetchEventLogs(startDate, endDate);

    // fetchEventLogs will create a new filters list (and client/supplier list) based on the response data.
    // The response data will not have filteres applied
    clearFiltersWithoutEffect();
  };

  const resetClientSupplierFilter = () => {
    setSelectedClientSupplier("");
    setRut("");
  };

  const resetDocumentNumberFilter = () => {
    setDocumentNumber("");
  };

  const resetDateAndFilters = () => {
    defaultDate();
    setIsTableReloading(true);
    fetchEventLogs();
    clearFiltersWithoutEffect();
  };

  const resetFilters = () => {
    //this does not include the Date filter

    const newFilters = { ...filters };

    for (const key in newFilters) {
      for (const subKey in newFilters[key]) {
        newFilters[key][subKey] = true;
      }
    }
    setFilters(newFilters);
    clearFiltersWithoutEffect();
  };

  const clearFiltersWithoutEffect = () => {
    // this is to clear the selectors and inputs without triggering each handleFilter
    // this does not include the Date filter
    prevRut.current = "";
    prevSelectedUser.current = "TODOS";
    prevSelectedOperation.current = "TODOS";
    prevSelectedTankType.current = "TODOS";
    prevSelectedTank.current = "TODOS";
    prevSelectedDocumentType.current = "TODOS";
    prevDocumentNumber.current = "";
    setRut("");
    setSelectedClientSupplier("");
    setSelectedUser("TODOS");
    setSelectedOperation("TODOS");
    setSelectedTankType("TODOS");
    setSelectedTank("TODOS");
    setSelectedDocumentType("TODOS");
    setDocumentNumber("");

    setIsAnyFilterApplied(false);
  };

  const checkActiveFilters = () => {
    //for knowing if there is any filter active
    // this does not include the Date filter

    if (
      rut !== "" ||
      selectedUser !== "TODOS" ||
      selectedOperation !== "TODOS" ||
      selectedTankType !== "TODOS" ||
      selectedTank !== "TODOS" ||
      documentNumber !== ""
    ) {
      setIsAnyFilterApplied(true);
    } else {
      setIsAnyFilterApplied(false);
    }
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

  useEffect(() => {
    // set's the table data
    generateFilteredEventLogs(eventLogs);
  }, [filters]);

  useEffect(() => {
    // set's the dates in the inputs
    defaultDate();
  }, []);

  useEffect(() => {
    //Handles changes in the filters

    // track which state changed and go for it. This 'prev' technique also helps prevent the initial useEffect execution
    if (prevRut.current !== rut) {
      handleFilterSelector("clientSupplierFilters", selectedClientSupplier);
      prevRut.current = rut;
    }

    if (prevSelectedUser.current !== selectedUser) {
      handleFilterSelector("userFilters", selectedUser);
      prevSelectedUser.current = selectedUser;
    }

    if (prevSelectedOperation.current !== selectedOperation) {
      handleFilterSelector("operationFilters", selectedOperation);
      prevSelectedOperation.current = selectedOperation;
    }

    if (prevSelectedTankType.current !== selectedTankType) {
      handleFilterSelector("tankTypeFilters", selectedTankType);
      prevSelectedTankType.current = selectedTankType;
    }

    if (prevSelectedTank.current !== selectedTank) {
      handleFilterSelector("tankFilters", selectedTank);
      prevSelectedTank.current = selectedTank;
    }

    if (prevSelectedDocumentType.current !== selectedDocumentType) {
      handleFilterSelector("documentTypeFilters", selectedDocumentType);
      prevSelectedDocumentType.current = selectedDocumentType;
    }

    if (prevDocumentNumber.current !== documentNumber) {
      handleFilterSelector("documentNumberFilters", documentNumber);
      prevDocumentNumber.current = documentNumber;
    }

    checkActiveFilters();
  }, [
    selectedClientSupplier,
    selectedUser,
    selectedOperation,
    selectedTankType,
    selectedTank,
    selectedDocumentType,
    documentNumber,
  ]);

  return (
    <div
      className={`${
        openFiltersBar
          ? "h-5/6 overflow-auto md:h-3/5 lg:overflow-hidden"
          : "h-11 overflow-hidden"
      } bg-gray-50 transition-all duration-300`}
    >
      <div className="flex justify-between p-1">
        <div className="flex gap-1">
          <button
            className="rounded border border-black bg-blue-950 p-1 font-bold text-white shadow-lg hover:bg-blue-800"
            onClick={() => setOpenFiltersBar(!openFiltersBar)}
          >
            Filtros
          </button>
          <button
            className="rounded border border-black bg-blue-400 p-1 font-bold shadow-lg hover:bg-blue-200"
            onClick={resetFilters}
          >
            Limpiar Filtros
          </button>
          {isAnyFilterApplied && (
            <div>HAY UN FILTRO ACTIVO!!</div>
          )}
        </div>
        <Link
          to="/"
          className="flex border border-yellow-500 text-black hover:text-gray-500"
        >
          <div className="h-full w-7 border border-black">
            <IoHomeSharp className="h-full w-full" />
          </div>
          <div className="flex items-center border border-blue-500">Inicio</div>
        </Link>
      </div>
      <div className="flex flex-wrap gap-3 bg-gray-50 p-2 md:justify-evenly">
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
              setClientSupplier={setSelectedClientSupplier}
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
                selectedClientSupplier ? "opacity-100" : "opacity-0"
              }`}
            />
            <input
              id="clientSupplierInput"
              name="clientSupplierInput"
              value={selectedClientSupplier}
              className="w-full rounded-lg border border-black bg-gray-200 px-3 py-2"
              disabled
            />
          </div>
          <div className="flex w-full justify-end md:w-auto">
            <button
              className="rounded border border-red-400 p-2 text-xs font-bold text-red-500 shadow hover:bg-red-200"
              onClick={resetClientSupplierFilter}
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
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              <option value="TODOS">TODOS</option>
              {Object.keys(filters.userFilters).map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
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
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
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
              htmlFor="tankTypeSelector"
              className="mb-2 block text-sm font-bold"
            >
              Tipo de estanque
            </label>
            <select
              id="tankTypeSelector"
              className="w-full rounded border border-gray-300 p-2"
              value={selectedTankType}
              onChange={(e) => setSelectedTankType(e.target.value)}
            >
              <option value="TODOS">TODOS</option>
              {Object.keys(filters.tankTypeFilters).map((value) => (
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
              value={selectedTank}
              onChange={(e) => setSelectedTank(e.target.value)}
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
              onClick={handleDateFilter}
            >
              Filtrar por fecha
            </button>
            <button
              className="ml-2 rounded border border-red-400 p-2 text-xs font-bold text-red-500 shadow hover:bg-red-200"
              onClick={resetDateAndFilters}
            >
              Limpiar fechas
            </button>
          </div>
        </div>

        <div className="flex w-full flex-wrap content-start gap-1 md:w-1/3">
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
              value={selectedDocumentType}
              onChange={(e) => setSelectedDocumentType(e.target.value)}
            >
              <option value="TODOS">TODOS</option>
              {Object.keys(filters.documentTypeFilters).map((value) => (
                <option value={value} key={value}>
                  {value}
                </option>
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
              onClick={resetDocumentNumberFilter}
            >
              Limpiar Folio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersBar;
