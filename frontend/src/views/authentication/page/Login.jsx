import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaHome } from 'react-icons/fa';
import { Eye, EyeOff } from "lucide-react";
import PageContainer from 'src/components/container/PageContainer';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post("http://localhost:5000/auth/login", {
                email,
                password,
            });
    
            const { token, role } = response.data;
    
            localStorage.setItem("token", token);
            localStorage.setItem("role", role);
    
            // Redirect berdasarkan role
            if (role === "admin") {
                console.log("Redirecting to /admin-dashboard");
                navigate("/dashboard");  // Halaman khusus untuk admin

            } else if (role === "alumni") {
                console.log("Redirecting to /alumni-dashboard");
                navigate("/alumni");  // Halaman khusus untuk alumni
            } else if (role === "perusahaan") {
                console.log("Redirecting to /perusahaan-dashboard");
                navigate("/perusahaan");  // Halaman khusus untuk alumni

            } else {
                console.log("Redirecting to /dashboard");
                navigate("/dashboard");  // Halaman default
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Invalid credentials. Please try again.");
        }
    };
    

    return (
        <PageContainer title="Login Portal Alumni">
            <div 
                className="d-flex justify-content-center align-items-center"
                style={{ 
                background: 'linear-gradient(135deg, #4065B6 0%, #3B82F6 100%)',
                padding: '15px',
                minHeight: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                overflow: 'auto'
                }}
            >
                <div className="container">
                <div className="row justify-content-center">
                    <div className="col-11 col-sm-8 col-md-6 col-lg-4">
                    <div 
                        className="card-body shadow-lg rounded-4 p-3 p-sm-4 bg-white"
                        style={{
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                        maxWidth: '400px',
                        margin: '0 auto'
                        }}
                    >
                     <div className="position-relative">
                        <div className="d-flex justify-content-start align-items-center mb-3">
                            <Link 
                                to="/" 
                                className="btn rounded-3" 
                                style={{ 
                                    background: '#4065B6',
                                    color: 'white',
                                    border: 'none',
                                    transition: 'opacity 0.3s ease',
                                    fontSize: '1rem'
                                }}
                                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                onMouseOut={(e) => e.target.style.opacity = '1'}
                            >
                                <FaHome />
                            </Link>
                        </div>

                        <div className="text-center mb-3">
                            <h2 
                                className="fw-bold" 
                                style={{ 
                                    color: '#1E3A8A',
                                    fontSize: '1.5rem',
                                }}
                            >
                                Login
                            </h2>
                            <p 
                                className="text-muted"
                                style={{ 
                                    fontSize: '0.8rem',
                                }}
                            >
                                Masuk ke akun Anda
                            </p>
                        </div>
                    </div>
                        {error && <div className="alert alert-danger rounded-3 text-sm">{error}</div>}
        
                        <form onSubmit={handleLogin}>
                        <div className="mb-3 mb-sm-4">
                            <label 
                                htmlFor="email" 
                                className="form-label fw-semibold" 
                                style={{ color: '#1E3A8A', fontSize: '0.9rem' }}
                            >
                            Email
                            </label>
                            <input
                            type="email"
                            className="form-control rounded-3"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Masukkan email"
                            required
                            style={{
                                padding: '10px 12px',
                                border: '1px solid #E5E7EB',
                                fontSize: '0.9rem',
                                '@media (min-width: 768px)': {
                                padding: '12px 15px',
                                fontSize: '0.95rem'
                                }
                            }}
                            />
                        </div>
        
                        <div className="mb-3 mb-sm-4 position-relative">
                            <label 
                                htmlFor="password" 
                                className="form-label fw-semibold" 
                                style={{ color: '#1E3A8A', fontSize: '0.9rem' }}
                            >
                            Kata Sandi
                            </label>
                            <input
                            type={showPassword ? "text" : "password"}
                            className="form-control rounded-3 pe-5"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukkan kata sandi"
                            required
                            style={{
                                padding: '10px 12px',
                                border: '1px solid #E5E7EB',
                                fontSize: '0.9rem',
                                '@media (min-width: 768px)': {
                                padding: '12px 15px',
                                fontSize: '0.95rem'
                                }
                            }}
                            />
                            <button
                                type="button"
                                className="btn btn-link position-absolute"
                                style={{
                                    top: "60%",
                                    right: "10px",
                                    transform: "translateY(-30%)",
                                    padding: 0,
                                    color: '#3B82F6',
                                    '@media (min-width: 768px)': {
                                    top: "65%",
                                    right: "15px"
                                    }
                                }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
        
                        <div className="mb-3 mb-sm-4 d-flex justify-content-end">
                            <Link 
                            to="/auth/forgot-password" 
                            className="text-decoration-none"
                            style={{ 
                                color: '#3B82F6',
                                fontSize: '0.85rem',
                                '@media (min-width: 768px)': { fontSize: '0.9rem' }
                            }}
                            >
                            Lupa Kata Sandi?
                            </Link>
                        </div>
        
                            <button
                                type="submit"
                                className="btn w-100 rounded-3 fw-bold"
                                style={{ 
                                    background: '#4065B6',
                                    color: 'white',
                                    padding: '10px',
                                    border: 'none',
                                    transition: 'opacity 0.3s ease',
                                    fontSize: '0.9rem'
                                }}
                                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                                onMouseOut={(e) => e.target.style.opacity = '1'}
                                >
                                Masuk
                            </button>
                        </form>
        
                        <div className="text-center mt-3 mt-sm-4">
                        <p 
                            className="small"
                            style={{ 
                            color: '#6B7280',
                            fontSize: '0.8rem',
                            '@media (min-width: 768px)': { fontSize: '0.9rem' }
                            }}
                        >
                            Belum punya akun?{' '}
                            <Link 
                            to="/auth/register" 
                            className="text-decoration-none fw-bold"
                            style={{ color: '#3B82F6' }}
                            >
                            Daftar Sekarang
                            </Link>
                        </p>
                        </div>
                        
                    </div>
                    </div>
                </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default Login;
