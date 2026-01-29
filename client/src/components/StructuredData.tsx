import { useLanguage } from "@/contexts/LanguageContext";

export default function StructuredData() {
  const { language } = useLanguage();

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": language === "zh" ? "真相侦探社" : "Truth Detective Agency",
    "description": language === "zh" 
      ? "专业的私人调查与侦探服务，提供婚姻调查、商业背景调查、人员行踪调查、证据收集等服务"
      : "Professional private investigation and detective services, offering relationship investigations, business background checks, person tracking, and evidence collection",
    "url": "https://www.xplol.cn",
    "logo": "https://www.xplol.cn/logo.png",
    "image": "https://www.xplol.cn/hero-bg.jpg",
    "telephone": "+86-153-9761-5812",
    "email": "chinadetective8848@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "CN",
      "addressLocality": language === "zh" ? "上海" : "Shanghai"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": language === "zh" ? "上海" : "Shanghai"
      },
      {
        "@type": "City",
        "name": language === "zh" ? "北京" : "Beijing"
      },
      {
        "@type": "City",
        "name": language === "zh" ? "广州" : "Guangzhou"
      },
      {
        "@type": "City",
        "name": language === "zh" ? "深圳" : "Shenzhen"
      },
      {
        "@type": "City",
        "name": language === "zh" ? "成都" : "Chengdu"
      }
    ],
    "priceRange": "$$",
    "openingHours": "Mo-Su 00:00-24:00",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "500",
      "bestRating": "5"
    }
  };

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": language === "zh" ? "私人调查服务" : "Private Investigation Services",
    "provider": {
      "@type": "ProfessionalService",
      "name": language === "zh" ? "真相侦探社" : "Truth Detective Agency"
    },
    "areaServed": {
      "@type": "Country",
      "name": language === "zh" ? "中国" : "China"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": language === "zh" ? "调查服务" : "Investigation Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "婚姻调查" : "Relationship Investigation"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "商业背景调查" : "Business Background Check"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "人员行踪调查" : "Person Tracking"
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": language === "zh" ? "证据收集" : "Evidence Collection"
          }
        }
      ]
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceData) }}
      />
    </>
  );
}
