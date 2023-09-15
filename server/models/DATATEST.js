const db = require('./index');
const Tank = db.tank;

const initial = () => {
    Tank.create({
        type: 'estanque',
        name: 'principal',
        capacity: 10000,
        current_quantity: 9000,
        tank_gauge: true,
        // measured_quantity: 0,  ...default value 0
        // tank_number: 0, ...default value 0
        // tank_speed: 0 ...default value 0
        status: 'DISPONIBLE',
        timestamp_current_quantity: db.Sequelize.fn('NOW'),
        timestamp_measured_quantity: db.Sequelize.fn('NOW')
    });

    Tank.create({
        type: 'estanque',
        name: 'secundario',
        capacity: 8000,
        current_quantity: 4500,
        tank_gauge: true,
        status: 'DISPONIBLE',
        timestamp_current_quantity: db.Sequelize.fn('NOW'),
        timestamp_measured_quantity: db.Sequelize.fn('NOW')
    });

    Tank.create({
        type: 'estanque movil',
        name: 'bidon3000',
        capacity: 1000, 
        current_quantity: 500,
        tank_gauge: false,
        status: 'DISPONIBLE',
        timestamp_current_quantity: db.Sequelize.fn('NOW'),
        timestamp_measured_quantity: db.Sequelize.fn('NOW')
    });

    Tank.create({
        type: 'camion',
        name: 'FAW',
        capacity: 6000,
        current_quantity: 5500,
        tank_gauge: true,
        status: 'DISPONIBLE',
        timestamp_current_quantity: db.Sequelize.fn('NOW'),
        timestamp_measured_quantity: db.Sequelize.fn('NOW')
    });

};

module.exports = initial;

