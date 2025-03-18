import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../../components/LandingPage/Navbar';
import Footer from '../../../components/landingPage/Footer';
import HeroTitle from '../../../components/landingPage/HeroTitle';

export default function TracerStudyView() {
    const [tracerStudy, setTracerStudy] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterGender, setFilterGender] = useState('');
    const [filterJurusan, setFilterJurusan] = useState('');
    const [filterTahun, setFilterTahun] = useState('');

    useEffect(() => {
            window.scrollTo(0, 0);
        const fetchTracerStudy = async () => {
            try {
                const response = await axios.get('http://localhost:5000/tracer-study');
                setTracerStudy(response.data);
            } catch (error) {
                setError('Terjadi kesalahan saat mengambil data tracer study.');
            } finally {
                setLoading(false);
            }
        };
        fetchTracerStudy();
    }, []);

    const filteredAlumni = tracerStudy.filter(user =>
        user.status.toLowerCase() !== 'tolak' &&
        (user.nama_lengkap.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.jurusan.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.status_anda.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (filterGender === '' || user.jenis_kelamin === filterGender) &&
        (filterJurusan === '' || user.jurusan === filterJurusan) &&
        (filterTahun === '' || user.tahun_lulus.toString() === filterTahun)
    );

    if (loading) return <p className='text-center mt-5'>Loading...</p>;
    if (error) return <p className='text-center text-danger mt-5'>{error}</p>;

    return (
        <>
            <Navbar />
            <HeroTitle 
                title='Tracer Study' 
                subtitle='SMK ISLAM MALAHAYATI' 
                description='Data Tracer Study Alumni Kelulusan SMK Islam Malahayati' 
            />
            <div
                className="align-items-center align-content-center"
                style={{
                    backgroundColor: "#ECF0F8",
                  }}
            >

            <div className="container">
                <div className="mb-4">
                    <input
                        type="text"
                        className="form-control my-3 rounded-pill px-4 py-3 border shadow-sm"
                        placeholder='Cari berdasarkan nama, jurusan, atau status'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="row">
                        {[{label: 'Jenis Kelamin', value: filterGender, setter: setFilterGender, options: ['', 'Laki-Laki', 'Perempuan']},
                          {label: 'Jurusan', value: filterJurusan, setter: setFilterJurusan, options: ['', 'AKL', 'TKJ', 'ADM']},
                          {label: 'Tahun Lulus', value: filterTahun, setter: setFilterTahun, options: ['', '2024', '2023', '2022']}
                        ].map((filter, idx) => (
                            <div className="col-md-4 p-2" key={idx}>
                                <select
                                    className="form-control rounded-pill px-4 py-2 border shadow-sm"
                                    value={filter.value}
                                    onChange={(e) => filter.setter(e.target.value)}
                                >
                                    <option value=''>Semua {filter.label}</option>
                                    {filter.options.slice(1).map((option, i) => (
                                        <option key={i} value={option}>{option}</option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="container">
                <Table bordered hover responsive className="table-striped table-hover rounded shadow-sm mt-3 text-center">
                    <thead className="table-primary">
                        <tr>
                            <th>No</th>
                            <th>Nama Lengkap</th>
                            <th>Jenis Kelamin</th>
                            <th>Jurusan</th>
                            <th>Tahun Lulus</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAlumni.length > 0 ? (
                            filteredAlumni.map((user, index) => (
                                <tr key={user._id} className="align-middle">
                                    <td>{index + 1}</td>
                                    <td>{user.nama_lengkap}</td>
                                    <td>{user.jenis_kelamin}</td>
                                    <td>{user.jurusan}</td>
                                    <td>{user.tahun_lulus}</td>
                                    <td>{user.status_anda}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">Tidak ada data yang ditemukan.</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
            </div>
            <Footer />
        </>
    );
}