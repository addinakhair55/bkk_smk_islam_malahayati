import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import PageContainer from 'src/components/container/PageContainer';
import { FaHome } from "react-icons/fa";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {
            const { data } = await axios.post("http://localhost:5000/auth/register", { name, email, password });
            localStorage.setItem("token", data.token);
            navigate("/auth/login");
        } catch (error) {
            setError("Error registering user");
        }
    };

    return (
        <PageContainer title="Register Portal Alumni">
        <div 
            className="d-flex justify-content-center align-items-center p-3"
            style={{ 
                background: 'linear-gradient(135deg, #4065B6 0%, #3B82F6 100%)',
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
                                Daftar Akun
                            </h2>
                            <p 
                                className="text-muted"
                                style={{ 
                                    fontSize: '0.8rem',
                                }}
                            >
                                Daftarkan Akun Anda
                            </p>
                        </div>
                    </div>

                    {error && <div className="alert alert-danger rounded-3 text-sm">{error}</div>}

                    <form onSubmit={handleRegister}>
                        <div className="mb-3 mb-sm-4">
                        <label 
                            htmlFor="name" 
                            className="form-label fw-semibold" 
                            style={{ color: '#1E3A8A', fontSize: '0.9rem' }}
                        >
                            Nama Lengkap
                        </label>
                        <input
                            type="text"
                            className="form-control rounded-3"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Masukkan Nama Lengkap"
                            required
                            style={{
                            padding: '10px 12px',
                            border: '1px solid #E5E7EB',
                            fontSize: '0.9rem',
                            }}
                        />
                        </div>

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
                            placeholder="Masukkan Email"
                            required
                            style={{
                            padding: '10px 12px',
                            border: '1px solid #E5E7EB',
                            fontSize: '0.9rem',
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
                            placeholder="Masukkan Kata Sandi"
                            required
                            style={{
                            padding: '10px 12px',
                            border: '1px solid #E5E7EB',
                            fontSize: '0.9rem',
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
                            }}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
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
                            Daftar
                        </button>
                    </form>

                    <div className="text-center mt-3 mt-sm-4">
                        <p 
                        className="small"
                        style={{ 
                            color: '#6B7280',
                            fontSize: '0.8rem',
                        }}
                        >
                        Sudah punya akun?{' '}
                        <Link 
                            to="/auth/login" 
                            className="text-decoration-none fw-bold"
                            style={{ color: '#3B82F6' }}
                        >
                            Masuk Sekarang
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

export default Register;
