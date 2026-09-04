/* ============================================================
   views/quiz.js — QUIZ ENGINE (leveled + personalized)
   ▸ Levels: easy / medium / hard.
     Easy  → famous countries, loose wrong answers, d1 facts
     Hard  → obscure countries, SAME-CONTINENT wrong answers (tricky!)
   ▸ "For You": personal mix from learned/viewed countries +
     your weakest topic. Unlocks after 5 countries opened/learned.
   ▸ XP: 8/10/14 per correct (easy/medium/hard) + finish/perfect bonuses.
   ▸ Records accuracy per level (S.byLevel) and per category
     (S.catStats) — the adaptive recommendation lives in state.js.
   ▸ To add a question: data-questions.js. To tune pools: FAME below.
============================================================ */
const QUIZ_CATS = [
{id:"c2cap", nkey:"qc1_n", dkey:"qc1_d", icon:"globe"},
{id:"cap2c", nkey:"qc2_n", dkey:"qc2_d", icon:"pin"},
{id:"f2c", nkey:"qc3_n", dkey:"qc3_d", icon:"flag"},
{id:"c2f", nkey:"qc4_n", dkey:"qc4_d", icon:"flag"},
{id:"c2cont", nkey:"qc5_n", dkey:"qc5_d", icon:"compass"},
{id:"cont2c", nkey:"qc6_n", dkey:"qc6_d", icon:"globe"},
{id:"facts", nkey:"qc7_n", dkey:"qc7_d", icon:"book"},
{id:"physical", nkey:"qc8_n", dkey:"qc8_d", icon:"mountain"},
{id:"mixed", nkey:"qc9_n", dkey:"qc9_d", icon:"shuffle"}
];

/* ----- Fame-based difficulty pools ----- */
const FAME = [...COUNTRIES].sort((a,b)=>
  (Math.log10(b.pop+1)+Math.log10(b.area+1)) - (Math.log10(a.pop+1)+Math.log10(a.area+1)));
const EASY_SET = new Set(FAME.slice(0,50).map(c=>c.name));
function poolFor(lv){
  if(lv==="easy")  return COUNTRIES.filter(c=>EASY_SET.has(c.name));
  if(lv==="hard")  return FAME.slice(100);
  return COUNTRIES;
}

let qLevel = recommendLevel();
function setQLevel(l){ qLevel=l; renderQuiz(); }

/* ----- Option builders (Hard prefers same-continent distractors) ----- */
function mkOpts(correct, pool, localPool, lv){
  let src = pool;
  if(lv==="hard" && localPool && localPool.length>=4) src = localPool.filter(x=>x!==correct);
  const uniq = [...new Set(src.filter(p=>p!==correct))];
  const ws = shuffle(uniq).slice(0,3);
  const list = shuffle([{t:correct,ok:true},...ws.map(w=>({t:w,ok:false}))]);
  return {list};
}
function mkFlagOpts(correctIso, pool, localIsos, lv){
  let src = pool;
  if(lv==="hard" && localIsos && localIsos.length>=4) src = localIsos.filter(x=>x!==correctIso);
  const ws = shuffle([...new Set(src.filter(p=>p!==correctIso))]).slice(0,3);
  const list = shuffle([{f:correctIso,ok:true},...ws.map(w=>({f:w,ok:false}))]);
  return {list};
}

