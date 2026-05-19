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
  try{
    const r=await fetch(`${SB_URL}/rest/v1/${table}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Prefer':'return=minimal'},body:JSON.stringify(data)});
    return r.ok;
  }catch(e){return false;}
}
async function sbUpsert(table,data,onConflict){
  try{
    const r=await fetch(`${SB_URL}/rest/v1/${table}?on_conflict=${onConflict}`,{method:'POST',headers:{'Content-Type':'application/json','apikey':SB_KEY,'Authorization':`Bearer ${SB_KEY}`,'Prefer':'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify(data)});
    return r.ok||r.status===409;
  }catch(e){return false;}
}

/* ---- TOAST 15% RABAIS ---- */
const TOAST_KEY='gt_p_claimed';
const TOAST_LATER_KEY='gt_p_later';
function showToast(){
  // Si déjà réclamé => ne plus afficher
  if(localStorage.getItem(TOAST_KEY))return;
  const laterTime=localStorage.getItem(TOAST_LATER_KEY);
  // Si "plus tard" cliqué, attendre 5 min avant de remontre
  if(laterTime&&Date.now()-parseInt(laterTime)<5*60*1000)return;
  const t=document.getElementById('toast');
  if(t){t.style.display='block';t.style.animation='toastIn .4s cubic-bezier(.34,1.56,.64,1)';}
}
function closeP(){const t=document.getElementById('toast');if(t)t.style.display='none';}
function laterP(){
  closeP();
  localStorage.setItem(TOAST_LATER_KEY,Date.now().toString());
  // Réafficher après 5 min (si l'utilisateur reste)
  setTimeout(showToast,5*60*1000);
}
function claimP(){
  closeP();
  localStorage.setItem(TOAST_KEY,'1');
  window.location.href='#curiosite';
  setTimeout(()=>{
    const msg=document.getElementById('f2Msg');
    if(msg)msg.value='Je souhaite bénéficier de l\'offre de 15% sur ma première collaboration avec GAROMS-TECH.';
  },600);
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
    if(lf)lf.style.width=p+'%';
    if(lc)lc.textContent=p+'%';
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
  setTimeout(showFloat,2500);
  setTimeout(showToast,5000);
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
  const canvas=document.getElementById('hcanvas');
  if(!canvas)return;
  const cv=document.createElement('canvas');canvas.appendChild(cv);
  cv.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
  const ctx=cv.getContext('2d');let W,H,pts=[];
  function resize(){W=cv.width=canvas.offsetWidth;H=cv.height=canvas.offsetHeight;}
  resize();window.addEventListener('resize',resize,{passive:true});
  for(let i=0;i<80;i++)pts.push({x:Math.random()*2000,y:Math.random()*900,r:Math.random()*.8+.2,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.2,o:Math.random()*.35+.05});
  (function draw(){ctx.clearRect(0,0,W,H);pts.forEach(p=>{p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.o>0.2?`rgba(232,93,4,${p.o})`:`rgba(251,146,60,${p.o})`;ctx.fill();});requestAnimationFrame(draw);})();
  if(typeof gsap!=='undefined'){
    const h1=document.getElementById('hh1');
    if(h1)gsap.from(h1,{opacity:0,y:40,duration:1.2,ease:'power4.out',delay:.3});
  }
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
let chatHistory=[];
let floatShown=false;
let leadSaved=false;

/* Customer profile persistent memory */
function getCustMem(){try{const r=localStorage.getItem(GT_MEM);return r?JSON.parse(r):{};}catch(e){return{};}}
function setCustMem(data){try{localStorage.setItem(GT_MEM,JSON.stringify({...getCustMem(),...data,updated:Date.now()}));}catch(e){}}

/* Block history — persists 30 days, used to warn AI on return */
function getBlockHist(){try{const r=localStorage.getItem(GT_BLOCK_HIST);if(!r)return [];const a=JSON.parse(r);const cutoff=Date.now()-30*24*3600000;return a.filter(t=>t>cutoff);}catch(e){return[];}}
function addBlockHist(){try{const h=getBlockHist();h.push(Date.now());localStorage.setItem(GT_BLOCK_HIST,JSON.stringify(h));}catch(e){}}
function wasBlockedBefore(){return getBlockHist().length>0;}

function extractCustMem(){
  const allMsgs=chatHistory.map(m=>m.content).join(' ');
  const userMsgs=chatHistory.filter(m=>m.role==='user').slice(-8).map(m=>m.content).join(' ');
  /* email */
  const emailM=allMsgs.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  if(emailM)setCustMem({email:emailM[0]});
  /* name */
  const nameM=userMsgs.match(/(?:je suis|je m'appelle|mon nom est|c'est|prénom[:\s]+|name[:\s]+)\s*([A-Z\u00C0-\u00DC][a-zA-Z\u00C0-\u00FF]{1,})/i);
  if(nameM)setCustMem({name:nameM[1]});
  /* phone with country code */
  const phoneM=allMsgs.match(/(\+\d{1,3}[\s\-]?[\d\s\-]{6,15})/);
  if(phoneM)setCustMem({phone:phoneM[1].replace(/\s/g,'')});
  /* country code from phone */
  const ccM=allMsgs.match(/\+(\d{1,3})/);
  if(ccM)setCustMem({countryCode:'+'+ccM[1]});
  /* auto-save to Supabase when lead is complete */
  const mem=getCustMem();
  if(!leadSaved&&mem.name&&mem.email&&mem.phone&&!mem.sbSaved){
    leadSaved=true;
    setCustMem({sbSaved:true});
    sbPost('gt_chat_leads',{name:mem.name,email:mem.email,phone:mem.phone,country_code:mem.countryCode||null,source:'chat_widget',created_at:new Date().toISOString()}).catch(()=>{});
  }
}

/* Persistent chat history — localStorage, 7 days */
function saveCH(){
  try{localStorage.setItem(GT_HIST,JSON.stringify({msgs:chatHistory,ts:Date.now()}));extractCustMem();}catch(e){}
}
function loadCH(){
  try{
    const r=localStorage.getItem(GT_HIST);if(!r)return;
    const d=JSON.parse(r);
    if(d&&Array.isArray(d.msgs)&&(Date.now()-d.ts)<HIST_TTL)chatHistory=d.msgs;
    else localStorage.removeItem(GT_HIST);
  }catch(e){}
}
function isBlocked(){try{const b=localStorage.getItem(GT_BLOCK);if(!b)return false;const bd=JSON.parse(b);if(Date.now()-bd.ts<BLOCK_DUR)return{remaining:Math.ceil((BLOCK_DUR-(Date.now()-bd.ts))/60000)};localStorage.removeItem(GT_BLOCK);return false;}catch(e){return false;}}
function setBlock(){localStorage.setItem(GT_BLOCK,JSON.stringify({ts:Date.now()}));addBlockHist();}
function updateBlockUI(){
  const b=isBlocked(),inp=document.getElementById('cfInput'),btn=document.getElementById('cfSendBtn'),banner=document.getElementById('cfBlockBanner'),q=document.getElementById('cfQuick');
  if(b){if(inp){inp.disabled=true;inp.placeholder='Conversation suspendue...';}if(btn)btn.disabled=true;if(banner){banner.style.display='block';banner.textContent=`⏸ Suspendu — disponible dans ${b.remaining} min`;}if(q)q.style.display='none';setTimeout(updateBlockUI,60000);}
  else{if(inp){inp.disabled=false;inp.placeholder='Écrivez votre message...';}if(btn)btn.disabled=false;if(banner)banner.style.display='none';}
}
function restoreChatUI(){
  const msgs=document.getElementById('cfMsgs');if(!msgs)return;msgs.innerHTML='';
  const bm=document.createElement('div');bm.className='msg bot';
  if(chatHistory.length===0){
    const mem=getCustMem();
    if(mem&&mem.name)bm.textContent='Bon retour, '+mem.name+' ! Comment puis-je vous aider ?';
    else bm.textContent='Bonjour \uD83D\uDC4B Je représente l\'équipe GAROMS-TECH. Vous avez un projet ou une question ? Je suis là.';
    msgs.appendChild(bm);return;
  }
  chatHistory.forEach(m=>{const div=document.createElement('div');div.className='msg '+(m.role==='user'?'usr':'bot');let txt=m.content.replace('###BLOCKED###','').trim();div.textContent=txt;if(txt)msgs.appendChild(div);});
  msgs.scrollTop=msgs.scrollHeight;
}
function showFloat(){
  floatShown=true;
  const b=document.getElementById('cfBubble');
  if(b)setTimeout(()=>{b.style.display='none';},6000);
}
let chatOpen=false;
function toggleChat(){
  chatOpen=!chatOpen;
  const p=document.getElementById('cfPanel'),b=document.getElementById('cfBubble');
  if(p)p.style.display=chatOpen?'flex':'none';
  if(b)b.style.display='none';
  const n=document.querySelector('.cf-notif');
  if(n)n.style.display='none';
  if(chatOpen){updateBlockUI();const i=document.getElementById('cfInput');if(i&&!i.disabled)setTimeout(()=>i.focus(),100);}
}
function sendQuick(txt){
  const inp=document.getElementById('cfInput');if(!inp||inp.disabled)return;
  inp.value=txt;sendAI();
  const q=document.getElementById('cfQuick');if(q)q.style.display='none';
}
async function sendAI(){
  const inp=document.getElementById('cfInput'),msgs=document.getElementById('cfMsgs'),typ=document.getElementById('cfTyping');
  const val=inp?inp.value.trim():'';
  if(!val||!msgs||inp.disabled)return;
  if(isBlocked()){updateBlockUI();return;}
  const um=document.createElement('div');um.className='msg usr';um.textContent=val;msgs.appendChild(um);
  inp.value='';msgs.scrollTop=msgs.scrollHeight;
  chatHistory.push({role:'user',content:val});
  saveCH();
  const q=document.getElementById('cfQuick');if(q)q.style.display='none';
  if(typ)typ.style.display='flex';
  const bm=document.createElement('div');bm.className='msg bot';
  try{
    const custCtx={...getCustMem(),wasBlocked:wasBlockedBefore(),blockCount:getBlockHist().length};
    const res=await fetch('/.netlify/functions/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:chatHistory.slice(-20),customer:custCtx})});
    const data=await res.json();
    let reply=data.reply||"Je n'ai pas pu répondre. WhatsApp : +509 43 11 10 54.";
    const isBlock=reply.includes('###BLOCKED###');
    reply=reply.replace('###BLOCKED###','').trim();
    chatHistory.push({role:'assistant',content:reply});
    saveCH();
    bm.textContent=reply;
    if(isBlock){setBlock();updateBlockUI();}
  }catch(e){
    bm.textContent="Connexion interrompue. Contactez-nous : +509 43 11 10 54.";
  }
  if(typ)typ.style.display='none';
  msgs.appendChild(bm);msgs.scrollTop=msgs.scrollHeight;
}

/* DEMO CHAT */
function sendDemo(){
  const inp=document.getElementById('demoInput'),body=document.getElementById('chatDemo');
  const val=inp?inp.value.trim():'';
  if(!val||!body)return;
  const m=document.createElement('div');m.className='msg usr';m.textContent=val;body.appendChild(m);
  inp.value='';body.scrollTop=body.scrollHeight;
  setTimeout(()=>{const bm=document.createElement('div');bm.className='msg bot';bm.textContent='Merci ! Notre agent IA traite votre demande. Pour une démonstration complète, contactez-nous sur WhatsApp au +509 41 77 35 49.';body.appendChild(bm);body.scrollTop=body.scrollHeight;},900);
}

/* FAQ */
function toggleFaq(el){
  const item=el.parentElement;
  document.querySelectorAll('.faq-item.open').forEach(i=>{if(i!==item){i.classList.remove('open');}});
  item.classList.toggle('open');
}

/* CONTACT */
async function sendContact(e){
  e.preventDefault();
  const btn=document.getElementById('cfSubmit');
  if(btn){btn.disabled=true;btn.textContent='Envoi en cours...';}
  const d={prenom:document.getElementById('cfPrenom').value,nom:document.getElementById('cfNom').value,email:document.getElementById('cfEmail').value,tel:document.getElementById('cfTel').value,service:document.getElementById('cfService').value,message:document.getElementById('cfMsg').value,source:'site_contact',created_at:new Date().toISOString()};
  const ok=await sbPost('contact',d);
  if(ok){
    try{const leads=JSON.parse(localStorage.getItem('gt_leads')||'[]');leads.push({name:d.prenom+' '+d.nom,email:d.email,service:d.service,saved:Date.now()});localStorage.setItem('gt_leads',JSON.stringify(leads.slice(-10)));}catch(_){}
    if(d.prenom)setCustMem({name:d.prenom,email:d.email});
    document.getElementById('cfForm').style.display='none';
    const okEl=document.getElementById('cfOk');if(okEl)okEl.style.display='block';
  }else{
    if(btn){btn.disabled=false;btn.textContent='Envoyer le message \u2192';}
    alert('Erreur lors de l\'envoi. Contactez-nous directement sur WhatsApp ou par email.');
  }
}
function sendContactWA(){
  const p=document.getElementById('cfPrenom').value||'';
  const s=document.getElementById('cfService').value||'';
  const m=document.getElementById('cfMsg').value||'';
  const txt=encodeURIComponent(`Bonjour GAROMS-TECH !\n\nPrénom : ${p}\nService souhaité : ${s}\n\nMessage : ${m}`);
  window.open(`https://wa.me/50941773549?text=${txt}`,'_blank');
}

/* NEWSLETTER */
const GT_NL_KEY='gt_nl_subs';
function nlAlreadySub(em){try{const a=JSON.parse(localStorage.getItem(GT_NL_KEY)||'[]');return a.includes(em.toLowerCase().trim());}catch(e){return false;}}
function nlSaveSub(em){try{const a=JSON.parse(localStorage.getItem(GT_NL_KEY)||'[]');if(!a.includes(em.toLowerCase().trim())){a.push(em.toLowerCase().trim());localStorage.setItem(GT_NL_KEY,JSON.stringify(a));}}catch(e){}}
async function subNL(e){
  e.preventDefault();
  const em=(document.getElementById('nlEmail').value||'').trim();
  const btn=document.getElementById('nlBtn');
  if(!em||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){if(btn){btn.textContent='Email invalide';setTimeout(()=>{btn.textContent='S\'abonner →';},2500);}return;}
  if(nlAlreadySub(em)){if(btn){btn.textContent='Déjà abonné ✓';setTimeout(()=>{btn.textContent='S\'abonner →';},3000);}document.getElementById('nlEmail').value='';return;}
  if(btn){btn.disabled=true;btn.textContent='...';}
  const ok=await sbUpsert('newsletter',{email:em,source:'index_top',created_at:new Date().toISOString()},'email');
  if(ok){nlSaveSub(em);if(btn)btn.textContent='Abonné ✓';}
  else{if(btn)btn.textContent='Erreur — Réessayez';}
  document.getElementById('nlEmail').value='';
  setTimeout(()=>{if(btn){btn.disabled=false;btn.textContent='S\'abonner →';}},3000);
}
async function subNL2(e){
  e.preventDefault();
  const em=(document.getElementById('nlEmail2').value||'').trim();
  const btn=document.getElementById('nlBtn2');
  if(!em||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){if(btn){btn.textContent='Email invalide';setTimeout(()=>{btn.textContent='S\'abonner →';},2500);}return;}
  if(nlAlreadySub(em)){if(btn){btn.textContent='Déjà abonné ✓';setTimeout(()=>{btn.textContent='S\'abonner →';},3000);}document.getElementById('nlEmail2').value='';return;}
  if(btn){btn.disabled=true;btn.textContent='...';}
  const ok=await sbUpsert('newsletter',{email:em,source:'index_bottom',created_at:new Date().toISOString()},'email');
  if(ok){nlSaveSub(em);if(btn)btn.textContent='Abonné ✓';}
  else{if(btn)btn.textContent='Erreur — Réessayez';}
  document.getElementById('nlEmail2').value='';
  setTimeout(()=>{if(btn){btn.disabled=false;btn.textContent='S\'abonner →';}},3000);
}
async function sendForm2(e){
  e.preventDefault();
  const btn=document.getElementById('f2Btn');
  if(btn){btn.disabled=true;btn.textContent='Envoi...';}
  const d={prenom:document.getElementById('f2Prenom').value,email:document.getElementById('f2Email').value,message:document.getElementById('f2Msg').value,source:'idee_form',created_at:new Date().toISOString()};
  const ok=await sbPost('contact',d);
  if(ok){
    document.getElementById('f2Form').style.display='none';
    const okEl=document.getElementById('f2Ok');if(okEl)okEl.style.display='block';
  }else{
    if(btn){btn.disabled=false;btn.textContent='Envoyer →';}
    alert('Erreur lors de l\'envoi. Contactez-nous sur WhatsApp au +509 43 11 10 54.');
  }
}

/* Dev helper — type clearGTChat() in browser console to reset all memory */
window.clearGTChat=function(){
  ['gt_chat_hist','gt_customer_mem','gt_chat_block','gt_block_hist','gt_p_claimed','gt_p_later','gt_leads'].forEach(k=>localStorage.removeItem(k));
  sessionStorage.clear();location.reload();
};

document.addEventListener('DOMContentLoaded',()=>{
  loadCH();restoreChatUI();updateBlockUI();
  initLoad();
});

/* CSS animation toast */
const style=document.createElement('style');
style.textContent='@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(20px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}';
document.head.appendChild(style);
