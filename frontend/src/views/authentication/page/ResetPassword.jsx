import { useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

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
      setTimeout(() => navigate("/auth/login"), 3000);
    } catch (error) {
      setError("Terjadi kesalahan saat mengatur ulang kata sandi. Silakan coba lagi.");
    }
  };

  return (
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card-body shadow rounded-4 p-4">
            <h2 className="text-center text-primary fw-bold mb-4">Atur Ulang Kata Sandi</h2>
            {success && <div className="alert alert-success">{success}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleResetPassword}>
              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label fw-semibold">Password Baru</label>
                <input
                  type={showPassword ? "text" : "password"}
                  className="form-control rounded-pill"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan Password Baru Anda"
                  required
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute"
                  style={{ top: "70%", right: "10px", transform: "translateY(-50%)" }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="confirmPassword" className="form-label fw-semibold">Konfirmasi Password Baru</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-control rounded-pill"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Masukkan Konfirmasi Password Baru"
                  required
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute"
                  style={{ top: "70%", right: "10px", transform: "translateY(-50%)" }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill fw-bold"
                style={{ transition: "all 0.3s ease" }}
              >
                Pulihkan Kata Sandi
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="small fw-bold">
                Apakah ingat kata sandi Anda?{" "}
                <Link href="/auth/login" className="text-danger text-decoration-none">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
