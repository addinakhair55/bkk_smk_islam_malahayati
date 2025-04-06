import "./Heroes.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { FaBuilding, FaGraduationCap } from "react-icons/fa";
import { Link } from "react-router-dom";

const bgColors = ["#FFFFFF", "#ECF0F8", "#FFFFFF"];

export default function Heroes({ sections }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

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

                {section.buttonText &&
                typeof section.buttonText === "object" &&
                Object.values(section.buttonText).some((text) => text) ? (
                  <div className="d-flex flex-column flex-md-row gap-3 pt-2">
                    {/* alumni Button */}
                    <div className="dropdown-container position-relative">
                      <Button 
                        onClick={() => toggleDropdown("alumni")} 
                        className="rounded-3 w-100" 
                        style={{ 
                          position: 'relative', 
                          padding:"14px 27px",
                          backgroundColor: '#4065B6',
                          transition: 'all 0.2s ease-in-out', 
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
                        <FaGraduationCap  className="me-2"/>
                        {section.buttonText?.alumni || "alumni"}
                        <span style={{ display: 'none' }}>&#9660;</span>
                      </Button>
                      {openDropdown === "alumni" && (
                        <div className="dropdown-menu show position-absolute mt-2 w-100 p-1" style={{ zIndex: 10, fontSize:"14px" }}>
                          {section.buttonText?.alumniLogin && (
                            <Link to="/auth/login" className="dropdown-item">
                              {section.buttonText.alumniLogin}
                            </Link>
                          )}

                          {section.buttonText?.alumniRegister && (
                            <Link to="/auth/register" className="dropdown-item">
                              {section.buttonText.alumniRegister}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>

                    {/* perusahaan Button */}
                    <div className="dropdown-container position-relative">
                      <Button 

                        onClick={() => toggleDropdown("perusahaan")} 
                        className="rounded-3 w-100" 
                        style={{ 
                          position: 'relative', 
                          padding:"14px 27px",
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
                        <FaBuilding  className="me-2"/>
                        {section.buttonText?.perusahaan || "perusahaan"}
                        <span style={{ display: 'none' }}>&#9660;</span>
                      </Button>
                      {openDropdown === "perusahaan" && (
                        <div className="dropdown-menu show position-absolute mt-2 w-100 p-1" style={{ zIndex: 10, fontSize:"14px" }}>
                         {section.buttonText?.perusahaanLogin && (
                            <Link to="/auth/login/perusahaan" className="dropdown-item">
                              {section.buttonText.perusahaanLogin}
                            </Link>
                          )}

                          {section.buttonText?.perusahaanRegister && (
                            <Link to="/auth/konfirmasi" className="dropdown-item">
                              {section.buttonText.perusahaanRegister}
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : section.buttonText && typeof section.buttonText === "string" ? (
                  <button className="btn btn-primary">{section.buttonText}</button>
                ) : null}

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
      buttonText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape({
          alumni: PropTypes.string,
          alumniLogin: PropTypes.string,
          alumniRegister: PropTypes.string,
          perusahaan: PropTypes.string,
          perusahaanLogin: PropTypes.string,
          perusahaanRegister: PropTypes.string,
        }),
      ]),
    })
  ).isRequired,
};
