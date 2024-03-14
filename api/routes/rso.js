import express from "express";
import { addMembers, createRSO, getUserRSOs } from "../controllers/rso.js";

const router = express.Router();

router.post("/", createRSO);
router.post("/addMembers", addMembers);
router.get("/getUserRSOs", getUserRSOs);

export default router;