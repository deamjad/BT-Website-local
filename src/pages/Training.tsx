import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export const Training: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-in fade-in duration-500 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12">
          {t("training.title")}
        </h1>

        <p className="text-2xl text-swiss-black/80 max-w-3xl mb-16 leading-relaxed">
          {t("training.intro")}
        </p>

        <div className="swiss-grid !px-0 mb-24">
          <div className="col-span-4 md:col-span-12">
            <h2 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
              {t("training.areas")}
            </h2>
            <div className="swiss-divider mb-12"></div>
          </div>

          <div className="col-span-4 md:col-span-8">
            <ul className="space-y-6">
              {[1, 2, 3, 4].map((num) => (
                <li key={num} className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-swiss-blue rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-lg md:text-xl font-medium text-swiss-black/90">
                    {t(`training.t${num}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-8 py-4 bg-swiss-blue text-white font-medium rounded hover:bg-swiss-blue/90 transition-colors"
          >
            {t("training.enquire")}
          </Link>
        </div>
      </div>
    </div>
  );
};
