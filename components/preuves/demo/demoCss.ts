// Styles de la démo tri d'email. Réutilise les tokens du site (surface, border,
// muted, mono) + l'accent de la page (var(--ac), émeraude sur /preuves/n8n).
export const DEMO_CSS = `
.etd { margin:2.6rem 0; }
.etd-title { font-size:1.3rem; font-weight:800; color:#fff; margin:.6rem 0 .3rem; }
.etd-lead { color:var(--color-muted); font-size:.92rem; margin:0 0 1.2rem; line-height:1.5; }
.etd-form { display:flex; flex-direction:column; gap:.7rem; }
.etd-ta { width:100%; min-height:150px; resize:vertical; border-radius:10px; padding:.8rem .9rem;
  background:var(--color-surface); border:1px solid var(--color-border); color:var(--color-text);
  font-size:.9rem; line-height:1.5; font-family:inherit; transition:border-color .2s ease; }
.etd-ta:focus { outline:none; border-color:var(--ac); }
.etd-hp { position:absolute; left:-9999px; width:1px; height:1px; opacity:0; overflow:hidden; }
.etd-actions { display:flex; flex-wrap:wrap; gap:10px; }
.etd-btn { font-size:.85rem; font-weight:600; padding:9px 16px; border-radius:9px; cursor:pointer;
  font-family:inherit; transition:filter .2s ease, background .2s ease, border-color .2s ease; }
.etd-primary { background:var(--ac); color:#0a0a0a; border:none; font-weight:700; }
.etd-primary:hover:not(:disabled) { filter:brightness(1.08); }
.etd-primary:disabled { opacity:.55; cursor:not-allowed; }
.etd-ghost { background:transparent; color:var(--color-text); border:1px solid var(--color-border); }
.etd-ghost:hover:not(:disabled) { border-color:var(--ac); }
.etd-ghost:disabled { opacity:.55; cursor:not-allowed; }
.etd-spin { width:14px; height:14px; border-radius:50%; border:2px solid rgba(0,0,0,0.3);
  border-top-color:#0a0a0a; display:inline-block; vertical-align:-2px; margin-right:7px;
  animation:etdSpin .7s linear infinite; }
@keyframes etdSpin { to { transform:rotate(360deg); } }
.etd-error { margin-top:1rem; padding:.7rem .9rem; border-radius:9px; font-size:.85rem;
  color:#fecaca; background:rgba(239,68,68,0.1); border:1px solid rgba(239,68,68,0.3); }
.etd-result { margin-top:1.4rem; border:1px solid var(--color-border); border-radius:14px;
  background:var(--color-surface); padding:1.2rem; display:flex; flex-direction:column; gap:1rem; }
.etd-badges { display:flex; flex-wrap:wrap; gap:8px; align-items:center; }
.etd-badge { font-family:var(--font-mono); font-size:.72rem; font-weight:700; padding:3px 11px; border-radius:999px; }
.etd-just { font-size:.82rem; color:var(--color-muted); margin:0; }
.etd-lbl { font-family:var(--font-mono); font-size:.68rem; letter-spacing:.1em; text-transform:uppercase;
  color:var(--ac); margin:0 0 .4rem; }
.etd-keys { margin:0; padding-left:1.1rem; color:var(--color-text); font-size:.88rem; line-height:1.6; }
.etd-reply { position:relative; border:1px solid var(--color-border); border-radius:10px;
  background:rgba(255,255,255,0.02); padding:.85rem .9rem; white-space:pre-wrap; color:var(--color-text);
  font-size:.88rem; line-height:1.55; }
.etd-copy { position:absolute; top:8px; right:8px; font-family:var(--font-mono); font-size:.68rem;
  padding:3px 9px; border-radius:6px; cursor:pointer; color:var(--color-text);
  background:var(--ac-weak); border:1px solid var(--color-border); }
.etd-copy:hover { border-color:var(--ac); }
.etd-lang { font-family:var(--font-mono); font-size:.72rem; color:var(--color-muted); }
.etd-how { margin-top:1.6rem; border-top:1px solid rgba(255,255,255,0.08); padding-top:1.2rem; }
.etd-how-steps { display:flex; flex-wrap:wrap; gap:.6rem 1.4rem; margin:.6rem 0 1rem; padding:0; list-style:none; }
.etd-how-steps li { font-family:var(--font-mono); font-size:.78rem; color:#c7cede; display:flex; align-items:center; gap:8px; }
.etd-how-steps b { color:var(--ac); }
.etd-shot { border:1px dashed var(--color-border); border-radius:10px; padding:1.6rem; text-align:center;
  color:var(--color-muted); font-size:.8rem; font-family:var(--font-mono); }
@media (prefers-reduced-motion: reduce) { .etd-spin { animation:none; } .etd-ta { transition:none; } }
`;
