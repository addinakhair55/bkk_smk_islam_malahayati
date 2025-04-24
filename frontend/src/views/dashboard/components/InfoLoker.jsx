import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import AdminInfoLoker from '../../../components/dashboard/admin/Loker';
import { BsPlus } from 'react-icons/bs';
import { Button } from 'react-bootstrap';


const InfoLoker = () => {
  return (
    <PageContainer title="Informasi Lowongan Kerja">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">
            Info Lowongan Kerja
          </h4>
          <Button
            as={Link}
            to="/createInfoLowonganKerja"
            className="d-flex align-items-center fw-semibold px-3 py-2 shadow-sm"
            style={{
                borderRadius: "8px",
                backgroundColor: "transparent",
                color: "#4065B6",
                transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#4065B6";  
                e.target.style.color = "white";  
                e.target.style.borderColor = "#4065B6"; 
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent"; 
                e.target.style.color = "#4065B6"; 
                e.target.style.borderColor = "#4065B6";
            }}
        >
            <BsPlus size={24} className="me-1 fw-bold" /> Tambah
        </Button>
      </div>
      <DashboardCard>
        <AdminInfoLoker />
      </DashboardCard>
    </PageContainer>
  );
};

export default InfoLoker;
