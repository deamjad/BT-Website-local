import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ArrowRight, ArrowLeft } from "lucide-react";

export const Home: React.FC = () => {
  const { t, isRtl } = useLanguage();
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="animate-in fade-in duration-500 overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-40 md:pb-48 px-4 md:px-8 max-w-7xl mx-auto overflow-visible">
        {/* Geometric Background Pattern */}
        <div className="absolute top-0 right-0 -z-10 opacity-10 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="200" y="0" width="200" height="200" fill="var(--color-swiss-blue)" />
            <circle cx="100" cy="300" r="100" fill="var(--color-swiss-blue)" />
            <path d="M0 0L200 200H0V0Z" fill="var(--color-swiss-blue)" />
          </svg>
        </div>

        <div className="swiss-grid !px-0 items-center">
          <div className="col-span-4 md:col-span-7">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tighter mb-8 text-swiss-black">
              {t("home.heroHeadline")}
            </h1>
            <p className="text-xl md:text-2xl text-swiss-black/70 leading-relaxed mb-12 max-w-3xl">
              {t("home.heroSubtext")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-swiss-blue text-white font-medium rounded hover:bg-swiss-blue/90 transition-colors"
              >
                {t("nav.getInTouch")}
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-4 border border-swiss-black/20 text-swiss-black font-medium rounded hover:border-swiss-black transition-colors"
              >
                {t("home.exploreServices")}
              </Link>
            </div>
          </div>
          <div className="hidden md:block col-span-5 relative">
            <div className="aspect-[4/5] bg-swiss-gray/20 rounded overflow-hidden relative">
              <img 
                src="building.png" 
                alt="Modern Architecture" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              {/* Swiss Accent Block */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-swiss-blue"></div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 bg-swiss-gray/20">
        <div className="swiss-grid">
          <div className="col-span-4 md:col-span-12 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("home.whatWeDo")}
            </h2>
            <div className="swiss-divider mt-6"></div>
          </div>

          <div className="col-span-4 md:col-span-6 pe-0 md:pe-8">
            <h3 className="text-2xl font-bold mb-4">
              {t("home.strategyBuilding")}
            </h3>
            <p className="text-swiss-black/70 leading-relaxed">
              {t("home.strategyBuildingDesc")}
            </p>
          </div>

          <div className="col-span-4 md:col-span-6 ps-0 md:ps-8 mt-12 md:mt-0">
            <h3 className="text-2xl font-bold mb-4">
              {t("home.strategyExecution")}
            </h3>
            <p className="text-swiss-black/70 leading-relaxed">
              {t("home.strategyExecutionDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* Services Snapshot */}
      <section className="py-24">
        <div className="swiss-grid">
          <div className="col-span-4 md:col-span-12 mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("home.servicesSnapshot")}
            </h2>
            <div className="swiss-divider mt-6"></div>
          </div>

          {[
            "strategyBuilding",
            "strategyExecution",
            "okrs",
            "agileDelivery",
            "agileTransformation",
            "operationalExcellence",
            "dataFoundation",
            "aiAdoption",
          ].map((serviceKey, index) => (
            <Link
              to="/services"
              key={index}
              className="block col-span-2 md:col-span-3 border border-swiss-black/10 p-6 rounded hover:border-swiss-blue transition-colors group"
            >
              <h4 className="font-bold text-lg mb-4 group-hover:text-swiss-blue transition-colors">
                {t(`home.services.${serviceKey}`)}
              </h4>
              <div className="w-8 h-8 rounded-full bg-swiss-gray/50 flex items-center justify-center group-hover:bg-swiss-blue/10 transition-colors">
                <ArrowIcon
                  size={16}
                  className="text-swiss-black/50 group-hover:text-swiss-blue"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How We Work */}
      <section className="py-24 bg-swiss-black text-white">
        <div className="swiss-grid">
          <div className="col-span-4 md:col-span-12 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("home.howWeWork")}
            </h2>
            <div className="border-t border-white/20 w-full mt-6"></div>
          </div>

          <div className="col-span-4 md:col-span-4 mb-12 md:mb-0">
            <div className="text-swiss-blue font-mono text-sm mb-4">01</div>
            <h3 className="text-2xl font-bold mb-2">{t("home.step1")}</h3>
            <p className="text-white/70">{t("home.step1Desc")}</p>
          </div>

          <div className="col-span-4 md:col-span-4 mb-12 md:mb-0">
            <div className="text-swiss-blue font-mono text-sm mb-4">02</div>
            <h3 className="text-2xl font-bold mb-2">{t("home.step2")}</h3>
            <p className="text-white/70">{t("home.step2Desc")}</p>
          </div>

          <div className="col-span-4 md:col-span-4">
            <div className="text-swiss-blue font-mono text-sm mb-4">03</div>
            <h3 className="text-2xl font-bold mb-2">{t("home.step3")}</h3>
            <p className="text-white/70">{t("home.step3Desc")}</p>
          </div>
        </div>
      </section>

      {/* Credibility Strip */}
      <section className="py-16 border-b border-swiss-black/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <div className="text-lg font-medium text-swiss-black/80">
              {t("home.credibility.founderLed")}
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-swiss-blue"></div>
            <div className="text-lg font-medium text-swiss-black/80">
              {t("home.credibility.experience")}
            </div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-swiss-blue"></div>
            <div className="text-lg font-medium text-swiss-black/80">
              {t("home.credibility.outcomes")}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 border-t border-swiss-black/5">
        <div className="swiss-grid">
          <div className="col-span-4 md:col-span-12 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("home.founder")}
            </h2>
            <div className="swiss-divider mt-6"></div>
          </div>
          
          <div className="col-span-4 md:col-span-4 mb-12 md:mb-0">
            <div className="aspect-[3/4] bg-swiss-gray/20 rounded overflow-hidden relative group border border-swiss-black/5">
              <img 
                src="founder image.png" 
                alt="Founder" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 object-top"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 border-[12px] border-white/5 pointer-events-none"></div>
            </div>
          </div>

          <div className="col-span-4 md:col-span-8">
            <p className="text-xl md:text-2xl leading-relaxed text-swiss-black/80 mb-8">
              {t("home.founderBio")}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-4 border-l-2 border-swiss-blue bg-swiss-gray/5">
                <p className="text-sm font-bold mb-1 uppercase tracking-wider text-swiss-blue">Consultancy</p>
                <p className="text-sm text-swiss-black/70">{t("home.founderBullets.b1")}</p>
              </div>
              <div className="p-4 border-l-2 border-swiss-blue bg-swiss-gray/5">
                <p className="text-sm font-bold mb-1 uppercase tracking-wider text-swiss-blue">Experience</p>
                <p className="text-sm text-swiss-black/70">{t("home.founderBullets.b2")}</p>
              </div>
              <div className="p-4 border-l-2 border-swiss-blue bg-swiss-gray/5">
                <p className="text-sm font-bold mb-1 uppercase tracking-wider text-swiss-blue">Focus</p>
                <p className="text-sm text-swiss-black/70">{t("home.founderBullets.b3")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
