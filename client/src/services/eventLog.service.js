import axios from 'axios';
import API_BASE_URL from './apiConfig';

const API_URL = `${API_BASE_URL}/eventlog/`;

const getEventLogs = (startDate, endDate) => {
    let url = API_URL + "all";

    if (startDate) {
        url += `?startDate=${startDate}`;
    };
    if (endDate) {
        url += (startDate ? "&" : "?") + `endDate=${endDate}`;
    };

    return axios.get(url).catch((err) => console.log(err));
}

const eventLogService = {
    getEventLogs,
}

export default eventLogService;
