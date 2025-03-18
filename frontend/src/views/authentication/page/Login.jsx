import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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
        <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="row w-100 justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card-body shadow rounded-4 p-4">
                        <h2 className="text-center text-primary fw-bold mb-4">Login</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleLogin}>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">Email</label>
                                <input
                                    type="email"
                                    className="form-control rounded-pill"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Masukkan Email Anda"
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
                                    placeholder="Masukkan Password Anda"
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
                            <div className="mb-3 d-flex justify-content-end">
                                <Link to="/auth/forgot-password" className="text-primary">Lupa password?</Link>
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary w-100 rounded-pill fw-bold"
                                style={{ transition: "all 0.3s ease" }}
                            >
                                Login
                            </button>
                        </form>
                        <div className="text-center mt-3">
                            <p className="small fw-bold">
                                Belum punya akun?{" "}
                                <Link to="/auth/register" className="text-danger text-decoration-none">Register</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
