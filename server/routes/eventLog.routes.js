const eventLogController = require("../controllers/eventLog.controller");
const { validateAccessToken } = require("../middlewares/auth0.middleware");

module.exports = function (app) {
  app.get(
    "/api/eventlog/all",
    validateAccessToken,
    eventLogController.getEventLogs
  );
  app.get(
    "/api/eventlog/errors",
    validateAccessToken,
    eventLogController.getLastErrorEvents
  );
};
