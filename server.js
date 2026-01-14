import "dotenv/config";
import app from "./src/index.js";
import mongoConnect from "./src/config/mongoConnection.js";
import { connectMySQL } from "./src/config/sqlConnection.js";

const PORT = process.env.PORT || 8080;

const start = async () => {
  await connectMySQL();
  await mongoConnect();
  app.listen(PORT, () => {
    console.log(`Ticket Booking Application is running on ${PORT}`);
  });
};

start();
