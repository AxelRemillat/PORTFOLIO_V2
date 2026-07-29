// Styles partagés de la scène HUD : verre premium, chrome de fenêtre, profondeur,
// flottement / entrée / parallaxe, positionnement en perspective (façon Better
// Stack, la grappe déborde à droite). Injecté une fois par HeroScene ; les détails
// propres à chaque panneau restent dans leurs fichiers respectifs.
export const SCENE_CSS = `
.hs-wrap { position:relative; width:100%; height:min(86vh,660px); }
.hs-enter { position:absolute; opacity:0; animation: hsIn .85s cubic-bezier(.16,1,.3,1) both; }
@keyframes hsIn { from{opacity:0;transform:translateY(28px) rotate(1.4deg);} to{opacity:1;transform:none;} }
.hs-parallax { will-change:transform; }
.hs-float { animation: hsFloat 7s ease-in-out infinite; }
.hs-float-2 { animation-duration:8.6s; animation-delay:-2.2s; }
.hs-float-3 { animation-duration:6.4s; animation-delay:-1.1s; }
@keyframes hsFloat { 0%,100%{transform:translateY(-8px) rotate(-.4deg);} 50%{transform:translateY(8px) rotate(.4deg);} }

.hs-panel {
  position:relative; display:flex; flex-direction:column; overflow:hidden;
  text-decoration:none; cursor:pointer; border-radius:16px;
  border:1px solid rgba(255,255,255,0.08);
  background:linear-gradient(158deg, rgba(26,26,41,0.92) 0%, rgba(12,12,21,0.95) 100%);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.06),
              0 34px 64px -30px rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.5);
  -webkit-backdrop-filter:blur(11px) saturate(1.15); backdrop-filter:blur(11px) saturate(1.15);
  transition:transform .4s cubic-bezier(.16,1,.3,1), border-color .3s ease, box-shadow .3s ease;
}
.hs-panel:hover { border-color:rgba(249,115,22,0.42);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.09),
              0 40px 76px -28px rgba(0,0,0,0.95), 0 0 46px rgba(249,115,22,0.14); }
.hs-bar { display:flex; align-items:center; gap:9px; padding:.6rem .8rem;
  border-bottom:1px solid rgba(255,255,255,0.06); background:rgba(255,255,255,0.018); }
.hs-title { font-family:var(--font-mono); font-size:11px; letter-spacing:.02em; color:#9aa3b5; white-space:nowrap; }
.hs-spacer { margin-left:auto; }
.hs-chip { font-family:var(--font-mono); font-size:10px; letter-spacing:.04em;
  padding:2px 8px; border-radius:999px; display:inline-flex; align-items:center; gap:5px; }

/* Positions + inclinaison (desktop) — cascade : OPS dépasse en haut, n8n en bas,
   VEGA devant à droite (déborde). Perspective par panneau (robuste au nesting). */
.hs-pos-vega { top:17%; right:-11%; z-index:3; width:min(348px,92%); }
.hs-pos-ops  { top:-5%; right:30%; z-index:2; width:min(236px,58%); }
.hs-pos-flow { top:60%; right:32%; z-index:1; width:min(228px,56%); }
.hs-pos-vega .hs-panel { transform:perspective(1500px) rotateY(-15deg) rotateX(4deg); }
.hs-pos-ops  .hs-panel { transform:perspective(1500px) rotateY(-16deg) rotateX(5deg); }
.hs-pos-flow .hs-panel { transform:perspective(1500px) rotateY(-12deg) rotateX(3deg); }
.hs-pos-vega .hs-panel:hover,
.hs-pos-ops  .hs-panel:hover,
.hs-pos-flow .hs-panel:hover { transform:perspective(1500px) rotateY(-3deg) rotateX(1deg) scale(1.03); z-index:4; }

@media (prefers-reduced-motion: reduce) {
  .hs-enter { animation:none; opacity:1; }
  .hs-float { animation:none; }
}
@media (max-width: 899px) {
  .hs-wrap { height:auto; display:flex; justify-content:center; padding-top:.5rem; }
  .hs-pos-ops, .hs-pos-flow { display:none; }
  .hs-enter, .hs-pos-vega { position:static; }
  .hs-pos-vega { width:min(360px,94%); }
  .hs-pos-vega .hs-panel { transform:none; }
  .hs-float { animation:none; }
}
`;
