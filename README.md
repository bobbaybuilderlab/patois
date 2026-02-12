# Patois Chrome Extension 🇯🇲

Patois is a fun Chrome extension that rewrites visible English text on webpages into Jamaican Patois vibes.

## Features
- One-button popup: Convert / Unconvert
- Tracks converted words so the dictionary can expand over time
- Exports growth suggestions as JSON (`englishWord`, `count`, `suggestedPatois`, `approved`)
- Works on most websites via content script
- No account, no backend, no user tracking

## Load locally
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this `patois/` folder
5. Open any site and hit the extension popup

## How it works
- `scripts/content.js` walks visible text nodes
- Replaces dictionary-matched words with Patois terms
- Observes DOM changes and reapplies where needed

## Notes
- This is intentionally playful, not linguistically complete.
- For edge cases (apps with heavy virtual DOM), click **Apply on this tab** from popup.

## Roadmap
- Per-site allow/block list
- User dictionary additions
- More phrase-level translation (context-aware)
- Better anti-flicker rendering for SPA apps
