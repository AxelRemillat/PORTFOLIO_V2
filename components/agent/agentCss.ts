// Styles de la démo « Agent devis » (/agent). Injecté par AgentDemo en plus de
// WORKFLOW_CSS (tokens --wc-* + classes wc-card/btn/mr-table/res-reply). Accent rose
// local --ag, appliqué à l'en-tête d'identité ET à la carte de démo.
export const AGENT_CSS = `
.ag-id, .ag-card { --ag:#ec4899; --ag-weak:#ec489922; }

/* Identité entreprise (discret) + bot OSCAR (voyant) */
.ag-id { margin:.6rem 0 1.4rem; display:flex; flex-direction:column; gap:.85rem; }
.ag-brand-block { display:flex; flex-direction:column; gap:.55rem; }
.ag-brand { display:flex; align-items:center; gap:12px; }
.ag-brand-mark { width:46px; height:46px; border-radius:12px; display:grid; place-items:center; color:#fff; background:linear-gradient(135deg,#3b5bdb,#1e40af); box-shadow:0 4px 14px rgba(30,64,175,.28); }
.ag-brand-word { font-size:1.5rem; font-weight:900; letter-spacing:-.015em; color:#1e293b; }
.ag-brand-word span { color:#2563eb; }
.ag-brand-line { margin:0; font-size:1rem; font-weight:600; color:var(--wc-text); line-height:1.45; max-width:54ch; }
.ag-bot { display:flex; gap:14px; align-items:flex-start; padding:1rem 1.1rem; border-radius:14px; background:var(--ag-weak); border:1.5px solid var(--ag); }
.ag-bot-avatar { flex-shrink:0; width:46px; height:46px; border-radius:12px; display:grid; place-items:center; color:#fff; background:var(--ag); box-shadow:0 4px 14px #ec489955; }
.ag-bot-name { margin:0 0 .3rem; font-size:1.15rem; font-weight:900; color:var(--wc-text); display:flex; align-items:center; gap:9px; }
.ag-bot-tag { font-family:var(--font-mono); font-size:.6rem; font-weight:700; text-transform:uppercase; letter-spacing:.08em; color:#be185d; background:#fff; border:1px solid var(--ag); border-radius:999px; padding:2px 8px; }
.ag-bot-desc { margin:0; font-size:.9rem; line-height:1.55; color:var(--wc-text); }
.ag-bot-desc b { color:var(--ag); font-weight:700; }

.ag-seclabel { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.1em; text-transform:uppercase; color:var(--wc-muted); margin:1.5rem 0 .85rem; }

/* Trace séquentielle */
.ag-trace { display:flex; flex-direction:column; gap:.55rem; }
.ag-step { display:grid; grid-template-columns:34px 1fr; gap:11px; padding:.7rem .85rem; border-radius:12px; border:1px solid var(--wc-border-strong); background:#fff; animation:agIn .4s ease both; }
@keyframes agIn { from { opacity:0; transform:translateY(7px); } to { opacity:1; transform:none; } }
.ag-step-ico { width:34px; height:34px; border-radius:9px; display:grid; place-items:center; font-size:1rem; background:var(--wc-soft); }
.ag-step.t-reflexion { border-left:3px solid #94a3b8; }
.ag-step.t-outil { border-left:3px solid var(--ag); }
.ag-step.t-final { border-left:3px solid #0f7a45; }
.ag-step.t-final .ag-step-ico { background:#eefaf2; }
.ag-step-title { margin:0; font-size:.9rem; font-weight:700; color:var(--wc-text); }
.ag-step-arg { font-weight:500; color:var(--wc-muted); font-family:var(--font-mono); font-size:.8rem; }
.ag-step-detail { margin:.25rem 0 0; font-size:.85rem; color:var(--wc-muted); line-height:1.5; font-style:italic; }
.ag-step-res { margin:.35rem 0 0; font-size:.85rem; font-weight:600; color:#0f7a45; display:flex; align-items:center; gap:6px; }
/* Détail technique dépliable (accordéon grid-rows animé) */
.ag-step-more { display:inline-flex; align-items:center; gap:6px; margin-top:.55rem; font-size:.76rem; font-weight:700; font-family:var(--font-mono); color:var(--ag); background:none; border:none; padding:.15rem 0; cursor:pointer; }
.ag-step-more:hover { text-decoration:underline; }
.ag-chev { font-size:.7rem; }
.ag-tech-wrap { display:grid; grid-template-rows:0fr; transition:grid-template-rows .28s ease; }
.ag-tech-wrap.open { grid-template-rows:1fr; }
.ag-tech-inner { overflow:hidden; min-height:0; }
.ag-tech { margin-top:.6rem; padding:.85rem .95rem; border-radius:10px; background:#1c1922; border:1px solid #37313f; color:#e7e2ee; font-family:var(--font-mono); font-size:.76rem; line-height:1.55; }
.ag-tech-sig { margin:0 0 .55rem; color:#ffd7ec; font-weight:700; word-break:break-word; }
.ag-tech-fn { color:#f9a8d4; }
.ag-tech-desc { margin:0 0 .6rem; color:#c7bfd4; font-family:var(--font-sans, inherit); font-size:.82rem; line-height:1.5; }
.ag-tech-lbl { margin:.75rem 0 .3rem; font-size:.62rem; text-transform:uppercase; letter-spacing:.1em; color:#8b8397; }
.ag-json, .ag-pseudo { margin:0; padding:.6rem .7rem; border-radius:7px; background:#131017; color:#d7d0e0; overflow-x:auto; font-size:.73rem; line-height:1.55; white-space:pre; }
.ag-pseudo { color:#9ef0bf; }
@media (prefers-reduced-motion: reduce) { .ag-tech-wrap { transition:none; } }
.ag-think { display:flex; align-items:center; gap:7px; padding:.4rem .2rem; font-family:var(--font-mono); font-size:.82rem; color:var(--wc-muted); }
.ag-think-solo { padding:.8rem .2rem; }
.ag-think span { width:6px; height:6px; border-radius:50%; background:var(--ag); animation:agT 1s infinite ease-in-out; }
.ag-think span:nth-child(2) { animation-delay:.15s; } .ag-think span:nth-child(3) { animation-delay:.3s; }
@keyframes agT { 0%,60%,100% { opacity:.3; transform:translateY(0); } 30% { opacity:1; transform:translateY(-3px); } }

/* Résultat en sections empilées (toutes visibles) */
.ag-result { margin-top:1.4rem; }
.ag-section { margin:0 0 1.8rem; }
.ag-section:last-child { margin-bottom:0; }
.ag-section .ag-seclabel { margin-top:0; padding-bottom:.5rem; border-bottom:1px solid var(--wc-border); }

/* Devis */
.ag-devis { overflow-x:auto; margin:0 0 1rem; }
.ag-tot { display:flex; flex-direction:column; gap:.4rem; max-width:360px; margin:1rem 0 .6rem auto; }
.ag-tot > div { display:flex; justify-content:space-between; gap:1.5rem; font-size:.9rem; color:var(--wc-text); }
.ag-tot dt, .ag-tot dd { margin:0; } .ag-tot dd { font-variant-numeric:tabular-nums; }
.ag-ttc { border-top:2px solid var(--ag); padding-top:.5rem; margin-top:.2rem; }
.ag-ttc > * { font-size:1.05rem; font-weight:800; color:var(--ag); }
.ag-meta { font-family:var(--font-mono); font-size:.8rem; color:var(--wc-muted); margin:0; }
.ag-meta b { color:var(--wc-text); }

/* Calendrier */
.ag-cal-lead { font-size:.9rem; color:var(--wc-text); margin:0 0 .8rem; }
.ag-cal { display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:8px; }
.ag-cal-col { border:1px solid var(--wc-border-strong); border-radius:10px; overflow:hidden; background:#fff; min-height:94px; }
.ag-cal-col.has-slot { border-color:var(--ag); box-shadow:0 2px 10px #ec489922; }
.ag-cal-day { font-family:var(--font-mono); font-size:.66rem; text-transform:uppercase; letter-spacing:.04em; color:var(--wc-muted); text-align:center; padding:.4rem 0; border-bottom:1px solid var(--wc-border); background:var(--wc-soft); }
.ag-cal-slots { display:flex; flex-direction:column; gap:6px; padding:.6rem .35rem; align-items:center; }
.ag-cal-slot.is-proposed { font-size:.8rem; font-weight:700; color:#fff; background:var(--ag); border-radius:7px; padding:5px 9px; }
.ag-cal-slot.is-empty { color:var(--wc-border-strong); }
.ag-cal-note { font-size:.75rem; color:var(--wc-muted); margin:.8rem 0 0; font-style:italic; }

.ag-alt { display:flex; gap:.6rem; align-items:flex-start; padding:.85rem 1rem; border-radius:12px; margin:0 0 1.1rem; background:#fff5e6; border:1.5px solid #f0b661; color:#a15c00; font-size:.9rem; }
.ag-alt b { font-weight:800; }

/* Métiers : bandeau « catalogue d'exemple », catalogue repliable, lignes à chiffrer, questions */
.ag-sample { margin:0; padding:.7rem .95rem; border-radius:10px; background:#eff6ff; border:1.5px dashed #2563eb; color:#1e3a8a; font-size:.92rem; }
.ag-cat { margin-top:1rem; font-size:.88rem; color:var(--wc-text); }
.ag-cat summary { cursor:pointer; font-weight:700; color:var(--wc-muted); padding:.3rem 0; }
.ag-cat .ag-devis { margin-top:.6rem; max-height:320px; overflow:auto; }
.ag-todo td { color:#a15c00; font-style:italic; background:#fff9ef; }
.ag-qs { margin:0; padding-left:1.2rem; display:flex; flex-direction:column; gap:.45rem; font-size:.92rem; line-height:1.5; color:var(--wc-text); }

@media (max-width:560px) {
  .ag-cal-slot.is-proposed { padding:4px 6px; font-size:.72rem; }
  .ag-cal-day { font-size:.58rem; }
}
@media (prefers-reduced-motion: reduce) {
  .ag-step, .ag-tabpanel { animation:none; }
  .ag-think span { animation:none; opacity:.6; }
}
`;
