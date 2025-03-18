import Content from "../../../components/landingPage/Content";
import HeroTitle from "../../../components/landingPage/HeroTitle";
import Footer from "../../../components/landingPage/Footer";
import Navbar from "../../../components/LandingPage/Navbar";
import { useEffect } from "react";

export default function VisiMisi() {
  useEffect(() => {
            window.scrollTo(0, 0);
          }, []);
  return (
    <>
        <Navbar/>
        <div className="m-auto">
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
    </>
  );
}
