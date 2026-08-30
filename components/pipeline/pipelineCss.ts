// Styles spécifiques à la démo « Pipeline Data/ML » (/pipeline). Injecté EN PLUS
// de WORKFLOW_CSS (shell wc-page) + AGENT_CSS (étapes ag-step réutilisées). Accent
// cyan local. Scopé .pl-demo → n'affecte rien d'autre.
export const PIPELINE_CSS = `
.pl-demo { --pl:#0891b2; --pl-weak:#0891b21a; --ag:#0891b2; --ag-weak:#0891b21a; }

.pl-tools { display:flex; flex-wrap:wrap; gap:9px; margin:0 0 1.1rem; }
.pl-tool { font-size:.85rem; font-weight:600; font-family:inherit; cursor:pointer; padding:8px 14px;
  border-radius:10px; background:var(--wc-surface); border:1.5px solid var(--wc-border-strong); color:var(--wc-text); }
.pl-tool:hover { border-color:var(--pl); }
.pl-tool.on { color:#fff; background:var(--pl); border-color:var(--pl); box-shadow:0 6px 16px -6px var(--pl); }

/* Ligne éditable + score live */
.pl-edit { border:1px solid var(--wc-border); border-radius:14px; background:var(--wc-soft); padding:1.1rem 1.2rem; margin:0 0 1.3rem; }
.pl-edit-h { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin:0 0 .9rem; }
.pl-edit-t { font-size:.95rem; font-weight:800; color:var(--wc-text); margin:0; }
.pl-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(140px,1fr)); gap:.7rem .9rem; }
.pl-field { display:flex; flex-direction:column; gap:4px; }
.pl-field label { font-family:var(--font-mono); font-size:.62rem; letter-spacing:.05em; text-transform:uppercase; color:var(--wc-muted); }
.pl-in { font-size:.86rem; font-family:inherit; padding:6px 9px; border-radius:8px; background:#fff;
  border:1px solid var(--wc-border-strong); color:var(--wc-text); }
.pl-in:focus { outline:2px solid var(--pl-weak); border-color:var(--pl); }
.pl-check { display:flex; align-items:center; gap:8px; font-size:.85rem; color:var(--wc-text); }
.pl-gauge { text-align:right; min-width:130px; }
.pl-gauge-p { font-size:1.7rem; font-weight:900; line-height:1; color:var(--pl); font-variant-numeric:tabular-nums; }
.pl-gauge-l { font-family:var(--font-mono); font-size:.66rem; text-transform:uppercase; letter-spacing:.06em; margin:.2rem 0 0; }

/* Résultats */
.pl-insight { display:flex; gap:.8rem; align-items:center; padding:1rem 1.15rem; border-radius:13px; margin:0 0 1.4rem;
  background:linear-gradient(120deg, var(--pl-weak), transparent); border:1.5px solid var(--pl); }
.pl-insight-n { font-size:1.9rem; font-weight:900; color:var(--pl); line-height:1; font-variant-numeric:tabular-nums; }
.pl-insight-t { font-size:.9rem; color:var(--wc-text); line-height:1.45; margin:0; }
.pl-insight-t b { color:var(--pl); }

.pl-seclabel { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase;
  color:var(--wc-muted); margin:1.6rem 0 .8rem; padding-bottom:.5rem; border-bottom:1px solid var(--wc-border); }

/* Table triable */
.pl-tablewrap { overflow-x:auto; border:1px solid var(--wc-border); border-radius:12px; }
.pl-table { width:100%; border-collapse:collapse; font-size:.84rem; min-width:520px; }
.pl-table th, .pl-table td { padding:.55rem .8rem; text-align:left; white-space:nowrap; }
.pl-table thead th { font-family:var(--font-mono); font-size:.66rem; text-transform:uppercase; letter-spacing:.05em;
  color:var(--wc-muted); background:var(--wc-soft); border-bottom:1px solid var(--wc-border); }
.pl-th-sort { cursor:pointer; user-select:none; }
.pl-th-sort:hover { color:var(--pl); }
.pl-table tbody tr { border-top:1px solid var(--wc-border); }
.pl-table tbody tr:nth-child(even) { background:var(--wc-soft); }
.pl-table td.num { text-align:right; font-variant-numeric:tabular-nums; }
.pl-proba { font-weight:800; color:var(--wc-text); }
.pl-badge { font-family:var(--font-mono); font-size:.64rem; font-weight:700; text-transform:uppercase;
  padding:2px 8px; border-radius:999px; border:1px solid; }
.pl-badge.chaud { color:#b91c1c; border-color:#f0a3a3; background:#fef1f1; }
.pl-badge.tiède { color:#a15c00; border-color:#f0c67a; background:#fff6e6; }
.pl-badge.froid { color:#1e5aa8; border-color:#a9c8ee; background:#eef4fc; }

/* Graphes SVG */
.pl-charts { display:grid; grid-template-columns:repeat(auto-fit, minmax(280px,1fr)); gap:1.4rem; }
.pl-chart { border:1px solid var(--wc-border); border-radius:12px; background:var(--wc-surface); padding:1rem 1.1rem; }
.pl-chart-t { font-size:.82rem; font-weight:700; color:var(--wc-text); margin:0 0 .9rem; }
.pl-imp-row { display:grid; grid-template-columns:1fr 46px; gap:8px; align-items:center; margin:0 0 .5rem; }
.pl-imp-lbl { font-size:.74rem; color:var(--wc-text); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.pl-imp-bar { height:9px; border-radius:5px; background:var(--pl); }
.pl-imp-track { height:9px; border-radius:5px; background:var(--wc-border); overflow:hidden; }
.pl-imp-val { font-family:var(--font-mono); font-size:.68rem; color:var(--wc-muted); text-align:right; }

@media (prefers-reduced-motion: reduce) { .pl-imp-bar { transition:none; } }
`;
