const db = require("../models");
const { client: Client } = db;

const getClients = async (req, res) => {
    try {
        const client = await Client.findAll();
        res.json(client);
    } catch (err) {
        console.log("Error fetching Clients: ", err);
        res.status(500).json({ err: "Internal server error" });
    }
};

const clientController = {
    getClients,
}

module.exports = clientController;