# Patois Product Spec (v0.1)

## Goal
Ship a fun, lightweight Chrome extension that rewrites webpage text into Jamaican Patois-style language.

## Core requirements
- Manifest v3
- Content script translation engine
- Popup controls (enabled + intensity)
- Local persistence of settings

## Non-goals (v0.1)
- Full linguistic translation accuracy
- Backend services
- User account system

## Architecture
- `manifest.json`: extension config and permissions
- `scripts/content.js`: text replacement + mutation observer
- `popup.*`: user controls
- `scripts/background.js`: default setting bootstrap

## QA checklist
- Install loads without errors
- Toggle disables replacements
- Intensity changes output frequency
- No script/style/input corruption
- Works on at least 5 high-traffic websites

## Future versions
- Phrase-level replacement model
- Site-level rules
- Community dictionary packs
- Optional AI refinement mode
