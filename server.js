import express from "express";
import cors from "cors";
import nominationRoutes from "./routes/nomination.js";
import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.js";
import cors from "cors";

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/nomination", nominationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.listen(5000, () => console.log("Server running on 5000"));