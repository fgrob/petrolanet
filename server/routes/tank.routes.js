const tankController = require("../controllers/tank.controller");
const {
  validateAccessToken,
  checkRequiredPermissions,
} = require("../middlewares/auth0.middleware");

module.exports = function (app) {
  app.get("/api/tank/all", validateAccessToken, tankController.getTanks);
  app.put(
    "/api/tank/transfer",
    validateAccessToken,
    tankController.transferOperation
  );
  app.put(
    "/api/tank/sellorsupply",
    validateAccessToken,
    tankController.sellOrSupplyOperation
  );
  app.put(
    "/api/tank/measurement",
    validateAccessToken,
    tankController.measurementOperation
  );
  app.put(
    "/api/tank/adjustment",
    validateAccessToken,
    checkRequiredPermissions(["admin:tanks_adjustments"]),
    tankController.adjustmentOperation
  );
  app.post(
    "/api/tank/create",
    validateAccessToken,
    checkRequiredPermissions(["admin:tanks_adjustments"]),
    tankController.createTank
  );
};
