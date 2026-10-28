/* 三和易联电脑经营部官方页面 - Modern Tech Blue Theme
 * Light business style with dark hero, bilingual zh/en
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Laptop,
  Cpu,
  Wrench,
  Cctv,
  Network,
  Printer,
  MapPin,
  MapPinned,
  Clock,
  Phone,
  MonitorSmartphone,
  Store,
  BadgeDollarSign,
  Car,
  ShieldCheck,
  MessageSquare,
  ClipboardCheck,
  Hammer,
  Home as HomeIcon,
  Briefcase,
  ShoppingBag,
  CheckCircle2,
  Globe,
  Menu,
  X
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    // Instant jump: deterministic landing across browsers and webviews
    // (JS-animated smooth scrolling gets aborted by menu re-renders and
    // is unreliable in embedded webviews such as WeChat's browser).
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({ top: Math.max(top, 0) });
  };

  const navItems = [
    { id: "home", label: t("nav.home") },
    { id: "services", label: t("nav.services") },
    { id: "about", label: t("nav.about") },
    { id: "process", label: t("nav.process") },
    { id: "scenarios", label: t("nav.scenarios") },
    { id: "contact", label: t("nav.contact") }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO />
      <StructuredData />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => scrollToSection("home")}
              className="flex items-center gap-2.5"
              aria-label={t("nav.home")}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm">
                <MonitorSmartphone className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight whitespace-nowrap">
                {t("footer.brand")}
                {language === "zh" && (
                  <span className="hidden sm:inline text-muted-foreground font-normal text-sm ml-2">
                    电脑经营部
                  </span>
                )}
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-6">
              {navItems.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
                className="flex items-center gap-1.5"
                aria-label="Switch language"
              >
                <Globe className="w-4 h-4" />
                {t("lang.switch")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden px-2"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={t("nav.menu")}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t border-border/60 bg-background/95 backdrop-blur-md">
            <div className="container mx-auto px-6 py-3 flex flex-col">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-3 text-sm text-foreground hover:text-primary border-b border-border/40 last:border-0 transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-slate-950">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/hero-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.45)"
          }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-950/70 via-slate-950/30 to-slate-950/80" />

        <div className="container mx-auto px-6 relative z-10 text-center py-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm text-sm text-blue-100 mb-8">
            <MapPin className="w-4 h-4 text-cyan-300" />
            {t("hero.chip")}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight text-white">
            {t("hero.title.line1")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400">
              {t("hero.title.line2")}
            </span>
          </h1>

          <p className="text-lg md:text-xl mb-10 text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t("hero.subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 shadow-lg shadow-blue-950/50"
              onClick={() => scrollToSection("services")}
            >
              {t("hero.cta.services")}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white px-8 backdrop-blur-sm"
              onClick={() => scrollToSection("contact")}
            >
              {t("hero.cta.contact")}
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-300">
            {[
              { icon: Store, label: t("hero.trust1") },
              { icon: BadgeDollarSign, label: t("hero.trust2") },
              { icon: Car, label: t("hero.trust3") },
              { icon: ShieldCheck, label: t("hero.trust4") }
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-cyan-300" />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("services.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Laptop, titleKey: "services.sales.title", descKey: "services.sales.desc" },
              { icon: Cpu, titleKey: "services.assemble.title", descKey: "services.assemble.desc" },
              { icon: Wrench, titleKey: "services.repair.title", descKey: "services.repair.desc" },
              { icon: Cctv, titleKey: "services.cctv.title", descKey: "services.cctv.desc" },
              { icon: Network, titleKey: "services.network.title", descKey: "services.network.desc" },
              { icon: Printer, titleKey: "services.office.title", descKey: "services.office.desc" }
            ].map((service, index) => (
              <Card
                key={index}
                className="border-border/70 hover:border-primary/50 hover:shadow-lg hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <service.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{t(service.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(service.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              {t("services.note")}
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">{t("about.title")}</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {t("about.p1")}
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                {t("about.p2")}
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Store, titleKey: "about.point1.title", descKey: "about.point1.desc" },
                  { icon: Hammer, titleKey: "about.point2.title", descKey: "about.point2.desc" },
                  { icon: Clock, titleKey: "about.point3.title", descKey: "about.point3.desc" },
                  { icon: ClipboardCheck, titleKey: "about.point4.title", descKey: "about.point4.desc" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border/70">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-4.5 h-4.5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm mb-0.5">{t(item.titleKey)}</div>
                      <div className="text-xs text-muted-foreground">{t(item.descKey)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="/about-store.jpg"
                alt={language === "zh" ? "三和易联电脑维修工作台" : "Sanhe Yilian Computer repair workbench"}
                className="rounded-2xl shadow-xl w-full object-cover aspect-[4/3]"
                loading="lazy"
              />
              <div className="absolute -bottom-5 left-6 right-6 sm:left-8 sm:right-auto bg-blue-600 text-white rounded-xl px-5 py-3.5 shadow-lg flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">
                  {language === "zh" ? "诚信经营 · 技术立身" : "Honest business, solid craftsmanship"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("process.title")}</h2>
            <p className="text-muted-foreground text-lg">{t("process.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MessageSquare, titleKey: "process.step1.title", descKey: "process.step1.desc" },
              { icon: ClipboardCheck, titleKey: "process.step2.title", descKey: "process.step2.desc" },
              { icon: Hammer, titleKey: "process.step3.title", descKey: "process.step3.desc" },
              { icon: ShieldCheck, titleKey: "process.step4.title", descKey: "process.step4.desc" }
            ].map((step, index) => (
              <div key={index} className="relative">
                <div className="h-full rounded-xl border border-border/70 bg-card p-6 text-center hover:border-primary/50 transition-colors">
                  <div className="relative inline-flex mb-4">
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-bold mb-2">{t(step.titleKey)}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{t(step.descKey)}</p>
                </div>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3.5 w-3 h-0.5 bg-border" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scenarios Section */}
      <section id="scenarios" className="py-20 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("scenarios.title")}</h2>
            <p className="text-muted-foreground text-lg">{t("scenarios.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: HomeIcon, titleKey: "scenarios.home.title", descKey: "scenarios.home.desc" },
              { icon: Briefcase, titleKey: "scenarios.business.title", descKey: "scenarios.business.desc" },
              { icon: ShoppingBag, titleKey: "scenarios.shop.title", descKey: "scenarios.shop.desc" }
            ].map((item, index) => (
              <Card key={index} className="border-border/70 hover:border-primary/50 transition-colors">
                <CardContent className="p-7">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{t(item.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(item.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">{t("contact.title")}</h2>
            <p className="text-muted-foreground text-lg">{t("contact.subtitle")}</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                { icon: MapPinned, title: t("contact.address.title"), content: t("contact.address.content"), subtitle: t("contact.address.subtitle") },
                { icon: Clock, title: t("contact.hours.title"), content: t("contact.hours.content"), subtitle: t("contact.hours.subtitle") },
                { icon: MapPin, title: t("contact.area.title"), content: t("contact.area.content"), subtitle: t("contact.area.subtitle") },
                { icon: Phone, title: t("contact.phone.title"), content: t("contact.phone.content"), subtitle: t("contact.phone.subtitle") }
              ].map((contact, index) => (
                <Card key={index} className="border-border/70">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <contact.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-bold mb-1">{contact.title}</h4>
                      <p className="text-sm font-medium mb-0.5">{contact.content}</p>
                      <p className="text-xs text-muted-foreground">{contact.subtitle}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border/70 bg-muted/30">
              <CardContent className="p-6">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  {t("contact.promise.title")}
                </h4>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-sm text-muted-foreground">
                  {["item1", "item2", "item3", "item4"].map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{t(`contact.promise.${item}`)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
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
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-left block"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-white">{t("footer.services")}</h4>
              <div className="space-y-2 text-sm">
                {["sales", "assemble", "repair", "cctv", "network", "office"].map((key) => (
                  <button
                    key={key}
                    onClick={() => scrollToSection("services")}
                    className="text-slate-400 hover:text-cyan-300 transition-colors text-left block"
                  >
                    {t(`services.${key}.title`)}
                  </button>
                ))}
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
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
