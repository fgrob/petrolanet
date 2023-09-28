const db = require("../models");
const { supplier: Supplier } = db;

const getSuppliers = async (req, res) => {
    try {
        const supplier = await Supplier.findAll();
        res.json(supplier);
    } catch (err) {
        console.log("Error fetching Suppliers: ", err);
        res.status(500).json({ err: "Internal server error" });
    }
};

const supplierController = {
    getSuppliers,
}

module.exports = supplierController;