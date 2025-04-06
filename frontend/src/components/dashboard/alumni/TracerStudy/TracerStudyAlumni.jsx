import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyTracerStudy } from '../../../redux/slice/tracerStudySliceAlumni';
import { Card, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../../shared/DashboardCard';
import { Link, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react';
import { BsPencilSquare } from 'react-icons/bs';
import { FaCheckCircle, FaClock, FaExclamationCircle } from 'react-icons/fa';

const TracerStudyAlumni = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { tracerStudy = {}, loading, error } = useSelector(
    (state) => state.tracerStudyAlumni
  );

  useEffect(() => {
    dispatch(fetchMyTracerStudy());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return '-';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

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

  const PersonalInfoSection = () => (
    <>
      <h5 className="mb-3 fw-bold text-secondary">A. Informasi Pribadi</h5>
      <div className="card shadow-sm border-0 p-3">
        <Row>
          {personalInfoFields.map(({ key, label }) => (
            <Col md={6} className="mb-3" key={key}>
              <label className="form-label text-muted text-uppercase">{label}</label>
              {key === 'alamat' ? (
                <textarea
                  className="form-control bg-light"
                  value={tracerStudy[key] || '-'}
                  rows="3"
                  disabled
                />
              ) : (
                <input
                  type="text"
                  className="form-control bg-light"
                  value={
                    key.toLowerCase().includes('tanggal') 
                      ? formatDate(tracerStudy[key]) 
                      : tracerStudy[key] || '-'
                  }
                  disabled
                />
              )}
            </Col>
          ))}
        </Row>
      </div>
    </>
  );

  const FeedbackSection = () => (
    <>
      <h5 className="mb-3 mt-5 fw-bold text-secondary">C. Feedback untuk SMK Islam Malahayati</h5>
      <div className="card shadow-sm border-0 p-3">
        <Row>
          {feedbackFields.map(({ key, label }) => (
            <Col md={12} className="mb-3" key={key}>
              <label className="form-label text-muted text-uppercase">{label}</label>
              {key === 'saran_smk' ? (
                <textarea
                  className="form-control bg-light"
                  value={tracerStudy[key] || '-'}
                  rows="4"
                  disabled
                />
              ) : (
                <input
                  type="text"
                  className="form-control bg-light"
                  value={tracerStudy[key] || '-'}
                  disabled
                />
              )}
            </Col>
          ))}
        </Row>
      </div>
    </>
  );

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
                Gagal memuat data: {error}
          </Alert>
      </div>
    );
  }
  
  if (tracerStudy.nama_lengkap) {
    if (tracerStudy.status === 'Pending') {
      return (
        <PageContainer title="Data Anda masih dalam proses.">
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
                  Data Anda masih dalam proses pengecekan.
              </Alert>
        </PageContainer>
      );
    }
  
    if (tracerStudy.status === 'Tolak') {
      return (
        <PageContainer title="Data Anda ditolak">
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
                    Data Anda ditolak. Silakan hubungi admin BKK untuk informasi lebih lanjut.
              </Alert>
        </PageContainer>
      );
    }
  
    if (tracerStudy.status === 'Setuju') {
      return (
        <PageContainer title="Data Tracer Study">
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
                  {tracerStudy.status || 'Status not available'}
              </Alert>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center align-items-md-start mb-3">
                <h4 className="fw-bold mb-3 mb-md-0">Detail Tracer Study</h4>
                <div className="d-flex justify-content-end gap-2">
                    <Link 
                        to="/add-form-tracer-study" 
                        className="btn btn-outline-secondary d-flex align-items-center"
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
                    >
                        <ArrowLeft size={18} className="me-2" /> Kembali
                    </Link>
                                          
                    <Button
                        variant="warning"
                        onClick={() => navigate(`/edit-form-tracer-study/${tracerStudy._id}`)}
                        style={{
                          maxWidth: "120px",
                          width: "110px",
                          backgroundColor: "#ffcc00",
                          border: "none",
                          transition: "background-color 0.2s ease-in-out",
                        }}
                          onMouseEnter={(e) => {
                              e.target.style.backgroundColor = "#e9ba00";
                              e.currentTarget.style.transform = "scale(1.05)";
                          }}
                          onMouseLeave={(e) => {
                              e.target.style.backgroundColor = "#ffcc00";
                              e.currentTarget.style.transform = "scale(1)";
                          }}
                        >
                        <BsPencilSquare size={18} className="me-2" />
                        Edit
                    </Button>
                </div>
            </div>
          <DashboardCard>
            <Card.Body>
             
  
              {tracerStudy.foto_alumni && (
                <div className="text-center mb-4">
                  <img
                    src={`http://localhost:5000/uploads/${tracerStudy.foto_alumni}`}
                    alt="Foto Alumni"
                    className="img-fluid rounded-3"
                    style={{ width: "130px", height: "180px", }}
                  />
                </div>
              )}
  
              <PersonalInfoSection />
  
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
                                    value={tracerStudy.status_anda || '-'}
                                    disabled
                                />
                            </Col>
                            {tracerStudy.status_anda === 'Bekerja' && (
                                <>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label text-muted text-uppercase">Nama Perusahaan</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={tracerStudy.nama_perusahaan || '-'}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label text-muted text-uppercase">Posisi/Jabatan</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={tracerStudy.posisi_jabatan || '-'}
                                            disabled
                                        />
                                    </Col>
                                </>
                            )}
                            {tracerStudy.status_anda === 'Melanjutkan Pendidikan' && (
                                <>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label text-muted text-uppercase">Nama Kampus</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={tracerStudy.nama_kampus || '-'}
                                            disabled
                                        />
                                    </Col>
                                    <Col md={6} className="mb-3">
                                        <label className="form-label text-muted text-uppercase">Program Studi</label>
                                        <input
                                            type="text"
                                            className="form-control bg-light"
                                            value={tracerStudy.program_studi || '-'}
                                            disabled
                                        />
                                    </Col>
                                </>
                            )}
                        </Row>
                    </div>
  
              <FeedbackSection />
  
              
            </Card.Body>
          </DashboardCard>
        </PageContainer>
      );
    }
  }
  
  return (
    <PageContainer>
      <Card.Body>
        <Alert variant="warning">
          Data tracer study belum tersedia. Silakan isi data tracer study Anda.
        </Alert>
        <Button
          variant="primary"
          onClick={() => navigate('/add-form-tracer-study')}
          className="w-100"
        >
          Isi Data Tracer Study
        </Button>
      </Card.Body>
    </PageContainer>
  );  
};

TracerStudyAlumni.propTypes = {
  data: PropTypes.object,
};

export default TracerStudyAlumni;