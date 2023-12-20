const clientController = require("../controllers/client.controller");
const {
  validateAccessToken,
  checkRequiredPermissions,
  clientsListRequiredPermissions,
} = require("../middlewares/auth0.middleware");

module.exports = function (app) {
  app.get(
    "/api/client/all",
    validateAccessToken,
    clientsListRequiredPermissions,
    clientController.getClients
  );
  app.post(
    "/api/client/adjustments/create",
    validateAccessToken,
    checkRequiredPermissions(["admin:clients_adjustments"]),
    clientController.createClient
  );
  app.put(
    "/api/client/adjustments/edit",
    validateAccessToken,
    checkRequiredPermissions(["admin:suppliers_adjustments"]),
    clientController.editClient
  );
};
