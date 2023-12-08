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

const createClient = async (req, res) => {
  try {
    const { rut, businessName, alias } = req.body;
    await Client.create({
      rut: rut,
      business_name: businessName,
      alias: alias,
    });

    const updatedClients = await Client.findAll();
    res.status(200).json(updatedClients);
  } catch {
    console.log("Error creating client", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const clientController = {
  getClients,
  createClient,
};

module.exports = clientController;
