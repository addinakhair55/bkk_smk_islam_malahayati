import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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
        <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card-body shadow rounded-4 p-4">
                        <h2 className="text-center text-primary fw-bold mb-4">Register</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label htmlFor="name" className="form-label fw-semibold">Nama Lengkap</label>
                                <input
                                    type="text"
                                    className="form-control rounded-pill"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Masukkan Nama Lengkap"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                <input
                                    type="email"
                                    className="form-control rounded-pill"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Masukkan Email"
                                    required
                                />
                            </div>
                            <div className="mb-3 position-relative">
                                <label htmlFor="password" className="form-label fw-semibold">Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="form-control rounded-pill pe-5"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Masukkan Password"
                                    required
                                />
                                <button
                                    type="button"
                                    className="btn btn-link position-absolute"
                                    style={{
                                        top: "73%",
                                        right: "10px",
                                        transform: "translateY(-50%)",
                                        padding: 0,
                                        lineHeight: 0,
                                    }}
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100 rounded-pill fw-bold"
                                style={{ transition: "all 0.3s ease" }}
                            >
                                Register
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <p className="small fw-bold">
                                Sudah punya akun?{" "}
                                <Link to="/auth/login" className="text-danger text-decoration-none">Login</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
