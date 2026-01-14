import Log from "../models/mongo/Log.js";

class LoggerService {
  async log(data) {
    try {
      await Log.create(data);
    } catch (error) {
      console.error("Failed to create log:", error);
    }
  }

  async logInfo(message, action, metadata = {}) {
    return this.log({
      level: "info",
      message,
      action,
      metadata,
    });
  }

  async logError(data) {
    return this.log({
      level: "error",
      message: data.message,
      action: "error",
      userId: data.userId,
      ipAddress: data.ip,
      metadata: {
        stack: data.stack,
        url: data.url,
        method: data.method,
      },
    });
  }

  async logAuth(action, userId, ipAddress, success = true) {
    return this.log({
      level: success ? "info" : "warning",
      message: `User ${action} ${success ? "successful" : "failed"}`,
      action,
      userId: userId?.toString(),
      ipAddress,
      metadata: { success },
    });
  }

  async logBooking(action, userId, eventId, success = true, metadata = {}) {
    return this.log({
      level: success ? "info" : "warning",
      message: `Booking ${action} ${success ? "successful" : "failed"}`,
      action: `booking_${action}`,
      userId: userId?.toString(),
      metadata: {
        eventId,
        success,
        ...metadata,
      },
    });
  }
}
export default new LoggerService();
