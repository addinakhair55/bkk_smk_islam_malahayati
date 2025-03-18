import PageContainer from 'src/components/container/PageContainer';
import { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTracerStudy, updateStatus, deleteTracerStudy } from '../../../redux/slice/tracerStudySlice';
import { Link, useNavigate } from 'react-router-dom';
import { Modal, Tooltip, OverlayTrigger, Form, InputGroup, Dropdown, Table, Pagination, Button, Alert, Spinner, ToastContainer, Toast, CloseButton } from 'react-bootstrap';
import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";
import "./TracerStudy.css"
import { FaExclamationCircle, FaQuestion } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import { FiAlertTriangle } from 'react-icons/fi';
import axios from 'axios';

export default function AdminTracerStudy() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tracerStudy, loading, error } = useSelector((state) => state.tracerStudy);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedTracerStudyId, setSelectedTracerStudyId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ jenis_kelamin: "", tahun_lulus: "", status: "" });
  const [showFilter, setShowFilter] = useState(false);
  const itemsPerPage = 5;

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchTracerStudy());
  }, [dispatch]);

  const handleStatusChange = useCallback((id, status) => {
    setSelectedTracerStudyId(id);
    setSelectedStatus(status);
    setShowModal(true);
  }, []);

  const handleConfirmStatusChange = async (newStatus) => {
    try {
      await dispatch(updateStatus({ id: selectedTracerStudyId, status: newStatus })).unwrap();
      setToastMessage({ type: "success", message: `Status berhasil diubah menjadi ${newStatus}!` });
      setShowToast(true);
      setShowModal(false);
    } catch (error) {
      console.error('Ada kesalahan saat mengubah status tracer study di Redux!', error);
      setToastMessage({ type: "danger", message: "Gagal mengubah status. Silakan coba lagi." });
      setShowToast(true);
      setShowModal(false);
    }

    try {
      await axios.patch(`http://localhost:5000/tracer-study/${selectedTracerStudyId}/status`, { status: newStatus });
    } catch (error) {
      console.error('Ada kesalahan saat mengubah status tracer study di backend!', error);
    }
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
        await dispatch(deleteTracerStudy(deletingId)).unwrap();
        setToastMessage({ type: "success", message: "Tracer Study ini berhasil dihapus!" });
        setShowToast(true);
        setTimeout(() => navigate("/tracerStudy"), 3000);
      } catch (err) {
          setToastMessage({ type: "danger", message: "Gagal hapus tracer study ini. Silakan coba lagi." });
          setShowToast(true);
      } finally {
        setIsSubmitting(false);
        setShowConfirmModal(false);
        setDeletingId(null);
      }
  };

  const filteredData = tracerStudy.filter((user) =>
    (user.nama_lengkap.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.nis.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.nisn.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filter.jenis_kelamin ? user.jenis_kelamin === filter.jenis_kelamin : true) &&
    (filter.tahun_lulus ? user.tahun_lulus === filter.tahun_lulus : true) &&
    (filter.status ? user.status === filter.status : true)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        <InputGroup style={{width:'350px'}}>
          <Form.Control
            type="text"
            placeholder="Cari nama alumni, NIS, atau NISN..."
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
              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: "0.90rem" }}>Jenis Kelamin</Form.Label>
                <Form.Select 
                  style={{ fontSize: "0.90rem", padding: "4px", height: "30px" }}
                  onChange={(e) => setFilter((prev) => ({ ...prev, jenis_kelamin: e.target.value }))}
                >
                  <option value="">Pilih</option>
                  <option value="Laki-Laki">Laki-Laki</option>
                  <option value="Perempuan">Perempuan</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: "0.90rem" }}>Tahun Lulus</Form.Label>
                <Form.Select 
                  style={{ fontSize: "0.90rem", padding: "4px", height: "30px" }}
                  onChange={(e) => setFilter((prev) => ({ ...prev, tahun_lulus: e.target.value }))}
                >
                  <option value="">Pilih</option>
                  {[...new Set(tracerStudy.map((user) => user.tahun_lulus))].map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: "0.90rem" }}>Status</Form.Label>
                <Form.Select
                  style={{ fontSize: "0.90rem", padding: "4px", height: "30px" }}
                  onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Pilih</option>
                  <option value="Pending">Pending</option>
                  <option value="Setuju">Setuju</option>
                  <option value="Tolak">Tolak</option>
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
              <th>NISN</th>
              <th>NIS</th>
              <th>Nama Lengkap</th>
              <th>Jenis Kelamin</th>
              <th>Tahun Lulus</th>
              <th>Status</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((user, index) => (
              <tr key={user._id || index}>
                <td>{index + 1}</td>
                <td>{user.nisn}</td>
                <td>{user.nis}</td>
                <td className="text-truncate" style={{ maxWidth: '150px' }}>
                  {user.nama_lengkap}
                </td>
                <td>{user.jenis_kelamin}</td>
                <td>{user.tahun_lulus}</td>
                <td>
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id="tooltip-status">Pilih untuk mengubah status alumni.</Tooltip>}
                  >
                    <Button
                      className={`status-button ${user.status === 'Pending' ? 'pending' : user.status === 'Setuju' ? 'approved' : 'rejected'}`}
                      onClick={() => handleStatusChange(user._id)}
                    >
                      {
                        user.status === 'Pending' ? (
                          <i className="bi bi-hourglass-split pending-icon"></i>
                        ) : user.status === 'Setuju' ? (
                          <i className="bi bi-check-circle-fill approved-icon"></i>
                        ) : user.status === 'Tolak' ? (
                          <i className="bi bi-x-circle-fill x-icon"></i>
                        ):null
                      }
                      {user.status}
                    </Button>
                  </OverlayTrigger>
                </td>
                <td className="d-flex flex-wrap gap-2 justify-content-center">
                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id={`tooltip-detail-${user._id}`}>Lihat Detail</Tooltip>}
                  >
                    <Link to={`/detailTracerStudy/${user._id}`}>
                      <Button className="icon-color">
                        <BsEye />
                      </Button>
                    </Link>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id={`tooltip-edit-${user._id}`}>Edit</Tooltip>}
                  >
                    <Link to={`/editTracerStudy/${user._id}`}>
                      <Button className="action-warning">
                        <BsPencilSquare />
                      </Button>
                    </Link>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="bottom"
                    overlay={<Tooltip id={`tooltip-delete-${user._id}`}>Hapus</Tooltip>}
                  >
                    <Button variant="outline-danger" onClick={() => handleDelete(user._id)}>
                      <BsTrash />
                    </Button>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      <Pagination className="justify-content-end mt-3">
        <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} />
        {[...Array(totalPages).keys()].map((number) => (
          <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} />
      </Pagination>

      {/* Modal untuk konfirmasi perubahan status */}
      <Modal
          show={showModal} onHide={() => setShowModal(false)} centered
          aria-labelledby="confirm-modal-title"
      >
          <div className="p-0 m-0 w-100" style={{ maxWidth: "500px" }}>
              <Modal.Body className="d-flex flex-column align-items-center text-center pb-0">
                  <FaQuestion
                      className="mb-3 rounded p-2"
                      style={{
                          fontSize: 'clamp(3rem, 6vw, 3rem)',
                          color: '#07a0ff',
                          backgroundColor: '#d6e5fa',
                      }}
                  />
                  <CloseButton
                      className="position-absolute top-0 end-0 m-2"
                      onClick={() => setShowModal(false)}
                      aria-label="Tutup modal"
                  />
                  <h5 className="fw-bold" style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)' }}>
                      Apakah Anda yakin?
                  </h5>
                <p className="text-muted" style={{ fontSize: 'clamp(0.875rem, 3vw, 1rem)' }}>
                  Apakah Anda yakin ingin mengubah status Tracer Study ini menjadi {" "}
                  <span className="fw-semibold">{selectedStatus === 'Setuju' ? 'Tolak' : 'Setuju'}</span>? 
                </p>
              </Modal.Body>
              <Modal.Footer className="border-0 d-flex justify-content-center w-100 pt-0">
                      <div className="row w-100 g-2">
                          <div className="col-12 col-md-6">
                              <Button
                                  onClick={() => handleConfirmStatusChange('Setuju')}
                                  className="fw-bold py-2 rounded-pill shadow-sm w-100 border-0"
                                  style={{
                                      color: '#ffffff',
                                      backgroundColor: '#2e7636',
                                      transition: 'all 0.2s ease-in-out',
                                  }}
                                  onMouseEnter={(e) => {
                                      e.target.style.backgroundColor = "#2e7636";
                                      e.currentTarget.style.transform = "scale(1.05)";
                                  }}
                                  onMouseLeave={(e) => {
                                      e.target.style.backgroundColor = "#2e7636";
                                      e.currentTarget.style.transform = "scale(1)";
                                  }}
                              >
                                  <i className="bi bi-check-circle-fill approved-icon me-1"></i>
                                  Setuju
                              </Button>
                          </div>

                          <div className="col-12 col-md-6">
                              <Button
                                  onClick={() => handleConfirmStatusChange('Tolak')}
                                  className="fw-bold py-2 rounded-pill shadow-sm w-100 border-0"
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
                                  <i className="bi bi-x-circle-fill x-icon me-1"></i>
                                  Tolak
                              </Button>
                          </div>
                          
                          <div className="col-12">
                              <Button
                                  variant="outline-secondary"
                                  onClick={() => setShowModal(false)}
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
                      </div>
                  </Modal.Footer>
          </div>
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
