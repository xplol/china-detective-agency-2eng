/**
 * Design Philosophy: Film Noir Detective Aesthetic
 * - Deep blue/dark background (#0A1628) + gold accent (#FFD700)
 * - Night cityscape imagery with cinematic lighting
 * - Glass morphism cards with semi-transparent backgrounds
 * - Serif display fonts (Cinzel, Playfair Display) + Sans-serif body (Noto Sans SC)
 * - Layout: Full-screen Hero → Service Cards → About → Stats → Cases → Contact Form
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    service: "",
    description: "",
    urgent: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("咨询请求已提交，我们将尽快与您联系！");
    setFormData({
      name: "",
      phone: "",
      email: "",
      service: "",
      description: "",
      urgent: false
    });
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Shield className="w-6 h-6 text-accent-foreground" />
              </div>
              <span className="text-xl font-bold text-gold-gradient">Truth Detective Agency</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#home" className="text-sm hover:text-accent transition-colors">首页</a>
              <a href="#services" className="text-sm hover:text-accent transition-colors">服务</a>
              <a href="#about" className="text-sm hover:text-accent transition-colors">关于我们</a>
              <a href="#cases" className="text-sm hover:text-accent transition-colors">案例成果</a>
              <a href="#contact" className="text-sm hover:text-accent transition-colors">联系方式</a>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                免费咨询
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section 
        id="home"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background"></div>
        <div className="relative z-10 container mx-auto px-6 text-center">
          <h1 className="text-6xl md:text-8xl font-display font-bold mb-6 animate-fade-in">
            UNCOVERING<br />
            <span className="text-gold-gradient">THE TRUTH</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            专业的私人调查与侦探服务
          </p>
          <p className="text-lg text-muted-foreground mb-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            保密、专业、高效解决您的疑难问题
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg">
              免费咨询
            </Button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-5 h-5" />
              <span>24小时服务热线：400-123-4567</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative" style={{backgroundImage: 'url(/service-bg.jpg)', backgroundSize: 'cover', backgroundAttachment: 'fixed'}}>
        <div className="absolute inset-0 bg-background/90"></div>
        <div className="relative z-10 container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">专业侦探服务</h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              我们提供全方位的调查服务，运用先进技术和丰富经验，为每一位客户量身定制解决方案
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Heart,
                title: "婚姻调查",
                description: "专业处理婚姻纠纷、出轨调查、财产分割等敏感问题，保护您的合法权益"
              },
              {
                icon: Building2,
                title: "商业背景调查",
                description: "企业尽职调查、合作伙伴背景核实、商业欺诈防范，为您的商业决策保驾护航"
              },
              {
                icon: MapPin,
                title: "人员行踪调查",
                description: "失踪人员寻找、债务人定位、重要人员行踪监控，运用专业技术精准定位"
              },
              {
                icon: FileText,
                title: "证据收集",
                description: "法庭可用证据收集、现场勘查取证、数字取证分析，确保证据的合法性和有效性"
              },
              {
                icon: Shield,
                title: "安全风险评估",
                description: "个人安全威胁评估、企业安全漏洞检测、反窃听检测，全方位保护您的隐私安全"
              },
              {
                icon: Wallet,
                title: "资产调查",
                description: "隐匿资产追踪、财产状况调查、投资背景核实，为您提供详尽的财务情报"
              }
            ].map((service, index) => (
              <Card key={index} className="glass-card hover:border-accent/50 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <service.icon className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 glass-card px-6 py-3 rounded-full">
              <Lock className="w-5 h-5 text-accent" />
              <span className="text-sm text-muted-foreground">所有调查活动严格遵守法律法规，确保客户隐私绝对保密</span>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background/50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">关于我们</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Truth Detective Agency成立于2008年，是一家专业的私人调查机构。我们的团队由经验丰富的前执法人员、法律专家和技术分析师组成，拥有超过15年的行业经验。
                </p>
                <p>
                  我们秉承"真相至上、保密第一"的职业理念，运用合法手段为客户提供准确、可靠的调查结果。无论案件大小，我们都以同样的专业态度和严谨精神对待每一位委托人。
                </p>
                <p>
                  多年来，我们已成功处理超过500起各类调查案件，客户满意度高达98%。我们不仅是您的调查伙伴，更是您值得信赖的问题解决专家。
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {[
                  { icon: Award, label: "15年+", sublabel: "行业经验" },
                  { icon: Users, label: "专业团队", sublabel: "前警察、律师、技术专家" },
                  { icon: Lock, label: "绝对保密", sublabel: "签订保密协议" },
                  { icon: Clock, label: "24/7", sublabel: "全天候服务" }
                ].map((item, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-3">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <div className="text-lg font-bold text-accent">{item.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{item.sublabel}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 glass-card p-4 rounded-lg inline-flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                <span className="text-sm font-medium">专业认证：国际调查协会会员单位</span>
              </div>
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
      <section className="py-20 bg-background/80">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">用数据说话</h2>
            <p className="text-muted-foreground text-lg">
              多年来的专业积累，为我们赢得了客户的信任和行业的认可
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "成功案件", sublabel: "各类调查案件" },
              { number: "98%", label: "客户满意度", sublabel: "高质量服务" },
              { number: "15年", label: "行业经验", sublabel: "专业积累" },
              { number: "1000+", label: "服务客户", sublabel: "信赖之选" }
            ].map((stat, index) => (
              <div key={index} className="text-center glass-card p-8 rounded-lg">
                <div className="text-5xl font-display font-bold text-gold-gradient mb-2">{stat.number}</div>
                <div className="text-xl font-bold mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cases Section */}
      <section id="cases" className="py-20 bg-background/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">经典成功案例</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {[
              {
                tag: "商业调查",
                title: "企业商业间谍案",
                description: "成功揭露竞争对手窃取商业机密行为，为客户挽回损失超过500万元"
              },
              {
                tag: "人员追踪",
                title: "失踪人员寻找",
                description: "运用先进定位技术和社会关系网络分析，72小时内找到失踪15年的家庭成员"
              },
              {
                tag: "婚姻调查",
                title: "婚姻取证调查",
                description: "为离婚诉讼提供关键证据，帮助委托人获得合理的财产分割和子女抚养权"
              }
            ].map((caseItem, index) => (
              <Card key={index} className="glass-card hover:border-accent/50 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-medium mb-4">
                    {caseItem.tag}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{caseItem.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{caseItem.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              案例信息已做保密处理，保护客户隐私是我们的首要原则
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-background/80">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">立即联系我们</h2>
            <p className="text-muted-foreground text-lg">
              无论您面临什么问题，我们都将为您提供专业、保密、高效的解决方案
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">多种联系方式</h3>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Phone,
                    title: "24小时热线",
                    content: "400-123-4567",
                    subtitle: "紧急情况随时联系"
                  },
                  {
                    icon: Mail,
                    title: "邮箱咨询",
                    content: "info@truthdetective.com",
                    subtitle: "详细案情请发邮件"
                  },
                  {
                    icon: MapPinned,
                    title: "办公地址",
                    content: "北京市朝阳区CBD核心区",
                    subtitle: "预约后可实地面谈"
                  },
                  {
                    icon: Clock,
                    title: "营业时间",
                    content: "24/7全天候服务",
                    subtitle: "随时为您提供帮助"
                  }
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
                    隐私保护承诺
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>所有咨询信息绝对保密</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>签订正式保密协议</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <span>符合法律法规要求</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <Card className="glass-card">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">免费咨询表单</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">姓名 *</Label>
                    <Input
                      id="name"
                      placeholder="请输入您的姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">联系电话 *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="请输入手机号码"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">邮箱地址</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="请输入邮箱地址"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="bg-background/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="service">需要的服务 *</Label>
                    <Select value={formData.service} onValueChange={(value) => setFormData({...formData, service: value})} required>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue placeholder="请选择服务类型" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="marriage">婚姻调查</SelectItem>
                        <SelectItem value="business">商业背景调查</SelectItem>
                        <SelectItem value="tracking">人员行踪调查</SelectItem>
                        <SelectItem value="evidence">证据收集</SelectItem>
                        <SelectItem value="security">安全风险评估</SelectItem>
                        <SelectItem value="asset">资产调查</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">详细描述 *</Label>
                    <Textarea
                      id="description"
                      placeholder="请详细描述您遇到的问题或需要的帮助（限500字）"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                      className="bg-background/50 min-h-32"
                      maxLength={500}
                    />
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {formData.description.length}/500
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="urgent"
                      checked={formData.urgent}
                      onCheckedChange={(checked) => setFormData({...formData, urgent: checked as boolean})}
                    />
                    <Label htmlFor="urgent" className="text-sm cursor-pointer">
                      这是紧急情况，需要优先处理
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    立即提交咨询
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    提交即表示您同意我们的隐私政策和服务条款
                  </p>
                </form>
              </CardContent>
            </Card>
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
                <span className="text-xl font-bold text-gold-gradient">Truth Detective Agency</span>
              </div>
              <p className="text-sm text-muted-foreground">
                专业的私人调查与侦探服务<br />
                保密、专业、高效
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">快速链接</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <a href="#home" className="text-muted-foreground hover:text-accent transition-colors">首页</a>
                <a href="#services" className="text-muted-foreground hover:text-accent transition-colors">服务项目</a>
                <a href="#about" className="text-muted-foreground hover:text-accent transition-colors">关于我们</a>
                <a href="#cases" className="text-muted-foreground hover:text-accent transition-colors">成功案例</a>
                <a href="#contact" className="text-muted-foreground hover:text-accent transition-colors">联系我们</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">法律声明</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors block">隐私政策</a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors block">服务条款</a>
                <a href="#" className="text-muted-foreground hover:text-accent transition-colors block">免责声明</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Truth Detective Agency. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
