import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import moment from "moment-timezone";
import TankModal from "./tankModal/TankModal";
import { Link } from "react-router-dom";

ChartJS.register(ArcElement, Tooltip, Legend);

const TankCards = () => {
  const { tanks, openBackdrop, setOpenBackdrop } = useContext(AppContext);
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState("");
  const [triggerTank, setTriggerTank] = useState(null);
  const [dataForTotal, setDataForTotal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [totalError, setTotalError] = useState(0);

  const companyCard = () => {
    let companyCapacity = 0;
    let companyBalance = 0;

    tanks.forEach((tank) => {
      companyCapacity += parseInt(tank.capacity);
      companyBalance += parseInt(tank.current_quantity);
    });
    const dataForTotal = {};
    dataForTotal.companyCapacity = companyCapacity;
    dataForTotal.companyBalance = companyBalance;
    dataForTotal.doughnut = {
      labels: [],
      datasets: [
        {
          data: [companyCapacity, companyCapacity - companyBalance],
          backgroundColor: ["#052e19", "#0c715150"],
        },
      ],
    };
    setDataForTotal(dataForTotal);
  };

  const getBackgroundColor = (tankType) => {
    const typeToColor = {
      ESTANQUE: "#17653a",
      "ESTANQUE MOVIL": "#17a254",
      CAMION: "#0f2d5c",
    };
    return typeToColor[tankType] || "#17653a";
  };

  const toggleModal = (tank) => {
    setTriggerTank(tank);
    setOpenModal(!openModal);
    setOpenBackdrop(!openBackdrop);
  };

  const calcError = () => {
    const totalError = tanks.reduce(
      (total, tank) => total + tank.error_quantity,
      0,
    );
    setTotalError(totalError);
  };

  useEffect(() => {
    companyCard();
    calcError();
    setIsLoading(false);
  }, [tanks]);

  return (
    <div className="flex flex-wrap content-between justify-evenly">
      {isLoading ? (
        <div>cargando...</div>
      ) : (
        <>
          <div className="m-2 flex w-[400px] flex-wrap rounded p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]">
            <h1 className="w-full text-2xl font-bold uppercase">Total</h1>
            <div className="flex w-full justify-between font-light capitalize">
              <div>Compañía</div>
            </div>
            <hr className="divider" />
            <div className="flex h-60 w-60">
              <Doughnut data={dataForTotal.doughnut} />
            </div>
            <div className="flex-grow self-center text-center">
              <div className="font text-3xl">
                {dataForTotal.companyBalance.toLocaleString("es-CL")} Lts
              </div>
              <div className="text-xl">
                / {dataForTotal.companyCapacity.toLocaleString("es-CL")}
              </div>
            </div>
            <hr className="divider" />
            <button
              className="my-2 flex w-full flex-col items-center rounded bg-gray-300 shadow-md"
              onClick={() => {
                setAction("errors");
                toggleModal();
              }}
            >
              <div className="text-xl font-bold text-red-500">
                {totalError.toLocaleString("es-CL")} Lts
              </div>
              <div className="flex-grow-0 text-sm">Posible diferencia</div>
            </button>
            <div className="mt-2 flex w-full flex-wrap justify-between gap-4">
              <Link className="btn-success w-full text-center" to="/adjustment">
                Ajustar Estanques
              </Link>
            </div>
          </div>
          {tanks
            .sort((a, b) => a.id - b.id)
            .map((tank) => {
              const data = {
                labels: [],
                datasets: [
                  {
                    data: [
                      tank.current_quantity,
                      tank.capacity - tank.current_quantity,
                    ],
                    backgroundColor: [
                      getBackgroundColor(tank.type),
                      "#0c715150",
                    ],
                  },
                ],
              };
              return (
                <div
                  key={tank.id}
                  className="m-2 flex w-[400px] flex-wrap rounded p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
                >
                  <h1 className="w-full text-2xl uppercase">{tank.name}</h1>
                  <div className="flex w-full justify-between font-light capitalize">
                    <div>{tank.type}</div>
                    {tank.tank_gauge && <div>Numeral: {tank.tank_number}</div>}
                  </div>
                  <hr className="divider" />
                  <div className="h-52">
                    <Doughnut data={data} />
                  </div>
                  <div className="flex-grow self-center text-center">
                    <div className=" text-3xl">
                      {tank.current_quantity.toLocaleString("es-CL")} Lts
                    </div>
                    <div className="">
                      / {tank.capacity.toLocaleString("es-CL")}
                    </div>
                    <div className="text-sm font-light">
                      {moment(tank.timestamp_current_quantity)
                        .tz("America/Santiago")
                        .format("DD/MM/yyyy - HH:mm")}
                    </div>
                  </div>
                  <hr className="divider" />
                  {tank.type == "ESTANQUE" && (
                    <button
                      className="my-2 flex w-full flex-col items-center rounded bg-gray-200 shadow-md hover:bg-gray-300"
                      onClick={() => {
                        setAction("measure");
                        toggleModal(tank);
                      }}
                    >
                      <div className="flex-grow-0">
                        Regla:{" "}
                        <span className="text-red-500">
                          {tank.measured_quantity.toLocaleString("es-CL")}{" "}
                          Litros
                        </span>
                      </div>
                      <div className="text-sm font-light">
                        {moment(tank.timestamp_measured_quantity)
                          .tz("America/Santiago")
                          .format("DD/MM/yyyy - HH:mm")}
                      </div>
                    </button>
                  )}
                  <div className="mt-2 flex w-full flex-wrap justify-between gap-4">
                    <button
                      type="button"
                      className="btn-success flex-1"
                      onClick={() => {
                        setAction("load");
                        toggleModal(tank);
                      }}
                    >
                      Cargar
                    </button>
                    <button
                      type="button"
                      className="btn-success flex-1"
                      onClick={() => {
                        setAction("unload");
                        toggleModal(tank);
                      }}
                    >
                      Descargar
                    </button>
                    <button type="button" className="btn-success w-full">
                      Ver movimientos del día
                    </button>
                  </div>
                </div>
              );
            })}
          <TankModal
            openModal={openModal}
            toggleModal={toggleModal}
            action={action}
            triggerTank={triggerTank}
          />
        </>
      )}
    </div>
  );
};

export default TankCards;
