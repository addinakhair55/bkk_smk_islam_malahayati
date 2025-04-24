import Carousel from 'react-bootstrap/Carousel';
import carousel1 from '../../Image/carousel-1.jpg';
import carousel2 from '../../Image/carousel-2.png';
import carousel3 from '../../Image/carousel-3.jpg';
import "./Beranda.css";

function Beranda() {
  return (
    <Carousel>
      <Carousel.Item>
        <div className="carousel-overlay"></div>
        <img
          className="d-block w-100"
          src={carousel1}
          alt="First slide"
        />
        <Carousel.Caption className="position-1">
          <h1>Selamat Datang di <br />BKK SMK ISLAM MALAHAYATI</h1>
          <p>Jembatan menuju karier impian Anda.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-overlay"></div>
        <img
          className="d-block w-100"
          src={carousel2}
          alt="Second slide"
        />
        <Carousel.Caption>
          <h1>Profil Alumni Sukses</h1>
          <p>Kisah inspiratif alumni berprestasi.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <div className="carousel-overlay"></div>
        <img
          className="d-block w-100"
          src={carousel3}
          alt="Third slide"
        />
        <Carousel.Caption>
          <h1>Lowongan Kerja Terbaru</h1>
          <p>Peluang karier terkini untuk Anda.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Beranda;
