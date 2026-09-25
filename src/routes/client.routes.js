import express from "express";

import {
  createClient,
  getClients,
  searchClients,
  updateClient,
  deleteClient,
} from "../controllers/client.controller.js";

const router = express.Router();

// Create client + grinding record
router.post("/", createClient);

// Search must come before /:id
router.get("/search", searchClients);

// Get all clients
router.get("/", getClients);

// Update client
router.patch("/:id", updateClient);

// Delete complete client
router.delete("/:id", deleteClient);

export default router;