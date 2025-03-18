import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";

// Middleware untuk melindungi route (hanya pengguna yang login bisa mengakses)
export const protect = async (req, res, next) => {
    let token;

    // Pastikan ada token di header Authorization
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            
            // Verifikasi token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Ambil data user dari database tanpa password
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } catch (error) {
            res.status(401).json({ message: "Token tidak valid, akses ditolak!" });
        }
    } else {
        res.status(401).json({ message: "Tidak ada token, akses ditolak!" });
    }
};

// Middleware untuk membatasi akses hanya bagi admin
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Akses ditolak! Hanya admin yang bisa mengakses." });
    }
};

// Middleware untuk membatasi akses hanya bagi perusahaan
export const perusahaanOnly = (req, res, next) => {
    if (req.user && req.user.role === "perusahaan") {
        next();
    } else {
        res.status(403).json({ message: "Akses ditolak! Hanya perusahaan yang bisa mengakses." });
    }
};

// Middleware untuk membatasi akses bagi admin atau perusahaan
export const perusahaanOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "perusahaan" || req.user.role === "admin")) {
        next();
    } else {
        res.status(403).json({ message: "Akses ditolak! Hanya admin atau perusahaan yang bisa mengakses." });
    }
};

