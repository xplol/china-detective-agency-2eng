// 支付宝电脑网站支付网关 - 三和益联电脑经营部 (pay.xplol.cn)
// Pure Node (no npm deps): signs alipay.trade.page.pay requests with RSA2,
// verifies async notifications, and records orders to a JSONL file.
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { X509Certificate } from "node:crypto";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "config.json"), "utf8"));
const DATA_DIR = path.join(ROOT, "data");
fs.mkdirSync(DATA_DIR, { recursive: true });
const ORDERS_FILE = path.join(DATA_DIR, "orders.jsonl");

// --- key loading -----------------------------------------------------------

// Alipay key tool exports one-line base64; normalize to PEM. PKCS8 and PKCS1
// layouts are both attempted when the raw string carries no PEM header.
function wrapPem(raw, header, footer) {
  const body = raw.replace(/\s+/g, "");
  return `${header}\n${body.replace(/(.{64})/g, "$1\n")}\n${footer}`;
}

function loadPrivateKey() {
  const p = CONFIG.privateKeyPath;
  if (!p || !fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8").trim();
  if (raw.includes("-----BEGIN")) return raw;
  const candidates = [
    wrapPem(raw, "-----BEGIN PRIVATE KEY-----", "-----END PRIVATE KEY-----"),
    wrapPem(raw, "-----BEGIN RSA PRIVATE KEY-----", "-----END RSA PRIVATE KEY-----")
  ];
  return (
    candidates.find((pem) => {
      try {
        crypto.createSign("RSA-SHA256").update("probe").sign(pem);
        return true;
      } catch {
        return false;
      }
    }) || null
  );
}

function loadAlipayPublicKey() {
  const p = CONFIG.alipayPublicKeyPath;
  if (!p || !fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, "utf8").trim();
  if (raw.includes("-----BEGIN")) return raw;
  return wrapPem(raw, "-----BEGIN PUBLIC KEY-----", "-----END PUBLIC KEY-----");
}

const privateKey = loadPrivateKey();
const alipayPublicKey = loadAlipayPublicKey();

// --- 公钥证书模式 (certificate signing mode) --------------------------------
// Mirrors Alipay's SDK: app_cert_sn = md5(reversed-RFC2253-issuer + serial-hex),
// alipay_root_cert_sn = md5("_"-joined cert sns of the root bundle).

function loadCert(p) {
  if (!p || !fs.existsSync(p)) return null;
  try {
    return new X509Certificate(fs.readFileSync(p));
  } catch {
    return null;
  }
}

function certSn(cert) {
  // Official AntCertificationUtil.getCertSN: md5(RFC2253 issuer + DECIMAL serial).
  // Java's X500Principal.getName() is RFC2253 (most-specific segment first, ","
  // separated); Node's .issuer lists segments in certificate order joined with
  // "\n" — reverse the segments and rejoin with commas to match byte-for-byte.
  const issuer = cert.issuer.split("\n").reverse().join(",");
  const input = `${issuer}${BigInt("0x" + cert.serialNumber)}`;
  return crypto.createHash("md5").update(input, "utf8").digest("hex");
}

function rootCertSn(bundlePem) {
  // Official AntCertificationUtil.getRootCertSN: keep certs whose SigAlgOID
  // starts with 1.2.840.113549.1.1 (any RSA variant — SHA1 AND SHA256),
  // join their cert SNs with "_" — no final md5.
  const RSA_OID_PREFIX = Buffer.from([0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d, 0x01, 0x01]);
  const chunks = bundlePem
    .split(/(?=-----BEGIN CERTIFICATE-----)/)
    .filter((c) => c.includes("BEGIN CERTIFICATE"));
  const sns = chunks
    .map((c) => new X509Certificate(c.trim()))
    .filter((cert) => cert.raw.includes(RSA_OID_PREFIX))
    .map((cert) => certSn(cert));
  return sns.join("_");
}

const appCert = loadCert(CONFIG.appCertPath);
const alipayCert = loadCert(CONFIG.alipayCertPath);
let rootSn = null;
try {
  rootSn = fs.existsSync(CONFIG.alipayRootCertPath)
    ? rootCertSn(fs.readFileSync(CONFIG.alipayRootCertPath, "utf8"))
    : null;
} catch {
  rootSn = null;
}
const certMode = Boolean(appCert && alipayCert && rootSn);
const notifyVerifyKey = certMode ? alipayCert.publicKey : alipayPublicKey;
const appCertSn = appCert ? certSn(appCert) : null;

const configured = Boolean(
  privateKey &&
    CONFIG.appId &&
    (certMode ? appCertSn && rootSn && notifyVerifyKey : alipayPublicKey)
);

// --- WeChat Pay Native (API v3, 公钥模式) ----------------------------------

function loadWxFiles() {
  const wx = CONFIG.wxpay || {};
  const read = (p) => (p && fs.existsSync(p) ? fs.readFileSync(p, "utf8") : null);
  return {
    mchid: wx.mchid || null,
    appId: wx.appId && wx.appId !== "PENDING" ? wx.appId : null,
    notifyUrl: wx.notifyUrl || null,
    certPath: wx.certPath || null,
    privateKey: read(wx.privateKeyPath),
    certSerial: null,
    apiV3Key: read(wx.apiV3KeyPath),
    publicKey: read(wx.publicKeyPath),
    publicKeyId: wx.publicKeyId || null,
    items: wx.items || CONFIG.items
  };
}

const wxpayRaw = loadWxFiles();
let wxCertSerial = null;
try {
  if (wxpayRaw.privateKey && wxpayRaw.certPath && fs.existsSync(wxpayRaw.certPath)) {
    wxCertSerial = new X509Certificate(fs.readFileSync(wxpayRaw.certPath)).serialNumber;
  }
} catch {}
const wxConfigured = Boolean(
  wxpayRaw.appId && wxpayRaw.mchid && wxpayRaw.privateKey && wxCertSerial && wxpayRaw.apiV3Key &&
    wxpayRaw.publicKey && wxpayRaw.notifyUrl
);
const wxEnabled = Boolean(wxConfigured && wxpayRaw.items);

// --- alipay helpers --------------------------------------------------------

function cstTime() {
  // Alipay expects Asia/Shanghai "yyyy-MM-dd HH:mm:ss"
  return new Date(Date.now() + 8 * 3600 * 1000).toISOString().replace("T", " ").slice(0, 19);
}

function signContent(params, exclude) {
  return Object.keys(params)
    .filter((k) => !exclude.includes(k) && params[k] !== undefined && params[k] !== "")
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
}

function buildPayRedirect(itemId, clientNo) {
  const item = CONFIG.items[itemId];
  const outTradeNo = clientNo ||
    "SYL" + Date.now().toString(36).toUpperCase() + crypto.randomBytes(3).toString("hex").toUpperCase();
  const record = {
    outTradeNo,
    itemId,
    amount: item.amount,
    subject: item.name,
    status: "created",
    createdAt: cstTime()
  };
  const returnUrl = `${CONFIG.returnUrl}?paid=1&no=${encodeURIComponent(outTradeNo)}`;
  const params = {
    app_id: CONFIG.appId,
    method: "alipay.trade.page.pay",
    format: "JSON",
    charset: "utf-8",
    sign_type: "RSA2",
    timestamp: cstTime(),
    version: "1.0",
    notify_url: CONFIG.notifyUrl,
    return_url: returnUrl,
    biz_content: JSON.stringify({
      out_trade_no: outTradeNo,
      product_code: "FAST_INSTANT_TRADE_PAY",
      total_amount: item.amount,
      subject: item.name
    })
  };
  if (certMode) {
    params.app_cert_sn = appCertSn;
    params.alipay_root_cert_sn = rootSn;
  }
  const sign = crypto
    .createSign("RSA-SHA256")
    .update(signContent(params, ["sign"]), "utf8")
    .sign(privateKey, "base64");
  const qs = Object.keys(params)
    .map((k) => `${k}=${encodeURIComponent(params[k])}`)
    .join("&");
  appendOrder(record);
  return {
    location: `${CONFIG.gateway}?${qs}&sign=${encodeURIComponent(sign)}`,
    outTradeNo
  };
}

function verifyNotify(params) {
  const content = signContent(params, ["sign", "sign_type"]);
  try {
    return crypto
      .createVerify("RSA-SHA256")
      .update(content, "utf8")
      .verify(notifyVerifyKey, params.sign, "base64");
  } catch {
    return false;
  }
}

function appendOrder(record) {
  fs.appendFileSync(ORDERS_FILE, JSON.stringify(record) + "\n");
}

function findOrder(outTradeNo) {
  if (!fs.existsSync(ORDERS_FILE)) return null;
  const lines = fs.readFileSync(ORDERS_FILE, "utf8").trim().split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const rec = JSON.parse(lines[i]);
      if (rec.outTradeNo === outTradeNo && rec.status) return rec;
    } catch {}
  }
  return null;
}

