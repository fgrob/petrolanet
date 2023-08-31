module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('User', {
        username: {
            type: Sequelize.STRING(20),
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        cellphone: {
            type: Sequelize.INTEGER,
        },
    });

    return User;
};