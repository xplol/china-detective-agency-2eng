import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearch } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MonitorSmartphone,
  ChevronLeft,
  Wallet,
  MessageCircle,
  BadgeCheck,
  ShieldCheck,
  Info,
  ReceiptText,
  Loader2
} from "lucide-react";
import QRCode from "qrcode";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import SEO from "@/components/SEO";
import SiteFooter from "@/components/SiteFooter";
import { findPricingItem } from "@/data/pricing";

type PayMethod = "alipay" | "wechat";

const GATEWAY = "https://pay.xplol.cn";

export default function PayPage() {
  const { t } = useLanguage();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const item = findPricingItem(params.get("item"));
  const paid = params.get("paid") === "1";
  const [orderNo] = useState(() => {
    // When Alipay redirects back (?paid=1&no=...), show the real order number
    const urlNo = params.get("no") || "";
    if (/^[A-Z0-9]{8,32}$/.test(urlNo)) return urlNo;
    return "SYL" + Date.now().toString(36).toUpperCase() + Math.floor(Math.random() * 1296).toString(36).toUpperCase().padStart(2, "0");
  });
  const [payMethod, setPayMethod] = useState<PayMethod>("alipay");
  const [wxQr, setWxQr] = useState<string | null>(null);
  const [qrConfirming, setQrConfirming] = useState(false);
  const [wxPaid, setWxPaid] = useState(false);
  const pollRef = useRef<number | null>(null);

  const unitText = useMemo(() => {
    if (!item) return "";
    const key = t(`pricing.${item.id}.unit`);
    return ["from", "perVisit", "perCamera"].includes(key) ? t(`pricing.unit.${key}`) : "";
  }, [item, t]);

  const showPaidBanner = paid || wxPaid;

  // Poll WeChat order state while the QR code is on screen
  useEffect(() => {
    if (!wxQr || !item) return;
    const no = orderNo;
    const timer = window.setInterval(async () => {
      try {
        const res = await fetch(`${GATEWAY}/wxpay/query?no=${encodeURIComponent(no)}`);
        const data = await res.json();
        if (data.tradeState === "SUCCESS") {
          setWxQr(null);
          setWxPaid(true);
        }
      } catch {
        // transient network error — keep polling
      }
    }, 2500);
    pollRef.current = timer;
    return () => window.clearInterval(timer);
  }, [wxQr, item, orderNo]);

  const handlePay = async () => {
    if (!item) return;
    let status: { alipay?: { configured?: boolean }; wxpay?: { configured?: boolean } } | null = null;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(`${GATEWAY}/pay/status`, { signal: ctrl.signal });
      clearTimeout(timer);
      status = await res.json();
    } catch {
      // gateway unreachable — fall through to the notice below
    }

    if (payMethod === "alipay") {
      if (status?.alipay?.configured) {
        // Hand off to the gateway, which signs and redirects to Alipay's cashier
        window.location.href = `${GATEWAY}/alipay/pay?item=${item.id}&no=${orderNo}`;
        return;
      }
    } else {
      if (status?.wxpay?.configured) {
        try {
          const res = await fetch(`${GATEWAY}/wxpay/native?item=${item.id}&no=${orderNo}`);
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || "failed");
          const dataUrl = await QRCode.toDataURL(data.codeUrl, { width: 480, margin: 1 });
          setWxPaid(false);
          setWxQr(dataUrl);
          // Bring the QR panel into view
          setTimeout(() => document.getElementById("wxpay-qr")?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
          return;
        } catch (e) {
          toast(t("pay.notice.title"), {
            description: e instanceof Error && e.message ? e.message : t("pay.notice.text"),
            duration: 6000
          });
          return;
        }
      }
    }
    toast(t("pay.notice.title"), {
      description: t("pay.notice.text"),
      duration: 6000
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <SEO title={`${t("pay.title")} - ${t("pay.merchant.name")}`} description={t("pay.notice.text")} />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="container mx-auto px-6 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-sm">
              <MonitorSmartphone className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight whitespace-nowrap">{t("footer.brand")}</span>
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {t("nav.pricing")}
          </Link>
        </div>
      </header>

      {/* Checkout body */}
      <main className="flex-1 py-10 md:py-14 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2.5">
              <ReceiptText className="w-6 h-6 text-blue-600" />
              {t("pay.title")}
            </h1>

            {item ? (
              <>
                {/* Paid-return banner (return_url lands here with ?paid=1) */}
                {(paid || wxPaid) && !wxQr && (
                  <Card className="border-green-200 bg-green-50 mb-4">
                    <CardContent className="p-5 flex items-start gap-3">
                      <BadgeCheck className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-sm text-green-800 mb-1">{t("pay.paid.title")}</h3>
                        <p className="text-xs text-green-700 leading-relaxed">{t("pay.paid.text")}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order summary */}
                <Card className="border-border/70 mb-4">
                  <CardContent className="p-6">
                    <h2 className="font-bold mb-4">{t("pay.order.title")}</h2>
                    <dl className="space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground flex-shrink-0">{t("pay.order.item")}</dt>
                        <dd className="font-medium text-right">{t(`pricing.${item.id}.name`)}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground flex-shrink-0">{t("pay.merchant")}</dt>
                        <dd className="font-medium text-right">{t("pay.merchant.name")}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground flex-shrink-0">{t("pay.order.no")}</dt>
                        <dd className="font-mono text-right text-xs leading-5">{orderNo}</dd>
                      </div>
                      <div className="border-t border-border/60 pt-3 flex justify-between items-baseline gap-4">
                        <dt className="text-muted-foreground">{t("pay.amount")}</dt>
                        <dd className="flex items-baseline gap-1">
                          <span className="text-sm text-muted-foreground">¥</span>
                          <span className="text-3xl font-bold text-blue-600">{t(`pricing.${item.id}.price`)}</span>
                          {unitText && (
                            <span className="text-sm text-muted-foreground">{unitText}</span>
                          )}
                        </dd>
                      </div>
                    </dl>
                    <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                      {t(`pricing.${item.id}.desc`)}
                    </p>
                  </CardContent>
                </Card>

                {/* Payment methods */}
                <Card className="border-border/70 mb-4">
                  <CardContent className="p-6">
                    <h2 className="font-bold mb-4">{t("pay.method")}</h2>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => setPayMethod("alipay")}
                        className={`w-full text-left flex items-center justify-between gap-3 p-3.5 rounded-xl border-2 transition-colors ${
                          payMethod === "alipay"
                            ? "border-blue-500 bg-blue-50/60"
                            : "border-border/70 bg-card hover:border-blue-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                            <Wallet className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm">{t("pay.alipay")}</span>
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600 text-white font-medium">
                                {t("pay.alipay.recommended")}
                              </span>
                              <BadgeCheck className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="text-xs text-muted-foreground mt-0.5">{t("pay.alipay.desc")}</div>
                          </div>
                        </div>
                        <div
                          className={`w-4.5 h-4.5 rounded-full flex-shrink-0 ${
                            payMethod === "alipay" ? "border-[5px] border-blue-600" : "border border-muted-foreground/40"
                          }`}
                          aria-hidden="true"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayMethod("wechat")}
                        className={`w-full text-left flex items-center justify-between gap-3 p-3.5 rounded-xl border-2 transition-colors ${
                          payMethod === "wechat"
                            ? "border-green-500 bg-green-50/60"
                            : "border-border/70 bg-card hover:border-green-200"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0">
                            <MessageCircle className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="font-bold text-sm">{t("pay.wechat")}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{t("pay.wechat.desc")}</div>
                          </div>
                        </div>
                        <div
                          className={`w-4.5 h-4.5 rounded-full flex-shrink-0 ${
                            payMethod === "wechat" ? "border-[5px] border-green-600" : "border border-muted-foreground/40"
                          }`}
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Pay button */}
                <Button
                  size="lg"
                  onClick={handlePay}
                  className={`w-full h-12 text-white text-base shadow-lg ${
                    payMethod === "wechat"
                      ? "bg-green-600 hover:bg-green-500 shadow-green-600/20"
                      : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"
                  }`}
                >
                  {t("pay.payNow")} ¥{t(`pricing.${item.id}.price`)}
                  {unitText ? ` ${unitText}` : ""}
                </Button>

                {/* WeChat QR panel */}
                {wxQr && item && (
                  <Card id="wxpay-qr" className="border-green-200 mt-4">
                    <CardContent className="p-6 text-center">
                      <h3 className="font-bold mb-4 flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5 text-green-600" />
                        {t("pay.qr.title")}
                      </h3>
                      <img
                        src={wxQr}
                        alt={t("pay.qr.title")}
                        className="w-52 h-52 mx-auto rounded-lg border border-border"
                      />
                      <p className="text-sm text-muted-foreground mt-4">{t("pay.qr.hint")}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t("pay.order.no")}: {orderNo}
                      </p>
                      <p className="text-sm text-green-700 mt-3 flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {t("pay.qr.confirming")}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Notice */}
                <Card className="border-border/70 bg-muted/30 mt-4">
                  <CardContent className="p-5">
                    <h3 className="font-bold mb-2 flex items-center gap-2 text-sm">
                      <Info className="w-4 h-4 text-blue-600" />
                      {t("pay.notice.title")}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{t("pay.notice.text")}</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="border-border/70">
                <CardContent className="p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-5">{t("pay.invalid")}</p>
                  <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
                    <Link href="/pricing">{t("nav.pricing")}</Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            <p className="mt-6 text-center">
              <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                {t("pay.back")}
              </Link>
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
