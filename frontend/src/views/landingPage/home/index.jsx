import Footer from "../../../components/landingPage/Footer";
import Heroes from "../../../components/landingPage/Heroes";
import InfoLoker from "../../../components/landingPage/InfoLoker";
import Manfaat from "../../../components/LandingPage/Manfaat";
import Testimonial from "../../../components/landingPage/Testimonial";
import Navbar from "../../../components/landingPage/Navbar";
import imgHero from "../../../assets/images/backgrounds/4.png";
import imgHero2 from "../../../components/Image/img-heroes2.png";
import imgHero3 from "../../../assets/images/backgrounds/5.png";
import PageContainer from "src/components/container/PageContainer";
import "./Home.css"

const sections = [
  {
    imgSrc: imgHero,
    imgAlt: "SMK ISLAM MALAHAYATI",
    imgCol: 4,
    imgOrder: 2,
    imgAlign: "text-md-end",
    textOrder: 1,
    textAlign: "text-md-start",
    title: "Selamat Datang di",
    title2: "BKK SMK Islam Malahayati",
    titleClass: "fw-bold lh-2 mb-3 font-judul",
    titleClass2: "fw-bold lh-2 mb-3 font-judul",
    description: "Kami menyediakan berbagai informasi karir untuk membantu Anda sukses dalam dunia kerja. Temukan lowongan pekerjaan di sini.",
    descClass: "font-des text-spacing",
    button: "Lowongan Kerja",
    buttons: "Tracer Study",
   
  },
  {
    imgSrc: imgHero2,
    imgAlt: "SMK ISLAM MALAHAYATI",
    imgCol: 5,
    imgOrder: 1,
    imgAlign: "text-md-start",
    textOrder: 2,
    textAlign: "text-md-start",
    title: "Sambutan Kepala Sekolah",
    titleClass: "fw-bold lh-2 mb-3 font-title2",
    subtitle: "H. Akhmad Sururi, S.Ag. M. Pd",
    subtitleClass: "fw-bold lh-2 mb-3 font-title3",
    description: "Bismillahirohmannirrohim. Assalamualaikum Warahmatullahi Wabarakatuh. Selamat datang di website resmi BKK SMK Islam Malahayati. Website ini hadir untuk menyediakan informasi terkini tentang program, kegiatan, dan layanan sekolah, khususnya dalam mendukung lulusan memasuki dunia kerja. Melalui informasi pasar kerja, pelatihan, dan penyaluran tenaga kerja, kami berharap website ini menjadi sarana komunikasi yang efektif bagi siswa, alumni, dan masyarakat untuk mendukung kemajuan pendidikan dan karir generasi muda.",
    descClass: "font-des1 text-justify text-spacing",
  },
  {
    imgSrc: imgHero3,
    imgAlt: "SMK ISLAM MALAHAYATI",
    imgCol: 4,
    imgOrder: 2,
    imgAlign: "text-md-end",
    textOrder: 1,
    textAlign: "text-md-start",
    title: "Apa itu BKK SMK Islam Malahayati?",
    titleClass: "fw-bold lh-2 mb-3 font-title2",
    description: "Bursa Kerja Khusus (BKK) SMK Islam Malahayati merupakan unit kerja sekolah yang dibentuk di SMK Islam Malahayati,  yang mempunyai tugas mempertemukan antara pencari kerja dengan pengguna tenaga kerja, kegiatannya adalah memberikan Informasi Pasar Kerja, pendaftaran pencari kerja, memberi penyuluhan dan bimbingan jabatan, penyaluran dan penempatan tenaga kerja serta merupakan mitra Dinas Tenaga Kerja dan Transmigrasi.",
    descClass: "font-des text-spacing",
  },
];

export default function Home() {
  return (
    <PageContainer title="BKK SMK Islam Malahayati" className="m-auto style-font">
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
          <Heroes sections={sections}/>
          <Manfaat/>
          <InfoLoker/>
          <Testimonial/>
        </div>
        <Footer/>
    </PageContainer>
  );
}
