import Client from "../models/Client.js";
import GrindingRecord from "../models/GrindingRecord.js";

// ======================================================
// CREATE CLIENT + GRINDING RECORD
// ======================================================

export const createClient = async (req, res) => {
  try {
    const {
      name,
      note,
      item,
      beforeWeight,
      advanceItemTaken = 0,
      grindingNote = "",
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required",
      });
    }

    if (!item || !item.trim()) {
      return res.status(400).json({
        success: false,
        message: "Item is required",
      });
    }

    const before = Number(beforeWeight);
    const advance = Number(advanceItemTaken);

    if (!Number.isFinite(before) || before <= 0) {
      return res.status(400).json({
        success: false,
        message: "Before weight must be greater than 0",
      });
    }

    if (!Number.isFinite(advance) || advance < 0) {
      return res.status(400).json({
        success: false,
        message: "Advance item taken is invalid",
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

    // Create client
    const client = await Client.create({
      name: name.trim(),
      note: note?.trim() || "",
    });

    // Create grinding record
    const grindingRecord = await GrindingRecord.create({
      clientId: client._id,
      item: item.trim(),
      beforeWeight: before,
      advanceItemTaken: advance,
      remainingWeight,
      afterWeight: null,
      status: "Pending",

      totalAmount: 0,
      paidAmount: 0,
      remainingAmount: 0,
      paymentStatus: "Pending",

      note: grindingNote?.trim() || "",
    });

    return res.status(201).json({
      success: true,
      message: "Client added successfully",
      data: {
        client,
        grindingRecord,
      },
    });
  } catch (error) {
    console.error("Create client error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create client",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL CLIENTS
// ======================================================

export const getClients = async (req, res) => {
  try {
    const clients = await Client.find()
      .sort({ createdAt: -1 })
      .lean();

    const clientIds = clients.map((client) => client._id);

    const records = await GrindingRecord.find({
      clientId: { $in: clientIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    const recordsMap = {};

    records.forEach((record) => {
      const key = record.clientId.toString();

      if (!recordsMap[key]) {
        recordsMap[key] = [];
      }

      recordsMap[key].push(record);
    });

    const result = clients.map((client) => ({
      ...client,
      grindingRecords: recordsMap[client._id.toString()] || [],
    }));

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Get clients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch clients",
      error: error.message,
    });
  }
};

// ======================================================
// SEARCH CLIENT BY NAME
// ======================================================

export const searchClients = async (req, res) => {
  try {
    const name = req.query.name?.trim() || "";

    if (!name) {
      return getClients(req, res);
    }

    const clients = await Client.find({
      name: {
        $regex: name,
        $options: "i",
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    const clientIds = clients.map((client) => client._id);

    const records = await GrindingRecord.find({
      clientId: { $in: clientIds },
    })
      .sort({ createdAt: -1 })
      .lean();

    const recordsMap = {};

    records.forEach((record) => {
      const key = record.clientId.toString();

      if (!recordsMap[key]) {
        recordsMap[key] = [];
      }

      recordsMap[key].push(record);
    });

    const result = clients.map((client) => ({
      ...client,
      grindingRecords: recordsMap[client._id.toString()] || [],
    }));

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Search clients error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to search clients",
      error: error.message,
    });
  }
};

// ======================================================
// DELETE COMPLETE CLIENT
// ======================================================

export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    // First delete all grinding records
    await GrindingRecord.deleteMany({
      clientId: client._id,
    });

    // Then delete client
    await Client.findByIdAndDelete(client._id);

    return res.status(200).json({
      success: true,
      message:
        "Client and all related records deleted successfully",
    });
  } catch (error) {
    console.error("Delete client error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete client",
      error: error.message,
    });
  }
};
// ======================================================
// UPDATE CLIENT
// ======================================================

export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, note } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Client name is required",
      });
    }

    const client = await Client.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        note: note?.trim() || "",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!client) {
      return res.status(404).json({
        success: false,
        message: "Client not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (error) {
    console.error("Update client error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update client",
      error: error.message,
    });
  }
};