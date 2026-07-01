// Break-even Calculator

function calculateBreakEven() {
  const fixedCost = parseFloat(document.getElementById('be-fixed').value) || 0;
  const variableCost = parseFloat(document.getElementById('be-variable').value) || 0;
  const price = parseFloat(document.getElementById('be-price').value) || 0;

  if (!fixedCost || !price) {
    alert('请填写固定成本、变动成本和售价');
    return;
  }

  if (price <= variableCost) {
    alert('售价必须大于变动成本，否则永远无法盈利！');
    return;
  }

  const contributionMargin = price - variableCost;
  const breakEvenUnits = Math.ceil(fixedCost / contributionMargin);
  const breakEvenRevenue = breakEvenUnits * price;

  // Daily targets
  const dailyUnits = (breakEvenUnits / 30).toFixed(1);
  const dailyRevenue = (breakEvenRevenue / 30).toFixed(2);

  showResult('breakeven-result');
  document.getElementById('be-contribution').textContent = formatCurrency(contributionMargin);
  document.getElementById('be-units').textContent = breakEvenUnits + ' 件/月';
  document.getElementById('be-revenue').textContent = formatCurrency(breakEvenRevenue);

  const verdictEl = document.getElementById('be-verdict');

  let msg = '';
  if (breakEvenUnits <= 10) {
    msg = `✅ 非常容易！每月只需卖出 ${breakEvenUnits} 件即可回本。每天约 ${dailyUnits} 件。`;
  } else if (breakEvenUnits <= 50) {
    msg = `⚠️ 有一定挑战。每月需卖出 ${breakEvenUnits} 件（每天约 ${dailyUnits} 件），销售额达 ${formatCurrency(breakEvenRevenue)}。`;
  } else if (breakEvenUnits <= 200) {
    msg = `🔴 压力较大。每月需卖出 ${breakEvenUnits} 件才能回本。考虑降低成本或提高售价。`;
  } else {
    msg = `🚨 困难模式！月销 ${breakEvenUnits} 件才能打平。强烈建议优化成本结构。`;
  }

  msg += `\n每日目标：卖出 ${dailyUnits} 件，收入 ${formatCurrency(Number(dailyRevenue))}。`;
  verdictEl.textContent = msg;

  if (breakEvenUnits <= 10) verdictEl.className = 'result-verdict verdict-good';
  else if (breakEvenUnits <= 50) verdictEl.className = 'result-verdict verdict-warn';
  else verdictEl.className = 'result-verdict verdict-bad';

  trackEvent('calculate', 'breakeven');
  saveToHistory('breakeven', { fixedCost, variableCost, price, breakEvenUnits, breakEvenRevenue });
}
