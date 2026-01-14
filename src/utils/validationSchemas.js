import Joi from "joi";

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(255).required().trim(),
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().min(8).max(128).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().trim().lowercase(),
  password: Joi.string().required(),
});

const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(200).required().trim(),
  description: Joi.string().min(10).required().trim(),
  date: Joi.date().greater("now").required(),
  location: Joi.string().min(3).max(255).required().trim(),
  totalTickets: Joi.number().integer().min(1).required(),
  metadata: Joi.object().optional(),
});

const bookTicketSchema = Joi.object({
  eventId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid event ID format",
    }),
});

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export {
  registerSchema,
  loginSchema,
  createEventSchema,
  bookTicketSchema,
  paginationSchema,
};
