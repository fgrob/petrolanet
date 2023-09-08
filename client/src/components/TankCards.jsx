import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import tankService from "../services/tank.service";
import moment from "moment-timezone";

ChartJS.register(ArcElement, Tooltip, Legend);

const TankCards = () => {
  const [tanks, setTanks] = useState([]);

  useEffect(() => {
    tankService.getTanks().then((res) => {
      console.log(res.data);
      setTanks(res.data);
    });
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-5">
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
                backgroundColor: ["#0c7151", "#0c715150"],
              },
            ],
          };
          return (
            <div
              key={index}
              className="flex w-[400px]  flex-wrap rounded p-2 shadow-[0_3px_10px_rgb(0,0,0,0.2)]"
            >
              <h1 className="w-full border border-blue-500 text-2xl uppercase">
                {tank.name}
              </h1>
              <div className="flex flex-grow justify-between border border-blue-500 font-light capitalize">
                <div className=" border border-yellow-500">
                  {tank.type}
                </div>
                <div className="border border-orange-500">
                  Numeral: {tank.tank_number} 3337698
                </div>
              </div>
              <div className="h-52 border border-blue-500">
                <Doughnut data={data} />
              </div>
              <div className="flex-grow self-center border border-yellow-500 text-center">
                <div className=" text-3xl">
                  {tank.current_quantity.toLocaleString("es-CL")} Lts
                </div>
                <div className="">
                  / {tank.capacity.toLocaleString("es-CL")}
                </div>
                <div className="font-light text-sm">{moment(tank.timestamp_current_quantity).tz('America/Santiago').format('DD/MM/yyyy - HH:mm')}</div>
              </div>
              <div className="flex flex-col w-full text-center shadow-md bg-gray-200 rounded">
                  <div className="flex-grow-0">Regla: <span className="text-red-500">{tank.measured_quantity.toLocaleString("es-CL")} Litros</span></div>
                  <div className="font-light text-sm">{moment(tank.timestamp_measured_quantity).tz('America/Santiago').format('DD/MM/yyyy - HH:mm')}</div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default TankCards;
