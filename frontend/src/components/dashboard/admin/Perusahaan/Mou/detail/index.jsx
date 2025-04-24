import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { deleteMouPerusahaan, fetchMouDetailById } from '../../../../../redux/slice/mouPerusahaanSlice';
import PageContainer from 'src/components/container/PageContainer';
import { ArrowLeft } from "lucide-react"
import DashboardCard from '../../../../../shared/DashboardCard';
import { Alert, Button, CloseButton, Modal, Spinner, Toast, ToastContainer } from 'react-bootstrap';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { FiDownload } from 'react-icons/fi';

export default function DetailMouPerusahaan() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const { mouDetail, loading, error } = useSelector(state => state.perusahaan);
    const [previewUrl, setPreviewUrl] = useState('');

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', message: '' });

    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        dispatch(fetchMouDetailById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (mouDetail?.dokumen_mou) {
            setPreviewUrl(`http://localhost:5000/uploads/${mouDetail.dokumen_mou}`);
        }
    }, [mouDetail]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleDelete = () => {
        setDeletingId(id); 
        setShowConfirmModal(true);
    };
    
    const confirmDelete = async () => {
            setIsSubmitting(true);
            try {
              if (!deletingId) {
                throw new Error("ID lowongan kerja tidak ditemukan");
              }
              await dispatch(deleteMouPerusahaan(deletingId)).unwrap();
              setToastMessage({ type: "success", message: "MoU ini berhasil dihapus!" });
              setShowToast(true);
              setTimeout(() => navigate("/mou-perusahaan"), 3000);
            } catch (err) {
                setToastMessage({ type: "danger", message: "Gagal hapus MoU ini. Silakan coba lagi." });
                setShowToast(true);
            } finally {
              setIsSubmitting(false);
              setShowConfirmModal(false);
              setDeletingId(null);
            }
    };

    const handleDownload = async () => {
        try {
            const response = await fetch(previewUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/pdf',
                },
            });
    
            if (!response.ok) {
                throw new Error('Gagal mengunduh dokumen');
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = mouDetail?.dokumen_mou || 'dokumen_mou.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setToastMessage({ type: 'danger', message: 'Gagal mengunduh dokumen. Silakan coba lagi.' });
            setShowToast(true);
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

    if (!mouDetail) return <p className="text-center">Data MoU tidak ditemukan</p>;

    return (
        <PageContainer>
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
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link 
                        to="/mou-perusahaan" 
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
                        <span className="fw-medium">MoU Perusahaan</span>
                    </Link>
                </li>
                <li className="breadcrumb-item active text-secondary" aria-current="page">
                    Detail
                </li>
                </ol>
            </nav>


            <div className="row mb-4 align-items-center">
                <div className="col-12 col-md-6">
                    <h4 className="fw-bold mb-0">Detail MoU</h4>
                </div>
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="d-flex flex-column flex-md-row justify-content-end gap-2 gap-md-2">
                        <Link
                        to="/mou-perusahaan"
                        className="btn btn-outline-secondary d-flex align-items-center justify-content-center fw-medium"
                        >
                        <ArrowLeft size={18} className="me-2" />
                            Kembali
                        </Link>

                        <Button
                            variant="warning"
                            onClick={() => navigate(`/editMouPerusahaan/${mouDetail._id}`)}
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
                            onClick={() => handleDelete(mouDetail._id)}
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

                {mouDetail.status === 'Aktif' && (
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
                            {mouDetail.status || 'Status not available'}
                        </Alert>
                    </>
                )}

                {mouDetail.status === 'Tidak Aktif' && (
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
                                {mouDetail.status || 'Status not available'}
                            </Alert>
                    </>
                )}

                {['A. Informasi Perusahaan Pihak 1', 'B. Informasi Perusahaan Pihak 2'].map((section, index) => (
                    <div key={index} className="mb-4">
                        <h5 className="fw-bold text-secondary">{section}</h5>
                            <div className="card shadow-sm border-0 p-3">
                                <div className="row">
                                    {['nama_perusahaan', 'email', 'kontak_person', 'telepon', 'nama', 'jabatan', 'alamat'].map((field, idx) => (
                                        <div className={field === 'alamat' ? "col-md-12 mb-3" : "col-md-6 mb-3"} key={idx}>
                                            <label className="form-label text-muted">{field.replace('_', ' ').toUpperCase()}</label>
                                            {field === 'alamat' ? (
                                                <textarea
                                                    className="form-control bg-light"
                                                    value={mouDetail[`pihak_${index + 1}`]?.[field] || ''}
                                                    disabled
                                                    rows={3}
                                                    style={{ resize: 'vertical', overflow: 'auto' }}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control bg-light"
                                                    value={mouDetail[`pihak_${index + 1}`]?.[field] || ''}
                                                    disabled
                                                    style={{
                                                        overflowX: 'auto', 
                                                        whiteSpace: 'nowrap', 
                                                        cursor: 'text'       
                                                    }}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                    </div>
                ))}

                <h5 className="fw-bold text-secondary">C. Informasi Lainnya</h5>
                <div className="card shadow-sm border-0 p-3">
                    <div className="row">
                        <div className="col-md-12 mb-3">
                            <label className="form-label text-muted text-uppercase">Deskripsi Kerja sama</label>
                            <textarea
                                className="form-control bg-light"
                                value={mouDetail.deskripsi_kerjasama || ''}
                                disabled
                                rows={3}
                                style={{ resize: 'vertical', overflow: 'auto' }}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-muted">Tanggal Mulai</label>
                            <input type="text" className="form-control bg-light" value={formatDate(mouDetail.tanggal_mulai)} disabled />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-muted">Tanggal Berakhir</label>
                            <input type="text" className="form-control bg-light" value={formatDate(mouDetail.tanggal_berakhir)} disabled />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-muted">Nama Penanggung Jawab</label>
                            <input type="text" className="form-control bg-light" value={mouDetail.penanggung_jawab.nama || ''} disabled />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-muted">Kontak Penanggung Jawab</label>
                            <input type="text" className="form-control bg-light" value={mouDetail.penanggung_jawab.kontak || ''} disabled />
                        </div>
                    </div>
                </div>
                {previewUrl && (
                <div className="mt-4">
                    <div className="mb-2">
                        <Button
                            onClick={handleDownload}
                            className="fw-bold d-flex align-items-center justify-content-center"
                            style={{
                                backgroundColor: "#4A90E2",
                                border: "none",
                                transition: "background-color 0.2s ease-in-out",
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#357ABD";
                                e.currentTarget.style.transform = "scale(1.05)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#4A90E2";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                        >
                            <FiDownload size={18} className="me-2" />
                            Unduh Dokumen
                        </Button>
                    </div>
                    <iframe
                    src={previewUrl}
                    width="100%"
                    height="500"
                    className="border rounded shadow-sm"
                    title="Dokumen MoU Preview"
                    ></iframe>
                </div>
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
                            Apakah Anda yakin ingin menghapus MoU ini?
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
