const supplierController = require("../controllers/supplier.controller");
const {
  validateAccessToken,
  checkRequiredPermissions,
  suppliersListRequiredPermissions,
} = require("../middlewares/auth0.middleware");

module.exports = function (app) {
  app.get(
    "/api/supplier/all",
    validateAccessToken,
    suppliersListRequiredPermissions,
    supplierController.getSuppliers
  );
  app.post(
    "/api/supplier/create",
    validateAccessToken,
    checkRequiredPermissions(["admin:suppliers_adjustments"]),
    supplierController.createSupplier
  );
  app.put(
    "/api/supplier/edit",
    validateAccessToken,
    checkRequiredPermissions(["admin:suppliers_adjustments"]),
    supplierController.editSupplier
  );
};
