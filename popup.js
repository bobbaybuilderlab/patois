const toggleBtn = document.getElementById('toggleBtn');
const statusEl = document.getElementById('status');
const statsList = document.getElementById('statsList');
const exportBtn = document.getElementById('exportBtn');

let enabled = true;

function renderButton() {
  toggleBtn.textContent = enabled ? 'Unconvert to English' : 'Convert to Patois';
  toggleBtn.classList.toggle('off', enabled);
}

function renderStats(stats = {}) {
  const top = Object.entries(stats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  if (!top.length) {
    statsList.innerHTML = '<li>No tracked conversions yet.</li>';
    return;
  }

  statsList.innerHTML = top
    .map(([w, c]) => `<li><strong>${w}</strong> → ${c}x</li>`)
    .join('');
}

chrome.storage.sync.get({ enabled: true }, (cfg) => {
  enabled = !!cfg.enabled;
  renderButton();
});

chrome.storage.local.get({ convertedStats: {} }, (cfg) => {
  renderStats(cfg.convertedStats || {});
});

toggleBtn.addEventListener('click', async () => {
  enabled = !enabled;
  chrome.storage.sync.set({ enabled });
  renderButton();

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  chrome.tabs.sendMessage(tab.id, {
    type: enabled ? 'PATOIS_APPLY_NOW' : 'PATOIS_REVERT_NOW'
  }, () => {
    statusEl.textContent = enabled ? 'Converted on this tab.' : 'Reverted on this tab.';
  });
});

exportBtn.addEventListener('click', () => {
  chrome.storage.local.get({ convertedStats: {} }, (cfg) => {
    const stats = cfg.convertedStats || {};
    const suggestions = Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .map(([word, count]) => ({
        englishWord: word,
        count,
        suggestedPatois: '',
        approved: false
      }));

    const payload = {
      exportedAt: new Date().toISOString(),
      totalTrackedWords: suggestions.length,
      suggestions
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patois-dictionary-growth-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    statusEl.textContent = 'Exported JSON suggestions.';
  });
});
