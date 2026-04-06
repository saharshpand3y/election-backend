import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import electionRoutes from "./routes/electionRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.log("MongoDB Connection Error: ", err));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/election", electionRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
