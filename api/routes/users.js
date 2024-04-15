import express from "express";
import { getUser , getUsername, premoteUser, updateUser} from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser)
router.get("/:userID", getUsername)
router.put("/", updateUser)
router.put("/premote", premoteUser)


export default router