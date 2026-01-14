import loggerService from "../services/loggerService.js";

const errorHandler = async (err, req, res, nxt) => {
  await loggerService.logError({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    userId: req.user?.id,
    ip: req.ip,
  });
  return res.status(err?.status || 500).json({
    error: err?.message || "Internal Server Error",
  });
};

export default errorHandler;
