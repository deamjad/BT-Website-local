import React from "react";
import { useLanguage } from "../context/LanguageContext";

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-in fade-in duration-500 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16">
          {t("about.title")}
        </h1>

        <div className="max-w-4xl mb-24">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight">
            {t("about.headline")}
          </h2>
          <p className="text-xl text-swiss-black/70 leading-relaxed">
            {t("about.paragraph")}
          </p>
        </div>

        <div className="swiss-grid !px-0 mb-24">
          <div className="col-span-4 md:col-span-6 pe-0 md:pe-8">
            <h3 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
              {t("about.valuesTitle")}
            </h3>
            <div className="swiss-divider mb-8"></div>
            <ul className="space-y-4">
              {[1, 2, 3].map((num) => (
                <li
                  key={num}
                  className="text-lg font-medium flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-swiss-blue rounded-full"></div>
                  {t(`about.v${num}`)}
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-4 md:col-span-6 ps-0 md:ps-8 mt-12 md:mt-0">
            <h3 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
              {t("about.industriesTitle")}
            </h3>
            <div className="swiss-divider mb-8"></div>
            <ul className="space-y-4">
              {[1, 2, 3].map((num) => (
                <li
                  key={num}
                  className="text-lg font-medium flex items-center gap-3"
                >
                  <div className="w-1.5 h-1.5 bg-swiss-blue rounded-full"></div>
                  {t(`about.i${num}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Founder Bio Section */}
        <div className="bg-swiss-gray/10 p-8 md:p-12 rounded relative overflow-hidden">
          {/* Geometric Accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-swiss-blue/5 -rotate-12 translate-x-16 -translate-y-16"></div>
          
          <div className="swiss-grid !px-0 items-center">
            <div className="col-span-4 md:col-span-4 mb-8 md:mb-0">
              <div className="aspect-[3/4] bg-swiss-gray/20 rounded overflow-hidden border border-swiss-black/5">
                <img 
                  src="founder image.png" 
                  alt="Founder" 
                  className="w-full h-full object-cover grayscale object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="col-span-4 md:col-span-8">
              <h3 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
                {t("about.founderBioTitle")}
              </h3>
              <div className="swiss-divider mb-8"></div>
              <p className="text-lg md:text-xl leading-relaxed text-swiss-black/80 max-w-2xl">
                {t("about.founderBio")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
