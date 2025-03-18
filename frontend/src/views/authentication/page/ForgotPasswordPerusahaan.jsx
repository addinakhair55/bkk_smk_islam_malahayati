import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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
    <div className="vh-100 d-flex justify-content-center align-items-center bg-light">
      <div className="row w-100 justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card-body shadow rounded-4 p-4">
            <h2 className="text-center text-primary fw-bold mb-4">Pemulihan Kata Sandi</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
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
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-pill fw-bold"
                style={{ transition: "all 0.3s ease" }}
              >
                Kirim Tautan Atur Ulang
              </button>
            </form>
            <div className="text-center mt-3">
              <p className="small fw-bold">
                Apakah ingat kata sandi Anda?{" "}
                <Link href="/auth/login/perusahaan" className="text-danger text-decoration-none">Login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
