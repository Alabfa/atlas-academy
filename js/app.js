/* ============================================================
   app.js — ROUTER, NAVIGATION & STARTUP
   Top nav + mobile bottom nav, section switching, keyboard
   shortcuts, and the boot sequence. No features live here —
   each section's code is in js/views/<section>.js.
   Accounts: Ranking is a nav item; the profile/avatar lives in
   the topbar (renderAuthArea in js/account.js).
============================================================ */
const NAV = [["home","nav_home","home"],["countries","nav_countries","globe"],["flags","nav_flags","flag"],["continents","nav_continents","compass"],["learn","nav_learn","book"],["quiz","nav_quiz","quiz"],["ranking","nav_ranking","trophy"]];
let VIEW = "home";

function renderChrome(){
  el("brand-txt").textContent = t("brand");
  el("top-nav").innerHTML = NAV.map(([id,key])=>`<button class="nav-link ${VIEW===id?"active":""}" onclick="go('${id}')">${t(key)}</button>`).join("");
  el("mobile-nav").innerHTML = NAV.map(([id,key,icn])=>`<button class="${VIEW===id?"active":""}" onclick="go('${id}')">${ic(icn,20)}<span>${t(key)}</span></button>`).join("");
  el("lang-btn").textContent = t("lang_switch");
  el("footer-el").innerHTML = t("footer");
  if(typeof renderAuthArea==="function") renderAuthArea();
}
function go(v){
  if(qTimer) clearTimeout(qTimer);
  if(typeof destroyHomeGlobe==="function") destroyHomeGlobe();
  VIEW = v; renderChrome();
  el("app").innerHTML = "";
  VIEWS[v]();
  window.scrollTo({top:0});
}

/* ---------- Keyboard shortcuts ---------- */
document.addEventListener("keydown", e=>{
  if(e.key==="Escape") closeModal();
  if(VIEW==="learn"){
    if(e.key==="ArrowRight") learnNext();
    if(e.key==="ArrowLeft") learnPrev();
  }
});

/* ---------- Section registry ---------- */
const VIEWS = {home:renderHome, countries:renderCountries, flags:renderFlags, continents:renderContinents, learn:renderLearn, quiz:renderQuiz, ranking:renderRanking, account:renderAccount};

/* ---------- Boot ---------- */
el("logo-ic").innerHTML = ic("globe",18);
document.documentElement.lang = LANG;
document.documentElement.dir = LANG==="ar" ? "rtl" : "ltr";
document.title = t("doc_title");
if(typeof Account!=="undefined") Account.init();
buildDeck();
renderChrome();
renderHome();