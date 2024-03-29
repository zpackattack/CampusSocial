import express from "express";
import { createUniversity, editUniversity, getUniversity, getUniversityID } from "../controllers/university.js";

const router = express.Router();

// Register the route for getting a university by name
router.get("/", getUniversity);
router.get("/id/:universityID", getUniversityID);
router.post("/", createUniversity);
router.put("/", editUniversity);

export default router;
