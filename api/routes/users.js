import express from "express";
import { getUser , premoteUser, updateUser} from "../controllers/user.js";

const router = express.Router()

router.get("/find/:userId", getUser)
router.put("/", updateUser)
router.put("/premote", premoteUser)


export default router