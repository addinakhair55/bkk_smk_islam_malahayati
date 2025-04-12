import { useEffect } from "react";
import Footer from "../../../components/landingPage/Footer";
import HeroTitle from "../../../components/landingPage/HeroTitle";
import Kontak from "../../../components/landingPage/Kontak";
import Navbar from "../../../components/landingPage/Navbar";
import PageContainer from "src/components/container/PageContainer";


export default function KontakView() {
    useEffect(() => {
            window.scrollTo(0, 0);
          }, []);
 return(
    <PageContainer title="Kontak BKK">
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
        <div className="page-fade">
            <HeroTitle
                title="Kontak Kami" 
                description="Hubungi kami untuk pertanyaan atau informasi lebih lanjut" 
            />
            <Kontak/>
        </div>
        <Footer/>
    </PageContainer>
 )
}