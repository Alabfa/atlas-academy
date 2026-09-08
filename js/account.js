/* ============================================================
   account.js — SUPABASE ACCOUNTS (Google-only auth, profile,
   XP sync, account deletion)
   ------------------------------------------------------------
   ▸ The existing XP/level system in state.js is NOT replaced.
     This module only mirrors S.xp (+ derived level) to the
     cloud. addXP() in state.js calls queueSync()/syncNow().
   ▸ On sign-in the local XP and cloud XP are merged using the
     higher of the two — progress is never lost either way.
   ▸ Every network failure is non-fatal: the game keeps
     working fully offline; sync retries on the next change.
============================================================ */
const Account = {
  configured:false, client:null, user:null, profile:null, _timer:null, _handledUid:null,

  init(){
    const cfg=window.ATLAS_SUPABASE;
    if(!cfg || !cfg.url || !cfg.anonKey || cfg.url.indexOf("YOUR-PROJECT-REF")>-1 || typeof window.supabase==="undefined"){ this.configured=false; return; }
    try{ this.client=window.supabase.createClient(cfg.url, cfg.anonKey); }
    catch(e){ this.configured=false; return; }
    this.configured=true;
    this.client.auth.getSession().then(({data})=>{ if(data&&data.session) this.handleSession(data.session); });
    this.client.auth.onAuthStateChange((event, session)=>{
      if(event==="SIGNED_OUT"){
        this.user=null; this.profile=null; this._handledUid=null;
        renderChrome();
        if(VIEW==="account"||VIEW==="ranking") VIEWS[VIEW]();
      }
      else if(session && (event==="SIGNED_IN"||event==="INITIAL_SESSION")) this.handleSession(session);
    });
  },

  async handleSession(session){
    if(!session || !session.user) return;
    this.user=session.user;
    if(this._handledUid===this.user.id){ renderChrome(); return; }
    this._handledUid=this.user.id;
    renderChrome();
    await this.ensureProfile();
    renderChrome();
    /* Return the user to the page that started the sign-in
       (e.g. the ranking gate); expires after 10 minutes. */
    try{
      const ret=(sessionStorage.getItem("atlas-return")||"").split(":");
      sessionStorage.removeItem("atlas-return");
      if(ret[0] && VIEWS[ret[0]] && Date.now()-Number(ret[1]||0)<10*60*1000){
        go(ret[0]); return;
      }
    }catch(e){}
    if(VIEW==="account") renderAccount();
  },

  avatarUrl(){ const m=(this.user&&this.user.user_metadata)||{}; return m.avatar_url||m.picture||null; },
  fullName(){ const m=(this.user&&this.user.user_metadata)||{}; return m.full_name||m.name||m.email||"Player"; },

  /* Find an unused username derived from the Google account. */
  async freeUsername(base){
    let b=String(base||"player").split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g,"").slice(0,18);
    if(b.length<3) b=(b||"player")+"1";
    const cands=[b, b+Math.floor(10+Math.random()*90), b+Math.floor(100+Math.random()*9000)];
    for(const c of cands){
      const {count}=await this.client.from("profiles").select("id",{count:"exact",head:true}).eq("username",c);
      if(!count) return c;
    }
    return b+Date.now().toString(36).slice(-4);
  },

  /* Create the profile row on first sign-in, or merge progress. */
  async ensureProfile(){
    if(!this.user) return;
    const uid=this.user.id;
    const {data, error}=await this.client.from("profiles").select("*").eq("id",uid).maybeSingle();
    if(error){ console.warn("profile load failed", error); return; }
    if(!data){
      const meta=this.user.user_metadata||{};
      const username=await this.freeUsername(this.user.email || meta.user_name || this.fullName());
      const {data:created, error:err}=await this.client.from("profiles")
        .insert({id:uid, username, display_name:this.fullName(), avatar_url:this.avatarUrl(), xp:S.xp, level:lvlIndex()+1})
        .select().single();
      if(err){ console.warn("profile create failed", err); return; }
      this.profile=created;
      return;
    }
    /* Merge: keep whichever XP is higher (local or cloud). */
    const remote=data, best=Math.max(S.xp, remote.xp||0);
    if(best!==S.xp){ S.xp=best; save(); }
    if(best!==(remote.xp||0)){
      await this.client.from("profiles")
        .update({xp:best, level:lvlIndex()+1, updated_at:new Date().toISOString()}).eq("id",uid);
      remote.xp=best; remote.level=lvlIndex()+1;
    }
    this.profile=remote;
  },

  signedIn(){ return !!(this.configured && this.user); },

  signIn(){
    if(!this.configured) return;
    try{ sessionStorage.setItem("atlas-return", VIEW+":"+Date.now()); }catch(e){}
    return this.client.auth.signInWithOAuth({ provider:"google", options:{ redirectTo: location.origin+location.pathname } });
  },
  async signOut(){
    if(!this.configured) return;
    try{ await this.client.auth.signOut(); }catch(e){}
    this.user=null; this.profile=null; this._handledUid=null;
    renderChrome();
    if(VIEW==="account"||VIEW==="ranking") VIEWS[VIEW]();
  },

  /* ---------- progress sync (xp + derived level only) ---------- */
  async pushProgress(){
    if(!this.signedIn()) return;
    try{
      const {error}=await this.client.from("profiles")
        .update({xp:S.xp, level:lvlIndex()+1, updated_at:new Date().toISOString()})
        .eq("id",this.user.id);
      if(error) console.warn("progress sync failed", error);
      else if(this.profile){ this.profile.xp=S.xp; this.profile.level=lvlIndex()+1; }
    }catch(e){ console.warn("progress sync failed", e); }
  },
  queueSync(){ if(this._timer) clearTimeout(this._timer); this._timer=setTimeout(()=>this.pushProgress(), 4000); },
  syncNow(){ if(this._timer) clearTimeout(this._timer); return this.pushProgress(); },

  /* ---------- profile editing ---------- */
  async saveProfileFields(fields){
    if(!this.signedIn()) return {error:"auth"};
    const patch={ updated_at:new Date().toISOString() };
    if(fields.display_name!==undefined && fields.display_name.trim()) patch.display_name=fields.display_name.trim().slice(0,40);
    if(fields.username!==undefined){
      const u=fields.username.replace(/[^a-z0-9_]/g,"");
      if(u && u.length<3) return {error:"short"};
      patch.username=u||null;
    }
    const {data, error}=await this.client.from("profiles").update(patch).eq("id",this.user.id).select().single();
    if(error) return {error: error.code==="23505" ? "taken" : "generic"};
    this.profile=data;
    return {ok:true};
  },

  /* ---------- account deletion (RPC created in the SQL setup) ----------
     The auth user is deleted by a SECURITY DEFINER Postgres function,
     so no privileged key ever lives in the frontend. The profile row
     disappears via ON DELETE CASCADE. */
  async deleteAccount(){
    if(!this.signedIn()) return {error:"auth"};
    const {error}=await this.client.rpc("delete_own_account");
    if(error) return {error};
    try{ await this.client.auth.signOut(); }catch(e){}
    this.user=null; this.profile=null; this._handledUid=null;
    renderChrome();
    if(VIEW==="account"||VIEW==="ranking") VIEWS[VIEW]();
    return {ok:true};
  }
};

/* Escape user-provided strings before inserting into HTML. */
function escHtml(s){
  return String(s==null?"":s).replace(/[&<>"']/g, m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
}

/* Topbar auth area — called from renderChrome() in app.js. */
function renderAuthArea(){
  const host=el("auth-area"); if(!host) return;
  if(!Account.configured){ host.innerHTML=""; return; }
  if(Account.signedIn()){
    const av=(Account.profile&&Account.profile.avatar_url)||Account.avatarUrl();
    host.innerHTML=`<button class="avatar-btn" onclick="go('account')" aria-label="${t("acct_h")}" title="${escHtml((Account.profile&&Account.profile.display_name)||"")}">${av?`<img src="${escHtml(av)}" alt="">`:ic("pin",15)}</button>`;
  } else {
    host.innerHTML=`<button class="btn-signin" onclick="go('account')">${ic("pin",14)} ${t("sign_in")}</button>`;
  }
}