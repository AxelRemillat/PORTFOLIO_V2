// Styles de l'onglet « Nettoyage data » (résultat + aperçu AVANT/APRÈS aligné).
// Injecté par DataCleanResult via <style> pour garder workflowCanvasCss.ts court.
// S'appuie sur les variables --wc-* et la classe partagée .wc-mr-table (thème clair).
export const DATACLEAN_CSS = `
.wc-dc-stats { display:flex; flex-wrap:wrap; gap:.5rem 1.3rem; margin:0 0 1.3rem; font-size:.88rem; color:var(--wc-text); }
.wc-dc-stats b { color:var(--wc-accent); font-weight:800; }
.wc-dc-stats code { font-family:var(--font-mono); font-size:.82rem; background:var(--wc-accent-weak); padding:1px 6px; border-radius:4px; }
.wc-dc-anos { list-style:none; margin:0 0 1.3rem; padding:0; display:flex; flex-direction:column; gap:.5rem; }
.wc-dc-anos li { display:flex; align-items:center; gap:9px; flex-wrap:wrap; font-size:.86rem; }
.wc-dc-ano-badge { font-family:var(--font-mono); font-size:.72rem; font-weight:700; color:#fff; background:#e11d48; border-radius:999px; padding:2px 9px; flex-shrink:0; }
.wc-dc-ano-type { font-weight:600; color:var(--wc-text); }
.wc-dc-ano-ex { font-family:var(--font-mono); font-size:.76rem; color:var(--wc-muted); }
.wc-dc-norms { list-style:none; margin:0 0 1.3rem; padding:0; display:flex; flex-direction:column; gap:.35rem; font-size:.88rem; color:var(--wc-text); }
.wc-dc-quality { display:flex; flex-direction:column; gap:.65rem; margin:0 0 1.3rem; }
.wc-dc-col-head { display:flex; justify-content:space-between; gap:1rem; font-size:.83rem; color:var(--wc-text); margin-bottom:4px; }
.wc-dc-col-type { font-family:var(--font-mono); font-size:.72rem; color:var(--wc-muted); white-space:nowrap; }
.wc-dc-bar { height:7px; border-radius:4px; background:var(--wc-border); overflow:hidden; }
.wc-dc-bar-fill { height:100%; background:var(--wc-accent); border-radius:4px; }

/* Aperçu AVANT / APRÈS — construit depuis result.apercu, aligné ligne à ligne */
.wc-dc-hint { margin:0 0 .55rem; font-family:var(--font-mono); font-size:.72rem; color:var(--wc-muted); }
.wc-dc-preview { display:grid; grid-template-columns:1fr; gap:1rem; margin:0 0 .6rem; align-items:start; }
@media (min-width:720px) { .wc-dc-preview { grid-template-columns:1fr 1fr; } }
.wc-dc-side { min-width:0; border-radius:12px; padding:.9rem; border:1.5px solid; }
.wc-dc-before { background:#fdf1ec; border-color:#f0a58c; }
.wc-dc-after { background:#eefaf2; border-color:#7fd0a3; }
.wc-dc-side-title { margin:0 0 .5rem; font-size:.95rem; font-weight:800; }
.wc-dc-before .wc-dc-side-title { color:#b23c17; }
.wc-dc-after .wc-dc-side-title { color:#0f7a45; }
.wc-dc-side-tablewrap { overflow:auto; max-width:100%; max-height:136px; border-radius:8px;
  scrollbar-width:thin; scrollbar-color:rgba(120,100,85,.4) transparent; }
.wc-dc-side-tablewrap:focus-visible { outline:2px solid var(--wc-accent); outline-offset:2px; }
.wc-dc-side-tablewrap::-webkit-scrollbar { width:9px; height:9px; }
.wc-dc-side-tablewrap::-webkit-scrollbar-track { background:transparent; }
.wc-dc-side-tablewrap::-webkit-scrollbar-thumb { background:rgba(120,100,85,.38); border-radius:99px; border:2px solid transparent; background-clip:padding-box; }
.wc-dc-side-tablewrap::-webkit-scrollbar-thumb:hover { background:rgba(120,100,85,.6); background-clip:padding-box; }
.wc-dc-side-tablewrap::-webkit-scrollbar-corner { background:transparent; }
/* Même métrique de ligne des 2 côtés → le scroll synchronisé reste aligné */
.wc-dc-side-tablewrap th, .wc-dc-side-tablewrap td { white-space:nowrap; padding:.42rem .6rem; font-size:.82rem; line-height:1.4; }
.wc-dc-side-tablewrap thead th { position:sticky; top:0; z-index:1; }
.wc-dc-before .wc-dc-side-tablewrap thead th { background:#fdf1ec; }
.wc-dc-after .wc-dc-side-tablewrap thead th { background:#eefaf2; }
/* Table AVANT en monospace = effet « donnée brute » (même taille → même hauteur) */
table.wc-dc-raw td { font-family:var(--font-mono); }
/* Cellules modifiées : sale à gauche (rouge barré), corrigée à droite (vert gras) */
.wc-dc-side td.wc-dc-dirty { color:#b23c17; text-decoration:line-through; text-decoration-color:rgba(178,60,23,.55); background:rgba(224,113,74,.16); }
.wc-dc-side td.wc-dc-fixed { color:#0f7a45; font-weight:700; background:rgba(46,160,90,.17); }
.wc-dc-dupes { margin:0 0 1rem; font-family:var(--font-mono); font-size:.78rem; color:var(--wc-muted); }
.wc-dc-dupes b { color:#b23c17; font-weight:700; }
.wc-dc-dl { margin:.2rem 0 .4rem; }
.wc-dc-detail-lbl { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.12em; text-transform:uppercase;
  color:var(--wc-muted); margin:1.6rem 0 1rem; padding-top:1.2rem; border-top:1px solid var(--wc-border); }
`;
