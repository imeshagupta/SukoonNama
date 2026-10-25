import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Faqs from "./components/Faqs";
import Home from "./pages/Home";
import Contact from "./components/Contact";
import CmsAdmin from "./pages/CmsAdmin";
import NotFound from "./pages/NotFound";
import { Helmet } from "react-helmet-async";

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      <Helmet>
        <title>SukoonNama 🌸 | Shayarī & Jazbaat</title>
        <meta
          name="description"
          content="SukoonNama - दिल की बात, लफ़्ज़ों के साथ। Shayarī aur jazbaat ki duniya by Esha Gupta."
        />
      </Helmet>
      {!isAdminRoute && <Header />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin/*" element={<CmsAdmin />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
