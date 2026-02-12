const DICTIONARY = {
  hello: 'wah gwaan',
  hi: 'wah gwaan',
  friend: 'fren',
  friends: 'frens dem',
  you: 'yuh',
  your: 'yuh',
  are: 'a',
  is: 'a',
  am: 'mi deh',
  my: 'mi',
  very: 'real',
  really: 'real real',
  what: 'wah',
  where: 'weh',
  why: 'wah mek',
  this: 'dis',
  that: 'dat',
  with: 'wid',
  for: 'fi',
  to: 'fi',
  them: 'dem',
  those: 'dem deh',
  going: 'gwaan',
  good: 'irie',
  great: 'mad',
  awesome: 'wicked',
  amazing: 'tun up',
  yes: 'yeah man',
  no: 'nuh',
  do: 'duh',
  does: 'duh',
  did: 'didh',
  don't: 'nuh',
  cannot: 'cyan',
  can: 'can',
  house: 'yaad',
  home: 'yaad',
  food: 'nyam',
  eat: 'nyam',
  children: 'pickney dem',
  child: 'pickney',
  girl: 'gyal',
  boy: 'bwoy',
  people: 'people dem',
  money: 'peppa',
  police: 'babylon',
  quickly: 'quick quick',
  now: 'now now',
  later: 'inna likkle while',
  stop: 'hol up',
  please: 'mi beg yuh',
  thanks: 'respek',
  thank: 'respek',
  beautiful: 'criss',
  crazy: 'mad',
  talking: 'a chat',
  talk: 'chat',
  understand: 'overstand',
  work: 'hustle',
  business: 'ting',
  team: 'crew',
  winner: 'big chune',
  cool: 'chill',
  style: 'swag'
};

function preserveCase(source, target) {
  if (source.toUpperCase() === source) return target.toUpperCase();
  if (source[0] === source[0].toUpperCase()) return target.charAt(0).toUpperCase() + target.slice(1);
  return target;
}

function replaceText(text, intensity = 2) {
  const words = Object.keys(DICTIONARY);
  let out = text;
  for (const w of words) {
    if (intensity === 1 && Math.random() > 0.35) continue;
    if (intensity === 2 && Math.random() > 0.65) continue;
    const regex = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'gi');
    out = out.replace(regex, (m) => preserveCase(m, DICTIONARY[w]));
  }
  return out;
}

function walkAndSwap(root, intensity) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const p = node.parentElement;
      if (!p) return NodeFilter.FILTER_REJECT;
      const tag = p.tagName;
      if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT'].includes(tag)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    }
  });

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const n of nodes) {
    n.nodeValue = replaceText(n.nodeValue, intensity);
  }
}

function applyPatois() {
  chrome.storage.sync.get({ enabled: true, intensity: 2 }, (cfg) => {
    if (!cfg.enabled) return;
    walkAndSwap(document.body, cfg.intensity);
  });
}

const observer = new MutationObserver(() => applyPatois());

function init() {
  applyPatois();
  observer.observe(document.body, { childList: true, subtree: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg?.type === 'PATOIS_APPLY_NOW') applyPatois();
});
