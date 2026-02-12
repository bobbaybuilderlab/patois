const DICTIONARY = {
  hello: 'wah gwaan', hi: 'wah gwaan', friend: 'fren', friends: 'frens dem',
  you: 'yuh', your: 'yuh', are: 'a', is: 'a', am: 'mi deh', my: 'mi',
  very: 'real', really: 'real real', what: 'wah', where: 'weh', why: 'wah mek',
  this: 'dis', that: 'dat', with: 'wid', for: 'fi', to: 'fi', them: 'dem',
  those: 'dem deh', going: 'gwaan', good: 'irie', great: 'mad', awesome: 'wicked',
  amazing: 'tun up', yes: 'yeah man', no: 'nuh', do: 'duh', does: 'duh', did: 'didh',
  "don't": 'nuh', cannot: 'cyan', can: 'can', house: 'yaad', home: 'yaad',
  food: 'nyam', eat: 'nyam', children: 'pickney dem', child: 'pickney', girl: 'gyal',
  boy: 'bwoy', people: 'people dem', money: 'peppa', police: 'babylon',
  quickly: 'quick quick', now: 'now now', later: 'inna likkle while',
  stop: 'hol up', please: 'mi beg yuh', thanks: 'respek', thank: 'respek',
  beautiful: 'criss', crazy: 'mad', talking: 'a chat', talk: 'chat',
  understand: 'overstand', work: 'hustle', business: 'ting', team: 'crew',
  winner: 'big chune', cool: 'chill', style: 'swag'
};

const originalTextByNode = new WeakMap();
let enabled = true;

function preserveCase(source, target) {
  if (source.toUpperCase() === source) return target.toUpperCase();
  if (source[0] === source[0].toUpperCase()) return target.charAt(0).toUpperCase() + target.slice(1);
  return target;
}

function replaceTextWithTracking(text) {
  let out = text;
  const counts = {};

  for (const [word, replacement] of Object.entries(DICTIONARY)) {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'gi');
    out = out.replace(regex, (match) => {
      counts[word] = (counts[word] || 0) + 1;
      return preserveCase(match, replacement);
    });
  }

  return { text: out, counts };
}

function mergeCounts(base, next) {
  for (const [k, v] of Object.entries(next)) {
    base[k] = (base[k] || 0) + v;
  }
  return base;
}

function getTextNodes(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(p.tagName)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  return nodes;
}

function applyPatois() {
  if (!enabled) return;
  const nodes = getTextNodes(document.body);
  const tracked = {};

  for (const n of nodes) {
    if (!originalTextByNode.has(n)) originalTextByNode.set(n, n.nodeValue);
    const result = replaceTextWithTracking(n.nodeValue);
    n.nodeValue = result.text;
    mergeCounts(tracked, result.counts);
  }

  if (Object.keys(tracked).length) {
    chrome.runtime.sendMessage({ type: 'PATOIS_TRACK_CONVERSIONS', counts: tracked });
  }
}

function revertPatois() {
  const nodes = getTextNodes(document.body);
  for (const n of nodes) {
    const original = originalTextByNode.get(n);
    if (typeof original === 'string') n.nodeValue = original;
  }
}

const observer = new MutationObserver(() => {
  if (enabled) applyPatois();
});

function init() {
  chrome.storage.sync.get({ enabled: true }, (cfg) => {
    enabled = !!cfg.enabled;
    if (enabled) applyPatois();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'PATOIS_APPLY_NOW') {
    enabled = true;
    applyPatois();
  }
  if (msg?.type === 'PATOIS_REVERT_NOW') {
    enabled = false;
    revertPatois();
  }
});
