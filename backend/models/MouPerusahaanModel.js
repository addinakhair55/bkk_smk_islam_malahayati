import mongoose from "mongoose";

const mouPerusahaanSchema = new mongoose.Schema({
    pihak_1: {
        nama_perusahaan: { type: String, required: true },
        alamat: { type: String, required: true },
        kontak_person: { type: String, required: true },
        telepon: { type: String, required: true },
        email: { type: String, required: true },
        nama: { type: String, required: true },
        jabatan: { type: String, required: true },
    },
    pihak_2: {
        nama_perusahaan: { type: String, required: true },
        alamat: { type: String, required: true },
        kontak_person: { type: String, required: true },
        telepon: { type: String, required: true },
        email: { type: String, required: true },
        nama: { type: String, required: true },
        jabatan: { type: String, required: true },
    },
    deskripsi_kerjasama: { type: String, required: true },
    tanggal_mulai: { type: Date, required: true },
    tanggal_berakhir: { type: Date, required: true },
    penanggung_jawab: {
        nama: { type: String, required: true },
        kontak: { type: String, required: true }
    },
    dokumen_mou: {
        type: String,
        required: [true, "Dokumen MoU wajib diunggah!"],
        validate: {
            validator: function(v) {
                return /\.(pdf|doc|docx)$/i.test(v);
            },
            message: props => `${props.value} is not a valid file format! Only pdf, doc, docx formats are allowed.`
        }
    },    
    status: {
        type: String,
        enum: ['Aktif', 'Tidak Aktif'],
        default: 'Aktif'
    },
}, { timestamps: true });

const mouPerusahaanModel = mongoose.model('mou-perusahaan', mouPerusahaanSchema);
export default mouPerusahaanModel;
