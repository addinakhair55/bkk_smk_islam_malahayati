import { useState, useEffect } from "react";
import PageContainer from "src/components/container/PageContainer";
import { Card, Row, Col } from "react-bootstrap";
import { FaUserGraduate, FaBriefcase, FaBuilding } from "react-icons/fa";
import adminImage from "../../assets/images/backgrounds/bg-8.png";
import { motion } from "framer-motion";

const Dashboard = () => {
    const [tracerData, setTracerData] = useState([]);
    const [jobData, setJobData] = useState([]);
    const [companyData, setCompanyData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                const tracerResponse = await fetch("http://localhost:5000/tracer-study", { headers });
                const jobResponse = await fetch("http://localhost:5000/info-lowongan-kerja", { headers });
                const companyResponse = await fetch("http://localhost:5000/mou-perusahaan", { headers });

                if (!tracerResponse.ok || !jobResponse.ok || !companyResponse.ok) {
                    throw new Error("Failed to fetch data from the server");
                }

                const tracer = await tracerResponse.json();
                const job = await jobResponse.json();
                const company = await companyResponse.json();

                setTracerData(tracer);
                setJobData(job);
                setCompanyData(company);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const textVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { duration: 0.15, staggerChildren: 0.04 }
        }
    };
    
    const letterVariants = {
        hidden: { opacity: 0, y: 6 },
        visible: { opacity: 1, y: 0, transition: { duration: 0 } }
    };
    
    return (
        <PageContainer title="Dashboard">
            <Row className="g-4 mb-1">
                <Col xs={12}>
                    <Card
                        className="shadow-lg border-0 rounded-4 mb-4 overflow-hidden"
                        style={{
                            maxWidth: "100%",
                            width: "100%",
                            background: "linear-gradient(90deg, #2e68dc, #ffffff)",
                            color: "white",
                            position: "relative",
                        }}
                    >
                        <Row className="g-0 align-items-center flex-column-reverse flex-md-row">
                            <Col xs={12} md={7} className="p-4 text-center text-md-start">
                                <motion.h5 
                                    className="fw-bold mb-3"
                                    variants={textVariants}
                                    initial="hidden"
                                    animate="visible"
                                    style={{ textTransform: "uppercase", letterSpacing: "1px", fontSize: "1.2rem" }}
                                >
                                    { "Hallo Admin!".split("").map((char, index) => (
                                        <motion.span key={index} variants={letterVariants}>
                                            {char}
                                        </motion.span>
                                    ))}
                                </motion.h5>

                                <motion.h2 
                                    className="fw-bold mb-0"
                                    variants={textVariants}
                                    initial="hidden"
                                    animate="visible"
                                    style={{ fontSize: "clamp(1.5rem, 4vw, 2.4rem)", lineHeight: "1.3" }}
                                >
                                    { "Senang melihatmu kembali! Yuk, mulai hari dengan semangat!".split("").map((char, index) => (
                                        <motion.span key={index} variants={letterVariants}>
                                            {char}
                                        </motion.span>
                                    ))}
                                </motion.h2>
                            </Col>
                            <Col xs={12} md={5} className="p-0 d-flex align-items-center justify-content-center position-relative">
                                <img
                                    src={adminImage}
                                    alt="Admin"
                                    className="img-fluid"
                                    style={{
                                        maxWidth: "83%",
                                        height: "auto",
                                        objectFit: "contain",
                                        position: "relative",
                                        transform: "perspective(1000px) rotateY(5deg)",
                                        filter: "drop-shadow(10px 10px 20px rgba(0, 0, 0, 0.3))",
                                    }}
                                />
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>

            <Row className="g-4 mb-4">
                <Col xl={4} lg={4} md={6} sm={6} xs={12}>
                    <Card className="shadow p-2 rounded-4 border-0 h-100">
                        <Card.Body className="d-flex align-items-center">
                            <div className="icon-circle me-3 flex-shrink-0" style={{ background: "linear-gradient(135deg, #c7d7f9, #c7d7f9)", width: "70px", height: "70px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaUserGraduate size={30} className="text-primary" />
                            </div>
                            <div className="flex-grow-1">
                                <h3 className="fw-bold fs-2 mb-0">{tracerData.length}</h3>
                                <p className="fw-bold mb-0 text-muted">Total Kelulusan</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4} lg={4} md={6} sm={6} xs={12}>
                    <Card className="shadow p-2 rounded-4 border-0 h-100">
                        <Card.Body className="d-flex align-items-center">
                            <div className="icon-circle me-3 flex-shrink-0" style={{ background: "linear-gradient(135deg, #c0fbd4, #c0fbd4)", width: "70px", height: "70px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaBriefcase size={30} className="text-success" />
                            </div>
                            <div className="flex-grow-1">
                                <h3 className="fw-bold fs-2 mb-0">{jobData.length}</h3>
                                <p className="fw-bold mb-0 text-muted">Total Lowongan</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col xl={4} lg={4} md={6} sm={6} xs={12}>
                    <Card className="shadow p-2 rounded-4 border-0 h-100">
                        <Card.Body className="d-flex align-items-center">
                            <div className="icon-circle me-3 flex-shrink-0" style={{ background: "linear-gradient(135deg, #faf8c0, #faf8c0)", width: "70px", height: "70px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <FaBuilding size={30} className="text-warning" />
                            </div>
                            <div className="flex-grow-1">
                                <h3 className="fw-bold fs-2 mb-0">{companyData.length}</h3>
                                <p className="fw-bold mb-0 text-muted">Total MoU Perusahaan</p>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </PageContainer>
    );
};

export default Dashboard;