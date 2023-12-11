import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const API_URL = `${API_BASE_URL}/tank/`;

const getTanks = () => {
  return axios.get(API_URL + "all").catch((err) => console.log(err));
};

const transfer = (action, triggerTankId, selectedTankId, quantity) => {
  return axios
    .put(API_URL + "transfer", {
      action,
      triggerTankId,
      selectedTankId,
      quantity,
    })
    .catch((err) => console.log(err));
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
  return axios
    .put(API_URL + "sellorsupply", {
      action,
      triggerTankId,
      clientSupplierId,
      selectedDocument,
      documentNumber,
      quantity,
      notes,
    })
    .catch((err) => console.log(err));
};

const tankMeasurement = (
  triggerTankId,
  quantity,
  notes
) => {
  return axios.put(API_URL + "measurement", {
    triggerTankId,
    quantity,
    notes
  })
  .catch((err) => console.log(err));
}

const adjustment = (tankId, changedData) => {

  return axios.put(API_URL + "adjustment", {tankId,
    changedData
  })
  .catch((err) => console.log(err));
};

const createTank = (tankName, tankType, tankCapacity, tankGauge, tankNumber) => {
  return axios.post(API_URL + "create", {
    tankName,
    tankType,
    tankCapacity,
    tankGauge,
    tankNumber,
  })
  .catch((err) => console.log(err));
}

const tankService = {
  getTanks,
  transfer,
  sellOrSupply,
  tankMeasurement,
  adjustment,
  createTank,
};

export default tankService;
