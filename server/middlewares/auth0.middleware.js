const {
  auth,
  claimCheck,
  InsufficientScopeError,
} = require("express-oauth2-jwt-bearer");

const validateAccessToken = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE,
  tokenSigningAlg: "RS256",
});

const checkRequiredPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    const permissionCheck = claimCheck((payload) => {
      const permissions = payload.permissions || [];

      const hasPermissions = requiredPermissions.every((requiredPermission) =>
        permissions.includes(requiredPermission)
      );

      if (!hasPermissions) {
        throw new InsufficientScopeError();
      }

      return hasPermissions;
    });

    permissionCheck(req, res, next);
  };
};

const suppliersListRequiredPermissions = (req, res, next) => {
  //"This is because users need access to both clients and suppliers to be able to select them in the corresponding forms,
  //   but it is also necessary to restrict visual access to the complete list in the settings section.

  if (req.headers["x-caller-info"] === "inputs") {
    return checkRequiredPermissions(["view:suppliers"])(req, res, next);
  } else if (req.headers["x-caller-info"] === "adjustments") {
    return checkRequiredPermissions(["admin:suppliers_adjustments"])(
      req,
      res,
      next
    );
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};

const clientsListRequiredPermissions = (req, res, next) => {
  if (req.headers["x-caller-info"] === "inputs") {
    return checkRequiredPermissions(["view:clients"])(req, res, next);
  } else if (req.headers["x-caller-info"] === "adjustments") {
    return checkRequiredPermissions(["admin:clients_adjustments"])(
      req,
      res,
      next
    );
  } else {
    res.status(403).json({ message: "Not authorized" });
  }
};

module.exports = {
  validateAccessToken,
  checkRequiredPermissions,
  suppliersListRequiredPermissions,
  clientsListRequiredPermissions,
};
