import React from "react";
import { useLanguage } from "../context/LanguageContext";
import { MessageCircle, MapPin, Phone, Mail } from "lucide-react";

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="animate-in fade-in duration-500 pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16">
          {t("contact.title")}
        </h1>

        <div className="swiss-grid !px-0">
          {/* Contact Details */}
          <div className="col-span-4 md:col-span-5 pe-0 md:pe-12 mb-16 md:mb-0">
            <h2 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
              {t("contact.detailsTitle")}
            </h2>
            <div className="swiss-divider mb-8"></div>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <MapPin
                  className="text-swiss-blue mt-1 flex-shrink-0"
                  size={20}
                />
                <p className="text-lg text-swiss-black/80 leading-relaxed">
                  {t("contact.address")}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-swiss-blue flex-shrink-0" size={20} />
                <a
                  href="tel:+64273800296"
                  className="text-lg text-swiss-black/80 hover:text-swiss-blue transition-colors"
                >
                  <span dir="ltr">{t("contact.phoneNum")}</span>
                </a>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-swiss-blue flex-shrink-0" size={20} />
                <a
                  href="mailto:info@btransform.biz"
                  className="text-lg text-swiss-black/80 hover:text-swiss-blue transition-colors"
                >
                  info@btransform.biz
                </a>
              </div>
            </div>

            <div className="mt-12">
              <a
                href="https://wa.me/64273800296"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-6 py-3 bg-[#25D366] text-white font-medium rounded hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle size={20} />
                {t("contact.whatsappBtn")}
              </a>
            </div>

            <div className="mt-12 w-full h-64 bg-swiss-gray/20 rounded overflow-hidden">
              <iframe
                title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3195.942737525359!2d174.7432393152891!3d-36.77196997995405!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d0d39b8a0a9a9a9%3A0x1234567890abcdef!2s21a%20Coronation%20Road%2C%20Hillcrest%2C%20Auckland%200627%2C%20New%20Zealand!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="col-span-4 md:col-span-7 ps-0 md:ps-12">
            <h2 className="text-sm font-bold tracking-widest uppercase text-swiss-blue mb-8">
              {t("contact.formTitle")}
            </h2>
            <div className="swiss-divider mb-8"></div>

            <form 
              className="space-y-6" 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                const name = String(formData.get("name") ?? "");
                const email = String(formData.get("email") ?? "");
                const phone = String(formData.get("phone") ?? "");
                const message = String(formData.get("message") ?? "");
                
                const subject = encodeURIComponent(`New Contact Inquiry from ${name}`);
                const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`);
                window.location.href = `mailto:info@btransform.biz?subject=${subject}&body=${body}`;
              }}
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-swiss-black/70 mb-2"
                >
                  {t("contact.name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  autoComplete="name"
                  className="w-full px-4 py-3 bg-swiss-gray/10 border border-swiss-black/10 rounded focus:outline-none focus:border-swiss-blue focus:ring-1 focus:ring-swiss-blue transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-swiss-black/70 mb-2"
                >
                  {t("contact.email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-swiss-gray/10 border border-swiss-black/10 rounded focus:outline-none focus:border-swiss-blue focus:ring-1 focus:ring-swiss-blue transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-swiss-black/70 mb-2"
                >
                  {t("contact.phone")}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  className="w-full px-4 py-3 bg-swiss-gray/10 border border-swiss-black/10 rounded focus:outline-none focus:border-swiss-blue focus:ring-1 focus:ring-swiss-blue transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-swiss-black/70 mb-2"
                >
                  {t("contact.message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-swiss-gray/10 border border-swiss-black/10 rounded focus:outline-none focus:border-swiss-blue focus:ring-1 focus:ring-swiss-blue transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto inline-flex items-center justify-center px-8 py-4 bg-swiss-blue text-white font-medium rounded hover:bg-swiss-blue/90 transition-colors"
              >
                {t("contact.send")}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
