import React from "react";

const AddTankModal = ({ typeOptions, tankGaugeOptions }) => {
  return (
    <div className="m-2 flex w-[400px] flex-wrap rounded p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
      <h1 className="h-fit w-full rounded-lg p-1 text-2xl font-bold uppercase"></h1>

      <hr className="divider" />

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center justify-center gap-1 text-center">
          {/* Type row */}
          <label htmlFor="tankType" className="mr-2 flex-1 text-end font-bold">
            Tipo
          </label>
          <div className="relative w-1/2">
            <select
              id="tankType"
              //   value=
              className="w-full border p-3"
              //   onChange={(e) =>
              //     handleInputChange(tank.name, "type", e.target.value)
              //   }
            >
              {typeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-center">
          {/* capacity Row  */}
          <label
            htmlFor="tankCapacity"
            className="mr-2 flex-1 text-end font-bold"
          >
            Capacidad
          </label>
          <div className="relative w-1/2">
            <input
              id="tankCapacity"
              //   value=
              type="number"
              className="w-full border p-3"
              //   onChange={(e) =>
              //     handleInputChange(tank.name, "capacity", e.target.value)
              //   }
            />
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-center">
          {/* tank_gauge row */}
          <label htmlFor="tankGauge" className="mr-2 flex-1 text-end font-bold">
            Medidor
          </label>
          <div className="relative w-1/2">
            <select
              id="tankGauge"
              //   value=
              className="w-full border p-3"
              //   onChange={(e) =>
              //     handleInputChange(tank.name, "tank_gauge", e.target.value)
              //   }
            >
              {tankGaugeOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* si el valor de tank_gauge es Sí, entonces:         */}
        <div className="flex items-center justify-center gap-1 text-center">
          {/* tank_number Row  */}
          <label
            htmlFor="tankNumber"
            className="mr-2 flex-1 text-end font-bold"
          >
            Numeral
          </label>
          <div className="relative w-1/2">

            <input
              id="tankNumber"
            //   value=
              type="number"
              className="w-full border p-3"
            //   onChange={(e) =>
            //     handleInputChange(tank.name, "tank_number", e.target.value)
            //   }
            />
          </div>
        </div>
      </div>

      <hr className="divider" />
      <div className=" flex w-full justify-center gap-3">
        <button
          className="btn-error-small h-fit w-1/3 py-1"
          // onClick={() => cancelEdition(tank.name)}
        >
          Cancelar
        </button>
        <button
          className="btn-success-small h-fit w-1/3 py-1"
          // onClick={() => handleConfirmationButton(tank.id, tank.name)}
        >
          Añadir
        </button>
      </div>
    </div>
  );
};

export default AddTankModal;
