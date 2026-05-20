/* GAROMS-TECH — Scripts principaux */
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-70VF95VJ9M');

// PWA standalone detection
if(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true){
  document.documentElement.classList.add('pwa-standalone');
  document.body.classList.add('pwa-mode');
}

const SB_URL='https://boelpuehvvuvddyyphpe.supabase.co';
const SB_KEY='sb_publishable_tOjmLT97b3y2ou2P62a4vA_nlperttq';
async function sbPost(table,data){
  try{const r=await fetch(`${SB_URL}/rest/v1/${table}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Prefer':'return=minimal'},body:JSON.stringify(data)});return r.ok;}catch(e){return false;}
}
async function sbUpsert(table,data,onConflict){
  try{const r=await fetch(`${SB_URL}/rest/v1/${table}?on_conflict=${onConflict}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Prefer':'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(data)});return r.ok||r.status===409;}catch(e){return false;}
}

/* ---- TOAST 15% RABAIS ---- */
const TOAST_KEY='gt_p_claimed';
const TOAST_LATER_KEY='gt_p_later';
function showToast(){
  if(localStorage.getItem(TOAST_KEY))return;
  const laterTime=localStorage.getItem(TOAST_LATER_KEY);
  if(laterTime&&Date.now()-parseInt(laterTime)<5*60*1000)return;
  const t=document.getElementById('toast');
  if(t){t.style.display='block';t.style.animation='toastIn .4s cubic-bezier(.34,1.56,.64,1)';}
}
function closeP(){const t=document.getElementById('toast');if(t)t.style.display='none';}
function laterP(){closeP();localStorage.setItem(TOAST_LATER_KEY,Date.now().toString());setTimeout(showToast,5*60*1000);}
function claimP(){
  closeP();localStorage.setItem(TOAST_KEY,'1');window.location.href='#curiosite';
  setTimeout(()=>{const msg=document.getElementById('f2Msg');if(msg)msg.value='Je souhaite bénéficier de l\'offre de 15% sur ma première collaboration avec GAROMS-TECH.';},600);
}

/* ---- LOADING ---- */
const CFG={dur:4200,vKey:'gt_v3'};
const S={done:false,t0:Date.now(),ti:null};
function initLoad(){
  const ll=document.getElementById('ll'),lt=document.getElementById('ltag'),lf=document.getElementById('lpf'),lc=document.getElementById('lpc');
  if(!ll||typeof gsap==='undefined'){finish();return;}
  if(localStorage.getItem(CFG.vKey)&&lt)lt.textContent='Bon retour chez GAROMS-TECH !';
  localStorage.setItem(CFG.vKey,'1');
  gsap.timeline({defaults:{ease:'power3.out'}})
    .to(ll,{opacity:1,y:0,duration:.9,delay:.1})
    .to(lt,{opacity:1,duration:.6},'-=.35')
    .to('#ls .lpbar',{opacity:1,duration:.4},'-=.2')
    .to(lc,{opacity:1,duration:.35},'-=.15')
    .to('#ls .lskip',{opacity:1,duration:.4},'-=.15');
  S.ti=setInterval(()=>{
    const p=Math.min(100,Math.round(((Date.now()-S.t0)/CFG.dur)*100));
    if(lf)lf.style.width=p+'%';if(lc)lc.textContent=p+'%';
    if(p>=100){clearInterval(S.ti);setTimeout(finish,180);}
  },40);
}
function skip(){const lf=document.getElementById('lpf'),lc=document.getElementById('lpc');if(lf)lf.style.width='100%';if(lc)lc.textContent='100%';setTimeout(finish,280);}
function finish(){
  if(S.done)return;S.done=true;clearInterval(S.ti);
  const sc=document.getElementById('ls'),si=document.getElementById('site');
  if(typeof gsap!=='undefined'&&sc)gsap.to(sc,{opacity:0,duration:.6,onComplete:()=>reveal(sc,si)});
  else{if(sc)sc.style.display='none';reveal(null,si);}
}
function reveal(sc,si){
  if(sc)sc.style.display='none';
  if(si){si.style.display='block';si.style.opacity='0';
    if(typeof gsap!=='undefined')gsap.to(si,{opacity:1,duration:.5});else si.style.opacity='1';
    if(typeof AOS!=='undefined')AOS.init({once:true,duration:750,easing:'ease-out-cubic',offset:80});}
  if(typeof Swiper!=='undefined')new Swiper('.mySwiper',{slidesPerView:1,spaceBetween:24,pagination:{el:'.swiper-pagination',clickable:true},breakpoints:{768:{slidesPerView:2},1024:{slidesPerView:3}},autoplay:{delay:5000,disableOnInteraction:false},loop:true});
  initHeader();initHero();initScroll();initStats();
  setTimeout(showFloat,2500);setTimeout(showToast,5000);
}
function initHeader(){
  const h=document.getElementById('hdr');
  if(h)window.addEventListener('scroll',()=>h.classList.toggle('on',window.scrollY>10),{passive:true});
}
function toggleMenu(){
  const m=document.getElementById('mmenu'),b=document.getElementById('hmb');
  if(!m||!b)return;
  const o=m.classList.toggle('o');b.classList.toggle('o',o);document.body.style.overflow=o?'hidden':'';
}
function closeMenu(){
  const m=document.getElementById('mmenu'),b=document.getElementById('hmb');
  if(m)m.classList.remove('o');if(b)b.classList.remove('o');document.body.style.overflow='';
}
document.addEventListener('click',e=>{
  const m=document.getElementById('mmenu'),b=document.getElementById('hmb');
  if(m&&b&&m.classList.contains('o')&&!m.contains(e.target)&&!b.contains(e.target))closeMenu();
});
function initStats(){
  const items=document.querySelectorAll('.stat-n[data-count]');
  if(!items.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){
        const el=en.target,end=+el.dataset.count,suf=el.textContent.replace(/[0-9]/g,'');
        let start=0;const dur=1800,step=Math.ceil(end/60);
        const t=setInterval(()=>{start=Math.min(start+step,end);el.textContent=start+suf;if(start>=end)clearInterval(t);},dur/60);
        io.unobserve(el);
      }
    });
  },{threshold:.3});
  items.forEach(el=>io.observe(el));
}
function initHero(){
  const canvas=document.getElementById('hcanvas');if(!canvas)return;
  const cv=document.createElement('canvas');canvas.appendChild(cv);
  cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  const ctx=cv.getContext('2d');let W,H,pts=[];
  function resize(){W=cv.width=canvas.offsetWidth;H=cv.height=canvas.offsetHeight;}
  resize();window.addEventListener('resize',resize,{passive:true});
  for(let i=0;i<80;i++)pts.push({x:Math.random()*2000,y:Math.random()*900,r:Math.random()*.8+.2,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.2,o:Math.random()*.35+.05});
  (function draw(){ctx.clearRect(0,0,W,H);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.o>0.2?`rgba(232,93,4,${p.o})`:`rgba(251,146,60,${p.o})`;ctx.fill();});requestAnimationFrame(draw);})();
  if(typeof gsap!=='undefined'){const h1=document.getElementById('hh1');if(h1)gsap.from(h1,{opacity:0,y:40,duration:1.2,ease:'power4.out',delay:.3});}
}
function initScroll(){
  const items=document.querySelectorAll('.faq-item');
  items.forEach(i=>{if(i.classList.contains('open')&&!i.querySelector('.faq-a').style.display)i.querySelector('.faq-a').style.display='block';});
}

