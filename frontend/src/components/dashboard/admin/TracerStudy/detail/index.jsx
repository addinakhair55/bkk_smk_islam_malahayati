import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../../../shared/DashboardCard';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Row, Col, Alert, Button, Modal, CloseButton, ToastContainer, Toast, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTracerStudy, fetchTracerStudyDetail } from '../../../../redux/slice/tracerStudySlice';
import { ArrowLeft } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

export default function DetailTracerStudy() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { tracerStudyDetail, loading, error } = useSelector((state) => state.tracerStudy);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', message: '' });

    const personalInfoFields = [
        { key: 'nisn', label: 'NISN' },
        { key: 'nis', label: 'NIS' },
        { key: 'nama_lengkap', label: 'Nama Lengkap' },
        { key: 'jenis_kelamin', label: 'Jenis Kelamin' },
        { key: 'kota_kelahiran', label: 'Kota Kelahiran' },
        { key: 'tanggal_lahir', label: 'Tanggal Lahir' },
        { key: 'agama', label: 'Agama' },
        { key: 'tahun_lulus', label: 'Tahun Lulus' },
        { key: 'email', label: 'Email' },
        { key: 'jurusan', label: 'Jurusan' },
        { key: 'handphone', label: 'No Handphone / No WhatsApp' },
        { key: 'alamat', label: 'Alamat Tempat Tinggal' },
    ];

    const feedbackFields = [
        { key: 'kepuasan_materi', label: '1. Berikan kepuasan Anda terhadap materi yang dipelajari di SMK Islam Malahayati?' },
        { key: 'kepuasan_fasilitas', label: '2. Berikan kepuasan Anda terhadap fasilitas (laboratorium, alat praktik, dll.) yang disediakan oleh SMK Islam Malahayati?' },
        { key: 'kepuasan_guru', label: '3. Berikan kepuasan Anda terhadap kualitas guru di SMK Islam Malahayati?' },
        { key: 'saran_smk', label: '4. Berikan saran Anda untuk meningkatkan kualitas keseluruhan di SMK Islam Malahayati.' },
    ];

    useEffect(() => {
        dispatch(fetchTracerStudyDetail(id));
    }, [dispatch, id]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date)) return '-';

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const handleDelete = () => {
        setShowConfirmModal(true);
    };
    
    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            if (!tracerStudyDetail?._id) {
            throw new Error('ID lowongan kerja tidak ditemukan');
            }
            await dispatch(deleteTracerStudy(tracerStudyDetail._id)).unwrap();
            setToastMessage({ type: "success", message: "Tracer Study ini berhasil dihapus!" });
            setShowToast(true);
            setTimeout(() => navigate("/tracerStudy"), 3000);
        } catch (err) {
            setToastMessage({ type: "danger", message: "Gagal hapus Tracer Study ini. Silakan coba lagi." });
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

    if (!tracerStudyDetail) return <p>Data Tracer Study tidak ditemukan</p>;

    return (
        <PageContainer title="Detail Tracer Study">
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
                    Detail
                </li>
                </ol>
            </nav>

            <div className="row mb-4 align-items-center">
                <div className="col-12 col-md-6">
                    <h4 className="fw-bold mb-0">Detail Tracer Study</h4>
                </div>
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="d-flex flex-column flex-md-row justify-content-end gap-2 gap-md-2">
                        <Link
                        to="/tracerStudy"
                        className="btn btn-outline-secondary d-flex align-items-center justify-content-center fw-medium"
                        >
                        <ArrowLeft size={18} className="me-2" />
                            Kembali
                        </Link>

                        <Button
                            variant="warning"
                            onClick={() => navigate(`/editTracerStudy/${tracerStudyDetail._id}`)}
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
                            onClick={() => handleDelete(tracerStudyDetail._id)}
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
            {tracerStudyDetail.status === 'Pending' && (
                    <>
                            <Alert
                                variant="white"
                                className="mb-4 fw-bold align-items-center"
                                style={{
                                    background: "linear-gradient(50deg, #fff1df, #ffffff)",
                                    color: "#062707",
                                    borderLeft: "6px solid #ffbd30",
                                    borderRight: "none",
                                    padding: "1.3rem", 
                                    borderRadius: "10px 0 0 10px",
                                }}
                            >
                                <FaClock style={{ color: "#ffbd30", fontSize: "1.2rem" }} className="mx-2"/>
                                 {tracerStudyDetail.status || 'Status not available'}
                            </Alert>
                    </>
            )}

            {tracerStudyDetail.status === 'Tolak' && (
                <>
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
                                {tracerStudyDetail.status || 'Status not available'}
                        </Alert>
                </>
            )}

            {tracerStudyDetail.status === 'Setuju' && (
                <>
                    <Alert
                        variant="white"
                        className="mb-4 fw-bold align-items-center"
                        style={{
                            background: "linear-gradient(50deg, #dffff4, #ffffff)",
                            color: "#062707",
                            borderLeft: "6px solid #23B85E",
                            borderRight: "none",
                            padding: "1.3rem", 
                            borderRadius: "10px 0 0 10px",
                        }}
                    >
                        <FaCheckCircle style={{ color: "#23B85E", fontSize: "1.2rem" }} className="mx-2"/>
                        {tracerStudyDetail.status || 'Status not available'}
                    </Alert>
                </>
            )}
            <DashboardCard>
                <>
                

                    <Row className="justify-content-center mb-4">
                        <Col md={6} className="text-center">
                            {tracerStudyDetail.foto_alumni && (
                                <img
                                    src={`http://localhost:5000/uploads/${tracerStudyDetail.foto_alumni}`}
                                    alt="Foto Alumni"
                                    className="img-fluid rounded"
                                    style={{ width: "130px", height: "180px", }}
                                />
                            )}
                        </Col>
                    </Row>

                    <h5 className="mb-3 fw-bold text-secondary">
                        A. Informasi Pribadi
                    </h5>
                    <div className="card shadow-sm border-0 p-3">
                        <Row>
                            {personalInfoFields.map(({ key, label }) => (
                                <Col md={6} className="mb-3" key={key}>
                                    <label className="form-label text-muted text-uppercase">{label}</label>
                                    {key === 'alamat' ? (
                                        <textarea
                                            className="form-control bg-light"
                                            value={tracerStudyDetail[key] || '-'}
                                            rows="3"
                                            disabled
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={
                                                key.toLowerCase().includes('tanggal') 
                                                    ? formatDate(tracerStudyDetail[key]) 
                                                    : tracerStudyDetail[key] || '-'
                                            }
                                            disabled
                                        />
                                    )}
                                </Col>
                            ))}
                        </Row>
                    </div>
                 

                    <h5 className="mb-3 mt-5 fw-bold text-secondary">
                        B. Aktivitas Setelah Lulus
                    </h5>
                    <div className="card shadow-sm border-0 p-3">
                        <Row>
                            <Col md={12} className="mb-3">
                                <label className="form-label text-muted text-uppercase">Status Siswa Saat Ini:</label>
                                <input
                                    type="text"
                                    className="form-control bg-light"
                                    value={tracerStudyDetail.status_anda || '-'}
                                    disabled
                                />
                            </Col>
                            {tracerStudyDetail.status_anda === 'Bekerja' && (
                                <>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label text-muted text-uppercase">Nama Perusahaan</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={tracerStudyDetail.nama_perusahaan || '-'}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label text-muted text-uppercase">Posisi/Jabatan</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={tracerStudyDetail.posisi_jabatan || '-'}
                                            disabled
                                        />
                                    </Col>
                                </>
                            )}
                            {tracerStudyDetail.status_anda === 'Melanjutkan Pendidikan' && (
                                <>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label text-muted text-uppercase">Nama Kampus</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={tracerStudyDetail.nama_kampus || '-'}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label text-muted text-uppercase">Program Studi</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={tracerStudyDetail.program_studi || '-'}
                                            disabled
                                        />
                                    </Col>
                                </>
                            )}
                        </Row>
                    </div>

                    <h5 className="mb-3 mt-5 fw-bold text-secondary">
                        C. Feedback untuk SMK Islam Malahayati
                    </h5>
                    <div className="card shadow-sm border-0 p-3">
                        <Row>
                            {feedbackFields.map(({ key, label }) => (
                                <Col md={12} className="mb-3" key={key}>
                                    <label className="form-label text-muted text-uppercase">{label}</label>
                                    {key === 'saran_smk' ? (
                                        <textarea
                                            className="form-control bg-light"
                                            value={tracerStudyDetail[key] || '-'}
                                            rows="4"
                                            disabled
                                        />
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={tracerStudyDetail[key] || '-'}
                                            disabled
                                        />
                                    )}
                                </Col>
                            ))}
                        </Row>
                    </div>
                </>
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
                            Apakah Anda yakin ingin menghapus tracer study ini?
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
