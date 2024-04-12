import express from "express";
import { createEvent, editEvent, editLocation, getEvents, getLocation, getPublicEventsApproval, getRSOEvents } from "../controllers/event.js";


const router = express.Router();

router.post("/create", createEvent);
router.get("/getUserEvents", getEvents);
router.get("/getApprovalEvents/:status", getPublicEventsApproval);
router.get("/location", getLocation);
router.put("/", editEvent);
router.put("/location", editLocation);
router.get("/rso/:rsoID", getRSOEvents);


export default router;