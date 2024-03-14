import express from "express";
import { createEvent, editEvent, editLocation, getEvents, getLocation } from "../controllers/event.js";


const router = express.Router();

router.post("/create", createEvent);
router.get("/getUserEvents", getEvents);
router.get("/ocation", getLocation);
router.put("/", editEvent);
router.put("/location", editLocation);


export default router;