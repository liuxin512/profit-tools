// Popup logic for Chrome Extension

document.getElementById('pop-calculate').addEventListener('click', () => {
  const price = parseFloat(document.getElementById('pop-price').value) || 0;
  const cost = parseFloat(document.getElementById('pop-cost').value) || 0;
  const shipping = parseFloat(document.getElementById('pop-shipping').value) || 0;

  if (!price || !cost) {
    showPopupResult('pop-result', '请输入售价和成本', 'verdict-warn');
    return;
  }

  // eBay fee calc (US site)
  const fvfRate = 0.1325;
  const paymentRate = 0.029;
  const paymentFixed = 0.30;

  const fvf = price * fvfRate;
  const paymentFee = price * paymentRate + paymentFixed;
  const totalFees = fvf + paymentFee;
  const totalCost = cost + shipping + totalFees;
  const netProfit = price - totalCost;
  const margin = (netProfit / price) * 100;

  let verdictClass, verdictText;
  if (margin >= 25) {
    verdictClass = 'verdict-good';
    verdictText = '✅ 利润健康！值得做';
  } else if (margin >= 10) {
    verdictClass = 'verdict-warn';
    verdictText = '⚠️ 利润一般，谨慎选品';
  } else {
    verdictClass = 'verdict-bad';
    verdictText = '🔴 利润太低，不建议';
  }

  const resultEl = document.getElementById('pop-result');
  resultEl.style.display = 'block';
  resultEl.innerHTML = `
    <div class="result-row"><span>eBay 成交费:</span><span>$${fvf.toFixed(2)}</span></div>
    <div class="result-row"><span>支付处理费:</span><span>$${paymentFee.toFixed(2)}</span></div>
    <div class="result-row"><span>总费用:</span><span>$${totalFees.toFixed(2)}</span></div>
    <div class="result-row ${netProfit >= 0 ? 'profit' : 'loss'}">
      <span>💰 净利润:</span><span>$${netProfit.toFixed(2)}</span>
    </div>
    <div class="result-row"><span>净利润率:</span><span>${margin.toFixed(1)}%</span></div>
    <div class="verdict ${verdictClass}">${verdictText}</div>
  `;

  // Save to storage
  chrome.storage.local.set({ lastCalc: { price, cost, shipping, netProfit, margin, time: Date.now() } });
});

document.getElementById('quick-check').addEventListener('click', () => {
  const cost = parseFloat(document.getElementById('quick-cost').value) || 0;
  const price = parseFloat(document.getElementById('quick-price').value) || 0;

  if (!cost || !price) {
    showPopupResult('quick-result', '请填写进价和售价', 'verdict-warn');
    return;
  }

  const grossMargin = ((price - cost) / price) * 100;
  const estimatedNetMargin = grossMargin - 15; // Rough eBay fee deduction

  let verdictClass, verdictText;
  if (estimatedNetMargin >= 20) {
    verdictClass = 'verdict-good';
    verdictText = '✅ 这个品可以深入调研！预估净利润率 ' + estimatedNetMargin.toFixed(1) + '%';
  } else if (estimatedNetMargin >= 8) {
    verdictClass = 'verdict-warn';
    verdictText = '⚠️ 勉强能做，需要精细算账。预估净利润率 ' + estimatedNetMargin.toFixed(1) + '%';
  } else {
    verdictClass = 'verdict-bad';
    verdictText = '🔴 基本亏钱。建议放弃或找更优货源。预估净利润率 ' + estimatedNetMargin.toFixed(1) + '%';
  }

  const resultEl = document.getElementById('quick-result');
  resultEl.style.display = 'block';
  resultEl.innerHTML = `
    <div class="result-row"><span>进价:</span><span>$${cost.toFixed(2)}</span></div>
    <div class="result-row"><span>售价:</span><span>$${price.toFixed(2)}</span></div>
    <div class="result-row"><span>毛利:</span><span>$${(price - cost).toFixed(2)} (${grossMargin.toFixed(1)}%)</span></div>
    <div class="result-row"><span>预估净利润率:</span><span>~${estimatedNetMargin.toFixed(1)}%</span></div>
    <div class="verdict ${verdictClass}">${verdictText}</div>
  `;
});

function showPopupResult(id, msg, cls) {
  const el = document.getElementById(id);
  el.style.display = 'block';
  el.innerHTML = `<div class="verdict ${cls}">${msg}</div>`;
}

// Load last calculation
chrome.storage.local.get('lastCalc', (data) => {
  if (data.lastCalc) {
    document.getElementById('pop-price').value = data.lastCalc.price || '';
    document.getElementById('pop-cost').value = data.lastCalc.cost || '';
    document.getElementById('pop-shipping').value = data.lastCalc.shipping || '';
  }
});
