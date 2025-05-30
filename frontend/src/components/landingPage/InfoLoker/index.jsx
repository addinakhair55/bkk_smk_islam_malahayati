import { Link } from "react-router-dom";
import { FaBriefcase, FaBuilding, FaGraduationCap, FaHistory, FaShareAlt, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchInfoLoker } from "../../redux/slice/infoLokerSlice";
import { useEffect } from "react";
import defaultLogo from "../../../assets/images/logos/default-logo.png";
import { Button } from "react-bootstrap";
import "./InfoLoker.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000/uploads/";

export default function InfoLoker() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { infoLoker, status, error } = useSelector(state => state.infoLoker);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchInfoLoker());
    }
  }, [status, dispatch]);

  const formatRupiah = (angka) => {
    if (angka >= 1_000_000) {
      return `Rp ${angka / 1_000_000} jt`;
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(angka);
  };

  if (status === "loading") {
    return <div className="text-center my-5">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-center my-5">Error: {error}</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "30px 25px",
      }}
    >
    <div className="container p-0">
        <div className="text-center mb-4">
          <h2 className="fw-bold title-color">Info Lowongan Kerja</h2>
          <p className="text-muted">
            Informasi lowongan kerja terbaru.
          </p>
        </div>

      <div className="row g-3">
        {infoLoker.slice(0, 3).map((job) => (
          <div className="col-12 col-sm-6 col-lg-4" key={job._id}>
            <Link to={`/info-loker/${job._id}`} className="text-decoration-none">
            <div className="card border-0 shadow h-100 job-card">
            <div className="card-body p-3 d-flex flex-column justify-content-between h-100">
              <div>
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={job.logo ? `${BASE_URL}${job.logo}` : defaultLogo}
                    alt="Logo Perusahaan"
                    className="rounded-circle border job-logo"
                    onError={(e) => { e.target.src = defaultLogo; }}
                  />
                  <div className="ms-2 w-75 w-md-100">
                    <h5 className="fw-bold mb-1 text-title-job" style={{color:"#4065B6"}}>
                      {job.judul}
                    </h5>
                    <h6 className="text-muted text-title-company">
                      <FaBuilding className="me-2 text-secondary" />{job.perusahaan}
                    </h6>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-1 mb-3">
                  {job.jenis_kelamin && (
                    <div className="bg-primary-color border border-primary rounded-pill custom-badge">
                      <FaUser className="me-1 text-primary-color" /> {job.jenis_kelamin}
                    </div>
                  )}
                  {job.minimal_pendidikan && (
                    <div className="bg-primary-color border border-primary rounded-pill custom-badge">
                      <FaGraduationCap className="me-1 text-primary-color" /> {job.minimal_pendidikan}
                    </div>
                  )}
                  {job.jenis && (
                    <div className="bg-primary-color border border-primary rounded-pill custom-badge">
                      <FaBriefcase className="me-1 text-primary-color" /> {job.jenis}
                    </div>
                  )}
                  {job.riwayat_pengalaman && (
                    <div className="bg-primary-color border border-primary rounded-pill custom-badge">
                      <FaHistory className="me-1 text-primary-color" /> {job.riwayat_pengalaman}
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex flex-column flex-md-row gap-3 gap-md-2 justify-content-between align-items-center mt-auto">
                  <h6 className="fw-bold text-success gaji mb-0 text-center text-md-start flex-grow-0" style={{ fontSize: "0.8rem", width: "55%" }}>
                    {job.gaji_min === "Dirahasiakan" && job.gaji_max === "Dirahasiakan"
                      ? "Negosiasi"
                      : job.gaji_min && job.gaji_max
                      ? `${formatRupiah(job.gaji_min)} - ${formatRupiah(job.gaji_max)}`
                      : job.gaji_min
                      ? `Mulai ${formatRupiah(job.gaji_min)}`
                      : job.gaji_max
                      ? `Hingga ${formatRupiah(job.gaji_max)}`
                      : "Gaji Menarik"}
                  </h6>

                  <div className="d-flex flex-column flex-md-row gap-2 flex-wrap w-100 justify-content-md-end">
                    <Button
                      size="sm"
                      className="py-2 border-0 fw-bold"
                      onClick={() => window.open(job.link, "_blank", "noopener,noreferrer")}
                      style={{
                        padding: "9px",
                        color: "#ffffff",
                        backgroundColor: "#4065B6",
                        transition: "all 0.2s ease-in-out",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#3050A5";
                        e.currentTarget.style.transform = "scale(1.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#4065B6";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      Lamar Sekarang
                    </Button>

                    <Button
                      size="sm"
                      className="px-2 py-2 d-flex align-items-center justify-content-center"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: job.judul,
                            text: `Lowongan Kerja: ${job.judul} di ${job.perusahaan}. Cek detailnya sekarang!`,
                            url: window.location.origin + `/info-loker/${job._id}`,
                          }).catch((err) => console.log("Gagal berbagi:", err));
                        } else {
                          alert("Fitur berbagi tidak didukung di browser ini.");
                        }
                      }}
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
                      <FaShareAlt />
                    </Button>
                  </div>
              </div>
            </div>
          </div>
            </Link>
          </div>
        ))}
      </div>


      <div className="text-center mt-5">
      <Button 
        style={{
          color: "#4065B6",
          backgroundColor: "white",
          border: "2px solid #4065B6",
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.target.style.backgroundColor = "#4065B6";
          e.target.style.color = "white";
          e.target.style.border = "2px solid #4065B6";
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.target.style.backgroundColor = "white";
          e.target.style.color = "#4065B6";
          e.target.style.border = "2px solid #4065B6";
          e.currentTarget.style.transform = "scale(1)";
        }}
        className="rounded-pill px-4 py-2 fw-bold"
        onClick={() => navigate("/info-loker")}
      >
        Lihat Semua Lowongan
      </Button>
    </div>
    </div>
    </div>
  );
}
