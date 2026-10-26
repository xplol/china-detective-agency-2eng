import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

const SITE_URL = "https://www.xplol.cn";

export default function SEO({ title, description, keywords, ogImage }: SEOProps) {
  const { language } = useLanguage();

  const defaultTitle = language === "zh"
    ? "金牛区三和易联电脑经营部 - 成都电脑销售_维修_监控安装_网络布线"
    : "Sanhe Yilian Computer (Jinniu, Chengdu) - PC Sales, Repair, CCTV & Networking";

  const defaultDescription = language === "zh"
    ? "金牛区三和易联电脑经营部位于四川省成都市金牛区，提供电脑整机销售、DIY组装升级、电脑维修维护、监控安防安装、网络综合布线、办公设备与耗材等服务，服务家庭用户与企业客户，明码标价，支持上门服务。"
    : "Sanhe Yilian Computer is a computer store in Jinniu District, Chengdu, offering PC and laptop sales, custom builds, computer repair and maintenance, CCTV installation, network cabling, and office equipment & supplies for home and business customers. Transparent pricing, on-site service available.";

  const defaultKeywords = language === "zh"
    ? "三和易联电脑,金牛区电脑维修,成都电脑店,金牛区电脑销售,电脑组装,监控安装,成都监控安防,网络布线,全屋WiFi,办公设备,打印机维修"
    : "computer store chengdu,pc repair jinniu,laptop sales chengdu,custom pc build,cctv installation chengdu,network cabling,office equipment,printer repair,sanhe yilian computer";

  const defaultOgImage = `${SITE_URL}/hero-bg.jpg`;

  const finalTitle = title || defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const finalOgImage = ogImage || defaultOgImage;

  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? "property" : "name";
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      element.setAttribute("content", content);
    };

    // Basic meta tags
    updateMetaTag("description", finalDescription);
    updateMetaTag("keywords", finalKeywords);
    updateMetaTag("author", language === "zh" ? "金牛区三和易联电脑经营部" : "Sanhe Yilian Computer");
    updateMetaTag("robots", "index, follow");

    // Open Graph tags
    updateMetaTag("og:title", finalTitle, true);
    updateMetaTag("og:description", finalDescription, true);
    updateMetaTag("og:image", finalOgImage, true);
    updateMetaTag("og:url", window.location.href, true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:site_name", language === "zh" ? "金牛区三和易联电脑经营部" : "Sanhe Yilian Computer", true);

    // Twitter Card tags
    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", finalTitle);
    updateMetaTag("twitter:description", finalDescription);
    updateMetaTag("twitter:image", finalOgImage);

    // Language alternate tags
    let linkZh = document.querySelector('link[hreflang="zh"]') as HTMLLinkElement;
    let linkEn = document.querySelector('link[hreflang="en"]') as HTMLLinkElement;
    let linkXDefault = document.querySelector('link[hreflang="x-default"]') as HTMLLinkElement;

    if (!linkZh) {
      linkZh = document.createElement("link");
      linkZh.rel = "alternate";
      linkZh.hreflang = "zh";
      document.head.appendChild(linkZh);
    }
    linkZh.href = `${SITE_URL}/?lang=zh`;

    if (!linkEn) {
      linkEn = document.createElement("link");
      linkEn.rel = "alternate";
      linkEn.hreflang = "en";
      document.head.appendChild(linkEn);
    }
    linkEn.href = `${SITE_URL}/?lang=en`;

    if (!linkXDefault) {
      linkXDefault = document.createElement("link");
      linkXDefault.rel = "alternate";
      linkXDefault.hreflang = "x-default";
      document.head.appendChild(linkXDefault);
    }
    linkXDefault.href = `${SITE_URL}/`;

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE_URL}/`;

  }, [finalTitle, finalDescription, finalKeywords, finalOgImage, language]);

  return null;
}
