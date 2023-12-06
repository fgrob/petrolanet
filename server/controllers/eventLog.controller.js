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
    let tankIdFilter = null; // null is for events in all tanks

    if (req.query.startDate) {
      console.log(req.query.startDate)
      startDate = new Date(req.query.startDate);
    }

    if (req.query.endDate) {
      endDate = new Date(req.query.endDate);
      endDate.setUTCHours(23, 59, 59, 999); // (end of the day)
    }

    if (req.query.tankId){
      tankIdFilter = parseInt(req.query.tankId);
    }

    if (!startDate) {
      // fetching the current and last month for the initial data
      const now = new Date();

      if (now.getMonth() === 0) {
        //JS january starts in 0
        startDate = new Date(now.getFullYear() - 1, 11, 1);
      } else {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      }
    }

    if (!endDate) {
      endDate = new Date();
    }

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    const eventLogs = await EventLog.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        ...(tankIdFilter !== null && { tank_id: tankIdFilter }),
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
        exclude: [
          "operation_id",
          "client_id",
          "supplier_id",
          "tank_id",
          "updatedAt",
          "user_id",
        ],
      },
    });
    res.json(eventLogs);
  } catch (err) {
    console.log("Error fetching eventlogs: ", err);
    res.status(500).json({ err: "Internal server error" });
  }
};

const getLastErrorEvents = async (req, res) => {
  try {
    const tanks = await Tank.findAll();
    const eventLogs = [];

    for (const tank of tanks) {
      if (tank.error_quantity !== 0) {
        const lastEvent = await EventLog.findOne({
          where: {
            operation_id: 5, // MEDICION
            tank_id: tank.id,
          },
          order: [["createdAt", "DESC"]],
          limit: 1,
          include: [
            {
              model: Tank,
              as: "tank",
              attributes: ["name", "type"],
            },
          ]
        });

        lastEvent && eventLogs.push(lastEvent);
      }
    }
    res.status(200).json(eventLogs);
  } catch {
    res.status(500).json({ err: "Internal server error" });
  }
};

const eventLogController = {
  getEventLogs,
  getLastErrorEvents,
};

module.exports = eventLogController;