// --- http server -----------------------------------------------------------

function json(res, code, obj) {
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    // The checkout page on www.xplol.cn probes /pay/status cross-origin
    "Access-Control-Allow-Origin": "https://www.xplol.cn"
  });
  res.end(JSON.stringify(obj));
}

// --- WeChat Pay v3 helpers --------------------------------------------------

const WX_API = "https://api.mch.weixin.qq.com";

function wxAuthorization(method, urlPathWithQuery, bodyStr) {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const message = `${method}\n${urlPathWithQuery}\n${timestamp}\n${nonce}\n${bodyStr}\n`;
  const signature = crypto
    .createSign("RSA-SHA256")
    .update(message, "utf8")
    .sign(wxpayRaw.privateKey, "base64");
  return (
    `WECHATPAY2-SHA256-RSA2048 mchid="${wxpayRaw.mchid}",nonce_str="${nonce}",` +
    `signature="${signature}",timestamp="${timestamp}",serial_no="${wxCertSerial}"`
  );
}

async function wxApiCall(method, urlPathWithQuery, bodyObj) {
  const bodyStr = bodyObj ? JSON.stringify(bodyObj) : "";
  const res = await fetch(WX_API + urlPathWithQuery, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "User-Agent": "xplol-gateway",
      "Authorization": wxAuthorization(method, urlPathWithQuery, bodyStr)
    },
    body: bodyStr || undefined
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || data.code || `HTTP ${res.status}`);
    err.code = data.code;
    throw err;
  }
  return data;
}

