const tankController = require('../controllers/tank.controller');

module.exports = function(app){
    app.get('/api/tank/all', tankController.getTanks);
    app.post('/api/tank/create', tankController.createTank);
};

