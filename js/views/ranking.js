/* ============================================================
   views/ranking.js — GLOBAL RANKING
   Access rules:
   · Signed out        → encouragement screen (sign-in pitch)
   · Signed in, below
     RANK_MIN_LEVEL    → encouragement strip (+ board if any
                         players have reached the threshold);
                         an empty board becomes pure motivation
   · Signed in, at/above
     RANK_MIN_LEVEL    → full board, own row highlighted;
                         empty board = "be the first"
   Server side, the profiles SELECT policy (level >= threshold)
   hides below-threshold players from everyone.
   ⚠ Keep RANK_MIN_LEVEL in sync with the SQL policy.
============================================================ */
const RANK_MIN_LEVEL = 5;

async function renderRanking(){
  const app=el("app");
  const shell=(inner)=>{ app.innerHTML=`<div class="page">
    <div class="sec-head"><div><h2 class="sec-title">${t("rank_h")}</h2><p class="sec-sub">${t("rank_sub")}</p></div></div>${inner}</div>`; };

  if(!Account.configured){
    shell(`<div class="empty" style="margin-top:26px"><div class="eicon">${ic("trophy",22)}</div>${t("rank_needs_setup")}</div>`); return;
  }

  /* Gate 1 — signed out → encourage sign-in */
  if(!Account.signedIn()){
    shell(`<div class="pacc">
      <section class="pacc-card gate-card">
        <span class="gate-ic">${ic("trophy",26)}</span>
        <h3 class="gate-h">${t("rank_gate_h")}</h3>
        <p class="gate-d">${t("rank_gate_d")}</p>
        <p class="gate-req">${tf("rank_gate_req",{n:RANK_MIN_LEVEL})}</p>
        <button class="pbtn primary" onclick="accountSignIn()">${t("continue_google")}</button>
        <button class="gate-alt" onclick="go('account')">${t("acct_h")}</button>
      </section>
    </div>`);
    return;
  }

  shell(`<div class="empty" style="margin-top:26px">${t("loading")}</div>`);
  const {data, error}=await Account.client.from("profiles")
    .select("id,username,display_name,avatar_url,xp,level")
    .gte("level",RANK_MIN_LEVEL)
    .order("level",{ascending:false}).order("xp",{ascending:false}).limit(50);
  if(error){
    shell(`<div class="empty" style="margin-top:26px"><div class="eicon">${ic("x",22)}</div>${t("rank_error")}
      <div style="margin-top:14px"><button class="btn btn-ghost" onclick="renderRanking()">${t("retry")}</button></div></div>`); return;
  }

  const li=lvlIndex(), myLevel=li+1;
  const qualified = myLevel>=RANK_MIN_LEVEL;
  const uid=Account.user && Account.user.id;

  /* Encouragement strip for below-threshold players */
  const strip = qualified ? "" : `
    <div class="rank-status locked">
      ${ic("lock",16)}
      <span>${tf("rank_locked_d",{a:myLevel,n:RANK_MIN_LEVEL,b:fmt(LEVELS[RANK_MIN_LEVEL-1].xp-S.xp)})}</span>
      <button class="pbtn primary" onclick="qLevel='${recommendLevel()}';go('quiz')">${t("rank_cta_train")}</button>
    </div>`;

  /* Empty board — meaning depends on who is looking */
  if(!data || !data.length){
    if(qualified){
      /* You could be on the board → genuinely no players yet */
      shell(`<div class="empty" style="margin-top:26px"><div class="eicon">${ic("trophy",22)}</div>${t("no_players")}</div>`);
    } else {
      /* You're not on it yet either → pure motivation */
      shell(`${strip}
        <div class="empty" style="margin-top:16px"><div class="eicon">${ic("star",22)}</div>${t("rank_locked_empty")}</div>`);
    }
    return;
  }

  const rowHtml=(r,rank,me)=>`
    <tr class="${me?"me-row":""}">
      <td class="rk">${rank}</td>
      <td><span class="pl">${r.avatar_url?`<img src="${escHtml(r.avatar_url)}" alt="" loading="lazy">`:`<span class="pl-fb">${ic("pin",15)}</span>`}
        <span><span class="nm">${escHtml(r.display_name||"—")}${me?`<span class="you-badge">${t("you_badge")}</span>`:""}</span>
        ${r.username?`<br><span class="un">@${escHtml(r.username)}</span>`:""}</span></span></td>
      <td>${r.level}</td><td>${fmt(r.xp)} XP</td>
    </tr>`;

  let body=data.map((r,i)=>rowHtml(r,i+1, r.id===uid)).join("");

  /* Qualified but outside the top 50 → fetch exact rank and append own row */
  if(qualified && uid && !data.some(r=>r.id===uid)){
    const lvl=myLevel;
    const {count, error:cErr}=await Account.client.from("profiles")
      .select("id",{count:"exact",head:true})
      .gte("level",RANK_MIN_LEVEL)
      .or(`level.gt.${lvl},and(level.eq.${lvl},xp.gt.${S.xp})`);
    if(!cErr){
      const myRank=(count||0)+1;
      body+=`<tr class="rank-more"><td colspan="4">···</td></tr>`
          + rowHtml({id:uid, username:Account.profile&&Account.profile.username,
                     display_name:Account.profile&&Account.profile.display_name,
                     avatar_url:Account.profile&&Account.profile.avatar_url,
                     xp:S.xp, level:lvl}, myRank, true);
    }
  }

  shell(`${strip}<div class="rank-scroll"><table class="rank-table">
    <thead><tr><th>${t("th_rank")}</th><th>${t("th_player")}</th><th>${t("th_level")}</th><th>${t("th_xp")}</th></tr></thead>
    <tbody>${body}</tbody></table></div>`);
}