async function wxCreateNativeOrder(itemId, outTradeNo) {
  const item = wxpayRaw.items[itemId];
  const total = Math.round(parseFloat(item.amount) * 100); // 单位: 分
  const data = await wxApiCall("POST", "/v3/pay/transactions/native", {
    appid: wxpayRaw.appId,
    mchid: wxpayRaw.mchid,
    description: item.name,
    out_trade_no: outTradeNo,
    notify_url: wxpayRaw.notifyUrl,
    amount: { total, currency: "CNY" }
  });
  return data.code_url;
}

async function wxQueryOrder(outTradeNo) {
  const path = `/v3/pay/transactions/out-trade-no/${encodeURIComponent(outTradeNo)}?mchid=${wxpayRaw.mchid}`;
  return wxApiCall("GET", path);
}

function wxDecryptResource(resource) {
  // APIv3: AES-256-GCM, key = apiv3key(32B), iv = resource.nonce,
  // AAD = resource.associated_data, auth tag = last 16 bytes of ciphertext
  const key = Buffer.from(wxpayRaw.apiV3Key, "utf8");
  const buf = Buffer.from(resource.ciphertext, "base64");
  const tag = buf.subarray(buf.length - 16);
  const data = buf.subarray(0, buf.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(resource.nonce, "utf8"));
  decipher.setAAD(Buffer.from(resource.associated_data || "", "utf8"));
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}

