import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Faqs from "./components/Faqs";
import Home from "./pages/Home";
import Contact from "./components/Contact";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { Helmet } from "react-helmet-async";

function App() {
  return (
    <Router>
      <Helmet>
        <title>SukoonNama 🌸 | Shayarī & Jazbaat</title>
        <meta name="description" content="SukoonNama - दिल की बात, लफ़्ज़ों के साथ। Shayarī aur jazbaat ki duniya by Esha Gupta." />
      </Helmet>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
