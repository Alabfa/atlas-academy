/* ============================================================
   utils.js — SHARED HELPERS & ICONS
   ------------------------------------------------------------
   Small utilities used by several views: formatting, shuffling,
   flag images with a fallback, the icon set, toasts, and the
   shared filter-chip / search / empty-state helpers.
   You rarely need to edit this file.
============================================================ */
const el = id => document.getElementById(id);
const fmt = n => n.toLocaleString("en-US");
const rnd = a => a[Math.floor(Math.random()*a.length)];
function shuffle(a){ a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }

/* Neutral fallback flag — shown if a flag image ever fails to load. */
const NOFLAG = "data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 45"><rect width="60" height="45" rx="4" fill="#f1eee5"/><circle cx="30" cy="22.5" r="11" fill="none" stroke="#a8a08c" stroke-width="2"/><path d="M19 22.5h22M30 11.5c4.5 3.5 4.5 18.5 0 22M30 11.5c-4.5 3.5-4.5 18.5 0 22" fill="none" stroke="#a8a08c" stroke-width="1.6"/></svg>');
function fimg(iso,w,alt,cls){
  return `<img src="${flagUrl(iso,w)}" alt="${alt}" ${cls?`class="${cls}"`:""} loading="lazy" onerror="this.onerror=null;this.src=NOFLAG">`;
}

/* ---------- Icon set ---------- */
const IC = {
home:'<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h5v-6h4v6h5V9.5"/>',
globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
flag:'<path d="M5 21V4"/><path d="M5 4c2.5-1.4 5-1.4 7.5 0s5 1.4 7.5 0v9c-2.5 1.4-5 1.4-7.5 0S7.5 11.6 5 13"/>',
compass:'<circle cx="12" cy="12" r="9"/><path d="m15 9-2 5-4 1 2-5z"/>',
book:'<path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z"/><path d="M20 17H6.5a2.5 2.5 0 0 0 0 5"/>',
quiz:'<circle cx="12" cy="12" r="9"/><path d="M9.3 9a2.8 2.8 0 1 1 3.9 2.6c-.8.34-1.2.9-1.2 1.9v.3"/><path d="M12 17.2h.01"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/>',
x:'<path d="M18 6 6 18M6 6l12 12"/>',
check:'<path d="M20 6 9 17l-5-5"/>',
right:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
left:'<path d="M19 12H5m6-6-6 6 6 6"/>',
refresh:'<path d="M3 12a9 9 0 1 0 2.6-6.4L3 8"/><path d="M3 3v5h5"/>',
trophy:'<path d="M8 21h8m-4-4v4M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M7 5H4a3 3 0 0 0 3 3.5M17 5h3a3 3 0 0 1-3 3.5"/>',
pin:'<path d="M12 21s-7-5.3-7-11a7 7 0 0 1 14 0c0 5.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/>',
shuffle:'<path d="M3 7h4l10 10h4"/><path d="m18 14 3 3-3 3"/><path d="M3 17h4l3.5-3.5"/><path d="M13.5 10.5 17 7h4"/><path d="m18 4 3 3-3 3"/>',
lock:'<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'
};
function ic(n,s=18){ return `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]}</svg>`; }
/* Directional icon — flips automatically in RTL layout. */
function dic(n,s=18){ return `<span class="dicon">${ic(n,s)}</span>`; }

/* ---------- Toast notification ---------- */
function toast(title, icon){
  const tEl = document.createElement("div");
  tEl.className = "toast";
  tEl.innerHTML = `<span class="ticon">${ic(icon,18)}</span><div><b>${t("ach_unlocked")}</b><span>${title}</span></div>`;
  el("toast-root").appendChild(tEl);
  setTimeout(()=>{ tEl.style.transition="opacity .4s, transform .4s"; tEl.style.opacity="0"; tEl.style.transform="translateY(10px)"; }, 3400);
  setTimeout(()=>tEl.remove(), 3900);
}

/* ---------- Shared view helpers ---------- */
/* Continent filter chips — used by Countries, Flags and Learn. */
function contChips(active, fn){
  return ["All",...CONTQ].map(c=>`<button class="chip ${active===c?"active":""}" onclick="${fn}('${c}')">${c==="All"?t("all"):contName(c)}</button>`).join("");
}
/* Search matches English AND localized names/capitals. */
function matchCountry(c,q){
  if(!q) return true;
  return c.name.toLowerCase().includes(q) || c.cap.toLowerCase().includes(q)
      || cName(c).includes(q) || cCap(c).includes(q);
}
function emptyState(msg){
  return `<div class="empty"><div class="eicon">${ic("search",22)}</div>${msg}</div>`;
}