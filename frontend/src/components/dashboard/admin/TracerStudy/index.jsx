import PageContainer from "src/components/container/PageContainer";
import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTracerStudy, updateStatus, deleteTracerStudy } from "../../../redux/slice/tracerStudySlice";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Tooltip, OverlayTrigger, Form, InputGroup, Dropdown, Table, Button, Alert, Spinner, ToastContainer, Toast, CloseButton } from "react-bootstrap";
import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";
import "./TracerStudy.css"
import { FaChevronLeft, FaChevronRight, FaExclamationCircle, FaQuestion } from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { FiAlertTriangle } from "react-icons/fi";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";

export default function AdminTracerStudy() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tracerStudy, loading, error } = useSelector((state) => state.tracerStudy);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const [selectedTracerStudyId, setSelectedTracerStudyId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState({ jenis_kelamin: "", tahun_lulus: "", status: "" });
  const [showFilter, setShowFilter] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: "", message: "" });
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
      console.error("Ada kesalahan saat mengubah status tracer study di Redux!", error);
      setToastMessage({ type: "danger", message: "Gagal mengubah status. Silakan coba lagi." });
      setShowToast(true);
      setShowModal(false);
    }

    try {
      await axios.patch(`http://localhost:5000/tracer-study/${selectedTracerStudyId}/status`, { status: newStatus });
    } catch (error) {
      console.error("Ada kesalahan saat mengubah status tracer study di backend!", error);
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

  useEffect(() => {
    setCurrentPage(1);
  }, [itemsPerPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("TracerStudy");
  
    worksheet.columns = [
      { header: "No", key: "no", width: 10 },
      { header: "Nama Lengkap", key: "nama_lengkap", width: 20 },
      { header: "Jenis Kelamin", key: "jenis_kelamin", width: 15 },
      { header: "Tanggal Lahir", key: "tanggal_lahir", width: 15 },
      { header: "Kota Kelahiran", key: "kota_kelahiran", width: 15 },
      { header: "Agama", key: "agama", width: 15 },
      { header: "Alamat", key: "alamat", width: 30 },
      { header: "NISN", key: "nisn", width: 15 },
      { header: "NIS", key: "nis", width: 15 },
      { header: "Tahun Lulus", key: "tahun_lulus", width: 15 },
      { header: "Email", key: "email", width: 20 },
      { header: "Handphone", key: "handphone", width: 15 },
      { header: "Jurusan", key: "jurusan", width: 15 },
      { header: "Status Anda", key: "status_anda", width: 15 },
      { header: "Nama Perusahaan", key: "nama_perusahaan", width: 20 },
      { header: "Posisi Jabatan", key: "posisi_jabatan", width: 15 },
      { header: "Nama Kampus", key: "nama_kampus", width: 20 },
      { header: "Program Studi", key: "program_studi", width: 15 },
      { header: "Kepuasan Materi", key: "kepuasan_materi", width: 15 },
      { header: "Kepuasan Fasilitas", key: "kepuasan_fasilitas", width: 15 },
      { header: "Kepuasan Guru", key: "kepuasan_guru", width: 15 },
      { header: "Saran SMK", key: "saran_smk", width: 30 },
      { header: "Foto Alumni", key: "foto_alumni", width: 30 },
      { header: "Status", key: "status", width: 15 },
    ];
  
    const bulanIndonesia = [
      "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const formatTanggal = (tanggalString) => {
      if (!tanggalString) return "";
      const tanggal = new Date(tanggalString);
      const hari = tanggal.getDate();
      const bulan = bulanIndonesia[tanggal.getMonth() + 1];
      const tahun = tanggal.getFullYear();
      return `${hari} ${bulan} ${tahun}`;
    };
    for (const [index, user] of filteredData.entries()) {
      worksheet.addRow({
        no: index + 1,
        nama_lengkap: user.nama_lengkap || "",
        jenis_kelamin: user.jenis_kelamin || "",
        tanggal_lahir: formatTanggal(user.tanggal_lahir),
        kota_kelahiran: user.kota_kelahiran || "",
        agama: user.agama || "",
        alamat: user.alamat || "",
        nisn: user.nisn || "",
        nis: user.nis || "",
        tahun_lulus: user.tahun_lulus || "",
        email: user.email || "",
        handphone: user.handphone || "",
        jurusan: user.jurusan || "",
        status_anda: user.status_anda || "",
        nama_perusahaan: user.nama_perusahaan || "",
        posisi_jabatan: user.posisi_jabatan || "",
        nama_kampus: user.nama_kampus || "",
        program_studi: user.program_studi || "",
        kepuasan_materi: user.kepuasan_materi || "",
        kepuasan_fasilitas: user.kepuasan_fasilitas || "",
        kepuasan_guru: user.kepuasan_guru || "",
        saran_smk: user.saran_smk || "",
        foto_alumni: user.foto_alumni ? `http://localhost:5000/uploads/${user.foto_alumni}` : "",
        status: user.status || "",
      });
    }
  
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, "TracerStudy_Data.xlsx");
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
      <Button variant="success" onClick={exportToExcel}>
        Export to Excel
      </Button>
      <div className="d-flex justify-content-end align-items-center mb-3 gap-3">
        <InputGroup style={{width:"350px"}}>
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
              onMouseEnter={(e) => e.target.style.color = "#989898"}
              onMouseLeave={(e) => e.target.style.color = "black"}
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
                  <option value="Laki-laki">Laki-laki</option>
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
                <td className="text-truncate" style={{ maxWidth: "150px" }}>
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
                      className={`status-button ${user.status === "Pending" ? "pending" : user.status === "Setuju" ? "approved" : "rejected"}`}
                      onClick={() => handleStatusChange(user._id)}
                    >
                      {
                        user.status === "Pending" ? (
                          <i className="bi bi-hourglass-split pending-icon"></i>
                        ) : user.status === "Setuju" ? (
                          <i className="bi bi-check-circle-fill approved-icon"></i>
                        ) : user.status === "Tolak" ? (
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
                  Apakah Anda yakin ingin mengubah status Tracer Study ini menjadi {" "}
                  <span className="fw-semibold">{selectedStatus === "Setuju" ? "Tolak" : "Setuju"}</span>? 
                </p>
              </Modal.Body>
              <Modal.Footer className="border-0 d-flex justify-content-center w-100 pt-0">
                      <div className="row w-100 g-2">
                          <div className="col-12 col-md-6">
                              <Button
                                  onClick={() => handleConfirmStatusChange("Setuju")}
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
                                  Setuju
                              </Button>
                          </div>

                          <div className="col-12 col-md-6">
                              <Button
                                  onClick={() => handleConfirmStatusChange("Tolak")}
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
