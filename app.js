'use strict';
const codes = ['QAR','KRW','JPY','CNY','HKD','MOP','SGD'];
const $ = id => document.getElementById(id);
const money = new Intl.NumberFormat('it-IT', {style:'currency',currency:'EUR'});
let data = null;
let currency = 'KRW';
try { const saved = localStorage.getItem('cambio-asia.currency'); if(codes.includes(saved)) currency = saved; } catch {}
$('currency').value = currency;
// The amount never enters storage, URLs, logs or requests.
$('amount').value = '';
window.addEventListener('pageshow', () => { $('amount').value = ''; render(); });
function render() {
  $('code').textContent = currency;
  const raw = $('amount').value.trim();
  const valid = /^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(raw);
  const amount = Number(raw.replace(',','.'));
  const rate = data?.rates[currency];
  $('result').textContent = raw && valid && Number.isFinite(amount) && rate ? money.format(amount/rate) : '—';
  $('result-help').textContent = !raw ? 'Inserisci un importo.' : !valid || !Number.isFinite(amount) ? 'Usa solo cifre e un separatore decimale.' : !rate ? 'Serve un primo collegamento online per scaricare il cambio.' : 'Valore indicativo, senza commissioni.';
  if(data) {
    $('rate').textContent = `1 EUR = ${new Intl.NumberFormat('it-IT',{maximumFractionDigits:4}).format(rate)} ${currency}`;
    $('updated').textContent = 'Ultimo aggiornamento del cambio: ' + new Intl.DateTimeFormat('it-IT',{dateStyle:'medium',timeStyle:'short'}).format(new Date(data.time_last_update_unix*1000));
  }
}
$('currency').addEventListener('change', () => {currency=$('currency').value;try{localStorage.setItem('cambio-asia.currency',currency);}catch{}render();});
$('amount').addEventListener('input',render);
$('clear').addEventListener('click',()=>{$('amount').value='';render();$('amount').focus();});
let loading = false;
async function loadRates() {
  if(loading) return;
  loading=true;
  try {
    const response = await fetch('./rates.json', {cache:'no-store'});
    if(!response.ok) throw new Error('rates');
    const payload=await response.json();
    data=payload.data;
    const age=Date.now()-data.time_last_update_unix*1000;
    $('status').textContent = !navigator.onLine ? 'Offline · uso del cambio salvato.' : payload.networkFailed ? 'Aggiornamento non riuscito · uso del cambio salvato. Nuovo tentativo dopo 24 ore.' : 'Cambio salvato · disponibile anche offline.';
    if(age>48*60*60*1000) $('status').textContent += ' Attenzione: il cambio risale a più di 48 ore fa.';
  } catch {
    $('status').textContent=data ? 'Uso del cambio già caricato.' : 'Cambio non disponibile. Collegati a Internet; se il servizio non risponde, il prossimo tentativo sarà possibile dopo 24 ore.';
    if(!data) $('rate').textContent='Cambio non disponibile';
  } finally { loading=false;render(); }
}
async function start() {
  render();
  if(!('serviceWorker' in navigator)) { $('status').textContent='Apri questa app in Chrome su Android per usare la modalità offline.';return; }
  try {
    await navigator.serviceWorker.register('./sw.js');
    await navigator.serviceWorker.ready;
    if(!navigator.serviceWorker.controller) await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));
    await loadRates();
  } catch { $('status').textContent='Preparazione non riuscita. Apri il sito pubblicato con HTTPS e ricarica la pagina.'; }
}
window.addEventListener('online',loadRates);
window.addEventListener('offline',()=>{if(data) $('status').textContent='Offline · uso del cambio salvato.';});
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible' && navigator.serviceWorker?.controller) loadRates();});
setInterval(()=>{if(document.visibilityState==='visible' && navigator.serviceWorker?.controller) loadRates();},60*60*1000);
let installPrompt;
window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('install').hidden=false;});
$('install').addEventListener('click',async()=>{if(!installPrompt)return;await installPrompt.prompt();installPrompt=null;$('install').hidden=true;});
window.addEventListener('appinstalled',()=>{$('install').hidden=true;});
start();
