/* ============================================================
   views/learn.js — LEARNING MODE (FLASHCARDS)
   3D flip cards, deck filters, shuffle, keyboard navigation,
   "mark as learned" progress tracking.
============================================================ */
let deck=[], deckIdx=0, deckCont="All";
function buildDeck(){
  deck = shuffle(deckCont==="All" ? COUNTRIES : COUNTRIES.filter(c=>c.cont===deckCont));
  deckIdx = 0;
}
function renderLearn(){
  if(!deck.length) buildDeck();
  const learnedInDeck = deck.filter(c=>S.learned.includes(c.name)).length;
  el("app").innerHTML = `
  <div class="page">
    <div class="sec-head">
      <div><h2 class="sec-title">${t("learn_h")}</h2><p class="sec-sub">${t("learn_sub")}</p></div>
    </div>
    <div class="learn-tools">
      <div class="chips">${contChips(deckCont,"setLearnCont")}</div>
      <button class="btn btn-ghost" onclick="shuffleDeck()">${ic("shuffle",16)} ${t("shuffle")}</button>
    </div>
    <div id="learn-zone"></div>
    <div class="learn-progress">
      <div class="lp-label"><span>${t("deck_progress")}</span><span>${learnedInDeck} / ${deck.length}</span></div>
      <div class="pbar"><i style="width:${deck.length?learnedInDeck/deck.length*100:0}%"></i></div>
      <p style="text-align:center;font-size:12.5px;color:var(--muted);margin-top:14px">${t("tip_keys")}</p>
    </div>
  </div>`;
  drawCard();
}
function setLearnCont(c){ deckCont=c; buildDeck(); renderLearn(); }
function shuffleDeck(){ deck=shuffle(deck); deckIdx=0; drawCard(); }
function drawCard(){
  const zone = el("learn-zone"); if(!zone) return;
  if(!deck.length){ zone.innerHTML = emptyState(t("no_countries")); return; }
  if(deckIdx>=deck.length) deckIdx=0;
  if(deckIdx<0) deckIdx=deck.length-1;
  const c = deck[deckIdx];
  const learned = S.learned.includes(c.name);
  zone.innerHTML = `
    <div class="learn-count" style="text-align:center;margin-top:26px">${tf("card_of",{a:deckIdx+1,b:deck.length})}</div>
    <div class="fc-scene">
      <div class="fc-card" id="fcard" onclick="toggleFlip()">
        <div class="fc-face">
          <span class="fc-cont">${contName(c.cont)}</span>
          ${fimg(c.iso,320,`Flag of ${c.name}`,"fc-flag")}
          <h3 class="fc-name">${cName(c)}</h3>
          <p class="fc-sub">${cCap(c)}</p>
          <div class="fc-hint">${ic("refresh",14)} ${t("flip_hint")}</div>
        </div>
        <div class="fc-face fc-back" onclick="event.stopPropagation()">
          <div class="fcb-head">
            ${fimg(c.iso,160,"")}
            <div><div class="n">${cName(c)}</div><div class="s">${contName(c.cont)} · ${cReg(c)}</div></div>
          </div>
          <div class="fcb-rows">
            <div class="fcb-row"><span class="k">${t("k_capital")}</span><span class="v">${cCap(c)}</span></div>
            <div class="fcb-row"><span class="k">${t("k_population")}</span><span class="v">${fmt(c.pop)}</span></div>
            <div class="fcb-row"><span class="k">${t("k_area")}</span><span class="v">${fmt(c.area)} km²</span></div>
            <div class="fcb-row"><span class="k">${t("k_currency")}</span><span class="v">${cCur(c)}</span></div>
            <div class="fcb-row" style="grid-column:1/-1"><span class="k">${t("k_langs")}</span><span class="v">${cLang(c)}</span></div>
          </div>
          <div class="callout">${ic("sun",16)}<span>${cFact(c)}</span></div>
        </div>
      </div>
    </div>
    <div class="learn-controls">
      <button class="btn btn-ghost" onclick="learnPrev()" aria-label="Previous">${dic("left",17)}</button>
      <button class="btn ${learned?"btn-ok":"btn-primary"}" onclick="markLearned('${c.slug}')">${ic("check",16)} ${learned?t("learned"):t("mark")}</button>
      <button class="btn btn-ghost" onclick="learnNext()" aria-label="Next">${dic("right",17)}</button>
    </div>`;
}
function toggleFlip(){ const f=el("fcard"); if(f) f.classList.toggle("flipped"); }
function learnNext(){ if(!deck.length)return; deckIdx=(deckIdx+1)%deck.length; drawCard(); }
function learnPrev(){ if(!deck.length)return; deckIdx=(deckIdx-1+deck.length)%deck.length; drawCard(); }
function markLearned(slugVal){
  const c = bySlug[slugVal]; if(!c) return;
  const i=S.learned.indexOf(c.name);
  if(i>=0) S.learned.splice(i,1); else S.learned.push(c.name);
  save(); checkAch();
  drawCard();
}