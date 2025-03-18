import mongoose from "mongoose";

const infoLokerSchema = new mongoose.Schema({
    judul: { type: String, required: true },
    perusahaan: { type: String, required: true },
    lokasi: { type: String, required: true },
    bidang: { type: String, required: true },
    jenis: { type: String, required: true },
    jenis_kelamin: { type: String, required: true },
    minimal_pendidikan: { type: String, required: true },
    riwayat_pengalaman: { type: String, required: true },
    deskripsi: { type: String, required: true },
    persyaratan: { type: [String], required: true },
    keterampilan: { type: [String], required: true },
    gaji_min: { type: String, default: "Dirahasiakan" },
    gaji_max: { type: String, default: "Dirahasiakan" },
    poster: { type: String, required: false },
    logo: { type: String, required: false },
    link: { type: String, required: false },
    tanggalDibuat: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: false }
});

export default mongoose.model("info-lowongan-kerja", infoLokerSchema);
