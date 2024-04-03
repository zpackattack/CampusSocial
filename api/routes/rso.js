import express from "express";
import { addMembers, createRSO, getUserRSOs, getUniversityRSOs, getUniversityRSOsNotMember, getRSO, checkUserInRSO, deleteMemberFromRSO, countRSOMembers } from "../controllers/rso.js";

const router = express.Router();

router.post("/", createRSO);
router.get("/:rsoID", getRSO);
router.post("/addMembers", addMembers);
router.get("/getUserRSOs/:userID", getUserRSOs);
router.get("/getUniversityRSOs/:universityID", getUniversityRSOs);
router.get("/getNotUserRSO", getUniversityRSOsNotMember);
router.get("/checkUserInRSO/:userID/:rsoID", checkUserInRSO);
router.delete("/deleteMember/:userID/:rsoID", deleteMemberFromRSO);
router.get("/memberCount/:rsoID", countRSOMembers);

export default router;