// Content script - injects profit overlay on eBay listing pages

(function() {
  'use strict';

  // Detect platform
  const isEbay = window.location.hostname.includes('ebay.com');
  const isAmazon = window.location.hostname.includes('amazon.com');

  // Try to extract price from page
  function getPrice() {
    if (isEbay) {
      const priceEl = document.querySelector('[data-testid="x-price-primary"], .x-price-primary, [itemprop="price"], #prcIsum, .vi-price');
      if (priceEl) {
        const text = priceEl.textContent || priceEl.getAttribute('content') || '';
        const match = text.match(/[\d,.]+/);
        return match ? parseFloat(match[0].replace(/,/g, '')) : null;
      }
    }
    if (isAmazon) {
      const priceEl = document.querySelector('.a-price .a-offscreen, #priceblock_ourprice, #priceblock_dealprice');
      if (priceEl) {
        const text = priceEl.textContent || priceEl.getAttribute('value') || '';
        const match = text.match(/[\d,.]+/);
        return match ? parseFloat(match[0].replace(/,/g, '')) : null;
      }
    }
    return null;
  }

  const price = getPrice();
  if (!price) return;

  // Create floating button
  const floatBtn = document.createElement('div');
  floatBtn.id = 'profittools-float';
  floatBtn.innerHTML = '📊 算利润';
  floatBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 99999;
    background: linear-gradient(135deg, #2563eb, #7c3aed);
    color: white;
    padding: 10px 18px;
    border-radius: 24px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37,99,235,0.4);
    transition: transform 0.2s;
    user-select: none;
  `;

  // Create overlay panel
  const overlay = document.createElement('div');
  overlay.id = 'profittools-overlay';
  overlay.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 99998;
    width: 340px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    padding: 24px;
    display: none;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    border: 1px solid #e2e8f0;
  `;

  overlay.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
      <h3 style="margin:0;font-size:16px;color:#1e293b;">📊 利润计算器</h3>
      <button id="profittools-close" style="background:none;border:none;font-size:20px;cursor:pointer;color:#94a3b8;">×</button>
    </div>
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;color:#64748b;margin-bottom:4px;">检测到售价</div>
      <div style="font-size:24px;font-weight:700;color:#2563eb;">$${price.toFixed(2)}</div>
    </div>
    <div style="margin-bottom:10px;">
      <label style="font-size:12px;font-weight:600;color:#64748b;">商品成本 ($)</label>
      <input id="profittools-cost" type="number" step="0.01" placeholder="采购成本/进价" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-top:4px;font-size:14px;">
    </div>
    <div style="margin-bottom:10px;">
      <label style="font-size:12px;font-weight:600;color:#64748b;">运费 ($)</label>
      <input id="profittools-shipping" type="number" step="0.01" value="0" placeholder="实际运费" style="width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:8px;margin-top:4px;font-size:14px;">
    </div>
    <button id="profittools-calc" style="width:100%;padding:12px;background:#2563eb;color:white;border:none;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;margin-top:4px;">🔍 计算利润</button>
    <div id="profittools-result" style="margin-top:12px;display:none;"></div>
    <div style="margin-top:12px;font-size:11px;color:#94a3b8;text-align:center;">
      <a href="https://profittools.pro" target="_blank" style="color:#2563eb;">打开完整版工具箱 →</a>
    </div>
  `;

  document.body.appendChild(floatBtn);
  document.body.appendChild(overlay);

  // Toggle overlay
  floatBtn.addEventListener('click', () => {
    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
  });

  document.getElementById('profittools-close').addEventListener('click', () => {
    overlay.style.display = 'none';
  });

  // Calculate
  document.getElementById('profittools-calc').addEventListener('click', () => {
    const cost = parseFloat(document.getElementById('profittools-cost').value) || 0;
    const shipping = parseFloat(document.getElementById('profittools-shipping').value) || 0;

    if (!cost) {
      alert('请输入商品成本');
      return;
    }

    const fvfRate = 0.1325;
    const paymentRate = 0.029;
    const paymentFixed = 0.30;

    const fvf = price * fvfRate;
    const paymentFee = price * paymentRate + paymentFixed;
    const totalFees = fvf + paymentFee;
    const totalCost = cost + shipping + totalFees;
    const netProfit = price - totalCost;
    const margin = (netProfit / price) * 100;

    let verdict, verdictColor;
    if (margin >= 25) { verdict = '✅ 利润健康，值得深入做！'; verdictColor = '#065f46'; }
    else if (margin >= 10) { verdict = '⚠️ 利润一般，建议优化成本或提价'; verdictColor = '#92400e'; }
    else { verdict = '🔴 利润太低或不赚钱，建议放弃'; verdictColor = '#991b1b'; }

    const resultEl = document.getElementById('profittools-result');
    resultEl.style.display = 'block';
    resultEl.innerHTML = `
      <div style="padding:12px;background:#f8fafc;border-radius:10px;">
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;"><span>成交费:</span><span>$${fvf.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;"><span>支付费:</span><span>$${paymentFee.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;border-top:1px solid #e2e8f0;"><span>总费用:</span><span>$${totalFees.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:15px;font-weight:700;color:${margin >= 0 ? '#10b981' : '#ef4444'};margin-top:4px;border-top:1px solid #e2e8f0;"><span>💰 净利润:</span><span>$${netProfit.toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;padding:4px 0;font-size:13px;color:#2563eb;"><span>利润率:</span><span>${margin.toFixed(1)}%</span></div>
        <div style="margin-top:8px;padding:8px;background:${margin >= 15 ? '#ecfdf5' : margin >= 5 ? '#fffbeb' : '#fef2f2'};border-radius:6px;font-size:13px;font-weight:600;color:${verdictColor};">${verdict}</div>
      </div>
    `;
  });
})();
