import mongoose from "mongoose";

const grindingRecordSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      index: true,
    },

    item: {
      type: String,
      required: true,
      trim: true,
    },

    beforeWeight: {
      type: Number,
      required: true,
      min: 0,
    },

    advanceItemTaken: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingWeight: {
      type: Number,
      default: 0,
      min: 0,
    },

    afterWeight: {
      type: Number,
      default: null,
      min: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },

    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    remainingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Partial", "Paid", "Udhaar"],
      default: "Pending",
    },

    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const GrindingRecord = mongoose.model(
  "GrindingRecord",
  grindingRecordSchema
);

export default GrindingRecord;