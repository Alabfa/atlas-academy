/* ============================================================
   views/ranking.js — GLOBAL RANKING (public leaderboard)
   Reads the public profiles table ordered by level desc, then
   XP desc. Highlights the signed-in player; if they're outside
   the listed window, their exact rank is fetched with a count.
   Public page — no sign-in required to view.
============================================================ */
async function renderRanking(){
  const app=el("app");
  const shell=(inner)=>{ app.innerHTML=`<div class="page">
    <div class="sec-head"><div><h2 class="sec-title">${t("rank_h")}</h2><p class="sec-sub">${t("rank_sub")}</p></div></div>${inner}</div>`; };
  if(!Account.configured){
    shell(`<div class="empty" style="margin-top:26px"><div class="eicon">${ic("trophy",22)}</div>${t("rank_needs_setup")}</div>`); return;
  }
  shell(`<div class="empty" style="margin-top:26px">${t("loading")}</div>`);
  const {data, error}=await Account.client.from("profiles")
    .select("id,username,display_name,avatar_url,xp,level")
    .order("level",{ascending:false}).order("xp",{ascending:false}).limit(50);
  if(error){
    shell(`<div class="empty" style="margin-top:26px"><div class="eicon">${ic("x",22)}</div>${t("rank_error")}
      <div style="margin-top:14px"><button class="btn btn-ghost" onclick="renderRanking()">${t("retry")}</button></div></div>`); return;
  }
  if(!data || !data.length){
    shell(`<div class="empty" style="margin-top:26px"><div class="eicon">${ic("trophy",22)}</div>${t("no_players")}</div>`); return;
  }
  const uid=Account.user && Account.user.id;
  const rowHtml=(r,rank,me)=>`
    <tr class="${me?"me-row":""}">
      <td class="rk">${rank}</td>
      <td><span class="pl">${r.avatar_url?`<img src="${escHtml(r.avatar_url)}" alt="" loading="lazy">`:`<span class="pl-fb">${ic("pin",15)}</span>`}
        <span><span class="nm">${escHtml(r.display_name||"—")}${me?`<span class="you-badge">${t("you_badge")}</span>`:""}</span>
        ${r.username?`<br><span class="un">@${escHtml(r.username)}</span>`:""}</span></span></td>
      <td>${r.level}</td><td>${fmt(r.xp)} XP</td>
    </tr>`;
  let body=data.map((r,i)=>rowHtml(r,i+1, r.id===uid)).join("");
  if(uid && !data.some(r=>r.id===uid)){
    const lvl=lvlIndex()+1;
    const {count, error:cErr}=await Account.client.from("profiles")
      .select("id",{count:"exact",head:true})
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
  shell(`<div class="rank-scroll"><table class="rank-table">
    <thead><tr><th>${t("th_rank")}</th><th>${t("th_player")}</th><th>${t("th_level")}</th><th>${t("th_xp")}</th></tr></thead>
    <tbody>${body}</tbody></table></div>`);
}