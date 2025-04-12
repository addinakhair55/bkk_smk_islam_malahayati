import Content from "../../../components/landingPage/Content";
import HeroTitle from "../../../components/landingPage/HeroTitle";
import Footer from "../../../components/landingPage/Footer";
import Navbar from "../../../components/landingPage/Navbar";
import PageContainer from "src/components/container/PageContainer";
import { useEffect } from "react";

export default function VisiMisi() {
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
              title="Visi & Misi BKK" 
              subtitle="BKK SMK ISLAM MALAHAYATI" 
          />
          <Content 
            title="Visi" 
            content="Visi BKK adalah mewujudkan keterserapan lulusan SMK Islam Malahayati ke Dunia Usaha dan Dunia Industri sesuai dengan kompetensi yang dimiliki secara profesional, produktif, mandiri, berbudi pekerti luhur yang mampu bersaing di pasar global." 
          />
          <Content 
            title="Misi" 
            content="Misi BKK adalah menyalurkan dan menempatkan lulusan SMK Islam Malahayati ke Dunia Usaha/Dunia Industri serta meningkatkan kerja sama dengan pengguna lulusan." 
          />
        </div>
        <Footer/>
    </PageContainer>
  );
}
