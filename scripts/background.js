chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get({ enabled: true, intensity: 2 }, (cfg) => {
    chrome.storage.sync.set(cfg);
  });
});
