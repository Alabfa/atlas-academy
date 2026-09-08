/* ============================================================
   views/account.js — MY ACCOUNT
   Consistency rules for this page (v3, final):
   · one 640px column of identical cards
   · rows are always: text left — button right (.prow)
   · every button is .pbtn (primary = filled green, danger = red)
   · no icon chips, no other button styles on this page
============================================================ */
function achTile(a){
  const u=S.ach.includes(a.id);
  return `
  <div class="ach-tile ${u?"unlocked":"locked"}" title="${escHtml(achD(a.id))}">
    <span class="at-ic">${ic(u?a.icon:"lock",18)}</span>
    <span class="at-n">${t(a.nkey)}</span>
    <span class="at-d">${achD(a.id)}</span>
  </div>`;
}

function renderAccount(){
  const app=el("app");
  const li=lvlIndex();
  const cur=LEVELS[li], nxt=LEVELS[li+1];
  const prog = nxt ? Math.round((S.xp-cur.xp)/(nxt.xp-cur.xp)*100) : 100;
  const acc = S.answered ? Math.round(S.correct/S.answered*100) : 0;
  const learned=S.learned.length;
  const signedIn=Account.signedIn();
  const p=Account.profile||{};
  const displayName=escHtml(p.display_name || (signedIn?Account.fullName():""));

  /* 1 — identity + level */
  const header=`
  <section class="pacc-card">
    <div class="pacc-id">
      ${signedIn&&p.avatar_url
        ? `<img class="pacc-avatar" src="${escHtml(p.avatar_url)}" alt="">`
        : `<span class="pacc-avatar pacc-avatar-fb">${ic("pin",28)}</span>`}
      <div class="pacc-who">
        <h3>${displayName||t("acct_guest")}</h3>
        ${p.username?`<div class="pacc-uname">@${escHtml(p.username)}</div>`:`<div class="pacc-uname">${signedIn?"":t("acct_guest_sub")}</div>`}
        <span class="pacc-chip ${signedIn?"":"local"}">${ic(signedIn?"check":"pin",12)} ${signedIn?t("acct_chip_in"):t("acct_chip_local")}</span>
      </div>
      ${!signedIn&&Account.configured
        ? `<button class="pbtn primary" onclick="accountSignIn()">${t("continue_google")}</button>`:""}
    </div>
    <div class="pdiv"></div>
    <div class="pacc-lvl">
      <div class="pacc-lvl-row">
        <span class="pacc-lvl-badge">${li+1}</span>
        <div class="pacc-lvl-txt">
          <b>${t(cur.key)}</b>
          <span>${nxt?`${fmt(S.xp)} / ${fmt(nxt.xp)} XP`:tf("xp_max",{n:fmt(S.xp)})}</span>
        </div>
        <span class="pacc-lvl-rem">${nxt?tf("xp_next",{n:li+2})+" · "+fmt(nxt.xp-S.xp)+" XP":t("lvl_max_short")}</span>
      </div>
      <div class="pbar"><i style="width:${prog}%"></i></div>
    </div>
  </section>`;

  /* 2 — progress (text + bar rows, no chips) */
  const pstat=(lk,v,pct)=>`
  <div class="pstat">
    <div class="pstat-top"><span class="pstat-l">${t(lk)}</span><span class="pstat-v">${v}</span></div>
    <div class="pbar"><i style="width:${pct}%"></i></div>
  </div>`;
  const progress=`
  <section class="pacc-card">
    <div class="pacc-sec"><span class="sec-label">${t("sec_progress")}</span></div>
    ${pstat("p_learned",`${learned} / ${COUNTRIES.length}`, learned/COUNTRIES.length*100)}
    ${pstat("p_conts",`${S.conts.length} / 7`, S.conts.length/7*100)}
    ${pstat("p_acc",`${S.answered?acc+"%":"—"} <em>(${S.correct}/${S.answered} ${t("p_answers")})</em>`, acc)}
  </section>`;

  /* 3 — achievements (uniform tile grid) */
  const achievements=`
  <section class="pacc-card">
    <div class="pacc-sec">
      <span class="sec-label">${t("ach_h")}</span>
      <span class="pacc-sec-val">${tf("ach_count",{a:S.ach.length,b:ACH.length})}</span>
    </div>
    <div class="pbar" style="margin-bottom:16px"><i style="width:${S.ach.length/ACH.length*100}%"></i></div>
    <div class="ach-tiles">${ACH.map(achTile).join("")}</div>
  </section>`;

  /* 4 — settings (signed-in only) */
  const settings=signedIn?`
  <section class="pacc-card">
    <div class="pacc-sec"><span class="sec-label">${t("settings_h")}</span></div>
    <div class="field"><label for="f-disp">${t("f_display")}</label><input id="f-disp" maxlength="40" value="${escHtml(p.display_name||"")}"></div>
    <div class="field"><label for="f-user">${t("f_username")}</label><input id="f-user" maxlength="20" value="${escHtml(p.username||"")}"></div>
    <div class="prow">
      <span class="form-status" id="form-status"></span>
      <button class="pbtn primary" id="save-btn" onclick="accountSave()">${t("save_btn")}</button>
    </div>
  </section>`:"";

  /* 5 — data & privacy (identical rows; severity = button color only) */
  const data=`
  <section class="pacc-card">
    <div class="pacc-sec"><span class="sec-label">${t("sec_data")}</span></div>
    ${signedIn?`
    <div class="prow">
      <div class="prow-txt"><b>${t("sign_out")}</b><p>${t("signout_d")}</p></div>
      <button class="pbtn" onclick="accountSignOut()">${t("sign_out")}</button>
    </div>
    <div class="pdiv"></div>`:""}
    <div class="prow">
      <div class="prow-txt"><b>${t("reset_zone_h")}</b><p>${t("reset_zone_d")}</p></div>
      <button class="pbtn" onclick="askResetProgress()">${t("reset")}</button>
    </div>
    ${signedIn?`
    <div class="pdiv"></div>
    <div class="prow">
      <div class="prow-txt"><b>${t("delete_btn")}</b><p>${t("danger_d")}</p></div>
      <button class="pbtn danger" onclick="askDeleteAccount()">${t("del_confirm")}</button>
    </div>`:""}
  </section>`;

  app.innerHTML=`<div class="page">
    <div class="sec-head">
      <div><h2 class="sec-title">${t("acct_h")}</h2><p class="sec-sub">${signedIn?t("acct_sub"):t("acct_sub_local")}</p></div>
    </div>
    ${Account.configured?"":`<div class="info-note">${ic("globe",15)} ${t("acct_not_conf")}</div>`}
    <div class="pacc">
      ${header}
      ${progress}
      ${achievements}
      ${settings}
      ${data}
    </div>
  </div>`;
}

