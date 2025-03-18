import { Link } from 'react-router-dom';
import Logo from '../../Image/logo-bkk.png';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-white shadow-sm style-font sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand d-flex" href="#">
          <img 
            src={Logo}
            alt="SMKS ISLAM MALAHAYATI" 
            className="img-title"
          />
          <div className="d-flex flex-column px-2">
            <h5 className="fw-bold title">Bursa Kerja Khusus</h5>
            <h5 className="fw-bold title">SMK Islam Malahayati</h5>
          </div>
        </a>
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
          <ul className="navbar-nav mb-2 mb-lg-0 fs-6 gap-lg-0 gap-md-0 gap-xl-4">
            <li className="nav-item p-1">
              <Link className="nav-link" to="/" onClick={() => window.scrollTo(0, 0)}>
                Beranda
              </Link>
            </li>
            <li className="nav-item dropdown p-1">
              <Link
                className="nav-link"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Profil <i className="bi bi-chevron-down ms-2"></i>
              </Link>
              <ul className="dropdown-menu" style={{ minWidth: "200px", width: "auto", padding: "10px" }}>
                <li>
                  <Link className="dropdown-item p-2" to="/visi-misi" onClick={() => window.scrollTo(0, 0)}>
                    Visi & Misi BKK
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item p-2" to="/program-kerja" onClick={() => window.scrollTo(0, 0)}>
                    Program Kerja BKK
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item p-2" to="#" onClick={() => window.scrollTo(0, 0)}>
                    Struktur Organisasi BKK
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item p-1">
              <Link className="nav-link" to="/info-loker" onClick={() => window.scrollTo(0, 0)}>
                Lowongan Kerja
              </Link>
            </li>
            <li className="nav-item dropdown p-1">
              <Link
                className="nav-link"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Informasi  <i className="bi bi-chevron-down ms-2"></i>
              </Link>
              <ul className="dropdown-menu" style={{ minWidth: "200px", width: "auto", padding: "10px" }}>
                <li>
                  <Link className="dropdown-item p-2" to="/tracer-study" onClick={() => window.scrollTo(0, 0)}>
                    Tracer Study
                  </Link>
                </li>
                <li>
                  <Link className="dropdown-item p-2" to="/galeri-kegiatan" onClick={() => window.scrollTo(0, 0)}>
                    Galeri Kegiatan
                  </Link>
                </li>
              </ul>
            </li>
            <li className="nav-item p-1">
              <Link className="nav-link" to="/faq" onClick={() => window.scrollTo(0, 0)}>
                FAQ
              </Link>
            </li>
            <li className="nav-item p-1">
              <Link className="nav-link" to="/kontak" onClick={() => window.scrollTo(0, 0)}>
                Kontak
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

