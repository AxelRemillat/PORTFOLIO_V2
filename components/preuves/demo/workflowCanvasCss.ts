// Thème CLAIR « canvas n8n » scopé à .wc-page (variables --wc-* locales — le thème
// sombre global n'est jamais touché). Grille de points, workflow card, pipeline de
// nodes animé, rendu de résultat. Réutilisable par toutes les démos d'automatisation.
export const WORKFLOW_CSS = `
.wc-page {
  --wc-bg:#f6f4ec; --wc-surface:#ffffff; --wc-soft:#fbfaf5; --wc-text:#1f2430; --wc-muted:#6b7280;
  --wc-border:#e6e1d2; --wc-border-strong:#d7d1bf; --wc-accent:#10b981; --wc-accent-weak:#10b9811f;
  --wc-grid:rgba(30,34,48,0.08);
  position:relative; min-height:100vh; background:var(--wc-bg); color:var(--wc-text);
  padding:8vh clamp(1.15rem,5vw,3rem) 12vh;
}
.wc-grid { position:absolute; inset:0; z-index:0; pointer-events:none;
  background-image:radial-gradient(var(--wc-grid) 1.4px, transparent 1.4px); background-size:22px 22px;
  -webkit-mask-image:radial-gradient(120% 80% at 50% 0%, #000 55%, transparent 100%);
  mask-image:radial-gradient(120% 80% at 50% 0%, #000 55%, transparent 100%); }
.wc-inner { position:relative; z-index:1; max-width:1040px; margin:0 auto; }
.wc-back { font-family:var(--font-mono); font-size:.8rem; color:var(--wc-muted); text-decoration:none; display:inline-block; margin-bottom:2rem; transition:color .2s ease; }
.wc-back:hover { color:var(--wc-text); }
.wc-kicker { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.14em; text-transform:uppercase; color:var(--wc-accent); margin:0 0 .8rem; }
.wc-h1 { font-size:clamp(2rem,5vw,3.1rem); font-weight:900; color:var(--wc-text); line-height:1.03; margin:0 0 .7rem; }
.wc-lead { color:var(--wc-muted); max-width:620px; line-height:1.55; margin:0 0 2.4rem; }

.wc-tabs { display:flex; gap:9px; overflow-x:auto; margin-bottom:1.5rem; padding-bottom:5px; -webkit-overflow-scrolling:touch; }
.wc-tab { display:inline-flex; align-items:center; gap:9px; white-space:nowrap; flex:0 0 auto;
  font-size:.92rem; font-weight:700; font-family:inherit; color:var(--wc-text); cursor:pointer;
  background:var(--wc-surface); border:1.5px solid var(--wc-border-strong); border-radius:12px; padding:11px 16px;
  box-shadow:0 1px 2px rgba(30,34,48,0.04);
  transition:color .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease; }
.wc-tab-num { font-family:var(--font-mono); font-size:.72rem; font-weight:700; letter-spacing:.02em; color:var(--tab-accent); }
.wc-tab-ico { color:var(--tab-accent); display:inline-flex; }
.wc-tab-ico svg { width:17px; height:17px; display:block; }
.wc-tab:hover { border-color:var(--tab-accent); background:var(--tab-weak); box-shadow:0 3px 10px -4px var(--tab-accent); }
.wc-tab.is-active { color:var(--tab-fg); background:var(--tab-fill); border-color:var(--tab-fill);
  box-shadow:0 6px 16px -6px var(--tab-accent); }
.wc-tab.is-active .wc-tab-num, .wc-tab.is-active .wc-tab-ico { color:var(--tab-fg); }
.wc-tab:focus-visible { outline:2px solid var(--tab-accent); outline-offset:2px; }

.wc-card { background:var(--wc-surface); border:1px solid var(--wc-border); border-radius:16px;
  box-shadow:0 1px 0 rgba(0,0,0,0.02), 0 22px 44px -30px rgba(30,34,48,0.35); padding:1.5rem; }
.wc-title { font-size:1.25rem; font-weight:800; color:var(--wc-text); margin:0 0 .25rem; }
.wc-sub { font-size:.9rem; color:var(--wc-muted); margin:0 0 1.3rem; line-height:1.5; }
.wc-form { display:flex; flex-direction:column; gap:.65rem; }
.wc-label { font-family:var(--font-mono); font-size:.7rem; letter-spacing:.06em; text-transform:uppercase; color:var(--wc-muted); }
.wc-ta { width:100%; min-height:118px; resize:vertical; border-radius:10px; padding:.7rem .85rem;
  background:var(--wc-soft); border:1px solid var(--wc-border-strong); color:var(--wc-text);
  font-size:.9rem; line-height:1.5; font-family:inherit; transition:border-color .15s ease; }
.wc-ta:focus { outline:2px solid var(--wc-accent-weak); outline-offset:1px; border-color:var(--wc-accent); }
.wc-hp { position:absolute; left:-9999px; width:1px; height:1px; opacity:0; overflow:hidden; }
.wc-file { display:flex; flex-direction:column; gap:8px; }
.wc-file-input { position:absolute; width:1px; height:1px; opacity:0; }
.wc-file-drop { display:flex; align-items:center; gap:12px; flex-wrap:wrap; padding:.9rem 1rem;
  border:1.5px dashed var(--wc-border-strong); border-radius:10px; background:var(--wc-soft); }
.wc-file-btn { font-size:.82rem; font-weight:600; font-family:inherit; padding:7px 14px; border-radius:8px;
  cursor:pointer; background:#fff; border:1px solid var(--wc-border-strong); color:var(--wc-text); }
.wc-file-btn:hover { border-color:var(--wc-accent); }
.wc-file-name { font-size:.85rem; color:var(--wc-muted); }
.wc-actions { display:flex; flex-wrap:wrap; gap:10px; }
.wc-btn { font-size:.86rem; font-weight:600; padding:9px 18px; border-radius:9px; cursor:pointer; font-family:inherit; }
.wc-btn:focus-visible { outline:2px solid var(--wc-accent); outline-offset:2px; }
.wc-primary { background:var(--wc-accent); color:#fff; border:1px solid var(--wc-accent); }
.wc-primary:hover:not(:disabled) { filter:brightness(1.06); }
.wc-primary:disabled { opacity:.5; cursor:not-allowed; }
.wc-ghost { background:#fff; color:var(--wc-text); border:1px solid var(--wc-border-strong); }
.wc-ghost:hover:not(:disabled) { border-color:var(--wc-accent); }
.wc-ghost:disabled { opacity:.5; cursor:not-allowed; }
.wc-modes { display:inline-flex; gap:4px; padding:4px; border-radius:10px; background:var(--wc-soft); border:1px solid var(--wc-border-strong); }
.wc-mode { font-size:.82rem; font-weight:600; font-family:inherit; padding:6px 15px; border-radius:7px; border:none;
  background:transparent; color:var(--wc-muted); cursor:pointer; transition:background .15s ease, color .15s ease; }
.wc-mode.is-on { background:var(--wc-accent); color:#fff; }
.wc-mode:focus-visible { outline:2px solid var(--wc-accent); outline-offset:2px; }
.wc-try { display:flex; flex-direction:column; gap:.55rem; padding:.9rem 1rem; border-radius:12px;
  background:var(--wc-accent-weak); border:1px dashed var(--wc-accent); }
.wc-try-lbl { margin:0; font-size:.9rem; font-weight:700; color:var(--wc-text); }
.wc-examples { display:flex; flex-wrap:wrap; gap:9px; }
.wc-ex { display:inline-flex; align-items:center; gap:8px; font-size:.86rem; font-weight:600; font-family:inherit;
  color:var(--wc-text); cursor:pointer; background:#fff; border:1.5px solid var(--wc-accent); border-radius:10px;
  padding:9px 15px; transition:background .18s ease, transform .12s ease, box-shadow .18s ease; }
.wc-ex:hover:not(:disabled) { background:var(--wc-accent-weak); box-shadow:0 3px 10px -4px var(--wc-accent); transform:translateY(-1px); }
.wc-ex:disabled { opacity:.5; cursor:not-allowed; }
.wc-ex:focus-visible { outline:2px solid var(--wc-accent); outline-offset:2px; }
.wc-ex-ico { color:var(--wc-accent); display:inline-flex; }
.wc-ex-ico svg { width:16px; height:16px; display:block; }

.wc-pipe { display:flex; align-items:flex-start; margin:1.7rem 0 .3rem; overflow-x:auto; padding-bottom:6px; -webkit-overflow-scrolling:touch; }
.wc-node { flex:1 0 118px; min-width:118px; display:flex; flex-direction:column; align-items:center; text-align:center; gap:.35rem; padding:.2rem; }
.wc-node-box { width:46px; height:46px; border-radius:12px; display:flex; align-items:center; justify-content:center;
  background:#fff; border:1.5px solid var(--wc-border-strong); color:var(--wc-muted);
  transition:border-color .3s ease, color .3s ease, background .3s ease, box-shadow .3s ease; }
.wc-node-box svg { width:22px; height:22px; }
.wc-node-label { font-size:.8rem; font-weight:600; color:var(--wc-text); line-height:1.2; }
.wc-node-sub { font-family:var(--font-mono); font-size:.63rem; color:var(--wc-muted); }
.wc-node.is-done .wc-node-box, .wc-node.is-active .wc-node-box {
  border-color:var(--wc-accent); color:var(--wc-accent); background:var(--wc-accent-weak); }
.wc-node.is-active .wc-node-box { animation:wcPulse 1s ease-in-out infinite; }
@keyframes wcPulse { 0%,100%{ box-shadow:0 0 0 3px var(--wc-accent-weak);} 50%{ box-shadow:0 0 0 9px transparent;} }

.wc-conn { flex:1 1 26px; min-width:22px; height:2px; margin-top:24px; position:relative; background:var(--wc-border-strong); border-radius:2px; }
.wc-conn.is-filled { background:var(--wc-accent); }
.wc-dot { position:absolute; top:-3px; left:0; width:8px; height:8px; border-radius:50%; background:var(--wc-accent); box-shadow:0 0 8px var(--wc-accent); opacity:0; }
.wc-conn.is-flowing .wc-dot { animation:wcDot .5s linear; }
@keyframes wcDot { 0%{ left:0; opacity:1;} 100%{ left:100%; opacity:1;} }

.wc-status { display:flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:.78rem; color:var(--wc-muted); margin-top:1.1rem; }
.wc-spin { width:14px; height:14px; border-radius:50%; border:2px solid var(--wc-border-strong); border-top-color:var(--wc-accent); animation:wcSpin .7s linear infinite; }
@keyframes wcSpin { to { transform:rotate(360deg); } }
.wc-error { margin-top:1rem; padding:.7rem .9rem; border-radius:9px; font-size:.85rem; color:#9f1239; background:#fce7ec; border:1px solid #f5b5c4; }

.wc-result { margin-top:1.4rem; border-top:1px dashed var(--wc-border-strong); padding-top:1.3rem; animation:wcReveal .4s ease both; }
@keyframes wcReveal { from{ opacity:0; transform:translateY(8px);} to{ opacity:1; transform:none;} }
.wc-res-badges { display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:.6rem; }
.wc-res-badge { font-family:var(--font-mono); font-size:.72rem; font-weight:700; padding:3px 11px; border-radius:999px; }
.wc-res-lang { font-family:var(--font-mono); font-size:.72rem; color:var(--wc-muted); }
.wc-res-lbl { font-family:var(--font-mono); font-size:.66rem; letter-spacing:.09em; text-transform:uppercase; color:var(--wc-muted); margin:0 0 .4rem; }
.wc-res-keys { margin:0 0 1.1rem; padding-left:1.1rem; color:var(--wc-text); font-size:.9rem; line-height:1.6; }
.wc-res-reply { position:relative; border:1px solid var(--wc-border-strong); border-radius:10px; background:var(--wc-soft);
  padding:.85rem .9rem; white-space:pre-wrap; color:var(--wc-text); font-size:.9rem; line-height:1.55; }
.wc-res-copy { position:absolute; top:8px; right:8px; font-family:var(--font-mono); font-size:.68rem; padding:3px 9px;
  border-radius:6px; cursor:pointer; color:var(--wc-text); background:#fff; border:1px solid var(--wc-border-strong); }
.wc-res-copy:hover { border-color:var(--wc-accent); }
.wc-res-json { margin:0; padding:.85rem .9rem; border:1px solid var(--wc-border-strong); border-radius:10px;
  background:var(--wc-soft); color:var(--wc-text); font-family:var(--font-mono); font-size:.78rem; line-height:1.5;
  white-space:pre-wrap; overflow-x:auto; }
.wc-mr-title { font-size:1.1rem; font-weight:800; color:var(--wc-text); margin:0 0 .4rem; }
.wc-mr-resume { color:var(--wc-text); line-height:1.6; margin:0 0 1.1rem; font-size:.92rem; }
.wc-mr-tablewrap { overflow-x:auto; margin:0 0 1.1rem; }
.wc-mr-table { width:100%; border-collapse:collapse; font-size:.85rem; }
.wc-mr-table th, .wc-mr-table td { text-align:left; padding:.5rem .7rem; border-bottom:1px solid var(--wc-border); vertical-align:top; }
.wc-mr-table th { font-family:var(--font-mono); font-size:.68rem; text-transform:uppercase; letter-spacing:.06em; color:var(--wc-muted); }
.wc-mr-table td { color:var(--wc-text); }
.wc-mr-transcript { margin-top:.4rem; border:1px solid var(--wc-border-strong); border-radius:10px; background:var(--wc-soft); padding:.6rem .9rem; }
.wc-mr-transcript summary { cursor:pointer; font-family:var(--font-mono); font-size:.78rem; color:var(--wc-accent); font-weight:600; }
.wc-mr-transcript p { margin:.7rem 0 0; white-space:pre-wrap; color:var(--wc-text); font-size:.86rem; line-height:1.55; }

.wc-rebound { margin-top:1.3rem; border:1px solid var(--wc-border-strong); border-left:3px solid var(--wc-accent);
  border-radius:12px; background:var(--wc-soft); padding:1rem 1.1rem; animation:wcRebound .45s ease both; }
@keyframes wcRebound { from{ opacity:0; transform:translateY(10px);} to{ opacity:1; transform:none;} }
.wc-rebound-t { font-size:.95rem; font-weight:700; color:var(--wc-text); margin:0 0 .7rem; }
.wc-rebound-btns { display:flex; flex-wrap:wrap; gap:8px; }
.wc-rebound-btn { display:inline-flex; align-items:center; gap:7px; font-size:.82rem; font-weight:600; font-family:inherit;
  color:var(--wc-accent); background:#fff; border:1px solid var(--wc-accent); border-radius:9px; padding:7px 13px; cursor:pointer; }
.wc-rebound-btn:hover { background:var(--wc-accent-weak); }
.wc-rebound-btn svg { width:15px; height:15px; }

@media (prefers-reduced-motion: reduce) {
  .wc-back { transition:none; }
  .wc-node.is-active .wc-node-box { animation:none; }
  .wc-conn.is-flowing .wc-dot { animation:none; opacity:0; }
  .wc-spin { animation:none; }
  .wc-result, .wc-rebound { animation:none; }
}
`;
