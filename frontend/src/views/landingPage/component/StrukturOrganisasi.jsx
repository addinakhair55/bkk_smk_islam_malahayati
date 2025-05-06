import HeroTitle from "../../../components/landingPage/HeroTitle";
import Footer from "../../../components/landingPage/Footer";
import Navbar from "../../../components/landingPage/Navbar";
import PageContainer from "src/components/container/PageContainer";
import { useEffect } from "react";
import Struktur from "../../../assets/images/backgrounds/struktur-organisasi.png"

export default function StrukturOrganisasi() {
  useEffect(() => {
            window.scrollTo(0, 0);
          }, []);
  return (
    <PageContainer title="Visi Misi BKK">
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
        <Navbar/>
        <div className="m-auto page-fade">
          <HeroTitle 
              title="Struktur Organisasi" 
              subtitle="BKK SMK ISLAM MALAHAYATI" 
          />
          <div className="text-center">
            <img
              src={Struktur}
              alt="Struktur Organisasi"
            />
          </div>
        </div>
        <Footer/>
    </PageContainer>
  );
}
