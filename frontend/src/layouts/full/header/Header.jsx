import { Navbar, Dropdown } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import ProfileImg from "src/assets/images/profile/user-1.jpg";
import "./Header.css";
import { FaChevronDown, FaSignOutAlt, FaUserCog } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { getUser, logout } from "../../../components/redux/slice/authSlice";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    if (role === "admin" || role === "alumni") {
      navigate("/auth/login");
    } else if (role === "perusahaan") {
      navigate("/auth/login/perusahaan");
    } else {
      navigate("/auth/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Navbar expand="lg" fixed="top" className="shadow-sm px-3 d-flex justify-content-end bg-white" style={{padding:"12px"}}>
      <Dropdown ref={dropdownRef} show={showDropdown} onToggle={() => setShowDropdown(!showDropdown)}>
      <Dropdown.Item
          as="div"
          className="d-flex align-items-center avatar-container"
          style={{ cursor: "pointer" }}
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <img src={user?.fotoProfile ? `http://localhost:5000/uploads/${user.fotoProfile}` : ProfileImg} style={{ width: "40px", height: "40px" }} className="rounded-circle"/>
          <span className="fw-bold ms-2 text-secondary">{user?.name || "Pengguna"}</span>
          <FaChevronDown className="ms-2 text-secondary" style={{fontSize:"12px"}} />
        </Dropdown.Item>

        <Dropdown.Menu className="shadow border-0 dropdown-menu-end mt-2 custom-dropdown">
          <Dropdown.Item 
            onClick={() => { navigate("/auth/profile"); setShowDropdown(false); }} 
            className="custom-dropdown-item d-flex align-items-center" 
            style={{ fontSize: "14px" }}
          >
            <FaUserCog className="me-2" style={{ fontSize: "14px" }} /> Pengaturan Akun
          </Dropdown.Item>
          
          <Dropdown.Item 
            onClick={handleLogout} 
            className="custom-dropdown-item d-flex align-items-center logout-item" 
            style={{ fontSize: "14px" }}
          >
            <FaSignOutAlt className="me-2" style={{ fontSize: "14px" }} /> Keluar
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Navbar>
  );
};

export default Header;
