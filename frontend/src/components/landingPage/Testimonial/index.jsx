import { Carousel } from "react-bootstrap";
import "./Testimonial.css";
import Testimoni from "../../../assets/images/profile/Lestari_Mutiara_Firda.jpg"
import Testimoni2 from "../../../assets/images/profile/tegar-rakasiwi.png"
import Testimoni3 from "../../../assets/images/profile/Addina_Khairinisa.jpg"

export default function Testimonial() {
  return (
    <section  style={{
      backgroundColor: "#ECF0F8",
    }}>
      <div className="container py-5 mb-lg-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold title-color">Testimonial</h2>
          <p className="text-muted">
            Hasil testimoni dari pengguna yang telah merasakan layanan BKK SMK ISLAM MALAHAYATI.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <Carousel indicators={false}>
          {[
            {
              name: "Lestari Mutiara Firda",
              job: "Akuntansi",
              image: Testimoni,
              text: "Layanan ini sangat membantu dalam menemukan lowongan kerja. Prosesnya mudah dan sangat user-friendly.",
            },
            {
              name: "Addina Khairinisa",
              job: "Mahasiswa",
              image: Testimoni3,
              text: "Fitur tracer study memudahkan saya dalam mengisi data setelah lulus, semuanya praktis dan jelas.",
            },
            {
              name: "Tegar Rakasiwi",
              job: "Mahasiswa",
              image: Testimoni2,
              text: "BKK online ini membuat saya merasa lebih diperhatikan sebagai alumni.",
            },
          ].map((testimonial, index) => (
            <Carousel.Item key={index}>
              <div className="d-flex m-4 justify-content-center">
                <div className="card text-center p-4 shadow border-0 w-100" style={{ maxWidth: "500px" }}>
                  <div className="image-container mb-3">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="rounded-circle mb-3"
                      style={{ width: "100px", height: "100px", objectFit: "cover" }}
                    />
                  </div>
                  <h5 className="fw-bold" style={{color:"#4065B6"}}>{testimonial.name}</h5>
                  <p className="text-muted">{testimonial.job}</p>
                  <p className="text-secondary">&quot;{testimonial.text}&quot;</p>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
