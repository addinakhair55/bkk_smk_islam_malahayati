import PageContainer from 'src/components/container/PageContainer';
import { Alert, CircularProgress } from '@mui/material';
import { useRef, useState } from 'react';
import { Button, CloseButton, Col, Form, Modal, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createInfoLokerPerusahaan } from '../../../../redux/slice/infoLokerPerusahaanSlice';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import DashboardCard from '../../../../shared/DashboardCard';
import defaultLogo from "../../../../../assets/images/logos/default-logo.png";
import { FaExclamationCircle, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import Cropper from 'cropperjs';
import { FiAlertTriangle } from 'react-icons/fi';

export default function CreateInfoLokerPerusahaan() {
    const [formData, setFormData] = useState({
        judul: '', perusahaan: '', lokasi: '', bidang: '', jenis: '',
        jenis_kelamin: '', minimal_pendidikan: '', riwayat_pengalaman: '',
        link: '', deskripsi: '', persyaratan: '', keterampilan: '',
        gaji_min: '', gaji_max: '', poster: null, logo: null
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userId = localStorage.getItem("userId");
    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGajiSecret, setIsGajiSecret] = useState(false);
    const { loading, error } = useSelector((state) => state.infoLokerPerusahaan);
    
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageSrc, setImageSrc] = useState(null);
    const cropperRef = useRef(null);
    const imageRef = useRef(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleGajiSecretChange = (e) => {
        const isChecked = e.target.checked;
        setIsGajiSecret(isChecked);
        setFormData(prevState => ({
            ...prevState,
            gaji_min: isChecked ? "Dirahasiakan" : "",
            gaji_max: isChecked ? "Dirahasiakan" : ""
        }));
    };

    const handleChange = (e) => {
        const { name, files, value } = e.target;
        let newValue = value;

        if (name === "gaji_min" || name === "gaji_max") {
            if (/[.,;/-]/.test(value)) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [name]: 'Wajib angka. Contoh: 1000000'
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
            setFormData(prevState => ({
                ...prevState,
                [name]: files ? (files.length > 0 ? files[0] : prevState[name]) : newValue
            }));

            // Validate other fields
            setErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                if (name === "gaji_min" || name === "gaji_max") {
                    if (!newValue.trim()) {
                        newErrors[name] = 'Wajib diisi. Contoh: 1000000';
                    } else if (isNaN(newValue) || newValue.includes('.') || newValue.includes('-')) {
                        newErrors[name] = 'Wajib Angka. Contoh: 1000000 tanpa (. ; -)';
                    } else {
                        newErrors[name] = undefined;
                    }
                } else {
                    newErrors[name] = newValue.trim() ? undefined : 'Wajib diisi';
                }
                return newErrors;
            });
        }
    };

    // Handle cropping of the logo
    const handleCrop = () => {
        if (cropperRef.current) {
            const canvas = cropperRef.current.getCroppedCanvas({ width: 100, height: 100 });
            canvas.toBlob((blob) => {
                const croppedFile = new File([blob], 'cropped_logo.jpg', { type: 'image/jpeg' });
                setFormData(prevState => ({
                    ...prevState,
                    logo: croppedFile,
                }));
                setShowCropModal(false);
            }, 'image/jpeg');
        }
    };

    // Initialize the cropper
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

    // Handle changes in the Quill editor
    const handleQuillChange = (value, field) => {
        setFormData(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    // Validate the form before submission
    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (!formData[key] && key !== 'poster' && key !== 'logo') {
                newErrors[key] = 'Wajib diisi';
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };
    
    // Confirm the submission
    const confirmSubmit = async () => {
        if (!validateForm()) {
            return;
        }
    
        setIsSubmitting(true);
    
        try {
            const formDataToSend = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                if (key === "gaji_min" || key === "gaji_max") {
                    formDataToSend.append(key, value || "Dirahasiakan");
                } else if (key === 'logo' && !value) {
                    formDataToSend.append(key, defaultLogo);
                } else {
                    formDataToSend.append(key, value);
                }
            });
    
            await dispatch(createInfoLokerPerusahaan({ formData: formDataToSend, userId })).unwrap();
    
            setFormData({
                judul: '', perusahaan: '', lokasi: '', bidang: '', jenis: '',
                jenis_kelamin: '', minimal_pendidikan: '', riwayat_pengalaman: '',
                link: '', deskripsi: '', persyaratan: '', keterampilan: '',
                gaji_min: '', gaji_max: '', poster: null, logo: null
            });
    
            setToastMessage({ type: "success", message: "Informasi Lowongan berhasil ditambahkan!" });
            setShowToast(true);
            setTimeout(() => navigate("/info_loker"), 3000);
        } catch (err) {
            setToastMessage({ type: "danger", message: "Gagal menambahkan Informasi Lowongan. Silakan coba lagi." });
            setShowToast(true);
        } finally {
            setIsSubmitting(false);
            setShowConfirmModal(false);
        }
    };
    
    // Loading state
    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }
          
    // Error state
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
        <PageContainer title="Tambah Info Lowongan Kerja">
            <ToastContainer position="top-end" className="p-3 mt-5">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMessage.type}>
                    <Toast.Body className="text-white">{toastMessage.message}</Toast.Body>
                </Toast>
            </ToastContainer>
            
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link 
                            to="/perusahaan" 
                            className="text-primary d-flex align-items-center text-decoration-none"
                            style={{ transition: "color 0.3s ease" }}
                        >
                            <span className="fw-medium">Info Lowongan Kerja</span>
                        </Link>
                    </li>
                    <li className="breadcrumb-item active text-secondary" aria-current="page">
                        Tambah
                    </li>
                </ol>
            </nav>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-start mb-3">
                <h4 className="fw-bold mb-3 mb-md-0">Info Lowongan Kerja</h4>
                <div className="d-flex justify-content-end gap-2">
                    <Button
                        type="submit"
                        className="fw-bold d-flex align-items-center justify-content-center gap-2 w-100 d-md-inline-flex text-center"
                        style={{
                            maxWidth: "120px",
                            backgroundColor: "#4A90E2",
                            border: "none",
                            transition: "background-color 0.2s ease-in-out",
                        }}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#357ABD";
                            e.currentTarget.style.transform = "scale(1.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#4A90E2";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                    >
                        {isSubmitting ? (
                            <CircularProgress size={20} color="inherit" />
                        ) : (
                            <>
                                <FaSave size="clamp(14px, 2vw, 16px)" /> Tambah
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline-secondary"
                        className="fw-bold d-flex align-items-center justify-content-center gap-2 w-100 d-md-inline-flex text-center"
                        style={{
                            maxWidth: "120px",
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
                        type="button"
                        onClick={() => navigate("/info_loker")}
                    >
                        <FaTimes size="clamp(14px, 2vw, 16px)" /> Batal
                    </Button>
                </div>
            </div>

            <DashboardCard>
                {loading ? <CircularProgress /> : (
                    <Form>
                        <Row>
                            {[
                                { id: 'judul', label: 'Judul Pekerjaan', type: 'text' },
                                { id: 'perusahaan', label: 'Nama Perusahaan', type: 'text' },
                                { id: 'lokasi', label: 'Lokasi Pekerjaan', type: 'text' },
                                {
                                    id: 'bidang',
                                    label: 'Bidang Pekerjaan',
                                    type: 'select',
                                    options: [
                                        'Teknologi Informasi (IT)', 
                                        'Manufaktur dan Produksi', 
                                        'Pendidikan',
                                        'Kesehatan', 
                                        'Keuangan dan Akuntansi',
                                        'Manajemen Bisnis dan Administrasi',
                                        'Teknik dan Industri',
                                        'Ekonomi',
                                        'Pemasaran dan Penjualan',
                                        'Pendidikan dan Pelatihan',
                                        'Hukum',
                                        'Pariwisata dan Perhotelan',
                                        'Energi dan Lingkungan',
                                        'Desain dan Seni',
                                    ],
                                },
                                {
                                    id: 'jenis',
                                    label: 'Jenis Pekerjaan',
                                    type: 'select',
                                    options: ['Full-Time','Kontrak', 'Part-Time', 'Freelance', 'Magang', 'Volunter'],
                                },
                                { id: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', options: ['Laki-Laki', 'Perempuan', 'Laki-Laki / Perempuan'] },
                                {
                                    id: 'minimal_pendidikan',
                                    label: 'Minimal Pendidikan',
                                    type: 'select',
                                    options: ['SD/SMP','SMA/SMK','D3/D4', 'S1', 'S2', 'S3'],
                                },
                                {
                                    id: 'riwayat_pengalaman',
                                    label: 'Riwayat Pengalaman',
                                    type: 'select',
                                    options: ['Berpengalaman','Tanpa Pengalaman/Fresh Graduate'],
                                },
                                { id: 'deskripsi', label: 'Deskripsi Pekerjaan', type: 'quill' },
                                { id: 'persyaratan', label: 'Persyaratan Pekerjaan', type: 'quill' },
                                { id: 'keterampilan', label: 'Keterampilan Pekerjaan', type: 'quill' },
                                { id: 'link', label: 'Link Lamaran', type: 'text' },
                                { id: 'gaji_min', label: 'Nominal Gaji Minimum', type: 'text' },
                                { id: 'gaji_max', label: 'Nominal Gaji Maximal', type: 'text' },
                            ].map(({ id, label, type, options }) => (
                                <Col md={type === 'quill' ? 12 : 6} key={id}>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="text-uppercase text-secondary">{label}</Form.Label>
                                        {type === 'select' ? (
                                            <Form.Select
                                                name={id}
                                                value={formData[id]}
                                                onChange={handleChange}
                                                isInvalid={!!errors[id]}
                                                style={{
                                                    borderColor: errors[id] ? 'red' : formData[id] ? 'green' : 'gray'
                                                }}
                                                required
                                            >
                                                <option value="">Pilih</option>
                                                {options.map(option => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        ) : type === 'quill' ? (
                                            <ReactQuill
                                                value={formData[id]}
                                                onChange={(value) => handleQuillChange(value, id)}
                                                theme="snow"
                                                modules={{
                                                    toolbar: [
                                                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                        [{ 'align': [] }],
                                                        ['bold', 'italic', 'underline'],
                                                        ['link'],
                                                    ],
                                                }}
                                                style={{
                                                    borderColor: errors[id] ? 'red' : formData[id] ? 'green' : 'gray'
                                                }}
                                                required
                                            />
                                        ) : (
                                            <Form.Control
                                                type={type}
                                                name={id}
                                                value={formData[id]}
                                                onChange={handleChange}
                                                isInvalid={!!errors[id]}
                                                style={{
                                                    borderColor: errors[id] ? 'red' : formData[id] ? 'green' : 'gray'
                                                }}
                                                required
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
                            <div
                                style={{
                                    border: `2px dashed ${errors.logo ? 'red' : formData.logo ? 'green' : 'gray'}`,
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
                                        src={URL.createObjectURL(formData.logo)}
                                        alt="Cropped Logo"
                                        style={{
                                            maxWidth: "100%",
                                            borderRadius: "50px",
                                            maxHeight: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <>
                                        <FaPlus size={30} color={errors.logo ? 'red' : 'gray'} />
                                        <small style={{ color: errors.logo ? 'red' : 'gray', marginTop: "5px" }}>
                                            Upload Logo
                                        </small>
                                    </>
                                )}
                            </div>
                        </Form.Group>

                        <Form.Group controlId="poster" className="mt-4">
                            <Form.Label className="text-uppercase text-secondary">Poster Pekerjaan (Optional)</Form.Label>
                            <Form.Control
                                type="file"
                                name="poster"
                                onChange={handleChange}
                            />
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
                                style={{ maxWidth: '100%' }}
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
                                fontSize: 'clamp(3rem, 6vw, 3rem)',
                                color: '#ff9807',
                                backgroundColor: '#faecd6',
                            }}
                        />
                        <CloseButton
                            className="position-absolute top-0 end-0 m-2"
                            onClick={() => setShowConfirmModal(false)}
                            aria-label="Tutup modal"
                        />
                        <h5 className="fw-bold" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
                            Apakah Anda yakin?
                        </h5>
                        <p className="text-muted" style={{ fontSize: 'clamp(0.875rem, 3vw, 1rem)' }}>
                            Apakah Anda yakin bahwa pengisian data ini sudah sesuai?
                        </p>
                    </Modal.Body>
                    <Modal.Footer 
                        className="border-0 d-flex flex-wrap justify-content-center gap-2 w-100 pt-0"
                    >
                        <Button
                            variant="outline-secondary"
                            onClick={() => setShowConfirmModal(false)}
                            className="fw-bold py-2 rounded-pill shadow-sm w-100"
                            style={{
                                maxWidth: '200px',
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            Batal
                        </Button>
                        <Button
                            variant="primary"
                            onClick={confirmSubmit}
                            className="fw-bold py-2 rounded-pill shadow-sm w-100"
                            disabled={isSubmitting}
                            style={{
                                maxWidth: '200px',
                                transition: 'all 0.2s ease-in-out',
                            }}
                        >
                            {isSubmitting ? (
                                <CircularProgress size={16} color="inherit" />
                            ) : (
                                <>Ya, Simpan</>
                            )}
                        </Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </PageContainer>
    );
}