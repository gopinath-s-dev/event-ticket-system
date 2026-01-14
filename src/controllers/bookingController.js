import bookingService from "../services/bookingService.js";

class BookingController {
  async bookTicket(req, res, next) {
    try {
      const { eventId } = req.body;
      const userId = req.user.id;

      const result = await bookingService.bookTicket(userId, eventId);

      res.status(201).json({
        success: true,
        message: "Ticket booked successfully",
        data: {
          booking: result.booking,
          event: {
            id: result.event._id,
            title: result.event.title,
            date: result.event.date,
            location: result.event.location,
            availableTickets: result.event.availableTickets,
          },
        },
      });
    } catch (error) {
      if (error.message === "Event not found") {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      if (error.message === "No tickets available") {
        return res.status(409).json({
          success: false,
          message: "No tickets available for this event",
        });
      }

      next(error);
    }
  }

  async cancelBooking(req, res, next) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;

      const result = await bookingService.cancelBooking(userId, bookingId);

      res.status(200).json({
        success: true,
        message: "Ticket cancelled successfully",
        data: {
          booking: result.booking,
          event: {
            id: result.event._id,
            title: result.event.title,
            availableTickets: result.event.availableTickets,
          },
        },
      });
    } catch (error) {
      if (error.message === "Booking not found") {
        return res.status(404).json({
          success: false,
          message: "Booking not found",
        });
      }

      if (error.message === "Booking already cancelled") {
        return res.status(409).json({
          success: false,
          message: "Booking already cancelled",
        });
      }

      next(error);
    }
  }

  async getMyBookings(req, res, next) {
    try {
      const userId = req.user.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await bookingService.getUserBookings(userId, page, limit);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new BookingController();
