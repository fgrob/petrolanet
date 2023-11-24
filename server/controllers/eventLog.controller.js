const db = require("../models");
const { Op } = require("sequelize");

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

    let startDate;
    let endDate;

    if (req.query.startDate) {
      startDate = new Date(req.query.startDate);
    };

    if (req.query.endDate) {
      endDate = new Date(req.query.endDate);
      endDate.setUTCHours(23,59,59,999) // (end of the day)
    };

    if (!startDate){
      // fetching the current and last month for the initial data
      const now = new Date();
   
      if (now.getMonth() === 0) { //JS january starts in 0
        startDate = new Date(now.getFullYear() - 1, 11, 1);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      };
    };
    
    if (!endDate) {
      endDate = new Date();
    };
    
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23,59,59,999);

    const eventLogs = await EventLog.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
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