/* ---------- actions (unchanged) ---------- */
function accountSignIn(){
  const b=el("google-btn"); if(b){ b.disabled=true; b.style.opacity=".6"; }
  Account.signIn();
}
function accountSignOut(){ Account.signOut(); }
async function accountSave(){
  const st=el("form-status"), btn=el("save-btn");
  const displayName=el("f-disp").value.trim();
  const username=el("f-user").value.trim().toLowerCase();
  if(btn) btn.disabled=true;
  if(st){ st.className="form-status"; st.textContent=t("saving"); }
  const res=await Account.saveProfileFields({display_name:displayName, username});
  if(btn) btn.disabled=false;
  if(!st) return;
  if(res.ok){ st.className="form-status ok"; st.textContent=t("saved_ok"); renderChrome(); }
  else if(res.error==="taken"){ st.className="form-status err"; st.textContent=t("username_taken"); }
  else if(res.error==="short"){ st.className="form-status err"; st.textContent=t("username_short"); }
  else { st.className="form-status err"; st.textContent=t("save_error"); }
}
function askDeleteAccount(){
  el("modal-root").innerHTML=`
  <div class="overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" role="alertdialog" aria-label="${t("del_title")}">
      <div class="modal-in">
        <h3 style="font-size:24px;margin-bottom:8px">${t("del_title")}</h3>
        <p style="font-size:14.5px;color:var(--muted)">${t("del_body")}</p>
        <div class="m-actions">
          <button class="btn btn-ghost" onclick="closeModal()">${t("cancel")}</button>
          <button class="btn btn-danger" id="del-btn" onclick="doDeleteAccount()">${t("del_confirm")}</button>
        </div>
      </div>
    </div>
  </div>`;
}
async function doDeleteAccount(){
  const b=el("del-btn"); if(b){ b.disabled=true; b.style.opacity=".6"; }
  const res=await Account.deleteAccount();
  closeModal();
  toast(res.ok ? t("del_done") : t("del_error"), res.ok ? "check" : "x");
}
function askResetProgress(){
  const online = Account.signedIn();
  el("modal-root").innerHTML=`
  <div class="overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal" role="alertdialog" aria-label="${t("reset_title")}">
      <div class="modal-in">
        <h3 style="font-size:24px;margin-bottom:8px">${t("reset_title")}</h3>
        <p style="font-size:14.5px;color:var(--muted)">${t("reset_body")}</p>
        ${online?`<p class="modal-warn">${ic("x",15)} ${t("reset_online")}</p>`:""}
        <div class="m-actions">
          <button class="btn btn-ghost" onclick="closeModal()">${t("cancel")}</button>
          <button class="btn btn-danger" id="reset-confirm-btn" onclick="doResetProgress()">${t("reset_confirm")}</button>
        </div>
      </div>
    </div>
  </div>`;
}
async function doResetProgress(){
  const b=el("reset-confirm-btn"); if(b){ b.disabled=true; b.style.opacity=".6"; }
  S={...DEF}; save();
  if(Account.signedIn()) await Account.pushProgress();
  closeModal();
  renderChrome();
  renderAccount();
  toast(t("reset_done"),"refresh");
}