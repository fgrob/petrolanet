const db = require("../models");
const {
  eventLog: EventLog,
  operation: Operation,
  user: User,
  tank: Tank,
  client: Client,
  supplier: Supplier,
} = db;

const getEventLogs = async (req, res) => {
  try {
    const eventLogs = await EventLog.findAll({
      include: [
        {
          model: Operation,
          as: "operation",
          attributes: ["id", "name"],
        },
        {
          model: User,
          as: "user",
          attributes: ["username"],
        },
        {
          model: Tank,
          as: "tank",
          attributes: ["name", "type"],
        },
        {
          model: Client,
          as: "client",
          attributes: ["rut", "business_name"],
        },
        {
          model: Supplier,
          as: "supplier",
          attributes: ["rut", "business_name"],
        },
      ],
      attributes: {
        exclude: ["operation_id", "client_id", "supplier_id", "tank_id", "updatedAt", "user_id"],
      },
    });
    res.json(eventLogs);
  } catch (err) {
    console.log("Error fetching eventlogs: ", err);
    res.status(500).json({ err: "Internal server error" });
  }
};

const eventLogController = {
  getEventLogs,
};

module.exports = eventLogController;
