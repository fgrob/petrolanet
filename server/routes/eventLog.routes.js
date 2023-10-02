const eventLogController = require('../controllers/eventLog.controller');

module.exports = function(app){
    app.get('/api/eventlog/all', eventLogController.getEventLogs);
};

