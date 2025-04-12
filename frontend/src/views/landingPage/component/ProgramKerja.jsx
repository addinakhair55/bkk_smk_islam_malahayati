import Content from "../../../components/landingPage/Content";
import HeroTitle from "../../../components/landingPage/HeroTitle";
import Footer from "../../../components/landingPage/Footer";
import Navbar from "../../../components/landingPage/Navbar";
import { useEffect } from "react";
import PageContainer from "src/components/container/PageContainer";

export default function ProgramKerja() {
  useEffect(() => {
          window.scrollTo(0, 0);
        }, []);
  return (
    <PageContainer title="Program Kerja BKK">
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
      <div className="page-fade">
        <HeroTitle 
          title="Program Kerja BKK" 
          description="Program Kerja / Kegiatan BKK SMK Islam Malahayati"
          isButtonVisible={true} 
        />
            <Content 
              content={
                <>
                  <ol className="text-justify" style={{ lineHeight: "1.8", textAlign: "justify" }}>
                    <li>Mengadakan koordinasi dengan Kaprog serta Waka Bid. Kesiswaan dan Kurikulum.</li>
                    <li>Mengadakan pertemuan dengan Kaprog tentang prakerin serta berkoordinasi dengan panitia prakerin.</li>
                    <li>Melakukan proses negosiasi dengan DU/DI dan pemerintah sebagai mitra dalam penempatan siswa-siswi prakerin.</li>
                    <li>Menjalin kerja sama (MOU) dengan DU/DI dalam sinkronisasi kurikulum, pelatihan, dan penempatan tamatan.</li>
                    <li>Menindaklanjuti kerja sama dengan industri pasangan yang telah menjadi mitra kerja dengan BKK sekolah.</li>
                    <li>Pemetaan DU/DI.</li>
                    <li>Membuat database penelusuran tamatan baik yang sudah bekerja maupun belum bekerja.</li>
                    <li>Memberikan informasi serta melakukan penyuluhan/bimbingan karir serta pelatihan/magang.</li>
                    <li>Menanamkan jiwa entrepreneurship kepada siswa melalui pelatihan keterampilan untuk menjadi seorang wirausaha (entrepreneur).</li>
                    <li>Membuat jaringan alumni.</li>
                    <li>Membuat mading informasi lowongan kerja.</li>
                    <li>Membuat website khusus BKK yang selalu up-to-date dan dapat di-link dengan situs-situs job carrier.</li>
                    <li>Memberikan informasi pasar kerja, pendaftaran pencari kerja, penyaluran, dan penempatan pencari kerja.</li>
                    <li>Memantau perkembangan karir tamatan.</li>
                    <li>Menjalin kerja sama dengan Depnakertrans tentang pelatihan (magang) dan penempatan tamatan.</li>
                    <li>Membuat laporan kegiatan.</li>
                    <li>Monitoring dan evaluasi.</li>
                  </ol>
                </>
              }
            />
      </div>
      <Footer />
    </PageContainer>
  );
}
