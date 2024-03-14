import express from "express";
import { getUniversity } from "../controllers/university.js";

const router = express.Router();

// Register the route for getting a university by name
router.get("/get", getUniversity);

export default router;
