import React, { useContext, useEffect, useState } from "react";
import { BiLoaderCircle } from "react-icons/bi";
import { CiEdit } from "react-icons/ci";
import clientService from "../services/client.service";
import supplierService from "../services/supplier.service";
import Modal from "../components/Modal";
import { AppContext } from "../App";
import CreateAndEditModal from "./ClientSupplierAdjustment/CreateAndEditModal";

const ClientSupplierAdjustment = ({ target }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [clientSupplierList, setClientSupplierList] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const { openBackdrop, setOpenBackdrop } = useContext(AppContext);

  const [rut, setRut] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [alias, setAlias] = useState("");

  const [editMode, setEditMode] = useState(false);
  const [idToEdit, setIdToEdit] = useState();

  const getData = () => {
    if (target === "clients") {
      clientService.getClients().then((res) => {
        setClientSupplierList(res.data);
        setIsLoading(false);
        console.log(res.data);
      });
    } else if (target === "suppliers") {
      supplierService.getSuppliers().then((res) => {
        setClientSupplierList(res.data);
        setIsLoading(false);
      });
    }
  };

  const toggleModal = () => {
    if (openModal === true) {
      setRut("");
      setBusinessName("");
      setAlias("");

      setEditMode(false);
      setIdToEdit("");
    }
    setOpenModal(!openModal);
    setOpenBackdrop(!openBackdrop);
  };

  const handleEdition = (id, rut, businessName, alias) => {
    setEditMode(true);
    setIdToEdit(id);
    setRut(rut);
    setBusinessName(businessName);
    setAlias(alias);

    toggleModal();
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
                {clientSupplierList
                  .sort((a, b) => a.id - b.id)
                  .map((clientSupplier, index) => (
                    <tr
                      className={index % 2 === 0 ? "" : "bg-gray-100"}
                      key={clientSupplier.id}
                    >
                      <td className=" whitespace-nowrap">
                        {clientSupplier.rut}
                      </td>
                      <td
                        className={`whitespace-nowrap px-6 text-sm text-gray-900`}
                      >
                        {clientSupplier.business_name}
                      </td>
                      <td>{clientSupplier.alias}</td>
                      <td>
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() =>
                              handleEdition(
                                clientSupplier.id,
                                clientSupplier.rut,
                                clientSupplier.business_name,
                                clientSupplier.alias,
                              )
                            }
                          >
                            <CiEdit />
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
        <Modal
          openModal={openModal}
          toggleModal={toggleModal}
          height="auto"
          weight="w-full md:w-1/2"
        >
          <CreateAndEditModal
            toggleModal={toggleModal}
            target={target}
            setClientSupplierList={setClientSupplierList}
            editMode={editMode}
            idToEdit={idToEdit}
            clientSupplierList={clientSupplierList}
            rut={rut}
            setRut={setRut}
            businessName={businessName}
            setBusinessName={setBusinessName}
            alias={alias}
            setAlias={setAlias}
          />
        </Modal>
      )}
    </div>
  );
};

export default ClientSupplierAdjustment;
