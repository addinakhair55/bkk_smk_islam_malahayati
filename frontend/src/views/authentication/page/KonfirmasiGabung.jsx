import Navbar from '../../../components/landingPage/Navbar';
import Footer from '../../../components/landingPage/Footer';
import { FaExclamationCircle } from 'react-icons/fa';
import PageContainer from 'src/components/container/PageContainer';
import { useEffect } from 'react';

export default function KonfirmasiGabung() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <PageContainer title="Konfirmasi Gabung">
      <style>{`
          @keyframes fadeIn {
          from {
              opacity: 0;
              transform: translateY(20px);
          }
          to {
              opacity: 1;
              transform: translateY(0);
          }
          }

          .page-fade {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0;
          }
      `}</style>
      <Navbar />
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center page-fade"
        style={{
          background: '#ECF0F8',
          padding: '40px 20px',
        }}
      >
        <div
          className="mb-5 border-0"
          style={{
            background: '#ffffff',
            padding: '40px 30px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid #d1d5db',
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
            zIndex: 2,
            animation: 'fadeIn 1s ease-in-out',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
          }}
        >
          <h1
            className="fw-bold"
            style={{
              fontSize: '2rem',
              color: '#1E3A8A',
              marginBottom: '20px',
              textShadow: '0 4px 8px #ffffff7f',
              letterSpacing: '1px'
            }}
          >
            Daftar Partnership Perusahaan
          </h1>
          <p
            className="mb-4"
            style={{
              fontSize: '1.1rem',
              color: '#4B5EAA',
              lineHeight: '1.5',
              fontStyle: 'italic'
            }}
          >
            Daftarkan perusahaan Anda sekarang untuk mendapatkan akses penuh ke jaringan terintegrasi siswa dan alumni SMK Islam Malahayati. Temukan talenta unggulan terbaik untuk perusahaan Anda!
          </p>
        </div>

        <div
          className="mb-5 p-4"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            color: '#1E3A8A',
            maxWidth: '550px',
            width: '100%',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            zIndex: 2,
            borderLeft: '5px solid #3B82F6',
            animation: 'slideUp 1s ease-in-out'
          }}
        >
          <h4
            className="fw-semibold"
            style={{
              fontSize: '1.5rem',
              marginBottom: '15px',
              color: '#1E3A8A'
            }}
          >
            <FaExclamationCircle style={{ color: '#3B82F6', marginRight: '10px' }} />
            Sekolah Belum Mengunggah Perjanjian Kerjasama
          </h4>
          <p
            style={{
              fontSize: '1rem',
              margin: 0,
              color: '#4B5EAA'
            }}
          >
            Harap hubungi pihak sekolah untuk informasi lebih lanjut.
          </p>
        </div>
      </div>
      <Footer />
    </PageContainer>
  );
}