import { useEffect } from "react";
import Footer from "../../../components/landingPage/Footer";
import HeroTitle from "../../../components/landingPage/HeroTitle";
import Kontak from "../../../components/landingPage/Kontak";
import Navbar from "../../../components/landingPage/Navbar";


export default function KontakView() {
    useEffect(() => {
            window.scrollTo(0, 0);
          }, []);
 return(
    <>
        <Navbar/>
        <HeroTitle
            title="Kontak Kami" 
            description="Hubungi kami untuk pertanyaan atau informasi lebih lanjut" 
        />
        <Kontak/>
        <Footer/>
    </>
 )
}