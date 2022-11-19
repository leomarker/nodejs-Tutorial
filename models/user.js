const Sequelize = require("sequelize");

const sequelize = require("../util/database");

const User = sequelize.define("user", {
  email: Sequelize.STRING,
  password: {
    type: Sequelize.STRING,
  },
});

module.exports = User;
