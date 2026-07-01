# 🚀 ProfitTools — 跨境电商赚钱工具箱

## 📦 包含产品

| 产品 | 路径 | 变现方式 | 状态 |
|------|------|----------|------|
| **Web工具箱** | `public/` | 广告 + 联盟 + Pro订阅 | ✅ 完成 |
| **Chrome扩展** | `chrome-extension/` | Chrome商店付费 + 导流 | ✅ 完成 |
| **数字产品页** | `digital-products/` | Gumroad/Etsy售卖 | ✅ 完成 |
| **SEO博客** | `seo-blog/` | Google AdSense广告 | ✅ 完成 |

## ⚡ 快速部署

### 方式1: Vercel (推荐 — 免费)
```bash
npm i -g vercel
vercel login
cd profit-tools
npm run deploy
```

### 方式2: Netlify (免费)
```bash
npm i -g netlify-cli
netlify login
netlify deploy --prod --dir=public
```

### 方式3: GitHub Pages (免费)
```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/YOUR_USER/profit-tools.git
git push -u origin main
# Settings → Pages → Source: main branch, /public folder
```

### 方式4: 本地运行
```bash
npm run dev
# 打开 http://localhost:3000
```

## 💰 变现渠道设置

1. **Google AdSense** — 替换 `public/index.html` 和 `seo-blog/index.html` 中的 `ca-pub-XXXXXXXXXXXXXXX`
2. **eBay Partner Network** — 注册 https://partnernetwork.ebay.com，替换联盟链接
3. **Gumroad 数字产品** — 在 gumroad.com 创建产品，更新 `digital-products/landing-page.html` 中的链接
4. **Chrome Web Store** — 在 Chrome 开发者后台发布扩展，定价 $4.99/一次性

## 📊 预估收入

| 渠道 | 保守估计/月 | 乐观估计/月 |
|------|-------------|-------------|
| AdSense 广告 | $50-200 | $500-2,000 |
| eBay 联盟佣金 | $30-100 | $300-1,000 |
| 数字产品售卖 | $50-200 | $500-2,000 |
| Chrome 扩展 | $30-100 | $300-1,000 |
| Pro 订阅 | $0-100 | $500-3,000 |
| **合计** | **$160-700/月** | **$2,100-9,000/月** |

## 🗂 项目结构

```
profit-tools/
├── public/                 # Web工具箱主页
│   └── index.html         # 5合1计算器
├── src/
│   ├── css/style.css      # 全局样式
│   ├── js/main.js         # 主逻辑
│   └── tools/             # 5个计算器模块
├── chrome-extension/       # Chrome扩展
│   ├── manifest.json
│   ├── popup.html/js      # 弹窗计算器
│   ├── content.js/css     # 页面注入
│   └── icons/             # 扩展图标
├── digital-products/       # 数字产品落地页
│   └── landing-page.html
├── seo-blog/              # SEO博客
│   └── index.html
├── server.js              # 本地开发服务器
├── build.js               # 构建脚本
└── vercel.json            # Vercel配置
```

## 🔧 下一步待办

- [ ] 注册 Vercel 账号并部署: `npx vercel login && npm run deploy`
- [ ] 注册 Google AdSense 并替换广告代码
- [ ] 注册 eBay Partner Network 并替换联盟链接
- [ ] 在 Gumroad 创建数字产品列表
- [ ] 在 Chrome Web Store 提交扩展审核
- [ ] 设置 Google Analytics 追踪
- [ ] 持续发布 SEO 博客文章
