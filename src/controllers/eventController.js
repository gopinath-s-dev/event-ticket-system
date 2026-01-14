import Event from "../models/mongo/Event.js";
import loggerService from "../services/loggerService.js";

class EventController {
  async createEvent(req, res, next) {
    try {
      const { title, description, date, location, totalTickets, metadata } =
        req.body;

      const event = await Event.create({
        title,
        description,
        date,
        location,
        totalTickets,
        availableTickets: totalTickets,
        metadata: metadata || {},
      });

      await loggerService.logInfo(`Event created: ${title}`, "event_create", {
        eventId: event._id.toString(),
        createdBy: req.user.id,
      });

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: { event },
      });
    } catch (error) {
      next(error);
    }
  }

  async listEvents(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const query = {};

      if (req.query.upcoming === "true") {
        query.date = { $gte: new Date() };
      }

      if (req.query.search) {
        query.$text = { $search: req.query.search };
      }

      const [events, total] = await Promise.all([
        Event.find(query)
          .sort({ date: 1 })
          .skip(skip)
          .limit(limit)
          .select("-__v"),
        Event.countDocuments(query),
      ]);

      res.status(200).json({
        success: true,
        data: {
          events,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req, res, next) {
    try {
      const { id } = req.params;

      const event = await Event.findById(id).select("-__v");

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      res.status(200).json({
        success: true,
        data: { event },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const updates = req.body;

      delete updates.totalTickets;
      delete updates.availableTickets;

      const event = await Event.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      }).select("-__v");

      if (!event) {
        return res.status(404).json({
          success: false,
          message: "Event not found",
        });
      }

      await loggerService.logInfo(
        `Event updated: ${event.title}`,
        "event_update",
        { eventId: id, updatedBy: req.user.id }
      );

      res.status(200).json({
        success: true,
        message: "Event updated successfully",
        data: { event },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new EventController();
