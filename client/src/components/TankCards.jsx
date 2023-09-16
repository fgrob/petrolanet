import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../App";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import tankService from "../services/tank.service";
import moment from "moment-timezone";
import ModalTank from "./modalTank";

ChartJS.register(ArcElement, Tooltip, Legend);

const TankCards = () => {

  console.log('TankCards renderizado');

  const { tanks, setTanks, openBackdrop, setOpenBackdrop } = useContext(AppContext);
  const [openModal, setOpenModal] = useState(false);
  const [action, setAction] = useState('');
  const [triggerTankId, setTriggerTankId] = useState(null);

  const toggleModal = (tankId) => {
    setTriggerTankId(tankId);
    setOpenModal(!openModal);
    setOpenBackdrop(!openBackdrop);
  };

  // useEffect(() => {
  //   tankService.getTanks().then((res) => {
  //     console.log(res.data);
  //     setTanks(res.data);
  //   });
  // }, []);

  const getBackgroundColor = (tankType) => {
    const typeToColor = {
      estanque: "#17653a",
      "estanque movil": "#17a254",
      camion: "#0f2d5c",
    };

    return typeToColor[tankType] || "#17653a";
  };

  return (
    <div className="flex flex-wrap content-between justify-evenly">
      {tanks
        .sort((a, b) => a.id - b.id)
        .map((tank, index) => {
          const data = {
            labels: [],
            datasets: [
              {
                data: [
                  tank.current_quantity,
                  tank.capacity - tank.current_quantity,
                ],
                backgroundColor: [getBackgroundColor(tank.type), "#0c715150"],
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
                {tank.tank_gauge && (
                  <div>Numeral: {tank.tank_number}</div>
                )}
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
              {tank.type == "estanque" && (
                <div className="my-2 flex w-full flex-col rounded bg-gray-200 text-center shadow-md">
                  <div className="flex-grow-0">
                    Regla:{" "}
                    <span className="text-red-500">
                      {tank.measured_quantity.toLocaleString("es-CL")} Litros
                    </span>
                  </div>
                  <div className="text-sm font-light">
                    {moment(tank.timestamp_measured_quantity)
                      .tz("America/Santiago")
                      .format("DD/MM/yyyy - HH:mm")}
                  </div>
                </div>
              )}
              <div className="mt-2 flex w-full flex-wrap justify-between gap-4">
                <button
                  type="button"
                  className="btn-success flex-1"
                  onClick={() => {
                    setAction('load');
                    toggleModal(tank.id);
                  }}
                >
                  Cargar
                </button>
                <button
                  type="button"
                  className="btn-success flex-1"
                  onClick={() => {
                    setAction('unload');
                    toggleModal(tank.id);
                  }}
                >
                  Descargar
                </button>
                <button type="button" className="btn-success w-full">
                  Ver últimos movimientos
                </button>
              </div>
            </div>
          );
        })}
      <ModalTank openModal={openModal} toggleModal={toggleModal} action={action} triggerTankId={triggerTankId} />
    </div>
  );
};

export default TankCards;
