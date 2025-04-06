import UserModel from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
  export const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Kesalahan server", error: error.message });
    }
  };

  export const register = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Akun sudah ada." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new UserModel({ 
            name, 
            email, 
            password: hashedPassword,
            role: role || "alumni"
        });
        await newUser.save();

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        res.status(201).json({ token, role: newUser.role, message: "Registrasi berhasil" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Kesalahan Server" });
    }
};


export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(400).json({ message: "Kredensial tidak valid." });

      const isMatch = await user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: "Kredensial tidak valid." });

      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "30d" });

      // Kirim token dan role dalam respons
      res.status(200).json({ token, role: user.role });
  } catch (error) {
      res.status(500).json({ message: "Kesalahan Server" });
  }
};

  // Forgot Password
  export const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await UserModel.findOne({ email });
      if (!user) return res.status(404).json({ message: "Akun tidak ditemukan." });

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpire = Date.now() + 3600000;

      user.resetToken = resetToken;
      user.resetExpire = resetExpire;
      await user.save();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const resetUrl = user.role === "perusahaan"
      ? `${process.env.FRONTEND_URL}/auth/reset-password/perusahaan/${resetToken}`
      : `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`;

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Permintaan Reset Kata Sandi",
        text: `Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda. Jika Anda yang membuat permintaan ini, silakan klik link di bawah ini untuk mengatur ulang kata sandi Anda:\n\n${resetUrl}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Terjadi kesalahan saat mengirim email:", error);
          return res.status(500).json({ message: "Terjadi kesalahan saat mengirim email.", error: error.message });
        }
        console.log("Email terkirim:", info.response);
        res.status(200).json({ message: "Tautan pengaturan ulang kata sandi telah terkirim." });
      });
    } catch (error) {
      console.error("Kesalahan dalam resetPasswordRequest:", error);
      res.status(500).json({ message: "Kesalahan server", error: error.message });
    }
  };

  // Reset Password
  export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
      console.log("Token diterima:", token);
      console.log("Kata sandi baru:", newPassword);

      const user = await UserModel.findOne({
        resetToken: token,
        resetExpire: { $gt: Date.now() },
      });

      if (!user) {
        return res.status(400).json({ message: "Token reset tidak valid atau kedaluwarsa" });
      }

      console.log("Pengguna menemukan:", user.email);

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      user.resetToken = undefined;
      user.resetExpire = undefined;
      await user.save();

      res.status(200).json({ message: "Kata sandi berhasil di atur ulang" });
    } catch (error) {
      console.error("Kesalahan dalam resetPassword:", error);
      res.status(500).json({ message: "Kesalahan server", error: error.message });
    }
  };

  // Profile
  export const updateProfile = async (req, res) => {
    const { name, email, password, deleteFotoProfile, noTelp } = req.body;
    const fotoProfile = req.files?.fotoProfile ? req.files.fotoProfile[0].filename : undefined;
    const cv = req.files?.cv ? req.files.cv[0].filename : undefined;

    try {
        const user = await UserModel.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan" });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        if (fotoProfile) {
            user.fotoProfile = fotoProfile;
        }

        if (noTelp) {
            user.noTelp = noTelp;
        }

        if (user.role === "alumni" && cv) {
            user.cv = cv;
        }

        await user.save();
        res.status(200).json({ message: "Profil berhasil diperbarui", user });

    } catch (error) {
        res.status(500).json({ message: "Kesalahan server", error: error.message });
    }
};
