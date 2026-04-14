import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { Training } from "./pages/Training";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { OrganizationalMaturityAssessment } from "./pages/OrganizationalMaturityAssessment";

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/training" element={<Training />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/organizational-maturity-assessment"
              element={<OrganizationalMaturityAssessment />}
            />
          </Routes>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}
