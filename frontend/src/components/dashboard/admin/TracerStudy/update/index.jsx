import { useState, useEffect, useRef } from 'react';
import { Button, CloseButton, Col, Form, Modal, Row, Toast, ToastContainer } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { CircularProgress } from '@mui/material';
import DashboardCard from '../../../../shared/DashboardCard';
import { useDispatch, useSelector } from 'react-redux';
import { updateTracerStudy } from '../../../../redux/slice/tracerStudySlice';
import axios from 'axios';
import { FaPlus, FaSave, FaTimes } from 'react-icons/fa';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import { FiAlertTriangle } from 'react-icons/fi';

export default function UpdateTracerStudy() {
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

  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, loading, error } = useSelector(state => state.tracerStudy);
  const [preview, setPreview] = useState('');

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const cropperRef = useRef(null);
  const imageRef = useRef(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert('Token tidak ditemukan. Harap login ulang.');
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`http://localhost:5000/tracer-study/${id}`, config);
        const data = response.data;

        const formattedDate = new Date(data.tanggal_lahir).toISOString().split('T')[0];

        setFormData({
          ...data,
          tanggal_lahir: formattedDate
        });

        setPreview(`http://localhost:5000/uploads/${data.foto_alumni}`);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Gagal memuat data, silakan coba lagi.');
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

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
        setPreview(e.target.result);
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
          const previewUrl = URL.createObjectURL(blob);
          setPreview(previewUrl);
          setShowCropModal(false);
          }, 'image/jpeg');
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
 };

  const confirmSubmit = async () => {
    const updatedData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "foto_alumni" || formData[key] || !data?.foto_alumni) {
          if (formData[key] !== null) {
            updatedData.append(key, formData[key]);
          }
      }
    });

    try {
      await dispatch(updateTracerStudy({ id, updatedData })).unwrap();
      setToastMessage({ type: "success", message: "Tracer Study berhasil diperbarui!" });
      setShowToast(true);
      setTimeout(() => navigate("/tracerStudy"), 3000);
    } catch (error) {
      setToastMessage({ type: "danger", message: "Gagal mengubah data Tracer Study. Silakan coba lagi." });
      setShowToast(true);
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false)
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <PageContainer title="Edit Tracer Study">
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
              style={{ color: "blue", textDecoration: "none", transition: "color 0.3s ease" }}
              onMouseEnter={(e) => e.target.style.color = "darkblue"}
              onMouseLeave={(e) => e.target.style.color = "blue"}
              onMouseDown={(e) => e.target.style.color = "red"}
              onMouseUp={(e) => e.target.style.color = "darkblue"}
            >
              <span className="fw-medium">Tracer Study</span>
            </Link>
          </li>
          <li className="breadcrumb-item active text-secondary" aria-current="page">
            Edit
          </li>
        </ol>
      </nav>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-start mb-3">
                <h4 className="fw-bold mb-3 mb-md-0">
                    Edit Tracer Study
                </h4>
                <div className="d-flex justify-content-end gap-2">
                    <Button
                        type="submit"
                        className="fw-bold d-flex align-items-center justify-content-center gap-2 w-100 d-md-inline-flex text-center"
                        style={{
                            maxWidth: "120px",
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
                                <FaSave size="clamp(14px, 2vw, 16px)" /> Simpan
                            </>
                        )}
                    </Button>

                    <Button
                        variant="outline-secondary"
                        className="fw-bold d-flex align-items-center justify-content-center gap-2 w-100 d-md-inline-flex text-center"
                        style={{
                            maxWidth: "120px",
                            color: "#a0a0a0",
                            backgroundColor: "white",
                            border: "2px solid #a0a0a0",
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
                            e.target.style.color = "#a0a0a0";
                            e.target.style.border = "2px solid #a0a0a0";
                            e.currentTarget.style.transform = "scale(1)";
                        }}
                        type="button"
                        onClick={() => navigate("/tracerStudy")}
                    >
                        <FaTimes size="clamp(14px, 2vw, 16px)" /> Batal
                    </Button>
                </div>
            </div>

      <DashboardCard>
            {loading ? <CircularProgress /> : (
                <Form>
                    <h5 className="mb-3 fw-bold text-secondary">A. Informasi Pribadi</h5>
                    <div className="card shadow-sm border-0 p-3">
                      <Row>
                          <Col md={12} className="d-flex justify-content-center mb-4">
                              <Form.Group id="foto_alumni" className="mb-3 text-center">
                                  {(() => {
                                      const errorMessage = errors.foto_alumni;
                                      const borderColor = errorMessage ? "red" : formData.foto_alumni || data?.foto_alumni ? "green" : "gray";

                                      return (
                                      <>
                                          <Form.Label className="text-uppercase text-secondary">Pas Foto Formal</Form.Label>
                                          <div
                                            className="position-relative d-flex align-items-center justify-content-center"
                                            style={{
                                                border: `2px dashed ${borderColor}`,
                                                borderRadius: "10px",
                                                width: "130px",
                                                height: "180px",
                                                cursor: "pointer",
                                                overflow: "hidden",
                                                backgroundColor: "#f8f9fa",
                                                position: "relative",
                                            }}
                                            onClick={() => document.getElementById("fileInputAlumni").click()}
                                        >
                                        {preview || formData?.foto_alumni ? (
                                            <>
                                            <img
                                                src={preview || `http://localhost:5000/uploads/${formData.foto_alumni}`}
                                                alt="Foto Alumni"
                                                className="w-100 h-100 object-fit-cover"
                                            />
                                            <div
                                                className="position-absolute top-50 start-50 translate-middle text-white fw-bold bg-dark bg-opacity-50 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                                                style={{ fontSize: "12px", zIndex: 2 }}
                                            >
                                                <FaPlus size={20} />
                                                <small>Ubah Foto</small>
                                            </div>
                                            </>
                                        ) : (
                                            <div
                                                className="position-absolute top-50 start-50 translate-middle text-white fw-bold bg-dark bg-opacity-50 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                                                style={{ fontSize: "12px" }}
                                            >
                                                <FaPlus size={20} />
                                                <small>Upload Foto</small>
                                            </div>
                                        )}

                                        <input
                                            type="file"
                                            id="fileInputAlumni"
                                            name="foto_alumni"
                                            onChange={handleChange}
                                            accept=".png, .jpg, .jpeg"
                                            className="d-none"
                                            required={!formData?.foto_alumni}
                                        />
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
                                  <Form.Group id={id} className="mb-4">
                                      <Form.Label className="text-uppercase text-secondary">{label}</Form.Label>
                                      {type === 'select' ? (
                                          <Form.Select name={id} value={formData[id] || ''} onChange={handleChange} style={{ borderColor }} required>
                                              <option value="" disabled className="text-secondary">Pilih {label}</option>
                                                {options && options.map(option => (
                                                <option key={option} value={option}>{option}</option>
                                              ))}
                                          </Form.Select>
                                          ) : type === 'textarea' ? (
                                          <Form.Control 
                                              as="textarea" 
                                              name={id}
                                              value={formData[id] || ''} 
                                              onChange={handleChange} 
                                              rows={3} 
                                              required 
                                              style={{ borderColor }}
                                          />
                                          ) : (
                                          <Form.Control 
                                              type={type} 
                                              name={id}
                                              value={formData[id] || ''} 
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
                          <FaTimes /> Batal
                          </Button>
                          <Button variant="success" onClick={handleCrop} className="fw-bold px-4">
                          <FaSave /> Crop & Simpan
                          </Button>
                      </Modal.Footer>
                    </Modal>

                    <h5 className="mb-3 mt-4 fw-bold text-secondary">B. Aktivitas Setelah Lulus</h5>
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

                    <h5 className="mb-3 mt-4 fw-bold text-secondary">C. Feedback untuk SMK Islam Malahayati</h5>
                    <div className="card shadow-sm border-0 p-3">
                        {(() => {
                            const errorMessage = errors?.status_anda;
                            const borderColor = errorMessage ? "red" : formData.status_anda ? "green" : "gray";

                            return (
                            <Row>
                                {feedbackFields.map(({ id, label, type, options }) => (
                                <Col md={12} key={id}>
                                    <Form.Group id={id} className="mb-3">
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
                            Apakah Anda yakin ingin mengubah tracer study ini?
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