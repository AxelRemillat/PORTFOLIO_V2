// Styles de la page /preuves : cards « verre premium » (fini le néon qui pulse et
// la bordure épaisse), fenêtre produit + bande de flux d'architecture. Accent
// piloté par les variables --pv-* posées sur chaque card (thème par projet).
export const PREUVES_CSS = `
.pv-card { position:relative; display:flex; overflow:hidden; border-radius:18px;
  border:1px solid rgba(255,255,255,0.08);
  background:linear-gradient(160deg, rgba(20,20,32,0.9) 0%, rgba(11,11,19,0.94) 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 34px 70px -34px rgba(0,0,0,0.9);
  transition:border-color .3s ease, box-shadow .3s ease; }
.pv-card:hover { border-color:var(--pv-accent-line);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.07), 0 40px 80px -32px rgba(0,0,0,0.92), 0 0 46px var(--pv-accent-glow); }
.pv-card::before { content:""; position:absolute; inset:0; pointer-events:none; z-index:0;
  background:radial-gradient(58% 90% at 100% 28%, var(--pv-accent-glow), transparent 60%); }
.pv-info { position:relative; z-index:1; flex:0 1 52%; padding:2.2rem; display:flex; flex-direction:column; }
.pv-window { position:relative; z-index:1; flex:0 1 48%; padding:1.6rem 1.7rem 1.6rem 0.4rem; display:flex; align-items:center; }
.pv-head { display:flex; align-items:center; justify-content:space-between; }
.pv-num { font-family:var(--font-mono); font-size:0.72rem; color:var(--color-muted); letter-spacing:.12em; }
.pv-status { display:inline-flex; align-items:center; gap:7px; font-family:var(--font-mono);
  font-size:0.68rem; font-weight:700; letter-spacing:.03em; text-transform:uppercase;
  padding:4px 11px; border-radius:999px; border:1px solid var(--pv-state-b); background:var(--pv-state-bg); color:var(--pv-state); }
.pv-dot { width:7px; height:7px; border-radius:50%; background:var(--pv-state); flex-shrink:0; }
.pv-live .pv-dot { animation:pvPulse 1.6s ease-in-out infinite; }
@keyframes pvPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.35;transform:scale(.72);} }
.pv-title { font-size:1.55rem; font-weight:800; color:#fff; line-height:1.2; margin:1rem 0 .55rem; }
.pv-tag { font-size:0.9rem; line-height:1.6; color:rgba(255,255,255,0.6); margin:0; }
.pv-stack { display:flex; flex-wrap:wrap; gap:7px; margin:1.25rem 0 1.5rem; }
.pv-chip { font-family:var(--font-mono); font-size:0.7rem; padding:3px 10px; border-radius:6px;
  background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.09); color:#c7cede; }
.pv-ctas { display:flex; flex-wrap:wrap; gap:10px; margin-top:auto; }
.pv-cta1 { font-size:0.84rem; font-weight:700; padding:9px 18px; border-radius:9px; text-decoration:none;
  color:#0a0a0a; background:var(--pv-accent); transition:filter .2s ease, transform .2s ease; }
.pv-cta1:hover { filter:brightness(1.08); transform:translateY(-1px); }
.pv-cta2 { font-size:0.84rem; font-weight:600; padding:9px 18px; border-radius:9px; text-decoration:none;
  color:#e2e8f0; border:1px solid rgba(255,255,255,0.14); background:rgba(255,255,255,0.03);
  transition:border-color .2s ease, background .2s ease; }
.pv-cta2:hover { border-color:var(--pv-accent-line); background:rgba(255,255,255,0.06); }

.pv-win { width:100%; border-radius:12px; overflow:hidden; border:1px solid rgba(255,255,255,0.09);
  background:linear-gradient(160deg, rgba(28,28,42,0.72), rgba(12,12,20,0.72));
  box-shadow:0 22px 46px -26px rgba(0,0,0,0.85); }
.pv-bar { display:flex; align-items:center; gap:8px; padding:.5rem .7rem;
  border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.02);
  font-family:var(--font-mono); font-size:10px; letter-spacing:.03em; color:#9aa3b5; }
.pv-bdot { width:8px; height:8px; border-radius:3px; background:var(--pv-accent); box-shadow:0 0 8px var(--pv-accent-glow); flex-shrink:0; }

.pv-flow-wrap { padding:.55rem .7rem .65rem; border-top:1px dashed rgba(255,255,255,0.09); }
.pv-flow-dash { stroke:var(--pv-accent); stroke-width:1.6; stroke-linecap:round; stroke-dasharray:4 46;
  animation:pvFlow 2.6s linear infinite; filter:drop-shadow(0 0 3px var(--pv-accent)); }
@keyframes pvFlow { to { stroke-dashoffset:-50; } }
.pv-fnode { fill:#0b0b14; stroke:var(--pv-accent); stroke-width:1.1; }
.pv-flabel { fill:#d6ddea; font-family:var(--font-mono); font-size:8.5px; letter-spacing:-0.2px; }

@media (prefers-reduced-motion: reduce) { .pv-live .pv-dot, .pv-flow-dash { animation:none; } }
@media (max-width: 860px) {
  .pv-card { flex-direction:column; }
  .pv-info { flex-basis:auto; padding:1.7rem 1.7rem 0.5rem; }
  .pv-window { flex-basis:auto; padding:0.8rem 1.7rem 1.7rem; }
}
`;
