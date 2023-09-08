const db = require('../models');
const { tank: Tank } = db;

const getTanks = async (req, res) => {
    try {
        const tanks = await Tank.findAll();
        res.json(tanks);
    } catch (err) {
        console.error('Error fetching tanks:', err);
        res.status(500).json({ err: 'Internal server error' });
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
        console.error('Error creating a tank', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const tankController = {
    getTanks,
    createTank,
};

module.exports = tankController;