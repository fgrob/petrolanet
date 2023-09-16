import axios from 'axios';

const API_URL = 'http://192.168.1.9:8000/api/tank/';

const getTanks = () => {
    return axios.get(API_URL + 'all')
        // .then((res) => {
        //     console.log('axios OK')
        //     return res.data
        // })
        // .catch((err) => {
        //     console.log('axios ERROR')
        // })
};

const transfer = (action, triggerTankId, selectedTankId, quantity) => {
    return axios.put(API_URL + 'transfer', {action, triggerTankId, selectedTankId, quantity})
        // .then(res => {
        //     console.log(res.data)
        //     return res.data;
        // })
        // .catch(err => console.log(err))
};

const tankService = {
    getTanks,
    transfer,
};

export default tankService;