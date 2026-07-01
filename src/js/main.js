// Main JavaScript - Tab switching and shared utilities

document.addEventListener('DOMContentLoaded', () => {
  // Tab switching
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tool-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${target}`).classList.add('active');

      // Save active tab
      localStorage.setItem('activeTab', target);
    });
  });

  // Restore active tab
  const savedTab = localStorage.getItem('activeTab');
  if (savedTab) {
    const tab = document.querySelector(`[data-tab="${savedTab}"]`);
    if (tab) tab.click();
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

// Utility: format currency
function formatCurrency(amount) {
  return '$' + Number(amount).toFixed(2);
}

// Utility: format percent
function formatPercent(value) {
  return Number(value).toFixed(1) + '%';
}

// Utility: get verdict class
function getVerdictClass(margin) {
  if (margin >= 25) return 'verdict-good';
  if (margin >= 10) return 'verdict-warn';
  return 'verdict-bad';
}

// Utility: get verdict message
function getVerdictMessage(margin) {
  if (margin >= 25) return '✅ 利润健康！这个产品值得投入精力去做。';
  if (margin >= 15) return '⚠️ 利润尚可，但可以尝试优化成本或提高售价。';
  if (margin >= 5) return '🔴 利润微薄！建议重新评估选品、寻找更优货源或提高售价。';
  return '🚨 亏本！当前定价无法覆盖成本，必须调整。';
}

// Utility: show result
function showResult(resultId) {
  const el = document.getElementById(resultId);
  el.querySelector('.result-placeholder').style.display = 'none';
  el.querySelector('.result-content').style.display = 'block';
}

// Analytics tracking (placeholder)
function trackEvent(action, label) {
  console.log(`[Analytics] ${action}: ${label}`);
  // TODO: Integrate Google Analytics / Plausible
  if (typeof gtag !== 'undefined') {
    gtag('event', action, { event_category: 'tool', event_label: label });
  }
}

// Save calculations to history
function saveToHistory(type, data) {
  try {
    const history = JSON.parse(localStorage.getItem('calcHistory') || '[]');
    history.unshift({ type, data, time: Date.now() });
    localStorage.setItem('calcHistory', JSON.stringify(history.slice(0, 50)));
  } catch (e) {
    // Silently fail
  }
}
