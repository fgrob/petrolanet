const moment = require('moment');
const db = require("../models");
const { tank: Tank, eventLog: EventLog } = db;

const getTanks = async (req, res) => {
  try {
    const tanks = await Tank.findAll();
    res.json(tanks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const createTank = async (req, res) => {
  try {
    const { tankName, tankType, tankCapacity, tankGauge, tankNumber } =
      req.body;

    const tankData = {
      name: tankName,
      type: tankType,
      capacity: parseInt(tankCapacity),
      tank_gauge: tankGauge,
      tank_number: tankNumber,
    };

    if (tankNumber === "") {
      // the model defaults to 0 for non-provided keys
      delete tankData.tank_number;
    }

    await Tank.create(tankData);

    const updatedTanks = await Tank.findAll();

    // Get the Socket.IO instance
    const io = req.app.get("io");
    // Get the socket ID sent in the tank services request headers
    const socketId = req.headers.socketid;
    // Emit the message to all clients except the sender
    const socket = io.sockets.sockets.get(socketId);
    socket.broadcast.emit("updatedTanks", updatedTanks)

    return res.status(200).json(updatedTanks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const transferOperation = async (req, res) => {
  const { action, triggerTankId, selectedTankId, quantity, directTransfer } = req.body;
  const username = req.auth.payload.username;
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

      //Check if tank_gauge is true in the origin tank and if it is not a direct transfer (direct transfer dont modify the tank number)
      if (originTank.tank_gauge && !directTransfer) {
        originTank.tank_number += intQuantity;
      }

      //Update the current quantity and timestamp in origin tank
      originTank.current_quantity -= intQuantity;
      // originTank.timestamp_current_quantity = new Date();
      originTank.timestamp_current_quantity = moment().toISOString();
      await originTank.save({ transaction: t });

      //Update destination tank
      destinationTank.current_quantity += intQuantity;
      destinationTank.timestamp_current_quantity = moment().toISOString();
      await destinationTank.save({ transaction: t });

      //Event Logs Origin Tank
      await EventLog.create({
        operation_id: 3, // traspaso
        user: username,
        tank_id: originTankId,
        transaction_quantity: intQuantity * -1,
        balance: originTank.current_quantity,
        tank_number_to_date: originTank.tank_number,
        notes: directTransfer ? "Transferencia directa (no modifica Numeral)" : "",
      }); 

      //Event logs Destination Tank
      await EventLog.create({
        operation_id: 3,
        user: username,
        tank_id: destinationTankId,
        transaction_quantity: intQuantity,
        balance: destinationTank.current_quantity,
        tank_number_to_date: destinationTank.tank_number,
      });
    });

    const updatedTanks = await Tank.findAll();

    const io = req.app.get("io");
    const socketId = req.headers.socketid;
    const socket = io.sockets.sockets.get(socketId);
    socket.broadcast.emit("updatedTanks", updatedTanks)
    
    return res.status(200).json(updatedTanks);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error in the transfer: " + err.message });
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

  const username = req.auth.payload.username;
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
      triggerTank.timestamp_current_quantity = moment().toISOString();
      await triggerTank.save({ transaction: t });

      //Event Logs

      await EventLog.create({
        operation_id: operationId,
        user: username,
        tank_id: triggerTankId,
        transaction_quantity: intQuantity,
        balance: triggerTank.current_quantity,
        tank_number_to_date: triggerTank.tank_number,
        document_type: selectedDocument,
        document_number: parsedDocumentNumber,
        client_id: clientId,
        supplier_id: supplierId,
        notes: notes,
      });
    });

    const updatedTanks = await Tank.findAll();

    const io = req.app.get("io");
    const socketId = req.headers.socketid;
    const socket = io.sockets.sockets.get(socketId);
    socket.broadcast.emit("updatedTanks", updatedTanks)

    return res.status(200).json(updatedTanks);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error in the transfer: " + err.message });
  }
};

const measurementOperation = async (req, res) => {
  const { triggerTankId, quantity, notes } = req.body;
  const username = req.auth.payload.username;
  const intQuantity = parseInt(quantity);
  const operationId = 5;

  try {
    await db.sequelize.transaction(async (t) => {
      const triggerTank = await Tank.findByPk(triggerTankId);

      triggerTank.measured_quantity = intQuantity;
      triggerTank.error_quantity = intQuantity - triggerTank.current_quantity;
      triggerTank.timestamp_measured_quantity = moment().toISOString();
      await triggerTank.save({ transaction: t });

      await EventLog.create({
        operation_id: operationId,
        user: username,
        tank_id: triggerTankId,
        balance: triggerTank.current_quantity,
        measured_balance: intQuantity,
        error_quantity: triggerTank.error_quantity,
        tank_number_to_date: triggerTank.tank_number,
        notes: notes,
      });
    });

    const updatedTanks = await Tank.findAll();

    const io = req.app.get("io");
    const socketId = req.headers.socketid;
    const socket = io.sockets.sockets.get(socketId);
    socket.broadcast.emit("updatedTanks", updatedTanks)

    return res.status(200).json(updatedTanks);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error in the measurement operation: " + err.message });
  }
};

const adjustmentOperation = async (req, res) => {
  const tankId = req.body.tankId;
  const username = req.auth.payload.username;
  const changedData = req.body.changedData;
  const notes = req.body.notes;

  try {
    //Start a transaction

    await db.sequelize.transaction(async (t) => {
      const targetTank = await Tank.findByPk(tankId);

      let old_current_quantity = targetTank.current_quantity;
      let new_current_quantity = old_current_quantity;
      let transaction_quantity = 0;
      if (changedData.hasOwnProperty("current_quantity")) {
        new_current_quantity = changedData["current_quantity"];
        transaction_quantity = new_current_quantity - old_current_quantity;
      }

      // let old_error_quantity = targetTank.error_quantity;
      let new_error_quantity = targetTank.error_quantity;
      if (changedData.hasOwnProperty("error_quantity")) {
        new_error_quantity = changedData["error_quantity"];
      }

      // let old_tank_number_to_date = targetTank.tank_number_to_date;
      let new_tank_number_to_date = 0;
      if (changedData.hasOwnProperty("tank_number")) {
        new_tank_number_to_date = changedData["tank_number"];
      }

      Object.entries(changedData).map(([key, value]) => {
        targetTank[key] = value;
      });
      await targetTank.save({ transaction: t });

      if (
        changedData.hasOwnProperty("current_quantity") ||
        changedData.hasOwnProperty("error_quantity") ||
        changedData.hasOwnProperty("tank_number")
      ) {
        await EventLog.create({
          operation_id: 4, // adjustment
          user: username,
          tank_id: tankId,
          transaction_quantity: transaction_quantity,
          balance: new_current_quantity,
          error_quantity: new_error_quantity,
          tank_number_to_date: new_tank_number_to_date,
          notes: notes,
        });
      }
    });

    const updatedTanks = await Tank.findAll();

    const io = req.app.get("io");
    const socketId = req.headers.socketid;
    const socket = io.sockets.sockets.get(socketId);
    socket.broadcast.emit("updatedTanks", updatedTanks)

    return res.status(200).json(updatedTanks);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Error in the adjustment: " + err.message });
  }
};

const tankController = {
  getTanks,
  createTank,
  transferOperation,
  sellOrSupplyOperation,
  measurementOperation,
  adjustmentOperation,
};

module.exports = tankController;
