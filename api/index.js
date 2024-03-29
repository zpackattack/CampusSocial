import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import universityRoutes from "./routes/university.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import rso from "./routes/rso.js";
import event from "./routes/event.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";



app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // Replace with your client's origin
  credentials: true
}));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/rso", rso);
app.use("/api/event", event);

app.listen(8800, () => {
  console.log("API working!");
});
