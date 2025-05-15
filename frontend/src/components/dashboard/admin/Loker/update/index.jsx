import PageContainer from "src/components/container/PageContainer";
import { CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { Button, CloseButton, Col, Form, Modal, OverlayTrigger, Row, Spinner, Toast, ToastContainer, Tooltip, Alert} from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchInfoLokerById, updateInfoLoker } from "../../../../redux/slice/infoLokerSlice";
import ReactQuill from "react-quill";
import DashboardCard from "../../../../shared/DashboardCard";
import { FaExclamationCircle, FaSave, FaTimes, FaTrash } from "react-icons/fa";
import Cropper from "cropperjs";
import { FiAlertTriangle } from "react-icons/fi";
import defaultLogo from "../../../../../assets/images/logos/default-logo.png";

// Base URL dari server backend
const BASE_URL = "http://localhost:5000/uploads/";

export default function EditInfoLoker() {
    const { id } = useParams();
    const initialFormState = {
        judul: "", perusahaan: "", lokasi: "", bidang: "", jenis: "",
        jenis_kelamin: "", minimal_pendidikan: "", riwayat_pengalaman: "",
        link: "", deskripsi: "", persyaratan: "", keterampilan: "",
        gaji_min: "", gaji_max: "", poster: null, logo: null
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: "", message: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGajiSecret, setIsGajiSecret] = useState(false);

    const [alertMessage, setAlertMessage] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, infoLoker } = useSelector((state) => state.infoLoker);

    const [showCropModal, setShowCropModal] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const cropperRef = useRef(null);
    const imageRef = useRef(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const posterInputRef = useRef(null);
    const [posterKey, setPosterKey] = useState(Date.now());

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    useEffect(() => {
        if (id) {
            dispatch(fetchInfoLokerById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (Array.isArray(infoLoker) && infoLoker.length > 0) {
            const foundLoker = infoLoker.find(loker => String(loker.id) === String(id));
            if (foundLoker) {
                setFormData({
                    judul: foundLoker.judul || "",
                    perusahaan: foundLoker.perusahaan || "",
                    lokasi: foundLoker.lokasi || "",
                    bidang: foundLoker.bidang || "",
                    jenis: foundLoker.jenis || "",
                    jenis_kelamin: foundLoker.jenis_kelamin || "",
                    minimal_pendidikan: foundLoker.minimal_pendidikan || "",
                    riwayat_pengalaman: foundLoker.riwayat_pengalaman || "",
                    link: foundLoker.link || "",
                    deskripsi: foundLoker.deskripsi || "",
                    persyaratan: Array.isArray(foundLoker.persyaratan) ? foundLoker.persyaratan.join(", ") : "",
                    keterampilan: Array.isArray(foundLoker.keterampilan) ? foundLoker.keterampilan.join(", ") : "",
                    gaji_min: foundLoker.gaji_min || "",
                    gaji_max: foundLoker.gaji_max || "",
                    poster: foundLoker.poster || null,
                    logo: infoLoker.logo ? `${BASE_URL}${infoLoker.logo}` : null
                });
                setIsGajiSecret(foundLoker.gaji_min === "Dirahasiakan" && foundLoker.gaji_max === "Dirahasiakan");
            }
        } else if (typeof infoLoker === "object" && infoLoker !== null) {
            setFormData({
                judul: infoLoker.judul || "",
                perusahaan: infoLoker.perusahaan || "",
                lokasi: infoLoker.lokasi || "",
                bidang: infoLoker.bidang || "",
                jenis: infoLoker.jenis || "",
                jenis_kelamin: infoLoker.jenis_kelamin || "",
                minimal_pendidikan: infoLoker.minimal_pendidikan || "",
                riwayat_pengalaman: infoLoker.riwayat_pengalaman || "",
                link: infoLoker.link || "",
                deskripsi: infoLoker.deskripsi || "",
                persyaratan: Array.isArray(infoLoker.persyaratan) ? infoLoker.persyaratan.join(", ") : "",
                keterampilan: Array.isArray(infoLoker.keterampilan) ? infoLoker.keterampilan.join(", ") : "",
                gaji_min: infoLoker.gaji_min || "",
                gaji_max: infoLoker.gaji_max || "",
                poster: infoLoker.poster || null,
                logo: infoLoker.logo ? `${BASE_URL}${infoLoker.logo}` : null
            });
            setIsGajiSecret(infoLoker.gaji_min === "Dirahasiakan" && infoLoker.gaji_max === "Dirahasiakan");
        }
    }, [infoLoker, id]);

    useEffect(() => {
        return () => {
            if (formData.poster instanceof File) {
                URL.revokeObjectURL(formData.poster);
            }
            if (formData.logo instanceof File) {
                URL.revokeObjectURL(formData.logo);
            }
        };
    }, [formData.poster, formData.logo]);

    const handleRemoveLogo = () => {
        if (formData.logo instanceof File) {
            URL.revokeObjectURL(formData.logo);
        }
        setFormData(prev => ({ ...prev, logo: null }));
    };

    const handleRemovePoster = () => {
        if (formData.poster instanceof File) {
            URL.revokeObjectURL(formData.poster);
        }
        setFormData(prev => ({ ...prev, poster: null }));
        if (posterInputRef.current) {
            posterInputRef.current.value = "";
        }
        setPosterKey(Date.now());
    };

    const handleGajiSecretChange = (e) => {
        const isChecked = e.target.checked;
        setIsGajiSecret(isChecked);
        setFormData(prevState => ({
            ...prevState,
            gaji_min: isChecked ? "Dirahasiakan" : "",
            gaji_max: isChecked ? "Dirahasiakan" : ""
        }));
        setErrors(prevErrors => ({
            ...prevErrors,
            gaji_min: isChecked ? undefined : prevErrors.gaji_min,
            gaji_max: isChecked ? undefined : prevErrors.gaji_max
        }));
    };

    const handleChange = (e) => {
        const { name, files, value } = e.target;
        let newValue = value;
    
        if (name === "gaji_min" || name === "gaji_max") {
            if (/[.,;/-]/.test(value)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: "Wajib angka. Contoh: 1000000",
                }));
                return;
            }
            newValue = value.replace(/\D/g, "");
        }
    
        if (name === "logo" && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageSrc(event.target.result);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        } else {
            if (name === "judul" && Array.isArray(newValue)) {
                newValue = newValue[0] || "";
            }
            setFormData(prevState => ({
                ...prevState,
                [name]: files ? (files.length > 0 ? files[0] : prevState[name]) : newValue,
            }));
    
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                if (name === "gaji_min" || name === "gaji_max") {
                    if (!isGajiSecret) {
                        if (!newValue.trim()) {
                            newErrors[name] = "Wajib berupa angka! Contoh: 1000000";
                        } else if (isNaN(newValue) || newValue.includes(".") || newValue.includes("-")) {
                            newErrors[name] = "Wajib Angka. Contoh: 1000000 tanpa (. ; -)";
                        } else {
                            newErrors[name] = undefined;
                        }
                    }
                } else if (name !== "link") {
                    newErrors[name] = newValue.trim() ? undefined : "Wajib diisi!";
                }
                return newErrors;
            });
        }
    };

    const handleQuillChange = (value, field) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value || ""
        }));
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: value.trim() ? undefined : "Wajib diisi!",
        }));
    };

    const handleCrop = () => {
        if (cropperRef.current) {
            const canvas = cropperRef.current.getCroppedCanvas({ width: 100, height: 100 });
            canvas.toBlob((blob) => {
                const croppedFile = new File([blob], "cropped_logo.jpg", { type: "image/jpeg" });
                setFormData(prevState => ({
                    ...prevState,
                    logo: croppedFile,
                }));
                setShowCropModal(false);
            }, "image/jpeg");
        }
    };

    const initializeCropper = () => {
        if (imageRef.current) {
            if (cropperRef.current) {
                cropperRef.current.destroy();
            }
            cropperRef.current = new Cropper(imageRef.current, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1,
                movable: true,
                zoomable: true,
                scalable: true,
                cropBoxResizable: true,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach((key) => {
            if (key !== "poster" && key !== "logo" && key !== "link") {
                if (key === "gaji_min" || key === "gaji_max") {
                    if (!isGajiSecret && !formData[key]) {
                        newErrors[key] = "Wajib diisi! Contoh: 1000000";
                    } else if (!isGajiSecret && (isNaN(formData[key]) || formData[key].includes(".") || formData[key].includes("-"))) {
                        newErrors[key] = "Wajib angka. Contoh: 1000000 tanpa (.,;-)";
                    }
                } else if (!formData[key]) {
                    newErrors[key] = "Wajib diisi!";
                }
            }
        });

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) {
            setAlertMessage("Formulir belum lengkap. Mohon pastikan semua kolom wajib sudah terisi dengan benar!");
        }
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setShowConfirmModal(true);
    };

    const confirmSubmit = async () => {
        setIsSubmitting(true);
    
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "logo" || key === "poster") {
                    formDataToSend.append(key, value instanceof File ? value : value || "");
                } else if (key === "gaji_min" || key === "gaji_max") {
                    formDataToSend.append(key, isGajiSecret ? "Dirahasiakan" : (value || ""));
                } else if (value !== null && value !== undefined) {
                    formDataToSend.append(key, value.toString());
                }
            });
    
            await dispatch(updateInfoLoker({ id, updatedData: formDataToSend })).unwrap();
            setToastMessage({ type: "success", message: "Lowongan kerja berhasil diperbarui!" });
            setShowToast(true);
            setTimeout(() => navigate("/info-lowongan-kerja"), 3000);
        } catch (err) {
            setToastMessage({ type: "danger", message: "Gagal memperbarui Informasi Lowongan. Silakan coba lagi." });
            setShowToast(true);
        } finally {
            setIsSubmitting(false);
            setShowConfirmModal(false);
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
                        Gagal memuat data. Silakan cek database Anda!
                </Alert>
            </div>
        );
    }

    return (
        <PageContainer title="Edit Info Loker">
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
                            to="/info-lowongan-kerja"
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
                            <span className="fw-medium">Info Lowongan Kerja</span>
                        </Link>
                    </li>
                    <li className="breadcrumb-item active text-secondary" aria-current="page">
                        Edit
                    </li>
                </ol>
            </nav>
            <div className="row mb-4 align-items-center">
                <div className="col-12 col-md-6">
                    <h4 className="fw-bold mb-0">Edit Lowongan</h4>
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
                            onClick={() => navigate("/info-lowongan-kerja")}
                        >
                            <FaTimes size="clamp(14px, 2vw, 16px)" /> Batal
                        </Button>
                    </div>
                </div>
            </div>

            <DashboardCard>
                {loading ? <CircularProgress /> : (
                    <Form>
                        <Row>
                            {[
                                { id: "judul", label: "Judul/Posisi Pekerjaan", type: "text" },
                                { id: "perusahaan", label: "Nama Perusahaan", type: "text" },
                                { id: "lokasi", label: "Lokasi Pekerjaan", type: "text" },
                                {
                                    id: "bidang",
                                    label: "Bidang Pekerjaan",
                                    type: "select",
                                    options: [
                                        "Teknologi Informasi (IT)",
                                        "Manufaktur dan Produksi",
                                        "Pendidikan",
                                        "Kesehatan",
                                        "Keuangan dan Akuntansi",
                                        "Manajemen Bisnis dan Administrasi",
                                        "Teknik dan Industri",
                                        "Ekonomi",
                                        "Pemasaran dan Penjualan",
                                        "Pendidikan dan Pelatihan",
                                        "Hukum",
                                        "Pariwisata dan Perhotelan",
                                        "Energi dan Lingkungan",
                                        "Desain dan Seni",
                                        "Lainnya"
                                    ],
                                },
                                {
                                    id: "jenis",
                                    label: "Jenis Pekerjaan",
                                    type: "select",
                                    options: ["Full-Time", "Kontrak", "Part-Time", "Freelance", "Magang", "Volunter", "Lainnya"],
                                },
                                { id: "jenis_kelamin", label: "Jenis Kelamin", type: "select", options: ["Laki-Laki", "Perempuan", "Laki-Laki / Perempuan"] },
                                {
                                    id: "minimal_pendidikan",
                                    label: "Minimal Pendidikan",
                                    type: "select",
                                    options: ["SD/SMP", "SMA/SMK", "D3/D4", "S1", "S2", "S3"],
                                },
                                {
                                    id: "riwayat_pengalaman",
                                    label: "Riwayat Pengalaman",
                                    type: "select",
                                    options: ["Berpengalaman", "Tanpa Pengalaman/Fresh Graduate"],
                                },
                                { id: "deskripsi", label: "Deskripsi Pekerjaan", type: "quill" },
                                { id: "persyaratan", label: "Persyaratan Pekerjaan", type: "quill" },
                                { id: "keterampilan", label: "Keterampilan Pekerjaan", type: "quill" },
                                { id: "link", label: "Link Lamaran (Optional)", type: "text" },
                                { id: "gaji_min", label: "Nominal Gaji Minimum", type: "text" },
                                { id: "gaji_max", label: "Nominal Gaji Maksimal", type: "text" },
                            ].map(({ id, label, type, options }) => (
                                <Col md={type === "quill" ? 12 : 6} key={id}>
                                    <Form.Group controlId={id} className="mb-4">
                                        <Form.Label className="text-uppercase text-secondary">{label}</Form.Label>
                                        {type === "select" ? (
                                            <Form.Select
                                                name={id}
                                                value={formData[id]}
                                                onChange={handleChange}
                                                isInvalid={!!errors[id]}
                                                isValid={formData[id] && !errors[id]}
                                                style={{
                                                    borderColor: errors[id] ? "red" : formData[id] ? "green" : "gray"
                                                }}
                                                required={id !== "link"}
                                            >
                                                <option value="">Pilih</option>
                                                {options.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        ) : type === "quill" ? (
                                            <>
                                                <ReactQuill
                                                    value={formData[id]}
                                                    onChange={(value) => handleQuillChange(value, id)}
                                                    theme="snow"
                                                    modules={{
                                                        toolbar: [
                                                            [{ "list": "ordered" }, { "list": "bullet" }],
                                                            [{ "align": [] }],
                                                            ["bold", "italic", "underline"],
                                                            ["link"],
                                                        ],
                                                    }}
                                                    style={{
                                                        borderColor: errors[id] ? "red" : formData[id] ? "green" : "gray"
                                                    }}
                                                    required
                                                />
                                                {errors[id] && (
                                                    <Form.Control.Feedback type="invalid" className="d-block">
                                                        {errors[id]}
                                                    </Form.Control.Feedback>
                                                )}
                                            </>
                                        ) : (
                                            <Form.Control
                                                type={type}
                                                name={id}
                                                value={formData[id]}
                                                onChange={handleChange}
                                                isInvalid={!!errors[id]}
                                                isValid={(id === "gaji_min" || id === "gaji_max") ? isGajiSecret || (formData[id] && !errors[id]) : (formData[id] && !errors[id])}
                                                style={{
                                                    borderColor: errors[id] ? "red" : ((id === "gaji_min" || id === "gaji_max") && isGajiSecret) ? "green" : formData[id] ? "green" : "gray"
                                                }}
                                                required={id !== "link"}
                                            />
                                        )}
                                        <Form.Control.Feedback type="invalid">
                                            {errors[id]}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>
                            ))}
                            <Form.Group controlId="gajiSecret" className="mb-3 col-6 d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    id="gajiSecretCheckbox"
                                    checked={isGajiSecret}
                                    onChange={handleGajiSecretChange}
                                    style={{
                                        width: "18px",
                                        height: "18px",
                                        cursor: "pointer",
                                        marginRight: "8px"
                                    }}
                                />
                                <Form.Label 
                                    className="m-0 text-uppercase text-secondary"
                                    style={{ cursor: "pointer", fontSize: "16px" }}
                                >
                                    Gaji Dirahasiakan
                                </Form.Label>
                            </Form.Group>
                        </Row>
                        <Form.Group controlId="logo" className="mb-4">
                            <Form.Label className="text-uppercase text-secondary">Logo Perusahaan (Optional)</Form.Label>
                            <div className="d-flex align-items-center gap-3">
                                <div
                                    style={{
                                        border: `2px dashed ${errors.logo ? "red" : formData.logo ? "green" : "gray"}`,
                                        borderRadius: "50px",
                                        padding: "10px",
                                        width: "100px",
                                        height: "100px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexDirection: "column",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        position: "relative",
                                        backgroundColor: "#f8f9fa",
                                        flexShrink: 0,
                                    }}
                                >
                                    <input
                                        type="file"
                                        name="logo"
                                        accept="image/*"
                                        onChange={handleChange}
                                        style={{
                                            position: "absolute",
                                            borderRadius: "50px",
                                            width: "100%",
                                            height: "100%",
                                            opacity: 0,
                                            cursor: "pointer",
                                        }}
                                    />
                                    {formData.logo ? (
                                        <img
                                            src={
                                                formData.logo instanceof File
                                                    ? URL.createObjectURL(formData.logo)
                                                    : formData.logo
                                            }
                                            alt="Logo Perusahaan"
                                            style={{
                                                maxWidth: "100%",
                                                borderRadius: "50px",
                                                maxHeight: "100%",
                                                objectFit: "cover",
                                            }}
                                            onError={(e) => {
                                                e.target.src = defaultLogo;
                                            }}
                                        />
                                    ) : (
                                        <span style={{ fontSize: "14px", color: "gray" }}>Upload Logo</span>
                                    )}
                                </div>

                                {formData.logo && (
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={<Tooltip id="tooltip-remove-logo">Hapus Logo</Tooltip>}
                                    >
                                        <Button 
                                            variant="outline-danger"
                                            onClick={handleRemoveLogo}
                                            className="d-flex align-items-center justify-content-center flex-shrink-0"
                                            style={{
                                                minWidth: "40px", 
                                                height: "40px",
                                            }}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </OverlayTrigger>
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group controlId="poster" className="mt-4">
                            <Form.Label className="text-uppercase text-secondary">Poster Pekerjaan (Optional)</Form.Label>
                            <Form.Control
                                ref={posterInputRef}
                                type="file"
                                name="poster"
                                onChange={handleChange}
                                key={`poster-${posterKey}`}
                            />
                            {formData.poster && (
                                <div className="mt-2" key={`poster-preview-${posterKey}`}>
                                    <OverlayTrigger
                                        placement="right"
                                        overlay={<Tooltip id="tooltip-remove-poster">Hapus Poster</Tooltip>}
                                    >
                                        <Button 
                                            variant="outline-danger"
                                            onClick={handleRemovePoster}
                                            className="d-flex align-items-center justify-content-center flex-shrink-0 mb-1"
                                            style={{
                                                minWidth: "40px", 
                                                height: "40px",
                                            }}
                                        >
                                            <FaTrash />
                                        </Button>
                                    </OverlayTrigger>
                                    <img
                                        src={
                                            formData.poster instanceof File 
                                                ? URL.createObjectURL(formData.poster)
                                                : formData.poster ? `${BASE_URL}${formData.poster}` : ""
                                        }
                                        alt="Poster Pekerjaan"
                                        style={{ maxWidth: "100%", borderRadius: "8px", objectFit: "cover" }}
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                </div>
                            )}
                        </Form.Group>
                    </Form>
                )}
            </DashboardCard>
            <Modal show={showCropModal} onHide={() => setShowCropModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Crop Logo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        {imageSrc && (
                            <img
                                ref={imageRef}
                                src={imageSrc}
                                alt="Logo Preview"
                                style={{ maxWidth: "100%" }}
                                onLoad={initializeCropper}
                            />
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCropModal(false)}>
                        Batal
                    </Button>
                    <Button variant="primary" onClick={handleCrop}>
                        Crop & Simpan
                    </Button>
                </Modal.Footer>
            </Modal>
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
                            Apakah Anda yakin ingin mengubah info lowongan kerja ini?
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