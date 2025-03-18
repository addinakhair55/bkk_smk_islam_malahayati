import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import tracerStudyRouter from "./routes/TracerStudyRoute.js";
import mouPerusahaanRoute from "./routes/MouPerusahaanRoute.js";
import infoLokerRoute from "./routes/InfoLokerRoute.js";
import authRoutes from "./routes/UserRoutes.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware setup
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// Koneksi ke MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Database Connected"))
    .catch((err) => console.error("Database connection error:", err));

const db = mongoose.connection;
db.on("error", (error) => console.log("Database error:", error));
db.once("open", () => console.log("Database Connected..."));

// Setup Multer untuk Upload File
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Rute API
app.use("/tracer-study", tracerStudyRouter);
app.use("/mou-perusahaan", mouPerusahaanRoute);
app.use("/info-lowongan-kerja", infoLokerRoute);
app.use("/auth", authRoutes);

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
