import PageContainer from "src/components/container/PageContainer";
import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaMapMarkerAlt, FaBriefcase, FaUser, FaBuilding, FaGraduationCap, FaHistory, FaShareAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchInfoLoker } from "../../../components/redux/slice/infoLokerSlice";
import Navbar from "../../../components/landingPage/Navbar";
import Footer from "../../../components/landingPage/Footer";
import { Button } from "react-bootstrap";
import defaultLogo from "../../../assets/images/logos/default-logo.png";
import "./DetailInfoLokerView.css"

const BASE_URL = "http://localhost:5000/uploads/";

export default function DetailInfoLokerView() {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { infoLoker, status, error } = useSelector(state => state.infoLoker);
    const jobInfo = infoLoker.find(info => info._id === id);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        if (status === "idle") {
            dispatch(fetchInfoLoker());
        }
    }, [status, dispatch]);

    const getRelativeTime = (date) => {
        const diff = Math.floor((new Date() - new Date(date)) / 1000);
        if (diff < 60) return "Posting baru saja";
        const minutes = Math.floor(diff / 60);
        if (minutes < 60) return `${minutes} menit yang lalu`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} jam yang lalu`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} hari yang lalu`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks} minggu yang lalu`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} bulan yang lalu`;
        return `${Math.floor(months / 12)} tahun yang lalu`;
    };

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
    const filteredJobs = infoLoker.filter(job => {
        const judul = job.judul?.toLowerCase() || '';
        const perusahaan = job.perusahaan?.toLowerCase() || '';
        const lokasi = job.lokasi?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
    
        return (
            judul.includes(query) ||
            perusahaan.includes(query) ||
            lokasi.includes(query)
        );
    });
    
    if (status === "loading") {
        return <div className="text-center my-5">Loading...</div>;
    }

    if (status === "failed") {
        return <div className="text-center my-5">Error: {error}</div>;
    }

    if (!jobInfo) {
        return <div className="text-center my-5">Job info not found!</div>;
    }

    return (
        <PageContainer title="Detail Info Lowongan Kerja">
            <style>{`
                @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
                }

                .page-fade {
                animation: fadeIn 1s ease-out forwards;
                opacity: 0;
                }
            `}</style>
            <Navbar />
            <div className="container pt-4 page-fade">
                <div className="row py-3">
                    <div className="col-lg-8">
                    <div className="card border-0 shadow-sm p-3 row g-4">
                        {/* Bagian Utama */}
                        <div className="col-12">
                            <div className="row align-items-start position-relative flex-column flex-md-row">
                                {/* Info  */}
                                <div className="col-12 col-md-8 order-2 order-md-1">
                                    <div className="d-flex flex-column flex-sm-row flex-wrap gap-3 py-3 py-md-0">
                                        {/* Logo */}
                                        <img
                                            src={jobInfo.logo ? `${BASE_URL}${jobInfo.logo}` : defaultLogo}
                                            alt="Logo Perusahaan"
                                            className="img-fluid rounded-circle border"
                                            style={{
                                                width: "60px",
                                                height: "60px",
                                                objectFit: "cover",
                                                flexShrink: 0,
                                            }}
                                            onError={(e) => {
                                                e.target.src = defaultLogo;
                                            }}
                                        />
                                        {/* Detail Pekerjaan */}
                                        <div className="flex-grow-1">
                                            <h3 className="mb-2 fw-bold fs-4 fs-md-3" style={{color:"#4065B6"}}>{jobInfo.judul}</h3>
                                            <div className="d-flex flex-column gap-2 text-secondary">
                                                <div className="d-flex align-items-center flex-nowrap">
                                                    <FaBuilding className="me-2 flex-shrink-0" style={{color:"#4065B6"}}/>
                                                    <span style={{ fontSize: "clamp(14px, 1.4vw, 16px)" }} className="text-truncate text-tag-detail">{jobInfo.perusahaan}</span>
                                                </div>
                                                <div className="d-flex align-items-center flex-nowrap">
                                                    <FaMapMarkerAlt className="me-2 text-danger flex-shrink-0" />
                                                    <span style={{ fontSize: "clamp(14px, 1.4vw, 16px)" }}>{jobInfo.lokasi}</span>
                                                </div>
                                                <div className="d-flex align-items-center flex-nowrap">
                                                    <FaUser className="me-2 text-muted flex-shrink-0" />
                                                    <span style={{ fontSize: "clamp(14px, 1.4vw, 16px)" }}>{jobInfo?.jenis_kelamin || "Jenis Kelamin Tidak Ditentukan"}</span>
                                                </div>
                                                <div className="d-flex align-items-center flex-nowrap">
                                                    <FaGraduationCap className="me-2 text-muted flex-shrink-0" />
                                                    <span style={{ fontSize: "clamp(14px, 1.4vw, 16px)" }}>{jobInfo?.minimal_pendidikan || "Pendidikan Tidak Ditentukan"}</span>
                                                </div>
                                                <div className="d-flex align-items-center flex-nowrap">
                                                    <FaBriefcase className="me-2 text-muted flex-shrink-0" />
                                                    <span style={{ fontSize: "clamp(14px, 1.4vw, 16px)" }}>{jobInfo?.jenis || "Jenis Pekerjaan Tidak Ditentukan"}</span>
                                                </div>
                                                <div className="d-block d-sm-none mt-2">
                                                    <h5 className="fw-bold text-success my-2">
                                                        {jobInfo.gaji_min === "Dirahasiakan" && jobInfo.gaji_max === "Dirahasiakan"
                                                            ? "Negosiasi"
                                                            : jobInfo.gaji_min && jobInfo.gaji_max
                                                            ? `${formatRupiah(jobInfo.gaji_min)} - ${formatRupiah(jobInfo.gaji_max)}`
                                                            : jobInfo.gaji_min
                                                            ? `Mulai ${formatRupiah(jobInfo.gaji_min)}`
                                                            : jobInfo.gaji_max
                                                            ? `Hingga ${formatRupiah(jobInfo.gaji_max)}`
                                                            : "Gaji Tidak Ditampilkan"}
                                                    </h5>
                                                    <div className="d-flex align-items-center text-muted">
                                                        <FaHistory className="me-2" />
                                                        <small>{getRelativeTime(jobInfo.tanggalDibuat)}</small>
                                                    </div>
                                                </div>
                                                <div className="mt-3 d-flex flex-column flex-sm-row gap-3">
                                                    {/* Tombol Lamar */}
                                                    {jobInfo.link && (
                                                        <Button
                                                        onClick={() => window.open(jobInfo.link, "_blank")}
                                                            className="fw-bold d-flex align-items-center justify-content-center flex-grow-1"
                                                            style={{ 
                                                                backgroundColor: "#4065B6",
                                                                maxWidth: "250px",
                                                                width: "100%",
                                                                flexBasis: 0,
                                                                border: "none",
                                                                padding: "0.5rem",
                                                                transition: "all 0.2s ease-in-out",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = "#3050A5";
                                                                e.currentTarget.style.transform = "scale(1.05)";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = "#4065B6";
                                                                e.currentTarget.style.transform = "scale(1)";
                                                            }}
                                                        >
                                                            LAMAR SEKARANG
                                                        </Button>
                                                    )}

                                                    {/* Tombol Bagikan */}
                                                    <Button
                                                        className="fw-bold d-flex align-items-center justify-content-center flex-grow-1 gap-2"
                                                        style={{
                                                            color: "#7d7b7b",
                                                            backgroundColor: "#ffffff",
                                                            maxWidth: "250px",
                                                            width: "100%",
                                                            flexBasis: 0,
                                                            border: "2px solid #7d7b7b",
                                                            padding: "0.5rem",
                                                            transition: "all 0.2s ease-in-out",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.backgroundColor = "#6c757d";
                                                            e.currentTarget.style.color = "white";
                                                            e.currentTarget.style.border = "2px solid #6c757d";
                                                            e.currentTarget.style.transform = "scale(1.05)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.backgroundColor = "white";
                                                            e.currentTarget.style.color = "#7d7b7b";
                                                            e.currentTarget.style.border = "2px solid #7d7b7b";
                                                            e.currentTarget.style.transform = "scale(1)";
                                                        }}
                                                        onClick={() => 
                                                            navigator.share 
                                                                ? navigator.share({ title: jobInfo.judul, url: window.location.href })
                                                                : alert("Fitur berbagi tidak didukung di perangkat ini.")
                                                        }
                                                    >
                                                        <FaShareAlt />
                                                        BAGIKAN
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className="col-12 col-md-4 order-1 order-md-2 text-start text-md-end d-none d-sm-block">
                                    <h5 className="fw-bold text-success mb-2">
                                        {jobInfo.gaji_min === "Dirahasiakan" && jobInfo.gaji_max === "Dirahasiakan"
                                            ? "Negosiasi"
                                            : jobInfo.gaji_min && jobInfo.gaji_max
                                            ? `${formatRupiah(jobInfo.gaji_min)} - ${formatRupiah(jobInfo.gaji_max)}`
                                            : jobInfo.gaji_min
                                            ? `Mulai ${formatRupiah(jobInfo.gaji_min)}`
                                            : jobInfo.gaji_max
                                            ? `Hingga ${formatRupiah(jobInfo.gaji_max)}`
                                            : "Gaji Tidak Ditampilkan"}
                                    </h5>
                                    <div className="d-flex align-items-center justify-content-start justify-content-md-end text-muted">
                                        <FaHistory className="me-2" />
                                        <small>{getRelativeTime(jobInfo.tanggalDibuat)}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div style={{ borderBottom: "2px solid #dee2e6" }}></div>

                        {/* Deskripsi, Persyaratan, Keterampilan */}
                        <div className="col-12">
                            <div className="row g-4">
                                {[
                                    { label: "Deskripsi", value: jobInfo.deskripsi },
                                    { label: "Persyaratan", value: jobInfo.persyaratan },
                                    { label: "Keterampilan", value: jobInfo.keterampilan },
                                ].map((item, index) => (
                                    <div className="col-12" key={index}>
                                        <h3 className="text-secondary mb-2 fw-bold">{item.label}</h3>
                                        <div className="text-break" dangerouslySetInnerHTML={{ __html: item.value }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Job Poster */}
                        {jobInfo.poster && (
                            <div className="col-12 mt-4">
                                <img
                                    src={`${BASE_URL}${jobInfo.poster}`}
                                    alt="Poster Pekerjaan"
                                    className="img-fluid rounded shadow-sm"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    </div>

                    <div className="col-lg-4 col-12 mt-3 mt-md-3 mt-lg-0">
                        <Typography variant="h5" className="mb-3 fw-bold" style={{color:"#4065B6"}}>Lowongan Lainnya</Typography>
                        <div className="mb-3">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari lowongan kerja..."
                                className="form-control mx-auto"
                                style={{
                                    padding: "10px 16px",
                                    fontSize: "15px",
                                    border: "1px solid #ccc",
                                    borderRadius: "20px",
                                    outline: "none",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = "#007bff";
                                    e.target.style.boxShadow = "0 0 0 3px rgba(0,123,255,0.1)";
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = "#ccc";
                                    e.target.style.boxShadow = "none";
                                }}
                            />
                        </div>
                        {filteredJobs
                            .filter(job => job._id !== id)
                            .slice(0, 6)
                            .map((job, index) => (
                            <div className="col-12 mb-3" key={index}>
                            <Link to={`/info-loker/${job._id}`} className="text-decoration-none">
                                <div className="card shadow border-0 job-detail h-100 d-flex flex-column">
                                <div className="card-body p-3 d-flex flex-column">
                                    {/* Header Job */}
                                    <div className="d-flex align-items-center mb-3">
                                    <img
                                        src={job.logo ? `${BASE_URL}${job.logo}` : defaultLogo}
                                        alt="Logo Perusahaan"
                                        className="rounded-circle border job-logo"
                                        onError={(e) => { e.target.src = defaultLogo; }}
                                    />
                                    <div className="ms-2 w-75">
                                        <h5 className="fw-bold mb-1 text-title-job" style={{color:"#4065B6"}}>{job.judul}</h5>
                                        <h6 className="text-muted text-title-company">
                                        <FaBuilding className="me-2 text-secondary" />{job.perusahaan}
                                        </h6>
                                    </div>
                                    </div>

                                    {/* Badge Info */}
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

                                    {/* Bagian Gaji dan Tombol */}
                                    <div className="mt-auto pt-2 d-flex justify-content-between align-items-center flex-wrap">
                                    <h6 className="fw-bold text-success gaji mb-0">
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

                                    <div className="d-flex gap-2 flex-wrap">
                                        <Button
                                            size="sm"
                                            className="border-0 fw-bold"
                                            onClick={() => window.open(job.link, "_blank")}
                                            style={{
                                                fontSize:"0.8rem",
                                                color: "#ffffff",
                                                backgroundColor: "#4065B6",
                                                transition: "all 0.2s ease-in-out",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor = "#3050A5";
                                                e.currentTarget.style.transform = "scale(1.02)";
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
                                            className="px-2 py-2 w-auto d-flex align-items-center justify-content-center"
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
                                            e.currentTarget.style.transform = "scale(1.02)";
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

                </div>
            </div>
            <Footer />
        </PageContainer>
    );
}
