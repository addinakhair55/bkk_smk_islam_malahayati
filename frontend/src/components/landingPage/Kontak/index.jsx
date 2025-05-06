import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaInstagram } from "react-icons/fa";
import "./Kontak.css"

const kontakList = [
  {
    icon: <FaMapMarkerAlt className="icon-kontak" />,
    title: "Alamat",
    desc: "Jalan Bima No.3, RT.8/RW.7, Cijantung, Pasar Rebo, Kota Jakarta Timur, Daerah Khusus Ibukota Jakarta 13770",
  },
  {
    icon: <FaPhone className="icon-kontak" />,
    title: "Telepon",
    desc: "0852-8302-2455",
  },
  {
    icon: <FaEnvelope className="icon-kontak" />,
    title: "Email",
    desc: "bkksmkislammalahayati20@gmail.com",
  },
  {
    icon: <FaInstagram className="icon-kontak" />,
    title: "Instagram",
    desc: "@bkksmkislammalahayati_20",
  },
];

export default function Kontak() {
  return (
    <div className="container-fluid py-4 align-content-center"
      style={{
        backgroundColor: "#ECF0F8",
        width: "100%",
        minHeight: "90vh",
      }}
    >
      <div className="row align-items-center justify-content-center">
        <div className="col-12 col-md-5 mb-4 mb-md-0">
          {kontakList.map((kontak, index) => (
            <div key={index} className="d-flex mb-3 p-3 flex-column flex-md-row text-center text-md-start mt-2">
              <div className="me-0 me-md-3 icon_kontak">{kontak.icon}</div>
              <div>
                <h5 className="mb-1 fw-bold font-kontak">{kontak.title}</h5>
                <p className="mb-0 text-dark">{kontak.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="col-12 col-md-6">
          <div className="card rounded shadow-lg overflow-hidden">
            <iframe
              title="Google Maps"
              className="w-100 rounded"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15843.945539538184!2d106.7770121!3d-6.3245117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ed98ffab58fd%3A0x2d9e604541fe97cb!2sJalan%20Bima%20No.3%2C%20Cijantung%2C%20Kec.%20Ps.%20Rebo%2C%20Kota%20Jakarta%20Timur%2C%20Daerah%20Khusus%20Ibukota%20Jakarta%2013770!5e0!3m2!1sid!2sid!4v1625647382227!5m2!1sid!2sid"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}