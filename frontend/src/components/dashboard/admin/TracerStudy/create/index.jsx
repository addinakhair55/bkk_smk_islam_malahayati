import PageContainer from 'src/components/container/PageContainer';
import { CircularProgress } from '@mui/material';
import { useRef, useState } from 'react';
import { Alert, Button, CloseButton, Col, Form, Modal, Row, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import DashboardCard from '../../../../shared/DashboardCard';
import { useDispatch, useSelector } from 'react-redux';
import { createTracerStudy } from '../../../../redux/slice/tracerStudySlice';
import { FaExclamationCircle, FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { FiAlertTriangle } from 'react-icons/fi';

export default function CreateTracerStudy() {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.tracerStudy);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const [formData, setFormData] = useState({
        nama_lengkap: "", jenis_kelamin: "", tanggal_lahir: "", kota_kelahiran: "", agama: "",
        alamat: "", nisn: "", nis: "", tahun_lulus: "", email: "", handphone: "", jurusan: "",
        status_anda: "", nama_perusahaan: "", posisi_jabatan: "", nama_kampus: "", program_studi: "",
        kepuasan_materi: "", kepuasan_fasilitas: "", kepuasan_guru: "", saran_smk: "", foto_alumni: null,
        status: 'Pending',
    });

    const formFields = [
        { id: 'nisn', label: 'NISN (Nomor Induk Siswa Nasional)', type: 'text' },
        { id: 'nis', label: 'NIS (Nomor Induk Siswa)', type: 'text' },
        { id: 'nama_lengkap', label: 'Nama Lengkap', type: 'text' },
        { id: 'jenis_kelamin', label: 'Jenis Kelamin', type: 'select', options: ['Laki-Laki', 'Perempuan'] },
        { id: 'kota_kelahiran', label: 'Kota Kelahiran', type: 'text' },
        { id: 'tanggal_lahir', label: 'Tanggal Lahir', type: 'date' },
        { id: 'agama', label: 'Agama', type: 'select', options: ['Islam', 'Kristen Protestan', 'Kristen Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'] },
        { id: 'tahun_lulus', label: 'Tahun Lulus', type: 'text' },
        { id: 'email', label: 'Email', type: 'email' },
        { id: 'jurusan', label: 'Jurusan', type: 'select', options: ['Teknik Komputer dan Jaringan (TKJ)', 'Akuntansi (AK)', 'Administrasi Perkantoran (AP)'] },
        { id: 'handphone', label: 'Handphone', type: 'text' },
        { id: 'alamat', label: 'Alamat Tempat Tinggal', type: 'textarea' },
    ];
    
    const feedbackFields = [
        { id: 'kepuasan_materi', label: '1. Berikan kepuasan Anda terhadap materi yang dipelajari di SMK Islam Malahayati?', type: 'radio', options: ['Sangat Puas', 'Puas', 'Cukup Puas', 'Kurang Puas', 'Tidak Puas'] },
        { id: 'kepuasan_fasilitas', label: '2. Berikan kepuasan Anda terhadap fasilitas (laboratorium, alat praktik, dll.) yang disediakan oleh SMK Islam Malahayati?', type: 'radio', options: ['Sangat Puas', 'Puas', 'Cukup Puas', 'Kurang Puas', 'Tidak Puas'] },
        { id: 'kepuasan_guru', label: '3. Berikan kepuasan Anda terhadap kualitas guru di SMK Islam Malahayati?', type: 'radio', options: ['Sangat Puas', 'Puas', 'Cukup Puas', 'Kurang Puas', 'Tidak Puas'] },
        { id: 'saran_smk', label: '4. Berikan saran Anda untuk meningkatkan kualitas keseluruhan di SMK Islam Malahayati.', type: 'textarea' },
    ];

    const [imageSrc, setImageSrc] = useState(null);
    const [showCropModal, setShowCropModal] = useState(false);
    const cropperRef = useRef(null);
    const imageRef = useRef(null);

    const navigate = useNavigate();

    const handleChange = ({ target: { name, value, files } }) => {
        if (name === 'foto_alumni' && files[0]) {
            const file = files[0];
            const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];
    
            if (!validFormats.includes(file.type)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    foto_alumni: 'Format file harus PNG, JPG, atau JPEG',
                }));
                return;
            }
    
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageSrc(e.target.result);
                setShowCropModal(true);
            };
            reader.readAsDataURL(file);
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
            setErrors((prevErrors) => ({
                ...prevErrors,
                [name]: value ? '' : 'Wajib diisi',
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
                const croppedFile = new File([blob], 'foto_alumni.jpg', { type: 'image/jpeg' });
                setFormData((prevState) => ({
                    ...prevState,
                    foto_alumni: croppedFile,
                }));
                setShowCropModal(false);
            }, 'image/jpeg');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    };

    const confirmSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            formDataToSend.append(key, value);
        });

        
        try {
            await dispatch(createTracerStudy(formDataToSend)).unwrap();
            setToastMessage({ type: "success", message: "Tracer Study berhasil ditambahkan!" });
            setShowToast(true);
            setTimeout(() => navigate("/tracerStudy"), 3000);
        } catch (error) {
            setToastMessage({ type: "danger", message: "Gagal menambahkan data Tracer Study. Silakan coba lagi." });
            setShowToast(true);
        } finally {
            setIsSubmitting(false);
            setShowConfirmModal(false);
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
        <PageContainer title="Tracer Study Baru">
            <ToastContainer position="top-end" className="p-3 mt-5">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMessage.type}>
                    <Toast.Body className="text-white">{toastMessage.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link 
                        to="/tracerStudy" 
                        className="text-primary d-flex align-items-center text-decoration-none"
                        style={{ 
                            color: "blue", 
                            textDecoration: "none",
                            transition: "color 0.3s ease"
                        }}
                        onMouseEnter={(e) => e.target.style.color = "darkblue"}
                        onMouseLeave={(e) => e.target.style.color = "blue"}
                        onMouseDown={(e) => e.target.style.color = "red"}
                        onMouseUp={(e) => e.target.style.color = "darkblue"}
                    >
                        <span className="fw-medium">Tracer Study</span>
                    </Link>
                </li>
                <li className="breadcrumb-item active text-secondary" aria-current="page">
                    Tambah Data
                </li>
                </ol>
            </nav>

            <div className="row mb-4 align-items-center">
                <div className="col-12 col-md-6">
                    <h4 className="fw-bold mb-0">Tambah Tracer Study</h4>
                </div>
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="d-flex flex-column flex-md-row justify-content-end gap-2 gap-md-3">
                        <Button
                            type="submit"
                            className="fw-bold d-flex align-items-center justify-content-center gap-2"
                            style={{
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
                                    <FaSave size="clamp(14px, 2vw, 16px)" /> Tambah Baru
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
                            onClick={() => navigate("/mou-perusahaan")}
                        >
                            <FaTimes size="clamp(14px, 2vw, 16px)" /> Batal
                        </Button>
                    </div>
                </div>
            </div>

            <DashboardCard>
                
                {loading ? <CircularProgress /> : (
                    <Form>
                       
                        <h5 className="mb-3 fw-bold text-secondary">
                                A. Informasi Pribadi
                        </h5>
                        <div className="card shadow-sm border-0 p-3">
                            <Row>
                                <Col md={12} className="d-flex justify-content-center mb-4">
                                    <Form.Group controlId="foto_alumni" className="mb-3 text-center">
                                        {(() => {
                                            const errorMessage = errors.foto_alumni;
                                            const borderColor = errorMessage ? "red" : formData.foto_alumni ? "green" : "gray";

                                            return (
                                                <>
                                                    <Form.Label className="text-uppercase text-secondary">
                                                        Pas Foto Formal
                                                    </Form.Label>
                                                    <div
                                                        style={{
                                                            border: `2px dashed ${borderColor}`,
                                                            borderRadius: "10px",
                                                            padding: "10px",
                                                            width: "130px",
                                                            height: "180px",
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
                                                            name="foto_alumni"
                                                            onChange={handleChange}
                                                            accept=".png, .jpg, .jpeg" // Hanya izinkan format ini
                                                            style={{
                                                                position: "absolute",
                                                                width: "100%",
                                                                height: "100%",
                                                                opacity: 0,
                                                                cursor: "pointer",
                                                            }}
                                                            required
                                                        />
                                                        {formData.foto_alumni ? (
                                                            <img
                                                                src={URL.createObjectURL(formData.foto_alumni)}
                                                                alt="Preview"
                                                                style={{ maxWidth: "100%", maxHeight: "100%" }}
                                                            />
                                                        ) : (
                                                            <>
                                                                <FaPlus size={30} color={borderColor} />
                                                                <small style={{ color: borderColor, marginTop: "5px" }}>
                                                                    Upload Foto
                                                                </small>
                                                            </>
                                                        )}
                                                    </div>
                                                    {errorMessage && <small className="text-danger">{errorMessage}</small>}
                                                </>
                                            );
                                        })()}
                                    </Form.Group>
                                </Col>

                                {formFields.map(({ id, label, type, options }) => {
                                    const errorMessage = errors[id];
                                    const borderColor = errorMessage ? 'red' : formData[id] ? 'green' : 'gray';

                                    return (
                                        <Col md={6} key={id}>
                                            <Form.Group controlId={id} className="mb-4">
                                                <Form.Label className="text-uppercase text-secondary">{label}</Form.Label>
                                                {type === 'select' ? (
                                                    <Form.Select name={id} value={formData[id]} onChange={handleChange} style={{ borderColor }} required>
                                                        <option value="" disabled className="text-secondary">Pilih {label}</option>
                                                        {options.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </Form.Select>
                                                ) : type === 'textarea' ? (
                                                    <Form.Control 
                                                        as="textarea" 
                                                        name={id} 
                                                        value={formData[id]} 
                                                        onChange={handleChange} 
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
                                                        required 
                                                        style={{ borderColor }}
                                                    />
                                                )}
                                                {errorMessage && <small className="text-danger">{errorMessage}</small>}
                                            </Form.Group>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </div>

                        {/* Modal untuk Crop */}
                        <Modal show={showCropModal} onHide={() => setShowCropModal(false)} centered backdrop="static">
                            <Modal.Header closeButton className="border-0">
                                <Modal.Title className="fw-bold text-primary">Crop Foto</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-center">
                                <div className="d-flex justify-content-center align-items-center bg-light rounded p-3" style={{ maxHeight: '400px', overflow: 'hidden' }}>
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
                                    <i className="bi bi-x-lg"></i> Batal
                                </Button>
                                <Button variant="success" onClick={handleCrop} className="fw-bold px-4">
                                    <i className="bi bi-check-lg"></i> Crop & Simpan
                                </Button>
                            </Modal.Footer>
                        </Modal>


                        <h5 className="mb-3 mt-4 fw-bold text-secondary">
                            B. Aktivitas Setelah Lulus
                        </h5>
                        <div className="card shadow-sm border-0 p-3">
                            {(() => {
                                const errorMessage = errors?.status_anda;
                                const borderColor = errorMessage ? "red" : formData.status_anda ? "green" : "gray";

                                return (
                                    <>
                                        <Row>
                                            <Form.Group id="status_anda" className="mb-3">
                                                <Form.Label className="text-uppercase text-secondary">Apa aktivitas Anda saat ini?</Form.Label>
                                                <Form.Select
                                                name="status_anda"
                                                value={formData.status_anda}
                                                onChange={handleChange}
                                                style={{ borderColor }}
                                                required
                                                >
                                                <option value="">Pilih</option>
                                                {["Bekerja", "Melanjutkan Pendidikan", "Tidak bekerja dan tidak melanjutkan pendidikan", "Wirausaha"].map(option => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                                </Form.Select>
                                            </Form.Group>
                                        </Row>

                                        {formData.status_anda === "Bekerja" && (
                                            <Row className="g-3">
                                                <Col xs={12} md={6}>
                                                    <Form.Group id="nama_perusahaan">
                                                        <Form.Label className="text-uppercase text-secondary">Nama Perusahaan</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="nama_perusahaan"
                                                            value={formData.nama_perusahaan}
                                                            onChange={handleChange}
                                                            style={{ borderColor }}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Group id="posisi_jabatan">
                                                        <Form.Label className="text-uppercase text-secondary">Posisi/Jabatan</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="posisi_jabatan"
                                                            value={formData.posisi_jabatan}
                                                            onChange={handleChange}
                                                            style={{ borderColor }}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        )}

                                        {formData.status_anda === "Melanjutkan Pendidikan" && (
                                            <Row className="g-3">
                                                <Col xs={12} md={6}>
                                                    <Form.Group id="nama_kampus">
                                                        <Form.Label className="text-uppercase text-secondary">Nama Kampus</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="nama_kampus"
                                                            value={formData.nama_kampus}
                                                            onChange={handleChange}
                                                            style={{ borderColor }}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col xs={12} md={6}>
                                                    <Form.Group id="program_studi">
                                                        <Form.Label className="text-uppercase text-secondary">Program Studi</Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            name="program_studi"
                                                            value={formData.program_studi}
                                                            onChange={handleChange}
                                                            style={{ borderColor }}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        )}
                                            </>
                                        );
                                })()}
                        </div>

                        <h5 className="mb-3 mt-4 fw-bold text-secondary">
                            C. Feedback untuk SMK Islam Malahayati
                        </h5>
                        <div className="card shadow-sm border-0 p-3">
                            {(() => {
                                const errorMessage = errors?.status_anda;
                                const borderColor = errorMessage ? "red" : formData.status_anda ? "green" : "gray";

                                return (
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
                                                                style={{ borderColor }}
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
                                                            style={{ borderColor }}
                                                            required
                                                        />
                                                    )}
                                                </Form.Group>
                                            </Col>
                                        ))}
                                    </Row>
                                );
                            })()}
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
                            Apakah Anda yakin ingin menambah Tracer Study?
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
                                        color: '#ffffff',
                                        backgroundColor: '#3083ff',
                                        transition: 'all 0.2s ease-in-out',
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
