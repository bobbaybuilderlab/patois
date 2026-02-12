chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ enabled: true }, (cfg) => {
    chrome.storage.sync.set(cfg);
  });
  chrome.storage.local.get({ convertedStats: {} }, (cfg) => {
    chrome.storage.local.set(cfg);
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type !== 'PATOIS_TRACK_CONVERSIONS' || !msg.counts) return;

  chrome.storage.local.get({ convertedStats: {} }, (cfg) => {
    const next = { ...cfg.convertedStats };
    for (const [word, count] of Object.entries(msg.counts)) {
      next[word] = (next[word] || 0) + Number(count || 0);
    }
    chrome.storage.local.set({ convertedStats: next });
  });
});
