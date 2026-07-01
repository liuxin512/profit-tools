#!/bin/bash
# ProfitTools 一键启动脚本
# 运行这个脚本来初始化所有赚钱系统

echo "========================================="
echo "  🚀 ProfitTools 赚钱系统初始化"
echo "========================================="
echo ""

# 1. 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js $(node --version)"

# 2. 安装依赖
echo ""
echo "📦 安装依赖..."
cd "$(dirname "$0")/.."
npm install --silent 2>/dev/null

# 3. 生成 SEO 内容
echo ""
echo "📝 生成 SEO 博客文章..."
node automation/content-generator.js

# 4. 启动本地服务器
echo ""
echo "🌐 启动开发服务器..."
echo "   本地访问: http://localhost:3000"
echo "   按 Ctrl+C 停止"
echo ""
node server.js
