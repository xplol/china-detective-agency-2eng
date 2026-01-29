/* Film Noir Detective Aesthetic - Home Page with i18n support
 * Design Philosophy: Dark, cinematic, professional with gold accents
 */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { 
  Heart, 
  Building2, 
  MapPin, 
  FileText, 
  Shield, 
  Wallet,
  Phone,
  Mail,
  MapPinned,
  Clock,
  Award,
  Users,
  Lock,
  CheckCircle2,
  MessageCircle,
  Send,
  Globe
} from "lucide-react";

import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  


  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO />
      <StructuredData />
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-gold-gradient">Truth Detective Agency</span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <button onClick={() => scrollToSection("home")} className="text-sm hover:text-accent transition-colors">{t("nav.home")}</button>
              <button onClick={() => scrollToSection("services")} className="text-sm hover:text-accent transition-colors">{t("nav.services")}</button>
              <button onClick={() => scrollToSection("about")} className="text-sm hover:text-accent transition-colors">{t("nav.about")}</button>
              <button onClick={() => scrollToSection("cases")} className="text-sm hover:text-accent transition-colors">{t("nav.cases")}</button>
              <button onClick={() => scrollToSection("contact")} className="text-sm hover:text-accent transition-colors">{t("nav.contact")}</button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "zh" ? "en" : "zh")}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === "zh" ? "EN" : "中文"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: "url(/hero-bg.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "brightness(0.4)"
          }}
        />
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t("hero.title.part1")}<br />
            <span className="text-gold-gradient">{t("hero.title.part2")}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-muted-foreground">
            {t("hero.subtitle")}
          </p>
          <p className="text-lg mb-8 text-muted-foreground">
            {t("hero.description")}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
              onClick={() => scrollToSection("contact")}
            >
              {t("hero.cta")}
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-5 h-5" />
              <span>{t("hero.phone")}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-background/95">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("services.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Heart, titleKey: "services.marriage.title", descKey: "services.marriage.desc" },
              { icon: Building2, titleKey: "services.business.title", descKey: "services.business.desc" },
              { icon: MapPin, titleKey: "services.person.title", descKey: "services.person.desc" },
              { icon: FileText, titleKey: "services.evidence.title", descKey: "services.evidence.desc" },
              { icon: Shield, titleKey: "services.risk.title", descKey: "services.risk.desc" },
              { icon: Wallet, titleKey: "services.asset.title", descKey: "services.asset.desc" }
            ].map((service, index) => (
              <Card key={index} className="glass-card hover:border-accent/50 transition-all">
                <CardContent className="p-6">
                  <service.icon className="w-12 h-12 text-accent mb-4" />
                  <h3 className="text-xl font-bold mb-3">{t(service.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(service.descKey)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
              <Lock className="w-4 h-4 text-accent" />
              {t("services.note")}
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background/80">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">{t("about.title")}</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {t("about.description1")}
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {t("about.description2")}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: Award, label: t("about.years"), desc: t("about.years.desc") },
                  { icon: Users, label: t("about.team"), desc: t("about.team.desc") },
                  { icon: Lock, label: t("about.confidential"), desc: t("about.confidential.desc") },
                  { icon: Clock, label: t("about.service"), desc: t("about.service.desc") }
                ].map((item, index) => (
                  <Card key={index} className="glass-card">
                    <CardContent className="p-4 text-center">
                      <item.icon className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-lg font-bold mb-1">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                {t("about.note")}
              </p>
            </div>

            <div className="relative">
              <img 
                src="/about-team.jpg" 
                alt="Professional Team" 
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background/95">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("stats.title")}</h2>
            <p className="text-muted-foreground text-lg">
              {t("stats.subtitle")}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: t("stats.cases"), label: t("stats.cases.label"), desc: t("stats.cases.desc") },
              { number: t("stats.satisfaction"), label: t("stats.satisfaction.label"), desc: t("stats.satisfaction.desc") },
              { number: t("stats.experience"), label: t("stats.experience.label"), desc: t("stats.experience.desc") },
              { number: t("stats.clients"), label: t("stats.clients.label"), desc: t("stats.clients.desc") }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-gold-gradient mb-2">{stat.number}</div>
                <div className="text-lg font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section id="cases" className="py-20 bg-background/80">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("cases.title")}</h2>
            <p className="text-muted-foreground text-lg">
              {t("cases.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { titleKey: "cases.case1.title", descKey: "cases.case1.desc", resultKey: "cases.case1.result" },
              { titleKey: "cases.case2.title", descKey: "cases.case2.desc", resultKey: "cases.case2.result" },
              { titleKey: "cases.case3.title", descKey: "cases.case3.desc", resultKey: "cases.case3.result" }
            ].map((caseItem, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3 text-accent">{t(caseItem.titleKey)}</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {t(caseItem.descKey)}
                  </p>
                  <div className="text-xs text-accent font-medium">
                    {t(caseItem.resultKey)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              {t("cases.note")}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background/80">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{t("contact.title")}</h2>
            <p className="text-muted-foreground text-lg">
              {t("contact.subtitle")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">{t("contact.methods")}</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Phone, title: t("contact.phone.title"), content: t("contact.phone.content"), subtitle: t("contact.phone.subtitle") },
                  { icon: Mail, title: t("contact.email.title"), content: t("contact.email.content"), subtitle: t("contact.email.subtitle") },
                  { icon: MapPinned, title: t("contact.address.title"), content: t("contact.address.content"), subtitle: t("contact.address.subtitle") },
                  { icon: Clock, title: t("contact.hours.title"), content: t("contact.hours.content"), subtitle: t("contact.hours.subtitle") }
                ].map((contact, index) => (
                  <Card key={index} className="glass-card">
                    <CardContent className="p-6">
                      <contact.icon className="w-8 h-8 text-accent mb-3" />
                      <h4 className="font-bold mb-2">{contact.title}</h4>
                      <p className="text-sm font-medium mb-1">{contact.content}</p>
                      <p className="text-xs text-muted-foreground">{contact.subtitle}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5 text-accent" />
                    {t("contact.privacy.title")}
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {["item1", "item2", "item3"].map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                        <span>{t(`contact.privacy.${item}`)}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Social Media Contact */}
              <Card className="glass-card">
                <CardContent className="p-6">
                  <h4 className="font-bold mb-4">{t("contact.social.title")}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">WhatsApp</div>
                          <div className="text-xs text-muted-foreground">+86 153 9761 5812</div>
                        </div>
                      </div>
                      <a 
                        href="https://wa.me/8615397615812" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        {t("contact.social.open")}
                      </a>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">WeChat/微信</div>
                          <div className="text-xs text-muted-foreground">ChinaDetective</div>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => {
                          const dialog = document.getElementById('wechat-qr-dialog') as HTMLDialogElement;
                          dialog?.showModal();
                        }}
                        className="text-xs text-accent hover:underline"
                      >
                        {t("contact.social.qr")}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <Send className="w-5 h-5 text-blue-500" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Telegram</div>
                          <div className="text-xs text-muted-foreground">chinadetective8848_bot</div>
                        </div>
                      </div>
                      <a 
                        href="https://t.me/chinadetective8848_bot" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline"
                      >
                        {t("contact.social.open")}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background/95 border-t border-border/50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent-foreground" />
                </div>
                <span className="text-xl font-bold text-gold-gradient">{t("footer.brand")}</span>
              </div>
              <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t("footer.description") }} />
            </div>

            <div>
              <h4 className="font-bold mb-4">{t("footer.links")}</h4>
              <div className="space-y-2 text-sm">
                <button onClick={() => scrollToSection("home")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("nav.home")}</button>
                <button onClick={() => scrollToSection("services")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("nav.services")}</button>
                <button onClick={() => scrollToSection("about")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("nav.about")}</button>
                <button onClick={() => scrollToSection("cases")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("nav.cases")}</button>
                <button onClick={() => scrollToSection("contact")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("nav.contact")}</button>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">{language === "zh" ? "调查服务" : "Services"}</h4>
              <div className="space-y-2 text-sm">
                <button onClick={() => scrollToSection("services")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("services.marriage.title")}</button>
                <button onClick={() => scrollToSection("services")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("services.business.title")}</button>
                <button onClick={() => scrollToSection("services")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("services.person.title")}</button>
                <button onClick={() => scrollToSection("services")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("services.evidence.title")}</button>
                <button onClick={() => scrollToSection("services")} className="text-muted-foreground hover:text-accent transition-colors text-left block">{t("services.risk.title")}</button>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">{t("footer.legal")}</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors block">{t("footer.privacy")}</a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors block">{t("footer.terms")}</a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors block">{t("footer.disclaimer")}</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>{t("footer.copyright")}</p>
          </div>
        </div>
      </footer>

      {/* WeChat QR Code Dialog */}
      <dialog id="wechat-qr-dialog" className="rounded-lg p-0 backdrop:bg-black/80">
        <div className="bg-card p-6 rounded-lg max-w-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold">{t("wechat.title")}</h3>
            <button
              onClick={() => {
                const dialog = document.getElementById('wechat-qr-dialog') as HTMLDialogElement;
                dialog?.close();
              }}
              className="text-muted-foreground hover:text-foreground text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <img
            src="/images/wechat-qr-code.jpg"
            alt="WeChat QR Code"
            className="w-full rounded-lg mb-4"
          />
          <p className="text-sm text-muted-foreground text-center">
            {t("wechat.instruction")}<span className="font-medium text-foreground">{t("wechat.id")}</span>
          </p>
        </div>
      </dialog>
    </div>
  );
}
