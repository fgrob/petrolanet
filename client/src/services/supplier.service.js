import axios from "axios";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/supplier/`;

const getSuppliers = () => {
    return axios.get(API_URL + "all").catch((err) => console.log(err));
};

const createSupplier = (rut, businessName, alias) => {
    return axios.post(API_URL + "create", {
        rut,
        businessName,
        alias
    })
    .catch((err) => console.log(err));
};

const editSupplier = (id, rut, businessName, alias) => {
    return axios.put(API_URL + "edit", {
        id,
        rut,
        businessName,
        alias
    })
    .catch((err) => console.log(err));
};

const supplierService = {
    getSuppliers,
    createSupplier,
    editSupplier,
};

export default supplierService;