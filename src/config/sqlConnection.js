import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: "mysql",
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log("MySQL connection established successfully.");

    await sequelize.sync();
    console.log("Models synchronized.");
  } catch (error) {
    console.error("Error on MySQL Connection:", error.message);
    process.exit(1);
  }
};

export { sequelize, connectMySQL };
