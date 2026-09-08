/* ============================================================
   views/account.js — ACCOUNT / PROFILE PAGE
   Sign-in card (Google only), profile view & edit, sign out,
   delete account with confirmation modal. All data operations
   live in js/account.js; this file only renders UI.
============================================================ */
function renderAccount(){
  const app=el("app");
  if(!Account.configured){
    app.innerHTML=`<div class="page">
      <div class="sec-head"><div><h2 class="sec-title">${t("acct_h")}</h2></div></div>
      <div class="empty" style="margin-top:26px"><div class="eicon">${ic("pin",22)}</div>${t("not_configured")}</div></div>`;
    return;
  }
  if(!Account.user){
    app.innerHTML=`<div class="page">
      <div class="acct-card">
        <h2 class="sec-title" style="font-size:26px">${t("signin_h")}</h2>
        <p class="sec-sub" style="margin:8px 0 22px">${t("signin_d")}</p>
        <button class="google-btn" id="google-btn" onclick="accountSignIn()">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.7-.4-3.9z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3l5.7-5.7C34.3 6.1 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.7-.4-3.9z"/></svg>
          ${t("continue_google")}
        </button>
        <p class="sync-note" style="margin-top:14px">${ic("lock",13)} ${t("signin_note")}</p>
      </div></div>`;
    return;
  }
  const p=Account.profile||{};
  const li=lvlIndex();
  app.innerHTML=`<div class="page">
    <div class="sec-head"><div><h2 class="sec-title">${t("acct_h")}</h2><p class="sec-sub">${t("acct_sub")}</p></div></div>
    <div class="acct-card">
      <div class="acct-head">
        ${p.avatar_url?`<img class="acct-avatar" src="${escHtml(p.avatar_url)}" alt="">`:`<span class="acct-avatar-fb">${ic("pin",26)}</span>`}
        <div>
          <h3 style="font-size:20px">${escHtml(p.display_name||"")}</h3>
          ${p.username?`<div style="font-size:13px;color:var(--muted)">@${escHtml(p.username)}</div>`:""}
        </div>
      </div>
      <div class="ro-grid">
        <div class="ro-box"><div class="k">${t("f_level")}</div><div class="v">${li+1} · ${t(LEVELS[li].key)}</div></div>
        <div class="ro-box"><div class="k">${t("f_xp")}</div><div class="v">${fmt(S.xp)}</div></div>
      </div>
      <p class="sync-note">${ic("refresh",13)} ${t("xp_note")}</p>
      <div class="field"><label for="f-disp">${t("f_display")}</label><input id="f-disp" maxlength="40" value="${escHtml(p.display_name||"")}"></div>
      <div class="field"><label for="f-user">${t("f_username")}</label><input id="f-user" maxlength="20" value="${escHtml(p.username||"")}"></div>
      <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">
        <button class="btn btn-primary" id="save-btn" onclick="accountSave()">${t("save_btn")}</button>
        <span class="form-status" id="form-status"></span>
      </div>
      <p class="sync-note" style="margin-top:16px">${ic("globe",13)} ${t("sync_note")}</p>
      <div style="border-top:1px solid var(--line);margin-top:18px;padding-top:18px">
        <button class="btn btn-ghost" onclick="accountSignOut()">${ic("left",15)} ${t("sign_out")}</button>
      </div>
      <div class="reset-zone">
        <div><b>${t("reset_zone_h")}</b><p>${t("reset_zone_d")}</p></div>
        <button class="btn btn-ghost" onclick="askResetProgress()">${t("reset")}</button>
      </div>
      <div class="danger-zone">
        <div><b>${t("danger_h")}</b><p>${t("danger_d")}</p></div>
        <button class="btn btn-danger" onclick="askDeleteAccount()">${t("delete_btn")}</button>
      </div>
    </div></div>`;
}
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
  S={...DEF}; save();                                  /* wipe local progress (same as before) */
  if(Account.signedIn()) await Account.pushProgress(); /* keep cloud consistent: online XP/level → 0 */
  closeModal();
  renderChrome();
  renderAccount();
  toast(t("reset_done"),"refresh");
}