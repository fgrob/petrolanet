import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_URL = `${API_BASE_URL}/client/`;

const getClients = () => {
    return axios.get(API_URL + "all").catch((err) => console.log(err));
}

const createClient = (rut, businessName, alias) => {
    return axios.post(API_URL + "create", {
        rut,
        businessName,
        alias
    })
    .catch((err) => console.log(err));
}

const editClient = (id, rut, businessName, alias) => {
    return axios.put(API_URL + "edit", {
        id,
        rut,
        businessName,
        alias
    })
    .catch((err) => console.log(err));
}

const clientService = {
    getClients,
    createClient,
    editClient,
};

export default clientService;