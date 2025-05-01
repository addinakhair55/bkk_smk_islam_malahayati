import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUser, updateUserProfile } from "../../../components/redux/slice/authSlice";
import DashboardCard from "../../../components/shared/DashboardCard";
import PageContainer from "../../../components/container/PageContainer";
import ProfileImg from "../../../assets/images/profile/user-1.jpg";
import { FaExclamationCircle, FaPencilAlt, FaPlus, FaSave, FaTimes} from "react-icons/fa";
import { CircularProgress } from "@mui/material";
import { Alert, Button, CloseButton, Modal, Spinner, Toast, ToastContainer } from "react-bootstrap";
import Cropper from "react-cropper";
import { FiAlertTriangle } from "react-icons/fi";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isLoading, error } = useSelector((state) => state.auth);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    fotoProfile: null,
    noTelp: "",
    cv: null,
  });

  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [image, setImage] = useState(null);
  const [cropper, setCropper] = useState(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!token && !storedToken) {
      navigate("/auth/login");
    } else if (!token && storedToken) {
      dispatch(getUser());
    }
  }, [dispatch, navigate, token]);

  useEffect(() => {
    if (user) {
      setFormData({ 
        name: user.name, 
        email: user.email, 
        password: "", 
        noTelp: user.noTelp,
        cv: user.cv || null
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCVChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        cv: file,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (blob) {
          const croppedFile = new File([blob], "cropped-image.jpg", { type: "image/jpeg" });
          setFormData((prevState) => ({
            ...prevState,
            fotoProfile: croppedFile,
          }));
          setShowCropModal(false);
        }
      }, "image/jpeg");
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(formData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };
  
  const confirmSubmit = async () => {
    setIsSubmitting(true);

    const storedToken = localStorage.getItem("token");
    const authToken = token || storedToken;

    if (!authToken) {
      alert("Token tidak ditemukan, silakan login kembali.");
      setIsSubmitting(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);

    if (formData.password) {
      formDataToSend.append("password", formData.password);
    }

    formDataToSend.append("noTelp", formData.noTelp);

    if (formData.cv) {
      formDataToSend.append("cv", formData.cv);
    }

    if (formData.fotoProfile) {
      formDataToSend.append("fotoProfile", formData.fotoProfile);
    }

    try {
      await dispatch(updateUserProfile({ formData: formDataToSend, token: authToken })).unwrap();
      dispatch(getUser());
      setToastMessage({ type: "success", message: "Akun Anda berhasil diperbarui!" });
      setShowToast(true);
      setEditMode(false);
    } catch (err) {
      setToastMessage({ type: "danger", message: "Gagal memperbarui akun Anda. Silakan coba lagi." });
      setShowToast(true);
    } finally {
        setIsSubmitting(false);
        setShowConfirmModal(false);
    }
  };

  if (isLoading) {
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
    <PageContainer title="Pengaturan Akun">
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
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h4 className="fw-bold">Pengaturan Akun</h4>
        {editMode && (
        <div className="d-flex flex-row gap-2">
          <Button
            type="submit"
            className="fw-bold d-flex align-items-center justify-content-center gap-2 w-100 d-md-inline-flex text-center"
            style={{
              maxWidth: "120px",
              backgroundColor: "#4A90E2",
              border: "none",
              transition: "all 0.2s ease-in-out",
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
            {isSubmitting ? <CircularProgress size={20} color="inherit" /> : <><FaSave /> Simpan</>}
          </Button>

          <Button
            type="button"
            className="fw-bold d-flex align-items-center justify-content-center gap-2 w-100 d-md-inline-flex text-center"
            style={{
              maxWidth: "120px",
              backgroundColor: "transparent",
              color: "#808080",
              border: "2px solid grey",
              borderRadius: "5px",
              transition: "all 0.2s ease-in-out",
            }}
            onClick={handleCancel}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#808080";
              e.target.style.color = "white";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "transparent";
              e.target.style.color = "#808080";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <FaTimes /> Batal
          </Button>
        </div>
      )}

      </div>
      <DashboardCard>
        {error && <p className="alert alert-danger">{error}</p>}

        {editMode ? (
          
          <form>
            <div className="d-flex flex-column align-items-center justify-content-center mb-3">
              <label className="form-label text-uppercase">Foto Profile</label>
              <div className="d-flex flex-row align-items-center justify-content-center gap-2">
                <div
                  onClick={() => document.getElementById("fileInput").click()}
                  className="position-relative d-flex align-items-center justify-content-center rounded-circle border-secondary"
                  style={{
                    border: "2px dashed gray",
                    width: "120px",
                    height: "120px",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      formData.fotoProfile
                        ? URL.createObjectURL(formData.fotoProfile)
                        : user.fotoProfile
                        ? `http://localhost:5000/uploads/${user.fotoProfile}`
                        : ProfileImg
                    }
                    alt="User Profile"
                    className="w-100 h-100 rounded-circle object-fit-cover"
                  />
                  <div
                    className="position-absolute top-50 start-50 translate-middle text-white fw-bold bg-dark bg-opacity-50 w-100 h-100 d-flex flex-column align-items-center justify-content-center"
                    style={{ fontSize: "12px" }}
                  >
                    <FaPlus/>
                    Upload Foto
                  </div>
                </div>
                <input type="file" id="fileInput" className="d-none" accept="image/*" onChange={handleImageChange} />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label text-uppercase">Nama Lengkap</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    className="form-control" 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-uppercase">Nomor Telepon</label>
                  <input 
                    type="text" 
                    name="noTelp" 
                    value={formData.noTelp} 
                    onChange={handleChange} 
                    className="form-control" 
                    placeholder="Masukkan No Telepon Anda"
                    required 
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label text-uppercase">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    className="form-control" 
                    required 
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label text-uppercase">Password Terbaru</label>
                  <input 
                    type="password" 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    className="form-control" 
                    placeholder="Masukkan Password Terbaru Anda" 
                  />
                </div>
              </div>
            </div>

            {user?.role === 'alumni' && (
              <div className="mb-3">
                <label className="form-label text-uppercase">Upload CV (Optional)</label>
                <input 
                  type="file" 
                  name="cv" 
                  accept=".pdf,.doc,.docx" 
                  className="form-control" 
                  onChange={handleCVChange} 
                />
                {formData.cv && (
                  <p className="mt-2">
                    {user.cv ? (
                      <div className="mt-3">
                        <iframe 
                          src={`http://localhost:5000/uploads/${user.cv}`} 
                          width="100%" 
                          height="500px"
                          style={{ border: "1px solid #ddd", borderRadius: "5px" }}
                        />
                      </div>
                    ) : (
                      <p className="text-muted mt-2">Belum ada CV yang diunggah.</p>
                    )}
                  </p>
                )}
              </div>
            )}

          </form>
        ) : (
          <div className="text-center">
            {/* Foto Profil */}
            <div className="position-relative mx-auto" style={{ width: "120px", height: "120px" }}>
              <img
                src={user?.fotoProfile ? `http://localhost:5000/uploads/${user.fotoProfile}` : ProfileImg}
                alt="User Profile"
                className="rounded-circle w-100 h-100 object-fit-cover border border-secondary"
              />
            </div>

            {/* Informasi User */}
            <div className="mt-3">
              <h5 className="mb-1">{user?.name}</h5>
              <p className="text-muted mb-3">{user?.email}</p>
              
              {/* Tombol Edit */}
              <button onClick={() => setEditMode(true)} className="btn btn-warning w-100 fw-bold"
                style={{
                  backgroundColor: "#FFE066",
                  border: "none",
                  transition: "background-color 0.2s ease-in-out",
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#FFD43B";
                    e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#FFE066";
                    e.currentTarget.style.transform = "scale(1)";
                }}  
              >
                <FaPencilAlt className="me-2"/>
                Edit Akun
              </button>
            </div>
          </div>

        )}
      </DashboardCard>
      <Modal show={showCropModal} onHide={() => setShowCropModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Crop Foto Profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Cropper
            style={{ height: 300, width: "100%" }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview=".img-preview"
            src={image}
            viewMode={1}
            minCropBoxHeight={10}
            minCropBoxWidth={10}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false}
            onInitialized={(instance) => setCropper(instance)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCropModal(false)}>Batal</Button>
          <Button variant="primary" onClick={handleCrop}>Simpan</Button>
        </Modal.Footer>
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
                      Apakah Anda yakin perubahan data akun ini sudah sesuai?
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
                          maxWidth: '200px',
                          transition: 'all 0.2s ease-in-out',
                      }}
                  >
                      Batal
                  </Button>
                  <Button
                      variant="primary"
                      onClick={confirmSubmit}
                      className="fw-bold py-2 rounded-pill shadow-sm w-100"
                      disabled={isSubmitting}
                      style={{
                          maxWidth: '200px',
                          transition: 'all 0.2s ease-in-out',
                      }}
                  >
                      {isSubmitting ? (
                          <CircularProgress size={16} color="inherit" />
                      ) : (
                          <>Ya, Simpan</>
                      )}
                  </Button>
              </Modal.Footer>
          </div>
      </Modal>

    </PageContainer>
  );
};

export default Profile;
