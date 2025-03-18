import PageContainer from 'src/components/container/PageContainer';
import { useEffect, useState } from 'react';
import { Alert, Button, CloseButton, Modal, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBuilding, FaHistory, FaUser, FaGraduationCap, FaBriefcase, FaShareAlt, FaExclamationCircle} from 'react-icons/fa';
import DashboardCard from '../../../../shared/DashboardCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteInfoLoker, fetchInfoLokerById } from '../../../../redux/slice/infoLokerSlice';
import defaultLogo from "../../../../../assets/images/logos/default-logo.png"
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { ArrowLeft } from 'lucide-react';
import "./DetailLoker.css"
import { CircularProgress } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

const BASE_URL = 'http://localhost:5000/uploads/';

export default function DetailInfoLoker() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { infoLoker, loading, error } = useSelector((state) => state.infoLoker);
    
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', message: '' });

    const getRelativeTime = (date) => {
        const diff = Math.floor((new Date() - new Date(date)) / 1000);
        if (diff < 60) return "Posting baru saja";
        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes} menit yang lalu`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} jam yang lalu`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} hari yang lalu`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks} minggu yang lalu`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} bulan yang lalu`;
        return `${Math.floor(months / 12)} tahun yang lalu`;
    };

    const formatRupiah = (angka) => {
        if (angka >= 1_000_000) {
            return `Rp ${angka / 1_000_000} jt`;
        }
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }).format(angka);
    };

    useEffect(() => {
            if (id) {
                dispatch(fetchInfoLokerById(id));
            }
    }, [dispatch, id]);

    const handleDelete = () => {
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            if (!infoLoker?._id) {
            throw new Error('ID lowongan kerja tidak ditemukan');
            }
            await dispatch(deleteInfoLoker(infoLoker._id)).unwrap();
            setToastMessage({ type: "success", message: "Info lowongan Kerja ini berhasil dihapus!" });
            setShowToast(true);
            setTimeout(() => navigate("/info-lowongan-kerja"), 3000);
        } catch (err) {
            setToastMessage({ type: "danger", message: "Gagal hapus info lowongan kerja ini. Silakan coba lagi." });
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
        <PageContainer title="Job Info Detail">
            <ToastContainer position="top-end" className="p-3 mt-5">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMessage.type}>
                    <Toast.Body className="text-white">{toastMessage.message}</Toast.Body>
                </Toast>
            </ToastContainer>
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link 
                            to="/info-lowongan-kerja" 
                            className="text-primary d-flex align-items-center text-decoration-none"
                            style={{ 
                                transition: "color 0.3s ease"
                            }}
                        >
                            <span className="fw-medium">Info Lowongan Kerja</span>
                        </Link>
                    </li>
                    <li className="breadcrumb-item active text-secondary" aria-current="page">
                        Detail
                    </li>
                </ol>
            </nav>
            <div className="row mb-4 align-items-center">
                <div className="col-12 col-md-6">
                    <h4 className="fw-bold mb-0">Detail Info Loker</h4>
                </div>
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="d-flex flex-column flex-md-row justify-content-end gap-2 gap-md-2">
                        <Link
                            to="/info-lowongan-kerja"
                            className="btn btn-outline-secondary d-flex align-items-center justify-content-center fw-medium"
                        >
                        <ArrowLeft size={18} className="me-2" />
                            Kembali
                        </Link>
                        <Button
                            variant="warning"
                            onClick={() => navigate(`/editLowongan/${infoLoker._id}`)}
                            className="d-flex align-items-center justify-content-center fw-medium shadow-sm"
                            style={{ transition: "all 0.3s" }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                            <BsPencilSquare size={18} className="me-2" />
                            Edit
                        </Button>

                        <Button
                            variant="danger"
                            onClick={() => handleDelete(infoLoker._id)}
                            className="d-flex align-items-center justify-content-center fw-medium shadow-sm"
                            style={{ transition: "all 0.3s" }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                            <BsTrash size={18} className="me-2" />
                            Hapus
                        </Button>
                    </div>
                </div>
            </div>

            <DashboardCard>
                <div className="row g-4">
                    {/* Bagian Utama */}
                    <div className="col-12">
                        <div className="row align-items-start position-relative flex-column flex-md-row">
                            {/* Info  */}
                            <div className="col-12 col-md-8 order-2 order-md-1">
                                <div className="d-flex flex-column flex-sm-row flex-wrap gap-3 py-3 py-md-0">
                                    {/* Logo */}
                                    <img
                                        src={infoLoker.logo ? `${BASE_URL}${infoLoker.logo}` : defaultLogo}
                                        alt="Logo Perusahaan"
                                        className="img-fluid rounded-circle border"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            objectFit: "cover",
                                            flexShrink: 0,
                                        }}
                                        onError={(e) => {
                                            e.target.src = defaultLogo;
                                        }}
                                    />
                                    {/* Detail Pekerjaan */}
                                    <div className="flex-grow-1">
                                        <h3 className="mb-2 fw-bold text-primary fs-4 fs-md-3">{infoLoker.judul}</h3>
                                        <div className="d-flex flex-column gap-2 text-secondary">
                                            <div className="d-flex align-items-center flex-nowrap">
                                                <FaBuilding className="me-2 text-primary flex-shrink-0"/>
                                                <span style={{ fontSize: 'clamp(14px, 1.4vw, 14px)' }} className="text-truncate text-tag-detail">{infoLoker.perusahaan}</span>
                                            </div>
                                            <div className="d-flex align-items-center flex-nowrap">
                                                    <FaMapMarkerAlt className="me-2 text-danger flex-shrink-0" />
                                                    <span style={{ fontSize: 'clamp(14px, 1.4vw, 14px)' }}>{infoLoker.lokasi}</span>
                                            </div>
                                            <div className="d-flex align-items-center flex-nowrap">
                                                <FaUser className="me-2 text-muted flex-shrink-0" />
                                                <span style={{ fontSize: 'clamp(14px, 1.4vw, 14px)' }}>{infoLoker?.jenis_kelamin || 'Jenis Kelamin Tidak Ditentukan'}</span>
                                            </div>
                                            <div className="d-flex align-items-center flex-nowrap">
                                                <FaGraduationCap className="me-2 text-muted flex-shrink-0" />
                                                <span style={{ fontSize: 'clamp(14px, 1.4vw, 14px)' }}>{infoLoker?.minimal_pendidikan || 'Pendidikan Tidak Ditentukan'}</span>
                                            </div>
                                            <div className="d-flex align-items-center flex-nowrap">
                                                <FaBriefcase className="me-2 text-muted flex-shrink-0" />
                                                <span style={{ fontSize: 'clamp(14px, 1.4vw, 14px)' }}>{infoLoker?.jenis || 'Jenis Pekerjaan Tidak Ditentukan'}</span>
                                            </div>
                                            <div className="d-block d-sm-none mt-2">
                                                <h5 className="fw-bold text-success my-2">
                                                    {infoLoker.gaji_min === "Dirahasiakan" && infoLoker.gaji_max === "Dirahasiakan"
                                                        ? "Gaji Dirahasiakan"
                                                        : infoLoker.gaji_min && infoLoker.gaji_max
                                                        ? `${formatRupiah(infoLoker.gaji_min)} - ${formatRupiah(infoLoker.gaji_max)}`
                                                        : infoLoker.gaji_min
                                                        ? `Mulai ${formatRupiah(infoLoker.gaji_min)}`
                                                        : infoLoker.gaji_max
                                                        ? `Hingga ${formatRupiah(infoLoker.gaji_max)}`
                                                        : "Gaji Tidak Ditampilkan"}
                                                </h5>
                                                <div className="d-flex align-items-center text-muted">
                                                    <FaHistory className="me-2" />
                                                    <small>{getRelativeTime(infoLoker.tanggalDibuat)}</small>
                                                </div>
                                            </div>
                                            <div className="mt-3 d-flex flex-column flex-sm-row gap-3">
                                                {/* Tombol Lamar */}
                                                {infoLoker.link && (
                                                    <Button
                                                        href={infoLoker.link.startsWith("http") ? infoLoker.link : `https://${infoLoker.link}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="fw-bold d-flex align-items-center justify-content-center flex-grow-1 w-100 w-sm-auto"
                                                        style={{ 
                                                            backgroundColor: "#4A90E2",
                                                            border: "none",
                                                            padding: "0.8rem 1.5rem", // Padding yang lebih responsif
                                                            transition: "all 0.2s ease-in-out",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = "#357ABD";
                                                            e.currentTarget.style.transform = "scale(1.05)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = "#4A90E2";
                                                            e.currentTarget.style.transform = "scale(1)";
                                                        }}
                                                    >
                                                        LAMAR PEKERJAAN
                                                    </Button>
                                                )}

                                                {/* Tombol Bagikan */}
                                                <Button
                                                    className="fw-bold d-flex align-items-center justify-content-center flex-grow-1 w-100 w-sm-auto gap-2"
                                                    style={{
                                                        color: "#a0a0a0",
                                                        backgroundColor: "white",
                                                        border: "2px solid #a0a0a0",
                                                        padding: "0.8rem 1.5rem", // Padding yang lebih responsif
                                                        transition: "all 0.2s ease-in-out",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.backgroundColor = "#6c757d";
                                                        e.currentTarget.style.color = "white";
                                                        e.currentTarget.style.border = "2px solid #6c757d";
                                                        e.currentTarget.style.transform = "scale(1.05)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.backgroundColor = "white";
                                                        e.currentTarget.style.color = "#a0a0a0";
                                                        e.currentTarget.style.border = "2px solid #a0a0a0";
                                                        e.currentTarget.style.transform = "scale(1)";
                                                    }}
                                                    onClick={() => 
                                                        navigator.share 
                                                            ? navigator.share({ title: infoLoker.judul, url: window.location.href })
                                                            : alert("Fitur berbagi tidak didukung di perangkat ini.")
                                                    }
                                                >
                                                    <FaShareAlt />
                                                    BAGIKAN
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="col-12 col-md-4 order-1 order-md-2 text-start text-md-end d-none d-sm-block">
                                <h5 className="fw-bold text-success mb-2">
                                    {infoLoker.gaji_min === "Dirahasiakan" && infoLoker.gaji_max === "Dirahasiakan"
                                        ? "Gaji Dirahasiakan"
                                        : infoLoker.gaji_min && infoLoker.gaji_max
                                        ? `${formatRupiah(infoLoker.gaji_min)} - ${formatRupiah(infoLoker.gaji_max)}`
                                        : infoLoker.gaji_min
                                        ? `Mulai ${formatRupiah(infoLoker.gaji_min)}`
                                        : infoLoker.gaji_max
                                        ? `Hingga ${formatRupiah(infoLoker.gaji_max)}`
                                        : "Gaji Tidak Ditampilkan"}
                                </h5>
                                <div className="d-flex align-items-center justify-content-start justify-content-md-end text-muted">
                                    <FaHistory className="me-2" />
                                    <small>{getRelativeTime(infoLoker.tanggalDibuat)}</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ borderBottom: '2px solid #dee2e6' }}></div>

                    {/* Deskripsi, Persyaratan, Keterampilan */}
                    <div className="col-12">
                        <div className="row g-4">
                            {[
                                { label: 'Deskripsi', value: infoLoker.deskripsi },
                                { label: 'Persyaratan', value: infoLoker.persyaratan },
                                { label: 'Keterampilan', value: infoLoker.keterampilan },
                            ].map((item, index) => (
                                <div className="col-12" key={index}>
                                    <h3 className="text-secondary mb-2 fw-bold">{item.label}</h3>
                                    <div className="text-break" dangerouslySetInnerHTML={{ __html: item.value }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Job Poster */}
                    {infoLoker.poster && (
                        <div className="col-12 mt-4">
                            <img
                                src={`${BASE_URL}${infoLoker.poster}`}
                                alt="Poster Pekerjaan"
                                className="img-fluid rounded shadow-sm"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                        </div>
                    )}
                </div>
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
                                color: '#ff0707',
                                backgroundColor: '#fad6d6',
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
                            Apakah Anda yakin ingin menghapus lowongan ini?
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
                                    onClick={confirmDelete}
                                    className="fw-bold py-2 rounded-pill shadow-sm w-100 border-0"
                                    disabled={isSubmitting}
                                    style={{
                                        color: '#ffffff',
                                        backgroundColor: '#fe0202',
                                        transition: 'all 0.2s ease-in-out',
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor = "#fe0202";
                                        e.currentTarget.style.transform = "scale(1.05)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor = "#fe0202";
                                        e.currentTarget.style.transform = "scale(1)";
                                    }}
                                >
                                    {isSubmitting ? (
                                        <CircularProgress size={16} color="inherit" />
                                    ) : (
                                        <>Ya, Hapus</>
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
