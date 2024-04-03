import express from "express";
import { createEvent, editEvent, editLocation, getEvents, getLocation, getRSOEvents } from "../controllers/event.js";


const router = express.Router();

router.post("/create", createEvent);
router.get("/getUserEvents", getEvents);
router.get("/location", getLocation);
router.put("/", editEvent);
router.put("/location", editLocation);
router.get("/rso/:rsoID", getRSOEvents);


export default router;