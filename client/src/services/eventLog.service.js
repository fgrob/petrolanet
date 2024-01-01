import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/eventlog/`;

const config = (additionalHeaders = {}) => {
  const accessToken = localStorage.getItem("accessToken");
  return {
    headers: { authorization: `Bearer ${accessToken}`, ...additionalHeaders },
  };
};

const getEventLogs = (startDate, endDate, tankId) => {
  let url = API_URL + "all";

  if (startDate) {
    url += `?startDate=${startDate}`;
  }
  if (endDate) {
    url += (startDate ? "&" : "?") + `endDate=${endDate}`;
  }
  if (tankId !== undefined && tankId !== null) {
    url += (startDate || endDate ? "&" : "?") + `tankId=${tankId}`;
  }

  return axios.get(url, config());
};

const getLastErrorEvents = () => {
  //si el error del tanque es distinto de cero, entonces buscar el ultimo registro 'medicion' de ese tanque
  return axios.get(API_URL + "errors", config());
};

const eventLogService = {
  getEventLogs,
  getLastErrorEvents,
};

export default eventLogService;