/* FLOAT CHAT + MEMORY + BLOCK */
const GT_HIST='gt_chat_hist';
const GT_BLOCK='gt_chat_block';
const GT_BLOCK_HIST='gt_block_hist';
const GT_MEM='gt_customer_mem';
const BLOCK_DUR=3600000;
const HIST_TTL=7*24*3600000;

/* ---- LIMITES CHAT ---- */
const MAX_CHARS=500;        // karaktè max pa mesaj
const MAX_SESSION_MSGS=20;  // mesaj max pa sesyon
const MSG_COOLDOWN=2500;    // ms ant chak mesaj (anti-spam)
let lastMsgTime=0;
/* ---- FIN LIMITES ---- */

let chatHistory=[];
let floatShown=false;
let leadSaved=false;

function getCustMem(){try{const r=localStorage.getItem(GT_MEM);return r?JSON.parse(r):{};}catch(e){return{};}}
function setCustMem(data){try{localStorage.setItem(GT_MEM,JSON.stringify({...getCustMem(),...data,updated:Date.now()}));}catch(e){}}

function getBlockHist(){try{const r=localStorage.getItem(GT_BLOCK_HIST);if(!r)return[];const a=JSON.parse(r);const cutoff=Date.now()-30*24*3600000;return a.filter(t=>t>cutoff);}catch(e){return[];}}
function addBlockHist(){try{const h=getBlockHist();h.push(Date.now());localStorage.setItem(GT_BLOCK_HIST,JSON.stringify(h));}catch(e){}}
function wasBlockedBefore(){return getBlockHist().length>0;}

function extractCustMem(){
  const allMsgs=chatHistory.map(m=>m.content).join(' ');
  const userMsgs=chatHistory.filter(m=>m.role==='user').slice(-8).map(m=>m.content).join(' ');
  const emailM=allMsgs.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if(emailM)setCustMem({email:emailM[0]});
  const nameM=userMsgs.match(/(?:je suis|je m'appelle|mon nom est|c'est|prénom[:\s]+|name[:\s]+)\s*([A-Z\u00C0-\u00DC][a-zA-Z\u00C0-\u00FF]{1,})/i);
  if(nameM)setCustMem({name:nameM[1]});
  const phoneM=allMsgs.match(/(\+\d{1,3}[\s\-]?[\d\s\-]{6,15})/);
  if(phoneM)setCustMem({phone:phoneM[1].replace(/\s/g,'')});
  const ccM=allMsgs.match(/\+(\d{1,3})/);
  if(ccM)setCustMem({countryCode:'+'+ccM[1]});
  const mem=getCustMem();
  if(!lead
