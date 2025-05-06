import PageContainer from "src/components/container/PageContainer";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPerusahaan, updatePerusahaanStatus, deleteMouPerusahaan } from "../../../../redux/slice/mouPerusahaanSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Tooltip, OverlayTrigger, Form, InputGroup, Dropdown, Table, Button, Spinner, Alert, ToastContainer, Toast, CloseButton } from "react-bootstrap";
import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs"
import "./Mou.css"
import { FaChevronLeft, FaChevronRight, FaExclamationCircle, FaQuestion } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { FiAlertTriangle } from "react-icons/fi";

export default function AdminMouPerusahaan() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { perusahaan = [], loading, error } = useSelector((state) => state.perusahaan);

  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMouPerusahaanId, setSelectedMouPerusahaanId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ nama_perusahaan: "", tanggal_mulai: "", tanggal_berakhir: "", status: "" });
  const [showFilter, setShowFilter] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: ", message: " });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPerusahaan());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
  };

  const handleStatusChange = useCallback((id, status) => {
    setSelectedMouPerusahaanId(id);
    setSelectedStatus(status);
    setShowModal(true);
  }, []);

  const handleConfirmStatusChange = async (newStatus) => {
    dispatch(updatePerusahaanStatus({ id: selectedMouPerusahaanId, newStatus }));
    setShowModal(false);
    
    try {
      await axios.patch(`http://localhost:5000/mou-perusahaan/${selectedMouPerusahaanId}/status`, { status: newStatus });
    } catch (error) {
      console.error("Ada kesalahan saat mengubah status perusahaan!", error);
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

  const filteredData = perusahaan?.filter((data) => {
    const nama =
      data?.pihak_1?.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      data?.pihak_2?.nama_perusahaan?.toLowerCase().includes(searchTerm.toLowerCase());
  
    const status = filter.status ? data?.status === filter.status : true;
    const tanggalMulai = filter.tanggal_mulai
      ? new Date(data?.tanggal_mulai) >= new Date(filter.tanggal_mulai)
      : true;
    const tanggalBerakhir = filter.tanggal_berakhir
      ? new Date(data?.tanggal_berakhir) <= new Date(filter.tanggal_berakhir)
      : true;
  
    return nama && status && tanggalMulai && tanggalBerakhir;
  }) || [];
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
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
      <ToastContainer position="top-end">
          <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMessage.type}>
              <Toast.Body className="d-flex align-items-center gap-2 text-white">
              {toastMessage.type === "success" && <i className="bi bi-check-circle-fill text-white fs-6"></i>}
              {toastMessage.type === "danger" && <i className="bi bi-x-circle-fill text-white fs-6"></i>}
              {toastMessage.type === "warning" && <i className="bi bi-exclamation-triangle-fill text-white fs-6"></i>}
              <strong>{toastMessage.message}</strong>
              </Toast.Body>
          </Toast>
      </ToastContainer>
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        <InputGroup style={{width:'350px'}}>
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
              onMouseEnter={(e) => e.target.style.color = "#989898"}
              onMouseLeave={(e) => e.target.style.color = "black"}
            />
          </Dropdown.Toggle>

          {/* Ubah ukuran dropdown menu */}
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
                <Form.Label style={{ fontSize: "0.90rem" }}>Status</Form.Label>
                <Form.Select 
                  style={{ fontSize: "0.90rem", padding: "4px", height: "30px" }}
                  onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value }))}
                >
                  <option value="">Pilih</option>
                  <option value="Aktif">Aktif</option>
                  <option value="Tidak Aktif">Tidak Aktif</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: "0.90rem" }}>Tanggal Mulai</Form.Label>
                <Form.Control
                  type="date"
                  style={{ fontSize: "0.90rem", padding: "4px", height: "30px" }}
                  onChange={(e) => setFilter((prev) => ({ ...prev, tanggal_mulai: e.target.value }))}
                />
              </Form.Group>

              <Form.Group className="mb-2">
                <Form.Label style={{ fontSize: "0.90rem" }}>Tanggal Berakhir</Form.Label>
                <Form.Control
                  type="date"
                  style={{ fontSize: "0.90rem", padding: "4px", height: "30px" }}
                  onChange={(e) => setFilter((prev) => ({ ...prev, tanggal_berakhir: e.target.value }))}
                />
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
              <th>Pihak 1</th>
              <th>Pihak 2</th>
              <th>Penanggung Jawab</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Akhir</th>
              <th>Status</th>
              <th className="text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((company, index) => (
              <tr key={company._id || index}>
                <td>{index + 1}</td>
                <td className="text-truncate">
                  {company.pihak_1.nama_perusahaan}
                </td>
                <td className="text-truncate">
                  {company.pihak_2.nama_perusahaan}
                </td>
                <td className="text-truncate">
                  {company.penanggung_jawab.nama}
                </td>
                <td>{formatDate(company.tanggal_mulai)}</td>
                <td>{formatDate(company.tanggal_berakhir)}</td>
                <td>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={
                        <Tooltip id="tooltip-status">
                          Pilih untuk mengubah status perusahaan.
                        </Tooltip>
                      }
                    >
                      <Button
                        className={`status-button ${company.status === "Aktif" ? "active" : company.status === "Tidak Aktif" ? "inactive" : ""}`}
                        onClick={() => handleStatusChange(company._id, company.status)}
                      >
                        {
                          company.status === "Aktif" ? (
                            <i className="bi bi-check-circle-fill approved-icon"></i>
                          ) : company.status === "Tidak Aktif" ? (
                            <i className="bi bi-x-circle-fill x-icon"></i>
                          ) : null
                        }
                        {company.status}
                      </Button>
                    </OverlayTrigger>
                </td>
                <td className="d-flex gap-2 justify-content-center">
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id={`tooltip-detail-${company._id}`}>Lihat Detail</Tooltip>}
                >
                  <Link to={`/detailMouPerusahaan/${company._id}`}>
                    <Button className="icon-color">
                      <BsEye />
                    </Button>
                  </Link>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id={`tooltip-edit-${company._id}`}>Edit</Tooltip>}
                >
                  <Link to={`/editMouPerusahaan/${company._id}`}>
                    <Button className="action-warning">
                      <BsPencilSquare />
                    </Button>
                  </Link>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id={`tooltip-delete-${company._id}`}>Hapus</Tooltip>}
                >
                  <Button variant="outline-danger" onClick={() => handleDelete(company._id)}>
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
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center my-3 gap-2 flex-wrap">
        <Button
          size="sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="p-2 d-flex align-items-center"
          style={{
            backgroundColor: "transparent",
            color: currentPage === 1 ? "#6c757d" : "#4065B6",
            border: `1px solid ${currentPage === 1 ? "#6c757d" : "#4065B6"}`,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              e.target.style.backgroundColor = "#4065B6";
              e.target.style.color = "white";
              e.target.style.borderColor = "#4065B6";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = currentPage === 1 ? "#6c757d" : "#4065B6";
            e.target.style.borderColor = currentPage === 1 ? "#6c757d" : "#4065B6";
          }}
        >
          <FaChevronLeft />
        </Button>

        <div className="d-flex justify-content-center">
          <InputGroup size="sm" className="w-auto">
            <InputGroup.Text className="bg-light fw-semibold">Per halaman</InputGroup.Text>
            <Form.Select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              size="sm"
              className="shadow-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={filteredData.length}>Semua</option>
            </Form.Select>
          </InputGroup>
        </div>

        <Button
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="p-2 d-flex align-items-center"
          style={{
            backgroundColor: "transparent",
            color: currentPage === totalPages ? "#6c757d" : "#4065B6",
            border: `1px solid ${currentPage === totalPages ? "#6c757d" : "#4065B6"}`,
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              e.target.style.backgroundColor = "#4065B6";
              e.target.style.color = "white";
              e.target.style.borderColor = "#4065B6";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = currentPage === totalPages ? "#6c757d" : "#4065B6";
            e.target.style.borderColor = currentPage === totalPages ? "#6c757d" : "#4065B6";
          }}
        >
          <FaChevronRight />
        </Button>
      </div>

        <Modal
            show={showModal} onHide={() => setShowModal(false)} centered
            aria-labelledby="confirm-modal-title"
        >
            <div className="p-0 m-0 w-100" style={{ maxWidth: "500px" }}>
                <Modal.Body className="d-flex flex-column align-items-center text-center pb-0">
                    <FaQuestion
                        className="mb-3 rounded p-2"
                        style={{
                            fontSize: "clamp(3rem, 6vw, 3rem)",
                            color: "#07a0ff",
                            backgroundColor: "#d6e5fa",
                        }}
                    />
                    <CloseButton
                        className="position-absolute top-0 end-0 m-2"
                        onClick={() => setShowModal(false)}
                        aria-label="Tutup modal"
                    />
                    <h5 className="fw-bold" style={{ fontSize: "clamp(1.25rem, 4vw, 1.5rem)" }}>
                        Apakah Anda yakin?
                    </h5>
                    <p className="text-muted" style={{ fontSize: "clamp(0.875rem, 3vw, 1rem)" }}>
                      Apakah Anda yakin ingin mengubah status MoU perusahaan ini menjadi {" "}
                      <span className="fw-semibold">{selectedStatus === "Aktif" ? "Tidak Aktif" : "Aktif"}</span>? 
                    </p>
                </Modal.Body>
                <Modal.Footer className="border-0 d-flex justify-content-center w-100 pt-0">
                        <div className="row w-100 g-2">
                            <div className="col-12 col-md-6">
                                <Button
                                    onClick={() => handleConfirmStatusChange("Aktif")}
                                    className="fw-bold py-2 rounded-pill shadow-sm w-100 border-0"
                                    style={{
                                        color: "#ffffff",
                                        backgroundColor: "#2e7636",
                                        transition: "all 0.2s ease-in-out",
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
                                    Aktif
                                </Button>
                            </div>

                            <div className="col-12 col-md-6">
                                <Button
                                    onClick={() => handleConfirmStatusChange("Tidak Aktif")}
                                    className="fw-bold py-2 rounded-pill shadow-sm w-100 border-0"
                                    style={{
                                      color: "#ffffff",
                                      backgroundColor: "#fe0202",
                                      transition: "all 0.2s ease-in-out",
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
                                    Tidak Aktif
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
                            fontSize: "clamp(3rem, 6vw, 3rem)",
                            color: "#ff0707",
                            backgroundColor: "#fad6d6",
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
                                        color: "#ffffff",
                                        backgroundColor: "#fe0202",
                                        transition: "all 0.2s ease-in-out",
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
