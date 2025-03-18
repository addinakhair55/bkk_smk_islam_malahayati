import PageContainer from 'src/components/container/PageContainer';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInfoLoker, deleteInfoLoker } from '../../../redux/slice/infoLokerSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Pagination, Form, InputGroup, Dropdown, Table, Button, OverlayTrigger, Tooltip, Spinner, Alert, ToastContainer, Toast, Modal, CloseButton } from 'react-bootstrap';
import './Loker.css';
import { BsEye, BsPencilSquare, BsTrash } from 'react-icons/bs';
import { FaExclamationCircle } from 'react-icons/fa';
import { FiAlertTriangle } from 'react-icons/fi';
import { CircularProgress } from '@mui/material';

export default function AdminInfoLoker() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { infoLoker, status, error } = useSelector((state) => state.infoLoker);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ jenis: "" });
  const [showFilter, setShowFilter] = useState(false);
  const itemsPerPage = 5;

  const filteredData = Array.isArray(infoLoker) ? infoLoker.filter((data) => {
    const nama = data.perusahaan.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === "";
    const jenis_pekerjaan = filter.jenis ? data.jenis === filter.jenis : true;
    const bidang_pekerjaan = filter.bidang ? data.bidang === filter.bidang : true;
    return nama && jenis_pekerjaan && bidang_pekerjaan;
  }) : [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    dispatch(fetchInfoLoker());
  }, [dispatch]);

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
        await dispatch(deleteInfoLoker(deletingId)).unwrap();
        setToastMessage({ type: "success", message: "Info lowongan Kerja ini berhasil dihapus!" });
        setShowToast(true);
        setTimeout(() => navigate("/info-lowongan-kerja"), 3000);
      } catch (err) {
          setToastMessage({ type: "danger", message: "Gagal hapus info lowongan kerja ini. Silakan coba lagi." });
          setShowToast(true);
      } finally {
        setIsSubmitting(false);
        setShowConfirmModal(false);
        setDeletingId(null);
      }
  };

  if (status === 'loading') 
    return <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
  ;
  
  if (status === 'failed') return 
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
  ;

  return (
    <PageContainer title="Info Lowongan Kerja">
            <ToastContainer position="top-end" className="p-3 mt-5">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMessage.type}>
                    <Toast.Body className="text-white">{toastMessage.message}</Toast.Body>
                </Toast>
            </ToastContainer>
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
                          <Link to={`/detailLowongan/${info._id}`}>
                            <Button className="icon-color">
                              <BsEye />
                            </Button>
                          </Link>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="bottom"
                          overlay={<Tooltip id={`tooltip-edit-${info._id}`}>Edit</Tooltip>}
                        >
                          <Link to={`/editLowongan/${info._id}`}>
                            <Button className="action-warning">
                              <BsPencilSquare />
                            </Button>
                          </Link>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="bottom"
                          overlay={<Tooltip id={`tooltip-delete-${info._id}`}>Hapus</Tooltip>}
                        >
                          <Button variant="outline-danger" onClick={() => handleDelete(info._id)}>
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
