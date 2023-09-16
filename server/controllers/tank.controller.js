const db = require("../models");
const { tank: Tank, eventLog: EventLog } = db;

const getTanks = async (req, res) => {
  try {
    const tanks = await Tank.findAll();
    res.json(tanks);
  } catch (err) {
    console.error("Error fetching tanks:", err);
    res.status(500).json({ err: "Internal server error" });
  }
};

const createTank = async (req, res) => {
  try {
    const { type, name, capacity, tank_number, tank_speed } = req.body;
    const newTank = await Tank.create({
      type,
      name,
      capacity,
      tank_number,
      tank_speed,
    });

    res.status(201).json(newTank);
  } catch (err) {
    console.error("Error creating a tank", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const transferOperation = async (req, res) => {
  const { action, triggerTankId, selectedTankId, quantity } = req.body;
  const intQuantity = parseInt(quantity);

  try {
    //Start a transaction
    await db.sequelize.transaction(async (t) => {
      //Define the origin and destination tank
      let originTankId;
      let destinationTankId;

      if (action === "unload") {
        originTankId = triggerTankId;
        destinationTankId = selectedTankId;
      } else {
        originTankId = selectedTankId;
        destinationTankId = triggerTankId;
      }

      const originTank = await Tank.findByPk(originTankId);
      const destinationTank = await Tank.findByPk(destinationTankId);

      //Check if tank_gauge is true in the origin tank
      if (originTank.tank_gauge) {
        originTank.tank_number += intQuantity;
      }

      //Update the current quantity and timestamp in origin tank
      originTank.current_quantity -= intQuantity;
      originTank.timestamp_current_quantity = new Date();
      await originTank.save({ transaction: t });

      //Update destination tank
      destinationTank.current_quantity += intQuantity;
      destinationTank.timestamp_current_quantity = new Date();
      await destinationTank.save({ transaction: t });

      //Event Logs Origin Tank
      const originLog = await EventLog.create({
        operation_id: 1, // load
        user_id: 1, // CORREGIR ESTO *********************************************
        tank_id: originTankId,
        transaction_quantity: intQuantity * -1,
        balance: originTank.current_quantity,
        tank_number_to_date: originTank.tank_number,
      })

      //Event logs Destination Tank
      const destinationLog = await EventLog.create({
        operation_id: 2, // unload
        user_id: 1, // *********************************
        tank_id: destinationTankId,
        transaction_quantity: intQuantity,
        balance: destinationTank.current_quantity,
        tank_number_to_date: destinationTank.tank_number,
      })
    });

    const updatedTanks = await Tank.findAll();
    return res.status(200).json(updatedTanks);

  } catch (err) {
    return res
      .status(500)
      .json({ err: "Error in the transfer: " + err.message });
  }
};

const tankController = {
  getTanks,
  createTank,
  transferOperation,
};

module.exports = tankController;
