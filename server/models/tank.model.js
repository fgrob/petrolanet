module.exports = (sequelize, Sequelize) => {
    const Tank = sequelize.define('Tank', {
        type: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING(50),
            allowNull: false,
        },
        capacity: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        current_quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        measured_quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        tank_number: {
            type: Sequelize.INTEGER,
            defaultValue: 0,
        },
        tank_speed: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.STRING(20),
        },
        timestamp_current_quantity: {
            type: Sequelize.DATE,
        },
        timestamp_measured_quantity: {
            type: Sequelize.DATE,
        },
    });

    return Tank;
};