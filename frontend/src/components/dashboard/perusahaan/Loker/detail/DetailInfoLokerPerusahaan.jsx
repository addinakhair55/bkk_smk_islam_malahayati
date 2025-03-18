import PageContainer from 'src/components/container/PageContainer';
import { useEffect, useState } from 'react';
import { Button, CloseButton, Modal, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaHistory, FaBuilding, FaExclamationCircle} from 'react-icons/fa';
import DashboardCard from '../../../../shared/DashboardCard';
import { useDispatch, useSelector } from 'react-redux';
import { deleteInfoLokerPerusahaan, fetchInfoLokerPerusahaanById } from '../../../../redux/slice/infoLokerPerusahaanSlice';
import defaultLogo from "../../../../../assets/images/logos/default-logo.png"
import { ArrowLeft } from 'lucide-react';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Alert, CircularProgress } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';

// eslint-disable-next-line react/prop-types
export default function DetailInfoLokerPerusahaan() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { infoLokerPerusahaan, loading, error } = useSelector((state) => state.infoLokerPerusahaan);
    
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
            dispatch(fetchInfoLokerPerusahaanById(id));
        }
    }, [dispatch, id]);

    const handleDelete = () => {
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
          if (!infoLokerPerusahaan?._id) {
            throw new Error('ID lowongan kerja tidak ditemukan');
          }
          await dispatch(deleteInfoLokerPerusahaan(infoLokerPerusahaan._id)).unwrap();
          setToastMessage({ type: "success", message: "Info lowongan Kerja ini berhasil dihapus!" });
          setShowToast(true);
          setTimeout(() => navigate("/info_loker"), 3000);
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
        <PageContainer title="Detail Info Lowongan Kerja">
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
            <h4 className="fw-bold mb-0">Detail Info Loker</h4>
            <div className="row mb-4 justify-content-end">
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="d-flex flex-column flex-md-row justify-content-end gap-2 gap-md-3">
                        <Link
                        to="/info_loker"
                        className="btn btn-outline-secondary d-flex align-items-center justify-content-center px-3 py-2 fw-medium"
                        >
                        <ArrowLeft size={18} className="me-2" />
                            Kembali
                        </Link>

                        <Button
                            variant="warning"
                            onClick={() => navigate(`/edit_info_loker/${infoLokerPerusahaan._id}`)}
                            className="d-flex align-items-center justify-content-center px-3 py-2 fw-medium shadow-sm"
                            style={{ transition: "all 0.3s" }}
                            onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                            >
                            <BsPencilSquare size={18} className="me-2" />
                            Edit
                        </Button>

                        <Button
                            variant="danger"
                            onClick={() => handleDelete(infoLokerPerusahaan._id)}
                            className="d-flex align-items-center justify-content-center px-3 py-2 fw-medium shadow-sm"
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
                <div className="container-fluid">
                    <div className="row g-4">
                        <div className="col-12">
                            <div className="row align-items-center">
                                <div className="col-12 col-md-8">
                                    <div className="d-flex flex-column flex-sm-row gap-3 align-items-sm-center">
                                        <img
                                            src={infoLokerPerusahaan.logo ? `http://localhost:5000/uploads/${infoLokerPerusahaan.logo}` : defaultLogo}
                                            alt="Logo Perusahaan"
                                            className="img-fluid rounded-circle border"
                                            style={{ 
                                                width: "50px", 
                                                height: "50px", 
                                                objectFit: "cover"
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <h5 className="mb-1 fw-bold text-primary">
                                                {infoLokerPerusahaan.judul}
                                            </h5>
                                            <div className="d-flex flex-column flex-sm-row gap-2 text-secondary fs-6">
                                                <div className="d-flex align-items-center">
                                                    <FaBuilding className="me-2 text-primary" />
                                                    <span className="text-truncate" style={{ maxWidth: "500px" }}>
                                                        {infoLokerPerusahaan.perusahaan}
                                                    </span>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <FaMapMarkerAlt className="me-2 text-danger" />
                                                    <span className="text-truncate" style={{ maxWidth: "500px" }}>
                                                        {infoLokerPerusahaan.lokasi}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4 mt-3 mt-md-0">
                                    <div className="text-md-end">
                                        <h5 className="fw-bold text-success mb-2">
                                            {infoLokerPerusahaan.gaji_min === "Dirahasiakan" && infoLokerPerusahaan.gaji_max === "Dirahasiakan"
                                                ? "Dirahasiakan"
                                                : infoLokerPerusahaan.gaji_min && infoLokerPerusahaan.gaji_max
                                                ? `${formatRupiah(infoLokerPerusahaan.gaji_min)} - ${formatRupiah(infoLokerPerusahaan.gaji_max)}`
                                                : infoLokerPerusahaan.gaji_min
                                                ? `Mulai ${formatRupiah(infoLokerPerusahaan.gaji_min)}`
                                                : infoLokerPerusahaan.gaji_max
                                                ? `Hingga ${formatRupiah(infoLokerPerusahaan.gaji_max)}`
                                                : "Gaji Tidak Ditampilkan"}
                                        </h5>
                                        <div className="d-flex align-items-center justify-content-md-end text-muted">
                                            <FaHistory className="me-2" />
                                            <small>{getRelativeTime(infoLokerPerusahaan.tanggalDibuat)}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* TAG & Button */}
                        <div className="col-12">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                <div className="d-flex flex-wrap gap-2">
                                    {[
                                        { value: infoLokerPerusahaan.jenis_kelamin },
                                        { value: infoLokerPerusahaan.minimal_pendidikan },
                                        { value: infoLokerPerusahaan.jenis },
                                    ].map((item, index) => (
                                        <span
                                            key={index}
                                            className="bg-primary bg-opacity-10 text-primary px-3 py-2 rounded px-4 fw-bold"
                                        >
                                            {item.value}
                                        </span>
                                    ))}
                                </div>
                                {infoLokerPerusahaan.link && (
                                    <button
                                        className="btn btn-primary px-3 py-2 fw-medium mt-2 mt-md-0"
                                        onClick={() => window.open(infoLokerPerusahaan.link.startsWith("http") ? infoLokerPerusahaan.link : `https://${infoLokerPerusahaan.link}`, "_blank")}
                                    >
                                        LAMAR SEKARANG
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Deskripsi, Persyaratan, Keterampilan */}
                        <div className="col-12">
                            <div className="row g-4">
                                {[
                                    { label: 'Deskripsi', value: infoLokerPerusahaan.deskripsi },
                                    { label: 'Persyaratan', value: infoLokerPerusahaan.persyaratan },
                                    { label: 'Keterampilan', value: infoLokerPerusahaan.keterampilan },
                                ].map((item, index) => (
                                    <div className="col-12" key={index}>
                                        <h3 className="text-secondary mb-2 fw-bold">
                                            {item.label}
                                        </h3>
                                        <div dangerouslySetInnerHTML={{ __html: item.value }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Job Poster */}
                        {infoLokerPerusahaan.poster && (
                            <div className="col-12 mt-4">
                                <img
                                    src={`http://localhost:5000/uploads/${infoLokerPerusahaan.poster}`}
                                    alt="Poster Pekerjaan"
                                    className="img-fluid rounded shadow-sm w-100"
                                />
                            </div>
                        )}
                    </div>
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
                            Apakah Anda yakin untuk menghapus lowongan ini?
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
                                maxWidth: "200px",
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
                        <Button
                            onClick={confirmDelete}
                            className="fw-bold py-2 rounded-pill shadow-sm w-100 border-0"
                            disabled={isSubmitting}
                            style={{
                                color: '#ffffff',
                                backgroundColor: '#fe0202',
                                maxWidth: '200px',
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
                    </Modal.Footer>
                </div>
            </Modal>
        </PageContainer>
    );
}
