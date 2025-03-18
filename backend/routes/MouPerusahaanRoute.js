import express from "express";
import multer from "multer";
import path from "path";
import {
    getMouPerusahaan,
    getMouPerusahaanById,
    createMouPerusahaan,
    updateMouPerusahaan,
    deleteMouPerusahaan,
    updateMouPerusahaanStatus
} from "../controllers/MouPerusahaanController.js";

const router = express.Router();

// Konfigurasi multer untuk pengunggahan dokumen MoU
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
        const filetypes = /pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            return cb(new Error("Error: Only PDF files are allowed!"));
        }
    }
});

// Middleware untuk menangani error upload
const uploadMiddleware = (req, res, next) => {
    upload.single("dokumen_mou")(req, res, (err) => {
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

// Rute
router.get("/", getMouPerusahaan);
router.get("/:id", getMouPerusahaanById);
router.post("/", uploadMiddleware, createMouPerusahaan);
router.patch("/:id/status", updateMouPerusahaanStatus);
router.patch("/:id", uploadMiddleware, updateMouPerusahaan);
router.delete("/:id", deleteMouPerusahaan);

export default router;
