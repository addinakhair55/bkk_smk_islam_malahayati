import { FaInfoCircle, FaUsers, FaHandshake, FaUserGraduate } from "react-icons/fa";
import "./ManfaatBkk.css"

export default function ManfaatBkk() {
  const manfaatList = [
    {
      icon: <FaInfoCircle className="icon-color" />,
      title: "Pelayanan Informasi",
      desc: "Menyediakan informasi ketenagakerjaan terkini kepada alumni dan pencari kerja.",
    },
    {
      icon: <FaUsers className="icon-color" />,
      title: "Rekrutmen & Seleksi",
      desc: "Memfasilitasi alumni dalam proses rekrutmen kerja yang efisien dan efektif.",
    },
    {
      icon: <FaHandshake className="icon-color" />,
      title: "Hubungan Kerjasama",
      desc: "Menjalin hubungan dengan berbagai lembaga untuk informasi ketenagakerjaan yang up-to-date.",
    },
    {
      icon: <FaUserGraduate className="icon-color" />,
      title: "Hubungan Alumni",
      desc: "Menjaga hubungan dengan alumni yang sukses untuk membantu generasi berikutnya.",
    },
  ];

  return (
    <div
      style={{
        backgroundColor: "#ECF0F8",
        width: "100%",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "50px 15px",
      }}
    >
      <div className="container">
        <div className="text-center mb-4">
          <h2 className="fw-bold title-color">Manfaat Bursa Kerja Khusus</h2>
          <p className="text-muted">
            Bergabung dengan BKK SMK Islam Malahayati membawa berbagai keuntungan bagi siswa dan alumni. <br />
            Berikut adalah beberapa manfaat utama yang bisa Anda dapatkan:
          </p>
        </div>

        {/* Cards Row */}
        <div className="row g-4 justify-content-center">
          {manfaatList.map((manfaat, index) => (
            <div className="col-12 col-sm-10 col-md-6 col-lg-3" key={index}>
              <div className="card shadow border-0 h-100 hoverable-card text-center p-4">
                <div className="mb-3 icon-color">{manfaat.icon}</div>
                <h5 className="fw-bold subtitle-color">{manfaat.title}</h5>
                <p className="text-secondary">{manfaat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
