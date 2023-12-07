import React, { useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { MdOutlineComment } from "react-icons/md";
import clientService from "../services/client.service";
import supplierService from "../services/supplier.service";

const ClientSupplierLists = ({target}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  const getData = () => {
    if (target === 'clients'){
      clientService.getClients().then((res) => {
        setList(res.data);
        setIsLoading(false);
      });
    } else if (target === "suppliers"){
      supplierService.getSuppliers().then((res) => {
        setList(res.data);
        setIsLoading(false);
      })
    }
  };

  useEffect(() => {
    getData();
  }, [target]);

  return (
    <div className="overflow-hidden text-center">
      {isLoading ? (
        <div className="flex justify-center">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <div className="flex w-full flex-wrap justify-center overflow-auto border border-red-500 p-3 shadow-md">
          <div className="flex w-full justify-end border border-orange-500">
            <div>Añadir {target === 'clients' ? (<span>Cliente</span>) : (<span>Proveedor</span>)}</div>
            <div className="flex flex-1 justify-end border border-pink-500">
              <label>Buscar</label>
              <input className="border border-black " />
              <button className="btn-error-small">Limpiar</button>
            </div>
          </div>
          <table className="flex-1 table-auto divide-y divide-gray-200">
            <thead className="sticky top-0 bg-gradient-to-r from-gray-400 to-gray-300 ">
              <tr className="text-xs uppercase tracking-wider">
                <th className="px-3 py-3">RUT</th>
                <th className="px-3 py-3">RAZÓN SOCIAL</th>
                <th className="whitespace-nowrap px-3 py-3">ALIAS</th>
                <th className="px-3 py-3">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {list.map((client, index) => (
                <tr className={index % 2 === 0 ? "" : "bg-gray-100"}>
                  <td className=" whitespace-nowrap">{client.rut}</td>
                  <td
                    className={`whitespace-nowrap px-6 text-sm text-gray-900`}
                  >
                    {client.business_name}
                  </td>
                  <td>{client.alias}</td>
                  <td>
                    <div className="flex items-center justify-center">
                      <button>
                        <MdOutlineComment />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClientSupplierLists;
