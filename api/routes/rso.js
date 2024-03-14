import express from "express";
import { addMembers, createRSO, getUserRSOs, getUniversityRSOs } from "../controllers/rso.js";

const router = express.Router();

router.post("/", createRSO);
router.post("/addMembers", addMembers);
router.get("/getUserRSOs", getUserRSOs);
router.get("/getUniversityRSOs", getUniversityRSOs);

export default router;