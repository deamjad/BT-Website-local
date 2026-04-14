import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { Layout } from "./components/Layout";

const Home = lazy(() =>
  import("./pages/Home").then((module) => ({ default: module.Home })),
);
const Services = lazy(() =>
  import("./pages/Services").then((module) => ({ default: module.Services })),
);
const Training = lazy(() =>
  import("./pages/Training").then((module) => ({ default: module.Training })),
);
const About = lazy(() =>
  import("./pages/About").then((module) => ({ default: module.About })),
);
const Contact = lazy(() =>
  import("./pages/Contact").then((module) => ({ default: module.Contact })),
);
const OrganizationalMaturityAssessment = lazy(() =>
  import("./pages/OrganizationalMaturityAssessment").then((module) => ({
    default: module.OrganizationalMaturityAssessment,
  })),
);

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Layout>
          <Suspense
            fallback={
              <div className="min-h-[40vh] flex items-center justify-center px-4">
                <div className="text-sm font-medium text-swiss-black/60">
                  Loading...
                </div>
              </div>
            }
          >
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
          </Suspense>
        </Layout>
      </Router>
    </LanguageProvider>
  );
}