const Q = (en,ar)=>LANG==="ar"?ar:en;
/* Each generator: (lv, forcedCountry?) — level shapes pool + distractors. */
const GENS = {
  c2cap(lv,fc){ const c=fc||rnd(poolFor(lv));
    return {key:"cc:"+c.name, q:Q(`What is the capital of ${c.name}?`,`ما عاصمة ${cName(c)}؟`),
      opts:mkOpts(cCap(c),COUNTRIES.map(cCap),COUNTRIES.filter(x=>x.cont===c.cont&&x.name!==c.name).map(cCap),lv),
      note:Q(`${c.cap} is the capital of ${c.name}.`,`عاصمة ${cName(c)} هي ${cCap(c)}.`)}; },
  cap2c(lv,fc){ const c=fc||rnd(poolFor(lv));
    return {key:"pc:"+c.name, q:Q(`${c.cap} is the capital of which country?`,`${cCap(c)} عاصمة أي بلد؟`),
      opts:mkOpts(cName(c),COUNTRIES.map(cName),COUNTRIES.filter(x=>x.cont===c.cont&&x.name!==c.name).map(cName),lv),
      note:Q(`${c.cap} is the capital of ${c.name}.`,`عاصمة ${cName(c)} هي ${cCap(c)}.`)}; },
  f2c(lv,fc){ const c=fc||rnd(poolFor(lv));
    return {key:"fc:"+c.name, q:Q("Which country does this flag belong to?","لأي دولة يتبع هذا العلم؟"), img:flagUrl(c.iso,320),
      opts:mkOpts(cName(c),COUNTRIES.map(cName),COUNTRIES.filter(x=>x.cont===c.cont&&x.name!==c.name).map(cName),lv),
      note:Q(`This is the flag of ${c.name}.`,`هذا هو علم ${cName(c)}.`)}; },
  c2f(lv,fc){ const c=fc||rnd(poolFor(lv));
    return {key:"cf:"+c.name, q:Q(`Which one is the flag of ${c.name}?`,`أي من هذه الأعلام هو علم ${cName(c)}؟`),
      opts:mkFlagOpts(c.iso,COUNTRIES.map(x=>x.iso),COUNTRIES.filter(x=>x.cont===c.cont&&x.name!==c.name).map(x=>x.iso),lv),
      note:Q(`The correct flag is the flag of ${c.name}.`,`العلم الصحيح هو علم ${cName(c)}.`)}; },
  c2cont(lv,fc){ const c=fc||rnd(poolFor(lv));
    return {key:"ct:"+c.name, q:Q(`On which continent is ${c.name} located?`,`في أي قارة تقع ${cName(c)}؟`),
      opts:mkOpts(contName(c.cont),CONTQ.map(contName),null,lv),
      note:Q(`${c.name} is located in ${c.cont}.`,`تقع ${cName(c)} في قارة ${contName(c.cont)}.`)}; },
  cont2c(lv,fc){ const cont=fc?fc.cont:rnd(CONTQ); const a=fc||rnd(poolFor(lv).filter(c=>c.cont===cont));
    const wrongBase=(lv==="hard"?FAME.slice(100):FAME.slice(0,60)).filter(c=>c.cont!==cont).map(c=>cName(c));
    return {key:"tc:"+a.name, q:Q(`Which of these countries is in ${cont}?`,`أي من هذه الدول تقع في ${contName(cont)}؟`),
      opts:mkOpts(cName(a),wrongBase,null,lv),
      note:Q(`${a.name} is in ${cont}.`,`تقع ${cName(a)} في قارة ${contName(cont)}.`)}; },
  facts(lv){ const bank=LANG==="ar"?FACTS_AR:FACTS;
    let f=bank.filter(q=> lv==="easy"?q.d===1 : lv==="hard"?q.d>=2 : q.d<=2);
    if(!f.length) f=bank; const q=rnd(f);
    return {key:"f:"+q.q, q:q.q, opts:mkOpts(q.a,q.w,null,lv), note:q.n}; },
  physical(lv){ const bank=LANG==="ar"?PHYS_AR:PHYS;
    let f=bank.filter(q=> lv==="easy"?q.d===1 : lv==="hard"?q.d>=2 : q.d<=2);
    if(!f.length) f=bank; const q=rnd(f);
    return {key:"p:"+q.q, q:q.q, opts:mkOpts(q.a,q.w,null,lv), note:q.n}; }
};

function buildQuiz(cat, n, lv){
  const gens = cat==="mixed" ? Object.keys(GENS) : [cat];
  const used = new Set(); const qs=[]; let guard=0;
  while(qs.length<n && guard++<800){
    const g = GENS[rnd(gens)](lv);
    if(used.has(g.key)) continue;
    used.add(g.key); qs.push(g);
  }
  return qs;
}

