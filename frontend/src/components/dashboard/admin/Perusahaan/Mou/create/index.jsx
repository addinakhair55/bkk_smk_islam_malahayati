import PageContainer from 'src/components/container/PageContainer';
import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import { Button, Col, Form, Row, Card, CardBody, Alert, Spinner, Modal, CloseButton } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toast, ToastContainer } from 'react-bootstrap';
import { createMouPerusahaan } from '../../../../../redux/slice/mouPerusahaanSlice';
import { FaExclamationCircle, FaSave, FaTimes } from 'react-icons/fa';
import DashboardCard from '../../../../../shared/DashboardCard';
import { FiAlertTriangle } from 'react-icons/fi';

export default function CreateMouPerusahaan() {
    const [formData, setFormData] = useState({
        pihak_1: { nama_perusahaan: '', alamat: '', kontak_person: '', telepon: '', email: '', nama: '', jabatan: '' },
        pihak_2: { nama_perusahaan: '', alamat: '', kontak_person: '', telepon: '', email: '', nama: '', jabatan: '' },
        penanggung_jawab: { nama: '', kontak: '' },
        deskripsi_kerjasama: '',
        tanggal_mulai: '',
        tanggal_berakhir: '',
        dokumen_mou: null,
        status: 'Aktif'
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.perusahaan);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [fileColor, setFileColor] = useState('secondary');

    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
    
        setFormData((prev) => {
            const newData = { ...prev };
            let temp = newData;
    
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    temp[key] = value || '';
                } else {
                    temp[key] = temp[key] ? { ...temp[key] } : {};
                    temp = temp[key];
                }
            });
    
            return newData;
        });
    
        setErrors((prevErrors) => {
            let newErrors = { ...prevErrors };
        
            if (name.includes("telepon") || name === "penanggung_jawab.kontak") {
                const cleanedValue = value.replace(/-/g, "");
                newErrors[name] = /^\d{8,13}$/.test(cleanedValue) 
                    ? undefined 
                    : "Nomor harus memiliki 8 hingga 13 digit angka (boleh mengandung tanda (-))";
            } else {
                newErrors[name] = value.trim() === '' ? 'Wajib diisi' : undefined;
            }
        
            return newErrors;
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
    
        if (file) {
            if (file.type !== "application/pdf") {
                alert("Dokumen MoU harus dalam format PDF!");
                setFileColor("danger");
                return;
            }
            setFileColor("success");
        } else {
            setFileColor("secondary");
        }
    
        setFormData((prev) => ({
            ...prev,
            dokumen_mou: file || null,
        }));
    
        setErrors((prev) => ({
            ...prev,
            dokumen_mou: file ? null : "Dokumen MoU wajib diunggah",
        }));
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setShowConfirmModal(true);
    }
    
    const confirmSubmit = async () => {
       
        setIsSubmitting(true);
    
        let newErrors = {};
    
        Object.entries(formData).forEach(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    if (!subValue.trim()) {
                        newErrors[`${key}.${subKey}`] = "Wajib diisi";
                    } else if ((subKey === "telepon" || key === "penanggung_jawab" && subKey === "kontak") && !/^\d{10,13}$/.test(subValue)) {
                        newErrors[`${key}.${subKey}`] = "Nomor harus antara 10 hingga 13 digit";
                    }
                });
            } else if (key !== "dokumen_mou" && !value.trim()) {
                newErrors[key] = "Wajib diisi";
            }
        });
    
        if (!formData.dokumen_mou) {
            newErrors.dokumen_mou = "Dokumen MoU wajib diunggah";
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }
    
        const formDataToSend = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            if (key !== "dokumen_mou" && typeof value === "object" && value !== null) {
                Object.entries(value).forEach(([subKey, subValue]) => {
                    formDataToSend.append(`${key}[${subKey}]`, subValue);
                });
            } else if (key !== "dokumen_mou") {
                formDataToSend.append(key, value);
            }
        });
    
        if (formData.dokumen_mou) {
            formDataToSend.append("dokumen_mou", formData.dokumen_mou);
        }
    
        try {
            await dispatch(createMouPerusahaan(formDataToSend)).unwrap();
            setToastMessage({ type: "success", message: "MOU berhasil ditambahkan!" });
            setShowToast(true);
            setTimeout(() => navigate("/mou-perusahaan"), 3000);
        } catch (error) {
            setToastMessage({ type: "danger", message: "Gagal menambahkan MOU. Silakan coba lagi." });
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
        <PageContainer title="Tambah Baru MoU Perusahaan">
            <ToastContainer position="top-end" className="p-3 mt-5">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg={toastMessage.type}>
                    <Toast.Body className="text-white">{toastMessage.message}</Toast.Body>
                </Toast>
            </ToastContainer>
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link 
                        to="/mou-perusahaan" 
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
                        <span className="fw-medium">MoU Perusahaan</span>
                    </Link>
                </li>
                <li className="breadcrumb-item active text-secondary" aria-current="page">
                    Tambah Data
                </li>
                </ol>
            </nav>
            <div className="row mb-4 align-items-center">
                <div className="col-12 col-md-6">
                    <h4 className="fw-bold mb-0">Tambah Data MoU Perusahaan</h4>
                </div>
                <div className="col-12 col-md-6 mt-3 mt-md-0">
                    <div className="d-flex flex-column flex-md-row justify-content-end gap-2 gap-md-3">
                        <Button
                            type="submit"
                            className="fw-bold d-flex align-items-center justify-content-center gap-2"
                            style={{
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
                                    <FaSave size="clamp(14px, 2vw, 16px)" /> Tambah Baru
                                </>
                            )}
                        </Button>

                        <Button
                            variant="outline-secondary"
                            className="fw-bold d-flex align-items-center justify-content-center gap-2"
                            style={{
                                color: "#939393",
                                backgroundColor: "#ffffff",
                                border: "2px solid #939393",
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
                                e.target.style.color = "#939393";
                                e.target.style.border = "2px solid #939393";
                                e.currentTarget.style.transform = "scale(1)";
                            }}
                            type="button"
                            onClick={() => navigate("/mou-perusahaan")}
                        >
                            <FaTimes size="clamp(14px, 2vw, 16px)" /> Batal
                        </Button>
                    </div>
                </div>
            </div>

            <DashboardCard>
                {loading ? <CircularProgress /> : (
                    <Form>
                        <Row>
                            <div className="mb-4">
                                <Card.Title className="fw-bold text-secondary mb-1">A. Informasi Perusahaan Pihak 1</Card.Title>
                                <Card className="border-0 shadow-sm p-3">
                                    <CardBody>
                                    <Row>
                                    {[
                                        { id: 'pihak_1.nama_perusahaan', label: 'Nama Perusahaan' },
                                        { id: 'pihak_1.email', label: 'Email' },
                                        { id: 'pihak_1.kontak_person', label: 'Kontak Person' },
                                        { id: 'pihak_1.telepon', label: 'Telepon' },
                                        { id: 'pihak_1.nama', label: 'Nama Pihak 1' },
                                        { id: 'pihak_1.jabatan', label: 'Jabatan' },
                                        { id: 'pihak_1.alamat', label: 'Alamat', type: 'textarea' },
                                    ].map(({ id, label, type = 'text' }) => {
                                        const value = id.split('.').reduce((o, i) => (o ? o[i] : ''), formData);

                                        const errorMessage = errors[id];

                                        let borderColor = 'gray';
                                        if (errorMessage) {
                                            borderColor = 'red';
                                        } else if (value) {
                                            borderColor = 'green';
                                        }

                                        return (
                                            <Col md={id === 'pihak_1.alamat' ? 12 : 6} key={id}>
                                                <Form.Group controlId={id} className="mb-3">
                                                    <Form.Label className="text-secondary text-uppercase">{label}</Form.Label>
                                                    {type === 'textarea' ? (
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            name={id}
                                                            value={value}
                                                            onChange={handleChange}
                                                            required
                                                            style={{ borderColor }}
                                                        />
                                                    ) : (
                                                        <Form.Control
                                                            type={type}
                                                            name={id}
                                                            value={value}
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
                                    </CardBody>
                                </Card>
                            </div>
                            <div className="mb-4">
                                <Card.Title className="fw-bold text-secondary mb-1">B. Informasi Perusahaan Pihak 2</Card.Title>
                                <Card className="border-0 shadow-sm p-3">
                                    <CardBody>
                                    <Row>
                                    {[
                                        { id: 'pihak_2.nama_perusahaan', label: 'Nama Perusahaan' },
                                        { id: 'pihak_2.email', label: 'Email' },
                                        { id: 'pihak_2.kontak_person', label: 'Kontak Person' },
                                        { id: 'pihak_2.telepon', label: 'Telepon' },
                                        { id: 'pihak_2.nama', label: 'Nama Pihak 1' },
                                        { id: 'pihak_2.jabatan', label: 'Jabatan' },
                                        { id: 'pihak_2.alamat', label: 'Alamat', type: 'textarea' },
                                    ].map(({ id, label, type = 'text' }) => {
                                        const value = id.split('.').reduce((o, i) => (o ? o[i] : ''), formData);

                                        const errorMessage = errors[id];

                                        let borderColor = 'gray';
                                        if (errorMessage) {
                                            borderColor = 'red'; 
                                        } else if (value) {
                                            borderColor = 'green'; 
                                        }

                                        return (
                                            <Col md={id === 'pihak_2.alamat' ? 12 : 6} key={id}>
                                                <Form.Group controlId={id} className="mb-3">
                                                    <Form.Label className="text-secondary text-uppercase">{label}</Form.Label>
                                                    {type === 'textarea' ? (
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={3}
                                                            name={id}
                                                            value={value}
                                                            onChange={handleChange}
                                                            required
                                                            style={{ borderColor }}
                                                        />
                                                    ) : (
                                                        <Form.Control
                                                            type={type}
                                                            name={id}
                                                            value={value}
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
                                    </CardBody>
                                </Card>
                            </div>
                            

                            {/* Data lainnya */}
                            <div className="mb-4">
                                <Card.Title className="fw-bold text-secondary mb-1">C. Informasi Lainnya</Card.Title>
                                <Card className="border-0 shadow-sm">
                                    <Card.Body>
                                        <Row>
                                            {[
                                                { id: 'deskripsi_kerjasama', label: 'Deskripsi Kerjasama', type: 'textarea', col: 12 },
                                                { id: 'tanggal_mulai', label: 'Tanggal Mulai', type: 'date', col: 6 },
                                                { id: 'tanggal_berakhir', label: 'Tanggal Berakhir', type: 'date', col: 6 },
                                                { id: 'penanggung_jawab.nama', label: 'Nama Penanggung Jawab', col: 6 },
                                                { id: 'penanggung_jawab.kontak', label: 'Telepon Penanggung Jawab', col: 6 } // Sudah cukup, tidak perlu input tambahan
                                            ].map(({ id, label, type = 'text', col }) => {
                                                const value = id.split('.').reduce((o, i) => (o ? o[i] : ''), formData);
                                                const errorMessage = errors[id];

                                                let borderColor = 'gray';
                                                if (errorMessage) {
                                                    borderColor = 'red'; 
                                                } else if (value) {
                                                    borderColor = 'green'; 
                                                }

                                                return (
                                                    <Col md={col} key={id}>
                                                        <Form.Group controlId={id} className="mb-3">
                                                            <Form.Label className="text-secondary text-uppercase">{label}</Form.Label>
                                                            {type === 'textarea' ? (
                                                                <Form.Control as="textarea" rows={3} name={id} value={value} onChange={handleChange} required style={{ borderColor }}/>
                                                            ) : (
                                                                <Form.Control type={type} name={id} value={value} onChange={handleChange} required style={{ borderColor }}/>
                                                            )}
                                                            {errorMessage && <small className="text-danger">{errorMessage}</small>}
                                                        </Form.Group>
                                                    </Col>
                                                );
                                            })}
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </div>


                        </Row>

                        <Form.Group controlId="dokumen_mou" className="mb-3">
                            <Form.Label>Dokumen MoU</Form.Label>
                            <Form.Control 
                                type="file" 
                                accept="application/pdf" 
                                onChange={handleFileChange} 
                                isInvalid={!!errors.dokumen_mou}
                                className={`border border-${fileColor}`}
                            />
                            {errors.dokumen_mou && <Form.Control.Feedback type="invalid">{errors.dokumen_mou}</Form.Control.Feedback>}
                        </Form.Group>
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
                            Apakah Anda yakin ingin menambah MoU?
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
