import axios from "axios";
import API_BASE_URL from "./apiConfig";

const API_URL = `${API_BASE_URL}/eventlog/`;

const getEventLogs = (startDate, endDate) => {
  let url = API_URL + "all";

  if (startDate) {
    url += `?startDate=${startDate}`;
  }
  if (endDate) {
    url += (startDate ? "&" : "?") + `endDate=${endDate}`;
  }

  return axios.get(url).catch((err) => console.log(err));
};

const getLastErrorEvents = () => {
  //si el error del tanque es distinto de cero, entonces buscar el ultimo registro 'medicion' de ese tanque
  return axios.get(API_URL + "errors").catch((err) => console.log(err));
  
};

const eventLogService = {
  getEventLogs,
  getLastErrorEvents,
};

export default eventLogService;
