import express from "express";
const router = express.Router();

import validate from "../middlewares/validation.js";
import authenticate from "../middlewares/authentication.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import authController from "../controllers/authController.js";
import { registerSchema, loginSchema } from "../utils/validationSchemas.js";

router.post(
  "/create-user",
  authLimiter,
  validate(registerSchema),
  authController.createUser
);

router.post(
  "/create-admin",
  authLimiter,
  validate(registerSchema),
  authController.createUser
);
router.post("/login", authLimiter, validate(loginSchema), authController.login);

router.get("/user-profile", authenticate, authController.getProfile);

export default router;