/* ----- Personalized "For You" quiz ----- */
function buildForYou(){
  const seen=[...new Set([...S.learned,...S.viewed])].map(n=>NAMED[n]).filter(Boolean);
  shuffle(seen);
  const qs=[], used=new Set();
  const gens=["cap2c","c2cap","f2c","c2f","c2cont"];
  seen.slice(0,6).forEach(c=>{
    const g=GENS[rnd(gens)]("medium",c);
    if(!used.has(g.key)){ used.add(g.key); qs.push(g); }
  });
  const weak=weakestCat(); let weakLeft=weak?4:0, guard=0;
  while(qs.length<10 && guard++<250){
    if(weak && weakLeft>0){ weakLeft--; const g=GENS[weak]("medium"); if(!used.has(g.key)){used.add(g.key);qs.push(g);} continue; }
    const unseen=COUNTRIES.filter(c=>!S.learned.includes(c.name)&&!S.viewed.includes(c.name));
    const c=rnd(unseen.length?unseen:COUNTRIES);
    const g=GENS[rnd(gens)]("medium",c);
    if(!used.has(g.key)){ used.add(g.key); qs.push(g); }
  }
  return qs;
}

/* ----- Quiz lifecycle ----- */
const XP_CORRECT={easy:8,medium:10,hard:14};
let quiz=null, qTimer=null;
function startQuiz(cat, lv){
  if(qTimer) clearTimeout(qTimer);
  let qs, level=lv||null;
  if(cat==="foryou"){ qs=buildForYou(); level=null; }
  else { level=lv||qLevel||recommendLevel(); qs=buildQuiz(cat,10,level); }
  quiz={cat, lv:level, qs, idx:0, score:0, xpEarned:0, answered:false, chosen:-1, results:[], done:false, newBest:false};
  VIEW="quiz"; renderChrome();
  renderQuizRun();
  window.scrollTo({top:0});
}
function backToQuizzes(){ if(qTimer)clearTimeout(qTimer); quiz=null; renderQuiz(); }

function renderQuiz(){
  if(quiz && !quiz.done) return renderQuizRun();
  if(quiz && quiz.done) return renderQuizResult();
  const rec=recommendLevel();
  qLevel=qLevel||rec;
  const li=lvlIndex();
  const unlocked=S.learned.length>=10;
  el("app").innerHTML = `
  <div class="page">
    <div class="sec-head">
      <div><h2 class="sec-title">${t("quiz_h")}</h2><p class="sec-sub">${t("quiz_sub")}</p></div>
    </div>
    <div class="lv-row">
      <div class="lv-picker">
        ${[["easy","lv_easy"],["medium","lv_medium"],["hard","lv_hard"]].map(([id,k])=>`
          <button class="lv-chip ${qLevel===id?"active":""}" onclick="setQLevel('${id}')">
            ${t(k)}${rec===id?`<span class="rec-badge">${t("recommended")}</span>`:""}
          </button>`).join("")}
      </div>
      <span class="q-userlvl">${t("lvl_short")} ${li+1} · ${t(LEVELS[li].key)}</span>
    </div>
    <button class="foryou ${unlocked?"":"locked"}" ${unlocked?`onclick="startQuiz('foryou')"`:""}>
      <span class="qicon">${ic("target",20)}</span>
      <span class="ftext">
        <span class="ftitle-row">
          <span class="fname2">${t("foryou_n")}</span>
          <span class="pers-badge">${t("pers_badge")}</span>
        </span>
        <span class="qdesc">${unlocked?t("foryou_d"):t("foryou_locked")}</span>
      </span>
      ${unlocked?dic("right",18):ic("lock",18)}
    </button>
    <div class="quiz-list">
      ${QUIZ_CATS.map(cat=>{
        const bk=S.bestLv[cat.id+"@"+qLevel];
        return `
        <button class="quiz-cat" onclick="startQuiz('${cat.id}')">
          <span class="qicon">${ic(cat.icon,20)}</span>
          <span><span class="qname">${t(cat.nkey)}</span><br><span class="qdesc">${t(cat.dkey)}</span></span>
          <span class="qbest ${bk!=null?"has":""}">${bk!=null?tf("best",{a:bk}):t("not_taken")}</span>
        </button>`;}).join("")}
    </div>
  </div>`;
}

