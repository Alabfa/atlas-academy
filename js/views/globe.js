/* ============================================================
   views/globe.js — INTERACTIVE 3D EARTH (home hero)
   Real NASA Blue Marble texture, drag to rotate with inertia,
   slow auto-rotation when idle, +/− zoom buttons.
   ▸ Needs three.js (loaded from CDN in index.html).
   ▸ Fully degrades: if three.js or the textures can't load
     (offline), the home screen still works — you just get a
     plain sphere or an empty mount, nothing breaks.
   ▸ Tuning: GLOBE_TEX = texture sources; the initial view is
     set in gRot (shows Africa/Europe/Atlantic).
============================================================ */
let gR=null,gScene=null,gCam=null,gGlobe=null,gRaf=null,gObs=null;
let gRot={x:0.22,y:-1.83}, gVel={x:0,y:0}, gZoom=1, gZoomT=1, gDrag=false, gIdle=0;
let gLast={x:0,y:0}, _onMove=null,_onUp=null,_onResize=null;

const GLOBE_TEX={
  day:"https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg",
  bump:"https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png",
  water:"https://unpkg.com/three-globe@2.31.0/example/img/earth-water.png"
};
const SVG_PLUS='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
const SVG_MINUS='<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14"/></svg>';

window.homeGlobeZoom = function(d){
  gZoomT = Math.min(1.25, Math.max(0.8, gZoomT + d*0.12));
};

