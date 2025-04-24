import mongoose from "mongoose";

const tracerStudySchema = new mongoose.Schema({
    nama_lengkap: { type: String, required: true },
    jenis_kelamin: { type: String, required: true },
    tanggal_lahir: { type: Date, required: true },
    kota_kelahiran: { type: String, required: true },
    agama: { type: String, required: true },
    alamat: { type: String, required: true },
    nisn: { type: String, required: true },
    nis: { type: String, required: true },
    tahun_lulus: { type: String, required: true },
    email: { type: String, required: true },
    handphone: { type: String, required: true },
    foto_alumni: {
        type: String,
        required: true,
        validate: {
            validator: function(v) {
                return /\.(jpg|jpeg|png|gif)$/i.test(v);
            },
            message: props => `${props.value} is not a valid file format! Only jpg, jpeg, png, gif formats are allowed.`
        }
    },
    jurusan: { type: String, required: true },
    status_anda: { type: String, required: true },

    nama_perusahaan: { type: String },
    posisi_jabatan: { type: String },

    nama_kampus: { type: String },
    jenjang_pendidikan: { type: String },
    program_studi: { type: String },
    
    instansi_abdi_negara: { type: String },
    // feedback smk
    kepuasan_materi: { type: String, required: true },
    kepuasan_fasilitas: { type: String, required: true },
    kepuasan_guru: { type: String, required: true },
    saran_smk: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Setuju', 'Tolak'],
        default: 'Pending'
    },
    alumniId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "user",
        default: null,
        validate: {
            validator: function(value) {
                if (this.createdByRole === "alumni" && !value) {
                    return false; 
                }
                return true;
            },
            message: "alumniId diperlukan jika dibuat oleh alumni."
        }
    }    
});

const tracerStudyModel = mongoose.model('tracer-study', tracerStudySchema);
export default tracerStudyModel;