/* ============================================================
   views/home.js — HOME SECTION
   Hero, intro, stats strip, quick-access index, progress bars
   and achievements list. All labels come from i18n.js.
============================================================ */
function heroGlobeSVG(){
  return `<svg viewBox="0 0 340 340" fill="none" aria-hidden="true">
    <ellipse cx="170" cy="170" rx="152" ry="54" transform="rotate(-18 170 170)" stroke="#c25a2e" stroke-width="2" stroke-linecap="round" stroke-dasharray="1.5 8"/>
    <circle cx="317" cy="122" r="5.5" fill="#c25a2e" stroke="#faf8f3" stroke-width="2.5"/>
    <circle cx="170" cy="170" r="112" fill="#ffffff" stroke="#1d1b16" stroke-width="2.5"/>
    <g transform="rotate(-10 170 170)" stroke="#d9d3c4" stroke-width="1.4" fill="none">
      <ellipse cx="170" cy="170" rx="76" ry="112"/>
      <ellipse cx="170" cy="170" rx="38" ry="112"/>
      <path d="M70.8 118 Q170 136 269.2 118"/>
      <path d="M58 170 Q170 190 282 170"/>
      <path d="M70.8 222 Q170 234 269.2 222"/>
    </g>
    <circle cx="212" cy="118" r="5" fill="#0e7a5f" stroke="#faf8f3" stroke-width="2.5"/>
    <circle cx="128" cy="214" r="5" fill="#c25a2e" stroke="#faf8f3" stroke-width="2.5"/>
    <circle cx="238" cy="206" r="3.5" fill="#1d1b16" stroke="#faf8f3" stroke-width="2.5"/>
  </svg>`;
}

function renderHome(){
  const acc = S.answered ? Math.round(S.correct/S.answered*100) : 0;
  const learned = S.learned.length;
  el("app").innerHTML = `
  <div class="page">
    <section class="hero">
      <div>
        <span class="eyebrow">${t("hero_eyebrow")}</span>
        <h1>${t("hero_h1")}</h1>
        <p class="lead">${tf("hero_lead",{n:COUNTRIES.length})}</p>
        <div class="hero-actions">
          <button class="btn btn-primary" onclick="startQuiz('mixed')">${t("hero_cta1")} ${dic("right",17)}</button>
          <button class="btn btn-ghost" onclick="go('countries')">${t("hero_cta2")}</button>
        </div>
      </div>
      <div class="hero-art">${heroGlobeSVG()}</div>
    </section>

    <div class="stats">
      <div class="stat"><b>${COUNTRIES.length}</b><span>${t("stat_countries")}</span></div>
      <div class="stat"><b>${learned}</b><span>${t("stat_learned")}</span></div>
      <div class="stat"><b>${S.quizzes}</b><span>${t("stat_quizzes")}</span></div>
      <div class="stat"><b>${acc}%</b><span>${t("stat_acc")}</span></div>
    </div>

    <h2 class="sec-title" style="font-size:26px">${t("explore_h")}</h2>
    <div class="index-list">
      ${[["countries","idx1"],["flags","idx2"],["continents","idx3"],["learn","idx4"],["quiz","idx5"]]
        .map(([id,k],i)=>{
          const meta = k==="idx1"?tf("idx1_m",{n:COUNTRIES.length})
                     : k==="idx2"?tf("idx2_m",{n:COUNTRIES.length})
                     : k==="idx3"?t("idx3_m")
                     : k==="idx4"?tf("idx4_m",{n:learned})
                     : t("idx5_m");
          return `
        <button class="index-item" onclick="go('${id}')">
          <span class="index-num">0${i+1}</span>
          <span class="index-main"><span class="index-title">${t(k+"_t")}</span><br><span class="index-desc">${t(k+"_d")}</span></span>
          <span class="index-meta">${meta}</span>
          <span class="index-arrow">${ic("right",19)}</span>
        </button>`;}).join("")}
    </div>

    <div class="home-cols">
      <div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <h2 class="sec-title" style="font-size:24px;padding-top:20px">${t("progress_h")}</h2>
          <button class="chip" id="reset-btn" onclick="resetProgress(this)" style="margin-top:20px">${t("reset")}</button>
        </div>
        <div style="margin-top:22px">
          <div class="prog-row"><div class="plabel">${t("p_learned")} <span>${learned} / ${COUNTRIES.length}</span></div><div class="pbar"><i style="width:${learned/COUNTRIES.length*100}%"></i></div></div>
          <div class="prog-row"><div class="plabel">${t("p_conts")} <span>${S.conts.length} / 7</span></div><div class="pbar"><i style="width:${S.conts.length/7*100}%"></i></div></div>
          <div class="prog-row"><div class="plabel">${t("p_acc")} <span>${S.answered?acc+"%":"—"} <span style="font-size:12px">(${S.correct}/${S.answered} ${t("p_answers")})</span></span></div><div class="pbar"><i style="width:${acc}%"></i></div></div>
        </div>
      </div>
      <div>
        <h2 class="sec-title" style="font-size:24px;padding-top:20px">${t("ach_h")} <span style="color:var(--muted);font-size:16px;font-family:var(--body)">${S.ach.length} / ${ACH.length}</span></h2>
        <div class="ach-list">
          ${ACH.map(a=>{const u=S.ach.includes(a.id);return `
            <div class="ach ${u?"unlocked":"locked"}">
              <span class="aicon">${ic(u?a.icon:"lock",17)}</span>
              <div><div class="aname">${t(a.nkey)}</div><div class="adesc">${achD(a.id)}</div></div>
            </div>`;}).join("")}
        </div>
      </div>
    </div>
  </div>`;
}
function resetProgress(btn){
  if(btn.dataset.confirm){ S={...DEF}; save(); renderHome(); toast(t("reset_done"),"refresh"); return; }
  btn.dataset.confirm="1"; btn.textContent=t("reset_confirm");
  setTimeout(()=>{ if(el("reset-btn")){ el("reset-btn").dataset.confirm=""; el("reset-btn").textContent=t("reset"); }},3000);
}