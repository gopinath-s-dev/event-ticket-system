import express from "express";
const router = express.Router();

import eventController from "../controllers/eventController.js";

import authenticate from "../middlewares/authentication.js";

import validate from "../middlewares/validation.js";
import isAdmin from "../middlewares/checkAdmin.js";

import {
  createEventSchema,
  paginationSchema,
} from "../utils/validationSchemas.js";

router.use(authenticate);
router.get(
  "/paginate",
  validate(paginationSchema, "query"),
  eventController.listEvents
);
router.get("/:id/fetchById", eventController.getEventById);

router.post(
  "/create-event",
  isAdmin,
  validate(createEventSchema),
  eventController.createEvent
);

router.put("/:id/update-event", isAdmin, eventController.updateEvent);

export default router;
