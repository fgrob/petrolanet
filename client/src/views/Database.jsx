import React, { useEffect, useState } from "react";
import eventLogService from "../services/eventLog.service";
import { BiLoaderCircle } from "react-icons/bi";
import FiltersBar from "../components/database/FiltersBar";
import DatabaseTable from "../components/database/DatabaseTable";

const Database = () => {
  const [eventLogs, setEventLogs] = useState([]);
  const [filters, setFilters] = useState();
  const [filteredEventLogs, setFilteredEventLogs] = useState([]);
  const [clientSupplierList, setClientSupplierList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const fetchEventLogs = (startDate, endDate) => {
    setIsLoading(true);
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
      });
  };

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

  useEffect(() => {
    fetchEventLogs();
  }, []);

  return (
    <div className="fixed left-0 top-0 flex h-full w-screen flex-col overflow-hidden bg-white">
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
            clientSupplierList={clientSupplierList}
            fetchEventLogs={fetchEventLogs}
          />
          <DatabaseTable filteredEventLogs={filteredEventLogs} />
        </>
      )}
    </div>
  );
};

export default Database;
