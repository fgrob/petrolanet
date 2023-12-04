const eventLogController = require('../controllers/eventLog.controller');

module.exports = function(app){
    app.get('/api/eventlog/all', eventLogController.getEventLogs);
    app.get('/api/eventlog/errors', eventLogController.getLastErrorEvents);
};

