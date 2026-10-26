import { useLanguage } from "@/contexts/LanguageContext";

export default function StructuredData() {
  const { language } = useLanguage();

  const storeData = {
    "@context": "https://schema.org",
    "@type": "ComputerStore",
    "name": language === "zh" ? "金牛区三和易联电脑经营部" : "Sanhe Yilian Computer (Jinniu District)",
    "description": language === "zh"
      ? "位于成都市金牛区的电脑零售与技术服务门店，提供电脑整机销售、组装升级、维修维护、监控安防安装、网络综合布线与办公设备耗材等服务。"
      : "A computer retail and service store in Jinniu District, Chengdu, offering PC sales, custom builds, repair and maintenance, CCTV installation, network cabling, and office equipment & supplies.",
    "url": "https://www.xplol.cn",
    "logo": "https://www.xplol.cn/favicon.svg",
    "image": "https://www.xplol.cn/hero-bg.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CN",
      "addressRegion": language === "zh" ? "四川省" : "Sichuan",
      "addressLocality": language === "zh" ? "成都市" : "Chengdu",
      "addressLocalityDistrict": language === "zh" ? "金牛区" : "Jinniu District"
    },
    "areaServed": {
      "@type": "City",
      "name": language === "zh" ? "成都市金牛区及周边" : "Jinniu District, Chengdu and nearby areas"
    },
    "openingHours": "Mo-Su 09:00-18:00"
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": language === "zh" ? "电脑销售与维修服务" : "Computer Sales & Repair Services",
    "provider": {
      "@type": "ComputerStore",
      "name": language === "zh" ? "金牛区三和易联电脑经营部" : "Sanhe Yilian Computer (Jinniu District)"
    },
    "areaServed": {
      "@type": "City",
      "name": language === "zh" ? "成都市金牛区及周边" : "Jinniu District, Chengdu and nearby areas"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": language === "zh" ? "服务项目" : "Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "电脑整机销售" : "Computer Sales"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "电脑组装与升级" : "Custom Builds & Upgrades"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "维修与系统维护" : "Repair & Maintenance"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "监控安防安装" : "CCTV & Security Installation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "网络与综合布线" : "Networking & Cabling"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "办公设备与耗材" : "Office Equipment & Supplies"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(storeData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
    </>
  );
}
