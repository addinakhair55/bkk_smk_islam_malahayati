import { Link } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../../components/shared/DashboardCard';
import AdminTracerStudy from '../../../components/dashboard/admin/TracerStudy';
import { BsPlus } from 'react-icons/bs';
import { Button } from 'react-bootstrap';


const Tracer = () => {
  return (
    <PageContainer title="Tracer Study">
     <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">
          Tracer Study
        </h4>
        <Button
            as={Link}
            to="/createTracerStudy"
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
        <AdminTracerStudy />
      </DashboardCard>
    </PageContainer>
  );
};

export default Tracer;
