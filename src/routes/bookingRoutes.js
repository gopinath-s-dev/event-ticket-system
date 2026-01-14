import express from "express";
const router = express.Router();

import validate from "../middlewares/validation.js";
import authenticate from "../middlewares/authentication.js";
import { bookingLimiter } from "../middlewares/rateLimiter.js";
import bookingController from "../controllers/bookingController.js";
import {
  bookTicketSchema,
  paginationSchema,
} from "../utils/validationSchemas.js";

router.use(authenticate);

router.post(
  "/create-booking",
  bookingLimiter,
  validate(bookTicketSchema),
  bookingController.bookTicket
);
router.delete(
  "/:bookingId/cancel-booking",
  bookingLimiter,
  bookingController.cancelBooking
);
router.get(
  "/my-bookings/paginate",
  validate(paginationSchema, "query"),
  bookingController.getMyBookings
);

export default router;
