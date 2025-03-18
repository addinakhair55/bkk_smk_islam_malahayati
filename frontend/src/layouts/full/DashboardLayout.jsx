import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector dari Redux
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import Sidebar from "../full/sidebar/Sidebar.jsx";
import Header from "../full/header/Header.jsx";
import { getUser } from "../../components/redux/slice/authSlice"; // Import getUser dari Redux

const DashboardLayout = () => {
  const userRole = useSelector((state) => state.auth.role) || "guest";

  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);

  const dispatch = useDispatch();
useEffect(() => {
  dispatch(getUser());
}, [dispatch]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100">
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={() => setSidebarOpen((prev) => !prev)} 
        userRole={userRole}
      />

      {/* Main Content */}
      <div className={`content flex-grow-1 d-flex flex-column min-vh-100 ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <Header />
        <Container fluid style={{ marginTop: "80px" }} className="flex-grow-1 overflow-auto">
          <div className="content-wrapper p-3" style={{ minWidth: "0" }}>
            <Outlet />
          </div>
        </Container>
      </div>

      {/* Toggle Sidebar Button (for small screens) */}
      {!isSidebarOpen && (
        <button 
          className="sidebar-toggle-btn d-lg-none" 
          onClick={() => setSidebarOpen(true)}
        >
          ☰
        </button>
      )}
    </div>
  );
};

export default DashboardLayout;
