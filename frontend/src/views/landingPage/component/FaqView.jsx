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
            <Navbar />
            <PageContainer title="Frequently Asked Questions (FAQ)">
                <HeroTitle title="Frequently Asked Questions (FAQ)"/>
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
                                        Anda bisa mengakses halaman <Link to="/info-loker" className="fw-bold text-decoration-none text-primary">Lowongan Kerja</Link> di website ini atau mengikuti media sosial kami untuk informasi terbaru.
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
                                        Bagaimana cara mendaftar Tracer Study?
                                    </button>
                                </h2>
                                <div id="faq4" className="accordion-collapse collapse" data-bs-parent="#faqAccordion">
                                    <div className="accordion-body">
                                        <p>
                                            Tracer Study hanya diperuntukkan bagi alumni <span className="fw-bold text-primary">SMK ISLAM MALAHAYATI</span>.
                                        </p>
                                        <p>
                                            Anda dapat mendaftar dengan mengakses link berikut: 
                                            <Link to="#" className="fw-bold text-decoration-none text-primary"> Pendaftaran Tracer Study</Link>.
                                        </p>
                                        <p>
                                            Lalu mengisi formulir dengan data yang diminta. Pastikan Anda mengisi informasi dengan benar agar data alumni dapat tercatat dengan baik.
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
                                            <span className="fw-bold text-primary"> SMK Islam Malahayati</span>.
                                        </p>
                                        <p>
                                            Anda dapat menghubungi admin BKK SMK Islam Malahayati melalui link berikut: 
                                            <Link to="#" className="fw-bold text-decoration-none text-primary"> Kontak Admin BKK</Link>.
                                        </p>
                                        <p>
                                            Setelah itu, silakan mengisi formulir dengan data yang diminta. 
                                            <span className="fw-bold"> Pastikan Anda mengisi informasi dengan benar</span> agar data alumni dapat tercatat dengan baik.
                                        </p>
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
