import { Link } from 'react-router-dom';
import Logo from '../../Image/logo-bkk.png';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand d-flex" href="#">
          <img 
            src={Logo}
            alt="SMKS ISLAM MALAHAYATI" 
            className="img-title"
          />
          <div className="d-flex flex-column px-2 gap-0 gap-lg-1 justify-content-center">
            <div className="title">Bursa Kerja Khusus</div>
            <div className="title">SMK Islam Malahayati</div>
          </div>
        </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
        <div className="collapse navbar-collapse justify-content-end align-items-center" id="navbarSupportedContent">
          <ul className="navbar-nav mb-2 mb-lg-0 fs-6 gap-lg-2 gap-md-0 gap-xl-4 align-items-lg-center">
            <li className="nav-item p-1 p-lg-0">
              <Link className="nav-link" to="/" onClick={() => window.scrollTo(0, 0)}>
                Beranda
              </Link>
            </li>
            <li className="nav-item dropdown p-1 p-lg-0">
              <Link
                className="nav-link"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Profil <i className="bi bi-chevron-down ms-2"></i>
              </Link>
              <ul className="dropdown-menu" style={{ minWidth: "200px", width: "auto", padding: "10px", fontSize:"14px" }}>
                <li>
                  <Link className="dropdown-item p-1" to="/visi-misi" onClick={() => window.scrollTo(0, 0)}>
                    Visi & Misi BKK
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item p-1" to="/program-kerja" onClick={() => window.scrollTo(0, 0)}>
                    Program Kerja BKK
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item p-1" to="/struktur-organisasi" onClick={() => window.scrollTo(0, 0)}>
                    Struktur Organisasi BKK
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item p-1 p-lg-0">
              <Link className="nav-link" to="/info-loker" onClick={() => window.scrollTo(0, 0)}>
                Lowongan Kerja
              </Link>
            </li>
            <li className="nav-item dropdown p-1 p-lg-0">
              <Link
                className="nav-link"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Informasi  <i className="bi bi-chevron-down ms-2"></i>
              </Link>
              <ul className="dropdown-menu" style={{ minWidth: "200px", width: "auto", padding: "10px", fontSize:"14px" }}>
                <li>
                  <Link className="dropdown-item p-1" to="/tracer-study" onClick={() => window.scrollTo(0, 0)}>
                    Tracer Study
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item p-1" to="/galeri-kegiatan" onClick={() => window.scrollTo(0, 0)}>
                    Galeri Kegiatan
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item p-1 p-lg-0">
              <Link className="nav-link" to="/faq" onClick={() => window.scrollTo(0, 0)}>
                FAQ
              </Link>
            </li>
            <li className="nav-item p-1 p-lg-0">
              <Link className="nav-link" to="/kontak" onClick={() => window.scrollTo(0, 0)}>
                Kontak
              </Link>
            </li>
            <li className="nav-item p-1 p-lg-0 d-flex gap-2 flex-row">
              <Link to="/auth/login" className="text-decoration-none w-100">
                <button
                  className="rounded-3 w-100"
                  style={{
                    padding: "9px 15px",
                    color: "#4065B6",
                    backgroundColor: "white",
                    border: "2px solid #4065B6",
                    transition: "all 0.2s ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#3050A5";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.border = "2px solid #3050A5";
                    e.currentTarget.style.transform = "scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "#4065B6";
                    e.currentTarget.style.border = "2px solid #4065B6";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                >
                  Masuk
                </button>
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
}