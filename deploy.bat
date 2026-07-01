@echo off
chcp 65001 >nul
title ProfitTools 一键部署系统

echo.
echo ╔══════════════════════════════════════════╗
echo ║   🚀 ProfitTools 一键部署系统           ║
echo ║   跨境电商赚钱工具箱 v1.0               ║
echo ╚══════════════════════════════════════════╝
echo.

:: ============================================
:: Step 1: 部署 Web 工具箱到公网
:: ============================================
echo [1/5] 🌐 部署 Web 工具箱到公网...
echo.
echo 选择部署平台:
echo   [V] Vercel (推荐 - 全球CDN加速，免费)
echo   [N] Netlify (备选 - 同样免费)
echo   [S] Surge  (最简单 - 一行命令)
echo   [H] 仅本地运行
echo.
set /p DEPLOY="请选择 [V/N/S/H]: "

if /i "%DEPLOY%"=="V" (
    echo.
    echo 📦 安装 Vercel CLI...
    call npm install -g vercel
    echo.
    echo 🔑 请在弹出的浏览器中登录 Vercel...
    echo     (如果没有账号，用 GitHub 一键注册，免费)
    call npx vercel login
    echo.
    echo 🚀 开始部署...
    call npm run deploy
    echo.
    echo ✅ Vercel 部署完成！访问 Vercel 后台查看域名。
)

if /i "%DEPLOY%"=="N" (
    echo.
    echo 📦 安装 Netlify CLI...
    call npm install -g netlify-cli
    echo.
    echo 🔑 请在弹出的浏览器中登录 Netlify...
    call npx netlify login
    echo.
    echo 🚀 开始部署...
    call npx netlify deploy --prod --dir=public
    echo.
    echo ✅ Netlify 部署完成！
)

if /i "%DEPLOY%"=="S" (
    echo.
    echo 📦 使用 Surge 部署...
    echo.
    echo 🔑 首次使用需要注册 (输入邮箱+密码)
    call npx surge ./dist
    echo.
    echo ✅ Surge 部署完成！
)

if /i "%DEPLOY%"=="H" (
    echo 📍 仅本地运行: http://localhost:3000
    start node server.js
)

echo.
echo ═══════════════════════════════════════════
echo.

:: ============================================
:: Step 2: GitHub 仓库
:: ============================================
echo [2/5] 📂 创建 GitHub 仓库...
echo.
echo 你的 SSH 公钥已生成:
echo.
type %USERPROFILE%\.ssh\id_ed25519.pub
echo.
echo 👆 复制上面这行公钥
echo.
echo 📋 操作步骤:
echo    1. 打开 https://github.com/settings/keys
echo    2. 点击 "New SSH Key"
echo    3. 粘贴公钥 → 保存
echo.
echo ⏳ 等待你完成 SSH 密钥添加...
pause
echo.
echo 🚀 推送代码到 GitHub...
echo.
echo 请输入你的 GitHub 用户名:
set /p GH_USER="GitHub 用户名: "
echo.
echo 正在创建仓库并推送...
gh repo create profit-tools --public --source=. --remote=origin --push 2>nul
if errorlevel 1 (
    echo ⚠️ gh CLI 未配置，尝试手动推送...
    git remote add origin git@github.com:%GH_USER%/profit-tools.git 2>nul
    git push -u origin master 2>nul
    if errorlevel 1 (
        echo.
        echo ❌ 自动推送失败。请手动操作:
        echo    1. 在 GitHub 创建新仓库: profit-tools
        echo    2. 运行: git remote add origin git@github.com:%GH_USER%/profit-tools.git
        echo    3. 运行: git push -u origin master
    ) else (
        echo ✅ 推送成功！
    )
) else (
    echo ✅ GitHub 仓库创建并推送成功！
)

echo.
echo ═══════════════════════════════════════════
echo.

:: ============================================
:: Step 3: 注册变现平台
:: ============================================
echo [3/5] 💰 注册变现平台...
echo.
echo 即将打开以下注册页面，请逐个注册:
echo.
echo   📢 Google AdSense → https://adsense.google.com
echo   🔗 eBay Partner Network → https://partnernetwork.ebay.com
echo   📦 Gumroad (卖数字产品) → https://gumroad.com
echo   🧩 Chrome Web Store → https://chrome.google.com/webstore/devconsole
echo.
echo ⏳ 按任意键逐个打开注册页面...
pause >nul
start https://adsense.google.com
echo ✅ 已打开: Google AdSense
timeout /t 3 >nul
start https://partnernetwork.ebay.com
echo ✅ 已打开: eBay Partner Network
timeout /t 3 >nul
start https://gumroad.com
echo ✅ 已打开: Gumroad
timeout /t 3 >nul
start https://chrome.google.com/webstore/devconsole
echo ✅ 已打开: Chrome Web Store

echo.
echo ═══════════════════════════════════════════
echo.

:: ============================================
:: Step 4: 上架数字产品
:: ============================================
echo [4/5] 📦 上架数字产品...
echo.
echo 📁 数字产品包已打包:
echo    dist\eBay跨境工具包.zip  (包含 8 个文件)
echo.
echo 📋 在 Gumroad 上架步骤:
echo    1. 打开 https://gumroad.com
echo    2. 创建新产品
echo    3. 标题: eBay跨境电商全套工具包
echo    4. 定价: $19 (原价 $97)
echo    5. 上传: dist\eBay跨境工具包.zip
echo    6. 描述页: 参考 digital-products\landing-page.html
echo.
echo ⏳ 完成后按任意键继续...
pause >nul

echo.
echo ═══════════════════════════════════════════
echo.

:: ============================================
:: Step 5: 发布 Chrome 扩展
:: ============================================
echo [5/5] 🧩 发布 Chrome 扩展...
echo.
echo 📦 Chrome 扩展已打包:
echo    dist\chrome-extension.zip
echo.
echo 📋 发布步骤:
echo    1. 打开 https://chrome.google.com/webstore/devconsole
echo    2. 支付一次性开发者注册费 ($5)
echo    3. 上传 dist\chrome-extension.zip
echo    4. 设置定价: 免费 (引流) 或 $4.99 (直接变现)
echo    5. 提交审核 (通常1-3天)
echo.
echo ⏳ 完成后按任意键继续...
pause >nul

echo.
echo ═══════════════════════════════════════════
echo.
echo ╔══════════════════════════════════════════╗
echo ║  🎉 部署全部完成！                     ║
echo ║                                        ║
echo ║  📊 收入仪表盘:                        ║
echo ║     automation\income-tracker.html     ║
echo ║                                        ║
echo ║  💡 下一步:                            ║
echo ║  1. 用 AdSense 代码替换广告位          ║
echo ║  2. 用 eBay 联盟链接替换推荐链接       ║
echo ║  3. 每周发布一篇 SEO 文章              ║
echo ║  4. 在社交媒体推广你的工具             ║
echo ║                                        ║
echo ║  📅 一个月后打开收入仪表盘看结果       ║
echo ╚══════════════════════════════════════════╝

pause
