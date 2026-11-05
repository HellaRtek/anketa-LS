(function(){
"use strict";

/* ---------- Schema ---------- */
const NOSTAND = "без стенда";
const CAT_SECTIONS = ["сельхозтехника и запчасти","хранение и переработка","полив и теплицы","агрохимия и семена","рекламно-информационные услуги"];
const DEF_PAVS = ["Павильон 1","Павильон 2","Павильон 3","Павильон 4","Открытая площадка 1","Открытая площадка 2","Открытая площадка 3"];
const DEF_LETTERS = {A:"Павильон 1",B:"Павильон 2",C:"Павильон 3",D:"Павильон 4",X:"Открытая площадка 1",Y:"Открытая площадка 2"};
const CAM = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.5" r="3.5"/></svg>';
const PHOTO_KEYS = ["photoCard","photoAny"];
const PERSONAL = ["surname","nameP","phone","contact","lprSurname","lprName","lprPosition","lprPhone","lprEmail","photoCard","photoAny"];
const NEED_NEWS = ["прислать демо","прислать итоги исследования","коммерческое предложение"];
const URGENT_STEP = "срочная адаптация на эту выставку";
const SCHEMA = [
  {id:"s1", num:"1", title:"Стенд", fields:[
    {k:"pav", t:"pav", l:"Павильон", lx:"переходит в следующую анкету", w:"full"},
    {k:"stand", t:"stand", l:"Стенд", w:"full", onlyStand:true},
    {k:"org", t:"org", l:"Компания", w:"full", req:true, cat:true},
    {k:"sections", t:"multi", l:"Разделы выставки", w:"full", o:CAT_SECTIONS.concat([NOSTAND]), excl:NOSTAND, cat:true},
    {k:"subtype", t:"single", l:"Чем занимается", w:"full", onlyNo:true, o:["застройщик стендов","дизайн и полиграфия","логистика","реклама и маркетинг","продажи (компания без стенда)","другое"], other:"другое"},
    {k:"site", t:"text", l:"Сайт", w:"half", im:"url", cat:true},
    {k:"country", t:"text", l:"Страна", w:"half", cat:true}
  ]},
  {id:"sp", num:CAM, title:"Фото", photos:true, fields:[
    {k:"photoCard", t:"photo", l:"Визитка", w:"half", cta:"Сфотографировать визитку", max:1800, suf:"vizitka"},
    {k:"photoAny", t:"photo", l:"Фото", w:"half", cta:"Сделать фото", max:1400, suf:"foto"}
  ]},
  {id:"s2", num:"2", title:"Респондент", fields:[
    {k:"surname", t:"text", l:"Фамилия", w:"half", ac:"family-name"},
    {k:"nameP", t:"text", l:"Имя Отчество", w:"half", ac:"given-name"},
    {k:"position", t:"text", l:"Должность", w:"full"},
    {k:"role", t:"single", l:"Роль на стенде", lNo:"Роль в компании", w:"full", o:["руководитель стенда","менеджер по продажам","маркетолог","промоутер / хостес","другое"], other:"другое"},
    {k:"phone", t:"tel", l:"Телефон", w:"half"},
    {k:"contact", t:"text", l:"E-mail / мессенджер", w:"half", im:"email"},
    {k:"selfDecides", t:"toggle", l:"ЛПР", w:"full", o:["Решение по выставкам и маркетингу принимает сам"], xh:"Решает сам"}
  ]},
  {id:"s3", num:"3", title:"Как собирают контакты", titleNo:"Как записывают контакты", fields:[
    {k:"method", t:"multi", l:"Как собираете контакты", lNo:"Как записываете, с кем говорили?", w:"full", req:true, o:["визитки","блокнот","бумажная анкета","Google Формы","Яндекс Формы","таблица на телефоне / ноутбуке","лидсканер организатора","своё приложение / CRM","специально не собираем","другое"], excl:"специально не собираем", other:"другое", xh:"Как собирают контакты"},
    {k:"whatRecord", t:"multi", l:"Что записываете кроме контакта", w:"full", o:["интерес к продукту","бюджет","сроки","роль в решении","приоритет","только контакт"], excl:"только контакт"},
    {k:"visitors", t:"single", l:"Посетителей у стенда в день", w:"full", onlyStand:true, o:["до 20","20–50","50–100","больше 100"]},
    {k:"standsPerDay", t:"single", l:"Стендов обходите за день", w:"full", onlyNo:true, o:["до 20","20–50","больше 50"]},
    {k:"handoff", t:"single", l:"Когда контакты попадают к менеджерам", w:"full", o:["в тот же день","в течение недели","дольше","не знаю"]},
    {k:"lastResult", t:"single", l:"Результат прошлой выставки по контактам", w:"full", o:["доволен","так себе","не считали"]},
    {k:"catalogUse", t:"single", l:"Пользуетесь каталогом экспонентов при обходе", w:"full", onlyNo:true, o:["да","нет","не знал, что он есть"]}
  ]},
  {id:"s4", num:"4", title:"Проблемы и интерес", fields:[
    {k:"pains", t:"multi", l:"Что мешает", lx:"до трёх пунктов", w:"full", req:true, max:3, o:["теряются визитки","долгий ручной ввод после выставки","непонятно, кто важный","нет интернета в павильоне","данные у разных сотрудников","контакты долго доходят до менеджеров","проблем нет","другое"], excl:"проблем нет", other:"другое"},
    {k:"interest", t:"single", l:"Интерес к такому приложению", w:"full", req:true, o:["да","возможно","нет"]},
    {k:"urgent", t:"toggle", l:"Срочность", w:"full", o:["Нужно уже на этой выставке"], xh:"Нужно на этой выставке", box:true},
    {k:"nextExpos", t:"text", l:"Ближайшие выставки", lx:"где ещё участвуют в ближайший год", w:"full"}
  ]},
  {id:"s5", num:"5", title:"Кто принимает решение", collapsible:true, fields:[
    {k:"lprSurname", t:"text", l:"Фамилия", w:"half", xh:"ЛПР: фамилия"},
    {k:"lprName", t:"text", l:"Имя Отчество", w:"half", xh:"ЛПР: имя отчество"},
    {k:"lprPosition", t:"text", l:"Должность", w:"full", xh:"ЛПР: должность"},
    {k:"lprPhone", t:"tel", l:"Телефон", w:"half", xh:"ЛПР: телефон"},
    {k:"lprEmail", t:"text", l:"E-mail", w:"half", im:"email", xh:"ЛПР: e-mail"}
  ]},
  {id:"s6", num:"6", title:"Следующий шаг", fields:[
    {k:"nextSteps", t:"multi", l:"Что дальше", w:"full", o:["прислать демо","прислать итоги исследования","коммерческое предложение",URGENT_STEP,"позвонить","без продолжения"], excl:"без продолжения"},
    {k:"contactWhen", t:"date", l:"Когда удобно связаться", w:"half"},
    {k:"channel", t:"single", l:"Канал", w:"half", o:["звонок","e-mail","мессенджер"]}
  ]},
  {id:"s7", num:"7", title:"Согласия", note:'Персональные данные обрабатывает ООО «Логик Сфера», политика конфиденциальности — <a href="https://logicsphera.ru/privacy" target="_blank" rel="noopener">logicsphera.ru/privacy</a>, вопросы — info@logicsphera.ru.', fields:[
    {k:"consentPd", t:"toggle", l:"Персональные данные", w:"full", o:["Согласен(на) на обработку персональных данных ООО «Логик Сфера»"], xh:"Согласие на обработку ПДн", box:true},
    {k:"consentNews", t:"toggle", l:"Информация", w:"full", o:["Согласен(на) получать информацию от «Логик Сферы» и итоги исследования"], xh:"Согласие на информацию", box:true}
  ]},
  {id:"s8", num:"★", title:"Для интервьюера", staff:true, fields:[
    {k:"date", t:"date", l:"Дата", w:"third"},
    {k:"staff", t:"text", l:"Интервьюер", w:"third"},
    {k:"formNoView", t:"ro", l:"№ анкеты", w:"third"},
    {k:"priority", t:"single", l:"Приоритет", lx:"предлагается по интересу, можно изменить", w:"full", o:["A","B","C"], pri:true},
    {k:"agreed", t:"area", l:"Договорились", w:"full"},
    {k:"addReminder", t:"toggle", l:"Напоминание", w:"full", o:["Добавить напоминание в календарь"], xh:"Напоминание"}
  ]}
];
const FIELDS = {}; SCHEMA.forEach(s=>s.fields.forEach(f=>{f.sec=s.id; FIELDS[f.k]=f;}));

/* ---------- Storage helpers (all guarded) ---------- */
const LS = {
  get(k, d){ try{ const v = localStorage.getItem(k); return v==null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }
};
const K_REC="lsSurvey.records.v1", K_DRAFT="lsSurvey.draft.v1", K_SET="lsSurvey.settings.v1", K_VIS="lsSurvey.visits.v1", K_HINT="lsSurvey.installHint";
let settings = Object.assign({device:"Л1", staff:"", event:"ЮГАГРО-2026", pavilion:"", bkAt:0, bkN:0}, LS.get(K_SET, {}));
let records = LS.get(K_REC, {}) || {};
let visits = LS.get(K_VIS, {}) || {};
let localOk = LS.set(K_REC, records);
let form = {}, editingId = null;
let catalog = null;          // {name, loadedAt, rows:[...], letters:{A:"Павильон 1"}, pavs:[...]}
const mode = (window.claude && window.claude.use) ? "artifact" : "file";
const dlPromise = mode==="artifact" ? window.claude.use("downloads").catch(()=>null) : Promise.resolve(null);

const $ = s => document.querySelector(s);
const esc = s => String(s==null?"":s).replace(/[&<>"]/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const pad = (n,l=2)=>String(n).padStart(l,"0");
const todayISO = ()=>{const d=new Date();return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());};
const newId = ()=> "v"+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const live = ()=> Object.values(records).filter(r=>r && !r.deleted).sort((a,b)=>b.createdAt-a.createdAt);
const clone = o => JSON.parse(JSON.stringify(o));
const norm = s => String(s||"").toLowerCase().replace(/ё/g,"е").replace(/[^a-zа-я0-9]/g,"");
const fio = v => [v.surname, v.nameP].filter(Boolean).join(" ");
const saveSettings = ()=> LS.set(K_SET, settings);

function persist(){ localOk = LS.set(K_REC, records); renderStatus(); }
function persistVisits(){ LS.set(K_VIS, visits); }
function saveDraft(){ LS.set(K_DRAFT, {form, editingId}); }

/* ---------- IndexedDB: photos + catalog ---------- */
const IDB = (()=>{
  let dbp=null;
  function open(){
    if (dbp) return dbp;
    dbp = new Promise((res,rej)=>{
      try{
        const rq=indexedDB.open("lsSurvey",1);
        rq.onupgradeneeded=()=>{ const d=rq.result; if(!d.objectStoreNames.contains("photos")) d.createObjectStore("photos"); if(!d.objectStoreNames.contains("kv")) d.createObjectStore("kv"); };
        rq.onsuccess=()=>res(rq.result); rq.onerror=()=>rej(rq.error);
      }catch(e){ rej(e); }
    });
    dbp.catch(()=>{ dbp=null; });
    return dbp;
  }
  function tx(store, mode, fn){
    return open().then(db=>new Promise((res,rej)=>{
      const t=db.transaction(store,mode), r=fn(t.objectStore(store)); let out;
      if (r) r.onsuccess=()=>{ out=r.result; };
      t.oncomplete=()=>res(out); t.onerror=()=>rej(t.error); t.onabort=()=>rej(t.error);
    }));
  }
  const api = store => ({
    put:(id,val)=>tx(store,"readwrite",st=>st.put(val,id)),
    get:id=>tx(store,"readonly",st=>st.get(id)),
    del:id=>tx(store,"readwrite",st=>st.delete(id)),
    keys:()=>tx(store,"readonly",st=>st.getAllKeys())
  });
  return {photos:api("photos"), kv:api("kv")};
})();
const PDB = IDB.photos;

/* ---------- Catalog helpers ---------- */
const LAT = {"А":"A","В":"B","С":"C","Д":"D","Е":"E","Х":"X","У":"Y","К":"K","М":"M","Н":"H","О":"O","Р":"P","Т":"T"};
const normStand = s => String(s||"").toUpperCase().replace(/[А-ЯЁ]/g, c=>LAT[c]||c).replace(/\s+/g,"");
function letterMap(){ return (catalog && catalog.letters && Object.keys(catalog.letters).length) ? catalog.letters : DEF_LETTERS; }
function pavOfStand(st){ const m=/^([A-Z])/.exec(normStand(st)); return m ? (letterMap()[m[1]]||"") : ""; }
function letterOfPav(p){ const m=letterMap(); return Object.keys(m).find(L=>m[L]===p) || ""; }
function pavList(){
  const set = new Set(catalog && catalog.pavs && catalog.pavs.length ? catalog.pavs : DEF_PAVS);
  if (settings.pavilion) set.add(settings.pavilion);
  if (form.pav) set.add(form.pav);
  return [...set].sort(pavCmp);
}
function pavCmp(a,b){ const pa=/^павильон/i.test(a)?0:1, pb=/^павильон/i.test(b)?0:1; return pa-pb || a.localeCompare(b,"ru",{numeric:true}); }
function letters(){ return Object.keys(letterMap()).sort(); }
function catById(id){ return catalog ? catalog.byId[id] : null; }
function rowPavs(row){
  const s = new Set(row.pav);
  row.stands.forEach(st=>{ const p=pavOfStand(st); if(p) s.add(p); });
  return [...s];
}
function standsInPav(row, p){ return row.stands.filter(st=>pavOfStand(st)===p); }
function indexCatalog(c){
  c.byId = {}; c.rows.forEach(r=>{ c.byId[r.id]=r; });
  return c;
}
function surveyedCount(){ const m={}; live().forEach(r=>{ if(r.v.catId) m[r.v.catId]=(m[r.v.catId]||0)+1; }); return m; }

/* Minimal XLSX reader: ZIP central directory + DecompressionStream("deflate-raw") + DOMParser */
async function readZip(buf){
  const u=new Uint8Array(buf), dv=new DataView(buf);
  let e=u.length-22; while(e>=0 && dv.getUint32(e,true)!==0x06054b50) e--;
  if (e<0) throw new Error("это не файл Excel (.xlsx)");
  const n=dv.getUint16(e+10,true); let p=dv.getUint32(e+16,true); const ents={};
  const td=new TextDecoder();
  for (let i=0;i<n;i++){
    if (dv.getUint32(p,true)!==0x02014b50) break;
    const method=dv.getUint16(p+10,true), csize=dv.getUint32(p+20,true), nl=dv.getUint16(p+28,true), xl=dv.getUint16(p+30,true), cl=dv.getUint16(p+32,true), lho=dv.getUint32(p+42,true);
    ents[td.decode(u.subarray(p+46,p+46+nl))]={method,csize,lho};
    p+=46+nl+xl+cl;
  }
  return async name=>{
    const en=ents[name]; if(!en) return null;
    const lnl=dv.getUint16(en.lho+26,true), lxl=dv.getUint16(en.lho+28,true), start=en.lho+30+lnl+lxl;
    const data=u.subarray(start,start+en.csize);
    let out;
    if (en.method===0) out=data;
    else if (en.method===8){
      if (!window.DecompressionStream) throw new Error("браузер устарел — обновите iPadOS или Chrome");
      const s=new Blob([data]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
      out=new Uint8Array(await new Response(s).arrayBuffer());
    } else throw new Error("неизвестное сжатие в файле");
    return td.decode(out);
  };
}
const X = (doc, tag) => [...doc.getElementsByTagNameNS("*", tag)];
function colIdx(ref){ const m=/^([A-Z]+)/.exec(ref||""); if(!m) return -1; let n=0; for(const ch of m[1]) n=n*26+(ch.charCodeAt(0)-64); return n-1; }
async function parseXlsx(buf){
  const get = await readZip(buf), P = new DOMParser();
  const xml = async n => { const t=await get(n); return t==null ? null : P.parseFromString(t,"application/xml"); };
  const wb = await xml("xl/workbook.xml"); if(!wb) throw new Error("в файле нет книги Excel");
  const rels = await xml("xl/_rels/workbook.xml.rels");
  const relMap = {}; if (rels) X(rels,"Relationship").forEach(r=>{ relMap[r.getAttribute("Id")]=r.getAttribute("Target"); });
  const sheets = X(wb,"sheet").map(s=>({name:s.getAttribute("name"), rid:s.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","id")||s.getAttribute("r:id")}));
  const sh = sheets.find(s=>/участник|экспонент/i.test(s.name)) || sheets[0];
  if (!sh) throw new Error("в книге нет листов");
  let target = relMap[sh.rid] || "worksheets/sheet1.xml"; target = target.replace(/^\/?xl\//,"").replace(/^\//,"");
  const sst = await xml("xl/sharedStrings.xml");
  const strs = sst ? X(sst,"si").map(si=>X(si,"t").map(t=>t.textContent).join("")) : [];
  const ws = await xml("xl/"+target); if(!ws) throw new Error("не удалось прочитать лист «"+sh.name+"»");
  const rows = [];
  X(ws,"row").forEach(r=>{
    const arr=[];
    X(r,"c").forEach((c,i)=>{
      const t=c.getAttribute("t"), ref=c.getAttribute("r"), ix = ref ? colIdx(ref) : i;
      let v="";
      if (t==="s"){ const vv=X(c,"v")[0]; v = vv ? (strs[+vv.textContent]||"") : ""; }
      else if (t==="inlineStr"){ v = X(c,"t").map(x=>x.textContent).join(""); }
      else { const vv=X(c,"v")[0]; v = vv ? vv.textContent : ""; }
      arr[ix]=v;
    });
    rows.push(arr);
  });
  return {sheet:sh.name, rows};
}
function buildCatalog(parsed, fileName){
  const R = parsed.rows; let hi = R.findIndex(r=>r && r.some(x=>/^\s*компания\s*$/i.test(x||"")));
  if (hi<0) throw new Error("не нашёл столбец «Компания» на листе «"+parsed.sheet+"»");
  const H = R[hi].map(h=>String(h||"").trim().toLowerCase());
  const col = re => H.findIndex(h=>re.test(h));
  const ci = {id:col(/^№$|^n$|^#$/), name:col(/^компания$/), country:col(/^страна/), pav:col(/павильон|площадка/), stand:col(/^стенд/), sec:col(/^раздел/), site:col(/^сайт/)};
  const rows=[]; const vote={};
  R.slice(hi+1).forEach((r,i)=>{
    if (!r) return;
    const name = String(r[ci.name]||"").trim(); if(!name) return;
    const id = String(ci.id>=0 && r[ci.id] ? r[ci.id] : i+1).trim();
    const stands = String(ci.stand>=0 ? r[ci.stand]||"" : "").split(/[,;]+/).map(s=>normStand(s)).filter(s=>s && !/NOT_?ASSIGNED/i.test(s));
    const pav = String(ci.pav>=0 ? r[ci.pav]||"" : "").split("|").map(s=>s.trim()).filter(Boolean).filter((x,j,a)=>a.indexOf(x)===j);
    const secs = String(ci.sec>=0 ? r[ci.sec]||"" : "").split(";").map(s=>s.trim().toLowerCase()).filter(Boolean);
    const row = {id, name, country:String(ci.country>=0?r[ci.country]||"":"").trim(), pav, stands:[...new Set(stands)], sections:secs, site:String(ci.site>=0?r[ci.site]||"":"").trim()};
    rows.push(row);
    if (pav.length===1) row.stands.forEach(st=>{ const L=st[0]; if(/[A-Z]/.test(L)){ vote[L]=vote[L]||{}; vote[L][pav[0]]=(vote[L][pav[0]]||0)+1; } });
  });
  if (!rows.length) throw new Error("в файле нет строк с компаниями");
  const letters={}; Object.keys(vote).forEach(L=>{ letters[L]=Object.entries(vote[L]).sort((a,b)=>b[1]-a[1])[0][0]; });
  const pavs=new Set(); rows.forEach(r=>r.pav.forEach(p=>pavs.add(p))); Object.values(letters).forEach(p=>pavs.add(p));
  return indexCatalog({name:fileName, loadedAt:Date.now(), rows, letters, pavs:[...pavs]});
}
async function loadCatalogFile(file){
  try{
    const buf = await file.arrayBuffer();
    const c = buildCatalog(await parseXlsx(buf), file.name);
    const store = Object.assign({}, c); delete store.byId;
    await IDB.kv.put("catalog", store);
    catalog = c;
    const noSt = c.rows.filter(r=>!r.stands.length).length;
    toast(`Каталог загружен: ${c.rows.length} компаний`+(noSt?`, без номера стенда — ${noSt}`:""));
    if (!settings.pavilion){ settings.pavilion = pavList()[0]||""; saveSettings(); if(!editingId && !form.pav){ form.pav=settings.pavilion; } }
    renderAll(); syncAll();
  }catch(err){ toast("Не удалось загрузить каталог: "+((err&&err.message)||"ошибка"), true); }
}
["catFile","catFile2"].forEach(id=>$("#"+id).addEventListener("change", e=>{ const f=e.target.files[0]; e.target.value=""; if(f) loadCatalogFile(f); }));
let catDelArm=false;
$("#catDel").addEventListener("click", async ()=>{
  const b=$("#catDel");
  if (!catDelArm){ catDelArm=true; b.textContent="Точно удалить каталог?"; b.classList.add("armed"); setTimeout(()=>{catDelArm=false; b.textContent="Удалить каталог"; b.classList.remove("armed");},3000); return; }
  catDelArm=false; b.textContent="Удалить каталог"; b.classList.remove("armed");
  try{ await IDB.kv.del("catalog"); }catch(e){}
  catalog=null; toast("Каталог удалён. Анкеты и отметки обхода сохранены."); renderAll(); syncAll();
});

/* ---------- Form rendering ---------- */
function isNoStand(v){ return ((v||form).sections||[]).includes(NOSTAND); }
function labelOf(f){ return (isNoStand() && f.lNo) ? f.lNo : f.l; }
function lblHTML(f){
  return esc(labelOf(f)) + (f.req?' <span class="req">*</span>':'') + (f.lx ? ' <small>· '+esc(f.lx)+'</small>' : '') + (f.cat ? ' <span class="catmark" data-catmark hidden>из каталога</span>' : '');
}
function fieldHTML(f){
  const id = "f_"+f.k, w = "w-"+f.w;
  const wrap = (inner, extra) => `<div class="field ${w}${f.box?' boxed':''}${extra||''}" data-f="${f.k}">${inner}</div>`;
  if (f.t==="pav") return wrap(`<span class="lbl" id="${id}_l">${lblHTML(f)}</span><div class="chips sm" id="pavChips" role="group" aria-labelledby="${id}_l"></div>`);
  if (f.t==="stand") return wrap(`<span class="lbl" id="${id}_l">${lblHTML(f)}</span>
    <div class="standrow"><div class="chips sm letters" id="standL" role="group" aria-label="Буква стенда"></div><div class="inp"><input id="f_standN" class="num" inputmode="numeric" autocomplete="off" placeholder="номер" enterkeyhint="next" aria-labelledby="${id}_l"></div></div>
    <div class="notice" id="standNote" hidden></div>
    <div class="sugg" id="standSugg" hidden></div>`);
  if (f.t==="org") return wrap(`<label for="${id}" id="${id}_l">${lblHTML(f)}</label><div class="inp"><input id="${id}" data-k="org" autocomplete="off" autocapitalize="sentences" enterkeyhint="next" placeholder="Название или начало названия — подскажет каталог"></div><div class="sugg" id="orgSugg" hidden></div>`);
  if (f.t==="single" || f.t==="multi" || f.t==="toggle"){
    const m = f.t!=="single";
    const chips = f.o.map(v=>`<button type="button" class="chip${f.pri?' pri':''}" data-k="${f.k}" data-v="${esc(v)}" ${m?'data-m':''} aria-pressed="false">${esc(v)}</button>`).join("");
    const other = f.other ? `<div class="other" id="${id}_ow" hidden><label class="lbl" for="${id}_o">Другое — уточните</label><div class="inp"><input id="${id}_o" data-k="${f.k}Other" placeholder="Впишите свой вариант" autocomplete="off" autocapitalize="sentences" enterkeyhint="next"></div></div>` : "";
    const hint = f.max ? `<span class="hint" id="${id}_h">Можно выбрать до ${f.max}</span>` : "";
    const lbl = f.t==="toggle" && f.box ? "" : `<span class="lbl" id="${id}_l">${lblHTML(f)}</span>`;
    return wrap(`${lbl}<div class="chips${f.t==='toggle'?' fill':''}" role="group" aria-label="${esc(f.l)}">${chips}</div>${other}${hint}`);
  }
  if (f.t==="photo") return wrap(`<span class="lbl" id="${id}_l">${esc(f.l)}</span>
    <div class="ph-slot" id="${id}_slot">
      <label class="ph-empty" for="${id}_in">${CAM}<span>${esc(f.cta)}</span><small>камера или галерея</small></label>
      <img alt="${esc(f.l)}" hidden data-ph-view="${f.k}">
      <span class="ph-miss" hidden>Фото сохранено на другом планшете</span>
      <span class="ph-busy" hidden>Обработка фото…</span>
    </div>
    <input type="file" accept="image/*" class="vh" id="${id}_in" data-photo="${f.k}" tabindex="-1" aria-labelledby="${id}_l">
    <div class="ph-acts" id="${id}_acts" hidden><button type="button" class="btn sm" data-ph-view="${f.k}">Открыть</button><label class="btn sm" for="${id}_in">Переснять</label><button type="button" class="btn sm danger" data-ph-del="${f.k}">Удалить</button></div>`);
  if (f.t==="area") return wrap(`<label for="${id}" id="${id}_l">${lblHTML(f)}</label><textarea id="${id}" data-k="${f.k}" rows="3"></textarea>`);
  if (f.t==="ro") return wrap(`<label for="${id}">${esc(f.l)}</label><div class="inp"><input id="${id}" class="num" readonly tabindex="-1"></div>`);
  let type="text", im="", extra="";
  if (f.t==="tel"){ type="tel"; im='inputmode="tel"'; extra='autocomplete="tel"'; }
  if (f.t==="date"){ type="date"; }
  if (f.im==="email") im='inputmode="email" autocapitalize="off"';
  if (f.im==="url") im='inputmode="url" autocapitalize="off"';
  if (f.ac) extra='autocomplete="'+f.ac+'"';
  if (!extra) extra='autocomplete="off"';
  return wrap(`<label for="${id}" id="${id}_l">${lblHTML(f)}</label><div class="inp"><input id="${id}" data-k="${f.k}" type="${type}" ${im} ${extra} enterkeyhint="next" ${f.t==='text'&&!f.im?'autocapitalize="sentences"':''}></div>`);
}
function buildForm(){
  const host = $("#sections"), rail = $("#rail");
  SCHEMA.forEach(s=>{
    const el = document.createElement("section");
    el.className = "sec"+(s.staff?" staff":""); el.id = s.id;
    el.innerHTML = `<div class="sec-h"><span class="num">${s.num}</span><h2 id="${s.id}_t">${esc(s.title)}</h2><span class="cnt" id="${s.id}_c"></span></div>`
      + (s.note ? `<p class="secnote">${s.note}</p>` : "")
      + (s.collapsible ? `<div class="skipnote" id="${s.id}_skip" hidden><span>Контакты руководителя, который решает по выставкам и маркетингу. Если собеседник решает сам — отметьте это в разделе 2.</span><button class="btn sm" type="button" data-expand="${s.id}">Заполнить</button></div>` : "")
      + `<div class="fields">${s.fields.map(fieldHTML).join("")}</div>`;
    host.appendChild(el);
    const a = document.createElement("a");
    a.href = "#"+s.id; a.dataset.sec = s.id;
    a.innerHTML = `<span class="num">${s.num}</span><span id="${s.id}_rt">${esc(s.staff?"Интервьюер":s.title)}</span><span class="cnt" id="${s.id}_rc"></span>`;
    rail.appendChild(a);
  });
}
function blankForm(){ const p = settings.pavilion||""; return {date: todayISO(), staff: settings.staff || "", pav: p, _L: letterOfPav(p)}; }

function fieldVisible(f, v){
  v = v || form;
  const no = isNoStand(v);
  if (f.onlyNo && !no) return false;
  if (f.onlyStand && no) return false;
  if (f.sec==="s5" && v.selfDecides) return false;
  return true;
}
function filled(f, v){
  const x = v[f.k];
  if (f.t==="multi") return Array.isArray(x) && x.length>0;
  if (f.t==="toggle") return !!x;
  if (f.t==="ro" || f.t==="pav") return false;
  return x!=null && String(x).trim()!=="";
}
function curLetter(){
  const m=/^([A-Z])/.exec(form.stand||""); if (m) return m[1];
  return form._L || letterOfPav(form.pav) || "";
}
function standDigits(){ const s=form.stand||""; return /^[A-Z]/.test(s) ? s.slice(1) : s; }
function syncField(k){
  const f = FIELDS[k]; if(!f) return;
  const id = "f_"+k;
  if (f.t==="pav"){ renderPavChips(); return; }
  if (f.t==="stand"){
    const L=curLetter();
    $("#standL").innerHTML = letters().map(x=>`<button type="button" class="chip" data-letter="${x}" aria-pressed="${x===L}">${x}</button>`).join("");
    const inp=$("#f_standN"), d=standDigits(); if (inp.value!==d) inp.value=d;
    return;
  }
  if (f.t==="single"||f.t==="multi"||f.t==="toggle"){
    const cur = form[k];
    const sel = f.t==="single" ? (cur?[cur]:[]) : f.t==="multi" ? (cur||[]) : (cur?[f.o[0]]:[]);
    document.querySelectorAll(`.chip[data-k="${k}"]`).forEach(b=>{
      const on = sel.includes(b.dataset.v);
      b.setAttribute("aria-pressed", on?"true":"false");
      if (f.max) b.disabled = !on && sel.length>=f.max;
    });
    if (f.other){
      const w = document.getElementById(id+"_ow"), o = document.getElementById(id+"_o");
      w.hidden = !sel.includes(f.other); if (o.value!==(form[k+"Other"]||"")) o.value = form[k+"Other"]||"";
    }
    if (f.max){ const h=document.getElementById(id+"_h"); h.textContent = sel.length>=f.max ? `Выбрано ${sel.length} из ${f.max}` : `Можно выбрать до ${f.max}`; h.classList.remove("flash"); }
  } else if (f.t==="photo"){
    syncPhoto(k); return;
  } else if (f.t==="ro"){
    document.getElementById(id).value = editingId ? (records[editingId]||{}).formNo||"" : previewNo()+" (будет присвоен)";
  } else {
    const el = document.getElementById(id); if (el && el.value !== (form[k]||"")) el.value = form[k]||"";
  }
}
function syncAll(){ Object.keys(FIELDS).forEach(syncField); afterChange(true); }

function renderPavChips(){
  const host=$("#pavChips"); if(!host) return;
  host.innerHTML = pavList().map(p=>`<button type="button" class="chip" data-pav="${esc(p)}" aria-pressed="${p===form.pav}">${esc(p)}</button>`).join("");
}

let missingShown = false;
function afterChange(skipDraft){
  const no = isNoStand();
  let total = 0;
  SCHEMA.forEach(s=>{
    const sec = document.getElementById(s.id), a = document.querySelector(`.rail a[data-sec="${s.id}"]`);
    const hideSec = s.id==="s5" && !!form.selfDecides;
    sec.hidden = hideSec; a.hidden = hideSec;
    s.fields.forEach(f=>{ const el=sec.querySelector(`[data-f="${f.k}"]`); if(el) el.hidden = !fieldVisible(f); });
    const fs = s.fields.filter(f=>f.t!=="ro" && f.t!=="pav" && fieldVisible(f));
    const n = fs.filter(f=>filled(f,form)).length; total += n;
    document.getElementById(s.id+"_c").textContent = fs.length ? n+" / "+fs.length : "";
    document.getElementById(s.id+"_rc").textContent = n ? n : "";
    a.classList.toggle("done", n>0);
    if (s.collapsible){
      const open = !!form["_x_"+s.id] || n>0;
      document.getElementById(s.id+"_skip").hidden = open;
      sec.classList.toggle("collapsed", !open);
      a.classList.toggle("skip", !open);
    }
    if (s.titleNo){ const t = no ? s.titleNo : s.title; document.getElementById(s.id+"_t").textContent=t; document.getElementById(s.id+"_rt").textContent=t; }
  });
  // labels that change for «без стенда»
  Object.values(FIELDS).forEach(f=>{ if(f.lNo){ const l=document.getElementById("f_"+f.k+"_l"); if(l) l.innerHTML=lblHTML(f); } });
  document.querySelectorAll("[data-catmark]").forEach(m=>{ m.hidden = !form.catId; });
  // required highlighting after a failed save
  const miss = missingShown ? missingReq(collect()) : [];
  document.querySelectorAll(".field.missing").forEach(el=>el.classList.remove("missing"));
  document.querySelectorAll(".rail a.miss").forEach(el=>el.classList.remove("miss"));
  miss.forEach(f=>{ const el=document.querySelector(`[data-f="${f.k}"]`); if(el) el.classList.add("missing"); const a=document.querySelector(`.rail a[data-sec="${f.sec}"]`); if(a) a.classList.add("miss"); });
  if (missingShown && !miss.length) missingShown=false;
  renderStandNote(); renderOrgSugg(); renderStandSugg();
  $("#barNo").textContent = editingId ? (records[editingId]||{}).formNo : previewNo();
  $("#barFill").textContent = (form.pav?form.pav+" · ":"") + (total ? `заполнено полей: ${total}` : "анкета пустая");
  if (!skipDraft) saveDraft();
}

/* ---------- Numbering ---------- */
function nextSeq(){
  let m = 0; Object.values(records).forEach(r=>{ if (r.device===settings.device && r.seq>m) m=r.seq; });
  return m+1;
}
function previewNo(){ return settings.device + "-" + pad(nextSeq(),3); }

/* ---------- Stand, company, catalog suggestions ---------- */
function setPav(p, session){
  form.pav = p;
  if (session && !editingId){ settings.pavilion = p; saveSettings(); }
  if (!standDigits()) { form._L = letterOfPav(p) || form._L; form.stand=""; }
  syncField("pav"); syncField("stand");
}
function renderStandNote(){
  const el=$("#standNote"); if(!el) return;
  const sp = form.stand ? pavOfStand(form.stand) : "";
  const p = form.pav;
  if (!isNoStand() && p && settings.pavilion && p!==settings.pavilion && !editingId){
    el.innerHTML = `<span>${form.stand?`Стенд ${esc(form.stand)} — в «${esc(p)}»`:`Эта анкета — «${esc(p)}»`}, а вы сейчас в «${esc(settings.pavilion)}».</span><button class="btn sm" type="button" data-gopav="${esc(p)}">Перейти в «${esc(p)}»</button>`;
    el.hidden=false;
  } else if (!isNoStand() && sp && p && sp!==p){
    el.innerHTML = `<span>Стенд ${esc(form.stand)} по номеру относится к «${esc(sp)}».</span><button class="btn sm" type="button" data-gopav="${esc(sp)}">Перейти в «${esc(sp)}»</button>`;
    el.hidden=false;
  } else el.hidden=true;
}
const sgBadge = n => n ? `<span class="badge ok">опрошен${n>1?" ×"+n:""}</span>` : "";
function sgHTML(row, stand, cnt){
  const code = stand || (row.stands[0]||"—");
  const meta = [row.sections.join(", "), rowPavs(row).join(", ")].filter(Boolean).join(" · ");
  return `<button type="button" class="sg" data-cat="${esc(row.id)}" data-stand="${esc(stand||"")}"><span class="code">${esc(code)}</span><span class="nm">${esc(row.name)}</span><span class="bd">${sgBadge(cnt[row.id])}${visits[row.id]&&!cnt[row.id]?` <span class="badge ${visits[row.id].s==="refused"?"bad":"warn"}">${visits[row.id].s==="refused"?"отказ":"позже"}</span>`:""}</span><span class="mt">${esc(meta||"без раздела")}</span></button>`;
}
let standFocus=false, orgFocus=false;
function renderStandSugg(){
  const box=$("#standSugg"); if(!box) return;
  const d = standDigits();
  if (!catalog || isNoStand() || !d || form.catId || !standFocus){ box.hidden=true; return; }
  const q = normStand(form.stand), cnt=surveyedCount(), out=[];
  catalog.rows.forEach(r=>r.stands.forEach(st=>{ if(st.startsWith(q)) out.push([st,r]); }));
  out.sort((a,b)=>a[0].localeCompare(b[0],"en",{numeric:true}));
  if (!out.length){ box.innerHTML=`<div class="more">В каталоге нет стенда ${esc(q)}. Введите компанию вручную.</div>`; box.hidden=false; return; }
  box.innerHTML = out.slice(0,8).map(([st,r])=>sgHTML(r,st,cnt)).join("") + (out.length>8?`<div class="more">и ещё ${out.length-8} — введите номер дальше</div>`:"");
  box.hidden=false;
}
function renderOrgSugg(){
  const box=$("#orgSugg"); if(!box) return;
  const q = norm(form.org);
  if (!catalog || isNoStand() || form.catId || q.length<2 || !orgFocus){ box.hidden=true; return; }
  const cnt=surveyedCount(), here=[], other=[];
  catalog.rows.forEach(r=>{ const n=norm(r.name); if(!n.includes(q)) return; (rowPavs(r).includes(form.pav)?here:other).push(r); });
  const all = here.concat(other);
  if (!all.length){ box.hidden=true; return; }
  box.innerHTML = all.slice(0,8).map(r=>sgHTML(r, standsInPav(r, form.pav)[0]||r.stands[0]||"", cnt)).join("") + (all.length>8?`<div class="more">и ещё ${all.length-8} — уточните название</div>`:"");
  box.hidden=false;
}
function applyCatalog(row, stand){
  form.catId = row.id; form.org = row.name;
  form.stand = stand || standsInPav(row, form.pav)[0] || row.stands[0] || "";
  form._L = curLetter();
  const secs = row.sections.filter(s=>CAT_SECTIONS.includes(s));
  if (secs.length) form.sections = secs; else if (isNoStand()) form.sections = [];
  if (row.site) form.site = row.site;
  if (row.country) form.country = row.country;
  const p = (form.stand && pavOfStand(form.stand)) || row.pav[0] || form.pav;
  if (p) form.pav = p;
  standFocus=false; orgFocus=false;
  ["pav","stand","org","sections","site","country"].forEach(syncField);
  afterChange();
}
document.addEventListener("click", e=>{
  const sg = e.target.closest(".sg[data-cat]");
  if (sg){ const row=catById(sg.dataset.cat); if(row){ applyCatalog(row, sg.dataset.stand); const n=$("#f_surname"); if(n) n.focus({preventScroll:true}); document.getElementById("s1").scrollIntoView({block:"start"}); } return; }
  const pv = e.target.closest("[data-pav]");
  if (pv && pv.closest("#pavChips")){ setPav(pv.dataset.pav, true); afterChange(); return; }
  const gp = e.target.closest("[data-gopav]");
  if (gp){ setPav(gp.dataset.gopav, true); afterChange(); toast("Текущий павильон: "+gp.dataset.gopav); return; }
  const lt = e.target.closest("[data-letter]");
  if (lt){
    form._L = lt.dataset.letter; const d=standDigits();
    form.stand = d ? form._L + d : "";
    if (form.catId && form.stand && !(catById(form.catId)||{stands:[]}).stands.includes(form.stand)) form.catId="";
    const p = pavOfStand(form._L); if (p) form.pav = p;
    syncField("stand"); syncField("pav"); standFocus=true; afterChange(); $("#f_standN").focus({preventScroll:true});
    return;
  }
});
document.addEventListener("input", e=>{
  if (e.target.id!=="f_standN") return;
  let raw = normStand(e.target.value);
  const m = /^([A-Z])(.*)$/.exec(raw);
  if (m){ form._L = m[1]; raw = m[2]; }
  raw = raw.replace(/[^0-9A-Z-]/g,"");
  const L = m ? m[1] : (form._L || curLetter() || "");
  form.stand = raw ? (L + raw) : "";
  if (form.catId && !(form.stand && (catById(form.catId)||{stands:[]}).stands.includes(form.stand))) form.catId = "";
  const p = pavOfStand(form.stand||L); if (p && p!==form.pav){ form.pav = p; syncField("pav"); }
  if (m) syncField("stand");
  else document.querySelectorAll("#standL .chip").forEach(b=>b.setAttribute("aria-pressed", b.dataset.letter===L?"true":"false"));
  standFocus=true; afterChange();
});
document.addEventListener("focusin", e=>{
  if (e.target.id==="f_standN"){ standFocus=true; renderStandSugg(); }
  if (e.target.id==="f_org"){ orgFocus=true; renderOrgSugg(); }
});
let suggHold=0;
document.addEventListener("pointerdown", e=>{ if (e.target.closest && e.target.closest(".sugg")) suggHold=Date.now(); }, true);
document.addEventListener("focusout", e=>{
  if (e.target.id==="f_standN" || e.target.id==="f_org"){
    setTimeout(()=>{
      if (Date.now()-suggHold < 800) return;
      const a=document.activeElement; if (a && a.closest && a.closest(".sugg")) return;
      standFocus = !!(a && a.id==="f_standN"); orgFocus = !!(a && a.id==="f_org"); renderStandSugg(); renderOrgSugg();
    }, 200);
  }
});

/* ---------- Form events ---------- */
function autoPriority(){
  if (form.priManual) return;
  const p = form.interest==="да" ? "A" : form.interest==="возможно" ? "B" : form.interest==="нет" ? "C" : "";
  form.priority = form.urgent ? "A" : p;
  syncField("priority");
}
function onChip(b){
  const k=b.dataset.k, v=b.dataset.v, f=FIELDS[k];
  if (f.t==="single") form[k] = form[k]===v ? "" : v;
  else if (f.t==="toggle") form[k] = !form[k];
  else {
    let arr = (form[k]||[]).slice();
    if (arr.includes(v)) arr = arr.filter(x=>x!==v);
    else if (f.excl && v===f.excl) arr=[v];
    else { arr = arr.filter(x=>x!==f.excl); if (f.max && arr.length>=f.max){ const h=document.getElementById("f_"+k+"_h"); if(h){ h.classList.add("flash"); } return; } arr.push(v); }
    form[k]=arr;
  }
  if (k==="sections"){
    if (isNoStand()){ form.stand=""; form.catId=""; syncField("stand"); }
  }
  if (k==="priority") form.priManual = !!form.priority;
  if (k==="interest" || k==="urgent") autoPriority();
  if (k==="urgent" && form.urgent){
    const ns=(form.nextSteps||[]).filter(x=>x!=="без продолжения"); if(!ns.includes(URGENT_STEP)) ns.push(URGENT_STEP); form.nextSteps=ns; syncField("nextSteps");
    if (!form.contactWhen){ form.contactWhen=todayISO(); syncField("contactWhen"); }
    if (!form.addReminder){ form.addReminder=true; syncField("addReminder"); }
    toast("Срочно: приоритет A, «срочная адаптация» и напоминание на сегодня");
  }
  if (k==="selfDecides" && form.selfDecides){ ["lprSurname","lprName","lprPosition","lprPhone","lprEmail"].forEach(x=>{ if(form[x]) { form[x]=""; syncField(x);} }); }
  syncField(k); afterChange();
  if (f.other && v===f.other && b.getAttribute("aria-pressed")==="true"){
    const o=document.getElementById("f_"+k+"_o"); if(o){ o.focus({preventScroll:true}); o.scrollIntoView({block:"center", behavior:"smooth"}); }
  }
}
document.addEventListener("click", e=>{
  const ex = e.target.closest("[data-expand]");
  if (ex){ form["_x_"+ex.dataset.expand]=true; afterChange(); const first=document.querySelector("#"+ex.dataset.expand+" input"); if(first) first.focus(); return; }
  const b = e.target.closest(".chip[data-k]");
  if (b && !b.disabled) onChip(b);
  const g = e.target.closest("[data-goto]");
  if (g) show(g.dataset.goto);
});
$("#sections").addEventListener("input", e=>{
  const k = e.target.dataset.k; if(!k) return;
  form[k] = e.target.value;
  if (k==="org"){ if (form.catId && form.org !== (catById(form.catId)||{}).name) form.catId=""; orgFocus=true; }
  if (k==="staff"){ settings.staff = e.target.value; saveSettings(); $("#setStaff").value=settings.staff; }
  afterChange();
});
$("#sections").addEventListener("keydown", e=>{
  if (e.key!=="Enter" || e.target.tagName!=="INPUT") return;
  e.preventDefault();
  if (e.target.id==="f_standN" || e.target.id==="f_org"){
    const box = e.target.id==="f_org" ? $("#orgSugg") : $("#standSugg"); const first = box && !box.hidden && box.querySelector(".sg");
    if (first){ first.click(); return; }
  }
  const all = [...document.querySelectorAll("#sections input:not([readonly]):not(:disabled):not([type=file]), #sections textarea")].filter(x=>x.offsetParent);
  const i = all.indexOf(e.target); if (i>=0 && all[i+1]) all[i+1].focus(); else e.target.blur();
});

/* Rail highlight */
function updateRail(){
  let cur = SCHEMA[0].id;
  SCHEMA.forEach(s=>{ const el=document.getElementById(s.id); if (!el.hidden && el.getBoundingClientRect().top < 160) cur=s.id; });
  document.querySelectorAll(".rail a").forEach(a=>a.classList.toggle("cur", a.dataset.sec===cur));
}
window.addEventListener("scroll", updateRail, {passive:true});
document.addEventListener("click", e=>{
  const a = e.target.closest(".rail a"); if(!a) return;
  e.preventDefault(); document.getElementById(a.dataset.sec).scrollIntoView({behavior: matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth", block:"start"});
});

/* ---------- Save / edit / delete ---------- */
function collect(src){
  src = src || form;
  const v = {};
  Object.keys(src).forEach(k=>{
    if (k.startsWith("_") || k==="formNoView") return;
    let x = src[k];
    if (typeof x==="string") x = x.trim();
    if (x==="" || x==null || x===false || (Array.isArray(x)&&!x.length)) return;
    v[k]=x;
  });
  Object.values(FIELDS).forEach(f=>{
    if (!fieldVisible(f, v) || f.t==="ro"){ if(f.t!=="pav") { delete v[f.k]; delete v[f.k+"Other"]; } return; }
    if (!f.other) return;
    const sel = f.t==="single" ? [v[f.k]] : (v[f.k]||[]);
    if (!sel.includes(f.other)) delete v[f.k+"Other"];
  });
  if (isNoStand(v)){ delete v.stand; delete v.catId; }
  if (!v.priority) delete v.priManual;
  return v;
}
function missingReq(v){ return Object.values(FIELDS).filter(f=>f.req && fieldVisible(f,v) && !filled(f,v)); }
function hasPersonal(v){ return PERSONAL.some(k=>v[k]); }
function compKey(v){ return v.catId ? "c:"+v.catId : (v.org ? "o:"+norm(v.org) : ""); }
function dupKey(v){ const s=norm(String(v.surname||"").split(/\s+/)[0]); const c=compKey(v); return s&&c ? c+"|"+s : ""; }
function findDup(v){ const key=dupKey(v); if(!key) return null; return live().find(r=>r.id!==editingId && dupKey(r.v)===key) || null; }

function ask(title, text, buttons){
  $("#askTitle").textContent=title; $("#askText").innerHTML=text;
  const host=$("#askBtns"); host.innerHTML="";
  buttons.forEach(([label, cls, fn])=>{ const b=document.createElement("button"); b.type="button"; b.className="btn "+(cls||""); b.textContent=label; b.addEventListener("click", ()=>{ $("#askSheet").hidden=true; if(fn) fn(); }); host.appendChild(b); });
  $("#askSheet").hidden=false; host.querySelector("button").focus();
}
function save(opt){
  opt = opt || {};
  let v = collect();
  const miss = missingReq(v);
  if (miss.length){
    missingShown = true; afterChange(true);
    toast("Заполните: "+miss.map(f=>labelOf(f).replace(/\?$/,"")).join(", "), true);
    const el=document.querySelector(`[data-f="${miss[0].k}"]`); if(el) el.scrollIntoView({behavior:"smooth", block:"center"});
    return;
  }
  if (v.addReminder && !/^\d{4}-\d{2}-\d{2}$/.test(v.contactWhen||"")){
    toast("Для напоминания укажите дату в поле «Когда удобно связаться»", true);
    $("#f_contactWhen").scrollIntoView({behavior:"smooth", block:"center"}); return;
  }
  const needNews = (v.nextSteps||[]).filter(x=>NEED_NEWS.includes(x));
  if (needNews.length && !v.consentNews){
    toast("Для «"+needNews.join("», «")+"» отметьте согласие на получение информации", true);
    document.getElementById("s7").scrollIntoView({behavior:"smooth", block:"center"}); return;
  }
  if (hasPersonal(v) && !v.consentPd){
    ask("Нет согласия на обработку данных",
      "В анкете есть контакты или фото, а согласие на обработку персональных данных не отмечено. Без согласия сохранить можно только ответы для исследования — контакты и фото будут удалены из анкеты.",
      [["Согласие получено — сохранить","primary",()=>{ form.consentPd=true; syncField("consentPd"); save(opt); }],
       ["Сохранить без контактов","",()=>{ PERSONAL.forEach(k=>{ if(form[k]){ form[k]=""; syncField(k); } }); form.selfDecides=false; syncField("selfDecides"); form.nextSteps=(form.nextSteps||[]).filter(x=>!NEED_NEWS.includes(x)); form.consentNews=false; form.addReminder=false; ["nextSteps","consentNews","addReminder"].forEach(syncField); afterChange(); save(opt); }],
       ["Вернуться к анкете","",null]]);
    return;
  }
  if (!opt.dupOk && !editingId){
    const d = findDup(v);
    if (d){
      ask("Похоже, уже опрошен",
        `<b>${esc(fio(d.v)||"—")}, ${esc(d.v.org||"")}</b> — анкета ${esc(d.formNo)} от ${esc(ruDT(d.createdAt))}${d.v.staff?", интервьюер "+esc(d.v.staff):""}.`,
        [["Открыть ту анкету","primary",()=>openRecord(d.id)],["Сохранить как новую","",()=>save(Object.assign({},opt,{dupOk:true}))],["Вернуться к анкете","",null]]);
      return;
    }
  }
  v = collect();
  const now = Date.now();
  let rec;
  const wasEdit = !!editingId;
  if (editingId && records[editingId]){
    rec = records[editingId]; rec.v = v; rec.updatedAt = now;
  } else {
    const seq = nextSeq();
    rec = {id:newId(), seq, device:settings.device, formNo:settings.device+"-"+pad(seq,3), event:settings.event, createdAt:now, updatedAt:now, deleted:false, v};
    records[rec.id]=rec;
  }
  if (v.catId && visits[v.catId]){ delete visits[v.catId]; persistVisits(); }
  persist();
  missingShown=false;
  const calPf = rec.v.addReminder ? openCalendar(rec) : null;   // must run inside the tap
  resetForm(true);
  showResult(rec, wasEdit, calPf);
  measure(rec).then(()=>{ persist(); checkMem(true); });
}

/* ---------- Result card ---------- */
let resRec = null;
function showResult(r, wasEdit, calPf){
  resRec = r; const v=r.v;
  $("#toast").classList.remove("show");
  $("#resTitle").textContent = (wasEdit ? "Изменения сохранены · " : "Анкета сохранена · ") + r.formNo;
  const p=$("#resPri"); p.className="pchip"+(v.priority?" "+v.priority:""); p.textContent=v.priority||"—";
  $("#resOrg").textContent = v.org||"—";
  $("#resWho").textContent = [fio(v)||"без ФИО", v.position, v.stand ? "стенд "+v.stand : (isNoStand(v) ? NOSTAND : ""), v.pav].filter(Boolean).join(" · ");
  $("#resUrgent").hidden = !v.urgent;
  if (calPf){
    $("#actCalMeta").innerHTML = `<strong>${esc(ruDate(remDate(v)))}, 9:00</strong> · ${esc(remTitle(v))}`;
    const notes = {
      apple: "iPad должен предложить добавить событие в «Календарь» с оповещением в 9:00. Если этого не случилось, нажмите «Сохранить файл .ics» и откройте файл в приложении «Файлы».",
      android: "Открыт Google Календарь с заполненным событием — нажмите в нём «Сохранить». Нужен интернет. Без интернета сохраните файл .ics: его открывает, например, календарь Samsung.",
      web: "Открыт Google Календарь с заполненным событием — нажмите в нём «Сохранить».",
      other: "Файл .ics сохранён — откройте его, чтобы добавить событие в календарь."
    };
    $("#actCalNote").textContent = notes[calPf] || notes.other;
    $("#actCalOpen").hidden = calPf==="other"; $("#actCalFile").hidden = calPf==="web" || calPf==="other";
  }
  $("#resCal").hidden = !calPf;
  const due = backupNag();
  $("#resBackup").hidden = !due;
  if (due) $("#resBackupText").textContent = due;
  $("#resXl").hidden = true; $("#resXlBtn").setAttribute("aria-expanded","false"); $("#resXlBtn").textContent="Как это выглядит в Excel";
  $("#resSheet").hidden=false; $("#resDone").focus();
}
$("#resXlBtn").addEventListener("click", ()=>{
  const box=$("#resXl"), open=box.hidden; box.hidden=!open;
  $("#resXlBtn").setAttribute("aria-expanded", open?"true":"false"); $("#resXlBtn").textContent = open ? "Скрыть таблицу" : "Как это выглядит в Excel";
  if (!open || !resRec) return;
  const want=["№ анкеты","Дата","Приоритет","Павильон","Стенд","Компания","Фамилия","Имя Отчество","Должность","Телефон",FIELDS.method.xh,"Что мешает","Интерес к такому приложению","Что дальше"];
  const cols=columns().filter(c=>want.includes(c.h));
  const prev = live().filter(r=>r.id!==resRec.id).slice(0,2).reverse();
  const cell = (c,r)=>{ const x=c.get(r); return esc(c.kind==="date"?ruDate(x):c.kind==="dt"?ruDT(x):x); };
  $("#resXlName").textContent = "LogicSphera_ankety_"+latin(settings.event)+".xlsx";
  $("#resXlTable").innerHTML = `<table><thead><tr>${cols.map(c=>`<th>${esc(c.h)}</th>`).join("")}</tr></thead><tbody>${prev.map(r=>`<tr>${cols.map(c=>`<td>${cell(c,r)}</td>`).join("")}</tr>`).join("")}<tr class="hl">${cols.map(c=>`<td>${cell(c,resRec)}</td>`).join("")}</tr></tbody></table>`;
});
$("#resDone").addEventListener("click", ()=>{ $("#resSheet").hidden=true; resRec=null; window.scrollTo({top:0}); });
$("#resBackupBtn").addEventListener("click", e=>{ $("#resSheet").hidden=true; show("export"); doBackup($("#exJson")); });

/* ---------- Calendar reminder ---------- */
const IOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
function detectPlatform(){ if (IOS) return "apple"; if (/Android/i.test(navigator.userAgent)) return "android"; return "other"; }
function platform(){ const p=settings.platform||"auto"; return p==="auto" ? detectPlatform() : p; }
function remDate(v){ return v.contactWhen; }
function remTitle(v){ return "Связаться с " + [v.org, fio(v)].filter(Boolean).join(" - "); }
function remDesc(r){
  const v=r.v;
  return [`Анкета ${r.formNo}, ${r.event||settings.event}`, v.stand?`Стенд: ${v.stand}${v.pav?", "+v.pav:""}`:"", v.position?`Должность: ${v.position}`:"", v.phone?`Телефон: ${v.phone}`:"", v.contact?`E-mail / мессенджер: ${v.contact}`:"", v.channel?`Канал: ${v.channel}`:"", (v.nextSteps||[]).length?`Что дальше: ${v.nextSteps.join(", ")}`:"", v.agreed?`Договорились: ${v.agreed}`:""].filter(Boolean).join("\n");
}
function icsEsc(t){ return String(t).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n"); }
function icsFold(line){ const out=[]; let cur="", n=0; for (const ch of line){ const c=ch.codePointAt(0), w=c<0x80?1:c<0x800?2:c<0x10000?3:4; if (n+w>73){ out.push(cur); cur=" "+ch; n=1+w; } else { cur+=ch; n+=w; } } out.push(cur); return out.join("\r\n"); }
function buildIcs(r){
  const v=r.v, d=remDate(v).replace(/-/g,""), now=new Date();
  const st = now.getUTCFullYear()+pad(now.getUTCMonth()+1)+pad(now.getUTCDate())+"T"+pad(now.getUTCHours())+pad(now.getUTCMinutes())+pad(now.getUTCSeconds())+"Z";
  const L = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//LogicSphera//Anketa//RU","CALSCALE:GREGORIAN","METHOD:PUBLISH","BEGIN:VEVENT",
    "UID:"+r.id+"-reminder@anketa-logicsphera","DTSTAMP:"+st,"DTSTART:"+d+"T090000","DTEND:"+d+"T093000",
    "SUMMARY:"+icsEsc(remTitle(v)),"DESCRIPTION:"+icsEsc(remDesc(r)),
    "BEGIN:VALARM","ACTION:DISPLAY","TRIGGER:PT0M","DESCRIPTION:"+icsEsc(remTitle(v)),"END:VALARM",
    "END:VEVENT","END:VCALENDAR"];
  return L.map(icsFold).join("\r\n")+"\r\n";
}
function gcalUrl(r){
  const v=r.v, d=remDate(v).replace(/-/g,"");
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(remTitle(v))+"&dates="+d+"T090000/"+d+"T093000&details="+encodeURIComponent(remDesc(r));
}
function openNew(url){ const a=document.createElement("a"); a.href=url; a.target="_blank"; a.rel="noopener"; document.body.appendChild(a); a.click(); a.remove(); }
function icsName(r){ return latin(r.formNo)+"_napominanie.ics"; }
function openCalendar(r){
  const pf = mode!=="file" ? "web" : platform();
  if (pf==="android" || pf==="web"){ openNew(gcalUrl(r)); return pf; }
  if (pf==="apple"){
    const url=URL.createObjectURL(new Blob([buildIcs(r)],{type:"text/calendar;charset=utf-8"}));
    openNew(url); setTimeout(()=>URL.revokeObjectURL(url), 60000); return pf;
  }
  saveFile(icsName(r), buildIcs(r), "text/calendar;charset=utf-8"); return pf;
}
$("#actCalOpen").addEventListener("click", ()=>{ if(resRec) openCalendar(resRec); });
$("#actCalFile").addEventListener("click", ()=>{ if(resRec) saveFile(icsName(resRec), buildIcs(resRec), "text/calendar;charset=utf-8"); });

function resetForm(quiet){
  form = blankForm(); editingId=null; armedDel=false; missingShown=false; standFocus=false; orgFocus=false;
  $("#editbar").hidden = true; $("#delBtn").hidden = true;
  $("#saveBtn").textContent = "Сохранить анкету"; $("#clearBtn").textContent="Новая анкета";
  syncAll(); saveDraft(); renderAll();
  if (!quiet) window.scrollTo({top:0});
  gcPhotos();
}
function openRecord(id){
  const r = records[id]; if(!r) return;
  editingId = id; form = clone(r.v); missingShown=false;
  form._L = curLetter();
  SCHEMA.forEach(s=>{ if(s.collapsible) form["_x_"+s.id]=true; });
  $("#editbar").hidden=false; $("#editNo").textContent=r.formNo;
  $("#delBtn").hidden=false; $("#saveBtn").textContent="Сохранить изменения"; $("#clearBtn").textContent="Закрыть без сохранения";
  syncAll(); saveDraft(); show("form"); window.scrollTo({top:0});
}
function dirty(){ return Object.keys(collect()).some(k=>!["date","staff","pav"].includes(k)); }
let clearArmed=false, clearT;
$("#clearBtn").addEventListener("click", ()=>{
  if (editingId || !dirty() || clearArmed){ clearArmed=false; resetForm(); return; }
  clearArmed=true; $("#clearBtn").textContent="Стереть введённое?";
  clearTimeout(clearT); clearT=setTimeout(()=>{clearArmed=false; $("#clearBtn").textContent="Новая анкета";},3000);
});
$("#cancelEdit").addEventListener("click", ()=>resetForm());
$("#saveBtn").addEventListener("click", ()=>save());
let armedDel=false, delT;
$("#delBtn").addEventListener("click", ()=>{
  const b=$("#delBtn");
  if(!armedDel){ armedDel=true; b.classList.add("armed"); b.textContent="Точно удалить?"; clearTimeout(delT); delT=setTimeout(()=>{armedDel=false;b.classList.remove("armed");b.textContent="Удалить";},3000); return; }
  const r=records[editingId]; if(!r) return;
  r.deleted=true; r.updatedAt=Date.now(); persist();
  b.classList.remove("armed"); b.textContent="Удалить";
  toast("Анкета "+r.formNo+" удалена"); resetForm();
});

/* ---------- Photos: capture, viewer ---------- */
const urlCache = {};
async function photoURL(id){
  if (!id) return null;
  if (urlCache[id]) return urlCache[id];
  try{ const p=await PDB.get(id); if(!p) return null; return urlCache[id]=URL.createObjectURL(new Blob([p.buf],{type:p.type||"image/jpeg"})); }
  catch(e){ return null; }
}
function syncPhoto(k){
  const id="f_"+k, slot=document.getElementById(id+"_slot"); if(!slot) return;
  const img=slot.querySelector("img"), empty=slot.querySelector(".ph-empty"), miss=slot.querySelector(".ph-miss"), acts=document.getElementById(id+"_acts");
  const pid=form[k];
  if (!pid){ img.hidden=true; img.removeAttribute("src"); empty.hidden=false; miss.hidden=true; acts.hidden=true; slot.classList.remove("has"); return; }
  empty.hidden=true; acts.hidden=false; slot.classList.add("has");
  photoURL(pid).then(u=>{
    if (form[k]!==pid) return;
    if (u){ img.src=u; img.hidden=false; miss.hidden=true; acts.querySelector("[data-ph-view]").hidden=false; }
    else { img.hidden=true; miss.hidden=false; acts.querySelector("[data-ph-view]").hidden=true; }
  });
}
async function processImage(file, max){
  const url = URL.createObjectURL(file);
  try{
    const img = new Image(); img.src = url;
    await (img.decode ? img.decode() : new Promise((res,rej)=>{ img.onload=res; img.onerror=rej; }));
    const w0=img.naturalWidth, h0=img.naturalHeight, k=Math.min(1, max/Math.max(w0,h0));
    const c=document.createElement("canvas"); c.width=Math.round(w0*k); c.height=Math.round(h0*k);
    const ctx=c.getContext("2d"); ctx.fillStyle="#fff"; ctx.fillRect(0,0,c.width,c.height); ctx.drawImage(img,0,0,c.width,c.height);
    const blob = await new Promise(res=>c.toBlob(res,"image/jpeg",0.82));
    if (!blob) throw new Error("не удалось сжать изображение");
    c.width=c.height=0;
    return blob;
  } finally { URL.revokeObjectURL(url); }
}
const toBuf = b => b.arrayBuffer ? b.arrayBuffer() : new Response(b).arrayBuffer();
$("#sections").addEventListener("change", async e=>{
  const inp=e.target; if(!inp.dataset || !inp.dataset.photo) return;
  const k=inp.dataset.photo, f=FIELDS[k], file=inp.files && inp.files[0]; inp.value="";
  if (!file) return;
  const busy=document.getElementById("f_"+k+"_slot").querySelector(".ph-busy"); busy.hidden=false;
  try{
    const blob=await processImage(file, f.max), buf=await toBuf(blob);
    const pid="ph"+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
    await PDB.put(pid,{buf, type:"image/jpeg", size:buf.byteLength, createdAt:Date.now()});
    form[k]=pid; syncField(k); afterChange();
    toast(f.l+": фото сохранено ("+Math.max(1,Math.round(buf.byteLength/1024))+" КБ)");
  }catch(err){ toast("Не удалось сохранить фото: "+((err&&err.message)||"ошибка"), true); }
  finally{ busy.hidden=true; }
});
const delArm = {};
document.addEventListener("click", e=>{
  const v=e.target.closest("[data-ph-view]");
  if (v){ photoURL(form[v.dataset.phView]).then(u=>{ if(!u) return; $("#viewerImg").src=u; $("#viewerImg").alt=FIELDS[v.dataset.phView].l; $("#viewer").hidden=false; $("#viewerClose").focus(); }); return; }
  const d=e.target.closest("[data-ph-del]");
  if (d){
    const k=d.dataset.phDel;
    if (!delArm[k]){ delArm[k]=setTimeout(()=>{ delArm[k]=null; d.textContent="Удалить"; d.classList.remove("armed"); },3000); d.textContent="Точно удалить?"; d.classList.add("armed"); return; }
    clearTimeout(delArm[k]); delArm[k]=null; d.textContent="Удалить"; d.classList.remove("armed");
    form[k]=""; syncField(k); afterChange(); toast(FIELDS[k].l+": фото убрано из анкеты");
  }
});
function closeViewer(){ $("#viewer").hidden=true; $("#viewerImg").removeAttribute("src"); }
$("#viewerClose").addEventListener("click", closeViewer);
$("#viewer").addEventListener("click", e=>{ if(e.target.id==="viewer") closeViewer(); });
document.addEventListener("keydown", e=>{ if(e.key==="Escape" && !$("#viewer").hidden) closeViewer(); });
/* Remove photos no anketa uses: at once for deleted anketas, after 6 h for abandoned drafts */
async function gcPhotos(){
  try{
    const keep=new Set(), dead=new Set();
    Object.values(records).forEach(r=>{ if(!r||!r.v) return; PHOTO_KEYS.forEach(k=>{ if(r.v[k]) (r.deleted?dead:keep).add(r.v[k]); }); });
    PHOTO_KEYS.forEach(k=>{ if(form[k]) keep.add(form[k]); });
    const keys=await PDB.keys(), now=Date.now();
    for (const id of keys){
      if (keep.has(id)) continue;
      let drop = dead.has(id);
      if (!drop){ const p=await PDB.get(id); drop = !p || now-(p.createdAt||0) > 6*3600e3; }
      if (drop){ await PDB.del(id); if(urlCache[id]){ URL.revokeObjectURL(urlCache[id]); delete urlCache[id]; } }
    }
  }catch(e){}
}
function latin(s){
  const m={А:"A",Б:"B",В:"V",Г:"G",Д:"D",Е:"E",Ё:"E",Ж:"Zh",З:"Z",И:"I",Й:"Y",К:"K",Л:"L",М:"M",Н:"N",О:"O",П:"P",Р:"R",С:"S",Т:"T",У:"U",Ф:"F",Х:"Kh",Ц:"Ts",Ч:"Ch",Ш:"Sh",Щ:"Sch",Ъ:"",Ы:"Y",Ь:"",Э:"E",Ю:"Yu",Я:"Ya"};
  return String(s).split("").map(c=>{ const u=c.toUpperCase(); if(m[u]==null) return c; const t=m[u]; return c===u ? t : t.toLowerCase(); }).join("").replace(/[^A-Za-z0-9_-]/g,"_");
}
function photoName(r,k){ return latin(r.formNo)+"_"+FIELDS[k].suf+".jpg"; }

/* ---------- Size accounting ---------- */
const enc = new TextEncoder();
async function measure(r){
  let p=0;
  for (const k of PHOTO_KEYS){ if(!r.v[k]) continue; const x=await PDB.get(r.v[k]).catch(()=>null); if(x) p += x.size || (x.buf&&x.buf.byteLength) || 0; }
  const c=Object.assign({},r); delete c.sz;
  r.sz = {t: enc.encode(JSON.stringify(c)).length, p};
  return r.sz;
}
const LS_LIMIT = 5*1024*1024;
let memState = null;
async function memInfo(){
  const L = live();
  let changed=false;
  for (const r of L){ if(!r.sz){ await measure(r); changed=true; } }
  if (changed) persist();
  const sizes = L.map(r=>r.sz.t+r.sz.p), texts = L.map(r=>r.sz.t);
  const total = sizes.reduce((a,b)=>a+b,0), max = sizes.length ? Math.max(...sizes) : 0, avg = sizes.length ? total/sizes.length : 0;
  const lsUsed = (()=>{ try{ let n=0; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); n+=(k.length+(localStorage.getItem(k)||"").length)*2; } return n; }catch(e){ return 0; } })();
  const maxText = texts.length ? Math.max(...texts) : 5000;
  let quota=null, usage=null;
  try{ if(navigator.storage && navigator.storage.estimate){ const e=await navigator.storage.estimate(); quota=e.quota; usage=e.usage; } }catch(e){}
  const per = Math.max(max, 1024*1024);           // до первых замеров считаем 1 МБ на анкету
  const fByQuota = quota!=null ? Math.floor(Math.max(0, quota-usage)/per) : null;
  const fByText = Math.floor(Math.max(0, LS_LIMIT*0.9 - lsUsed)/Math.max(maxText*1.5, 3000));
  const forecast = fByQuota==null ? fByText : Math.min(fByQuota, fByText);
  memState = {n:L.length, total, max, avg, quota, usage, forecast, lsUsed};
  return memState;
}
function checkMem(afterSave){
  memInfo().then(m=>{
    const low = m.forecast < 50;
    $("#memWarn").hidden = !low;
    if (low){ $("#memWarnText").textContent = `Поместится ещё ≈ ${m.forecast} анкет. Сохраните резервную копию и освободите память планшета.`; if (afterSave) toast("Место заканчивается: поместится ещё ≈ "+m.forecast+" анкет", true); }
    if (!$("#view-export").hidden) renderMem();
  });
}
const mb = n => (n/1048576).toFixed(n<10485760?1:0).replace(".",",")+" МБ";
const kbmb = n => n<1048576 ? Math.max(1,Math.round(n/1024))+" КБ" : mb(n);
function renderMem(){
  const m=memState; if(!m) return;
  const items=[["Занято анкетами", m.n?mb(m.total):"0 МБ"],["Средняя анкета", m.n?kbmb(m.avg):"—"],["Самая большая", m.n?kbmb(m.max):"—"],["Поместится ещё", m.forecast>10000?"больше 10 000":"≈ "+m.forecast.toLocaleString("ru-RU")]];
  $("#mem").innerHTML = items.map(([l,v],i)=>`<div class="stat${i===3&&m.forecast<50?" warn":""}"><b>${esc(v)}</b><span>${l}</span></div>`).join("");
  $("#memNote").textContent = "Прогноз — по самой большой анкете"+(m.n?"":" (пока анкет нет — по 1 МБ)")+" и месту, которое браузер выделил приложению"+(m.quota!=null?` (${mb(m.quota)})`:"")+". Свободную память планшета приложение не видит: перед выставкой освободите не меньше 1 ГБ.";
}

/* ---------- Backup tracking ---------- */
function sameDay(a,b){ const x=new Date(a), y=new Date(b); return x.toDateString()===y.toDateString(); }
function backupDue(){
  const n=live().length, since=n-(settings.bkN||0);
  if (since<=0) return "";
  if (since>=20) return `После последней копии сохранено ${since} анкет.`;
  if (new Date().getHours()>=17 && (!settings.bkAt || !sameDay(settings.bkAt, Date.now()))) return "Конец дня: сохраните копию, чтобы анкеты не потерялись.";
  return "";
}
/* In the result card the end-of-day reminder shows at most once an hour; the 20-anketa one always */
function backupNag(){
  const due=backupDue(); if(!due) return "";
  const since=live().length-(settings.bkN||0);
  if (since>=20) return due;
  if (Date.now()-(settings.bkNagAt||0) < 3600e3) return "";
  settings.bkNagAt=Date.now(); saveSettings(); return due;
}
function markBackup(){ settings.bkAt=Date.now(); settings.bkN=live().length; saveSettings(); renderStatus(); if(!$("#view-export").hidden) renderExport(); }

/* ---------- Views ---------- */
function show(view){
  ["form","plan","list","export"].forEach(v=>{
    $("#view-"+v).hidden = v!==view;
    $("#tab-"+v).setAttribute("aria-selected", v===view?"true":"false");
  });
  $("#bar").hidden = view!=="form";
  if (view==="export") renderExport();
  if (view==="list") renderList();
  if (view==="plan") renderPlan();
  window.scrollTo({top:0});
}
document.querySelectorAll(".tab").forEach(t=>t.addEventListener("click",()=>show(t.dataset.view)));
$("#status").addEventListener("click", ()=>show("export"));

/* ---------- Plan (обход) ---------- */
let planF="", planPav="";
function planRows(p){
  if (!catalog) return [];
  return catalog.rows.filter(r=>rowPavs(r).includes(p));
}
function statusOf(row, cnt){ if (cnt[row.id]) return "done"; return visits[row.id] ? visits[row.id].s : "todo"; }
function renderPlan(){
  $("#planNoCat").hidden = !!catalog; $("#planBody").hidden = !catalog;
  if (!catalog) return;
  const pavs = pavList();
  planPav = planPav && pavs.includes(planPav) ? planPav : (settings.pavilion || pavs[0]);
  $("#planPav").innerHTML = pavs.map(p=>`<button type="button" class="chip" data-ppav="${esc(p)}" aria-pressed="${p===planPav}">${esc(p)}</button>`).join("");
  const cnt = surveyedCount(), rows = planRows(planPav);
  const st = {done:0, refused:0, later:0, todo:0}; rows.forEach(r=>st[statusOf(r,cnt)]++);
  $("#planCount").innerHTML = [["Опрошено",st.done],["Позже",st.later],["Отказ",st.refused],["Осталось",st.todo+st.later],["Всего в павильоне",rows.length]].map(([l,n])=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");
  const q = norm($("#planQ").value), qs = normStand($("#planQ").value);
  let list = rows.map(r=>({r, st: standsInPav(r, planPav), s: statusOf(r,cnt)}));
  if (planF==="todo") list = list.filter(x=>x.s==="todo");
  else if (planF) list = list.filter(x=>x.s===planF);
  if (q) list = list.filter(x=>norm(x.r.name).includes(q) || x.st.some(s=>s.startsWith(qs)));
  const withSt = list.filter(x=>x.st.length).sort((a,b)=>a.st[0].localeCompare(b.st[0],"en",{numeric:true}));
  const noSt = list.filter(x=>!x.st.length).sort((a,b)=>a.r.name.localeCompare(b.r.name,"ru"));
  const rowHTML = x=>{
    const v = visits[x.r.id], s=x.s;
    const badge = s==="done" ? `<span class="badge ok">опрошен${cnt[x.r.id]>1?" ×"+cnt[x.r.id]:""}</span>` : s==="refused" ? `<span class="badge bad">отказ</span>` : s==="later" ? `<span class="badge warn">зайти позже</span>` : "";
    return `<div class="pr ${s}"><div class="code">${esc(x.st.join(", ")||"—")}${x.st.length?"":"<small>номер не присвоен</small>"}</div>
      <div><div class="nm">${esc(x.r.name)} ${badge}</div><div class="mt">${esc([x.r.sections.join(", "), x.r.country&&x.r.country!=="Россия"?x.r.country:""].filter(Boolean).join(" · ")||"без раздела")}</div></div>
      <div class="acts"><button class="btn sm${s==="done"?"":" primary"}" type="button" data-start="${esc(x.r.id)}">${s==="done"?"Ещё анкета":"Анкета"}</button>${s==="done"?"":`<button class="btn sm${v&&v.s==="later"?" on":""}" type="button" data-visit="later" data-id="${esc(x.r.id)}">Позже</button><button class="btn sm${v&&v.s==="refused"?" on":""}" type="button" data-visit="refused" data-id="${esc(x.r.id)}">Отказ</button>`}</div></div>`;
  };
  $("#planRows").innerHTML = (withSt.length ? withSt.map(rowHTML).join("") : "") + (noSt.length ? `<div class="grouph">Номер стенда не присвоен · ${noSt.length}</div>`+noSt.map(rowHTML).join("") : "") + (!list.length ? `<div class="empty"><b>Ничего не найдено</b>Измените поиск или фильтр.</div>` : "");
}
$("#planPav").addEventListener("click", e=>{ const b=e.target.closest("[data-ppav]"); if(!b) return; planPav=b.dataset.ppav; if(!editingId){ settings.pavilion=planPav; saveSettings(); if(!dirty()){ form.pav=planPav; form._L=letterOfPav(planPav); form.stand=""; syncField("pav"); syncField("stand"); afterChange(); } } renderPlan(); });
$("#planF").addEventListener("click", e=>{ const b=e.target.closest(".chip"); if(!b) return; planF=b.dataset.pf; $("#planF").querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed", c===b?"true":"false")); renderPlan(); });
$("#planQ").addEventListener("input", renderPlan);
$("#planRows").addEventListener("click", e=>{
  const v=e.target.closest("[data-visit]");
  if (v){ const id=v.dataset.id, s=v.dataset.visit; if (visits[id] && visits[id].s===s) delete visits[id]; else visits[id]={s, at:Date.now(), by:settings.device}; persistVisits(); renderPlan(); return; }
  const st=e.target.closest("[data-start]");
  if (st){
    if (editingId || dirty()){ toast("Сначала сохраните или очистите текущую анкету", true); show("form"); return; }
    const row=catById(st.dataset.start); if(!row) return;
    resetForm(true); form.pav = planPav; applyCatalog(row, standsInPav(row, planPav)[0]||"");
    show("form"); const n=$("#f_surname"); if(n) setTimeout(()=>n.focus({preventScroll:true}),50);
  }
});

/* ---------- List ---------- */
let pf="";
$("#pfilter").addEventListener("click", e=>{
  const b=e.target.closest(".chip"); if(!b) return; pf=b.dataset.p;
  $("#pfilter").querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed", c===b?"true":"false"));
  renderList();
});
$("#q").addEventListener("input", renderList);
$("#pavF").addEventListener("change", renderList);
function fmtTime(ts){ const d=new Date(ts); const t=pad(d.getHours())+":"+pad(d.getMinutes()); return (d.toDateString()===new Date().toDateString()) ? t : pad(d.getDate())+"."+pad(d.getMonth()+1)+" "+t; }
function dupSet(){ const m={}; live().forEach(r=>{ const k=dupKey(r.v); if(k) (m[k]=m[k]||[]).push(r.id); }); const s=new Set(); Object.values(m).forEach(a=>{ if(a.length>1) a.forEach(id=>s.add(id)); }); return s; }
function renderList(){
  const all = live();
  const pavs = [...new Set(all.map(r=>r.v.pav).filter(Boolean))].sort(pavCmp);
  const sel=$("#pavF"), cur=sel.value;
  sel.innerHTML = `<option value="">Все павильоны</option>`+pavs.map(p=>`<option${p===cur?" selected":""}>${esc(p)}</option>`).join("");
  const q = $("#q").value.trim().toLowerCase(), dups=dupSet();
  let rs = all;
  if (["A","B","C"].includes(pf)) rs = rs.filter(r=>r.v.priority===pf);
  if (pf==="urgent") rs = rs.filter(r=>r.v.urgent);
  if (pf==="nostand") rs = rs.filter(r=>isNoStand(r.v));
  if (pf==="dup") rs = rs.filter(r=>dups.has(r.id));
  if (sel.value) rs = rs.filter(r=>r.v.pav===sel.value);
  if (q) rs = rs.filter(r=>[r.formNo,r.v.org,r.v.surname,r.v.nameP,r.v.stand,r.v.phone,r.v.contact,r.v.position].join(" ").toLowerCase().includes(q));
  $("#rows").innerHTML = rs.map(r=>{
    const v=r.v;
    const th = PHOTO_KEYS.filter(k=>v[k]).map(k=>`<img data-thumb="${esc(v[k])}" alt="${esc(FIELDS[k].l)}">`).join("");
    const badges = [v.urgent?`<span class="badge sun">срочно</span>`:"", isNoStand(v)?`<span class="badge">без стенда</span>`:"", !fio(v)?`<span class="badge">без ФИО</span>`:"", dups.has(r.id)?`<span class="badge warn">дубль?</span>`:""].join("");
    return `<tr data-id="${r.id}"><td class="no">${esc(r.formNo)}</td><td class="ph">${th}</td><td><div><b>${esc(v.org||"—")}</b></div><div class="sub">${esc([fio(v),v.position].filter(Boolean).join(", "))}</div>${badges?`<div class="badges">${badges}</div>`:""}</td><td>${esc(v.pav||"")}<div class="sub">${esc(v.stand||(isNoStand(v)?(v.subtype==="другое"&&v.subtypeOther?v.subtypeOther:v.subtype||NOSTAND):""))}</div></td><td>${v.priority?`<span class="pchip ${v.priority}">${v.priority}</span>`:""}</td><td>${esc(v.interest?"интерес: "+v.interest:"")}<div class="sub">${esc((v.nextSteps||[]).join(", "))}</div></td><td class="t">${fmtTime(r.createdAt)}<div class="sub">${esc(v.staff||"")}</div></td></tr>`;
  }).join("");
  document.querySelectorAll("#rows img[data-thumb]").forEach(im=>photoURL(im.dataset.thumb).then(u=>{ if(u) im.src=u; else im.remove(); }));
  $("#emptyList").hidden = rs.length>0;
  if (!rs.length && all.length) $("#emptyList").innerHTML = "<b>Ничего не найдено</b>Измените поиск или фильтр.";
  else $("#emptyList").innerHTML = "<b>Анкет пока нет</b>Сохранённые анкеты появятся здесь. Нажмите строку, чтобы открыть анкету для правки.";
}
$("#rows").addEventListener("click", e=>{ const tr=e.target.closest("tr[data-id]"); if(tr) openRecord(tr.dataset.id); });

/* ---------- Export ---------- */
let scope="all";
$("#scope").addEventListener("click", e=>{
  const b=e.target.closest(".chip"); if(!b) return; scope=b.dataset.sc;
  $("#scope").querySelectorAll(".chip").forEach(c=>c.setAttribute("aria-pressed", c===b?"true":"false"));
  renderExport();
});
function scoped(){
  let rs = live().slice().sort((a,b)=>a.createdAt-b.createdAt);
  const t = todayISO();
  if (scope==="today") rs = rs.filter(r=>(r.v.date||isoOf(r.createdAt))===t);
  if (scope==="A") rs = rs.filter(r=>r.v.priority==="A");
  if (scope==="AB") rs = rs.filter(r=>r.v.priority==="A"||r.v.priority==="B");
  if (scope==="urgent") rs = rs.filter(r=>r.v.urgent);
  return rs;
}
function isoOf(ts){ const d=new Date(ts); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
function ruDate(iso){ if(!iso) return ""; if(!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return String(iso); const [y,m,d]=iso.split("-"); return d+"."+m+"."+y; }
function ruDT(ts){ const d=new Date(ts); return pad(d.getDate())+"."+pad(d.getMonth()+1)+"."+d.getFullYear()+" "+pad(d.getHours())+":"+pad(d.getMinutes()); }
function textVal(f, v){
  const x = v[f.k];
  if (x==null || x==="" || x===false) return "";
  if (f.t==="toggle") return "да";
  if (f.t==="multi"||f.t==="single"){
    const arr = Array.isArray(x)?x:[x];
    return arr.map(a => (f.other && a===f.other && v[f.k+"Other"]) ? f.other+": "+v[f.k+"Other"] : a).join("; ");
  }
  if (f.t==="date") return ruDate(x);
  if (f.t==="photo") return "есть";
  return String(x);
}
/* Column plan: meta first, then sections 1–7, then interviewer notes */
function columns(){
  const cols = [
    {h:"№ анкеты", w:11, get:r=>r.formNo},
    {h:"Дата", w:11, kind:"date", get:r=>r.v.date||isoOf(r.createdAt)},
    {h:"Интервьюер", w:16, get:r=>r.v.staff||""},
    {h:"Приоритет", w:10, get:r=>r.v.priority||""}
  ];
  SCHEMA.forEach(s=>{ if (s.staff) return; s.fields.forEach(f=>{
    if (f.t==="photo"){ cols.push({h:f.l+" (файл)", w:24, kind:"photo", get:r=> r.v[f.k] ? photoName(r,f.k) : ""}); return; }
    const h = f.xh || (f.sec==="s5" ? "ЛПР: "+f.l.toLowerCase() : f.l);
    const w = f.t==="area"||f.t==="multi" ? 34 : f.t==="toggle" ? 12 : 22;
    const kind = f.t==="date" ? "date" : "text";
    cols.push({h, w: kind==="date" ? 14 : w, kind, get:r=> f.t==="date" ? (r.v[f.k]||"") : (f.t==="pav"||f.t==="stand"||f.t==="org") ? (r.v[f.k]||"") : textVal(f, r.v)});
    if (f.k==="org") cols.push({h:"№ в каталоге", w:10, get:r=>r.v.catId||""});
  });});
  cols.push({h:"Договорились", w:34, get:r=>r.v.agreed||""});
  cols.push({h:"Напоминание", w:12, get:r=>r.v.addReminder?"да":""});
  cols.push({h:"Выставка", w:14, get:r=>r.event||""});
  cols.push({h:"Создано", w:16, kind:"dt", get:r=>r.createdAt});
  cols.push({h:"Изменено", w:16, kind:"dt", get:r=>r.updatedAt});
  return cols;
}

/* Minimal XLSX writer (stored ZIP + SpreadsheetML) — no external library, works offline */
const CRC = (()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0;} return t; })();
function crc32(b){ let c=0xFFFFFFFF; for(let i=0;i<b.length;i++) c=CRC[(c^b[i])&0xFF]^(c>>>8); return (c^0xFFFFFFFF)>>>0; }
function zip(files){
  const parts=[], cen=[]; let off=0;
  const d=new Date(), dt=((d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1))&0xFFFF, dd=(((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate())&0xFFFF;
  files.forEach(([name,str])=>{
    const nb=enc.encode(name), data=(typeof str==="string") ? enc.encode(str) : str, crc=crc32(data);
    const h=new DataView(new ArrayBuffer(30));
    h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(6,0x0800,true);h.setUint16(8,0,true);h.setUint16(10,dt,true);h.setUint16(12,dd,true);
    h.setUint32(14,crc,true);h.setUint32(18,data.length,true);h.setUint32(22,data.length,true);h.setUint16(26,nb.length,true);h.setUint16(28,0,true);
    parts.push(new Uint8Array(h.buffer),nb,data);
    const c=new DataView(new ArrayBuffer(46));
    c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,dt,true);c.setUint16(14,dd,true);
    c.setUint32(16,crc,true);c.setUint32(20,data.length,true);c.setUint32(24,data.length,true);c.setUint16(28,nb.length,true);
    c.setUint32(42,off,true);
    cen.push(new Uint8Array(c.buffer),nb);
    off+=30+nb.length+data.length;
  });
  const cenLen=cen.reduce((s,a)=>s+a.length,0);
  const e=new DataView(new ArrayBuffer(22));
  e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cenLen,true);e.setUint32(16,off,true);
  const all=[...parts,...cen,new Uint8Array(e.buffer)], out=new Uint8Array(all.reduce((s,a)=>s+a.length,0));
  let p=0; all.forEach(a=>{out.set(a,p);p+=a.length;}); return out;
}
const xe = s => String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function colL(i){ let s=""; i++; while(i>0){ const m=(i-1)%26; s=String.fromCharCode(65+m)+s; i=Math.floor((i-1)/26);} return s; }
function serialDate(iso){ const [y,m,d]=iso.split("-").map(Number); return (Date.UTC(y,m-1,d)-Date.UTC(1899,11,30))/86400000; }
function serialDT(ts){ const d=new Date(ts); return (Date.UTC(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),d.getSeconds())-Date.UTC(1899,11,30))/86400000; }
/* sheets: [{name, cols:[{h,w,kind,get}], rows:[...], have:Set, frozen:true}] */
function buildXlsxBook(sheets){
  const sheetXml = sh => {
    const cols=sh.cols, last=colL(cols.length-1), n=sh.rows.length+1;
    let rows = `<row r="1">`+cols.map((c,i)=>`<c r="${colL(i)}1" t="inlineStr" s="1"><is><t>${xe(c.h)}</t></is></c>`).join("")+`</row>`;
    sh.rows.forEach((r,ri)=>{
      const R=ri+2;
      rows += `<row r="${R}">` + cols.map((c,i)=>{
        const ref=colL(i)+R, v=c.get(r);
        if (v===""||v==null) return "";
        if (c.kind==="date" && /^\d{4}-\d{2}-\d{2}$/.test(v)) return `<c r="${ref}" s="2"><v>${serialDate(v)}</v></c>`;
        if (c.kind==="dt") return `<c r="${ref}" s="3"><v>${serialDT(v)}</v></c>`;
        if (c.kind==="photo" && sh.have && sh.have.has(v)) return `<c r="${ref}" t="str" s="6"><f>HYPERLINK("photos/${xe(v)}","${xe(v)}")</f><v>${xe(v)}</v></c>`;
        if (c.kind==="pct" && typeof v==="number") return `<c r="${ref}" s="7"><v>${v}</v></c>`;
        if (typeof v==="number") return `<c r="${ref}" s="5"><v>${v}</v></c>`;
        return `<c r="${ref}" t="inlineStr" s="4"><is><t xml:space="preserve">${xe(v)}</t></is></c>`;
      }).join("") + `</row>`;
    });
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><dimension ref="A1:${last}${n}"/><sheetViews><sheetView workbookViewId="0"><pane xSplit="${sh.frozen?1:0}" ySplit="1" topLeftCell="${sh.frozen?"B2":"A2"}" activePane="${sh.frozen?"bottomRight":"bottomLeft"}" state="frozen"/></sheetView></sheetViews><sheetFormatPr defaultRowHeight="15"/><cols>${cols.map((c,i)=>`<col min="${i+1}" max="${i+1}" width="${c.w}" customWidth="1"/>`).join("")}</cols><sheetData>${rows}</sheetData><autoFilter ref="A1:${last}${n}"/></worksheet>`;
  };
  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="2"><numFmt numFmtId="164" formatCode="dd.mm.yyyy"/><numFmt numFmtId="165" formatCode="dd.mm.yyyy hh:mm"/></numFmts><fonts count="3"><font><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><b/><sz val="11"/><name val="Calibri"/><family val="2"/></font><font><u/><sz val="11"/><color rgb="FF1E5A45"/><name val="Calibri"/><family val="2"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE3EFE8"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="8"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment vertical="top"/></xf><xf numFmtId="9" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1" applyAlignment="1"><alignment vertical="top"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
  const wb = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s,i)=>`<sheet name="${xe(s.name)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join("")}</sheets><definedNames>${sheets.map((s,i)=>`<definedName name="_xlnm._FilterDatabase" localSheetId="${i}" hidden="1">'${xe(s.name)}'!$A$1:$${colL(s.cols.length-1)}$${s.rows.length+1}</definedName>`).join("")}</definedNames></workbook>`;
  const files = [
    ["[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>${sheets.map((s,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("")}<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`],
    ["_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`],
    ["xl/workbook.xml", wb],
    ["xl/_rels/workbook.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((s,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join("")}<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`],
    ["xl/styles.xml", styles]
  ];
  sheets.forEach((s,i)=>files.push(["xl/worksheets/sheet"+(i+1)+".xml", sheetXml(s)]));
  return zip(files);
}
function buildXlsx(rs, opt){ return buildXlsxBook([{name:"Анкеты", cols:columns(), rows:rs, have:(opt||{}).have, frozen:true}]); }
function buildCsv(rs){
  const cols=columns(), q=s=>{ s=String(s==null?"":s); return /[;"\n\r]/.test(s) ? '"'+s.replace(/"/g,'""')+'"' : s; };
  const val=(c,r)=>{ const v=c.get(r); if(v===""||v==null) return ""; if(c.kind==="date") return ruDate(v); if(c.kind==="dt") return ruDT(v); return v; };
  return "\ufeff"+[cols.map(c=>q(c.h)).join(";")].concat(rs.map(r=>cols.map(c=>q(val(c,r))).join(";"))).join("\r\n");
}
function buildMd(rs, have){
  const cell = s => String(s||"").replace(/\|/g,"\\|").replace(/\n+/g," ");
  const cnt = p => rs.filter(r=>r.v.priority===p).length;
  let md = `# Логик Сфера — анкеты · ${settings.event}\n\nВыгрузка: ${ruDT(Date.now())} · анкет: ${rs.length} · A: ${cnt("A")} · B: ${cnt("B")} · C: ${cnt("C")} · срочно: ${rs.filter(r=>r.v.urgent).length}\n\n`;
  if (!rs.length) return md + "_Анкет нет._\n";
  md += "| № | Компания | Стенд | Собеседник | Пр. | Интерес | Следующий шаг |\n|---|---|---|---|---|---|---|\n";
  rs.forEach(r=>{ const v=r.v; md += `| ${cell(r.formNo)} | ${cell(v.org)} | ${cell(v.stand||(isNoStand(v)?NOSTAND:""))} | ${cell(fio(v))} | ${cell(v.priority)}${v.urgent?" !":""} | ${cell(v.interest)} | ${cell(textVal(FIELDS.nextSteps,v))} |\n`; });
  rs.forEach(r=>{
    const v=r.v;
    md += `\n---\n\n## ${r.formNo} · ${v.org||"без названия"}${v.priority?" · приоритет "+v.priority:""}${v.urgent?" · СРОЧНО":""}\n\n`;
    md += `Дата: ${ruDate(v.date||isoOf(r.createdAt))} · интервьюер: ${v.staff||"—"} · создано ${ruDT(r.createdAt)}\n`;
    SCHEMA.forEach(s=>{
      const lines = s.fields.filter(f=>f.t!=="ro" && fieldVisible(f,v) && !["date","staff","priority"].includes(f.k)).map(f=>{
        if (f.t==="photo"){
          if (!v[f.k]) return null;
          const nm = photoName(r,f.k);
          return have && have.has(nm) ? `**${f.l}:**\n\n![${f.l}](photos/${nm})\n` : `- **${f.l}:** есть (файл ${nm} в архиве с фото)`;
        }
        const t = (f.t==="pav"||f.t==="stand"||f.t==="org") ? (v[f.k]||"") : textVal(f,v); if(!t) return null;
        const lab = (isNoStand(v)&&f.lNo)?f.lNo:f.l;
        return f.t==="toggle" ? `- ${f.o[0]}` : `- **${lab}:** ${t.replace(/\n/g," ")}`;
      }).filter(Boolean);
      if (lines.length) md += `\n### ${s.staff?"Для интервьюера":s.photos?"Фото":s.num+". "+((isNoStand(v)&&s.titleNo)||s.title)}\n\n${lines.join("\n")}\n`;
    });
  });
  return md;
}

/* ---------- Research summary (aggregates only) ---------- */
const RQ_STAND = ["method","whatRecord","visitors","handoff","lastResult","pains","interest"];
const RQ_NO = ["method","whatRecord","standsPerDay","handoff","lastResult","catalogUse","pains","interest"];
const pct = (a,b)=> b ? Math.round(a*100/b) : 0;
const pct1 = (a,b)=> { if(!b) return "0"; const x=a*100/b; return x>0 && x<10 ? x.toFixed(1).replace(".",",") : String(Math.round(x)); };
function tally(rs, k){
  const f=FIELDS[k], c={}; let n=0;
  rs.forEach(r=>{ if(!fieldVisible(f,r.v)) return; const x=r.v[k]; const arr = x==null ? [] : Array.isArray(x)?x:[x]; if(!arr.length) return; n++; arr.forEach(a=>{ c[a]=(c[a]||0)+1; }); });
  return {n, rows: f.o.filter(o=>c[o]).map(o=>[o,c[o]]).sort((a,b)=>b[1]-a[1])};
}
function research(){
  const L = live(), ex = L.filter(r=>!isNoStand(r.v)), no = L.filter(r=>isNoStand(r.v));
  const comp = new Set(ex.map(r=>compKey(r.v)).filter(Boolean));
  return {L, ex, no, comp};
}
function buildResearchMd(){
  const {L, ex, no, comp} = research();
  const qLabel = (k, seg)=> (seg==="no" && FIELDS[k].lNo) ? FIELDS[k].lNo : (FIELDS[k].xh||FIELDS[k].l);
  let md = `# Как экспоненты ${settings.event} собирают контакты посетителей\n\nИтоги опроса «Логик Сферы» · ${ruDT(Date.now())}\n\nОпрошено сотрудников стендов: **${ex.length}** (компаний: ${comp.size}) · работающих без стенда: **${no.length}**. Проценты — от ответивших на вопрос; в вопросах с несколькими ответами сумма больше 100%.\n`;
  const block = (rs, keys, seg)=>{
    let s="";
    keys.forEach(k=>{ const t=tally(rs,k); if(!t.n) return; s += `\n### ${qLabel(k,seg)}\n\nОтветили: ${t.n}\n\n| Вариант | Ответов | Доля |\n|---|---:|---:|\n` + t.rows.map(([o,c])=>`| ${o} | ${c} | ${pct(c,t.n)}% |`).join("\n") + "\n"; });
    return s;
  };
  md += `\n## Экспоненты\n` + (ex.length ? block(ex, RQ_STAND, "ex") : "\n_Анкет пока нет._\n");
  if (ex.length){
    const secs = CAT_SECTIONS.filter(s=>ex.some(r=>(r.v.sections||[]).includes(s)));
    if (secs.length>1){
      md += `\n## По разделам выставки\n`;
      ["method","pains","lastResult","interest"].forEach(k=>{
        const head = secs.map(s=>{ const n=ex.filter(r=>(r.v.sections||[]).includes(s)).length; return `${s} (${n})`; });
        const opts = tally(ex,k).rows.map(x=>x[0]); if(!opts.length) return;
        md += `\n### ${qLabel(k,"ex")}\n\n| Вариант | ${head.join(" | ")} |\n|---|${secs.map(()=>"---:").join("|")}|\n`;
        opts.forEach(o=>{ md += `| ${o} | ` + secs.map(s=>{ const t=tally(ex.filter(r=>(r.v.sections||[]).includes(s)),k); const c=(t.rows.find(x=>x[0]===o)||[0,0])[1]; return t.n?pct(c,t.n)+"%":"—"; }).join(" | ") + " |\n"; });
      });
    }
    if (catalog){
      md += `\n## Охват\n\n| Раздел | Опрошено компаний | В каталоге | Охват |\n|---|---:|---:|---:|\n`;
      const keyBy = new Set(ex.filter(r=>r.v.catId).map(r=>r.v.catId));
      CAT_SECTIONS.forEach(s=>{ const inCat=catalog.rows.filter(r=>r.sections.includes(s)); const done=inCat.filter(r=>keyBy.has(r.id)).length; md += `| ${s} | ${done} | ${inCat.length} | ${pct1(done,inCat.length)}% |\n`; });
      const done=catalog.rows.filter(r=>keyBy.has(r.id)).length;
      md += `| **всего** | **${done}** | **${catalog.rows.length}** | **${pct1(done,catalog.rows.length)}%** |\n`;
    }
  }
  md += `\n## Работают без стенда\n` + (no.length ? (()=>{ const t=tally(no,"subtype"); return t.n ? `\n### Чем занимаются\n\nОтветили: ${t.n}\n\n| Вариант | Ответов | Доля |\n|---|---:|---:|\n`+t.rows.map(([o,c])=>`| ${o} | ${c} | ${pct(c,t.n)}% |`).join("\n")+"\n" : ""; })() + block(no, RQ_NO, "no") : "\n_Анкет пока нет._\n");
  return md;
}
function researchRows(){
  const {ex, no} = research(), out=[];
  const add = (seg, rs, keys)=>keys.forEach(k=>{ const t=tally(rs,k); t.rows.forEach(([o,c])=>out.push([seg, (seg!=="экспоненты"&&FIELDS[k].lNo)||FIELDS[k].xh||FIELDS[k].l, o, c, t.n, t.n?c/t.n:0])); });
  add("экспоненты", ex, RQ_STAND);
  CAT_SECTIONS.forEach(s=>{ const rs=ex.filter(r=>(r.v.sections||[]).includes(s)); if(rs.length) add("экспоненты · "+s, rs, ["method","pains","lastResult","interest"]); });
  add("без стенда", no, ["subtype"].concat(RQ_NO));
  return out;
}
function buildResearchXlsx(){
  const rows=researchRows();
  const cols=[{h:"Сегмент",w:34,get:r=>r[0]},{h:"Вопрос",w:42,get:r=>r[1]},{h:"Вариант",w:34,get:r=>r[2]},{h:"Ответов",w:10,get:r=>r[3]},{h:"Ответили на вопрос",w:12,get:r=>r[4]},{h:"Доля",w:10,kind:"pct",get:r=>Math.round(r[5]*1000)/1000}];
  const sheets=[{name:"Итоги", cols, rows}];
  if (catalog){
    const keyBy=new Set(live().filter(r=>r.v.catId).map(r=>r.v.catId));
    const cov = CAT_SECTIONS.map(s=>{ const inCat=catalog.rows.filter(r=>r.sections.includes(s)); const d=inCat.filter(r=>keyBy.has(r.id)).length; return [s,d,inCat.length,inCat.length?d/inCat.length:0]; });
    sheets.push({name:"Охват", cols:[{h:"Раздел",w:34,get:r=>r[0]},{h:"Опрошено компаний",w:12,get:r=>r[1]},{h:"В каталоге",w:12,get:r=>r[2]},{h:"Охват",w:10,kind:"pct",get:r=>Math.round(r[3]*1000)/1000}], rows:cov});
  }
  return buildXlsxBook(sheets);
}

function stamp(){ const d=new Date(); return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())+"_"+pad(d.getHours())+"-"+pad(d.getMinutes()); }
/* Saves a file the way this device supports; resolves true when the file was handed over */
async function saveFile(name, data, mime){
  if (mode!=="file"){
    const dl = await dlPromise;
    if (!dl){ toast("В этом окне сохранение файлов недоступно. Используйте «Скопировать Markdown».", true); return false; }
    try{ await dl.save({filename:name, data}); toast("Файл готов: "+name); return true; }
    catch(e){ toast(e && e.code==="declined" ? "Сохранение отменено" : "Не удалось сохранить файл: "+((e&&e.message)||"ошибка"), e&&e.code!=="declined"); return false; }
  }
  const blob = data instanceof Blob ? data : new Blob([data], {type:mime});
  if (navigator.maxTouchPoints>0 && navigator.canShare && window.File){
    const types = [mime.split(";")[0], "text/plain", "application/octet-stream"];
    for (const t of types){
      let file; try{ file = new File([blob], name, {type:t}); }catch(e){ break; }
      if (navigator.canShare({files:[file]})){
        try{ await navigator.share({files:[file]}); toast("Файл передан: "+name); return true; }
        catch(e){ toast(e && e.name==="AbortError" ? "Сохранение отменено" : "Не удалось передать файл: "+((e&&e.message)||"ошибка"), !(e&&e.name==="AbortError")); return false; }
      }
    }
  }
  const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();}, 1500);
  toast("Файл сохранён: "+name); return true;
}
/* Long exports (archive, backup) are prepared first, then saved with one more tap if the tablet needs it */
let pending=null;
function b64(buf){ const u=new Uint8Array(buf); let s=""; for(let i=0;i<u.length;i+=0x8000) s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000)); return btoa(s); }
function unb64(str){ const s=atob(str), u=new Uint8Array(s.length); for(let i=0;i<s.length;i++) u[i]=s.charCodeAt(i); return u.buffer; }
async function prepare(btn, fn){
  const html=btn.innerHTML; btn.disabled=true;
  const b=btn.querySelector("b"); if(b) b.textContent="Готовлю…"; else btn.textContent="Готовлю…";
  try{
    const out = await fn(); if(!out) return;
    pending = out;
    $("#readyName").textContent = out.name; $("#readyInfo").textContent = mb(out.data.length||out.data.size||0)+(out.info?" · "+out.info:"");
    const active = navigator.userActivation ? navigator.userActivation.isActive : false;
    if (mode!=="file" || active){ const ok = await saveFile(out.name, out.data, out.mime); if (ok && out.onSaved) out.onSaved(); if(!ok){ $("#ready").hidden=false; } }
    else { $("#ready").hidden=false; toast("Файл готов — нажмите «Сохранить файл»"); }
  }catch(err){ toast("Не удалось подготовить файл: "+((err&&err.message)||"ошибка"), true); }
  finally{ btn.innerHTML=html; btn.disabled=false; }
}
$("#readySave").addEventListener("click", async ()=>{ if(!pending) return; const p=pending; const ok=await saveFile(p.name, p.data, p.mime); if(ok){ if(p.onSaved) p.onSaved(); $("#ready").hidden=true; pending=null; } });
$("#readyClose").addEventListener("click", ()=>{ $("#ready").hidden=true; pending=null; });
async function collectPhotos(rs){
  const files=[], have=new Set(); let miss=0;
  for (const r of rs) for (const k of PHOTO_KEYS){
    if (!r.v[k]) continue;
    const p = await PDB.get(r.v[k]).catch(()=>null);
    if (p){ const nm=photoName(r,k); files.push(["photos/"+nm, new Uint8Array(p.buf)]); have.add(nm); } else miss++;
  }
  return {files, have, miss};
}
const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
$("#exZip").addEventListener("click", e=>{
  const rs=needRows(); if(!rs) return;
  prepare(e.currentTarget, async ()=>{
    const st=stamp(), ph=await collectPhotos(rs);
    const data = zip([[`LogicSphera_ankety_${st}.xlsx`, buildXlsx(rs,{have:ph.have})], [`LogicSphera_ankety_${st}.md`, buildMd(rs, ph.have)], ...ph.files]);
    return {name:`LogicSphera_ankety_foto_${st}.zip`, data, mime:"application/zip", info:`анкет ${rs.length}, фото ${ph.files.length}`+(ph.miss?`, ещё ${ph.miss} на других планшетах`:"")};
  });
});
function needRows(){ const rs=scoped(); if(!rs.length){ toast("Нет анкет для выгрузки по выбранному условию", true); return null;} return rs; }
$("#exXlsx").addEventListener("click", ()=>{ const rs=needRows(); if(rs) saveFile(`LogicSphera_ankety_${stamp()}.xlsx`, buildXlsx(rs), XLSX_MIME); });
$("#exCsv").addEventListener("click", ()=>{ const rs=needRows(); if(rs) saveFile(`LogicSphera_ankety_${stamp()}.csv`, buildCsv(rs), "text/csv;charset=utf-8"); });
$("#exMd").addEventListener("click", ()=>{ const rs=needRows(); if(rs) saveFile(`LogicSphera_ankety_${stamp()}.md`, buildMd(rs), "text/markdown;charset=utf-8"); });
$("#exMdCopy").addEventListener("click", ()=>{
  const rs=needRows(); if(!rs) return; const md=buildMd(rs);
  navigator.clipboard.writeText(md).then(()=>toast("Markdown скопирован")).catch(()=>{
    const d=$("#mdPrev"); d.open=true; const pre=$("#mdText"); pre.textContent=md;
    const range=document.createRange(); range.selectNodeContents(pre); const sel=getSelection(); sel.removeAllRanges(); sel.addRange(range);
    toast("Текст выделен в предпросмотре — скопируйте его вручную");
  });
});
$("#exResMd").addEventListener("click", ()=>{ if(!live().length){ toast("Анкет пока нет", true); return; } saveFile(`LogicSphera_itogi_${stamp()}.md`, buildResearchMd(), "text/markdown;charset=utf-8"); });
$("#exResXlsx").addEventListener("click", ()=>{ if(!live().length){ toast("Анкет пока нет", true); return; } saveFile(`LogicSphera_itogi_${stamp()}.xlsx`, buildResearchXlsx(), XLSX_MIME); });
function doBackup(btn){
  prepare(btn, async ()=>{
    const all = Object.values(records).map(r=>clone(r));
    const photos = {}; let n=0;
    for (const r of all){ if(r.deleted||!r.v) continue; for (const k of PHOTO_KEYS){ const id=r.v[k]; if(!id||photos[id]) continue; const p=await PDB.get(id).catch(()=>null); if(p){ photos[id]=b64(p.buf); n++; } } }
    const data = JSON.stringify({format:"ls-survey", version:1, event:settings.event, device:settings.device, exportedAt:new Date().toISOString(), records:all, visits, photos});
    return {name:`LogicSphera_backup_${latin(settings.device)}_${stamp()}.json`, data, mime:"application/json", info:`анкет ${all.filter(r=>!r.deleted).length}, фото ${n}`, onSaved:markBackup};
  });
}
$("#exJson").addEventListener("click", e=>doBackup(e.currentTarget));
$("#importFile").addEventListener("change", e=>{
  const file=e.target.files[0]; if(!file) return;
  const fr=new FileReader();
  fr.onload=async ()=>{
    try{
      const j=JSON.parse(fr.result); if(j.format!=="ls-survey"||!Array.isArray(j.records)) throw new Error("not ours");
      const before = dupSet().size;
      let added=0, upd=0, ph=0;
      if (j.photos && typeof j.photos==="object"){
        for (const [id,data] of Object.entries(j.photos)){
          try{ if(!(await PDB.get(id))){ const buf=unb64(data); await PDB.put(id,{buf, type:"image/jpeg", size:buf.byteLength, createdAt:Date.now()}); ph++; } }catch(e){}
        }
      }
      j.records.forEach(r=>{
        if(!r||!r.id||!r.v) return;
        const cur=records[r.id];
        if(!cur){ records[r.id]=r; added++; }
        else if((r.updatedAt||0)>(cur.updatedAt||0)){ records[r.id]=r; upd++; }
      });
      if (j.visits && typeof j.visits==="object") Object.entries(j.visits).forEach(([id,v])=>{ if(!visits[id] || (v.at||0)>(visits[id].at||0)) visits[id]=v; });
      persist(); persistVisits(); renderAll();
      const dupNew = dupSet().size - before;
      toast(`Загружено: новых ${added}, обновлено ${upd}, фото ${ph}`+(dupNew>0?` · возможных дублей: ${dupNew} (фильтр в «Списке»)`:""));
      checkMem();
    }catch(err){ toast("Это не файл резервной копии «Анкеты Логик Сфера»", true); }
    e.target.value="";
  };
  fr.readAsText(file);
});
function renderExport(){
  const rs = scoped(), L = live();
  $("#scopeCount").textContent = "Попадёт в выгрузку: "+rs.length;
  const c = p=>L.filter(r=>r.v.priority===p).length;
  $("#stats").innerHTML = [["Всего",L.length],["A",c("A")],["B",c("B")],["C",c("C")],["Сегодня",L.filter(r=>(r.v.date||isoOf(r.createdAt))===todayISO()).length],["Срочно",L.filter(r=>r.v.urgent).length],["Без стенда",L.filter(r=>isNoStand(r.v)).length],["Без ФИО",L.filter(r=>!fio(r.v)).length]]
    .map(([l,n])=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");
  const R = research();
  $("#resStats").innerHTML = [["Экспонентов опрошено",R.ex.length],["Компаний",R.comp.size],["Без стенда",R.no.length],["Охват каталога", catalog ? pct1(new Set(R.ex.filter(r=>r.v.catId).map(r=>r.v.catId)).size, catalog.rows.length)+"%" : "—"]].map(([l,n])=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`).join("");
  $("#resText").textContent = buildResearchMd();
  $("#mdText").textContent = buildMd(rs);
  $("#bkInfo").textContent = settings.bkAt ? `Последняя копия: ${ruDT(settings.bkAt)}, анкет в ней: ${settings.bkN}. ${backupDue()||"Новых анкет после неё: "+Math.max(0,L.length-settings.bkN)+"."}` : (L.length ? "Копий с этого планшета ещё не было." : "");
  renderCatInfo(); renderMem(); memInfo().then(renderMem);
}
function renderCatInfo(){
  if (!catalog){ $("#catInfo").innerHTML = `<b>Не загружен</b><span class="hint">Загрузите файл каталога выставки — по номеру стенда будут подставляться компания, разделы и сайт, появится план обхода.</span>`; $("#catDel").hidden=true; return; }
  const noSt = catalog.rows.filter(r=>!r.stands.length).length;
  $("#catInfo").innerHTML = `<b>${catalog.rows.length} компаний · ${catalog.pavs.length} павильонов и площадок</b><span class="hint">${esc(catalog.name||"")} · загружен ${ruDT(catalog.loadedAt)}${noSt?` · без номера стенда: ${noSt}`:""}</span>`;
  $("#catDel").hidden=false;
}
["setDevice","setStaff","setEvent"].forEach(id=>{
  const key={setDevice:"device",setStaff:"staff",setEvent:"event"}[id];
  const el=document.getElementById(id); el.value=settings[key]||"";
  el.addEventListener("input",()=>{
    let v=el.value.trim();
    if(key==="device"){ v=v.replace(/[^0-9A-Za-zА-Яа-яЁё]/g,"").toUpperCase(); if(!v) return; }
    settings[key]=v; saveSettings();
    if(key==="staff" && !editingId){ form.staff=v; syncField("staff"); }
    renderAll();
  });
});
function renderPlat(){
  const cur=settings.platform||"auto", names={apple:"Apple (iPad)", android:"Android", other:"компьютер"};
  document.querySelectorAll("#setPlat .chip").forEach(c=>c.setAttribute("aria-pressed", c.dataset.pl===cur?"true":"false"));
  $("#setPlatHint").textContent = "Определено автоматически: "+names[detectPlatform()]+". От устройства зависит, как добавляется напоминание в календарь.";
}
$("#setPlat").addEventListener("click", e=>{ const b=e.target.closest(".chip"); if(!b) return; settings.platform=b.dataset.pl; saveSettings(); renderPlat(); });

/* ---------- Status (backup) ---------- */
function renderStatus(){
  const el=$("#status"), n=live().length;
  let s="ok", t;
  if (!localOk){ s="err"; t="Хранилище недоступно"; }
  else if (!n){ s="ok"; t="Только на этом планшете"; }
  else if (!settings.bkAt){ s="due"; t="Копии ещё не было"; }
  else { const since=Math.max(0,n-settings.bkN); t="Копия "+fmtTime(settings.bkAt)+(since?" · +"+since:""); s = backupDue() ? "due" : "ok"; }
  el.dataset.s=s; $("#statusText").textContent=t; el.title="Резервная копия — открыть «Выгрузку»";
}
function renderAll(){
  $("#evName").textContent = "Анкета · "+settings.event;
  $("#listCount").textContent = live().length;
  renderStatus(); renderPavChips(); afterChange(true); syncField("formNoView");
  if (!$("#view-list").hidden) renderList();
  if (!$("#view-export").hidden) renderExport();
  if (!$("#view-plan").hidden) renderPlan();
}

/* ---------- Toast & wake lock ---------- */
let toastT;
function toast(msg, err){ const t=$("#toast"); t.textContent=msg; t.classList.toggle("err",!!err); t.classList.add("show"); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("show"), err?4600:2800); }
let wl=null;
async function wake(){ try{ if(navigator.wakeLock && !wl){ wl=await navigator.wakeLock.request("screen"); wl.addEventListener("release",()=>{wl=null;}); } }catch(e){} }
document.addEventListener("pointerdown", wake, {once:true});
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="visible") wake(); });

/* ---------- Boot ---------- */
buildForm();
const d = LS.get(K_DRAFT, null);
if (d && d.form){ form = d.form; editingId = d.editingId && records[d.editingId] ? d.editingId : null; if(!form.date) form.date=todayISO(); }
else form = blankForm();
if (editingId){ const r=records[editingId]; $("#editbar").hidden=false; $("#editNo").textContent=r.formNo; $("#delBtn").hidden=false; $("#saveBtn").textContent="Сохранить изменения"; $("#clearBtn").textContent="Закрыть без сохранения"; }
syncAll(); renderAll(); updateRail(); renderPlat();
IDB.kv.get("catalog").then(c=>{ if(c && c.rows){ catalog=indexCatalog(c); renderAll(); syncAll(); } }).catch(()=>{});
setTimeout(gcPhotos, 3000);
setTimeout(()=>checkMem(), 1500);
setInterval(renderStatus, 60000);
if (mode==="file"){
  try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}
  const standalone = navigator.standalone===true || matchMedia("(display-mode: standalone)").matches;
  const pf = detectPlatform(), web = location.protocol.startsWith("http");
  const texts = {
    apple: "В Safari нажмите «Поделиться» → «На экран „Домой“» и дальше открывайте анкету только с этой иконки. Анкеты во вкладке Safari и в приложении с иконки хранятся раздельно.",
    android: "В Chrome откройте меню ⋮ → «Установить приложение» (или «Добавить на главный экран») и дальше открывайте анкету с иконки — так она работает без интернета."
  };
  if (texts[pf] && !standalone && web && !LS.get(K_HINT, false)){ $("#installText").textContent=texts[pf]; $("#installbar").hidden=false; }
  let deferredInstall=null;
  window.addEventListener("beforeinstallprompt", e=>{
    e.preventDefault(); deferredInstall=e;
    if (!texts[pf]) $("#installText").textContent = "Установите анкету как приложение, чтобы она открывалась без интернета.";
    $("#installBtn").hidden=false; if (!LS.get(K_HINT, false)) $("#installbar").hidden=false;
  });
  $("#installBtn").addEventListener("click", ()=>{ if(!deferredInstall) return; deferredInstall.prompt(); deferredInstall.userChoice.finally(()=>{ deferredInstall=null; $("#installBtn").hidden=true; }); });
  window.addEventListener("appinstalled", ()=>{ $("#installbar").hidden=true; LS.set(K_HINT, true); toast("Анкета установлена — открывайте её с иконки"); });
  $("#installHide").addEventListener("click", ()=>{ $("#installbar").hidden=true; LS.set(K_HINT, true); });
}
window.__ls = {buildXlsx, buildMd, buildCsv, buildResearchMd, buildResearchXlsx, scoped, records:()=>records, catalog:()=>catalog, form:()=>form, memInfo, columns};
})();
