import "./Heroes.css";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { FaBuilding, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";

const bgColors = ["#FFFFFF", "#ECF0F8", "#FFFFFF"];

export default function Heroes({ sections }) {
  return (
    <div>
      {sections.map((section, index) => (
        <section
          key={section.id || index}
          style={{
            backgroundColor: bgColors[index % bgColors.length],
            width: "100%",
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "50px 15px",
          }}
        >
          <div className="container">
            <div className="row g-5 align-items-center">
              <div className={`col-12 col-md-5 text-center ${section.imgAlign} py-3 px-md-5 order-1 order-md-${section.imgOrder}`}>
                <img
                  src={section.imgSrc}
                  alt={section.imgAlt}
                  className="img-fluid w-100 h-auto img-hero"
                  style={{ maxWidth: "450px" }}
                />
              </div>

              <div className={`col-12 col-md-7 px-md-4 text-center text-md-start order-2 order-md-${section.textOrder}`}>
                <h1 className={section.titleClass}>{section.title}</h1>
                {section.title2 && <h1 className={section.titleClass2}>{section.title2}</h1>}
                {section.subtitle && <h2 className={section.subtitleClass}>{section.subtitle}</h2>}
                <p className={section.descClass}>{section.description}</p>

                {section.button && section.buttons && (
                  <div className="d-flex flex-column flex-md-row gap-3 pt-2">
                    <Link to="/info-loker">
                      <Button
                        className="rounded-3 w-100"
                        style={{
                          padding: "14px 17px",
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
                        <FaBuilding className="me-2" />
                        <span className="fw-bold">{section.button}</span>
                      </Button>
                    </Link>

                    <Link to="/tracer-study">
                      <Button
                        className="rounded-3 w-100"
                        style={{
                          padding: "14px 24px",
                          color: "#4065B6",
                          backgroundColor: "white",
                          border: "2px solid #4065B6",
                          transition: "all 0.2s ease-in-out",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#3050A5";
                          e.target.style.color = "white";
                          e.target.style.border = "2px solid #3050A5";
                          e.currentTarget.style.transform = "scale(1.02)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "white";
                          e.target.style.color = "#4065B6";
                          e.target.style.border = "2px solid #4065B6";
                          e.currentTarget.style.transform = "scale(1)";
                        }}
                      >
                        <FaGraduationCap className="me-2" />
                        <span className="fw-bold">{section.buttons}</span>
                      </Button>
                    </Link>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

// ✅ Tambahkan validasi PropTypes
Heroes.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      imgAlign: PropTypes.string,
      imgOrder: PropTypes.number,
      imgSrc: PropTypes.string.isRequired,
      imgAlt: PropTypes.string,
      textOrder: PropTypes.number,
      titleClass: PropTypes.string,
      title: PropTypes.string.isRequired,
      titleClass2: PropTypes.string,
      title2: PropTypes.string,
      subtitleClass: PropTypes.string,
      subtitle: PropTypes.string,
      descClass: PropTypes.string,
      description: PropTypes.string.isRequired,
      button: PropTypes.string,
      buttons: PropTypes.string,
    })
  ).isRequired,
};
