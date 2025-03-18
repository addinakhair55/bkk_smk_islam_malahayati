import PageContainer from 'src/components/container/PageContainer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { getUser } from "../../components/redux/slice/authSlice";
import { Card, Col, Row } from 'react-bootstrap';
import { motion } from "framer-motion";
import adminImage from "../../assets/images/profile/admin-11.png";

const DashboardPerusahaan = () => {

    const dispatch = useDispatch();
    const { user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getUser());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Data tidak tersedia</p>;

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
        <PageContainer title="Dashboard Perusahaan">
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
                                   {`Hallo ${user?.name || "Perusahaan"}!`.split("").map((char, index) => (
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
                            <Col xs={12} md={5} className="p-0 d-flex align-items-center justify-content-end position-relative">
                                <img
                                    src={adminImage}
                                    alt="Admin"
                                    className="img-fluid"
                                    style={{
                                        maxWidth: "52%",
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
        </PageContainer>
    );
};

export default DashboardPerusahaan;
