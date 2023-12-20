import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL = `${API_BASE_URL}/tank/`;

const accessToken = localStorage.getItem("accessToken");
const config = (additionalHeaders = {}) => ({
  headers: { authorization: `Bearer ${accessToken}`, ...additionalHeaders },
});

const getTanks = () => {
  return axios.get(API_URL + "all", config(accessToken));
};

const transfer = (action, triggerTankId, selectedTankId, quantity) => {
  return axios.put(
    API_URL + "transfer",
    {
      action,
      triggerTankId,
      selectedTankId,
      quantity,
    },
    config(accessToken),
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
    config(accessToken),
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
    config(accessToken),
  );
};

const adjustment = (tankId, changedData) => {
  return axios.put(
    API_URL + "adjustment",
    { tankId, changedData },
    config(accessToken),
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
    config(accessToken),
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