function renderQuizRun(){
  const q = quiz.qs[quiz.idx];
  const cat = QUIZ_CATS.find(c=>c.id===quiz.cat);
  const label = quiz.cat==="foryou" ? t("foryou_n") : `${t(cat.nkey)} · ${t("lv_"+quiz.lv)}`;
  const total = quiz.qs.length;
  const letters = LANG==="ar" ? ["أ","ب","ج","د"] : ["A","B","C","D"];
  const correctIdx = q.opts.list.findIndex(o=>o.ok);
  el("app").innerHTML = `
  <div class="page"><div class="quiz-wrap">
    <div class="q-top">
      <button class="chip" onclick="backToQuizzes()">${dic("left",14)} ${t("all_quizzes")}</button>
      <span class="q-cat-label">${label}</span>
      <span class="q-score">${t("score")} ${quiz.score}</span>
    </div>
    <div class="q-seg">
      ${Array.from({length:total},(_,i)=>`<i class="${quiz.results[i]===true?"ok":quiz.results[i]===false?"bad":""}"></i>`).join("")}
    </div>
    <div class="q-card">
      <p class="q-prompt">${q.q}</p>
      ${q.img?`<img class="q-flagbig" src="${q.img}" alt="" onerror="this.onerror=null;this.src=NOFLAG">`:""}
      <div class="opts">
        ${q.opts.list.map((o,i)=>{
          let cls="opt", dis = quiz.answered?"disabled":"";
          if(quiz.answered){
            if(o.ok) cls+=" correct";
            else if(i===quiz.chosen) cls+=" wrong";
          }
          const inner = o.f!==undefined
            ? fimg(o.f,160,"","opt-flag")
            : `<span class="key">${letters[i]}</span><span>${o.t}</span>`;
          return `<button class="${cls}" ${dis} onclick="answer(${i})">${inner}</button>`;
        }).join("")}
      </div>
      ${quiz.answered?(
        quiz.chosen===correctIdx
        ? `<div class="q-feedback good">${ic("check",17)}<span><b>${t("correct_fb")}</b> ${q.note||""}</span></div>`
        : `<div class="q-feedback badf">${ic("x",17)}<span><b>${t("wrong_fb")}</b> ${q.note||""}</span></div>`
      ):""}
    </div>
  </div></div>`;
}
function answer(i){
  if(!quiz || quiz.done || quiz.answered) return;
  const q = quiz.qs[quiz.idx];
  const opt = q.opts.list[i];
  if(!opt) return;
  quiz.answered = true;
  quiz.chosen = i;
  const ok = !!opt.ok;
  if(ok){
    quiz.score++;
    const xp = quiz.lv ? XP_CORRECT[quiz.lv] : 10;
    quiz.xpEarned += xp;
    addXP(xp);
  }
  quiz.results.push(ok);
  if(quiz.lv && S.byLevel[quiz.lv]){ S.byLevel[quiz.lv].a++; if(ok) S.byLevel[quiz.lv].c++; }
  if(!S.catStats[quiz.cat]) S.catStats[quiz.cat]={c:0,a:0};
  S.catStats[quiz.cat].a++; if(ok) S.catStats[quiz.cat].c++;
  S.answered++; if(ok) S.correct++;
  save(); checkAch();
  renderQuizRun();
  qTimer = setTimeout(nextQ, ok?1600:2500);
}
function nextQ(){
  if(!quiz) return;
  clearTimeout(qTimer);
  quiz.idx++; quiz.answered=false; quiz.chosen=-1;
  if(quiz.idx>=quiz.qs.length) finishQuiz(); else renderQuizRun();
}
function finishQuiz(){
  clearTimeout(qTimer);
  S.quizzes++;
  if(S.best[quiz.cat]==null || quiz.score>S.best[quiz.cat]){ S.best[quiz.cat]=quiz.score; quiz.newBest=true; }
  if(quiz.lv){
    const bk=quiz.cat+"@"+quiz.lv;
    if(S.bestLv[bk]==null || quiz.score>S.bestLv[bk]) S.bestLv[bk]=quiz.score;
    addXP(10); quiz.xpEarned+=10;
    if(quiz.score===quiz.qs.length){ addXP(25); quiz.xpEarned+=25; }
  }
  quiz.done = true;
  save(); checkAch();
  renderQuizResult();
}
function resultMsg(sc,n){
  const p = sc/n;
  return p===1?t("r_perfect") : p>=.8?t("r_8") : p>=.6?t("r_6") : p>=.4?t("r_4") : t("r_low");
}
function renderQuizResult(){
  const sc = quiz.score, pct = sc/quiz.qs.length, C = 2*Math.PI*52;
  const cat = QUIZ_CATS.find(c=>c.id===quiz.cat);
  const li = lvlIndex();
  /* Next-step suggestion based on performance + current level */
  let sug="";
  if(quiz.lv){
    const up={easy:"medium",medium:"hard"}[quiz.lv];
    if(sc>=8 && up) sug=`<button class="btn btn-primary" onclick="startQuiz('${quiz.cat}','${up}')">${tf("next_lv",{lvl:t("lv_"+up)})} ${dic("right",16)}</button>`;
    else if(sc<5 && quiz.lv==="hard") sug=`<button class="btn btn-ghost" onclick="startQuiz('${quiz.cat}','medium')">${tf("easier_lv",{lvl:t("lv_medium")})}</button>`;
    else if(sc<5 && quiz.lv==="medium") sug=`<button class="btn btn-ghost" onclick="startQuiz('${quiz.cat}','easy')">${tf("easier_lv",{lvl:t("lv_easy")})}</button>`;
  }
  el("app").innerHTML = `
  <div class="page"><div class="result">
    <div class="ring-wrap">
      <svg width="150" height="150" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="52" stroke="var(--line)" stroke-width="9" fill="none"/>
        <circle id="ring-fg" cx="60" cy="60" r="52" stroke="${pct>=.6?"var(--accent)":"var(--terra)"}" stroke-width="9" fill="none" stroke-linecap="round" stroke-dasharray="0 ${C}" style="transition:stroke-dasharray 1s cubic-bezier(.3,.7,.3,1)"/>
      </svg>
      <div class="ring-num">${sc}<small> / ${quiz.qs.length}</small></div>
    </div>
    <h3>${resultMsg(sc,quiz.qs.length)}</h3>
    <p>${quiz.cat==="foryou"?t("foryou_n"):t(cat.nkey)}</p>
    <span class="xp-line">${ic("star",14)} ${tf("xp_earned",{n:quiz.xpEarned})} · ${t("lvl_short")} ${li+1} — ${t(LEVELS[li].key)}</span><br>
    ${quiz.newBest?`<span class="newbest">${ic("trophy",14)} ${t("new_best")}</span>`:`<p style="font-size:13.5px">${tf("best_cat",{a:quiz.lv?(S.bestLv[quiz.cat+"@"+quiz.lv]??S.best[quiz.cat]):S.best[quiz.cat]})}</p>`}
    <div class="result-actions">
      <button class="btn ${sug?"btn-ghost":"btn-primary"}" onclick="startQuiz('${quiz.cat}','${quiz.lv||""}')">${ic("refresh",16)} ${t("try_again")}</button>
      ${sug}
      <button class="btn btn-ghost" onclick="backToQuizzes()">${t("choose_other")}</button>
    </div>
  </div></div>`;
  requestAnimationFrame(()=>setTimeout(()=>{ const r=el("ring-fg"); if(r) r.setAttribute("stroke-dasharray",`${C*pct} ${C}`); },80));
}