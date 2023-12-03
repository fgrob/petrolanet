import React, { useEffect, useState } from "react";
import eventLogService from "../services/eventLog.service";
import { BiLoaderCircle } from "react-icons/bi";
import FiltersBar from "../components/database/FiltersBar";
import DatabaseTable from "../components/database/DatabaseTable";

const Database = ({setNavBarVisibility, setSideBarVisibility}) => {
  const [eventLogs, setEventLogs] = useState([]);
  const [filters, setFilters] = useState();
  const [filteredEventLogs, setFilteredEventLogs] = useState([]);
  const [clientSupplierList, setClientSupplierList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isTableReloading, setIsTableReloading] = useState(false); // for refetch eventlogs while keeping the currents filters

  const fetchEventLogs = (startDate, endDate) => {
    eventLogService
      .getEventLogs(startDate, endDate)
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
        setIsTableReloading(false);
      });
  };

  const createFiltersAndClientSupplierList = (eventLogs) => {
    const preClientSupplierList = [];

    const clientSupplierSet = new Set();
    const userSet = new Set();
    const operationSet = new Set();
    const tankTypeSet = new Set();
    const tankSet = new Set();
    const documentTypeSet = new Set();
    const documentNumberSet = new Set();

    eventLogs.forEach((eventLog) => {
      tankSet.add(eventLog.tank.name);
      operationSet.add(eventLog.operation.name);
      userSet.add(eventLog.user.username);
      tankTypeSet.add(eventLog.tank.type);

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
      tankTypeFilters: Object.fromEntries(
        [...tankTypeSet].map((value) => [value, true]),
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

        const isUserFiltered = filters.userFilters[eventLog.user.username];
        const isOperationFiltered =
          filters.operationFilters[eventLog.operation.name];
        const isTankTypeFiltered = filters.tankTypeFilters[eventLog.tank.type];
        const isTankFiltered = filters.tankFilters[eventLog.tank.name];

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
          isClientFiltered &&
          isSupplierFiltered &&
          isUserFiltered &&
          isOperationFiltered &&
          isTankTypeFiltered &&
          isTankFiltered &&
          isDocumentTypeFiltered &&
          isDocumentNumberFiltered
        );
      });
      console.log('Data Filtered: ', filteredData) // BORRAR
      setFilteredEventLogs(filteredData);
    }
  };

  useEffect(() => {
    fetchEventLogs();

    setNavBarVisibility(false);
    setSideBarVisibility(false);

    return () => {
      setNavBarVisibility(true);
      setSideBarVisibility(true);
    }
  }, []);

  return (
    <div className="flex border flex-col overflow-hidden bg-white h-screen pt-1">
      {isLoading ? (
        <div className="flex h-screen items-center justify-center ">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <>
          <FiltersBar
            eventLogs={eventLogs}
            filters={filters}
            setFilters={setFilters}
            generateFilteredEventLogs={generateFilteredEventLogs}
            filteredEventLogs={filteredEventLogs}
            clientSupplierList={clientSupplierList}
            fetchEventLogs={fetchEventLogs}
            setIsTableReloading={setIsTableReloading}
          />
          <DatabaseTable
            filteredEventLogs={filteredEventLogs}
            isTableReloading={isTableReloading}
          />
        </>
      )}
    </div>
  );
};

export default Database;
