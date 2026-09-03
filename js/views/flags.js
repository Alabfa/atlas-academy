/* ============================================================
   views/flags.js — FLAGS GALLERY SECTION
   Flag card grid with search and continent filters.
============================================================ */
let fQuery="", fFilter="All";
function renderFlags(){
  el("app").innerHTML = `
  <div class="page">
    <div class="sec-head">
      <div><h2 class="sec-title">${t("flags_h")}</h2><p class="sec-sub">${tf("flags_sub",{n:COUNTRIES.length})}</p></div>
      <button class="btn btn-primary" style="margin-top:20px" onclick="startQuiz('f2c')">${ic("flag",16)} ${t("take_flag_quiz")}</button>
    </div>
    <div class="toolbar">
      <label class="search">${ic("search",17)}<input placeholder="${t("search_ph")}" value="${fQuery}" oninput="fSearch(this.value)"></label>
      <div class="chips">${contChips(fFilter,"setFFilter")}</div>
    </div>
    <div class="result-count" id="f-count"></div>
    <div id="f-grid"></div>
  </div>`;
  drawFlags();
}
function fSearch(v){ fQuery=v; drawFlags(); }
function setFFilter(v){ fFilter=v; renderFlags(); }
function drawFlags(){
  const q = fQuery.trim().toLowerCase();
  const items = COUNTRIES.filter(c=>(fFilter==="All"||c.cont===fFilter)&&matchCountry(c,q))
                         .sort((a,b)=>a.name.localeCompare(b.name));
  const count = el("f-count"); if(count) count.textContent = tf("count_of_flags",{a:items.length,b:COUNTRIES.length});
  el("f-grid").innerHTML = items.length
    ? `<div class="flag-grid">${items.map(c=>`
        <button class="flag-card" onclick="openCountry('${c.slug}')">
          <span class="fimg">${fimg(c.iso,160,`Flag of ${c.name}`)}</span>
          <span class="finfo">
            <span><span class="fname">${cName(c)}</span><br><span class="fcap">${cCap(c)}</span></span>
            ${S.learned.includes(c.name)?`<span class="fcheck">${ic("check",16)}</span>`:""}
          </span>
        </button>`).join("")}</div>`
    : emptyState(t("no_flags"));
}