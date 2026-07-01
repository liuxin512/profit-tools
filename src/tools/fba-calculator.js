// Amazon FBA Calculator

function calculateFBA() {
  const price = parseFloat(document.getElementById('fba-price').value) || 0;
  const weight = parseFloat(document.getElementById('fba-weight').value) || 0;
  const maxDim = parseFloat(document.getElementById('fba-size').value) || 0;
  const cost = parseFloat(document.getElementById('fba-cost').value) || 0;
  const inboundShipping = parseFloat(document.getElementById('fba-inbound').value) || 0;

  if (!price || !weight) {
    alert('请填写售价和商品重量');
    return;
  }

  // Referral fee: 15% for most categories, min $0.30
  const referralRate = 0.15;
  const referralFee = Math.max(price * referralRate, 0.30);

  // FBA fulfillment fee (approximate US rates)
  let fulfillmentFee;
  if (weight <= 0.25) {
    fulfillmentFee = maxDim <= 6 ? 3.22 : 3.86;
  } else if (weight <= 0.5) {
    fulfillmentFee = maxDim <= 6 ? 3.40 : 4.08;
  } else if (weight <= 1) {
    fulfillmentFee = maxDim <= 6 ? 3.68 : 4.65;
  } else if (weight <= 2) {
    fulfillmentFee = maxDim <= 12 ? 5.01 : 5.90;
  } else if (weight <= 3) {
    fulfillmentFee = maxDim <= 18 ? 6.69 : 7.55;
  } else {
    // Large/heavy items
    fulfillmentFee = 8.26 + (weight - 3) * 0.38;
    if (maxDim > 18) fulfillmentFee += 2.00;
  }

  // Monthly storage fee (approximate, per cubic foot)
  const cubicFoot = (maxDim / 12) * (maxDim / 12) * (maxDim / 12) || 0.01;
  const monthlyStorage = Math.max(cubicFoot * 0.87, 0.01);

  const totalFees = referralFee + fulfillmentFee + monthlyStorage;
  const totalCost = cost + inboundShipping + totalFees;
  const netProfit = price - totalCost;
  const margin = (netProfit / price) * 100;

  showResult('fba-result');
  document.getElementById('fba-referral').textContent = formatCurrency(referralFee);
  document.getElementById('fba-fulfillment').textContent = formatCurrency(fulfillmentFee);
  document.getElementById('fba-storage').textContent = formatCurrency(monthlyStorage);
  document.getElementById('fba-total').textContent = formatCurrency(totalFees);
  document.getElementById('fba-net').textContent = formatCurrency(netProfit);
  document.getElementById('fba-margin').textContent = formatPercent(margin);

  const verdictEl = document.getElementById('fba-verdict');
  let msg = getVerdictMessage(margin);
  if (margin >= 20) {
    msg = '✅ FBA 利润可观！但要关注长期仓储费（超过365天会加收）。' + msg;
  }
  verdictEl.textContent = msg;
  verdictEl.className = 'result-verdict ' + getVerdictClass(margin);

  trackEvent('calculate', 'fba');
  saveToHistory('fba', { price, weight, maxDim, cost, netProfit, margin });
}
