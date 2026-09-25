import express from "express";

import {
  getGrindingRecords,
  getGrindingRecordById,
  updateGrindingRecord,
} from "../controllers/grinding.controller.js";

const router = express.Router();

router.get("/", getGrindingRecords);

router.get("/:id", getGrindingRecordById);

router.patch("/:id", updateGrindingRecord);

export default router;