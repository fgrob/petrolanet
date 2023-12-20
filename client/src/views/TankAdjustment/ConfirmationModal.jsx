import React, { useContext, useState } from "react";
import tankService from "../../services/tank.service";
import { AppContext } from "../../App";

const ConfirmationModal = ({
  selectedTankIdentifiers,
  selectedTankData,
  toggleModal,
}) => {
  const { setTanks } = useContext(AppContext);
  const [apiError, setApiError] = useState("");

  const keyLabels = {
    type: "Tipo",
    capacity: "Capacidad",
    current_quantity: "Saldo",
    error_quantity: "Diferencia",
    tank_gauge: "Medidor",
    tank_number: "Numeral",
  };

  const formattedData = (key, value) => {
    if (typeof value === "string") {
      const parsedValue = parseInt(value);
      return isNaN(parsedValue) ? value : parsedValue.toLocaleString("es-CL");
    } else if (typeof value === "number") {
      return key !== "tank_number" ? value.toLocaleString("es-CL") : value;
    } else if (typeof value === "boolean") {
      return value ? "Sí" : "No";
    } else {
      return value;
    }
  };

  const setUpdatedData = () => {
    const tankId = selectedTankIdentifiers.id;
    const changedData = {};

    for (const [key, value] of Object.entries(selectedTankData)) {
      if (value.originalValue != value.updatedValue) {
        changedData[key] = value.updatedValue;
      }
    }

    tankService
      .adjustment(tankId, changedData)
      .then((res) => {
        setTanks(res.data);
        toggleModal();
      })
      .catch((err) => {
        setApiError(err.message);
      });
  };

  return (
    <div className="overflow-x-auto">
      <h1
        className={`h-fit w-full rounded-lg p-1 text-center text-2xl font-bold uppercase`}
      >
        {selectedTankIdentifiers.name}
      </h1>
      <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
        <thead className="bg-gray-200 text-gray-700">
          <tr>
            <th className="border-b px-6 py-3 text-left font-semibold"></th>
            <th className="border-b px-6 py-3 text-left font-semibold">
              Original
            </th>
            <th className="border-b px-6 py-3 text-left font-semibold">
              Cambios
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(selectedTankData).map(([key, value]) => (
            <tr
              key={key}
              className="transition-all duration-300 hover:bg-gray-100"
            >
              <td className="border-b px-6 py-2">{keyLabels[key]}</td>
              <td className="border-b px-6 py-2">
                {value.originalValue != value.updatedValue ? (
                  <span className="font-bold text-red-700">
                    {formattedData(key, value.originalValue)}
                  </span>
                ) : (
                  <span> {formattedData(key, value.originalValue)}</span>
                )}
              </td>
              <td className="border-b px-6 py-2">
                {value.originalValue != value.updatedValue && (
                  <span className="font-bold text-ocean-green-700">
                    {formattedData(key, value.updatedValue)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-3 flex w-full justify-center gap-3">
        <button
          className="btn-error-small h-fit w-1/3 py-1"
          onClick={toggleModal}
        >
          Cancelar
        </button>
        <button
          className="btn-success-small h-fit w-1/3 py-1"
          onClick={() => setUpdatedData()}
        >
          Confirmar
        </button>
      </div>
      <div className="text-center font-bold text-red-500">{apiError}</div>
    </div>
  );
};

export default ConfirmationModal;
