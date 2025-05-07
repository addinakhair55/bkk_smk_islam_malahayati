import { Link } from "react-router-dom";
import Footer from "../../../components/landingPage/Footer";
import HeroTitle from "../../../components/landingPage/HeroTitle";
import Navbar from "../../../components/landingPage/Navbar";
import PageContainer from "src/components/container/PageContainer";
import { useEffect } from "react";

export default function FaqView() {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <>
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
            <PageContainer title="Frequently Asked Questions (FAQ)">
                <div className="page-fade">
                    <HeroTitle title="Frequently Asked Questions"/>
                    <div style={{ backgroundColor: "#ECF0F8"}} className="py-5">
                        <div className="container my-5">
                            <div className="accordion" id="faqAccordion">
                                {/* FAQ 1 */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button 
                                            className="accordion-button" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#faq1"
                                            aria-expanded="true"
                                            aria-controls="faq1"
                                        >
                                            Apa itu Bursa Kerja Khusus (BKK)?
                                        </button>
                                    </h2>
                                    <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Bursa Kerja Khusus (BKK) adalah unit di sekolah yang membantu siswa dan alumni dalam mencari peluang kerja serta menjalin kerjasama dengan perusahaan.
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ 2 */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button 
                                            className="accordion-button collapsed" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#faq2"
                                            aria-expanded="false"
                                            aria-controls="faq2"
                                        >
                                            Apakah layanan di BKK ini berbayar?
                                        </button>
                                    </h2>
                                    <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Tidak, semua layanan yang disediakan oleh BKK SMK Islam Malahayati bersifat gratis bagi siswa dan alumni.
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ 3 */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button 
                                            className="accordion-button collapsed" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#faq3"
                                            aria-expanded="false"
                                            aria-controls="faq3"
                                        >
                                            Bagaimana cara mengetahui Informasi Lowongan Kerja terbaru?
                                        </button>
                                    </h2>
                                    <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            Anda bisa mengakses halaman 
                                            <Link to="/info-loker" 
                                                className="fw-bold text-decoration-none mx-2" 
                                                style={{color: '#4065B6'}}
                                                onMouseOver={(e) => (e.target.style.color = '#bbc8e3')}
                                                onMouseOut={(e) => (e.target.style.color = '#4065B6')}>Lowongan Kerja
                                            </Link>
                                            di website ini atau mengikuti media sosial kami untuk informasi terbaru.
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ 4 */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button 
                                            className="accordion-button collapsed" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#faq4"
                                            aria-expanded="false"
                                            aria-controls="faq4"
                                        >
                                            Bagaimana cara mengisi Tracer Study?
                                        </button>
                                    </h2>
                                    <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            <p>
                                            Tracer Study hanya diperuntukkan bagi alumni <span className="fw-bold" style={{color: '#4065B6'}}>SMK ISLAM MALAHAYATI</span>.
                                            </p>
                                            <p>
                                            Alumni yang <span className="fw-bold">belum memiliki akun</span> diwajibkan untuk mendaftar terlebih dahulu. 
                                            <span className="fw-bold"> Jika sudah memiliki akun, silakan login</span>.
                                            </p>
                                            <p>
                                            Setelah berhasil login, alumni dapat mengisi formulir Tracer Study. 
                                            Pastikan seluruh data yang diisi benar dan lengkap agar informasi alumni dapat tercatat dengan baik.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* FAQ 5 */}
                                <div className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button 
                                            className="accordion-button collapsed" 
                                            type="button" 
                                            data-bs-toggle="collapse" 
                                            data-bs-target="#faq5"
                                            aria-expanded="false"
                                            aria-controls="faq5"
                                        >
                                            Bagaimana cara jika data Anda (Alumni) tidak ada di halaman Tracer Study?
                                        </button>
                                    </h2>
                                    <div id="faq5" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                        <div className="accordion-body">
                                            <p>
                                                <strong>Tracer Study</strong> hanya diperuntukkan bagi alumni 
                                                <span className="fw-bold" style={{color: '#4065B6'}}> SMK Islam Malahayati</span>.
                                            </p>
                                            <p>
                                                Anda dapat menghubungi admin BKK SMK Islam Malahayati melalui link berikut: 
                                                <Link 
                                                    to="https://wa.me/6285283022455" 
                                                    className="fw-bold text-decoration-none mx-2"
                                                    style={{
                                                        color: '#4065B6'
                                                    }}
                                                    onMouseOver={(e) => (e.target.style.color = '#bbc8e3')}
                                                    onMouseOut={(e) => (e.target.style.color = '#4065B6')}
                                                >
                                                    Kontak Admin BKK
                                                </Link>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
            <Footer />
        </>
    );
}
