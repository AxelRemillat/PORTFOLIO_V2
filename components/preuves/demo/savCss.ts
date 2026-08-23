// Styles de l'onglet « SAV » (réponse sourcée RAG). Injecté par SavResult via
// <style>. Accent cyan via --wc-accent (propagé par la carte). S'appuie sur les
// variables --wc-* et les classes partagées .wc-res-* (thème clair).
export const SAV_CSS = `
.wc-sav-banner { display:flex; align-items:center; gap:.6rem; padding:.85rem 1rem; border-radius:12px;
  font-size:.92rem; font-weight:600; margin:0 0 1.3rem; border:1.5px solid; }
.wc-sav-banner-ico { font-size:1.15rem; font-weight:800; flex-shrink:0; line-height:1; }
.wc-sav-banner.is-ok { background:#e6f7fb; border-color:#7cccdd; color:#0b6b80; }
.wc-sav-banner.is-warn { background:#fff5e6; border-color:#f0b661; color:#a15c00; }
.wc-sav-sources { display:flex; flex-wrap:wrap; gap:8px; margin:0 0 1.4rem; }
.wc-sav-chip { display:inline-flex; align-items:center; gap:7px; font-size:.82rem; color:var(--wc-text);
  background:var(--wc-accent-weak); border:1px solid var(--wc-accent); border-radius:999px; padding:5px 12px; }
.wc-sav-chip code { font-family:var(--font-mono); font-size:.72rem; font-weight:700; color:var(--wc-accent); }
.wc-sav-extraits { margin-top:.4rem; border:1px solid var(--wc-border-strong); border-radius:10px;
  background:var(--wc-soft); padding:.6rem .9rem; }
.wc-sav-extraits summary { cursor:pointer; font-family:var(--font-mono); font-size:.78rem; color:var(--wc-accent); font-weight:600; }
.wc-sav-extraits ul { list-style:none; margin:.7rem 0 0; padding:0; display:flex; flex-direction:column; gap:.45rem; }
.wc-sav-extraits li { display:flex; align-items:center; gap:9px; flex-wrap:wrap; font-size:.84rem; color:var(--wc-text); }
.wc-sav-ex-id { font-family:var(--font-mono); font-size:.72rem; font-weight:700; color:var(--wc-muted); flex-shrink:0; }
.wc-sav-ex-score { font-family:var(--font-mono); font-size:.72rem; color:var(--wc-muted); margin-left:auto; }

/* ── Chat conversationnel (onglet SAV) ─────────────────────────────────────── */
.wc-chat-ctx { display:flex; flex-wrap:wrap; gap:.6rem 1rem; align-items:center; justify-content:space-between;
  padding:0 0 1rem; margin:0 0 1rem; border-bottom:1px solid var(--wc-border); }
.wc-chat-ctx-t { margin:0 0 .2rem; font-size:.92rem; color:var(--wc-text); }
.wc-chat-ctx-s { margin:0; font-size:.8rem; color:var(--wc-muted); }
.wc-chat-pill { flex-shrink:0; font-family:var(--font-mono); font-size:.7rem; font-weight:700; color:var(--wc-accent);
  background:var(--wc-accent-weak); border:1px solid var(--wc-accent); border-radius:999px; padding:5px 11px; }
.wc-chat-log { height:min(56vh, 440px); min-height:280px; overflow-y:auto; display:flex; flex-direction:column; gap:.8rem;
  padding:.4rem .2rem; scrollbar-width:thin; scrollbar-color:rgba(120,100,85,.4) transparent; }
.wc-chat-log::-webkit-scrollbar { width:9px; }
.wc-chat-log::-webkit-scrollbar-thumb { background:rgba(120,100,85,.38); border-radius:99px; border:2px solid transparent; background-clip:padding-box; }
.wc-chat-row { display:flex; gap:9px; align-items:flex-end; }
.wc-chat-row.is-user { justify-content:flex-end; }
.wc-chat-avatar { flex-shrink:0; width:28px; height:28px; border-radius:50%; display:grid; place-items:center;
  font-size:.9rem; background:var(--wc-accent-weak); border:1px solid var(--wc-accent); }
.wc-chat-bubble { max-width:80%; padding:.6rem .85rem; border-radius:14px; font-size:.9rem; line-height:1.5;
  white-space:pre-wrap; word-break:break-word; }
.wc-chat-bubble.is-user { background:#0b6b80; color:#fff; border-bottom-right-radius:4px; }
.wc-chat-bubble.is-bot { background:#fff; border:1px solid var(--wc-border-strong); color:var(--wc-text); border-bottom-left-radius:4px; }
.wc-chat-bubble.is-err { background:#fff5e6; border-color:#f0b661; color:#a15c00; }
.wc-chat-foot { margin-top:.55rem; padding-top:.5rem; border-top:1px dashed var(--wc-border); display:flex;
  flex-direction:column; gap:.5rem; }
.wc-chat-src { display:flex; flex-wrap:wrap; gap:6px; align-items:center; }
.wc-chat-badge { font-family:var(--font-mono); font-size:.7rem; font-weight:700; border-radius:999px; padding:2px 9px; }
.wc-chat-badge.is-ok { color:#0f7a45; background:#eefaf2; border:1px solid #7fd0a3; }
.wc-chat-badge.is-warn { color:#a15c00; background:#fff5e6; border:1px solid #f0b661; }
.wc-chat-extraits { padding:.45rem .7rem; }
.wc-chat-extraits summary { font-size:.72rem; }
.wc-chat-typing { display:flex; gap:5px; align-items:center; }
.wc-chat-typing span { width:7px; height:7px; border-radius:50%; background:var(--wc-muted); animation:wcTyping 1s infinite ease-in-out; }
.wc-chat-typing span:nth-child(2) { animation-delay:.15s; }
.wc-chat-typing span:nth-child(3) { animation-delay:.3s; }
@keyframes wcTyping { 0%,60%,100% { opacity:.3; transform:translateY(0); } 30% { opacity:1; transform:translateY(-3px); } }
.wc-chat-suggs { display:flex; flex-wrap:wrap; gap:8px; margin:.9rem 0 .7rem; }
.wc-chat-sugg { font-size:.82rem; color:var(--wc-accent); background:#fff; border:1px solid var(--wc-accent);
  border-radius:999px; padding:6px 13px; cursor:pointer; font-family:inherit; }
.wc-chat-sugg:hover:not(:disabled) { background:var(--wc-accent-weak); }
.wc-chat-sugg:disabled { opacity:.5; cursor:not-allowed; }
.wc-chat-input { display:flex; gap:9px; align-items:flex-end; }
.wc-chat-field { flex:1; min-width:0; resize:none; font-family:inherit; font-size:.9rem; line-height:1.5;
  color:var(--wc-text); background:var(--wc-soft); border:1px solid var(--wc-border-strong); border-radius:12px;
  padding:.7rem .9rem; }
.wc-chat-field:focus-visible { outline:2px solid var(--wc-accent); outline-offset:1px; }
.wc-chat-send { flex-shrink:0; font-size:.9rem; font-weight:700; font-family:inherit; color:#fff;
  background:var(--wc-accent); border:none; border-radius:12px; padding:.7rem 1.2rem; cursor:pointer; }
.wc-chat-send:disabled { opacity:.5; cursor:not-allowed; }
.wc-chat .wc-pipe { margin:.2rem 0 1.1rem; }
.wc-chat-srclbl { font-family:var(--font-mono); font-size:.66rem; text-transform:uppercase; letter-spacing:.06em; color:var(--wc-muted); }
.wc-conf { display:flex; align-items:center; gap:8px; }
.wc-conf-lbl { font-family:var(--font-mono); font-size:.72rem; font-weight:700; }
.wc-conf-bar { width:56px; height:6px; border-radius:99px; background:var(--wc-border); overflow:hidden; }
.wc-conf-fill { height:100%; border-radius:99px; }
.wc-conf.is-hi .wc-conf-lbl { color:#0f7a45; } .wc-conf.is-hi .wc-conf-fill { background:#2ea05a; }
.wc-conf.is-mid .wc-conf-lbl { color:#a15c00; } .wc-conf.is-mid .wc-conf-fill { background:#e6a23c; }
.wc-conf.is-lo .wc-conf-lbl { color:#b23c17; } .wc-conf.is-lo .wc-conf-fill { background:#e0714a; }
@media (max-width:640px) { .wc-chat-bubble { max-width:88%; } }
@media (prefers-reduced-motion: reduce) { .wc-chat-typing span { animation:none; opacity:.6; } }
`;
