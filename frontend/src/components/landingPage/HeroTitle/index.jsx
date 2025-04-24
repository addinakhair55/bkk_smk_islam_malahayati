import PropTypes from 'prop-types';
import "./HeroTitle.css"
import { Link } from 'react-router-dom';

export default function HeroTitle({ title, subtitle}) {
    return (
        <div className="d-flex w-100 p-5 flex-column justify-content-center align-items-center">
            <div className="text-center">
                <h2 className="fw-bold font-title-hero">{title}</h2>
                {subtitle && <h2 className="fw-bold font-subtitle-hero mt-4">{subtitle}</h2>}
            </div>
            <div className="w-100 d-flex justify-content-center mt-3">
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb justify-content-center">
                        <li className="breadcrumb-item">
                            <Link 
                                to="/" 
                                className="d-flex align-items-center text-decoration-none"
                                style={{ 
                                    transition: "opacity 0.2s ease",
                                    color: "#4065B6",
                                    textDecoration: "none",
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                                  onMouseDown={(e) => e.currentTarget.style.opacity = "0.5"}
                                  onMouseUp={(e) => e.currentTarget.style.opacity = "0.7"}
                            >
                                <span className="fw-medium">Beranda</span>
                            </Link>
                        </li>
                        <li className="breadcrumb-item active text-secondary" aria-current="page">
                            {title}
                        </li>
                    </ol>
                </nav>
            </div>
        </div>
    );
}

HeroTitle.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    description: PropTypes.string.isRequired,
    isButtonVisible: PropTypes.bool
};

HeroTitle.defaultProps = {
    subtitle: "",
    isButtonVisible: false
};
