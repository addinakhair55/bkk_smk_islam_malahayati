import infoLokerModel from "../models/InfoLokerModel.js";

export const getInfoLoker = async (req, res) => {
    try {
        const infoLoker = await infoLokerModel.find().populate("createdBy", "name email");
        res.json(infoLoker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyInfoLoker = async (req, res) => {
    try {
        const infoLoker = await infoLokerModel.find({ createdBy: req.user.id });

        if (!infoLoker) return res.status(404).json({ message: "Data tidak ditemukan, hanya perusahaan yang bisa melihat data." });

        res.json(infoLoker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mendapatkan info loker berdasarkan ID
export const getInfoLokerById = async (req, res) => {
    try {
        const infoLoker = await infoLokerModel.findById(req.params.id);

        if (!infoLoker) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        // Hapus pengecekan untuk perusahaan
        if (req.user.role === "perusahaan" && infoLoker.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "Anda tidak memiliki izin untuk melihat lowongan ini" });
        }

        res.json(infoLoker);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Menambahkan info loker baru
export const createInfoLoker = async (req, res) => {
    try {
        if (req.user.role !== "perusahaan" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Hanya perusahaan atau admin yang dapat membuat lowongan kerja!" });
        }

        const { 
            judul, 
            perusahaan, 
            lokasi, 
            bidang, 
            jenis, 
            jenis_kelamin, 
            minimal_pendidikan, 
            riwayat_pengalaman, 
            link, 
            deskripsi, 
            persyaratan, 
            keterampilan, 
            gaji_min, 
            gaji_max 
        } = req.body;
        
        const newInfoLoker = new infoLokerModel({
            judul,
            perusahaan,
            lokasi,
            bidang,
            jenis,
            jenis_kelamin,
            minimal_pendidikan,
            riwayat_pengalaman,
            link,
            deskripsi,
            persyaratan,
            keterampilan,
            gaji_min: gaji_min || "Dirahasiakan",
            gaji_max: gaji_max || "Dirahasiakan",
            poster: req.files?.poster?.[0]?.filename || null,
            logo: req.files?.logo?.[0]?.filename || null,
            createdBy: req.user.role === "perusahaan" ? req.user._id : null,
        });

        const savedInfoLoker = await newInfoLoker.save();
        res.status(201).json(savedInfoLoker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateInfoLoker = async (req, res) => {
    try {
        const infoLoker = await infoLokerModel.findById(req.params.id);

        if (!infoLoker) {
            return res.status(404).json({ message: "Lowongan tidak ditemukan" });
        }

        // Hapus pengecekan untuk perusahaan
        if (req.user.role !== "admin" && req.user.id !== infoLoker.createdBy.toString()) {
            return res.status(403).json({ message: "Anda tidak memiliki izin untuk mengedit lowongan ini" });
        }        

        const updatedData = {
            ...req.body,
            poster: req.files?.poster?.[0]?.filename || req.body.poster,
            logo: req.files?.logo?.[0]?.filename || req.body.logo,
        };

        const updatedInfoLoker = await infoLokerModel.findByIdAndUpdate(req.params.id, updatedData, { new: true });

        res.status(200).json(updatedInfoLoker);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteInfoLoker = async (req, res) => {
    try {
        const infoLoker = await infoLokerModel.findById(req.params.id);

        if (!infoLoker) {
            return res.status(404).json({ message: "Lowongan tidak ditemukan" });
        }

        if (req.user.role === "admin" || (req.user.role === "perusahaan" && infoLoker.createdBy.toString() === req.user.id)) {
            await infoLokerModel.findByIdAndDelete(req.params.id);
            return res.status(200).json({ message: "Lowongan berhasil dihapus" });
        } 

        return res.status(403).json({ message: "Anda tidak memiliki izin untuk menghapus lowongan ini" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};