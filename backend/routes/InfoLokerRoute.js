import express from "express";
import multer from "multer";
import path from "path";
import {
    getInfoLoker,
    getInfoLokerById,
    createInfoLoker,
    updateInfoLoker,
    deleteInfoLoker,
    getMyInfoLoker,
} from "../controllers/InfoLokerController.js";

import { protect, perusahaanOrAdmin } from "../middle/AuthMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
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
            cb(new Error("Error: Hanya file gambar (JPEG, JPG, PNG) yang diperbolehkan!"));
        }
    },
});

// Middleware untuk menangani error upload file
const uploadMiddleware = (req, res, next) => {
    upload.fields([{ name: "poster" }, { name: "logo" }])(req, res, (err) => {
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
router.get("/", getInfoLoker);
router.get("/my-lowongan", protect, getMyInfoLoker);
router.get("/:id", protect, getInfoLokerById);
router.post("/", protect, perusahaanOrAdmin, uploadMiddleware, createInfoLoker);
router.put("/:id", protect, perusahaanOrAdmin, uploadMiddleware, updateInfoLoker);
router.delete("/:id", protect, perusahaanOrAdmin, deleteInfoLoker);

export default router;
