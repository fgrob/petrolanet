import React, { useContext, useEffect, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { BiLoaderCircle } from "react-icons/bi";
import { AppContext } from "../App";
import Modal from "../components/Modal";
import ConfirmationModal from "./tankAdjustment/confirmationModal";
import AddTankModal from "./TankAdjustment/AddTankModal";

const TankAdjustment = () => {
  const { tanks } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [inputStates, setInputStates] = useState({});
  const [editMode, setEditMode] = useState({});

  const { openBackdrop, setOpenBackdrop } = useContext(AppContext);

  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [selectedTankIdentifiers, setSelectedTankIdentifiers] = useState({});
  const [selectedTankData, setSelectedTankData] = useState({});

  const [openAddTankModal, setOpenAddTankModal] = useState(false);

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
    // This creates an object containing all the values and current state of the inputs

    const editMode = {}; // handles the visualization of the actions buttons
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
        current_quantity: {
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
  };

  const adjustErrorAndCurrentQuantity = (tankName) => {
    // Adjusts the current quantity by summing the error quantity

    const newInputStates = { ...inputStates };

    newInputStates[tankName]["current_quantity"].disabled = false;
    newInputStates[tankName]["error_quantity"].disabled = false;

    newInputStates[tankName]["current_quantity"].updatedValue =
      parseInt(newInputStates[tankName]["current_quantity"].updatedValue) +
      parseInt(newInputStates[tankName]["error_quantity"].updatedValue);
    newInputStates[tankName]["error_quantity"].updatedValue = 0;

    setInputStates(newInputStates);
  };

  const cancelEdition = (tankName) => {
    const originalInputStates = { ...inputStates };
    const exitEditMode = { ...editMode };

    for (const key in originalInputStates[tankName]) {
      originalInputStates[tankName][key].disabled = true;
      originalInputStates[tankName][key].updatedValue =
        originalInputStates[tankName][key].originalValue;
    }

    setInputStates(originalInputStates);

    exitEditMode[tankName] = false;
    setEditMode(exitEditMode);
  };

  const handleConfirmationButton = (tankId, tankName) => {
    const identifiers = {
      id: tankId,
      name: tankName,
    };
    setSelectedTankIdentifiers(identifiers);

    const data = { ...inputStates[tankName] };
    setSelectedTankData(data);

    toggleConfirmationModal();
  };

  const toggleConfirmationModal = () => {
    setOpenConfirmationModal(!openConfirmationModal);
    setOpenBackdrop(!openBackdrop);
  };

  const toggleAddTankModal = () => {
    setOpenAddTankModal(!openAddTankModal);
    setOpenBackdrop(!openBackdrop);
  };

  useEffect(() => {
    if (tanks.length === 0) {
      // Guard clause. We need the tanks first
      return;
    }
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
          <div className="mx-4 my-3 flex w-5/6 justify-center">
            <button
              className="btn-success-small bg-yellow-400 px-4 font-bold"
              onClick={toggleAddTankModal}
            >
              Añadir Estanque
            </button>
          </div>
          <hr className="divider" />

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
                          <div className="absolute start-2 top-0.5 text-xs text-red-500">
                            Valor actual:{" "}
                            {inputStates[tank.name].type.originalValue}
                          </div>
                        )}
                        {/* <div className="border border-red-500 absolute"> */}
                        <select
                          id={`tankType${tank.id}`}
                          value={inputStates[tank.name].type.updatedValue}
                          className="w-full border p-3"
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
                        {/* </div> */}
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
                          <div className="absolute start-2 top-0.5 text-xs text-red-500">
                            Valor actual:{" "}
                            {inputStates[
                              tank.name
                            ].capacity.originalValue.toLocaleString("es-CL")}
                          </div>
                        )}
                        <input
                          id={`tankCapacity${tank.id}`}
                          value={inputStates[tank.name].capacity.updatedValue}
                          type="number"
                          className="w-full border p-3"
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
                      {/* current_quantity Row  */}
                      <label
                        htmlFor={`tankCurrentQuantity${tank.id}`}
                        className="mr-2 flex-1 text-end font-bold"
                      >
                        Saldo
                      </label>
                      <div className="relative w-1/2">
                        {inputStates[tank.name]["current_quantity"]
                          .originalValue !=
                          inputStates[tank.name]["current_quantity"]
                            .updatedValue && (
                          <div className="absolute start-2 top-0.5 text-xs text-red-500">
                            Valor actual:{" "}
                            {inputStates[tank.name][
                              "current_quantity"
                            ].originalValue.toLocaleString("es-CL")}
                          </div>
                        )}
                        <input
                          id={`tankCurrentQuantity${tank.id}`}
                          value={
                            inputStates[tank.name]["current_quantity"]
                              .updatedValue
                          }
                          type="number"
                          className="w-full border p-3"
                          disabled={
                            inputStates[tank.name]["current_quantity"].disabled
                          }
                          onChange={(e) =>
                            handleInputChange(
                              tank.name,
                              "current_quantity",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                      <button
                        onClick={() =>
                          handleEditMode(
                            tank.name,
                            "current_quantity",
                            `tankCurrentQuantity${tank.id}`,
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
                          <div className="absolute start-2 top-0.5 text-xs text-red-500">
                            Valor actual:{" "}
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
                          className={`w-full border p-3 font-bold ${
                            inputStates[tank.name]["error_quantity"]
                              .updatedValue < 0
                              ? "text-red-500"
                              : "text-ocean-green-500"
                          }`}
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
                          className="w-full border p-3"
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
                          {inputStates[tank.name]["tank_number"]
                            .originalValue !=
                            inputStates[tank.name]["tank_number"]
                              .updatedValue && (
                            <div className="absolute start-2 top-0.5 text-xs text-red-500">
                              Valor actual:{" "}
                              {
                                inputStates[tank.name]["tank_number"]
                                  .originalValue
                              }
                            </div>
                          )}
                          <input
                            id={`tankNumber${tank.id}`}
                            value={
                              inputStates[tank.name]["tank_number"].updatedValue
                            }
                            type="number"
                            className="w-full border p-3"
                            disabled={
                              inputStates[tank.name]["tank_number"].disabled
                            }
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
                  {inputStates[tank.name]["error_quantity"].updatedValue != 0 &&
                    editMode[tank.name] && (
                      <>
                        <div className="flex w-full justify-center p-2">
                          <button
                            className="rounded-lg border border-black bg-blue-100 px-2 italic hover:bg-blue-200 "
                            onClick={() =>
                              adjustErrorAndCurrentQuantity(tank.name)
                            }
                          >
                            Ajustar Saldo según diferencia
                          </button>
                        </div>
                        <hr className="divider" />
                      </>
                    )}
                  {editMode[tank.name] && (
                    <div className=" flex w-full justify-center gap-3">
                      <button
                        className="btn-error-small h-fit w-1/3 py-1"
                        onClick={() => cancelEdition(tank.name)}
                      >
                        Cancelar
                      </button>
                      <button
                        className="btn-success-small h-fit w-1/3 py-1"
                        onClick={() =>
                          handleConfirmationButton(tank.id, tank.name)
                        }
                      >
                        Actualizar
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
        </>
      )}
      {openConfirmationModal && (
        <Modal
          openModal={openConfirmationModal}
          toggleModal={toggleConfirmationModal}
          height="h-auto"
        >
          {selectedTankData.hasOwnProperty("type") && (
            <ConfirmationModal
              selectedTankIdentifiers={selectedTankIdentifiers}
              selectedTankData={selectedTankData}
              toggleModal={toggleConfirmationModal}
            />
          )}
        </Modal>
      )}
      {openAddTankModal && (
        <Modal
          openModal={openAddTankModal}
          toggleModal={toggleAddTankModal}
          height="h-auto"
        >
          <AddTankModal
            toggleModal={toggleAddTankModal}
            typeOptions={typeOptions}
            tankGaugeOptions={tankGaugeOptions}
            setIsLoading={setIsLoading}
          />
        </Modal>
      )}
    </div>
  );
};

export default TankAdjustment;
