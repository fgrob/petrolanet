const db = require("../models");
const { tank: Tank, eventLog: EventLog } = db;

const getTanks = async (req, res) => {
  try {
    const tanks = await Tank.findAll();
    res.json(tanks);
  } catch (err) {
    console.error("Error fetching tanks: ", err);
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
      await EventLog.create({
        // operation_id: 2, // load
        operation_id: 3, // traspaso
        user_id: 1, // CORREGIR ESTO *********************************************
        tank_id: originTankId,
        transaction_quantity: intQuantity * -1,
        balance: originTank.current_quantity,
        // error_quantity: originTank.error_quantity,
        tank_number_to_date: originTank.tank_number,
      });

      //Event logs Destination Tank
      await EventLog.create({
        // operation_id: 1, // unload
        operation_id: 3,
        user_id: 1, // *********************************
        tank_id: destinationTankId,
        transaction_quantity: intQuantity,
        balance: destinationTank.current_quantity,
        // error_quantity: destinationTank.error_quantity,
        tank_number_to_date: destinationTank.tank_number,
      });
    });

    const updatedTanks = await Tank.findAll();
    return res.status(200).json(updatedTanks);
  } catch (err) {
    return res
      .status(500)
      .json({ err: "Error in the transfer: " + err.message });
  }
};

const sellOrSupplyOperation = async (req, res) => {
  const {
    action,
    triggerTankId,
    clientSupplierId,
    selectedDocument,
    documentNumber,
    quantity,
    notes,
  } = req.body;

  let operationId;
  let clientId;
  let supplierId;
  let parsedDocumentNumber = documentNumber ? documentNumber : null;
  let intQuantity = parseInt(quantity);

  if (action === "unload") {
    intQuantity = -intQuantity;
    operationId = 2;
    clientId = clientSupplierId;
  } else {
    operationId = 1;
    supplierId = clientSupplierId;
  }

  try {
    await db.sequelize.transaction(async (t) => {
      const triggerTank = await Tank.findByPk(triggerTankId);

      //Check if tank_gauge is true
      if (triggerTank.tank_gauge && action === "unload") {
        triggerTank.tank_number -= intQuantity;
      }

      //Update current quantity and timestamp in trigger Tank
      action === "unload";
      triggerTank.current_quantity += intQuantity;
      triggerTank.timestamp_current_quantity = new Date();
      await triggerTank.save({ transaction: t });

      //Event Logs

      await EventLog.create({
        operation_id: operationId,
        user_id: 1, // CORREGIR ESTO *****************
        tank_id: triggerTankId,
        transaction_quantity: intQuantity,
        balance: triggerTank.current_quantity,
        // error_quantity: triggerTank.error_quantity,
        tank_number_to_date: triggerTank.tank_number,
        document_type: selectedDocument,
        document_number: parsedDocumentNumber,
        client_id: clientId,
        supplier_id: supplierId,
        notes: notes,
      });
    });

    const updatedTanks = await Tank.findAll();
    return res.status(200).json(updatedTanks);
  } catch (err) {
    return res
      .status(500)
      .json({ err: "Error in the transfer: " + err.message });
  }
};

const measurementOperation = async (req, res) => {
  const { triggerTankId, quantity, notes } = req.body;
  const intQuantity = parseInt(quantity);
  const operationId = 5;

  try {
    await db.sequelize.transaction(async (t) => {
      const triggerTank = await Tank.findByPk(triggerTankId);

      triggerTank.measured_quantity = intQuantity;
      triggerTank.error_quantity = intQuantity - triggerTank.current_quantity;
      triggerTank.timestamp_measured_quantity = new Date();
      await triggerTank.save({ transaction: t });

      await EventLog.create({
        operation_id: operationId,
        user_id: 1, // CORREGIR ESTO ********
        tank_id: triggerTankId,
        balance: triggerTank.current_quantity,
        measured_balance: intQuantity,
        error_quantity: triggerTank.error_quantity,
        tank_number_to_date: triggerTank.tank_number,
        notes: notes,
      });
    });

    const updatedTanks = await Tank.findAll();
    return res.status(200).json(updatedTanks);

  } catch (err) {
    return res
      .status(500)
      .json({ err: "Error in the measurement operation: " + err.message });
  }
};

const tankController = {
  getTanks,
  createTank,
  transferOperation,
  sellOrSupplyOperation,
  measurementOperation,
};

module.exports = tankController;
