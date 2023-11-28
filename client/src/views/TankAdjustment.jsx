import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { CiEdit } from "react-icons/ci";
import { BiLoaderCircle } from "react-icons/bi";

const TankAdjustment = () => {
  const { tanks } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [inputStates, setInputStates] = useState({});
  const [editMode, setEditMode] = useState({});

  const getBackgroundColor = (tankType) => {
    switch (tankType) {
      case "ESTANQUE":
        return "bg-ocean-green-700";
      case "ESTANQUE MOVIL":
        return "bg-[#17a254]";
      case "CAMION":
        return "bg-[#0f2d5c]";
      default:
        return;
    }
  };

  const typeOptions = ["ESTANQUE", "ESTANQUE MOVIL", "CAMION"];
  const tankGaugeOptions = [
    { label: "Sí", value: true },
    { label: "No", value: false },
  ];

  const initializeEditStates = () => {
    const editMode = {};
    const inputStates = {};

    for (const tank of tanks) {
      editMode[tank.name] = false; // cambiar a false
      inputStates[tank.name] = {
        type: {
          disabled: true,
          originalValue: tank.type,
          updatedValue: tank.type,
        },
        capacity: {
          disabled: true,
          originalValue: tank.capacity,
          updatedValue: tank.capacity,
        },
        balance: {
          disabled: true,
          originalValue: tank.current_quantity,
          updatedValue: tank.current_quantity,
        },
        error_quantity: {
          disabled: true,
          originalValue: tank.error_quantity,
          updatedValue: tank.error_quantity,
        },
        tank_gauge: {
          disabled: true,
          originalValue: tank.tank_gauge,
          updatedValue: tank.tank_gauge,
        },
        tank_number: {
          disabled: true,
          originalValue: tank.tank_number,
          updatedValue: tank.tank_number,
        },
      };
    }
    console.log(inputStates);

    setEditMode(editMode);
    setInputStates(inputStates);
  };

  const handleEditMode = (tankName, input, inputId) => {
    // set the tank in Edit Mode and enables the edition in the tank inputState

    const updatedEditMode = { ...editMode };
    updatedEditMode[tankName] = true;
    setEditMode(updatedEditMode);

    const updatedInputStates = { ...inputStates };
    updatedInputStates[tankName][input].disabled = false;
    setInputStates(updatedInputStates);

    let focus = document.getElementById(inputId);
    setTimeout(() => {
      focus.focus();
    }, 100);
  };

  const handleInputChange = (tankName, input, value) => {
    let fixedValue;
    if (value === "true" || value === "false") {
      fixedValue = value === "true"; // this sets fixedValue to a real boolean true or false (OJO, TAL VEZ NO ES NECESARIO A LA HORA DE LLAMAR A LA API)
    } else {
      fixedValue = value.replace(/[.,]/g, "");
    }

    const newInputStates = { ...inputStates };
    newInputStates[tankName][input].updatedValue = fixedValue;
    setInputStates(newInputStates);
    console.log("estados actualizados:", newInputStates); // BORRAR
  };

  useEffect(() => {
    if (tanks.length === 0) {
      // Guard clause. We need the tanks first
      return;
    }
    console.log(tanks);
    initializeEditStates();
    setIsLoading(false);
  }, [tanks]);

  return (
    <div className="flex flex-wrap content-between justify-evenly">
      {isLoading ? (
        <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <>
          {tanks
            .sort((a, b) => a.id - b.id)
            .map((tank) => {
              return (
                <div
                  key={tank.id}
                  className="m-2 flex w-[400px] flex-wrap rounded p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
                >
                  <h1
                    className={`h-fit w-full text-2xl font-bold uppercase ${getBackgroundColor(
                      tank.type,
                    )} rounded-lg p-1 text-white`}
                  >
                    {tank.name}
                  </h1>
                  <hr className="divider" />

                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center justify-center gap-1 text-center">
                      {/* Type row */}
                      <label
                        htmlFor={`tankType${tank.id}`}
                        className="mr-2 flex-1 text-end font-bold"
                      >
                        Tipo
                      </label>
                      <div className="relative w-1/2">
                        {inputStates[tank.name].type.originalValue !=
                          inputStates[tank.name].type.updatedValue && (
                          <div className="absolute start-3 text-xs text-red-500 line-through ">
                            {inputStates[tank.name].type.originalValue}
                          </div>
                        )}
                        <select
                          id={`tankType${tank.id}`}
                          value={inputStates[tank.name].type.updatedValue}
                          className="w-full border p-2"
                          disabled={inputStates[tank.name].type.disabled}
                          onChange={(e) =>
                            handleInputChange(tank.name, "type", e.target.value)
                          }
                        >
                          {typeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className=""
                        onClick={() =>
                          handleEditMode(
                            tank.name,
                            "type",
                            `tankType${tank.id}`,
                          )
                        }
                      >
                        <CiEdit className="h-7 w-7" />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-center">
                      {/* capacity Row  */}
                      <label
                        htmlFor={`tankCapacity${tank.id}`}
                        className="mr-2 flex-1 text-end font-bold"
                      >
                        Capacidad
                      </label>
                      <div className="relative w-1/2">
                        {inputStates[tank.name].capacity.originalValue !=
                          inputStates[tank.name].capacity.updatedValue && (
                          <div className="absolute start-3 text-xs text-red-500">
                            {inputStates[
                              tank.name
                            ].capacity.originalValue.toLocaleString("es-CL")}
                          </div>
                        )}
                        <input
                          id={`tankCapacity${tank.id}`}
                          value={inputStates[tank.name].capacity.updatedValue}
                          type="number"
                          className="w-full border p-2"
                          disabled={inputStates[tank.name].capacity.disabled}
                          onChange={(e) =>
                            handleInputChange(
                              tank.name,
                              "capacity",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleEditMode(
                            tank.name,
                            "capacity",
                            `tankCapacity${tank.id}`,
                          )
                        }
                      >
                        <CiEdit className="h-7 w-7" />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-center">
                      {/* balance Row  */}
                      <label
                        htmlFor={`tankBalance${tank.id}`}
                        className="mr-2 flex-1 text-end font-bold"
                      >
                        Saldo
                      </label>
                      <div className="relative w-1/2">
                        {inputStates[tank.name].balance.originalValue !=
                          inputStates[tank.name].balance.updatedValue && (
                          <div className="absolute start-3 text-xs text-red-500">
                            {inputStates[
                              tank.name
                            ].balance.originalValue.toLocaleString("es-CL")}
                          </div>
                        )}
                        <input
                          id={`tankBalance${tank.id}`}
                          value={inputStates[tank.name].balance.updatedValue}
                          type="number"
                          className="w-full border p-2"
                          disabled={inputStates[tank.name].balance.disabled}
                          onChange={(e) =>
                            handleInputChange(
                              tank.name,
                              "balance",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleEditMode(
                            tank.name,
                            "balance",
                            `tankBalance${tank.id}`,
                          )
                        }
                      >
                        <CiEdit className="h-7 w-7" />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-center">
                      {/* error_quantity Row  */}
                      <label
                        htmlFor={`tankError${tank.id}`}
                        className="mr-2 flex-1 text-end font-bold"
                      >
                        Diferencia
                      </label>
                      <div className="relative w-1/2">
                        {inputStates[tank.name]["error_quantity"]
                          .originalValue !=
                          inputStates[tank.name]["error_quantity"]
                            .updatedValue && (
                          <div className="absolute start-3 text-xs text-red-500">
                            {inputStates[tank.name][
                              "error_quantity"
                            ].originalValue.toLocaleString("es-CL")}
                          </div>
                        )}
                        <input
                          id={`tankError${tank.id}`}
                          value={
                            inputStates[tank.name]["error_quantity"]
                              .updatedValue
                          }
                          type="number"
                          className="w-full border p-2"
                          disabled={
                            inputStates[tank.name]["error_quantity"].disabled
                          }
                          onChange={(e) =>
                            handleInputChange(
                              tank.name,
                              "error_quantity",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleEditMode(
                            tank.name,
                            "error_quantity",
                            `tankError${tank.id}`,
                          )
                        }
                      >
                        <CiEdit className="h-7 w-7" />
                      </button>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-center">
                      {/* tank_gauge row */}
                      <label
                        htmlFor={`tankGauge${tank.id}`}
                        className="mr-2 flex-1 text-end font-bold"
                      >
                        Medidor
                      </label>
                      <div className="relative w-1/2">
                        <select
                          id={`tankGauge${tank.id}`}
                          value={
                            inputStates[tank.name]["tank_gauge"].updatedValue
                          }
                          className="w-full border p-2"
                          disabled={
                            inputStates[tank.name]["tank_gauge"].disabled
                          }
                          onChange={(e) =>
                            handleInputChange(
                              tank.name,
                              "tank_gauge",
                              e.target.value,
                            )
                          }
                        >
                          {tankGaugeOptions.map((option) => (
                            <option key={option.label} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        className=""
                        onClick={() =>
                          handleEditMode(
                            tank.name,
                            "tank_gauge",
                            `tankGauge${tank.id}`,
                          )
                        }
                      >
                        <CiEdit className="h-7 w-7" />
                      </button>
                    </div>

                    {inputStates[tank.name]["tank_gauge"].updatedValue && (
                      <div className="flex items-center justify-center gap-1 text-center">
                        {/* tank_number Row  */}
                        <label
                          htmlFor={`tankNumber${tank.id}`}
                          className="mr-2 flex-1 text-end font-bold"
                        >
                          Numeral
                        </label>
                        <div className="relative w-1/2">
                          {inputStates[tank.name]['tank_number'].originalValue !=
                            inputStates[tank.name]['tank_number'].updatedValue && (
                            <div className="absolute start-3 text-xs text-red-500">
                              {inputStates[
                                tank.name
                              ]['tank_number'].originalValue}
                            </div>
                          )}
                          <input
                            id={`tankNumber${tank.id}`}
                            value={inputStates[tank.name]['tank_number'].updatedValue}
                            type="number"
                            className="w-full border p-2"
                            disabled={inputStates[tank.name]['tank_number'].disabled}
                            onChange={(e) =>
                              handleInputChange(
                                tank.name,
                                "tank_number",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        <button
                          onClick={() =>
                            handleEditMode(
                              tank.name,
                              "tank_number",
                              `tankNumber${tank.id}`,
                            )
                          }
                        >
                          <CiEdit className="h-7 w-7" />
                        </button>
                      </div>
                    )}
                  </div>

                  <hr className="divider" />
                  <hr className="divider" />
                  {editMode[tank.name] && (
                    <div className=" flex w-full justify-center gap-3">
                      <button className="btn-error-small h-fit w-1/3 py-1">
                        Cancelar
                      </button>
                      <button className="btn-success-small h-fit w-1/3 py-1">
                        Guardar Cambios
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </>
      )}
    </div>
  );
};

export default TankAdjustment;
