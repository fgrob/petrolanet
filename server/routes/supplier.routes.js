const supplierController = require('../controllers/supplier.controller');

module.exports = function(app){
    app.get('/api/supplier/all', supplierController.getSuppliers);
};

