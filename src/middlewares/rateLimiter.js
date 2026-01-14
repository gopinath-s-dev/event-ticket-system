import rateLimit from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 5 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 500,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  skipSuccessfulRequests: true,
  message: {
    success: false,
    message:
      "Too many requests to authentication endpoints, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const bookingLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many booking attempts, please try again later",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { apiLimiter, authLimiter, bookingLimiter };
