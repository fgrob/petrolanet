import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/tank/`;

const config = (additionalHeaders = {}) => {
  const accessToken = localStorage.getItem("accessToken");
  const socketId = localStorage.getItem("socketId")
  return {
    headers: { authorization: `Bearer ${accessToken}`, socketid: socketId,  ...additionalHeaders },
  };
};

const getTanks = () => { 
  return axios.get(API_URL + "all", config());
};

const transfer = (action, triggerTankId, selectedTankId, quantity, directTransfer) => {
  return axios.put(
    API_URL + "transfer",
    {
      action,
      triggerTankId,
      selectedTankId,
      quantity,
      directTransfer,
    },
    config(),
  );
};

const sellOrSupply = (
  action,
  triggerTankId,
  clientSupplierId,
  selectedDocument,
  documentNumber,
  quantity,
  notes,
) => {
  return axios.put(
    API_URL + "sellorsupply",
    {
      action,
      triggerTankId,
      clientSupplierId,
      selectedDocument,
      documentNumber,
      quantity,
      notes,
    },
    config(),
  );
};

const tankMeasurement = (triggerTankId, quantity, notes) => {
  return axios.put(
    API_URL + "measurement",
    {
      triggerTankId,
      quantity,
      notes,
    },
    config(),
  );
};

const adjustment = (tankId, changedData) => {
  return axios.put(
    API_URL + "adjustment",
    { tankId, changedData },
    config(),
  );
};

const createTank = (
  tankName,
  tankType,
  tankCapacity,
  tankGauge,
  tankNumber,
) => {
  return axios.post(
    API_URL + "create",
    {
      tankName,
      tankType,
      tankCapacity,
      tankGauge,
      tankNumber,
    },
    config(),
  );
};

const tankService = {
  getTanks,
  transfer,
  sellOrSupply,
  tankMeasurement,
  adjustment,
  createTank,
};

export default tankService;
