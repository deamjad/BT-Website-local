import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { MessageCircle } from "lucide-react";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t, language, toggleLanguage } = useLanguage();
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "nav.home" },
    { path: "/services", label: "nav.services" },
    { path: "/training", label: "nav.training" },
    { path: "/about", label: "nav.about" },
    { path: "/contact", label: "nav.contact" },
    { path: "/organizational-maturity-assessment", label: "nav.assessment" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-swiss-black/10 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-xl md:text-2xl font-bold tracking-tight text-swiss-black"
          >
            {t("brand.name")}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-swiss-blue ${
                  isActive(link.path)
                    ? "text-swiss-blue"
                    : "text-swiss-black/70"
                }`}
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              type="button"
              className="text-sm font-bold tracking-widest uppercase hover:text-swiss-blue transition-colors"
              aria-label={t("nav.toggleLanguage")}
            >
              {language === "en" ? "EN | AR" : "AR | EN"}
            </button>

            {/* WhatsApp Icon (Mobile) */}
            <a
              href="https://wa.me/64273800296"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden text-swiss-blue hover:opacity-80"
              aria-label={t("nav.whatsapp")}
            >
              <MessageCircle size={24} />
            </a>

            {/* CTA Button (Desktop) */}
            <Link
              to="/contact"
              className="hidden lg:inline-flex items-center justify-center px-6 py-2.5 bg-swiss-blue text-white text-sm font-medium rounded hover:bg-swiss-blue/90 transition-colors"
            >
              {t("nav.getInTouch")}
            </Link>
          </div>
        </div>

        {/* Mobile Nav (Simple scrollable row) */}
        <div className="lg:hidden border-t border-swiss-black/5 overflow-x-auto">
          <nav className="flex items-center px-4 py-3 gap-6 min-w-max">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-swiss-blue"
                    : "text-swiss-black/70"
                }`}
              >
                {t(link.label)}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="border-t border-swiss-black/10 bg-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div>
              <h3 className="text-lg font-bold mb-4">
                {t("brand.name")}
              </h3>
              <p className="text-swiss-black/70 text-sm max-w-xs leading-relaxed">
                {t("contact.address")}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:justify-end">
              <div className="flex flex-col gap-2">
                <a
                  href="tel:+64273800296"
                  className="text-sm hover:text-swiss-blue transition-colors"
                >
                  <span dir="ltr">{t("contact.phoneNum")}</span>
                </a>
                <a
                  href="https://wa.me/64273800296"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-swiss-blue hover:underline"
                >
                  {t("nav.whatsapp")}
                </a>
                <a
                  href="mailto:info@btransform.biz"
                  className="text-sm hover:text-swiss-blue transition-colors"
                >
                  info@btransform.biz
                </a>
                <a
                  href="https://btransform.biz"
                  className="text-sm hover:text-swiss-blue transition-colors"
                >
                  btransform.biz
                </a>
              </div>
            </div>
          </div>

          <div className="swiss-divider mb-6"></div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-swiss-black/50">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
