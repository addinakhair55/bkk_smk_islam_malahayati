import { Link } from 'react-router-dom';
import ErrorImg from 'src/assets/images/backgrounds/404-error-idea.gif';
import 'bootstrap/dist/css/bootstrap.min.css';

const Error = () => (
  <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
    <div className="container">
      <img src={ErrorImg} alt="404" className="img-fluid" style={{ maxWidth: '300px' }} />
      <h1 className="mt-4">Oops!!!</h1>
      <h4 className="mb-4">Halaman yang Anda cari tidak dapat ditemukan.</h4>
      <Link to="/" className="btn btn-primary">
        Kembali ke Halaman Utama
      </Link>
    </div>
  </div>
);

export default Error;
