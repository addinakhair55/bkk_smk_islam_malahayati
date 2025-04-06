import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import PageContainer from 'src/components/container/PageContainer';

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`http://localhost:5000/auth/reset-password/${token}`, {
        newPassword: password,
      });
      setSuccess("Pengaturan ulang kata sandi berhasil. Anda sekarang dapat login.");
      setTimeout(() => navigate("/auth/login/perusahaan"), 3000);
    } catch (error) {
      setError("Terjadi kesalahan saat mengatur ulang kata sandi. Silakan coba lagi.");
    }
  };

  return (
    <PageContainer title="Atur Ulang Kata Sandi Portal Perusahaaan">
      <div className="vh-100 d-flex justify-content-center align-items-center" style={{backgroundColor:"#4065B6"}}>
        <div className="row w-100 justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card-body shadow-lg rounded-4 p-4 bg-light">
              <h2 
                  className="fw-bold text-center" 
                  style={{ 
                  color: '#1E3A8A',
                  fontSize: '1.5rem',
                  '@media (min-width: 768px)': { fontSize: '2rem' }
                  }}
              >
                  Atur Ulang Kata Sandi
              </h2>
              {success && <div className="alert alert-success">{success}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleResetPassword}>
                <div className="mb-3 mb-sm-4 mt-3 position-relative">
                    <label 
                        htmlFor="password" 
                        className="form-label fw-semibold" 
                        style={{ color: '#1E3A8A', fontSize: '0.9rem' }}
                    >
                    Kata Sandi Baru
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
                <div className="mb-3 mb-sm-4 position-relative">
                    <label 
                        htmlFor="confirmPassword" 
                        className="form-label fw-semibold" 
                        style={{ color: '#1E3A8A', fontSize: '0.9rem' }}
                    >
                    Konfirmasi Kata Sandi Baru
                    </label>
                    <input
                    type={showConfirmPassword ? "text" : "confirmPassword"}
                    className="form-control rounded-3 pe-5"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                      Simpan Perubahan Kata Sandi
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
                        Apakah sudah ingat kata sandi Anda?{' '}
                        <Link 
                        to="/auth/login/perusahaan" 
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
    </PageContainer>
  );
};

export default ResetPassword;
