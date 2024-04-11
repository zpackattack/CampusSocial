import express from "express";
import { createUniversity, createUniversityRequest, editUniversity, getUniversity, getUniversityID, getUniversityRequests, setUniversityRequest } from "../controllers/university.js";

const router = express.Router();

router.get("/", getUniversity);
router.get("/id/:universityID", getUniversityID);
router.post("/", createUniversity);
router.put("/", editUniversity);
router.post("/universityRequest", createUniversityRequest);
router.put("/universityRequest", setUniversityRequest);
router.get("/universityRequest/:status", getUniversityRequests);

export default router;
