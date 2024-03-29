import express from "express";
import { addMembers, createRSO, getUserRSOs, getUniversityRSOs, getUniversityRSOsNotMember } from "../controllers/rso.js";

const router = express.Router();

router.post("/", createRSO);
router.post("/addMembers", addMembers);
router.get("/getUserRSOs/:userID", getUserRSOs);
router.get("/getUniversityRSOs/:universityID", getUniversityRSOs);
router.get("/getNotUserRSO", getUniversityRSOsNotMember);

export default router;