import axios from 'axios';

const API_URL = 'http://192.168.1.23:8000/api/tank/';

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

const tankService = {
    getTanks,
};

export default tankService;