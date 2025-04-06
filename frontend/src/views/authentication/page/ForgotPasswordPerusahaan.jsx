import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PageContainer from 'src/components/container/PageContainer';
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:5000/auth/forgot-password", { email });
        setMessage("Tautan pengaturan ulang kata sandi telah terkirim! Silakan periksa email Anda.");
    } catch (error) {
      console.error(error);
      if (error.response) {
        setError(error.response.data.message || "Gagal mengirim tautan pengaturan ulang.");
      } else {
        setError("Terjadi kesalahan jaringan. Silakan coba lagi.");
      }
    }
  };

  return (
    <PageContainer title="Pemulihan Kata Sandi Portal Perusahaan">
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
                Pemulihan Kata Sandi
            </h2>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
              <div className="mb-3 mb-sm-4 mt-3">
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
                        placeholder="Masukkan email Anda yang sudah terdaftar"
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
                    Kirim Tautan Atur Ulang
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
                      Apakah Anda sudah ingat kata sandi?{' '}
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

export default ForgotPassword;
