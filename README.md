# Tableau Workbook Documenter

> Extract datasources, calculated fields, parameters, sheets & dashboards from any Tableau `.twb` / `.twbx` file — in one click, entirely in-browser.

**Live:** https://mkunaismkd.github.io/tableau-documenter/

## Features

- **Zero upload** — all parsing happens client-side in the browser
- **Datasources** — connection type, server, database, tables, custom SQL, field inventory
- **Calculated Fields** — formula, datatype, role, hidden status, with search
- **Parameters** — datatype, domain type, default values, allowed values
- **Sheets & Dashboards** — worksheet list, dashboard zones, stories
- **Export Markdown** — ready-to-paste documentation for Confluence / Notion
- **Export JSON** — full structured metadata for downstream tooling
- Supports `.twb` (XML) and `.twbx` (zip archive)

## Stack

- Vite + React
- [JSZip](https://stuk.github.io/jszip/) for `.twbx` extraction
- [Lucide React](https://lucide.dev/) for icons
- CSS Modules
- GitHub Actions → GitHub Pages

## Local dev

```bash
npm install
npm run dev
```

## Deploy

Push to `main` — GitHub Actions builds and deploys automatically.

Make sure GitHub Pages is set to **GitHub Actions** as the source (repo Settings → Pages → Source).

## How it works

Tableau `.twb` files are XML. The parser reads:
- `<datasource>` nodes → connection metadata, `<relation>` nodes for tables, `<column>` for fields
- `<column formula="...">` → calculated fields
- The `Parameters` datasource → parameters
- `<worksheet>`, `<dashboard>`, `<story>` → structure

`.twbx` files are unzipped with JSZip first, then the inner `.twb` is parsed the same way.

---

Built by [Unais MK](https://github.com/mkunaismkd)
