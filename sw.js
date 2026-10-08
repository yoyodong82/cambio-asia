'use strict';
const PREFIX='cambio-asia-'+new URL('./',self.location.href).pathname+'-';
const APP_CACHE=PREFIX+'app-v1';
const DATA_CACHE=PREFIX+'data-v1';
const API='https://open.er-api.com/v6/latest/EUR';
const DAY=24*60*60*1000;
const root=new URL('./',self.location.href);
const key=name=>new URL(name,root).href;
const assets=['./','index.html','style.css','app.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/icon-maskable-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(APP_CACHE);await cache.addAll(assets.map(key));await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const name of await caches.keys()){if(name.startsWith(PREFIX+'app-')&&name!==APP_CACHE)await caches.delete(name);}await self.clients.claim();})()));
function valid(data){return data?.result==='success' && data.base_code==='EUR' && Number.isFinite(data.time_last_update_unix) && data.time_last_update_unix>0 && ['QAR','KRW','JPY','CNY','HKD','MOP','SGD'].every(code=>Number.isFinite(data.rates?.[code])&&data.rates[code]>0);}
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store'}});
let pending;
async function rates(){
  const cache=await caches.open(DATA_CACHE);
  const saved=await cache.match(key('saved-rates'));
  let data=saved ? await saved.json() : null;
  const stamp=await cache.match(key('last-attempt'));
  const previous=stamp ? await stamp.json() : null;
  const now=Date.now();
  // A failed online attempt also consumes the quota; offline visits do not.
  const due=!previous || now-previous.time>=DAY;
  let failed=previous?.failed||false;
  if(due && self.navigator.onLine!==false){
    await cache.put(key('last-attempt'),json({time:now,failed:true}));
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    try{
      const response=await fetch(API,{cache:'no-store',signal:controller.signal,credentials:'omit',referrerPolicy:'no-referrer'});
      if(!response.ok)throw new Error('http');
      const fresh=await response.json();
      if(!valid(fresh))throw new Error('invalid');
      // Keep only the seven required rates and the provider's timestamp.
      data={rates:Object.fromEntries(['QAR','KRW','JPY','CNY','HKD','MOP','SGD'].map(code=>[code,fresh.rates[code]])),time_last_update_unix:fresh.time_last_update_unix};
      await cache.put(key('saved-rates'),json(data));
      failed=false;
      await cache.put(key('last-attempt'),json({time:now,failed:false}));
    }catch{failed=true;}finally{clearTimeout(timeout);}
  }
  return data ? json({data,networkFailed:failed}) : json({error:'unavailable'},503);
}
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin!==root.origin || !url.pathname.startsWith(root.pathname) || event.request.method!=='GET')return;
  if(url.href===key('rates.json')){
    if(!pending)pending=rates().finally(()=>{pending=null;});
    event.respondWith(pending.then(response=>response.clone()));return;
  }
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{try{return await fetch(event.request);}catch{return await (await caches.open(APP_CACHE)).match(key('index.html'));}})());return;
  }
  if(assets.map(key).includes(url.href))event.respondWith((async()=>{const cache=await caches.open(APP_CACHE);return await cache.match(event.request)||fetch(event.request);})());
});
