import Footer from "../../../components/landingPage/Footer";
import HeroTitle from "../../../components/landingPage/HeroTitle";
import PageContainer from "src/components/container/PageContainer";
import Navbar from "../../../components/landingPage/Navbar";
import gallery1 from "../../../assets/images/backgrounds/galeri-1.jpg";
import gallery2 from "../../../assets/images/backgrounds/galeri-2.png";
import gallery3 from "../../../assets/images/backgrounds/galeri-3.jpg";
import gallery4 from "../../../assets/images/backgrounds/galeri-4.jpg";
import gallery5 from "../../../assets/images/backgrounds/galeri-5.jpg";
import gallery6 from "../../../assets/images/backgrounds/galeri-6.jpg";
import { useEffect } from "react";

const images = [
    gallery1,
    gallery2,
    gallery3,
    gallery4,
    gallery5,
    gallery6,
];



export default function GaleriKegiatanView() {
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
            <PageContainer title="Galeri Kegiatan BKK">
                <div className="page-fade">
                    <HeroTitle title="Galeri Kegiatan" />
                    <div style={{ backgroundColor: "#ECF0F8"}} className="py-5">
                        <div className="container">
                            <div className="row g-4">
                                {images.map((src, index) => (
                                    <div key={index} className="col-12 col-sm-6 col-md-4">
                                        <div className="card shadow-sm border-0 rounded-3">
                                            <img
                                                src={src}
                                                alt={`Galeri ${index + 1}`}
                                                className="card-img-top img-fluid rounded-3"
                                                style={{ height: "250px", objectFit: "cover" }} 
                                                onError={(e) => e.target.src = "/images/default.jpg"}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </PageContainer>
            <Footer />
        </>
    );
}
