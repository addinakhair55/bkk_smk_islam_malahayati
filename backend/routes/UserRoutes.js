import express from "express";
import { register, login, resetPasswordRequest, resetPassword, getUserProfile, updateProfile} from "../controllers/UserController.js";
import { protect } from "../middle/AuthMiddleware.js";
import path from "path";
import multer from "multer";

const router = express.Router();

// Konfigurasi penyimpanan
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Filter jenis file
const fileFilter = (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png/;
    const pdfTypes = /pdf/;
    const mimetype = imageTypes.test(file.mimetype) || pdfTypes.test(file.mimetype);
    const extname = imageTypes.test(path.extname(file.originalname).toLowerCase()) ||
                    pdfTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        return cb(new Error("Error: Hanya file gambar (JPEG, JPG, PNG) dan dokumen PDF yang diperbolehkan!"));
    }
};

// Konfigurasi multer
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Maksimum 2MB
    fileFilter: fileFilter
});

// Middleware untuk multiple upload
const uploadMiddleware = (req, res, next) => {
    upload.fields([
        { name: "fotoProfile", maxCount: 1 },
        { name: "cv", maxCount: 1 }
    ])(req, res, (err) => {
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


router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", resetPasswordRequest);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, uploadMiddleware, updateProfile);

export default router;