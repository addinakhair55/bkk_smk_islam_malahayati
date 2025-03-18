import express from "express";
import multer from "multer";
import path from "path";
import {
    getAllTracerStudy,
    getMyTracerStudy,
    getTracerStudyById,
    createTracerStudy,
    updateTracerStudy,
    deleteTracerStudy,
    updateTracerStudyStatus
} from "../controllers/TracerStudyController.js";

import { protect, adminOnly } from "../middle/AuthMiddleware.js";

const router = express.Router();

// Konfigurasi penyimpanan multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new Error("Error: Hanya file gambar (JPEG, JPG, PNG) yang diperbolehkan!"));
        }
    }
});

// Middleware untuk menangani error upload
const uploadMiddleware = (req, res, next) => {
    upload.single("foto_alumni")(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ message: "Ukuran file melebihi batas 2MB!" });
            }
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

// Rute API dengan upload middleware
router.post("/", protect, uploadMiddleware, createTracerStudy);
router.put("/my-tracer-study", protect, uploadMiddleware, updateTracerStudy);
router.put("/:id", protect, adminOnly, uploadMiddleware, updateTracerStudy);
router.get("/my-tracer-study", protect, getMyTracerStudy);
router.get("/", getAllTracerStudy);
router.get("/:id", protect, getTracerStudyById);
router.patch("/:id/status", protect, adminOnly, updateTracerStudyStatus);
router.delete("/:id", protect, adminOnly, deleteTracerStudy);

export default router;
