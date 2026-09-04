/* ============================================================
   state.js — PROGRESS, XP / USER LEVEL, ACHIEVEMENTS &
   ADAPTIVE RECOMMENDATION (localStorage)
   ------------------------------------------------------------
   ▸ XP & user levels: LEVELS + addXP() + lvlIndex().
   ▸ Adaptive level recommendation: recommendInfo() — based on
     accuracy per difficulty (S.byLevel), needs ~10+ answers.
   ▸ Weakest-topic detection: weakestCat() — from S.catStats.
   ▸ To add an achievement: add one entry to ACH below.
   Progress is stored in localStorage under "atlas-academy".
============================================================ */
const DEF = {learned:[],viewed:[],quizzes:0,correct:0,answered:0,best:{},bestLv:{},ach:[],conts:[],xp:0,
  byLevel:{easy:{c:0,a:0},medium:{c:0,a:0},hard:{c:0,a:0}},catStats:{}};
let S;
try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem("atlas-academy")) || {}); }
catch(e){ S = {...DEF}; }
function save(){ localStorage.setItem("atlas-academy", JSON.stringify(S)); }

/* ---------- XP & user levels ---------- */
const LEVELS = [
  {xp:0,    key:"lvl1"},   /* Beginner */
  {xp:120,  key:"lvl2"},   /* Explorer */
  {xp:300,  key:"lvl3"},   /* Navigator */
  {xp:550,  key:"lvl4"},   /* Voyager */
  {xp:900,  key:"lvl5"},   /* Cartographer */
  {xp:1400, key:"lvl6"},   /* Geographer */
  {xp:2000, key:"lvl7"},   /* Globetrotter */
  {xp:2800, key:"lvl8"},   /* Trailblazer */
  {xp:3800, key:"lvl9"},   /* Atlas */
  {xp:5000, key:"lvl10"},  /* Earth Sage */
  {xp:6500, key:"lvl11"},  /* Globe Master */
  {xp:8500, key:"lvl12"}   /* Legend */
];
function lvlIndex(xp){ if(xp===undefined) xp=S.xp; let i=0; for(let k=0;k<LEVELS.length;k++) if(xp>=LEVELS[k].xp) i=k; return i; }
function addXP(n){
  const before = lvlIndex();
  S.xp += n;
  const after = lvlIndex();
  save();
  if(after>before) toast(`${t("lvlup_toast")} · ${t(LEVELS[after].key)}`, "trophy", tf("lvl_title",{n:after+1,name:t(LEVELS[after].key)}));
}

/* ---------- Adaptive level recommendation ---------- */
function levelAcc(l){ const s=S.byLevel[l]; return s&&s.a ? Math.round(s.c/s.a*100) : null; }
function recommendInfo(){
  const e=levelAcc("easy"), m=levelAcc("medium"), h=levelAcc("hard");
  const ea=S.byLevel.easy.a, ma=S.byLevel.medium.a, ha=S.byLevel.hard.a;
  if(ha>=12 && h>=70) return {lv:"hard", k:"rec_top"};
  if(ma>=12){
    if(m>=72) return {lv:"hard", k:"rec_up", p:m, a:t("lv_medium")};
    if(m<45)  return {lv:"easy", k:"rec_down", p:m, a:t("lv_medium")};
    return {lv:"medium", k:"rec_mid"};
  }
  if(ea>=10 && e>=80) return {lv:"medium", k:"rec_up", p:e, a:t("lv_easy")};
  if(ea>=10 && e<50)  return {lv:"easy", k:"rec_practice"};
  return {lv:"easy", k:"rec_start"};
}
function recommendLevel(){ return recommendInfo().lv; }

/* ---------- Weakest quiz topic ---------- */
function weakestCat(){
  let worst=null;
  for(const k in S.catStats){
    if(k==="foryou"||k==="mixed") continue;
    const s=S.catStats[k];
    if(s.a>=8 && (!worst || s.c/s.a < S.catStats[worst].c/S.catStats[worst].a)) worst=k;
  }
  return worst;
}

/* ---------- Achievements ---------- */
const ACH = [
{id:"first", nkey:"ach1_n", icon:"flag", test:s=>s.quizzes>=1},
{id:"c10", nkey:"ach2_n", icon:"check", test:s=>s.correct>=10},
{id:"view25", nkey:"ach3_n", icon:"pin", test:s=>s.viewed.length>=25},
{id:"cont7", nkey:"ach4_n", icon:"compass", test:s=>s.conts.length>=7},
{id:"l50", nkey:"ach5_n", icon:"globe", test:s=>s.learned.length>=50},
{id:"flagm", nkey:"ach6_n", icon:"trophy", test:s=>Object.entries(s.best).some(([k,v])=>(k==="f2c"||k==="c2f")&&v>=9)},
{id:"lvl3", nkey:"ach7_n", icon:"star", test:s=>lvlIndex()>=2}
];
function achD(id){ const i=ACH.findIndex(a=>a.id===id); return t("ach"+(i+1)+"_d"); }
function checkAch(){
  ACH.forEach(a=>{ if(!S.ach.includes(a.id) && a.test(S)){ S.ach.push(a.id); save(); toast(t(a.nkey), a.icon); }});
}