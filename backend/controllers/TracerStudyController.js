import TracerStudyModel from "../models/TracerStudyModel.js";

// Validasi format foto
const isValidPhoto = (filename) => /\.(jpg|jpeg|png|gif)$/i.test(filename);

// Mendapatkan semua tracer study (hanya untuk admin)
export const getAllTracerStudy = async (req, res) => {
  try {
    const tracerStudy = await TracerStudyModel.find().populate(
      "alumniId",
      "name email"
    );
    res.json(tracerStudy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan data tracer study milik alumni yang sedang login
export const getMyTracerStudy = async (req, res) => {
  try {
    const tracerStudy = await TracerStudyModel.findOne({
      alumniId: req.user.id,
    });

    if (!tracerStudy)
      return res
        .status(404)
        .json({
          message: "Data tidak ditemukan, hanya alumni yang bisa melihat data.",
        });

    res.json(tracerStudy);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan detail tracer study berdasarkan ID (admin dan alumni)
export const getTracerStudyById = async (req, res) => {
  try {
    const tracerStudy = await TracerStudyModel.findById(req.params.id);
    if (!tracerStudy)
      return res.status(404).json({ message: "Data tidak ditemukan." });

    // Alumni hanya bisa melihat data miliknya sendiri
    if (
      req.user.role === "alumni" &&
      tracerStudy.alumniId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Akses ditolak." });
    }

    res.json(tracerStudy);
  } catch (error) {
    res.status(500).json({ message: "Kesalahan Server", error: error.message });
  }
};

// Menambahkan data tracer study baru
export const createTracerStudy = async (req, res) => {
  try {
    // Ambil ID alumni hanya jika user adalah alumni
    const IdAlumni = req.user.role === "alumni" ? req.user._id : null;

    // Jika user adalah alumni dan tidak memiliki ID, berikan error
    if (req.user.role === "alumni" && !IdAlumni) {
      return res.status(400).json({ message: "ID alumni diperlukan!" });
    }

    // Cek apakah alumni sudah memiliki Tracer Study (hanya untuk alumni)
    if (req.user.role === "alumni") {
      const existingTracerStudy = await TracerStudyModel.findOne({
        alumniId: IdAlumni,
      });

      if (existingTracerStudy) {
        return res
          .status(400)
          .json({ message: "Anda sudah membuat tracer study sebelumnya!" });
      }
    }

    // Validasi format foto jika ada
    let fotoAlumni = req.file ? req.file.filename : req.body.foto_alumni || "";
    if (req.file && !isValidPhoto(req.file.filename)) {
      return res.status(400).json({ message: "Format file foto tidak valid!" });
    }

    // Buat data Tracer Study baru
    const tracerStudy = new TracerStudyModel({
      ...req.body,
      alumniId: IdAlumni, // Bisa null jika admin yang membuatnya
      foto_alumni: fotoAlumni,
    });

    // Simpan ke database
    const insertedTracerStudy = await tracerStudy.save();
    res.status(201).json(insertedTracerStudy.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengupdate data tracer study berdasarkan ID (untuk Alumni dan Admin)
export const updateTracerStudy = async (req, res) => {
  try {
    let tracerStudy;

    if (req.user.role === "alumni") {
      tracerStudy = await TracerStudyModel.findOne({ alumniId: req.user._id });
    } else {
      tracerStudy = await TracerStudyModel.findById(req.params.id);
    }

    if (!tracerStudy) {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }

    if (
      req.user.role === "alumni" &&
      tracerStudy.alumniId &&
      tracerStudy.alumniId.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({
          message:
            "Akses ditolak. Anda hanya bisa mengedit data milik Anda sendiri.",
        });
    }

    if (!req.body.alumniId || req.body.alumniId === "null") {
      req.body.alumniId = null;
    }

    // Validasi format foto jika ada
    let fotoAlumni = req.file ? req.file.filename : tracerStudy.foto_alumni;
    if (req.file && !isValidPhoto(req.file.filename)) {
      return res.status(400).json({ message: "Format file foto tidak valid!" });
    }

    Object.keys(req.body).forEach((key) => {
      tracerStudy[key] = req.body[key] || tracerStudy[key];
    });
    tracerStudy.foto_alumni = fotoAlumni;

    const updatedTracerStudy = await tracerStudy.save();
    res.json(updatedTracerStudy.toObject());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mengubah status tracer study (hanya untuk admin)
export const updateTracerStudyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Setuju", "Tolak"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid!" });
    }

    const updatedData = await TracerStudyModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (updatedData) {
      res.json(updatedData);
    } else {
      res.status(404).json({ message: "Data tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus data tracer study (hanya untuk admin)
export const deleteTracerStudy = async (req, res) => {
  try {
    const deletedData = await TracerStudyModel.findByIdAndDelete(req.params.id);
    if (!deletedData)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
