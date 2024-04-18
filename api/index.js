import express from "express";
const app = express();
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import universityRoutes from "./routes/university.js";

import commentRoutes from "./routes/comments.js";

import rso from "./routes/rso.js";
import event from "./routes/event.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";



app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));
app.use(cookieParser());


app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/university", universityRoutes);
app.use("/api/rso", rso);
app.use("/api/event", event);

app.listen(8800, () => {
  console.log("API working!");
});
