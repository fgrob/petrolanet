import axios from "axios";
import API_BASE_URL from "./apiConfig";

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
  quantity
) => {
  return axios.put(API_URL + "measurement", {
    triggerTankId,
    quantity
  })
  .catch((err) => console.log(err));
}

const tankService = {
  getTanks,
  transfer,
  sellOrSupply,
  tankMeasurement,
};

export default tankService;
