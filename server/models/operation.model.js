module.exports = (sequelize, Sequelize) => {
    const Operation = sequelize.define('Operation', {
        name: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true,
        },
    });

    return Operation;
};