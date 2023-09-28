import axios from "axios";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/supplier/`;

const getSuppliers = () => {
    return axios.get(API_URL + "all").catch((err) => console.log(err));
};

const supplierService = {
    getSuppliers,
}

export default supplierService;