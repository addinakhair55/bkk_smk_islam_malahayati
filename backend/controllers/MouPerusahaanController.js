import mouPerusahaanModel from "../models/MouPerusahaanModel.js";

// Fungsi untuk memvalidasi tipe file dokumen MOU
const isValidFile = (filename) => /\.(pdf)$/i.test(filename);

// Mendapatkan semua data MOU perusahaan
export const getMouPerusahaan = async (req, res) => {
  try {
    const mouPerusahaan = await mouPerusahaanModel.find();
    res.json(mouPerusahaan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mendapatkan data MOU perusahaan berdasarkan ID
export const getMouPerusahaanById = async (req, res) => {
  try {
    const mouPerusahaan = await mouPerusahaanModel.findById(req.params.id);
    if (mouPerusahaan) {
      res.json(mouPerusahaan);
    } else {
      res.status(404).json({ message: "Data tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Membuat data MOU perusahaan baru
export const createMouPerusahaan = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Dokumen MoU wajib diunggah!" });
  }

  if (!isValidFile(req.file.filename)) {
    return res.status(400).json({ message: "Format file MoU tidak valid!" });
  }

  try {
    const mouPerusahaan = new mouPerusahaanModel({
      pihak_1: req.body.pihak_1,
      pihak_2: req.body.pihak_2,
      deskripsi_kerjasama: req.body.deskripsi_kerjasama,
      tanggal_mulai: req.body.tanggal_mulai,
      tanggal_berakhir: req.body.tanggal_berakhir,
      penanggung_jawab: req.body.penanggung_jawab,
      dokumen_mou: req.file.filename,
      status: req.body.status || "Aktif"
    });

    const insertedMou = await mouPerusahaan.save();
    res.status(201).json(insertedMou);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Memperbarui data MOU perusahaan berdasarkan ID
export const updateMouPerusahaan = async (req, res) => {
  try {
    const existingMou = await mouPerusahaanModel.findById(req.params.id);
    if (!existingMou) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    let dokumenMou = existingMou.dokumen_mou;
    if (req.file?.filename) {
      if (!isValidFile(req.file.filename)) {
        return res.status(400).json({ message: "Format file MoU tidak valid!" });
      }
      dokumenMou = req.file.filename;
    }

    const parseJson = (data) => {
      try {
        return typeof data === "string" ? JSON.parse(data) : data || {};
      } catch {
        return {};
      }
    };

    const parsedPihak1 = parseJson(req.body.pihak_1);
    const parsedPihak2 = parseJson(req.body.pihak_2);
    const parsedPenanggungJawab = parseJson(req.body.penanggung_jawab);

    const updatedData = {
      $set: {
        "pihak_1": { ...existingMou.pihak_1, ...parsedPihak1 },
        "pihak_2": { ...existingMou.pihak_2, ...parsedPihak2 },
        "penanggung_jawab": { ...existingMou.penanggung_jawab, ...parsedPenanggungJawab },
        "deskripsi_kerjasama": req.body.deskripsi_kerjasama ?? existingMou.deskripsi_kerjasama,
        "tanggal_mulai": req.body.tanggal_mulai ? new Date(req.body.tanggal_mulai) : existingMou.tanggal_mulai,
        "tanggal_berakhir": req.body.tanggal_berakhir ? new Date(req.body.tanggal_berakhir) : existingMou.tanggal_berakhir,
        "dokumen_mou": dokumenMou,
        "status": req.body.status ?? existingMou.status
      }
    };

    const updatedMou = await mouPerusahaanModel.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    res.status(200).json(updatedMou);
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui data MoU", error: error.message });
  }
};

// Update status MOU perusahaan
export const updateMouPerusahaanStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Aktif", "Tidak Aktif"].includes(status)) {
      return res.status(400).json({ message: "Status tidak valid!" });
    }

    const updateMou = await mouPerusahaanModel.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (updateMou) {
      res.status(200).json;
    } else {
      res.status(404).json({ message: "Data tidak ditemukan" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Menghapus data MOU perusahaan berdasarkan ID
export const deleteMouPerusahaan = async (req, res) => {
  try {
    const deleteResult = await mouPerusahaanModel.deleteOne({
      _id: req.params.id,
    });
    res.status(deleteResult.deletedCount ? 200 : 404).json({
      message: deleteResult.deletedCount
        ? "Data berhasil dihapus"
        : "Data tidak ditemukan",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
