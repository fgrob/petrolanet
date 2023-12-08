import React, { useContext, useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { MdOutlineComment } from "react-icons/md";
import clientService from "../services/client.service";
import supplierService from "../services/supplier.service";
import Modal from "../components/common/Modal";
import { AppContext } from "../App";

const ClientSupplierLists = ({ target }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);

  const [rut, setRut] = useState("123456");
  const [businessName, setBusinessName] = useState("poto");
  const [alias, setAlias] = useState("ali");

  const [openModal, setOpenModal] = useState(false);

  const { openBackdrop, setOpenBackdrop } = useContext(AppContext);

  const getData = () => {
    if (target === "clients") {
      clientService.getClients().then((res) => {
        setList(res.data);
        setIsLoading(false);
        console.log(res.data);
      });
    } else if (target === "suppliers") {
      supplierService.getSuppliers().then((res) => {
        setList(res.data);
        setIsLoading(false);
      });
    }
  };

  
  const handleRutChange = (e) => {
    const formatRut = (inputRut) => {
      const cleanRut = inputRut.replace(/[^0-9kK]/g, "").replace(/k/g, 'K'); // first regex: allows numbers and the letter K . Second regex: Uppercases the letter 'K'.
      
      if (cleanRut.length > 1) {
        const body = cleanRut.slice(0, -1);
        const verifierDigit = cleanRut.slice(-1);
        const formattedRut = body + "-" + verifierDigit;
        return formattedRut;
      } else {
        return cleanRut;
      }
    };
    const inputRut = e.target.value;
    const formattedRut = formatRut(inputRut);
    setRut(formattedRut);
  };

  const handleBusinessNameChange = (e) => {
    const formatBusinessName = (inputBusinessName) => {
      return inputBusinessName.replace(/[^a-zA-Z0-9\s]/g, "").toUpperCase()
    };
    const inputBusinessName = e.target.value;
    const formattedBusinessName = formatBusinessName(inputBusinessName);
    setBusinessName(formattedBusinessName);
  };

  const checkIfRutExists = (rut) => {
    return list.some((clientSupplier) => clientSupplier.rut === rut);
  };

  const toggleModal = () => {
    setOpenModal(!openModal);
    setOpenBackdrop(!openBackdrop);
  };

  const handleCreation = () => {
    if (checkIfRutExists(rut)) {
      console.log("el rut ya existe en la BBDD"); // setCustomValidity al input rut
      return;
    }

    if (target === "clients") {
      clientService
        .createClient(rut, businessName, alias)
        .then((res) => setList(res.data));
    }
  };

  useEffect(() => {
    getData();
  }, [target]);

  return (
    <div className="overflow-hidden border-4 border-yellow-500 text-center">
      {isLoading ? (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center">
          <BiLoaderCircle className="animate-spin text-2xl text-blue-500" />
        </div>
      ) : (
        <div className="flex w-full flex-wrap justify-center border border-red-500 shadow-md lg:p-3">
          <div className="flex w-full justify-end border border-orange-500">
            <button className="border border-black" onClick={toggleModal}>
              Añadir{" "}
              {target === "clients" ? (
                <span>Cliente</span>
              ) : (
                <span>Proveedor</span>
              )}
            </button>
            <div className="flex flex-1 justify-end border border-pink-500">
              <label>Buscar</label>
              <input className="border border-black " />
              <button className="btn-error-small">Limpiar</button>
            </div>
          </div>

          <div className="w-full overflow-auto border-2 border-purple-500">
            <table className="w-full table-auto divide-y divide-gray-200">
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
        </div>
      )}
      {openModal && (
        <Modal openModal={openModal} toggleModal={toggleModal} height="auto" weight="w-full md:w-1/2">
          <div className="w-full overflow-auto rounded-lg bg-white p-2">
            <div className="mb-3 text-center text-2xl">
              {target === "clients" ? "Añadir Cliente" : "Añadir Proveedor"}
            </div>
            <form
              className="space-y-2 text-gray-600 flex justify-center flex-wrap"
              // onSubmit={handleSellOrSupply}
            >
              <div className="w-1/3">
                <label htmlFor="rutInput" className="block text-gray-600 font-bold">
                  RUT
                </label>
                <input
                  type="text"
                  id="rutInput"
                  name="rutInput"
                  value={rut}
                  onChange={handleRutChange}
                  className="rounded-lg border border-gray-400 px-3 py-2 w-full"
                  required
                  autoComplete="off"
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Debes ingresar un RUT válido")
                  }
                  maxLength={10}
                />
              </div>

              <div className="w-full">
                <label htmlFor="businessNameInput" className="block text-gray-600 font-bold">
                  RAZÓN SOCIAL
                </label>
                <input
                  type="text"
                  id="businessNameInput"
                  name="businessNameInput"
                  value={businessName}
                  onChange={handleBusinessNameChange}
                  className="w-full lg:w- rounded-lg border border-gray-400 px-3 py-2"
                  required
                  autoComplete="off"
                  maxLength={90}
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Debes ingresar una Razón Social")
                  }
                />
              </div>
              <div className="mt-6 flex justify-center">
                <button className="btn-success" type="submit">
                  Añadir
                </button>
              </div>
              {/* <div className="text-center text-red-600">{errorMessage}</div> */}
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClientSupplierLists;
