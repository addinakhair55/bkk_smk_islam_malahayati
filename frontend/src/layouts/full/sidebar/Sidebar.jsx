import { useEffect, useRef, useState } from "react";
import { Nav, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import getMenuItems from "../../full/sidebar/MenuItems";
import "./Sidebar.css";
import Logo from "../../../assets/images/logos/logo-bkk.png";

// eslint-disable-next-line react/prop-types
const Sidebar = ({ isOpen, toggleSidebar, userRole }) => {
    const [activeKey, setActiveKey] = useState("");
    const sidebarRef = useRef(null);
    const Menuitems = getMenuItems(userRole);
    const location = useLocation();

    useEffect(() => {
        // Set active key based on current URL
        const currentItem = Menuitems.find(item => !item.navlabel && item.href === location.pathname);
        if (currentItem) {
            setActiveKey(currentItem.id);
        }
    }, [location, Menuitems]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth < 992 && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                toggleSidebar(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, toggleSidebar]);

    const handleItemClick = (id) => {
        setActiveKey(id);
        if (window.innerWidth < 992) {
            toggleSidebar(false);
        }
    };

    return (
        <div className="border-1">
            <div ref={sidebarRef} className={`sidebar ${isOpen ? "open" : "closed"}`}>
                <div className="logo-container justify-content-center">
                    <img src={Logo} alt="Logo" />
                    <div className="d-flex flex-column mt-lg-1 mt-2 mx-2 mx-lg-0">
                        <h6 className="fw-bold mb-1 text-title">Bursa Kerja Khusus</h6>
                        <h6 className="fw-bold text-title">SMK Islam Malahayati</h6>
                    </div>
                </div>

                <div className="sidebar-content">
                    <Nav className="flex-column">
                        {Menuitems?.map((item) =>
                            item.navlabel ? (
                                <div key={item.subheader} className="p-2 fw-bold text-subheader">
                                    {item.subheader}
                                </div>
                            ) : (
                                <Button
                                    key={item.id}
                                    href={item.href}
                                    className={`sidebar-button border-0 d-flex align-items-center mb-2 py-2 
                                        ${activeKey === item.id ? "active" : "inactive"}`}
                                    onClick={() => handleItemClick(item.id, item.href)}
                                >
                                    <item.icon className="me-2" />
                                    {item.title}
                                </Button>
                            )
                        )}
                    </Nav>
                </div>
            </div>

            {isOpen && window.innerWidth < 992 && (
                <div className="sidebar-overlay" onClick={() => toggleSidebar(false)}></div>
            )}
        </div>
    );
};

export default Sidebar;