function wxVerifyNotify(headers, rawBody) {
  // 公钥模式: verify with the WeChat Pay public key (pub_key.pem)
  const message = `${headers["wechatpay-timestamp"]}\n${headers["wechatpay-nonce"]}\n${rawBody}\n`;
  try {
    return crypto
      .createVerify("RSA-SHA256")
      .update(message, "utf8")
      .verify(wxpayRaw.publicKey, headers["wechatpay-signature"], "base64");
  } catch {
    return false;
  }
}

function readBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data));
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost");

  if (url.pathname === "/healthz") {
    return json(res, 200, { ok: true, configured });
  }

  if (url.pathname === "/alipay/status") {
    return json(res, 200, {
      configured,
      mode: certMode ? "cert" : "public_key",
      appId: CONFIG.appId ? CONFIG.appId.slice(0, 6) + "***" : null
    });
  }

  if (url.pathname === "/alipay/pay" && req.method === "GET") {
    const itemId = url.searchParams.get("item") || "";
    if (!CONFIG.items[itemId]) return json(res, 404, { error: "unknown_item" });
    if (!configured) {
      return json(res, 503, { error: "not_configured", message: "支付通道配置中，请到店或电话联系门店" });
    }
    // Trust the checkout page's displayed order number so both match Alipay's
    // out_trade_no; fall back to a locally generated one when absent.
    const clientNo = url.searchParams.get("no") || "";
    const { location } = buildPayRedirect(itemId, /^[A-Z0-9]{8,32}$/.test(clientNo) ? clientNo : null);
    res.writeHead(302, { Location: location });
    return res.end();
  }

  if (url.pathname === "/alipay/notify" && req.method === "POST") {
    const body = await readBody(req);
    const params = {};
    for (const [k, v] of new URLSearchParams(body)) params[k] = v;
    const outTradeNo = params.out_trade_no || "";
    const tradeStatus = params.trade_status || "";
    const known = findOrder(outTradeNo);
    const amountOk = Boolean(known && params.total_amount && Number(params.total_amount) === Number(known.amount));
    const signedOk = verifyNotify(params);
    if (signedOk && known && amountOk && (tradeStatus === "TRADE_SUCCESS" || tradeStatus === "TRADE_FINISHED")) {
      appendOrder({ ...known, status: "paid", tradeNo: params.trade_no, buyerId: params.buyer_id, updatedAt: cstTime() });
      appendOrder({ outTradeNo, event: "notify", tradeStatus, tradeNo: params.trade_no, at: cstTime() });
      res.writeHead(200, { "Content-Type": "text/plain" });
      return res.end("success");
    }
    appendOrder({ outTradeNo, event: "notify_rejected", signedOk, known: Boolean(known), amountOk, tradeStatus, at: cstTime() });
    res.writeHead(200, { "Content-Type": "text/plain" });
    return res.end("fail");
  }

  // Unified status for the checkout page (alipay + wechat)
  if (url.pathname === "/pay/status") {
    return json(res, 200, {
      alipay: { configured, mode: certMode ? "cert" : "public_key" },
      wxpay: { configured: wxEnabled }
    });
  }

  // WeChat Native pay: create order, return code_url for the QR code
  if (url.pathname === "/wxpay/native" && req.method === "GET") {
    const itemId = url.searchParams.get("item") || "";
    if (!wxEnabled) return json(res, 503, { error: "not_configured", message: "微信支付配置中，请使用支付宝或到店支付" });
    if (!wxpayRaw.items[itemId]) return json(res, 404, { error: "unknown_item" });
    const clientNo = url.searchParams.get("no") || "";
    const outTradeNo = /^[A-Z0-9]{8,32}$/.test(clientNo)
      ? clientNo
      : "SYL" + Date.now().toString(36).toUpperCase() + crypto.randomBytes(3).toString("hex").toUpperCase();
    try {
      const codeUrl = await wxCreateNativeOrder(itemId, outTradeNo);
      appendOrder({
        outTradeNo,
        itemId,
        channel: "wxpay",
        amount: wxpayRaw.items[itemId].amount,
        subject: wxpayRaw.items[itemId].name,
        status: "created",
        createdAt: cstTime()
      });
      return json(res, 200, { codeUrl, outTradeNo });
    } catch (e) {
      appendOrder({ outTradeNo, itemId, event: "wxpay_create_failed", error: String(e.message || e), at: cstTime() });
      return json(res, 502, { error: "create_failed", message: String(e.message || e) });
    }
  }

  // WeChat Native pay: poll order state (called by the checkout page)
  if (url.pathname === "/wxpay/query" && req.method === "GET") {
    const no = url.searchParams.get("no") || "";
    if (!wxEnabled) return json(res, 503, { error: "not_configured" });
    try {
      const data = await wxQueryOrder(no);
      return json(res, 200, { tradeState: data.trade_state || "UNKNOWN", transactionId: data.transaction_id || null });
    } catch {
      // ORDER_NOT_EXIST before first scan is normal
      return json(res, 200, { tradeState: "NOTPAY" });
    }
  }

  // WeChat Native pay: async payment notification
  if (url.pathname === "/wxpay/notify" && req.method === "POST") {
    const rawBody = await readBody(req);
    const headers = Object.fromEntries(Object.entries(req.headers).map(([k, v]) => [k.toLowerCase(), String(v)]));
    const signedOk = wxVerifyNotify(headers, rawBody);
    if (!signedOk) {
      appendOrder({ event: "wxpay_notify_bad_signature", at: cstTime() });
      res.writeHead(500, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ code: "FAIL", message: "验签失败" }));
    }
    try {
      const payload = JSON.parse(rawBody);
      const decrypted = JSON.parse(wxDecryptResource(payload.resource));
      const outTradeNo = decrypted.out_trade_no || "";
      const tradeState = decrypted.trade_state || "";
      const order = findOrder(outTradeNo);
      const amountOk = Boolean(
        order && decrypted.amount && Number(decrypted.amount.total) === Math.round(Number(order.amount) * 100)
      );
      if (order && amountOk && (tradeState === "SUCCESS" || tradeState === "TRADE_SUCCESS")) {
        appendOrder({
          ...order,
          status: "paid",
          channel: "wxpay",
          transactionId: decrypted.transaction_id || null,
          payerId: decrypted.payer ? decrypted.payer.openid : null,
          updatedAt: cstTime()
        });
        appendOrder({ outTradeNo, event: "wxpay_notify", tradeState, at: cstTime() });
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ code: "SUCCESS", message: "成功" }));
      }
      appendOrder({ outTradeNo, event: "wxpay_notify_rejected", known: Boolean(order), amountOk, tradeState, at: cstTime() });
    } catch (e) {
      appendOrder({ event: "wxpay_notify_decrypt_failed", error: String(e.message || e), at: cstTime() });
    }
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ code: "FAIL", message: "失败" }));
  }

  if (url.pathname === "/alipay/return" && req.method === "GET") {
    const no = url.searchParams.get("out_trade_no") || "";
    res.writeHead(302, { Location: `${CONFIG.siteOrigin}/pay?paid=1&no=${encodeURIComponent(no)}` });
    return res.end();
  }

  json(res, 404, { error: "not_found" });
});

server.listen(CONFIG.port, "127.0.0.1", () => {
  console.log(
    `[alipay-gateway] listening on 127.0.0.1:${CONFIG.port}, configured=${configured}, mode=${certMode ? "cert" : "public_key"}`
  );
});
