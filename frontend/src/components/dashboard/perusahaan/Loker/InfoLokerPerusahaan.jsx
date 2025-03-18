import PageContainer from 'src/components/container/PageContainer';
import "./InfoLokerPerusahaan.css";
import DashboardCard from '../../../shared/DashboardCard';
import { Table, Button, OverlayTrigger, Tooltip, Pagination, InputGroup, Form, Dropdown, Modal, CloseButton, ToastContainer, Toast, Spinner } from 'react-bootstrap';
import { BsEye, BsPencilSquare, BsPlus, BsTrash } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteInfoLokerPerusahaan, fetchInfoLokerPerusahaan } from '../../../redux/slice/infoLokerPerusahaanSlice';
import { Link} from 'react-router-dom';
import { Alert, CircularProgress } from "@mui/material";
import { FiAlertTriangle } from "react-icons/fi";
import { FaExclamationCircle } from 'react-icons/fa';

export default function InfoLokerPerusahaan() {
    const dispatch = useDispatch();
    const { infoLokerPerusahaan, loading, error } = useSelector((state) => state.infoLokerPerusahaan);
    const [deletingId, setDeletingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [filter, setFilter] = useState({ jenis: "", bidang: "" });
    const [showFilter, setShowFilter] = useState(false);
    const itemsPerPage = 5;

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            dispatch(fetchInfoLokerPerusahaan());
        };
        fetchData();
    }, [dispatch]);

    const filteredData = Array.isArray(infoLokerPerusahaan) ? infoLokerPerusahaan.filter((data) => {
        const nama = data.perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === "";
        const jenis_pekerjaan = filter.jenis ? data.jenis === filter.jenis : true;
        const bidang_pekerjaan = filter.bidang ? data.bidang === filter.bidang : true;
        return nama && jenis_pekerjaan && bidang_pekerjaan;
    }) : [];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleDelete = (id) => {
        setDeletingId(id); 
        setShowConfirmModal(true);
    };

    const confirmDelete = async () => {
        setIsSubmitting(true);
        try {
            if (!deletingId) {
                throw new Error('ID lowongan kerja tidak ditemukan');
            }
            await dispatch(deleteInfoLokerPerusahaan(deletingId)).unwrap();
            setToastMessage({ type: "success", message: "Info lowongan kerja ini berhasil dihapus!" });
            setShowToast(true);
            dispatch(fetchInfoLokerPerusahaan());
        } catch (err) {
            setToastMessage({ type: "danger", message: "Gagal hapus info lowongan kerja ini. Silakan coba lagi." });
            setShowToast(true);
        } finally {
            setIsSubmitting(false);
            setShowConfirmModal(false);
            setDeletingId(null);
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
        <PageContainer>
            <ToastContainer position="top-end" className="p-3 mt-5">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMessage.type}>
                    <Toast.Body className="text-white">{toastMessage.message}</Toast.Body>
                </Toast>
            </ToastContainer>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="fw-bold">
                    Info Lowongan Kerja
                </h4>
                <Link 
                    to="/add-info-loker"
                    className="btn btn-outline-primary d-flex align-items-center fw-semibold px-3 py-2 shadow-sm"
                    style={{
                    borderRadius: "8px",
                    transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#1b69bd";
                    e.target.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#1b69bd";
                    }}
                >
                    <BsPlus size={18} className="me-2" /> Tambah
                </Link>
            </div>
            <DashboardCard>
                <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
                    <InputGroup className="w-25">
                        <Form.Control
                            type="text"
                            placeholder="Cari nama perusahaan..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>

                    <Dropdown show={showFilter} onToggle={() => setShowFilter(!showFilter)}>
                        <Dropdown.Toggle
                            variant="outline-primary"
                            as="span"
                            style={{ all: "unset", cursor: "pointer" }}
                        >
                            <i 
                                className="bi bi-funnel"
                                style={{
                                    fontSize: "1.5rem",
                                    transition: "color 0.3s, transform 0.3s"
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#989898'}
                                onMouseLeave={(e) => e.target.style.color = 'black'}
                            />
                        </Dropdown.Toggle>

                        <Dropdown.Menu 
                            align="end" 
                            style={{ 
                                width: "190px", 
                                padding: "10px",
                                fontSize: "0.90rem"
                            }}
                        >
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: "0.90rem" }}>Jenis Pekerjaan</Form.Label>
                                    <Form.Select style={{ fontSize: "0.90rem" }} onChange={(e) => setFilter((prev) => ({ ...prev, jenis: e.target.value }))}>
                                        <option value="">Pilih</option>
                                        <option value="Full-Time">Full-Time</option>
                                        <option value="Kontrak">Kontrak</option>
                                        <option value="Part-Time">Part-Time</option>
                                        <option value="Freelance">Freelance</option>
                                        <option value="Magang">Magang</option>
                                        <option value="Volunteer">Volunteer</option>
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className="mb-1">
                                    <Form.Label style={{ fontSize: "0.90rem" }}>Bidang Pekerjaan</Form.Label>
                                    <Form.Select style={{ fontSize: "0.90rem" }} onChange={(e) => setFilter((prev) => ({ ...prev, bidang: e.target.value }))}>
                                        <option value="">Pilih</option>
                                        {[
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
                                        ].map((bidang, index) => (
                                            <option key={index} value={bidang}>{bidang}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className="table-responsive">
                    <Table className="table">
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Nama Perusahaan</th>
                                <th>Posisi</th>
                                <th>Lokasi</th>
                                <th>Jenis Pekerjaan</th>
                                <th>Bidang Pekerjaan</th>
                                <th className="text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((info, index) => (
                                <tr key={info._id || index}>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="text-truncate-loker">{info.perusahaan}</td>
                                    <td className="text-truncate-loker">{info.judul}</td>
                                    <td className="text-truncate-loker">{info.lokasi}</td>
                                    <td>{info.jenis}</td>
                                    <td className="text-truncate-loker">{info.bidang}</td>
                                    <td className="d-flex gap-2 justify-content-center">
                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id={`tooltip-detail-${info._id}`}>Lihat Detail</Tooltip>}
                                        >
                                            <Link to={`/detail_info_loker/${info._id}`}>
                                                <Button className="button-color-success">
                                                    <BsEye />
                                                </Button>
                                            </Link>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id={`tooltip-edit-${info._id}`}>Edit Lowongan</Tooltip>}
                                        >
                                            <Link to={`/edit_info_loker/${info._id}`}>
                                                <Button className="button-color-warning">
                                                    <BsPencilSquare />
                                                </Button>
                                            </Link>
                                        </OverlayTrigger>

                                        <OverlayTrigger
                                            placement="bottom"
                                            overlay={<Tooltip id={`tooltip-delete-${info._id}`}>Hapus Lowongan</Tooltip>}
                                        >
                                            <Button variant="outline-danger" onClick={() => handleDelete(info._id)} disabled={deletingId === info._id}>
                                                <BsTrash />
                                            </Button>
                                        </OverlayTrigger>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>

                <Pagination className="justify-content-end mt-3">
                    <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
                    {[...Array(totalPages).keys()].map((number) => (
                        <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
                </Pagination>
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