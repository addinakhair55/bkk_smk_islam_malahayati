import "./Footer.css";
import { Link } from "react-router-dom";
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from "react-icons/fa";
import Instagram from "../../../assets/images/icon/Instagram_icon.png"
import YouTube from "../../../assets/images/icon/youtube_icon.png"

export default function Footer() {
    return (
        <footer>
            <div className="container py-5 style-font">
                <div className="row g-4 justify-content-center">
                    {/* SMK ISLAM MALAHAYATI Section */}
                    <div className="col-lg-3 col-md-6 col-12 d-flex flex-column align-items-start">
                        <h5 className="mb-3 text-color fw-bold">SMK ISLAM MALAHAYATI</h5>
                        <h6 className="text-secondary fw-bold">BURSA KERJA KHUSUS</h6>
                        <div className="mt-2 text-muted">
                            <div className="d-flex align-items-start mb-2">
                                <FaMapMarkerAlt className="me-2 text-danger icon-footer1" />
                                <p className="mb-0" style={{fontSize:"12px"}}>
                                    Jalan Bima No.3, RT.8/RW.7, Cijantung, Pasar Rebo, Kota Jakarta Timur, DKI Jakarta 13770
                                </p>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FaPhone className="me-2 text-success icon-footer2" />
                                <p className="mb-0" style={{fontSize:"12px"}}>(021) 8701744</p>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <FaEnvelope className="me-2 text-danger icon-footer3" />
                                <Link href="mailto:info@malahayatiislamicschool.sch.id" className=" text-decoration-none link-footer" style={{fontSize:"12px"}}>
                                    info@malahayatiislamicschool.sch.id
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Pelayanan Kami Section */}
                    <div className="col-lg-3 col-md-6 col-12 d-flex flex-column align-items-start">
                        <h5 className="mb-3 text-color fw-bold">Pelayanan Kami</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/lowongan-kerja" className=" text-decoration-none link-footer" style={{fontSize:"12px"}}>
                                    Lowongan Kerja
                                </Link>
                            </li>
                            <li>
                                <Link to="/tracer-study" className=" text-decoration-none link-footer" style={{fontSize:"12px"}}>
                                    Tracer Study
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Tentang Kami Section */}
                    <div className="col-lg-3 col-md-6 col-12 d-flex flex-column align-items-start">
                        <h5 className="mb-3 text-color fw-bold">Tentang Kami</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2">
                                <Link to="/visi-misi" className=" text-decoration-none link-footer" style={{fontSize:"12px"}}>
                                    Visi & Misi
                                </Link>
                            </li>
                            <li className="mb-2">
                                <Link to="/program-kerja" className=" text-decoration-none link-footer" style={{fontSize:"12px"}}>
                                    Program Kerja BKK
                                </Link>
                            </li>
                            <li>
                                <Link to="/struktur-organisasi" className=" text-decoration-none link-footer" style={{fontSize:"12px"}}>
                                    Struktur Organisasi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Kontak Kami Section */}
                    <div className="col-lg-3 col-md-6 col-12 d-flex flex-column align-items-start">
                        <h5 className="mb-3 text-color fw-bold">Media Sosial</h5>
                        <div className="">
                            <div className="d-flex align-items-center mb-3">
                                <img src={Instagram} alt="Instagram" style={{width:"20px"}} />
                                <Link to="https://instagram.com/bkksmkislammalahayati_20" style={{fontSize:"12px"}} className=" text-decoration-none link-footer align-items-center mx-2">
                                    @bkksmkislammalahayati_20
                                </Link>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <img src={YouTube} alt="Instagram" style={{width:"20px"}} />
                                <Link to="https://youtube.com/@bkksmkislammalahayatijakar9261" style={{fontSize:"12px"}} className=" text-decoration-none link-footer align-items-center mx-2">
                                    @bkksmkislammalahayatijakar9261
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-4 bg-footer text-center text-white">
                <p className="mb-0">
                    All Rights Reserved | Powered by <strong>Addina Khairinisa</strong>
                </p>
            </div>
        </footer>
    );
}
