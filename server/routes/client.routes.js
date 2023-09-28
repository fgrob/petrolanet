const clientController = require('../controllers/client.controller');

module.exports = function(app){
    app.get('/api/client/all', clientController.getClients);
};

