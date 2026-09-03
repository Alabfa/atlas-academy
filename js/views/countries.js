/* ============================================================
   views/countries.js — COUNTRIES SECTION + COUNTRY MODAL
   Browsable/searchable country list, and the detail popup
   (also used by Flags, Continents and Learn sections).
   Data itself lives in data-countries.js / data-arabic.js.
============================================================ */
let cQuery="", cFilter="All";
function renderCountries(){
  el("app").innerHTML = `
  <div class="page">
    <div class="sec-head">
      <div><h2 class="sec-title">${t("countries_h")}</h2><p class="sec-sub">${tf("countries_sub",{n:COUNTRIES.length})}</p></div>
    </div>
    <div class="toolbar">
      <label class="search">${ic("search",17)}<input placeholder="${t("search_ph")}" value="${cQuery}" oninput="cSearch(this.value)"></label>
      <div class="chips">${contChips(cFilter,"setCFilter")}</div>
    </div>
    <div class="result-count" id="c-count"></div>
    <div id="c-list"></div>
  </div>`;
  drawCountries();
}
function cSearch(v){ cQuery=v; drawCountries(); }
function setCFilter(v){ cFilter=v; renderCountries(); }
function drawCountries(){
  const q = cQuery.trim().toLowerCase();
  const items = COUNTRIES.filter(c=>(cFilter==="All"||c.cont===cFilter)&&matchCountry(c,q))
                         .sort((a,b)=>a.name.localeCompare(b.name));
  const count = el("c-count"); if(count) count.textContent = tf("count_of",{a:items.length,b:COUNTRIES.length});
  el("c-list").innerHTML = items.length
    ? `<div class="crow-list">${items.map(c=>`
        <button class="crow" onclick="openCountry('${c.slug}')">
          ${fimg(c.iso,80,"")}
          <span><span class="cname">${cName(c)}</span><br><span class="csub">${cCap(c)} · ${cReg(c)}</span></span>
          ${S.learned.includes(c.name)?`<span class="lcheck">${ic("check",18)}</span>`:""}
          <span class="ctag">${contName(c.cont)}</span>
        </button>`).join("")}</div>`
    : emptyState(t("no_countries"));
}

/* ---------- Country detail modal (opened by slug) ---------- */
function openCountry(slugVal){
  const c = bySlug[slugVal]; if(!c) return;
  if(!S.viewed.includes(c.name)){ S.viewed.push(c.name); save(); checkAch(); }
  const learned = S.learned.includes(c.name);
  el("modal-root").innerHTML = `
  <div class="overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" role="dialog" aria-label="${cName(c)}">
      <button class="close-x" onclick="closeModal()" aria-label="${t("close")}">${ic("x",17)}</button>
      <div class="modal-in">
        <div class="m-head">
          ${fimg(c.iso,320,`Flag of ${c.name}`)}
          <div>
            <h3>${cName(c)}</h3>
            <div class="m-tags">
              <span class="m-tag dark">${cCap(c)}</span>
              <span class="m-tag">${contName(c.cont)}</span>
              <span class="m-tag">${cReg(c)}</span>
            </div>
          </div>
        </div>
        <div class="dl-grid">
          <div class="fcb-row"><span class="k">${t("k_population")}</span><span class="v">${fmt(c.pop)}</span></div>
          <div class="fcb-row"><span class="k">${t("k_area")}</span><span class="v">${fmt(c.area)} km²</span></div>
          <div class="fcb-row"><span class="k">${t("k_currency")}</span><span class="v">${cCur(c)}</span></div>
          <div class="fcb-row"><span class="k">${t("k_official")}</span><span class="v">${cLang(c)}</span></div>
        </div>
        <div class="m-label">${t("m_neighbors")}</div>
        <div class="country-chips">${c.nb.map(nb=>`
          <span class="cchip">${ISO[nb]?fimg(ISO[nb],40,""):""}${nbName(nb)}</span>`).join("")}</div>
        <div class="callout" style="margin-top:22px">${ic("sun",17)}<span><b>${t("didyouknow")}</b> ${cFact(c)}</span></div>
        <div class="m-actions">
          <button class="btn ${learned?"btn-ok":"btn-primary"}" onclick="toggleLearned('${c.slug}')">${ic("check",16)} ${learned?t("learned"):t("mark")}</button>
        </div>
      </div>
    </div>
  </div>`;
}
function closeModal(){ el("modal-root").innerHTML=""; }
function toggleLearned(slugVal){
  const c = bySlug[slugVal]; if(!c) return;
  const i = S.learned.indexOf(c.name);
  if(i>=0) S.learned.splice(i,1); else S.learned.push(c.name);
  save(); checkAch();
  if(el("modal-root").innerHTML) openCountry(slugVal);
  if(VIEW==="learn") drawCard();
  else if(VIEW==="countries") drawCountries();
  else if(VIEW==="flags") drawFlags();
}