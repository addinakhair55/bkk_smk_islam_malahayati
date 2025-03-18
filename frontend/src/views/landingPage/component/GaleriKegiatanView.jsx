import Footer from "../../../components/landingPage/Footer";
import HeroTitle from "../../../components/landingPage/HeroTitle";
import PageContainer from "src/components/container/PageContainer";
import Navbar from "../../../components/landingPage/Navbar";
import gallery1 from "../../../assets/images/products/s4.jpg";
import { useEffect } from "react";

const images = [
    gallery1,
    gallery1,
    gallery1,
    gallery1,
    gallery1,
    gallery1,
    gallery1,
    gallery1,
    gallery1,
];



export default function GaleriKegiatanView() {
    useEffect(() => {
            window.scrollTo(0, 0);
          }, []);
    return (
        <>
            <Navbar />
            <PageContainer title="Galeri Kegiatan BKK SMK Islam Malahayati">
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
            </PageContainer>
            <Footer />
        </>
    );
}
