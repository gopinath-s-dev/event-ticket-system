import { sequelize } from "../config/sqlConnection.js";
import Booking from "../models/mysql/Booking.js";
import Event from "../models/mongo/Event.js";
import loggerService from "./loggerService.js";

class BookingService {
  async bookTicket(userId, eventId) {
    let booking = null;
    let mysqlTransaction = null;
    let mongoUpdated = false;

    try {
      mysqlTransaction = await sequelize.transaction();

      const event = await Event.findOneAndUpdate(
        {
          _id: eventId,
          availableTickets: { $gt: 0 },
        },
        {
          $inc: { availableTickets: -1 },
        },
        {
          new: true,
          session: null,
        }
      );

      mongoUpdated = !!event;

      if (!event) {
        const eventExists = await Event.findById(eventId);
        if (!eventExists) {
          throw new Error("Event not found");
        }

        throw new Error("No tickets available");
      }

      booking = await Booking.create(
        {
          userId,
          eventId: event._id.toString(),
          eventName: event.title,
          status: "confirmed",
        },
        { transaction: mysqlTransaction }
      );

      await mysqlTransaction.commit();
      mysqlTransaction = null;

      await loggerService.logBooking("create", userId, eventId, true, {
        bookingId: booking.id,
        eventName: event.title,
      });

      return {
        booking,
        event,
      };
    } catch (error) {
      if (mysqlTransaction && !mysqlTransaction.finished)
        await mysqlTransaction.rollback();

      if (mongoUpdated && !booking) {
        try {
          await Event.findByIdAndUpdate(eventId, {
            $inc: { availableTickets: 1 },
          });
          console.log("Successfully rolled back MongoDB ticket count");
        } catch (rollbackError) {
          console.error(
            "Failed to rollback MongoDB ticket count:",
            rollbackError
          );
          await loggerService.log({
            level: "error",
            message: "Failed to rollback ticket count",
            action: "booking_rollback_failed",
            metadata: { eventId, error: rollbackError.message },
          });
        }
      }

      await loggerService.logBooking("create", userId, eventId, false, {
        error: error.message,
      });

      throw error;
    }
  }

  async cancelBooking(userId, bookingId) {
    let mysqlTransaction = null;
    let booking = null;
    let mongoUpdated = false;

    try {
      mysqlTransaction = await sequelize.transaction();

      booking = await Booking.findOne({
        where: { id: bookingId },
        transaction: mysqlTransaction,
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      if (booking.userId !== userId) {
        throw new Error("Unauthorized booking access");
      }

      if (booking.status === "cancelled") {
        throw new Error("Booking already cancelled");
      }

      const event = await Event.findByIdAndUpdate(
        booking.eventId,
        { $inc: { availableTickets: 1 } },
        { new: true }
      );

      mongoUpdated = true;

      if (!event) {
        throw new Error("Event not found");
      }

      booking.status = "cancelled";
      await booking.save({ transaction: mysqlTransaction });

      await mysqlTransaction.commit();
      mysqlTransaction = null;

      await loggerService.logBooking("cancel", userId, booking.eventId, true, {
        bookingId: booking.id,
        eventName: booking.eventName,
      });

      return { booking, event };
    } catch (error) {
      if (mysqlTransaction && !mysqlTransaction.finished)
        await mysqlTransaction.rollback();

      if (mongoUpdated) {
        try {
          await Event.findByIdAndUpdate(booking.eventId, {
            $inc: { availableTickets: -1 },
          });
        } catch (rollbackError) {
          await loggerService.log({
            level: "error",
            message: "Failed to rollback ticket cancellation",
            action: "cancel_rollback_failed",
            metadata: { bookingId, error: rollbackError.message },
          });
        }
      }

      await loggerService.logBooking("cancel", userId, bookingId, false, {
        error: error.message,
      });

      throw error;
    }
  }

  async getUserBookings(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: { userId, status: "confirmed" },
      limit,
      offset,
      order: [["created_at", "DESC"]],
      attributes: [
        "id",
        "eventId",
        "eventName",
        "bookingDate",
        "status",
        "created_at",
      ],
    });

    return {
      bookings: bookings,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }
}

export default new BookingService();
