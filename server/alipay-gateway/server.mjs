// 支付宝电脑网站支付网关 - 三和益联电脑经营部 (pay.xplol.cn)
// Pure Node (no npm deps): signs alipay.trade.page.pay requests with RSA2,
// verifies async notifications, and records orders to a JSONL file.
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
const configured = Boolean(privateKey && alipayPublicKey && CONFIG.appId);

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
      .verify(alipayPublicKey, params.sign, "base64");
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
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
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
    return json(res, 200, { configured, appId: CONFIG.appId ? CONFIG.appId.slice(0, 6) + "***" : null });
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

  if (url.pathname === "/alipay/return" && req.method === "GET") {
    const no = url.searchParams.get("out_trade_no") || "";
    res.writeHead(302, { Location: `${CONFIG.siteOrigin}/pay?paid=1&no=${encodeURIComponent(no)}` });
    return res.end();
  }

  json(res, 404, { error: "not_found" });
});

server.listen(CONFIG.port, "127.0.0.1", () => {
  console.log(`[alipay-gateway] listening on 127.0.0.1:${CONFIG.port}, configured=${configured}`);
});
