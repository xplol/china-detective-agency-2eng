import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "zh" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  zh: {
    // Navigation
    "nav.home": "首页",
    "nav.services": "服务项目",
    "nav.about": "关于我们",
    "nav.process": "服务流程",
    "nav.scenarios": "适用场景",
    "nav.contact": "联系方式",
    "nav.menu": "菜单",

    // Hero Section
    "hero.chip": "成都市金牛区 · 实体经营门店",
    "hero.title.line1": "电脑销售与维修",
    "hero.title.line2": "一站式技术服务",
    "hero.subtitle": "电脑整机销售、组装升级、维修维护、监控安防与网络工程，立足金牛区，为家庭用户与企业提供靠谱的 IT 服务。",
    "hero.cta.services": "浏览服务项目",
    "hero.cta.contact": "联系我们",
    "hero.trust1": "实体门店",
    "hero.trust2": "明码标价",
    "hero.trust3": "上门服务",
    "hero.trust4": "售后保障",

    // Services Section
    "services.title": "服务项目",
    "services.subtitle": "从买电脑到修电脑，从装监控到组网络，一家门店解决所有电脑相关问题",
    "services.sales.title": "电脑整机销售",
    "services.sales.desc": "品牌笔记本、台式机、一体机及外设配件，按用途和预算推荐高性价比配置。",
    "services.assemble.title": "电脑组装与升级",
    "services.assemble.desc": "DIY 装机、内存硬盘升级、硬件更换调试，兼容性与稳定性一步到位。",
    "services.repair.title": "维修与系统维护",
    "services.repair.desc": "故障诊断、系统重装、软件调试、数据备份恢复、清灰除尘保养。",
    "services.cctv.title": "监控安防安装",
    "services.cctv.desc": "家庭与商铺监控方案设计、摄像头安装调试，手机远程实时查看。",
    "services.network.title": "网络与综合布线",
    "services.network.desc": "家庭办公网络搭建、路由器调试、全屋 / 办公区 WiFi 覆盖优化、综合布线。",
    "services.office.title": "办公设备与耗材",
    "services.office.desc": "打印机销售与维修、硒鼓墨盒耗材供应、办公软件安装与调试。",
    "services.note": "所有服务均明码标价，先检测报价、确认后施工",

    // About Section
    "about.title": "关于我们",
    "about.p1": "金牛区三和益联电脑经营部位于四川省成都市金牛区，是一家面向家庭用户、企业和商铺的电脑零售与技术服务门店，提供从购机选型、装机升级到维修维护、监控组网的全方位服务。",
    "about.p2": "我们坚持「诚信经营、技术立身」，以透明的价格和扎实的技术为每一位客户解决实际问题，努力成为您身边长期信赖的 IT 服务伙伴。",
    "about.point1.title": "实体经营",
    "about.point1.desc": "线下门店，面对面沟通更放心",
    "about.point2.title": "技术扎实",
    "about.point2.desc": "装机、维修、组网一站式服务",
    "about.point3.title": "快速响应",
    "about.point3.desc": "故障当天检测，尽快处理",
    "about.point4.title": "透明报价",
    "about.point4.desc": "先方案后维修，无隐形消费",

    // Process Section
    "process.title": "服务流程",
    "process.subtitle": "简单四步，问题迎刃而解",
    "process.step1.title": "需求沟通",
    "process.step1.desc": "电话或到店描述问题，初步判断需求",
    "process.step2.title": "检测报价",
    "process.step2.desc": "现场检测设备，给出方案与透明报价",
    "process.step3.title": "实施服务",
    "process.step3.desc": "到店或上门施工，完成调试与验收",
    "process.step4.title": "售后保障",
    "process.step4.desc": "服务完成建档，后续问题跟进处理",

    // Scenarios Section
    "scenarios.title": "适用场景",
    "scenarios.subtitle": "无论个人还是企业，都能找到适合的服务方案",
    "scenarios.home.title": "家庭个人用户",
    "scenarios.home.desc": "家用电脑选购与维修、孩子网课学习设备、游戏装机升级、家庭监控看家看老人。",
    "scenarios.business.title": "企业办公客户",
    "scenarios.business.desc": "办公电脑批量采购、办公网络搭建与维护、打印机等办公设备支持、IT 日常运维。",
    "scenarios.shop.title": "商铺门店业主",
    "scenarios.shop.desc": "收银电脑与外设、店铺监控安防系统、门店 WiFi 全覆盖、营业设备日常维保。",

    // Contact Section
    "contact.title": "联系我们",
    "contact.subtitle": "到店咨询或预约上门服务，欢迎随时联系",
    "contact.address.title": "门店地址",
    "contact.address.content": "四川省成都市金牛区",
    "contact.address.subtitle": "详细地址可提前电话确认",
    "contact.hours.title": "营业时间",
    "contact.hours.content": "周一至周日 9:00 - 18:00",
    "contact.hours.subtitle": "维修服务建议提前预约",
    "contact.area.title": "服务区域",
    "contact.area.content": "金牛区及周边区域",
    "contact.area.subtitle": "支持上门检测与服务",
    "contact.phone.title": "联系电话",
    "contact.phone.content": "电话 / 微信：待补充",
    "contact.phone.subtitle": "号码确认后即对外公示",
    "contact.promise.title": "服务承诺",
    "contact.promise.item1": "明码标价，先报价确认后施工",
    "contact.promise.item2": "配件与设备来自正规渠道",
    "contact.promise.item3": "维修过程数据严格保密",
    "contact.promise.item4": "服务项目建档，提供售后跟进",

    // Footer
    "footer.brand": "三和益联电脑",
    "footer.description": "金牛区三和益联电脑经营部 —— 电脑销售、维修维护、监控安防与网络工程一站式服务。",
    "footer.links": "快速链接",
    "footer.services": "服务项目",
    "footer.contact": "联系信息",
    "footer.contact.address": "四川省成都市金牛区",
    "footer.contact.hours": "周一至周日 9:00 - 18:00",
    "footer.copyright": "© 2026 金牛区三和益联电脑经营部 版权所有",
    "footer.icp": "蜀ICP备2026065870号",

    // Language switch
    "lang.switch": "EN",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About Us",
    "nav.process": "Process",
    "nav.scenarios": "Solutions",
    "nav.contact": "Contact",
    "nav.menu": "Menu",

    // Hero Section
    "hero.chip": "Jinniu District, Chengdu · Local Store",
    "hero.title.line1": "PC Sales & Repair",
    "hero.title.line2": "One-Stop IT Service",
    "hero.subtitle": "Computers, custom builds, repairs, CCTV and networking — Sanhe Yilian Computer serves households and businesses in Jinniu District, Chengdu with reliable IT services.",
    "hero.cta.services": "Explore Services",
    "hero.cta.contact": "Contact Us",
    "hero.trust1": "Physical Store",
    "hero.trust2": "Transparent Pricing",
    "hero.trust3": "On-site Service",
    "hero.trust4": "After-sales Support",

    // Services Section
    "services.title": "Our Services",
    "services.subtitle": "From buying a PC to fixing one, from CCTV to networking — one store for all your computer needs",
    "services.sales.title": "Computer Sales",
    "services.sales.desc": "Brand laptops, desktops, all-in-ones and peripherals, with cost-effective configurations recommended for your needs and budget.",
    "services.assemble.title": "Custom Builds & Upgrades",
    "services.assemble.desc": "DIY builds, memory and storage upgrades, hardware replacement and debugging with full compatibility testing.",
    "services.repair.title": "Repair & Maintenance",
    "services.repair.desc": "Troubleshooting, OS reinstallation, software setup, data backup & recovery, cleaning and maintenance.",
    "services.cctv.title": "CCTV & Security",
    "services.cctv.desc": "Surveillance solutions for homes and shops, camera installation and setup, real-time remote viewing on your phone.",
    "services.network.title": "Networking & Cabling",
    "services.network.desc": "Home and office networks, router configuration, whole-premises WiFi coverage, structured cabling.",
    "services.office.title": "Office Equipment & Supplies",
    "services.office.desc": "Printer sales and repair, toner and ink supplies, office software installation and configuration.",
    "services.note": "Transparent pricing on every job — quote first, proceed after your confirmation",

    // About Section
    "about.title": "About Us",
    "about.p1": "Sanhe Yilian Computer (Jinniu District) is a computer retail and technical service store based in Jinniu District, Chengdu, Sichuan. We serve households, businesses and shop owners with everything from PC selection and custom builds to repair, maintenance, CCTV and networking.",
    "about.p2": "We believe in honest business and solid craftsmanship — solving real problems with transparent pricing, and striving to be your long-term, trusted IT service partner in the neighborhood.",
    "about.point1.title": "Physical Store",
    "about.point1.desc": "Face-to-face service you can trust",
    "about.point2.title": "Solid Skills",
    "about.point2.desc": "One-stop build, repair & networking",
    "about.point3.title": "Fast Response",
    "about.point3.desc": "Same-day diagnosis for most repairs",
    "about.point4.title": "Transparent Quotes",
    "about.point4.desc": "Plan and price before any work",

    // Process Section
    "process.title": "How It Works",
    "process.subtitle": "Four simple steps to get things done",
    "process.step1.title": "Consultation",
    "process.step1.desc": "Call or visit us to describe the issue",
    "process.step2.title": "Diagnosis & Quote",
    "process.step2.desc": "On-the-spot testing with a transparent quote",
    "process.step3.title": "Service",
    "process.step3.desc": "In-store or on-site work, tested and accepted",
    "process.step4.title": "After-sales",
    "process.step4.desc": "Service records kept, follow-up support",

    // Scenarios Section
    "scenarios.title": "Who We Serve",
    "scenarios.subtitle": "Tailored solutions for individuals, offices and shops",
    "scenarios.home.title": "Home Users",
    "scenarios.home.desc": "Home PC buying and repair, study devices for kids, gaming builds and upgrades, home CCTV for family care.",
    "scenarios.business.title": "Offices & Businesses",
    "scenarios.business.desc": "Bulk PC procurement, office networking and maintenance, printer support, day-to-day IT operations.",
    "scenarios.shop.title": "Shop Owners",
    "scenarios.shop.desc": "POS computers and peripherals, store surveillance systems, full WiFi coverage, routine equipment care.",

    // Contact Section
    "contact.title": "Contact Us",
    "contact.subtitle": "Visit our store or book on-site service — we are here to help",
    "contact.address.title": "Store Address",
    "contact.address.content": "Jinniu District, Chengdu, Sichuan",
    "contact.address.subtitle": "Call ahead to confirm details",
    "contact.hours.title": "Business Hours",
    "contact.hours.content": "Mon - Sun 9:00 - 18:00",
    "contact.hours.subtitle": "Repairs are best booked in advance",
    "contact.area.title": "Service Area",
    "contact.area.content": "Jinniu District & nearby areas",
    "contact.area.subtitle": "On-site diagnosis and service available",
    "contact.phone.title": "Phone",
    "contact.phone.content": "Phone / WeChat: to be added",
    "contact.phone.subtitle": "Will be published once confirmed",
    "contact.promise.title": "Our Promises",
    "contact.promise.item1": "Transparent pricing — quote before work",
    "contact.promise.item2": "Genuine parts from proper channels",
    "contact.promise.item3": "Your data kept strictly confidential",
    "contact.promise.item4": "Service records with after-sales follow-up",

    // Footer
    "footer.brand": "Sanhe Yilian Computer",
    "footer.description": "Sanhe Yilian Computer (Jinniu District) — one-stop PC sales, repair, CCTV and networking services in Chengdu.",
    "footer.links": "Quick Links",
    "footer.services": "Services",
    "footer.contact": "Contact",
    "footer.contact.address": "Jinniu District, Chengdu, Sichuan",
    "footer.contact.hours": "Mon - Sun 9:00 - 18:00",
    "footer.copyright": "© 2026 Jinniu District Sanhe Yilian Computer. All rights reserved.",
    "footer.icp": "蜀ICP备2026065870号",

    // Language switch
    "lang.switch": "中文",
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Check localStorage first
    const saved = localStorage.getItem("language");
    if (saved === "zh" || saved === "en") {
      return saved;
    }

    // Detect browser language
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith("zh")) {
      return "zh";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.zh] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
