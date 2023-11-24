import React, { useContext, useState } from "react";
import { AppContext } from "../../App";
import tankService from "../../services/tank.service";

const AdjustmentView = ({ toggleModal }) => {
  const { tanks, setTanks } = useContext(AppContext);

  return (
    <div className="text-center border-2 border-red-500">
      <div className="mb-2 mt-5 text-2xl text-ocean-green-500">
        Ajustar estanques
      </div>
      <div>
      <table className="w-full table-auto divide-y divide-gray-200 overflow-scroll border-2 border-ocean-green-950">
          <thead className="sticky top-0 bg-gradient-to-r from-ocean-green-900 to-ocean-green-500 text-white">
            <tr className="text-xs uppercase tracking-wider">
              <th className="px-6 py-3 text-start">ESTANQUE</th>
              <th className="px-6 py-3 text-start">SALDO</th>
              <th className="px-6 py-3 text-start">DIFERENCIA</th>
              <th className="px-6 py-3 text-start"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {tanks.map((tank, index) => (
                <tr
                className={index % 2 === 0 ? "" : "bg-gray-100"}
                >
                    <td>{tank.name}</td>
                    <td>{tank.current_quantity.toLocaleString("es-CL")}</td>
                    <td>{tank.error_quantity.toLocaleString("es-CL")}</td>
                    <td>
                        <button className="">
                            Ajustar
                        </button>
                    </td>
                </tr>
            ))}
          </tbody>
        </table>
      </div>
      
    </div>
  );
};

export default AdjustmentView;
