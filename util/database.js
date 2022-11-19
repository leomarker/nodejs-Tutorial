const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_project", "root", "Mysql@root90", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
