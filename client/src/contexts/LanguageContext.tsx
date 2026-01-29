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
    "nav.services": "服务",
    "nav.about": "关于我们",
    "nav.cases": "案例成果",
    "nav.contact": "联系方式",
    "nav.consultation": "免费咨询",
    
    // Hero Section
    "hero.title.part1": "UNCOVERING",
    "hero.title.part2": "THE TRUTH",
    "hero.subtitle": "专业的私人调查与侦探服务",
    "hero.description": "保密、专业、高效解决您的疑难问题",
    "hero.cta": "免费咨询",
    "hero.phone": "24小时服务热线：+86 153 9761 5812",
    
    // Services Section
    "services.title": "专业侦探服务",
    "services.subtitle": "我们提供全方位的调查服务，运用先进技术和丰富经验，为每一位客户量身定制解决方案",
    "services.marriage.title": "婚姻调查",
    "services.marriage.desc": "专业处理婚姻纠纷、出轨调查、财产分割取证等问题，保护您的合法权益",
    "services.business.title": "商业背景调查",
    "services.business.desc": "企业尽职调查、合作伙伴背景核实、商业欺诈防范，为您的商业决策保驾护航",
    "services.person.title": "人员行踪调查",
    "services.person.desc": "失踪人员寻找、债务人定位、重要人员行踪跟踪，运用专业技术精准定位",
    "services.evidence.title": "证据收集",
    "services.evidence.desc": "法庭可用证据收集、现场勘查取证、数字取证分析，确保证据的合法性和有效性",
    "services.risk.title": "安全风险评估",
    "services.risk.desc": "个人安全威胁评估、企业安全漏洞检测、反窃听检测，全方位保护您的隐私安全",
    "services.asset.title": "资产调查",
    "services.asset.desc": "隐藏资产追踪、财产状况调查、投资背景核实，为您提供详尽的财务情报",
    "services.note": "所有调查活动严格遵守法律法规，确保客户隐私和调查合法性",
    
    // About Section
    "about.title": "关于我们",
    "about.description1": "我们『真相』侦探社，保密第一的职业理念，运用合法手段为客户提供准确、可靠的调查结果。无论您面临什么问题，我们都将竭尽全力帮助您找到真相。",
    "about.description2": "多年来，我们已成功处理超过500起各类调查案件，客户满意度高达98%。我们不仅提供调查服务，更是您值得信赖的问题解决专家。",
    "about.years": "15年+",
    "about.years.desc": "行业经验",
    "about.team": "专业团队",
    "about.team.desc": "前警察、律师、技术专家",
    "about.confidential": "绝对保密",
    "about.confidential.desc": "签订保密协议",
    "about.service": "24/7",
    "about.service.desc": "全天候服务",
    "about.note": "专业认证：国际调查协会会员单位",
    
    // Stats Section
    "stats.title": "用数据说话",
    "stats.subtitle": "多年来的专业积累，为我们赢得了客户的信任和行业的认可",
    "stats.cases": "500+",
    "stats.cases.label": "成功案件",
    "stats.cases.desc": "各类调查案件",
    "stats.satisfaction": "98%",
    "stats.satisfaction.label": "客户满意度",
    "stats.satisfaction.desc": "高质量服务",
    "stats.experience": "15年",
    "stats.experience.label": "行业经验",
    "stats.experience.desc": "专业积累",
    "stats.clients": "1000+",
    "stats.clients.label": "服务客户",
    "stats.clients.desc": "信赖之选",
    
    // Cases Section
    "cases.title": "成功案例",
    "cases.subtitle": "真实案例展示我们的专业能力和服务质量",
    "cases.case1.title": "跨国婚姻调查",
    "cases.case1.desc": "客户怀疑配偶在海外有不正当关系，我们通过国际合作网络，在3周内收集到确凿证据，帮助客户在离婚诉讼中获得有利判决。",
    "cases.case1.result": "成功率：100% | 用时：21天",
    "cases.case2.title": "企业商业间谍",
    "cases.case2.desc": "某科技公司怀疑内部有商业间谍泄露机密，我们通过技术手段和人员调查，成功锁定泄密者并协助企业挽回重大损失。",
    "cases.case2.result": "挽回损失：500万+ | 用时：30天",
    "cases.case3.title": "失踪人员寻找",
    "cases.case3.desc": "家属委托寻找失联多年的亲人，我们利用大数据分析和实地走访，最终在偏远地区找到失踪者，促成家庭团聚。",
    "cases.case3.result": "成功找回 | 用时：45天",
    "cases.note": "案例信息已做保密处理，保护客户隐私是我们的首要原则",
    
    // Contact Section
    "contact.title": "立即联系我们",
    "contact.subtitle": "无论您面临什么问题，我们都将为您提供专业、保密、高效的解决方案",
    "contact.methods": "多种联系方式",
    "contact.phone.title": "24小时热线",
    "contact.phone.content": "+86 153 9761 5812",
    "contact.phone.subtitle": "紧急情况随时联系",
    "contact.email.title": "邮箱咨询",
    "contact.email.content": "chinadetective8848@gmail.com",
    "contact.email.subtitle": "详细案情请发邮件",
    "contact.address.title": "办公地址",
    "contact.address.content": "上海、北京、广州、深圳、成都",
    "contact.address.subtitle": "预约后可实地面谈",
    "contact.hours.title": "营业时间",
    "contact.hours.content": "24/7全天候服务",
    "contact.hours.subtitle": "随时为您提供帮助",
    "contact.privacy.title": "隐私保护承诺",
    "contact.privacy.item1": "所有咨询信息绝对保密",
    "contact.privacy.item2": "签订正式保密协议",
    "contact.privacy.item3": "符合法律法规要求",
    "contact.social.title": "社交媒体联系",
    "contact.social.open": "打开",
    "contact.social.qr": "查看二维码",
    "contact.form.title": "免费咨询表单",
    "contact.form.name": "姓名 *",
    "contact.form.name.placeholder": "请输入您的姓名",
    "contact.form.phone": "联系电话 *",
    "contact.form.phone.placeholder": "请输入您的电话",
    "contact.form.email": "邮箱",
    "contact.form.email.placeholder": "请输入您的邮箱",
    "contact.form.service": "咨询服务 *",
    "contact.form.service.placeholder": "请选择服务类型",
    "contact.form.service.marriage": "婚姻调查",
    "contact.form.service.business": "商业调查",
    "contact.form.service.person": "人员调查",
    "contact.form.service.evidence": "证据收集",
    "contact.form.service.other": "其他服务",
    "contact.form.message": "详细描述 *",
    "contact.form.message.placeholder": "请详细描述您的情况和需求",
    "contact.form.privacy": "我已阅读并同意隐私政策",
    "contact.form.submit": "立即提交咨询",
    "contact.form.note": "提交即表示您同意我们的隐私政策和服务条款",
    "contact.form.success": "提交成功！我们会在24小时内联系您",
    "contact.form.error": "提交失败，请稍后重试",
    
    // Footer
    "footer.brand": "Truth Detective Agency",
    "footer.description": "专业的私人调查与侦探服务 / 保密、专业、高效",
    "footer.links": "快速链接",
    "footer.legal": "法律信息",
    "footer.privacy": "隐私政策",
    "footer.terms": "服务条款",
    "footer.disclaimer": "免责声明",
    "footer.copyright": "© 2024 Truth Detective Agency. All rights reserved.",
    
    // WeChat Dialog
    "wechat.title": "微信扫码联系",
    "wechat.instruction": "扫码或搜索：",
    "wechat.id": "ChinaDetective",
  },
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.cases": "Cases",
    "nav.contact": "Contact",
    "nav.consultation": "Free Consultation",
    
    // Hero Section
    "hero.title.part1": "UNCOVERING",
    "hero.title.part2": "THE TRUTH",
    "hero.subtitle": "Professional Private Investigation Services",
    "hero.description": "Confidential, Professional, Efficient Solutions",
    "hero.cta": "Free Consultation",
    "hero.phone": "24/7 Hotline: +86 153 9761 5812",
    
    // Services Section
    "services.title": "Professional Investigation Services",
    "services.subtitle": "We provide comprehensive investigation services, using advanced technology and extensive experience to tailor solutions for every client",
    "services.marriage.title": "Relationship Investigation",
    "services.marriage.desc": "Professional handling of marital disputes, infidelity investigations, property division evidence, protecting your legal rights",
    "services.business.title": "Business Background Check",
    "services.business.desc": "Corporate due diligence, partner background verification, commercial fraud prevention, safeguarding your business decisions",
    "services.person.title": "Person Tracking",
    "services.person.desc": "Missing person search, debtor location, VIP tracking, using professional techniques for precise location",
    "services.evidence.title": "Evidence Collection",
    "services.evidence.desc": "Court-admissible evidence collection, scene investigation, digital forensics, ensuring evidence legality and validity",
    "services.risk.title": "Security Risk Assessment",
    "services.risk.desc": "Personal security threat assessment, corporate security vulnerability detection, counter-surveillance, comprehensive privacy protection",
    "services.asset.title": "Asset Investigation",
    "services.asset.desc": "Hidden asset tracking, financial status investigation, investment background verification, providing detailed financial intelligence",
    "services.note": "All investigations strictly comply with laws and regulations, ensuring client privacy and investigation legality",
    
    // About Section
    "about.title": "About Us",
    "about.description1": "We are \"Truth\" Detective Agency, with confidentiality as our top priority. We use legal means to provide accurate and reliable investigation results for clients. Whatever problem you face, we will do our utmost to help you find the truth.",
    "about.description2": "Over the years, we have successfully handled over 500 various investigation cases with a client satisfaction rate of 98%. We not only provide investigation services but are also your trusted problem-solving experts.",
    "about.years": "15+ Years",
    "about.years.desc": "Industry Experience",
    "about.team": "Professional Team",
    "about.team.desc": "Ex-Police, Lawyers, Tech Experts",
    "about.confidential": "Absolute Confidentiality",
    "about.confidential.desc": "Signed NDA",
    "about.service": "24/7",
    "about.service.desc": "Round-the-Clock Service",
    "about.note": "Professional Certification: Member of International Investigation Association",
    
    // Stats Section
    "stats.title": "Numbers Speak",
    "stats.subtitle": "Years of professional accumulation have earned us client trust and industry recognition",
    "stats.cases": "500+",
    "stats.cases.label": "Successful Cases",
    "stats.cases.desc": "Various Investigation Cases",
    "stats.satisfaction": "98%",
    "stats.satisfaction.label": "Client Satisfaction",
    "stats.satisfaction.desc": "High-Quality Service",
    "stats.experience": "15 Years",
    "stats.experience.label": "Industry Experience",
    "stats.experience.desc": "Professional Accumulation",
    "stats.clients": "1000+",
    "stats.clients.label": "Clients Served",
    "stats.clients.desc": "Trusted Choice",
    
    // Cases Section
    "cases.title": "Success Stories",
    "cases.subtitle": "Real cases demonstrating our professional capabilities and service quality",
    "cases.case1.title": "International Marriage Investigation",
    "cases.case1.desc": "Client suspected spouse of improper relationship overseas. Through international cooperation network, we collected solid evidence within 3 weeks, helping client obtain favorable judgment in divorce proceedings.",
    "cases.case1.result": "Success Rate: 100% | Duration: 21 days",
    "cases.case2.title": "Corporate Espionage",
    "cases.case2.desc": "A tech company suspected internal espionage leaking secrets. Through technical means and personnel investigation, we successfully identified the leaker and helped the company recover significant losses.",
    "cases.case2.result": "Loss Recovered: 5M+ | Duration: 30 days",
    "cases.case3.title": "Missing Person Search",
    "cases.case3.desc": "Family commissioned search for relative missing for years. Using big data analysis and field visits, we finally found the missing person in a remote area, facilitating family reunion.",
    "cases.case3.result": "Successfully Found | Duration: 45 days",
    "cases.note": "Case information has been anonymized to protect client privacy, our top priority",
    
    // Contact Section
    "contact.title": "Contact Us Now",
    "contact.subtitle": "Whatever problem you face, we will provide professional, confidential, and efficient solutions",
    "contact.methods": "Multiple Contact Methods",
    "contact.phone.title": "24/7 Hotline",
    "contact.phone.content": "+86 153 9761 5812",
    "contact.phone.subtitle": "Emergency Contact Anytime",
    "contact.email.title": "Email Inquiry",
    "contact.email.content": "chinadetective8848@gmail.com",
    "contact.email.subtitle": "Detailed Case via Email",
    "contact.address.title": "Office Locations",
    "contact.address.content": "Shanghai, Beijing, Guangzhou, Shenzhen, Chengdu",
    "contact.address.subtitle": "In-person Meeting by Appointment",
    "contact.hours.title": "Business Hours",
    "contact.hours.content": "24/7 Service",
    "contact.hours.subtitle": "Always Here to Help",
    "contact.privacy.title": "Privacy Protection Commitment",
    "contact.privacy.item1": "All consultation information strictly confidential",
    "contact.privacy.item2": "Formal NDA signed",
    "contact.privacy.item3": "Compliant with laws and regulations",
    "contact.social.title": "Social Media Contact",
    "contact.social.open": "Open",
    "contact.social.qr": "View QR Code",
    "contact.form.title": "Free Consultation Form",
    "contact.form.name": "Name *",
    "contact.form.name.placeholder": "Enter your name",
    "contact.form.phone": "Phone *",
    "contact.form.phone.placeholder": "Enter your phone",
    "contact.form.email": "Email",
    "contact.form.email.placeholder": "Enter your email",
    "contact.form.service": "Service Type *",
    "contact.form.service.placeholder": "Select service type",
    "contact.form.service.marriage": "Relationship Investigation",
    "contact.form.service.business": "Business Investigation",
    "contact.form.service.person": "Person Tracking",
    "contact.form.service.evidence": "Evidence Collection",
    "contact.form.service.other": "Other Services",
    "contact.form.message": "Detailed Description *",
    "contact.form.message.placeholder": "Please describe your situation and needs in detail",
    "contact.form.privacy": "I have read and agree to the privacy policy",
    "contact.form.submit": "Submit Consultation",
    "contact.form.note": "By submitting, you agree to our privacy policy and terms of service",
    "contact.form.success": "Submitted successfully! We will contact you within 24 hours",
    "contact.form.error": "Submission failed, please try again later",
    
    // Footer
    "footer.brand": "Truth Detective Agency",
    "footer.description": "Professional Private Investigation Services / Confidential, Professional, Efficient",
    "footer.links": "Quick Links",
    "footer.legal": "Legal",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.disclaimer": "Disclaimer",
    "footer.copyright": "© 2024 Truth Detective Agency. All rights reserved.",
    
    // WeChat Dialog
    "wechat.title": "WeChat QR Code",
    "wechat.instruction": "Scan or search:",
    "wechat.id": "ChinaDetective",
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
    document.documentElement.lang = language;
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
