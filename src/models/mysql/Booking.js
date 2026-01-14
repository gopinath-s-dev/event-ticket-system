import { DataTypes } from "sequelize";
import { sequelize } from "../../config/sqlConnection.js";

import User from "./User.js";

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    eventId: {
      type: DataTypes.STRING(24),
      allowNull: false,
      field: "event_id",
    },
    eventName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "event_name",
    },
    bookingDate: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "booking_date",
    },
    status: {
      type: DataTypes.ENUM("confirmed", "cancelled"),
      defaultValue: "confirmed",
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      { fields: ["user_id"] },
      { fields: ["event_id"] },
      { fields: ["status"] },
    ],
  }
);

Booking.belongsTo(User, { foreignKey: "userId", as: "user" });
User.hasMany(Booking, { foreignKey: "userId", as: "bookings" });

export default Booking;