function initHomeGlobe(mount){
  destroyHomeGlobe();
  if(!mount || typeof THREE==="undefined") return;
  const w = mount.clientWidth||320, h = mount.clientHeight||320;

  /* renderer + scene */
  const r = new THREE.WebGLRenderer({antialias:true, alpha:true});
  r.setPixelRatio(Math.min(window.devicePixelRatio||1, 2));
  r.setSize(w, h);
  r.outputEncoding = THREE.sRGBEncoding;
  r.domElement.className = "globe-canvas";
  r.domElement.style.touchAction = "none";   /* drag rotates, page scrolls elsewhere */
  mount.appendChild(r.domElement);
  gR = r;

  gScene = new THREE.Scene();
  gCam = new THREE.PerspectiveCamera(38, w/h, 0.1, 100);
  gCam.position.set(0,0,3.4);

  /* lighting — mostly even (the texture has baked sunlight),
     plus a soft directional light for depth */
  const sun = new THREE.DirectionalLight(0xfff2dd, .5); sun.position.set(-2.5, 1, 2.5);
  const amb = new THREE.AmbientLight(0xffffff, .95);
  gScene.add(sun, amb);

  /* the Earth */
  const mat = new THREE.MeshPhongMaterial({color:0x33475e, shininess:14, specular:new THREE.Color(0x223140)});
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), mat);
  gGlobe = new THREE.Group();
  gGlobe.add(earth);
  gGlobe.rotation.set(gRot.x, gRot.y, 0);
  gScene.add(gGlobe);

  /* subtle atmosphere rim */
  gGlobe.add(new THREE.Mesh(
    new THREE.SphereGeometry(1.05, 64, 64),
    new THREE.ShaderMaterial({
      transparent:true, side:THREE.BackSide, depthWrite:false,
      vertexShader:"varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
      fragmentShader:"varying vec3 vN;void main(){float i=pow(.62-dot(vN,vec3(0.,0.,1.)),3.5);gl_FragColor=vec4(.36,.6,.8,1.)*i;}"
    })
  ));

  /* real Earth textures — each loads independently, so a partial
     failure just means fewer details, never a broken globe */
  const loader = new THREE.TextureLoader();
  loader.setCrossOrigin("anonymous");
  loader.load(GLOBE_TEX.day,  tex=>{ tex.encoding=THREE.sRGBEncoding; mat.map=tex; mat.color.set(0xffffff); mat.needsUpdate=true; });
  loader.load(GLOBE_TEX.bump, tex=>{ mat.bumpMap=tex; mat.bumpScale=.05; mat.needsUpdate=true; });
  loader.load(GLOBE_TEX.water,tex=>{ mat.specularMap=tex; mat.needsUpdate=true; });

  requestAnimationFrame(()=>mount.classList.add("globe-ready")); /* fade in */

  /* zoom buttons */
  const zc = document.createElement("div");
  zc.className = "globe-zoom";
  const mkBtn = (label, svg, fn)=>{
    const b=document.createElement("button");
    b.type="button"; b.setAttribute("aria-label",label); b.innerHTML=svg;
    b.addEventListener("click",fn); zc.appendChild(b);
  };
  mkBtn(t("globe_in"),  SVG_PLUS, ()=>homeGlobeZoom(1));
  mkBtn(t("globe_out"), SVG_MINUS,()=>homeGlobeZoom(-1));
  mount.appendChild(zc);

  /* drag to rotate (mouse + touch) */
  const cvs = r.domElement;
  cvs.addEventListener("pointerdown", e=>{
    if(e.pointerType==="mouse" && e.button!==0) return;
    gDrag=true; gIdle=0; gVel={x:0,y:0};
    gLast={x:e.clientX, y:e.clientY};
    try{ cvs.setPointerCapture(e.pointerId); }catch(_){}
  });
  _onMove = e=>{
    if(!gDrag) return;
    const dx=e.clientX-gLast.x, dy=e.clientY-gLast.y;
    gLast={x:e.clientX, y:e.clientY};
    const f=.0045;
    gRot.y += dx*f;
    gRot.x  = Math.max(-1.05, Math.min(1.05, gRot.x + dy*f));
    gVel.y = gVel.y*.35 + dx*f*.65;   /* remembered for inertia */
    gVel.x = gVel.x*.35 + dy*f*.65;
  };
  _onUp = ()=>{ gDrag=false; };
  window.addEventListener("pointermove", _onMove);
  window.addEventListener("pointerup", _onUp);
  window.addEventListener("pointercancel", _onUp);

  /* resize */
  _onResize = ()=>{
    const nw=mount.clientWidth, nh=mount.clientHeight;
    if(!nw||!nh) return;
    r.setSize(nw,nh); gCam.aspect=nw/nh; gCam.updateProjectionMatrix();
  };
  if(window.ResizeObserver){ gObs=new ResizeObserver(_onResize); gObs.observe(mount); }
  else window.addEventListener("resize", _onResize);

  /* animation loop */
  let last = performance.now();
  const tick = now=>{
    gRaf = requestAnimationFrame(tick);
    const dt = Math.min((now-last)/16.7, 3); last = now;
    if(document.hidden || !gGlobe) return;
    if(!gDrag){
      gRot.y += gVel.y*dt;
      gRot.x  = Math.max(-1.05, Math.min(1.05, gRot.x + gVel.x*dt));
      const dmp = Math.pow(.93, dt);
      gVel.x*=dmp; gVel.y*=dmp;
      gIdle += dt;
      /* ease back into slow auto-rotation after ~2.5s idle,
         in the real west→east direction */
      if(gIdle>150) gRot.y += .0016*dt*Math.min(1,(gIdle-150)/150);
    } else gIdle = 0;
    gZoom += (gZoomT-gZoom)*Math.min(1,.12*dt);
    gCam.position.z = 3.4/gZoom;
    gGlobe.rotation.set(gRot.x, gRot.y, 0);
    r.render(gScene, gCam);
  };
  gRaf = requestAnimationFrame(tick);
}

function destroyHomeGlobe(){
  if(gRaf){ cancelAnimationFrame(gRaf); gRaf=null; }
  if(_onMove){
    window.removeEventListener("pointermove",_onMove);
    window.removeEventListener("pointerup",_onUp);
    window.removeEventListener("pointercancel",_onUp);
    _onMove=_onUp=null;
  }
  if(_onResize){
    if(gObs){ gObs.disconnect(); gObs=null; }
    else window.removeEventListener("resize",_onResize);
    _onResize=null;
  }
  if(gR){
    if(gScene) gScene.traverse(o=>{
      if(o.geometry) o.geometry.dispose();
      if(o.material){
        const m=o.material;
        if(m.map)m.map.dispose(); if(m.bumpMap)m.bumpMap.dispose(); if(m.specularMap)m.specularMap.dispose();
        m.dispose();
      }
    });
    if(gR.domElement) gR.domElement.remove();
    gR.dispose();
  }
  gR=null; gScene=null; gCam=null; gGlobe=null; gDrag=false;
}