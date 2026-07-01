// eBay Fee Calculator

function calculateEBay() {
  const site = document.getElementById('ebay-site').value;
  const price = parseFloat(document.getElementById('ebay-price').value) || 0;
  const shippingIncome = parseFloat(document.getElementById('ebay-shipping').value) || 0;
  const cost = parseFloat(document.getElementById('ebay-cost').value) || 0;
  const actualShipping = parseFloat(document.getElementById('ebay-actual-shipping').value) || 0;
  const storeType = document.getElementById('ebay-store').value;
  const category = document.getElementById('ebay-category').value;

  if (!price) {
    alert('请输入商品售价');
    return;
  }

  // Fee rates by site and category
  const feeRates = {
    us: { most: 0.1325, books: 0.1495, musical: 0.08, parts: 0.0855, jewelry: 0.15, clothing: 0.1235, electronics: 0.08 },
    uk: { most: 0.1323, books: 0.1495, musical: 0.08, parts: 0.0855, jewelry: 0.15, clothing: 0.1235, electronics: 0.08 },
    de: { most: 0.1255, books: 0.12, musical: 0.08, parts: 0.0855, jewelry: 0.15, clothing: 0.1235, electronics: 0.08 },
    au: { most: 0.1395, books: 0.1495, musical: 0.08, parts: 0.0855, jewelry: 0.15, clothing: 0.1235, electronics: 0.08 },
  };

  // Payment processing fee
  const paymentRates = { us: 0.029, uk: 0.025, de: 0.019, au: 0.025 };
  const paymentFixed = { us: 0.30, uk: 0.30, de: 0.35, au: 0.30 };

  // Store subscription monthly (approximate daily)
  const storeCosts = {
    none: 0,
    starter: 4.95, basic: 21.95, premium: 59.95, anchor: 299.95
  };

  const fvfRate = feeRates[site]?.[category] || feeRates.us.most;
  const paymentRate = paymentRates[site] || 0.029;
  const paymentFix = paymentFixed[site] || 0.30;

  const totalTransaction = price + shippingIncome;

  // Fees
  const fvf = totalTransaction * fvfRate;
  const insertionFee = 0; // First 250 listings free per month
  const paymentFee = (totalTransaction * paymentRate) + paymentFix;
  const storeMonthly = storeCosts[storeType] || 0;
  const storePerItem = storeMonthly / 30; // rough daily allocation
  const promoRate = 0.02; // Promoted listing standard rate
  const promoFee = totalTransaction * promoRate;

  // Total
  const totalFees = fvf + insertionFee + paymentFee + storePerItem + promoFee;
  const totalCost = cost + actualShipping + totalFees;
  const netProfit = totalTransaction - totalCost;
  const margin = (netProfit / totalTransaction) * 100;

  // Update UI
  showResult('ebay-result');
  document.getElementById('fee-fvf').textContent = formatCurrency(fvf);
  document.getElementById('fee-insertion').textContent = formatCurrency(insertionFee);
  document.getElementById('fee-payment').textContent = formatCurrency(paymentFee);
  document.getElementById('fee-store').textContent = formatCurrency(storePerItem);
  document.getElementById('fee-promo').textContent = formatCurrency(promoFee);
  document.getElementById('fee-total').textContent = formatCurrency(totalFees);
  document.getElementById('fee-net').textContent = formatCurrency(netProfit);
  document.getElementById('fee-margin').textContent = formatPercent(margin);

  const verdictEl = document.getElementById('ebay-verdict');
  verdictEl.textContent = getVerdictMessage(margin);
  verdictEl.className = 'result-verdict ' + getVerdictClass(margin);

  trackEvent('calculate', 'ebay');
  saveToHistory('ebay', { site, price, cost, netProfit, margin });
}
