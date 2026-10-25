import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useNavigate, useLocation } from "react-router-dom";
import styles from "../styles/CmsAdmin.module.css";
import {
  FaFeatherAlt,
  FaComments,
  FaQuestionCircle,
  FaImages,
  FaInfoCircle,
  FaHome,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import CmsPoems from "./cms/CmsPoems";
import CmsTestimonials from "./cms/CmsTestimonials";
import CmsFaqs from "./cms/CmsFaqs";
import CmsGallery from "./cms/CmsGallery";
import CmsAbout from "./cms/CmsAbout";
import { Helmet } from "react-helmet-async";

const CmsAdmin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("isAdmin", "true");
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/");
  };

  const menuItems = [
    { path: "/admin/poems", label: "Poems", icon: <FaFeatherAlt /> },
    { path: "/admin/testimonials", label: "Testimonials", icon: <FaComments /> },
    { path: "/admin/faqs", label: "FAQs", icon: <FaQuestionCircle /> },
    { path: "/admin/gallery", label: "Certificates/Gallery", icon: <FaImages /> },
    { path: "/admin/about", label: "About", icon: <FaInfoCircle /> },
  ];

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.cmsWrapper}>
      <Helmet>
        <title>CMS Admin | SukoonNama</title>
      </Helmet>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoWrap}>
            <FaFeatherAlt className={styles.logoIcon} />
            <div>
              <h2 className={styles.logoText}>SukoonNama</h2>
              <p className={styles.logoSub}>CMS Panel</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ""}`
              }
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button className={styles.footerBtn} onClick={() => navigate("/")}>
            <FaHome /> View Site
          </button>
          <button className={styles.footerBtnDanger} onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <div className={styles.mainArea}>
        <header className={styles.topHeader}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <FaBars />
          </button>
          <div className={styles.headerTitle}>
            <h1>Content Management System</h1>
            <p>Manage all content from one place</p>
          </div>
        </header>

        <main className={styles.content}>
          <Routes>
            <Route path="/" element={<CmsPoems />} />
            <Route path="/poems" element={<CmsPoems />} />
            <Route path="/testimonials" element={<CmsTestimonials />} />
            <Route path="/faqs" element={<CmsFaqs />} />
            <Route path="/gallery" element={<CmsGallery />} />
            <Route path="/about" element={<CmsAbout />} />
          </Routes>
        </main>
      </div>

      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default CmsAdmin;
