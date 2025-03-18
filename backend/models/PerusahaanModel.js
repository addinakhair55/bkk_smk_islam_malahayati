import mongoose from "mongoose";

const PerusahaanProfileSchema = new mongoose.Schema(
  {
    id_perusahaan: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    nama_perusahaan: { type: String, required: true },
    alamat: { type: String, required: true },
    deskripsi: { type: String },
    website: { type: String },
    logo: { type: String },
  },
  { timestamps: true }
);

const PerusahaanProfile = mongoose.model("perusahaan", PerusahaanProfileSchema);
export default PerusahaanProfile;
