import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

export default function SEO({ title, description, keywords, ogImage }: SEOProps) {
  const { language } = useLanguage();

  const defaultTitle = language === "zh" 
    ? "真相侦探社 - 专业私人侦探调查公司 | 婚姻调查_商业背景调查_寻人找人"
    : "Truth Detective Agency - Private Investigator China | Relationship Investigation & Background Check";

  const defaultDescription = language === "zh"
    ? "真相侦探社是中国领先的私人侦探调查公司，专业提供婚姻出轨调查、商业背景调查、寻人找人、证据收集等服务。15年行业经验，500+成功案例，98%客户满意度，绝对保密。服务上海、北京、广州、深圳、成都等全国主要城市。24小时免费咨询热线：+86 153 9761 5812"
    : "Truth Detective Agency is a leading private investigation company in China, specializing in relationship infidelity investigations, business background checks, missing person searches, and evidence collection. With 15+ years of experience, 500+ successful cases, and 98% client satisfaction, we guarantee absolute confidentiality. Serving major cities including Shanghai, Beijing, Guangzhou, Shenzhen, and Chengdu. Free 24/7 consultation: +86 153 9761 5812";

  const defaultKeywords = language === "zh"
    ? "私人侦探,私家侦探,调查公司,婚姻调查,出轨调查,商业调查,背景调查,寻人找人,证据收集,中国侦探,上海侦探,北京侦探"
    : "private investigator china,detective agency china,private detective,relationship investigation,infidelity investigation,business investigation,background check,missing person,evidence collection,shanghai detective,beijing detective";

  const defaultOgImage = "https://www.xplol.cn/hero-bg.jpg";

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
    updateMetaTag("author", "Truth Detective Agency");
    updateMetaTag("robots", "index, follow");

    // Open Graph tags
    updateMetaTag("og:title", finalTitle, true);
    updateMetaTag("og:description", finalDescription, true);
    updateMetaTag("og:image", finalOgImage, true);
    updateMetaTag("og:url", window.location.href, true);
    updateMetaTag("og:type", "website", true);
    updateMetaTag("og:site_name", "Truth Detective Agency", true);

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
    linkZh.href = "https://www.xplol.cn/?lang=zh";

    if (!linkEn) {
      linkEn = document.createElement("link");
      linkEn.rel = "alternate";
      linkEn.hreflang = "en";
      document.head.appendChild(linkEn);
    }
    linkEn.href = "https://www.xplol.cn/?lang=en";

    if (!linkXDefault) {
      linkXDefault = document.createElement("link");
      linkXDefault.rel = "alternate";
      linkXDefault.hreflang = "x-default";
      document.head.appendChild(linkXDefault);
    }
    linkXDefault.href = "https://www.xplol.cn/";

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://www.xplol.cn/";

  }, [finalTitle, finalDescription, finalKeywords, finalOgImage, language]);

  return null;
}
