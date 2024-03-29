import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
  editComment,
  getTotalCommentCount,
  getAverageRating
} from "../controllers/comment.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", addComment);
router.delete("/:id", deleteComment);
router.put("/", editComment);
router.get("/count/:eventID", getTotalCommentCount);
router.get("/avgRating/:eventID", getAverageRating);


export default router;
