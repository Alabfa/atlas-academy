/* ============================================================
   views/continents.js — CONTINENTS SECTION
   Tabbed continent panel with facts and country chips.
   Facts live in data-continents.js (EN) / data-arabic.js (AR).
============================================================ */
let activeCont = "Africa";
function renderContinents(){
  el("app").innerHTML = `
  <div class="page">
    <div class="sec-head">
      <div><h2 class="sec-title">${t("cont_h")}</h2><p class="sec-sub">${t("cont_sub")}</p></div>
    </div>
    <div class="chips" style="margin-top:22px">
      ${[...CONTQ,"Antarctica"].map(c=>`<button class="chip ${activeCont===c?"active":""}" onclick="setContinent('${c}')">${contName(c)}</button>`).join("")}
    </div>
    <div id="cont-panel"></div>
  </div>`;
  drawContinent();
}
function setContinent(c){
  activeCont = c;
  if(!S.conts.includes(c)){ S.conts.push(c); save(); checkAch(); }
  renderContinents();
}
function drawContinent(){
  const d = contData(activeCont);
  const list = COUNTRIES.filter(c=>c.cont===activeCont).sort((a,b)=>a.name.localeCompare(b.name));
  const explored = S.conts.includes(activeCont);
  el("cont-panel").innerHTML = `
  <div class="cont-panel">
    <div>
      ${explored?`<span class="explored-badge">${ic("check",13)} ${t("cont_explored")}</span>`:""}
      <h3 style="font-size:26px;margin-bottom:6px">${contName(activeCont)}</h3>
      <p class="cont-desc">${d.desc}</p>
      <div class="fact-row"><span class="k">${t("cont_area")}</span><span class="v">${d.area}</span></div>
      <div class="fact-row"><span class="k">${t("cont_pop")}</span><span class="v">${d.pop}</span></div>
      <div class="fact-row"><span class="k">${t("cont_high")}</span><span class="v">${d.high}</span></div>
      <div class="fact-row"><span class="k">${t("cont_river")}</span><span class="v">${d.river}</span></div>
      <div class="fact-row"><span class="k">${t("cont_countries")}</span><span class="v">${activeCont==="Antarctica"?t("cont_treaty"):list.length}</span></div>
    </div>
    <div>
      <div class="side-label">${t("cont_atlas")}${list.length?tf("cont_n_countries",{n:list.length}):""}</div>
      ${list.length
        ? `<div class="country-chips">${list.map(c=>`
            <button class="cchip" onclick="openCountry('${c.slug}')">${fimg(c.iso,40,"")}${cName(c)}</button>`).join("")}</div>
           <p class="cont-desc" style="margin-top:18px;font-size:13.5px">${t("cont_click")}</p>`
        : `<p class="cont-desc">${t("cont_antarctica_note")}</p>`}
    </div>
  </div>`;
}