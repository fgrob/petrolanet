const db = require("../models");
const { Op } = require("sequelize");
const permissions = require("../config/permissions");
const moment = require("moment-timezone");

const {
  eventLog: EventLog,
  operation: Operation,
  // user: User,
  tank: Tank,
  client: Client,
  supplier: Supplier,
} = db;

const getEventLogs = async (req, res) => {
  const own_database_access = req.auth.payload.permissions.includes(
    permissions.VIEW_OWN_DATABASE
  );
  const tanks_database_access = req.auth.payload.permissions.includes(
    permissions.VIEW_TANKS_DATABASE
  );

  const username = req.auth.payload.username;

  try {
    let startDate;
    let endDate;
    let tankIdFilter = null; // null is for events in all tanks

    if (req.query.startDate) {
      // recibe una hora 'Chile'. La llevamos al inicio del dìa, y luego la convertimos a UTC poruque en la BBDD usamos UTC
      startDate = moment(req.query.startDate).startOf("day").utc();
    }

    if (!startDate) {
      // Si no hay fecha de inicio especificada, entonces fijar al principio del mes a primera hora
      startDate = moment
        .tz("America/Santiago")
        .startOf("month")
        .startOf("day")
        .utc();
    }

    if (req.query.endDate) {
      endDate = moment(req.query.endDate).endOf("day").utc();
    }

    if (!endDate) {
      // Si no hay fecha, la fijamos al final del día actual
      endDate = moment.tz("America/Santiago").endOf("day").utc();
    }

    if (req.query.tankId) {
      tankIdFilter = parseInt(req.query.tankId);
    }

    const eventLogs = await EventLog.findAll({
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
        ...(tankIdFilter !== null && { tank_id: tankIdFilter }),
        ...(own_database_access && { user: username }),
        ...(tanks_database_access && { "$tank.type$": { [Op.not]: "CAMION" } }),
      },
      include: [
        {
          model: Operation,
          as: "operation",
          attributes: ["id", "name"],
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
        ],
      },
    });
    res.json(eventLogs);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal server error" });
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
          ],
        });

        lastEvent && eventLogs.push(lastEvent);
      }
    }
    res.status(200).json(eventLogs);
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Internal server error" });
  }
};

const eventLogController = {
  getEventLogs,
  getLastErrorEvents,
};

module.exports = eventLogController;
