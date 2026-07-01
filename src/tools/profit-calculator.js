// Profit Analyzer

function calculateProfit() {
  const platform = document.getElementById('profit-platform').value;
  const price = parseFloat(document.getElementById('profit-price').value) || 0;
  const cost = parseFloat(document.getElementById('profit-cost').value) || 0;
  const shipping = parseFloat(document.getElementById('profit-shipping').value) || 0;
  const feeRate = parseFloat(document.getElementById('profit-fee-rate').value) || 15;
  const adCost = parseFloat(document.getElementById('profit-ad').value) || 0;
  const otherCost = parseFloat(document.getElementById('profit-other').value) || 0;
  const monthlySales = parseInt(document.getElementById('profit-monthly').value) || 30;

  if (!price) {
    alert('请输入售价');
    return;
  }

  if (!cost) {
    alert('请输入商品成本');
    return;
  }

  const platformFee = price * (feeRate / 100);
  const totalCostPerUnit = cost + shipping + platformFee + adCost + otherCost;
  const grossProfit = price - cost;
  const netProfit = price - totalCostPerUnit;
  const grossMargin = (grossProfit / price) * 100;
  const netMargin = (netProfit / price) * 100;
  const monthlyProfit = netProfit * monthlySales;
  const yearlyProfit = monthlyProfit * 12;
  const roi = (netProfit / totalCostPerUnit) * 100;

  showResult('profit-result');
  document.getElementById('res-gross').textContent = formatCurrency(grossProfit);
  document.getElementById('res-net').textContent = formatCurrency(netProfit);
  document.getElementById('res-gross-margin').textContent = formatPercent(grossMargin);
  document.getElementById('res-net-margin').textContent = formatPercent(netMargin);
  document.getElementById('res-monthly').textContent = formatCurrency(monthlyProfit);
  document.getElementById('res-yearly').textContent = formatCurrency(yearlyProfit);
  document.getElementById('res-roi').textContent = formatPercent(roi);

  const verdictEl = document.getElementById('profit-verdict');
  verdictEl.textContent = getVerdictMessage(netMargin);

  if (yearlyProfit > 10000) {
    verdictEl.textContent = '🚀 超级产品！年化利润超 $10,000，建议加大投入。' + getVerdictMessage(netMargin);
  }
  verdictEl.className = 'result-verdict ' + getVerdictClass(netMargin);

  trackEvent('calculate', 'profit');
  saveToHistory('profit', { platform, price, cost, netProfit, netMargin, yearlyProfit });
}
