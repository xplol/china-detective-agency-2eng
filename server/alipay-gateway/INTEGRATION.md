# 支付网关对接文档（pay.xplol.cn）

pay.xplol.cn 网关不仅服务官网自身（/pricing 价目表），也对**任何合作站点**开放统一收款接口。
当前接入方：www.xplol.cn（官网自身）、baseview.xp812.cn。

通道：支付宝电脑网站支付（alipay.trade.page.pay）+ 微信支付 Native（v3）。
商户主体：金牛区三和益联电脑经营部。结算资金进入对应商户账户。

## 通用约定

- 网关地址：`https://pay.xplol.cn`
- 签名密钥：HMAC-SHA256 共享密钥（存放于 /Users/xp/key/pay-gateway-hmac-secret-sanheyilian-20261031.txt，服务器 keys/gateway-secret.txt），**只放后端，绝不进前端**
- 签名算法：`HMAC-SHA256(secret, message)` 输出 hex 小写
- 浏览器跨域：来源需在网关 `config.json` 的 `allowedOrigins` 白名单内（现含 https://baseview.xp812.cn）

## 1. 创建支付（POST /order/create）

```http
POST https://pay.xplol.cn/order/create
Content-Type: application/json
```

```json
{
  "channel": "wechat",           // alipay | wechat
  "no": "BV20261031001",         // 贵方订单号，6-40位字母数字_-，全局唯一
  "title": "BaseView 专业版授权", // 商品名，1-50字
  "amount": "98.00",             // 金额（元），字符串，0.01-10000
  "sign": "<HMAC hex>",
  "returnUrl": "https://baseview.xp812.cn/pay/result" // 可选，仅支付宝跳回用
}
```

签名：`sign = HMAC_SHA256(secret, no + "|" + amount + "|" + title)`，hex 小写。

**响应：**

- channel=alipay → `{"outTradeNo":"...","payUrl":"https://openapi.alipay.com/gateway.do?..."}`，
  302 跳转 payUrl 即进入支付宝收银台（建议直接 `Location = payUrl`）
- channel=wechat → `{"outTradeNo":"...","codeUrl":"weixin://wxpay/bizpayurl?pr=..."}`，
  前端把 codeUrl 渲染成二维码让用户微信扫码

## 2. 查询支付结果（GET /order/status）

```http
GET https://pay.xplol.cn/order/status?no=BV20261031001&sign=<HMAC hex>
```

签名：`sign = HMAC_SHA256(secret, no)`。

响应：`{"known":true,"paid":false,"status":"created","channel":"wechat","amount":"98.00"}`
- `paid:true` 表示已收到支付宝/微信的成功回调（网关已验签 + 核对金额）
- 建议前端扫码后每 2.5 秒轮询一次，支付成功停止

## 3. 服务端异步回调（自动）

- 支付宝回调：`https://pay.xplol.cn/alipay/notify`
- 微信回调：`https://pay.xplol.cn/wxpay/notify`
- 网关验签 + 核对金额后按 out_trade_no 记账（服务器 /opt/alipay-gateway/data/orders.jsonl）。
  贵方站点通过 /order/status 轮询即可获知 paid 状态，无需直接收回调。

## 4. 价目表商品（官网 /pricing 专用）

`GET /alipay/pay?item=p1&no=xxx`（价目表 id：p1-p3 套餐、s1-s8 服务）走固定价目，
外部站点请统一用上面的 /order/create 自定义金额模式。

## 5. 改价格

- 官网价目：`client/src/contexts/LanguageContext.tsx` 的 `pricing.*` 键
- 网关校验价目：服务器 `/opt/alipay-gateway/config.json` 的 `items`（两处需同步修改后重启网关）

## 6. 注意事项

- 支付宝下单金额即实际收款金额；微信下单金额以「分」为单位由网关换算
- 同一 `no` 重复创建会复用该单号（微信侧同一单号重复下单会报错，请保证贵方订单号唯一）
- 未支付订单由微信/支付宝 2 小时左右自动过期，不影响后续新单
- 有疑问先看服务器 `journalctl -u alipay-gateway` 与 orders.jsonl 中的 event 记录
