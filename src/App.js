import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Testimonials from "./components/Testimonials";
import About from "./components/About";
import Faqs from "./components/Faqs";
import Home from "./pages/Home";
import Contact from "./components/Contact";
import Admin from "./pages/Admin"; // Updated import for AdminPage
import PoemsList from "./components/PoemsList";

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
