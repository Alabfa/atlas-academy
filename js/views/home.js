/* ============================================================
   views/home.js — HOME SECTION
   Hero with 3D Earth (globe.js), stats, personalized level card
   + adaptive recommendation strips, quick access, progress,
   achievements. Labels from i18n.js, brain from state.js.
============================================================ */
function renderHome(){
  const acc = S.answered ? Math.round(S.correct/S.answered*100) : 0;
  const learned = S.learned.length;
  const li = lvlIndex();
  const cur = LEVELS[li], nxt = LEVELS[li+1];
  const prog = nxt ? Math.round((S.xp-cur.xp)/(nxt.xp-cur.xp)*100) : 100;
  const rec = recommendInfo();
  const weak = weakestCat();
  const weakCatObj = weak ? QUIZ_CATS.find(c=>c.id===weak) : null;
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
      <div class="hero-art">
        <div class="globe-wrap" id="globe-mount"></div>
        <p class="globe-hint">${ic("globe",14)} ${t("globe_hint")}</p>
      </div>
    </section>

    <div class="stats">
      <div class="stat"><b>${COUNTRIES.length}</b><span>${t("stat_countries")}</span></div>
      <div class="stat"><b>${learned}</b><span>${t("stat_learned")}</span></div>
      <div class="stat"><b>${S.quizzes}</b><span>${t("stat_quizzes")}</span></div>
      <div class="stat"><b>${acc}%</b><span>${t("stat_acc")}</span></div>
    </div>

    <div class="rec-strip">
      <span class="ric">${ic("target",20)}</span>
      <span class="rtxt"><b>${t("lv_"+rec.lv)} · ${t("recommended")}</b>${tf(rec.k,{p:rec.p,a:rec.a})}</span>
      <button class="btn btn-primary" onclick="qLevel='${rec.lv}';go('quiz')">${tf("train_btn",{lvl:t("lv_"+rec.lv)})}</button>
    </div>
    ${weakCatObj?`
    <div class="rec-strip">
      <span class="ric">${ic("mountain",20)}</span>
      <span class="rtxt"><b>${t("weak_h")}</b>${tf("weak_d",{cat:t(weakCatObj.nkey),p:Math.round(S.catStats[weak].c/S.catStats[weak].a*100)})}</span>
      <button class="btn btn-ghost" onclick="startQuiz('${weak}','${rec.lv}')">${t("try_again")}</button>
    </div>`:""}

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
        <div class="lvl-card">
          <div class="lt">
            <span class="lname">${tf("lvl_title",{n:li+1,name:t(cur.key)})}</span>
            <span class="lxp">${nxt?`${S.xp} / ${nxt.xp} XP`:tf("xp_max",{n:S.xp})}</span>
          </div>
          <div class="pbar" style="margin-top:12px"><i style="width:${prog}%"></i></div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <h2 class="sec-title" style="font-size:24px">${t("progress_h")}</h2>
          <button class="chip" id="reset-btn" onclick="resetProgress(this)">${t("reset")}</button>
        </div>
        <div style="margin-top:22px">
          <div class="prog-row"><div class="plabel">${t("p_learned")} <span>${learned} / ${COUNTRIES.length}</span></div><div class="pbar"><i style="width:${learned/COUNTRIES.length*100}%"></i></div></div>
          <div class="prog-row"><div class="plabel">${t("p_conts")} <span>${S.conts.length} / 7</span></div><div class="pbar"><i style="width:${S.conts.length/7*100}%"></i></div></div>
          <div class="prog-row"><div class="plabel">${t("p_acc")} <span>${S.answered?acc+"%":"—"} <span style="font-size:12px">(${S.correct}/${S.answered} ${t("p_answers")})</span></span></div><div class="pbar"><i style="width:${acc}%"></i></div></div>
        </div>
      </div>
      <div>
        <h2 class="sec-title" style="font-size:24px">${t("ach_h")} <span style="color:var(--muted);font-size:16px;font-family:var(--body)">${S.ach.length} / ${ACH.length}</span></h2>
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
  initHomeGlobe(el("globe-mount"));
}
function resetProgress(btn){
  if(btn.dataset.confirm){ S={...DEF}; save(); renderHome(); toast(t("reset_done"),"refresh"); return; }
  btn.dataset.confirm="1"; btn.textContent=t("reset_confirm");
  setTimeout(()=>{ if(el("reset-btn")){ el("reset-btn").dataset.confirm=""; el("reset-btn").textContent=t("reset"); }},3000);
}