import express from "express";
import { addMembers, createRSO, getUserRSOs, getUniversityRSOs, getUniversityRSOsNotMember, getRSO, checkUserInRSO, createRSORequest, deleteMemberFromRSO, countRSOMembers, updateRSO, getUniversityRSOsAll, getUsersRSORequest, getRSORequest, setRSORequestStatus, getRSORequestOthers, getAdminRSOs, getUniversityRSOCount, getUsersRSOCount, getUsersRSORequestCount } from "../controllers/rso.js";

const router = express.Router();
router.put("/setRSO", setRSORequestStatus);
router.post("/", createRSO);
router.get("/:rsoID", getRSO);
router.post("/addMembers", addMembers);
router.get("/getUserRSOs/:userID", getUserRSOs);
router.get("/getUniversityRSOs/:universityID", getUniversityRSOs);
router.get("/getUniversityRSOsAll/:universityID", getUniversityRSOsAll);
router.get("/getUniversityRSOCount/:universityID", getUniversityRSOCount);
router.get("/getNotUserRSO/:universityID/:userID", getUniversityRSOsNotMember);
router.get("/checkUserInRSO/:userID/:rsoID", checkUserInRSO);
router.delete("/deleteMember/:userID/:rsoID", deleteMemberFromRSO);
router.get("/memberCount/:rsoID", countRSOMembers);
router.put("/:rsoID", updateRSO); 
router.post("/rsoRequest", createRSORequest); 
router.get("/userRSORequests/:userID", getUsersRSORequest);
router.get("/userRSOCount/:userID", getUsersRSOCount);
router.get("/userRSORequestCount/:userID", getUsersRSORequestCount);
router.get("/getRSORequest/:universityID", getRSORequest);
router.get("/getRSORequestOther/:requestID", getRSORequestOthers);
router.get("/getAdminRSOs/:adminID", getAdminRSOs);

export default router;