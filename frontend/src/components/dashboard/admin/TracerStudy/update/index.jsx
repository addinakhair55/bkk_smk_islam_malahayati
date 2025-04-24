import { useState, useEffect, useRef } from "react";
import { Alert, Button, CloseButton, Col, Form, Modal, Row, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import PageContainer from "src/components/container/PageContainer";
import { CircularProgress } from "@mui/material";
import DashboardCard from "../../../../shared/DashboardCard";
import { useDispatch, useSelector } from "react-redux";
import { updateTracerStudy } from "../../../../redux/slice/tracerStudySlice";
import axios from "axios";
import { FaExclamationCircle, FaPlus, FaSave, FaTimes } from "react-icons/fa";
import Cropper from "cropperjs";
import "cropperjs/dist/cropper.css";
import { FiAlertTriangle } from "react-icons/fi";

export default function UpdateTracerStudy() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data, loading, error } = useSelector(state => state.tracerStudy);
    const [preview, setPreview] = useState("");

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [imageSrc, setImageSrc] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const cropperRef = useRef(null);
    const imageRef = useRef(null);

    const [alertMessage, setAlertMessage] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [formData, setFormData] = useState({
        nama_lengkap: "", jenis_kelamin: "", tanggal_lahir: "", kota_kelahiran: "", agama: "",
        alamat: "", nisn: "", nis: "", tahun_lulus: "", email: "", handphone: "", jurusan: "",
        status_anda: "", nama_perusahaan: "", posisi_jabatan: "", nama_kampus: "", jenjang_pendidikan:"", program_studi: "",
        instansi_abdi_negara:"", kepuasan_materi: "", kepuasan_fasilitas: "", kepuasan_guru: "", saran_smk: "", foto_alumni: null,
        status: "Pending",
    });

    const formFields = [
        { id: "nisn", label: "NISN (Nomor Induk Siswa Nasional)", type: "text" },
        { id: "nis", label: "NIS (Nomor Induk Siswa)", type: "text" },
        { id: "nama_lengkap", label: "Nama Lengkap", type: "text" },
        { id: "jenis_kelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-laki", "Perempuan"] },
        { id: "kota_kelahiran", label: "Kota Kelahiran", type: "text" },
        { id: "tanggal_lahir", label: "Tanggal Lahir", type: "date" },
        { id: "agama", label: "Agama", type: "select", options: ["Islam", "Kristen Protestan", "Kristen Katolik", "Hindu", "Buddha", "Konghucu", "Lainnya"] },
        { id: "tahun_lulus", label: "Tahun Lulus", type: "text" },
        { id: "email", label: "Email", type: "email" },
        { id: "jurusan", label: "Jurusan", type: "select", options: ["Teknik Komputer dan Jaringan (TKJ)", "Akuntansi (AK)", "Administrasi Perkantoran (AP)"] },
        { id: "handphone", label: "Handphone", type: "text" },
        { id: "alamat", label: "Alamat Tempat Tinggal", type: "textarea" },
    ];

    const feedbackFields = [
        { id: "kepuasan_materi", label: "1. Berikan kepuasan Anda terhadap materi yang dipelajari di SMK Islam Malahayati?", type: "radio", options: ["Sangat Puas", "Puas", "Cukup Puas", "Kurang Puas", "Tidak Puas"] },
        { id: "kepuasan_fasilitas", label: "2. Berikan kepuasan Anda terhadap fasilitas (laboratorium, alat praktik, dll.) yang disediakan oleh SMK Islam Malahayati?", type: "radio", options: ["Sangat Puas", "Puas", "Cukup Puas", "Kurang Puas", "Tidak Puas"] },
        { id: "kepuasan_guru", label: "3. Berikan kepuasan Anda terhadap kualitas guru di SMK Islam Malahayati?", type: "radio", options: ["Sangat Puas", "Puas", "Cukup Puas", "Kurang Puas", "Tidak Puas"] },
        { id: "saran_smk", label: "4. Berikan saran Anda untuk meningkatkan kualitas keseluruhan di SMK Islam Malahayati.", type: "textarea" },
    ];

    useEffect(() => {
        const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
            alert("Token tidak ditemukan. Harap login ulang.");
            return;
            }
            
            const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            };

            const response = await axios.get(`http://localhost:5000/tracer-study/${id}`, config);
            const data = response.data;

            const formattedDate = new Date(data.tanggal_lahir).toISOString().split("T")[0];

            setFormData({
            ...data,
            tanggal_lahir: formattedDate
            });

            setPreview(`http://localhost:5000/uploads/${data.foto_alumni}`);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Gagal memuat data, silakan coba lagi.");
        }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (data) {
        setFormData(data);
        }
    }, [data]);

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    const handleChange = ({ target: { name, value, files } }) => {
        if (name === "foto_alumni" && files[0]) {
        const file = files[0];
        const validFormats = ["image/png", "image/jpeg", "image/jpg"];

        if (!validFormats.includes(file.type)) {
            setErrors((prevErrors) => ({
            ...prevErrors,
            foto_alumni: "Format file harus PNG, JPG, atau JPEG",
            }));
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            setImageSrc(e.target.result);
            setPreview(e.target.result);
            setShowCropModal(true);
        };
        reader.readAsDataURL(file);
        } else {
            if (name === "nisn" || name === "nis") {
                if (!/^\d*$/.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: "Format harus angka!",
                    }));
                    return;
                }
                if (value.length > 10) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: "Maksimal 10 angka!",
                    }));
                    return;
                }
            }
            
            if (name === "tahun_lulus") {
                if (!/^\d*$/.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: "Format harus angka!",
                    }));
                    return;
                }
            }
    
            if (name === "handphone") {
                if (!/^\d*$/.test(value)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [name]: "Nomor handphone harus berupa angka!",
                    }));
                    return;
                }
            }
            
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: value.trim() ? "" : "Wajib diisi",
            }));
        }
    };

    const handleCrop = () => {
        if (cropperRef.current) {
            const canvas = cropperRef.current.getCroppedCanvas({
            width: 400,
            height: 600,
            });

            canvas.toBlob((blob) => {
            const croppedFile = new File([blob], "foto_alumni.jpg", { type: "image/jpeg" });
            setFormData((prevState) => ({
                ...prevState,
                foto_alumni: croppedFile,
            }));
            const previewUrl = URL.createObjectURL(blob);
            setPreview(previewUrl);
            setShowCropModal(false);
            }, "image/jpeg");
        }
    };

    const initializeCropper = () => {
        if (imageRef.current) {
            if (cropperRef.current) {
                cropperRef.current.destroy();
                cropperRef.current = null;
            }

            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: 2 / 3,
                viewMode: 1,
                autoCropArea: 0.8,
                movable: true,
                zoomable: true,
                scalable: true,
                cropBoxResizable: true,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = {};

            formFields.forEach(({ id }) => {
                if (!formData[id]) {
                    newErrors[id] = "Wajib diisi";
                }
            });

            feedbackFields.forEach(({ id }) => {
                if (!formData[id]) {
                    newErrors[id] = "Wajib diisi";
                }
            });

            if (!formData.status_anda) {
                newErrors.status_anda = "Wajib diisi";
            }

            if (formData.status_anda === "Bekerja") {
                if (!formData.nama_perusahaan) newErrors.nama_perusahaan = "Wajib diisi!";
                if (!formData.posisi_jabatan) newErrors.posisi_jabatan = "Wajib diisi!";
            } else if (formData.status_anda === "Melanjutkan Pendidikan") {
                if (!formData.nama_kampus) newErrors.nama_kampus = "Wajib diisi!";
                if (!formData.program_studi) newErrors.program_studi = "Wajib diisi!";
                if (!formData.jenjang_pendidikan) newErrors.jenjang_pendidikan = "Wajib diisi!";
            } else if (formData.status_anda === "Abdi Negara") {
                if (!formData.instansi_abdi_negara) newErrors.instansi_abdi_negara = "Wajib diisi!";
            }

            if (!formData.foto_alumni && !data?.foto_alumni) {
                newErrors.foto_alumni = "Foto wajib diunggah";
            }

            setErrors(newErrors);

            if (Object.keys(newErrors).length > 0) {
                setAlertMessage("Formulir belum lengkap. Mohon pastikan semua kolom wajib sudah terisi dengan benar!");
                return;
            }
        setShowConfirmModal(true);
    };

    const confirmSubmit = async () => {
        const updatedData = new FormData();
        Object.keys(formData).forEach((key) => {
        if (key !== "foto_alumni" || formData[key] || !data?.foto_alumni) {
            if (formData[key] !== null) {
                updatedData.append(key, formData[key]);
            }
        }
        });

        try {
        await dispatch(updateTracerStudy({ id, updatedData })).unwrap();
        setToastMessage({ type: "success", message: "Tracer study berhasil diperbarui!" });
        setShowToast(true);
        setTimeout(() => navigate("/tracerStudy"), 3000);
        } catch (error) {
        setToastMessage({ type: "danger", message: "Gagal mengubah data Tracer Study. Silakan coba lagi." });
        setShowToast(true);
        } finally {
        setIsSubmitting(false);
        setShowConfirmModal(false)
        }
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }
      
    if (error) {
        return (
            <div className="d-flex justify-content-center">
                <Alert
                    variant="white"
                    className="mb-4 fw-bold align-items-center"
                    style={{
                        background: "linear-gradient(50deg, #ffdfdf, #ffffff)",
                        color: "#062707",
                        borderLeft: "6px solid #FF463F",
                        borderRight: "none",
                        padding: "1.3rem", 
                        borderRadius: "10px 0 0 10px",
                    }}
                >
                    <FaExclamationCircle style={{ color: "#FF463F", fontSize: "1.2rem" }} className="mx-2"/>
                    Gagal memuat data: {error}
                </Alert>
            </div>
        );
    }

    return (
        <PageContainer title="Edit Tracer Study">
            <ToastContainer position="top-end" className="p-3 mt-5">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMessage.type}>
                    <Toast.Body className="d-flex align-items-center gap-2 text-white">
                    {toastMessage.type === "success" && <i className="bi bi-check-circle-fill text-white fs-6"></i>}
                    {toastMessage.type === "danger" && <i className="bi bi-x-circle-fill text-white fs-6"></i>}
                    {toastMessage.type === "warning" && <i className="bi bi-exclamation-triangle-fill text-white fs-6"></i>}
                    <strong>{toastMessage.message}</strong>
                    </Toast.Body>
                </Toast>
            </ToastContainer>

            {alertMessage && (
                <Alert
                    variant="danger"
                    className="mb-4 fw-bold align-items-center"
                    style={{
                        background: "linear-gradient(50deg, #ffdfdf, #ffffff)",
                        color: "#062707",
                        borderLeft: "6px solid #FF463F",
                        borderRight: "none",
                        padding: "1.3rem",
                        borderRadius: "10px 0 0 10px",
                    }}
                >
                    <FaExclamationCircle style={{ color: "#FF463F", fontSize: "1.2rem" }} className="mx-2" />
                    {alertMessage}
                </Alert>
            )}

            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link 
                        to="/tracerStudy" 
                        className="d-flex align-items-center text-decoration-none"
                        style={{ 
                            color: "#4065B6", 
                            textDecoration: "none",
                            transition: "color 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "#3050A5"}
                        onMouseLeave={(e) => e.target.style.color = "#4065B6"}
                        onMouseDown={(e) => e.target.style.color = "red"}
                        onMouseUp={(e) => e.target.style.color = "#3050A5"}
                    >
                        <span className="fw-medium">Tracer Study</span>
                    </Link>
                </li>
                <li className="breadcrumb-item active text-secondary" aria-current="page">
                    Edit
                </li>
                </ol>
            </nav>

            <div className="row mb-4 align-items-center">
                <div className="col-12 col-md-6">
                    <h4 className="fw-bold mb-0">Edit Tracer Study</h4>
                </div>
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="d-flex flex-column flex-md-row justify-content-end gap-2">
                        <Button
                            type="submit"
                            className="fw-bold d-flex align-items-center justify-content-center gap-2"
                            style={{
                                backgroundColor: "#4065B6",
                                border: "none",
                                transition: "background-color 0.2s ease-in-out",
                            }}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#3050A5";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#4065B6";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={20} color="inherit" />
                            ) : (
                                <>
                                    <FaSave size="clamp(14px, 2vw, 16px)" /> Simpan Perubahan
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline-secondary"
                            className="fw-bold d-flex align-items-center justify-content-center gap-2"
                            style={{
                                color: "#939393",
                                backgroundColor: "#ffffff",
                                border: "2px solid #939393",
                                transition: "all 0.2s ease-in-out",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#6c757d";
                                e.target.style.color = "white";
                                e.target.style.border = "2px solid #6c757d";
                                e.currentTarget.style.transform = "scale(1.05)"

                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "white";
                                e.target.style.color = "#939393";
                                e.target.style.border = "2px solid #939393";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            type="button"
                            onClick={() => navigate("/tracerStudy")}
                        >
                            <FaTimes size="clamp(14px, 2vw, 16px)" /> Batal
                        </Button>
                    </div>
                </div>
            </div>

            <DashboardCard>
                {loading ? <CircularProgress /> : (
                    <Form>
                        <h5 className="mb-3 fw-bold text-secondary">A. Informasi Pribadi</h5>
                        <div className="card shadow-sm border-0 p-3">
                        <Row>
                            <Col md={12} className="d-flex justify-content-center mb-4">
                                <Form.Group id="foto_alumni" className="mb-3 text-center">
                                    {(() => {
                                        const errorMessage = errors.foto_alumni;
                                        const borderColor = errorMessage ? "red" : formData.foto_alumni || data?.foto_alumni ? "green" : "gray";

                                        return (
                                        <>
                                            <Form.Label className="text-uppercase text-secondary">Pas Foto Formal</Form.Label>
                                            <div
                                                className="position-relative d-flex align-items-center justify-content-center"
                                                style={{
                                                    border: `2px dashed ${borderColor}`,
                                                    borderRadius: "10px",
                                                    width: "130px",
                                                    height: "180px",
                                                    cursor: "pointer",
                                                    overflow: "hidden",
                                                    backgroundColor: "#f8f9fa",
                                                    position: "relative",
                                                }}
                                                onClick={() => document.getElementById("fileInputAlumni").click()}
                                            >
                                            {preview || formData?.foto_alumni ? (
                                                <>
                                                <img
                                                    src={preview || `http://localhost:5000/uploads/${formData.foto_alumni}`}
                                                    alt="Foto Alumni"
                                                    className="w-100 h-100 object-fit-cover"
                                                />
                                                <div
                                                    className="position-absolute top-50 start-50 translate-middle text-white fw-bold bg-dark bg-opacity-50 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                                                    style={{ fontSize: "12px", zIndex: 2 }}
                                                >
                                                    <FaPlus size={20} />
                                                    <small>Ubah Foto</small>
                                                </div>
                                                </>
                                            ) : (
                                                <div
                                                    className="position-absolute top-50 start-50 translate-middle text-white fw-bold bg-dark bg-opacity-50 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                                                    style={{ fontSize: "12px" }}
                                                >
                                                    <FaPlus size={20} />
                                                    <small>Upload Foto</small>
                                                </div>
                                            )}

                                            <input
                                                type="file"
                                                id="fileInputAlumni"
                                                name="foto_alumni"
                                                onChange={handleChange}
                                                accept=".png, .jpg, .jpeg"
                                                className="d-none"
                                                required={!formData?.foto_alumni}
                                            />
                                            </div>
                                            {errorMessage && <small className="text-danger">{errorMessage}</small>}
                                        </>
                                        );
                                    })()}
                                </Form.Group>
                            </Col>

                            {formFields.map(({ id, label, type, options }) => {
                                const errorMessage = errors[id];
                                const borderColor = errorMessage ? "red" : formData[id] ? "green" : "gray";
                                return (
                                    <Col md={6} key={id}>
                                        <Form.Group controlId={id} className="mb-4">
                                            <Form.Label className="text-uppercase text-secondary">{label}</Form.Label>
                                            {type === "select" ? (
                                                <Form.Select name={id} value={formData[id]} onChange={handleChange} style={{ borderColor }} isInvalid={!!errors[id]} required>
                                                    <option value="" disabled className="text-secondary">Pilih {label}</option>
                                                    {options.map(option => (
                                                        <option key={option} value={option}>{option}</option>
                                                    ))}
                                                </Form.Select>
                                            ) : type === "textarea" ? (
                                                <Form.Control 
                                                    as="textarea" 
                                                    name={id} 
                                                    value={formData[id]} 
                                                    onChange={handleChange} 
                                                    isInvalid={!!errors[id]}
                                                    isValid={formData[id] && !errors[id]}
                                                    rows={3} 
                                                    required 
                                                    style={{ borderColor }}
                                                />
                                            ) : (
                                                <Form.Control 
                                                    type={type} 
                                                    name={id} 
                                                    value={formData[id]} 
                                                    onChange={handleChange} 
                                                    isInvalid={!!errors[id]}
                                                    isValid={formData[id] && !errors[id]}
                                                    required 
                                                    style={{ borderColor }}
                                                />
                                            )}
                                            <Form.Control.Feedback type="invalid">
                                                {errors[id]}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                );
                            })}
                        </Row>
                        </div>

                        <Modal show={showCropModal} onHide={() => setShowCropModal(false)} centered backdrop="static">
                            <Modal.Header closeButton className="border-0">
                                <Modal.Title className="fw-bold text-primary">Crop Foto</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-center">
                                <div className="d-flex justify-content-center align-items-center bg-light rounded p-3" style={{ maxHeight: "400px", overflow: "hidden" }}>
                                    {imageSrc ? (
                                        <img
                                        ref={imageRef}
                                        src={imageSrc}
                                        alt="Crop preview"
                                        className="img-fluid rounded shadow-sm"
                                        onLoad={initializeCropper}
                                        />
                                    ) : (
                                        <div className="text-center">
                                        <div className="spinner-border text-primary" role="status"></div>
                                        <p className="mt-2 text-muted">Memuat gambar...</p>
                                        </div>
                                    )}
                                </div>
                            </Modal.Body>
                            <Modal.Footer className="border-0 d-flex justify-content-center">
                                <Button variant="outline-danger" onClick={() => setShowCropModal(false)} className="fw-bold px-4">
                                <FaTimes /> Batal
                                </Button>
                                <Button variant="success" onClick={handleCrop} className="fw-bold px-4">
                                <FaSave /> Crop & Simpan
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <h5 className="mb-3 mt-4 fw-bold text-secondary">B. Aktivitas Setelah Lulus</h5>
                        <div className="card shadow-sm border-0 p-3">
                            <Row>
                                <Form.Group controlId="status_anda" className="mb-3">
                                    <Form.Label className="text-uppercase text-secondary">
                                        Apa aktivitas Anda saat ini?
                                    </Form.Label>
                                    <Form.Select
                                        name="status_anda"
                                        value={formData.status_anda}
                                        onChange={handleChange}
                                        style={{
                                            borderColor: errors.status_anda ? "red" : formData.status_anda ? "green" : "gray",
                                        }}
                                        isInvalid={!!errors.status_anda}
                                        isValid={formData.status_anda && !errors.status_anda}
                                        required
                                    >
                                        <option value="">Pilih</option>
                                        {["Bekerja", "Melanjutkan Pendidikan", "Abdi Negara", "Tidak bekerja dan tidak melanjutkan pendidikan", "Wirausaha"].map(option => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.status_anda}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>

                            {formData.status_anda === "Bekerja" && (
                                <Row className="g-3 mb-3">
                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="nama_perusahaan">
                                            <Form.Label className="text-uppercase text-secondary">Nama Perusahaan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nama_perusahaan"
                                                value={formData.nama_perusahaan}
                                                onChange={handleChange}
                                                style={{
                                                    borderColor: errors.nama_perusahaan ? "red" : formData.nama_perusahaan ? "green" : "gray",
                                                }}
                                                isInvalid={!!errors.nama_perusahaan}
                                                isValid={formData.nama_perusahaan && !errors.nama_perusahaan}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.nama_perusahaan}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="posisi_jabatan">
                                            <Form.Label className="text-uppercase text-secondary">Posisi/Jabatan</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="posisi_jabatan"
                                                value={formData.posisi_jabatan}
                                                onChange={handleChange}
                                                style={{
                                                    borderColor: errors.posisi_jabatan ? "red" : formData.posisi_jabatan ? "green" : "gray",
                                                }}
                                                isInvalid={!!errors.posisi_jabatan}
                                                isValid={formData.posisi_jabatan && !errors.posisi_jabatan}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.posisi_jabatan}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}

                            {formData.status_anda === "Melanjutkan Pendidikan" && (
                                <Row className="g-3 mb-3">
                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="jenjang_pendidikan">
                                            <Form.Label className="text-uppercase text-secondary">Jenjang Pendidikan</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="jenjang_pendidikan"
                                                value={formData.jenjang_pendidikan}
                                                onChange={handleChange}
                                                style={{
                                                    borderColor: errors.jenjang_pendidikan ? "red" : formData.jenjang_pendidikan ? "green" : "gray",
                                                }}
                                                isInvalid={!!errors.jenjang_pendidikan}
                                                isValid={formData.jenjang_pendidikan && !errors.jenjang_pendidikan}
                                                required
                                            >
                                                <option value="">Pilih Jenjang Pendidikan</option>
                                                <option value="D3/D4">D3/D4</option>
                                                <option value="S1">S1</option>
                                                <option value="S2">S2</option>
                                                <option value="S3">S3</option>
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.jenjang_pendidikan}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="nama_kampus">
                                            <Form.Label className="text-uppercase text-secondary">Nama Kampus</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="nama_kampus"
                                                value={formData.nama_kampus}
                                                onChange={handleChange}
                                                style={{
                                                    borderColor: errors.nama_kampus ? "red" : formData.nama_kampus ? "green" : "gray",
                                                }}
                                                isInvalid={!!errors.nama_kampus}
                                                isValid={formData.nama_kampus && !errors.nama_kampus}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.nama_kampus}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <Form.Group controlId="program_studi">
                                            <Form.Label className="text-uppercase text-secondary">Program Studi</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="program_studi"
                                                value={formData.program_studi}
                                                onChange={handleChange}
                                                style={{
                                                    borderColor: errors.program_studi ? "red" : formData.program_studi ? "green" : "gray",
                                                }}
                                                isInvalid={!!errors.program_studi}
                                                isValid={formData.program_studi && !errors.program_studi}
                                                required
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.program_studi}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                            {formData.status_anda === "Abdi Negara" && (
                                <Row className="g-3 mb-3">
                                    <Col xs={12} md={12}>
                                        <Form.Group controlId="instansi_abdi_negara">
                                            <Form.Label className="text-uppercase text-secondary">Instansi Abdi Negara</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="instansi_abdi_negara"
                                                value={formData.instansi_abdi_negara}
                                                onChange={handleChange}
                                                style={{
                                                    borderColor: errors.instansi_abdi_negara ? "red" : formData.instansi_abdi_negara ? "green" : "gray",
                                                }}
                                                isInvalid={!!errors.instansi_abdi_negara}
                                                isValid={formData.instansi_abdi_negara && !errors.instansi_abdi_negara}
                                                required
                                            >
                                                <option value="">Pilih Instansi</option>
                                                <option value="PNS">Pegawai Negeri Sipil (PNS)</option>
                                                <option value="TNI">Tentara Nasional Indonesia (TNI)</option>
                                                <option value="Polri">Kepolisian Republik Indonesia (Polri)</option>
                                                <option value="Lainnya">Lainnya</option>
                                            </Form.Control>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.instansi_abdi_negara}
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                </Row>
                            )}
                        </div>

                        <h5 className="mb-3 mt-4 fw-bold text-secondary">C. Feedback untuk SMK Islam Malahayati</h5>
                        <div className="card shadow-sm border-0 p-3">
                            <Row>
                                {feedbackFields.map(({ id, label, type, options }) => (
                                    <Col md={12} key={id}>
                                        <Form.Group controlId={id} className="mb-3">
                                            <Form.Label className="text-uppercase text-secondary">{label}</Form.Label>
                                            {type === "radio" ? (
                                                options.map((option) => (
                                                    <Form.Check
                                                        type="radio"
                                                        name={id}
                                                        value={option}
                                                        label={option}
                                                        key={option}
                                                        onChange={handleChange}
                                                        checked={formData[id] === option}
                                                        className="mx-3"
                                                        isInvalid={!!errors[id]}
                                                        isValid={formData[id] && !errors[id]}
                                                        required
                                                    />
                                                ))
                                            ) : (
                                                <Form.Control
                                                    as="textarea"
                                                    name={id}
                                                    value={formData[id]}
                                                    onChange={handleChange}
                                                    rows={3}
                                                    className="form-control"
                                                    style={{
                                                        borderColor: errors[id] ? "red" : formData[id] ? "green" : "gray",
                                                    }}
                                                    isInvalid={!!errors[id]}
                                                    isValid={formData[id] && !errors[id]}
                                                    required
                                                />
                                            )}
                                            <Form.Control.Feedback type="invalid">
                                                    {errors[id]}
                                                </Form.Control.Feedback>
                                        </Form.Group>
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </Form>
                )}
            </DashboardCard>
            
            <Modal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                centered
                aria-labelledby="confirm-modal-title"
            >
                <div className="p-0 m-0 w-100" style={{ maxWidth: "500px" }}>
                    <Modal.Body className="d-flex flex-column align-items-center text-center pb-0">
                        <FiAlertTriangle
                            className="mb-3 rounded p-2"
                            style={{
                                fontSize: "clamp(3rem, 6vw, 3rem)",
                                color: "#ff9807",
                                backgroundColor: "#faecd6",
                            }}
                        />
                        <CloseButton
                            className="position-absolute top-0 end-0 m-2"
                            onClick={() => setShowConfirmModal(false)}
                            aria-label="Tutup modal"
                        />
                        <h5 className="fw-bold" style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)" }}>
                            Apakah Anda yakin?
                        </h5>
                        <p className="text-muted" style={{ fontSize: "clamp(0.875rem, 3vw, 1rem)" }}>
                            Apakah Anda yakin ingin mengubah tracer study ini?
                        </p>
                    </Modal.Body>
                    <Modal.Footer className="border-0 d-flex justify-content-center w-100 pt-0">
                        <div className="row w-100 g-2">
                            <div className="col-12 col-md-6">
                                <Button
                                    variant="outline-secondary"
                                    onClick={() => setShowConfirmModal(false)}
                                    className="fw-bold py-2 rounded-pill shadow-sm w-100"
                                    style={{
                                        color: "#a0a0a0",
                                        backgroundColor: "white",
                                        border: "2px solid #a0a0a0",
                                        transition: "all 0.2s ease-in-out",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#6c757d";
                                        e.target.style.color = "white";
                                        e.target.style.border = "2px solid #6c757d";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "white";
                                        e.target.style.color = "#a0a0a0";
                                        e.target.style.border = "2px solid #a0a0a0";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                >
                                    Batal
                                </Button>
                            </div>
                            <div className="col-12 col-md-6">
                                <Button
                                    onClick={confirmSubmit}
                                    className="fw-bold py-2 rounded-pill shadow-sm w-100 border-0"
                                    disabled={isSubmitting}
                                    style={{
                                        color: "#ffffff",
                                        backgroundColor: "#3083ff",
                                        transition: "all 0.2s ease-in-out",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#3083ff";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "#3083ff";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={16} color="inherit" />
                                    ) : (
                                        <>Ya, Simpan</>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </Modal.Footer>
                </div>
            </Modal>
        </PageContainer>
    );
}