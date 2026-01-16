import User from "../models/mysql/User.js";
import { generateToken } from "../utils/jwt.js";
import loggerService from "../services/loggerService.js";

class AuthController {
  async createUser(req, res, next) {
    try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
      }
      const user = await User.create({
        name,
        email,
        password,
        isAdmin: req.originalUrl.includes("admin"),
      });

      await loggerService.logAuth("registration", user.id, req.ip, true);

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: {
          user: user.toSafeJSON(),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });

      if (!user) {
        await loggerService.logAuth("login", null, req.ip, false);
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await loggerService.logAuth("login", user.id, req.ip, false);
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const token = generateToken({
        userId: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      });

      await loggerService.logAuth("login", user.id, req.ip, true);

      res.status(200).json({
        success: true,
        message: "Login successful",
        data: {
          user: user.toSafeJSON(),
          token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfile(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
