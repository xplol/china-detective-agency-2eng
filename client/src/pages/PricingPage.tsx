import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Laptop,
  GraduationCap,
  Disc,
  Fan,
  Car,
  HardDriveDownload,
  Cctv,
  Wifi,
  Cpu,
  Printer,
  MonitorSmartphone,
  ShieldCheck,
  type LucideIcon
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";
import { productItems, serviceItems, type PricingItem } from "@/data/pricing";

const iconMap: Record<string, LucideIcon> = {
  Monitor,
  Laptop,
  GraduationCap,
  Disc,
  Fan,
  Car,
  HardDriveDownload,
  Cctv,
  Wifi,
  Cpu,
  Printer
};

function PriceTag({ item }: { item: PricingItem }) {
  const { t } = useLanguage();
  const unitKey = t(`pricing.${item.id}.unit`);
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-sm text-muted-foreground">¥</span>
      <span className="text-3xl font-bold text-blue-600">{t(`pricing.${item.id}.price`)}</span>
      {unitKey && unitKey !== `pricing.${item.id}.unit` && (
        <span className="text-sm text-muted-foreground">{t(`pricing.unit.${unitKey}`)}</span>
      )}
    </div>
  );
}

export default function PricingPage() {
  const { t } = useLanguage();

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": productItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": t(`pricing.${item.id}.name`),
        "description": t(`pricing.${item.id}.desc`),
        "offers": {
          "@type": "Offer",
          "priceCurrency": "CNY",
          "price": t(`pricing.${item.id}.price`).replace(",", ""),
          "availability": "https://schema.org/InStock",
          "seller": {
            "@type": "ComputerStore",
            "name": t("pay.merchant.name")
          }
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title={t("pay.merchant.name") + " - " + t("pricing.title")}
        description={t("pricing.subtitle")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm">
              <MonitorSmartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">
              {t("footer.brand")}
              <span className="hidden sm:inline text-muted-foreground font-normal text-sm ml-2">
                {t("footer.brand").includes("三和") ? "电脑经营部" : "Computer"}
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
              {t("nav.home")}
            </Link>
            <span className="text-primary font-medium">{t("nav.pricing")}</span>
          </div>
        </div>
      </header>

      {/* Page title */}
      <section className="bg-muted/40 py-14">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">{t("pricing.title")}</h1>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t("pricing.subtitle")}</p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">{t("pricing.products")}</h2>
            <p className="text-muted-foreground">{t("pricing.products.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {productItems.map((item) => {
              const Icon = iconMap[item.icon] ?? Monitor;
              return (
                <Card key={item.id} className="border-border/70 hover:border-primary/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all flex flex-col">
                  <CardContent className="p-6 flex flex-col flex-1">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{t(`pricing.${item.id}.name`)}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                      {t(`pricing.${item.id}.desc`)}
                    </p>
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <PriceTag item={item} />
                      <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
                        <Link href={`/pay?item=${item.id}`}>{t("pricing.buy")}</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-4xl font-bold mb-3">{t("pricing.services")}</h2>
            <p className="text-muted-foreground">{t("pricing.services.subtitle")}</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
            {serviceItems.map((item) => {
              const Icon = iconMap[item.icon] ?? Cpu;
              const unitKey = t(`pricing.${item.id}.unit`);
              return (
                <Card key={item.id} className="border-border/70 hover:border-primary/50 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          <span className="text-xs text-muted-foreground font-normal">¥</span>
                          {t(`pricing.${item.id}.price`)}
                        </div>
                        {unitKey && unitKey !== `pricing.${item.id}.unit` && (
                          <div className="text-xs text-muted-foreground">{t(`pricing.unit.${unitKey}`)}</div>
                        )}
                      </div>
                    </div>
                    <h3 className="font-bold text-sm mb-1.5">{t(`pricing.${item.id}.name`)}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                      {t(`pricing.${item.id}.desc`)}
                    </p>
                    <Button asChild variant="outline" size="sm" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                      <Link href={`/pay?item=${item.id}`}>{t("pricing.buy")}</Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <p className="text-center text-sm text-muted-foreground max-w-3xl mx-auto mt-10 flex items-start sm:items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span>{t("pricing.note")}</span>
          </p>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
