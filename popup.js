const enabledEl = document.getElementById('enabled');
const intensityEl = document.getElementById('intensity');
const statusEl = document.getElementById('status');
const applyBtn = document.getElementById('applyNow');

const DEFAULTS = { enabled: true, intensity: 2 };

chrome.storage.sync.get(DEFAULTS, (cfg) => {
  enabledEl.checked = cfg.enabled;
  intensityEl.value = String(cfg.intensity);
});

function save() {
  chrome.storage.sync.set({
    enabled: enabledEl.checked,
    intensity: Number(intensityEl.value),
  });
}

enabledEl.addEventListener('change', save);
intensityEl.addEventListener('change', save);

applyBtn.addEventListener('click', async () => {
  save();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;
  chrome.tabs.sendMessage(tab.id, { type: 'PATOIS_APPLY_NOW' }, () => {
    statusEl.textContent = 'Done. Reload if site fights back.';
  });
});
