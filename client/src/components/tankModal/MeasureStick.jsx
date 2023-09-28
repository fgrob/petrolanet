import React, { useContext, useState } from "react";
import tankService from "../../services/tank.service";
import { AppContext } from "../../App";

const MeasureStick = ({ triggerTank, toggleModal }) => {
  const { tanks, setTanks } = useContext(AppContext);
  const [quantity, setQuantity] = useState("");

  const handleMeasure = (e) => {
    e.preventDefault();
    tankService
      .tankMeasurement(triggerTank.id, quantity)
      .then((res) => {
        console.log(res.data)
        setTanks(res.data);
        toggleModal();
      })
      .catch(() => {
        console.log("ERROR");
      });
  };

  return (
    <div>
      <div>Medición de Estanque</div>
      <form onSubmit={handleMeasure}>
        <div>
          <label>Ingresa los litros</label>
          <input
            type="text"
            id="quantity"
            name="quantity"
            value={quantity}
            max={100000}
            onChange={(e) => {
              if (e.target.value <= 100000) {
                setQuantity(e.target.value);
              }
              e.target.setCustomValidity("");
            }}
            className=" h-12 w-full rounded-lg border border-gray-600"
            required
            pattern="[0-9]*"
            autoComplete="off"
            onInvalid={(e) =>
              e.target.setCustomValidity("Debes ingresar una cantidad válida")
            }
          />
        </div>
        <div>
          <button type="submit" className="btn-success">
            Ingresar medición
          </button>
        </div>
      </form>
    </div>
  );
};

export default MeasureStick;
