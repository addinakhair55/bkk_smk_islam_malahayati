import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import AdminMouPerusahaan from '../../../components/dashboard/admin/Perusahaan/Mou';
import { BsPlus } from 'react-icons/bs';

const Mou = () => {
  return (
    <PageContainer title="MoU/Kerjasama Perusahaan">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">
          MoU/Kerjasama Perusahaan
        </h4>
        <Link 
          to="/createMouPerusahaan"
          className="btn btn-outline-primary d-flex align-items-center fw-semibold px-3 py-2 shadow-sm"
          style={{
            borderRadius: "8px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#1b69bd";
            e.target.style.color = "white";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#1b69bd";
          }}
        >
          <BsPlus size={24} className="me-1 fw-bold" /> Tambah
        </Link>
      </div>
      <DashboardCard>
        <AdminMouPerusahaan />
      </DashboardCard>
    </PageContainer>
  );
};

export default Mou;
