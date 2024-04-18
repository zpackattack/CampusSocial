import express from "express";
import { createEvent, createRSOEvent, deleteEvent, editEvent, editLocation, getEvents, getLocation, getPublicEventsApproval, getRSOEvents, getUserEvents, setEvent } from "../controllers/event.js";


const router = express.Router();

router.post("/create", createEvent);
router.post("/createRSO", createRSOEvent);
router.get("/getUserEvents", getEvents);
router.get("/getPosterEvents", getUserEvents);
router.get("/getApprovalEvents/:status", getPublicEventsApproval);
router.get("/location", getLocation);
router.put("/", editEvent);
router.put("/location", editLocation);
router.get("/rso/:rsoID", getRSOEvents);
router.put("/setStatus", setEvent);
router.delete("/:eventID", deleteEvent);


export default router;