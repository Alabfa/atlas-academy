/* ============================================================
   state.js — PROGRESS (localStorage) & ACHIEVEMENTS
   ------------------------------------------------------------
   ▸ To add a new achievement: add one entry to ACH below
     (id, label key from i18n.js, icon, and a test function).
   Progress is stored in localStorage under "atlas-academy".
============================================================ */
const DEF = {learned:[],viewed:[],quizzes:0,correct:0,answered:0,best:{},ach:[],conts:[]};
let S;
try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem("atlas-academy")) || {}); }
catch(e){ S = {...DEF}; }
function save(){ localStorage.setItem("atlas-academy", JSON.stringify(S)); }

const ACH = [
{id:"first", nkey:"ach1_n", icon:"flag", test:s=>s.quizzes>=1},
{id:"c10", nkey:"ach2_n", icon:"check", test:s=>s.correct>=10},
{id:"view25", nkey:"ach3_n", icon:"pin", test:s=>s.viewed.length>=25},
{id:"cont7", nkey:"ach4_n", icon:"compass", test:s=>s.conts.length>=7},
{id:"l50", nkey:"ach5_n", icon:"globe", test:s=>s.learned.length>=50},
{id:"flagm", nkey:"ach6_n", icon:"trophy", test:s=>Object.entries(s.best).some(([k,v])=>(k==="f2c"||k==="c2f")&&v>=9)}
];
function achD(id){ const i=ACH.findIndex(a=>a.id===id); return t("ach"+(i+1)+"_d"); }
function checkAch(){
  ACH.forEach(a=>{ if(!S.ach.includes(a.id) && a.test(S)){ S.ach.push(a.id); save(); toast(t(a.nkey), a.icon); }});
}