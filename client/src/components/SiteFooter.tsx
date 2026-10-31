import { Link } from "wouter";
import {
  MonitorSmartphone,
  MapPinned,
  Clock,
  Globe
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SiteFooterProps {
  /** On the home page, section links scroll in place; elsewhere they link back to "/" */
  home?: boolean;
  onNavigate?: (id: string) => void;
}

export default function SiteFooter({ home = false, onNavigate }: SiteFooterProps) {
  const { language, setLanguage, t } = useLanguage();

  const sectionLink = (id: string, label: string) => {
    if (home && onNavigate) {
      return (
        <button
          key={id}
          onClick={() => onNavigate(id)}
          className="text-slate-400 hover:text-cyan-300 transition-colors text-left block"
        >
          {label}
        </button>
      );
    }
    return (
      <Link key={id} href="/" className="text-slate-400 hover:text-cyan-300 transition-colors block">
        {label}
      </Link>
    );
  };

  return (
    <footer className="bg-slate-950 text-slate-300 py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <MonitorSmartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">{t("footer.brand")}</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">{t("footer.description")}</p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">{t("footer.links")}</h4>
            <div className="space-y-2 text-sm">
              {sectionLink("home", t("nav.home"))}
              <Link href="/pricing" className="text-slate-400 hover:text-cyan-300 transition-colors block">
                {t("nav.pricing")}
              </Link>
              {["services", "about", "process", "scenarios", "contact"].map((id) =>
                sectionLink(id, t(`nav.${id}`))
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">{t("footer.services")}</h4>
            <div className="space-y-2 text-sm">
              {["sales", "assemble", "repair", "cctv", "network", "office"].map((key) =>
                sectionLink("services", t(`services.${key}.title`))
              )}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-white">{t("footer.contact")}</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <p className="flex items-start gap-2">
                <MapPinned className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-300" />
                {t("footer.contact.address")}
              </p>
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-cyan-300" />
                {t("footer.contact.hours")}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>
            {t("footer.copyright")}
            <span className="mx-2 text-slate-700" aria-hidden="true">|</span>
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cyan-300 transition-colors"
            >
              {t("footer.icp")}
            </a>
            <span className="mx-2 text-slate-700" aria-hidden="true">|</span>
            <button
              onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
              className="hover:text-cyan-300 transition-colors inline-flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              {t("lang.switch")}
            </button>
          </p>
        </div>
      </div>
    </footer>
  );
}
