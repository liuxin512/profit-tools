// Product Comparison Tool

function compareProducts() {
  const products = [];

  ['a', 'b', 'c'].forEach(letter => {
    const name = document.getElementById(`comp-${letter}-name`).value || `产品 ${letter.toUpperCase()}`;
    const cost = parseFloat(document.getElementById(`comp-${letter}-cost`).value) || 0;
    const price = parseFloat(document.getElementById(`comp-${letter}-price`).value) || 0;
    const feeRate = parseFloat(document.getElementById(`comp-${letter}-fee`).value) || 15;
    const volume = parseInt(document.getElementById(`comp-${letter}-volume`).value) || 0;

    if (cost && price) {
      const fee = price * (feeRate / 100);
      const netProfit = price - cost - fee;
      const margin = (netProfit / price) * 100;
      const monthlyProfit = netProfit * volume;
      const yearlyProfit = monthlyProfit * 12;

      products.push({
        name,
        cost,
        price,
        fee,
        netProfit,
        margin,
        volume,
        monthlyProfit,
        yearlyProfit
      });
    }
  });

  if (products.length < 2) {
    alert('请至少填写 2 个产品的成本、售价和预估月销量');
    return;
  }

  // Sort by yearly profit
  products.sort((a, b) => b.yearlyProfit - a.yearlyProfit);

  showResult('compare-result');
  const output = document.getElementById('compare-output');

  const medals = ['🥇', '🥈', '🥉'];
  let html = '';

  products.forEach((p, i) => {
    const isWinner = i === 0;
    const rankClass = isWinner ? 'compare-rank winner' : 'compare-rank';

    html += `
      <div class="${rankClass}">
        <div class="rank-badge">${medals[i] || '#' + (i+1)}</div>
        <div>
          <strong style="font-size:1.1rem">${p.name}</strong>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-top:8px;">
            <span style="color:#64748b;font-size:0.8rem">售价: ${formatCurrency(p.price)}</span>
            <span style="color:#64748b;font-size:0.8rem">成本: ${formatCurrency(p.cost)}</span>
            <span style="color:#64748b;font-size:0.8rem">单件净利: ${formatCurrency(p.netProfit)}</span>
            <span style="color:#64748b;font-size:0.8rem">利润率: ${formatPercent(p.margin)}</span>
            <span style="color:#10b981;font-weight:600;">月利润: ${formatCurrency(p.monthlyProfit)}</span>
            <span style="color:#2563eb;font-weight:600;">年利润: ${formatCurrency(p.yearlyProfit)}</span>
          </div>
          ${isWinner ? '<div style="margin-top:8px;background:#ecfdf5;padding:8px 12px;border-radius:6px;color:#065f46;font-weight:600;">🏆 最佳选择！年化利润最高，优先投入资源</div>' : ''}
        </div>
      </div>
    `;
  });

  // Add summary
  if (products.length >= 2) {
    const gap = products[0].yearlyProfit - products[1].yearlyProfit;
    html += `
      <div style="padding:16px;background:#f8fafc;border-radius:8px;margin-top:12px;">
        <strong>📊 分析总结</strong>
        <p style="margin-top:8px;color:#64748b;">
          ${products[0].name} 比 ${products[1].name} 每年多赚 <strong style="color:#10b981;">${formatCurrency(gap)}</strong>。
          建议优先投入资源到 ${products[0].name}，预计月净利润 <strong style="color:#10b981;">${formatCurrency(products[0].monthlyProfit)}</strong>。
        </p>
      </div>
    `;
  }

  output.innerHTML = html;

  trackEvent('calculate', 'compare');
}
