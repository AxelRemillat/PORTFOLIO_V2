// Styles de l'onglet « Facture » (fiche extraite). Injecté par InvoiceResult via
// <style>. Accent ambre via --wc-accent (propagé par la carte). S'appuie sur les
// variables --wc-* et la classe partagée .wc-mr-table (thème clair).
export const INVOICE_CSS = `
.wc-iv-ctrl { display:flex; align-items:center; gap:.6rem; padding:.85rem 1rem; border-radius:12px;
  font-size:.92rem; font-weight:600; margin:0 0 1.3rem; border:1.5px solid; }
.wc-iv-ctrl-ico { font-size:1.15rem; font-weight:800; flex-shrink:0; line-height:1; }
.wc-iv-ctrl.is-ok { background:#eefaf2; border-color:#7fd0a3; color:#0f7a45; }
.wc-iv-ctrl.is-warn { background:#fff5e6; border-color:#f0b661; color:#a15c00; }
.wc-iv-ctrl b { font-weight:800; }
.wc-iv-top { display:grid; grid-template-columns:1fr; gap:1.1rem; margin:0 0 1.4rem; align-items:start; }
@media (min-width:640px) { .wc-iv-top { grid-template-columns:auto 1fr; } }
.wc-iv-thumb { margin:0; }
.wc-iv-thumb img { display:block; width:100%; max-width:190px; height:auto; border:1px solid var(--wc-border-strong);
  border-radius:10px; background:#fff; box-shadow:0 2px 10px rgba(0,0,0,.06); }
.wc-iv-thumb figcaption { margin-top:.4rem; font-family:var(--font-mono); font-size:.66rem; text-transform:uppercase;
  letter-spacing:.08em; color:var(--wc-muted); text-align:center; }
.wc-iv-pdf { display:flex; flex-direction:column; align-items:center; gap:.55rem; width:100%; max-width:190px;
  padding:1.4rem 1rem; border:1px solid var(--wc-border-strong); border-radius:10px; background:#fff;
  text-decoration:none; box-shadow:0 2px 10px rgba(0,0,0,.06); transition:border-color .15s, box-shadow .15s; }
.wc-iv-pdf:hover { border-color:var(--wc-accent); box-shadow:0 4px 16px rgba(0,0,0,.1); }
.wc-iv-pdf-ico { font-family:var(--font-mono); font-size:.72rem; font-weight:800; letter-spacing:.05em; color:#fff;
  background:var(--wc-accent); border-radius:6px; padding:.5rem .7rem; }
.wc-iv-pdf-name { font-size:.82rem; font-weight:600; color:var(--wc-text); text-align:center; word-break:break-word; }
.wc-iv-pdf-open { font-family:var(--font-mono); font-size:.72rem; color:var(--wc-accent); font-weight:700; }
.wc-iv-head { display:grid; grid-template-columns:1fr 1fr; gap:.75rem 1.3rem; margin:0; }
.wc-iv-head-wide { grid-column:1 / -1; }
.wc-iv-head dt { font-family:var(--font-mono); font-size:.66rem; text-transform:uppercase; letter-spacing:.06em;
  color:var(--wc-muted); margin:0 0 2px; }
.wc-iv-head dd { margin:0; font-size:.95rem; font-weight:600; color:var(--wc-text); }
.wc-iv-lines { overflow:auto; max-height:220px; border-radius:8px; margin:0 0 1.4rem;
  scrollbar-width:thin; scrollbar-color:rgba(120,100,85,.4) transparent; }
.wc-iv-lines:focus-visible { outline:2px solid var(--wc-accent); outline-offset:2px; }
.wc-iv-lines::-webkit-scrollbar { width:9px; height:9px; }
.wc-iv-lines::-webkit-scrollbar-track { background:transparent; }
.wc-iv-lines::-webkit-scrollbar-thumb { background:rgba(120,100,85,.38); border-radius:99px; border:2px solid transparent; background-clip:padding-box; }
.wc-iv-lines::-webkit-scrollbar-thumb:hover { background:rgba(120,100,85,.6); background-clip:padding-box; }
.wc-iv-lines table { width:100%; }
.wc-iv-lines th:not(:first-child), .wc-iv-lines td:not(:first-child) { text-align:right; white-space:nowrap; }
.wc-iv-lines thead th { position:sticky; top:0; background:var(--wc-soft); z-index:1; }
.wc-iv-totals { display:flex; flex-direction:column; gap:.45rem; margin:0 0 .2rem; max-width:340px; margin-left:auto; }
.wc-iv-totals > div { display:flex; justify-content:space-between; gap:1.5rem; font-size:.92rem; color:var(--wc-text); }
.wc-iv-totals dt, .wc-iv-totals dd { margin:0; }
.wc-iv-totals dd { font-variant-numeric:tabular-nums; }
.wc-iv-ttc { border-top:2px solid var(--wc-accent); padding-top:.55rem; margin-top:.25rem; }
.wc-iv-ttc dt, .wc-iv-ttc dd { font-size:1.05rem; font-weight:800; color:var(--wc-accent); }
`;
