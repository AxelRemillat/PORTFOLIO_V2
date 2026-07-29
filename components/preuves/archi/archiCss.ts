// Style « fiche technique / blueprint » des pages architecture — volontairement
// distinct du reste du site (fond quadrillé teinté accent, kickers mono, rail de
// specs). Variables --ac* posées sur .ap-root (thème par projet).
export const ARCHI_CSS = `
.ap-root { position:relative; min-height:100vh; background:var(--color-bg); overflow:hidden;
  padding:8vh clamp(1.25rem,5vw,3rem) 14vh; }
.ap-inner { position:relative; z-index:1; max-width:1000px; margin:0 auto; }
.ap-back { font-family:var(--font-mono); font-size:.8rem; color:var(--color-muted); text-decoration:none;
  display:inline-block; margin-bottom:2.5rem; transition:color .2s ease; }
.ap-back:hover { color:#fff; }
.ap-kicker { display:flex; align-items:center; gap:9px; font-family:var(--font-mono); font-size:.72rem;
  letter-spacing:.12em; text-transform:uppercase; color:var(--ac); margin-bottom:1rem; }
.ap-sdot { width:8px; height:8px; border-radius:50%; background:var(--ac-state); box-shadow:0 0 8px var(--ac-state); }
.ap-sep { color:var(--color-muted); }
.ap-h1 { font-size:clamp(2.2rem,5vw,3.2rem); font-weight:900; color:#fff; line-height:1.05; margin:0 0 .8rem; }
.ap-tag { font-size:1.05rem; color:rgba(255,255,255,0.6); max-width:640px; line-height:1.55; margin:0 0 3rem; }
.ap-grid { display:grid; grid-template-columns:1fr; gap:2.5rem; }
@media (min-width:900px){ .ap-grid { grid-template-columns:1fr 262px; gap:3.2rem; align-items:start; } }
.ap-seclabel { font-family:var(--font-mono); font-size:.72rem; letter-spacing:.12em; text-transform:uppercase;
  color:var(--ac); margin:0 0 .9rem; }
.ap-sec { border-top:1px solid rgba(255,255,255,0.08); padding-top:1.5rem; margin-top:2rem; }
.ap-sectext { color:#c7cede; line-height:1.7; margin:0; font-size:.96rem; }
.ap-rail { position:relative; }
@media (min-width:900px){ .ap-rail { position:sticky; top:88px; } }
.ap-spec { border:1px solid rgba(255,255,255,0.09); border-radius:14px; padding:1.1rem 1.2rem;
  background:linear-gradient(160deg, rgba(24,24,38,0.7), rgba(12,12,20,0.7)); }
.ap-spec-row { display:flex; align-items:center; justify-content:space-between; font-family:var(--font-mono);
  font-size:.78rem; color:#94a3b8; padding-bottom:.9rem; margin-bottom:.9rem; border-bottom:1px solid rgba(255,255,255,0.07); }
.ap-spec-row b { font-weight:700; }
.ap-spec-stack { display:flex; flex-wrap:wrap; gap:7px; }
.ap-chip { font-family:var(--font-mono); font-size:.7rem; color:#dbe2ee; border:1px solid var(--ac-line);
  background:var(--ac-weak); border-radius:6px; padding:3px 9px; }
.ap-ctas { display:flex; flex-direction:column; gap:10px; margin-top:1.2rem; }
.ap-cta1 { text-align:center; font-size:.85rem; font-weight:700; padding:11px 16px; border-radius:10px;
  text-decoration:none; color:#0a0a0a; background:var(--ac); transition:filter .2s ease; }
.ap-cta1:hover { filter:brightness(1.08); }
.ap-cta2 { text-align:center; font-size:.82rem; font-weight:600; padding:11px 16px; border-radius:10px;
  text-decoration:none; color:#e2e8f0; border:1px solid var(--ac-line); background:var(--ac-weak); transition:background .2s ease; }
.ap-cta2:hover { background:rgba(255,255,255,0.06); }
`;
