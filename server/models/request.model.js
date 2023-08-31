module.exports = (sequelize, Sequelize) => {
    const Request = sequelize.define('Request', {
        operation_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        base_tank_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        destination_tank_id: {
            type: Sequelize.INTEGER,
        },        
        requested_quantity: {
            type: Sequelize.INTEGER,
        },
        status: {
            type: Sequelize.ENUM('pending', 'in_progress', 'completed', 'canceled'),
            allowNull: false,
            defaultValue: 'pending',
        },
        started_at: {
            type: Sequelize.DATE,
        },
        completed_at: {
            type: Sequelize.DATE,
        },
        requester_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        executor_id: {
            type: Sequelize.INTEGER,
        },
        notes: {
            type: Sequelize.TEXT,
        },        
    });

    Request.belongsTo(sequelize.models.Operation, {
        foreignKey: 'operation_id',
    });

    Request.belongsTo(sequelize.models.Tank, {
        foreignKey: 'base_tank_id',
        as: 'base_tank',
    });

    Request.belongsTo(sequelize.models.Tank, {
        foreignKey: 'destination_tank_id',
        as: 'destination_tank',
    });

    Request.belongsTo(sequelize.models.User, {
        foreignKey: 'requester_id',
        as: 'requester',
    });

    Request.belongsTo(sequelize.models.User, {
        foreignKey: 'executor_id',
        as: 'executor',
    });
    

    return Request;
}