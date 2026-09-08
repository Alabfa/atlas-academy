/* ============================================================
   views/home.js — HOME SECTION
   Hero with interactive 3D Earth (globe.js), summary stats,
   adaptive recommendation strips (recommended level + weak
   spot) and the quick-access index list.
   Deliberately NOT here anymore:
   · "Did you know?" callout   → removed
   · progress bars             → My Account page
   · achievements list         → My Account page
   · level card / XP           → My Account page
   · Reset progress button     → My Account page (with modal)
============================================================ */
function renderHome(){
  const acc = S.answered ? Math.round(S.correct/S.answered*100) : 0;
  const learned = S.learned.length;
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
  </div>`;
  initHomeGlobe(el("globe-mount"));
}