import GrindingRecord from "../models/GrindingRecord.js";

// ======================================================
// GET ALL GRINDING RECORDS
// ======================================================

export const getGrindingRecords = async (req, res) => {
  try {
    const records = await GrindingRecord.find()
      .populate("clientId", "name note")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    console.error("Get grinding records error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grinding records",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE GRINDING RECORD
// ======================================================

export const getGrindingRecordById = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await GrindingRecord.findById(id).populate(
      "clientId",
      "name note"
    );

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Grinding record not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: record,
    });
  } catch (error) {
    console.error("Get grinding record error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch grinding record",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE GRINDING RECORD
// ======================================================

export const updateGrindingRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      item,
      beforeWeight,
      advanceItemTaken,
      afterWeight,
      status,
      totalAmount,
      paidAmount,
      note,
    } = req.body;

    const record = await GrindingRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        success: false,
        message: "Grinding record not found",
      });
    }

    // -----------------------------
    // Weight
    // -----------------------------

    const before = Number(
      beforeWeight ?? record.beforeWeight
    );

    const advance = Number(
      advanceItemTaken ?? record.advanceItemTaken ?? 0
    );

    if (!Number.isFinite(before) || before < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid before weight",
      });
    }

    if (!Number.isFinite(advance) || advance < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid advance item taken",
      });
    }

    if (advance > before) {
      return res.status(400).json({
        success: false,
        message:
          "Advance item taken cannot be greater than before weight",
      });
    }

    const remainingWeight = before - advance;

    // -----------------------------
    // Payment
    // -----------------------------

    const total = Number(
      totalAmount ?? record.totalAmount ?? 0
    );

    const paid = Number(
      paidAmount ?? record.paidAmount ?? 0
    );

    if (!Number.isFinite(total) || total < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid total amount",
      });
    }

    if (!Number.isFinite(paid) || paid < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid paid amount",
      });
    }

    if (paid > total) {
      return res.status(400).json({
        success: false,
        message:
          "Paid amount cannot be greater than total amount",
      });
    }

    const remainingAmount = total - paid;

    let paymentStatus = "Pending";

    if (total === 0) {
      paymentStatus = "Pending";
    } else if (paid === 0) {
      paymentStatus = "Udhaar";
    } else if (paid < total) {
      paymentStatus = "Partial";
    } else {
      paymentStatus = "Paid";
    }

    // -----------------------------
    // Update
    // -----------------------------

    record.item =
      item !== undefined ? item.trim() : record.item;

    record.beforeWeight = before;

    record.advanceItemTaken = advance;

    record.remainingWeight = remainingWeight;

    record.afterWeight =
      afterWeight === null ||
      afterWeight === "" ||
      afterWeight === undefined
        ? null
        : Number(afterWeight);

    record.status = status || record.status;

    record.totalAmount = total;

    record.paidAmount = paid;

    record.remainingAmount = remainingAmount;

    record.paymentStatus = paymentStatus;

    record.note =
      note !== undefined
        ? note.trim()
        : record.note;

    await record.save();

    return res.status(200).json({
      success: true,
      message: "Grinding record updated successfully",
      data: record,
    });
  } catch (error) {
    console.error("Update grinding record error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update grinding record",
      error: error.message,
    });
  }
};