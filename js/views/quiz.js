/* ============================================================
   views/quiz.js — QUIZ ENGINE
   9 quiz categories, question generation (EN/AR), scoring,
   instant feedback, results screen.
   ▸ To add a question: edit data-questions.js.
   ▸ To change how questions are generated: edit GENS below.
   Correctness is judged against the clicked option's own
   `ok` flag — the single source of truth.
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

function mkOpts(correct, pool){
  const ws = shuffle(pool.filter(p=>p!==correct)).slice(0,3);
  const list = shuffle([{t:correct,ok:true},...ws.map(w=>({t:w,ok:false}))]);
  return {list};
}
function mkFlagOpts(correctIso, pool){
  const ws = shuffle(pool.filter(p=>p!==correctIso)).slice(0,3);
  const list = shuffle([{f:correctIso,ok:true},...ws.map(w=>({f:w,ok:false}))]);
  return {list};
}
const Q = (en,ar)=>LANG==="ar"?ar:en;
const GENS = {
  c2cap(){ const c=rnd(COUNTRIES); return {key:"cc:"+c.name, q:Q(`What is the capital of ${c.name}?`,`ما عاصمة ${cName(c)}؟`), opts:mkOpts(cCap(c),COUNTRIES.map(cCap)), note:Q(`${c.cap} is the capital of ${c.name}.`,`عاصمة ${cName(c)} هي ${cCap(c)}.`)}; },
  cap2c(){ const c=rnd(COUNTRIES); return {key:"pc:"+c.name, q:Q(`${c.cap} is the capital of which country?`,`${cCap(c)} عاصمة أي بلد؟`), opts:mkOpts(cName(c),COUNTRIES.map(cName)), note:Q(`${c.cap} is the capital of ${c.name}.`,`عاصمة ${cName(c)} هي ${cCap(c)}.`)}; },
  f2c(){ const c=rnd(COUNTRIES); return {key:"fc:"+c.name, q:Q("Which country does this flag belong to?","لأي دولة يتبع هذا العلم؟"), img:flagUrl(c.iso,320), opts:mkOpts(cName(c),COUNTRIES.map(cName)), note:Q(`This is the flag of ${c.name}.`,`هذا هو علم ${cName(c)}.`)}; },
  c2f(){ const c=rnd(COUNTRIES); return {key:"cf:"+c.name, q:Q(`Which one is the flag of ${c.name}?`,`أي من هذه الأعلام هو علم ${cName(c)}؟`), opts:mkFlagOpts(c.iso,COUNTRIES.map(x=>x.iso)), note:Q(`The correct flag is the flag of ${c.name}.`,`العلم الصحيح هو علم ${cName(c)}.`)}; },
  c2cont(){ const c=rnd(COUNTRIES); return {key:"ct:"+c.name, q:Q(`On which continent is ${c.name} located?`,`في أي قارة تقع ${cName(c)}؟`), opts:mkOpts(contName(c.cont),CONTQ.map(contName)), note:Q(`${c.name} is located in ${c.cont}.`,`تقع ${cName(c)} في قارة ${contName(c.cont)}.`)}; },
  cont2c(){ const cont=rnd(CONTQ); const a=rnd(COUNTRIES.filter(c=>c.cont===cont)); return {key:"tc:"+a.name, q:Q(`Which of these countries is in ${cont}?`,`أي من هذه الدول تقع في ${contName(cont)}؟`), opts:mkOpts(cName(a),COUNTRIES.filter(c=>c.cont!==cont).map(cName)), note:Q(`${a.name} is in ${cont}.`,`تقع ${cName(a)} في قارة ${contName(cont)}.`)}; },
  facts(){ const f=rnd(LANG==="ar"?FACTS_AR:FACTS); return {key:"f:"+f.q, q:f.q, opts:mkOpts(f.a,f.w), note:f.n}; },
  physical(){ const f=rnd(LANG==="ar"?PHYS_AR:PHYS); return {key:"p:"+f.q, q:f.q, opts:mkOpts(f.a,f.w), note:f.n}; }
};
function buildQuiz(cat, n=10){
  const gens = cat==="mixed" ? Object.keys(GENS) : [cat];
  const used = new Set(); const qs=[]; let guard=0;
  while(qs.length<n && guard++<800){
    const g = GENS[rnd(gens)]();
    if(used.has(g.key)) continue;
    used.add(g.key); qs.push(g);
  }
  return qs;
}

let quiz=null, qTimer=null;
function startQuiz(cat){
  if(qTimer) clearTimeout(qTimer);
  quiz = {cat, qs:buildQuiz(cat,10), idx:0, score:0, answered:false, chosen:-1, results:[], done:false, newBest:false};
  VIEW="quiz"; renderChrome();
  renderQuizRun();
  window.scrollTo({top:0});
}
function backToQuizzes(){ if(qTimer)clearTimeout(qTimer); quiz=null; renderQuiz(); }

function renderQuiz(){
  if(quiz && !quiz.done) return renderQuizRun();
  if(quiz && quiz.done) return renderQuizResult();
  el("app").innerHTML = `
  <div class="page">
    <div class="sec-head">
      <div><h2 class="sec-title">${t("quiz_h")}</h2><p class="sec-sub">${t("quiz_sub")}</p></div>
    </div>
    <div class="quiz-list">
      ${QUIZ_CATS.map(cat=>`
        <button class="quiz-cat" onclick="startQuiz('${cat.id}')">
          <span class="qicon">${ic(cat.icon,20)}</span>
          <span><span class="qname">${t(cat.nkey)}</span><br><span class="qdesc">${t(cat.dkey)}</span></span>
          <span class="qbest ${S.best[cat.id]!=null?"has":""}">${S.best[cat.id]!=null?tf("best",{a:S.best[cat.id]}):t("not_taken")}</span>
        </button>`).join("")}
    </div>
  </div>`;
}

function renderQuizRun(){
  const q = quiz.qs[quiz.idx];
  const cat = QUIZ_CATS.find(c=>c.id===quiz.cat);
  const total = quiz.qs.length;
  const letters = LANG==="ar" ? ["أ","ب","ج","د"] : ["A","B","C","D"];
  const correctIdx = q.opts.list.findIndex(o=>o.ok);
  el("app").innerHTML = `
  <div class="page"><div class="quiz-wrap">
    <div class="q-top">
      <button class="chip" onclick="backToQuizzes()">${dic("left",14)} ${t("all_quizzes")}</button>
      <span class="q-cat-label">${t(cat.nkey)}</span>
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
  if(ok) quiz.score++;
  quiz.results.push(ok);
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
    <p>${t(cat.nkey)}</p>
    ${quiz.newBest?`<span class="newbest">${ic("trophy",14)} ${t("new_best")}</span>`:`<p style="font-size:13.5px">${tf("best_cat",{a:S.best[quiz.cat]})}</p>`}
    <div class="result-actions">
      <button class="btn btn-primary" onclick="startQuiz('${quiz.cat}')">${ic("refresh",16)} ${t("try_again")}</button>
      <button class="btn btn-ghost" onclick="backToQuizzes()">${t("choose_other")}</button>
    </div>
  </div></div>`;
  requestAnimationFrame(()=>setTimeout(()=>{ const r=el("ring-fg"); if(r) r.setAttribute("stroke-dasharray",`${C*pct} ${C}`); },80));
}