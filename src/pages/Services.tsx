import React from "react";
import { useLanguage } from "../context/LanguageContext";

export const Services: React.FC = () => {
  const { t } = useLanguage();

  const ServiceBlock = ({ title, desc }: { title: string; desc: string }) => (
    <div className="mb-8">
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-swiss-black/70 leading-relaxed text-sm md:text-base max-w-2xl">
        {desc}
      </p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16">
          {t("services.title")}
        </h1>

        {/* STRATEGY */}
        <div className="mb-24">
          <h2 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
            {t("services.strategy")}
          </h2>
          <div className="swiss-divider mb-12"></div>

          <div className="swiss-grid !px-0">
            <div className="col-span-4 md:col-span-6 pe-0 md:pe-8">
              <h3 className="text-2xl font-bold mb-8">
                {t("services.strategyBuilding")}
              </h3>
              <ServiceBlock
                title={t("services.sb1Title")}
                desc={t("services.sb1Desc")}
              />
              <ServiceBlock
                title={t("services.sb2Title")}
                desc={t("services.sb2Desc")}
              />
              <ServiceBlock
                title={t("services.sb3Title")}
                desc={t("services.sb3Desc")}
              />
              <ServiceBlock
                title={t("services.sb4Title")}
                desc={t("services.sb4Desc")}
              />
            </div>

            <div className="col-span-4 md:col-span-6 ps-0 md:ps-8 mt-12 md:mt-0">
              <h3 className="text-2xl font-bold mb-8">
                {t("services.strategyExecution")}
              </h3>
              <ServiceBlock
                title={t("services.se1Title")}
                desc={t("services.se1Desc")}
              />
              <ServiceBlock
                title={t("services.se2Title")}
                desc={t("services.se2Desc")}
              />
              <ServiceBlock
                title={t("services.se3Title")}
                desc={t("services.se3Desc")}
              />
              <ServiceBlock
                title={t("services.se4Title")}
                desc={t("services.se4Desc")}
              />
              <ServiceBlock
                title={t("services.se5Title")}
                desc={t("services.se5Desc")}
              />
            </div>
          </div>
        </div>

        {/* DELIVERY & OPERATING MODEL */}
        <div className="mb-24">
          <h2 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
            {t("services.delivery")}
          </h2>
          <div className="swiss-divider mb-12"></div>

          <ul className="space-y-4 text-lg font-medium">
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-swiss-blue rounded-full"></div>
              {t("services.del1")}
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-swiss-blue rounded-full"></div>
              {t("services.del2")}
            </li>
            <li className="flex items-center gap-4">
              <div className="w-2 h-2 bg-swiss-blue rounded-full"></div>
              {t("services.del3")}
            </li>
          </ul>
        </div>

        {/* OPERATIONAL EXCELLENCE */}
        <div className="mb-24">
          <h2 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
            {t("services.opExcellence")}
          </h2>
          <div className="swiss-divider mb-12"></div>

          <ServiceBlock
            title={t("services.op1Title")}
            desc={t("services.op1Desc")}
          />
        </div>

        {/* DATA FOUNDATION */}
        <div className="mb-24">
          <h2 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
            {t("services.dataAi")}
          </h2>
          <div className="swiss-divider mb-12"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ServiceBlock
              title={t("services.da1Title")}
              desc={t("services.da1Desc")}
            />
            <ServiceBlock
              title={t("services.da2Title")}
              desc={t("services.da2Desc")}
            />
            <ServiceBlock
              title={t("services.da3Title")}
              desc={t("services.da3Desc")}
            />
            <ServiceBlock
              title={t("services.da4Title")}
              desc={t("services.da4Desc")}
            />
          </div>
        </div>

        {/* AI ADOPTION */}
        <div>
          <h2 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
            {t("services.aiAdoption")}
          </h2>
          <div className="swiss-divider mb-12"></div>

          <p className="text-lg text-swiss-black/80 max-w-3xl">
            {t("services.ai1Desc")}
          </p>
        </div>
      </div>
    </div>
  );
};
