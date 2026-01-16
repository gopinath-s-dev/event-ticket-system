import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      enum: ["info", "warning", "error", "debug"],
      default: "info",
    },
    message: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

logSchema.index({ userId: 1 });

export default mongoose.model("Log", logSchema);
