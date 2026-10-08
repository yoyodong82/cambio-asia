# Cambio Asia — pronto per il tuo viaggio

Converte QAR, KRW, JPY, CNY, HKD, MOP e SGD esclusivamente in EUR. Nessun account nell’app, nessuna pubblicità, nessuna cronologia. Non serve programmare, installare strumenti o inserire chiavi API.

## 1. Pubblica su GitHub Pages dal computer

1. Estrai **Cambio-Asia.zip**: clic destro sul file → **Estrai tutto**.
2. Apri https://github.com e accedi, oppure crea un account gratuito e verifica la tua email.
3. Premi **+** in alto → **New repository**.
4. Nome: **cambio-asia**. Seleziona **Public**, attiva **Add README**, poi **Create repository**.
5. Nel repository premi **Add file → Upload files**. Trascina **tutto il contenuto** della cartella estratta, inclusa la cartella **icons**. Non trascinare la cartella esterna e non caricare lo ZIP.
6. Controlla che nella lista compaiano **index.html**, **app.js**, **style.css**, **sw.js**, **manifest.webmanifest**, **LEGGIMI.md** e i tre file sotto **icons/**. Il file nascosto **.nojekyll**, se presente, va bene; se Windows non lo mostra, l’app funziona anche senza.
7. Premi **Commit changes** (se viene chiesta una scelta, conferma il salvataggio nel ramo **main**).
8. Apri **Settings → Pages**. In **Source** seleziona **Deploy from a branch**; scegli **main** e **/(root)**, quindi **Save**.
9. Attendi qualche minuto: la pubblicazione può richiedere fino a 10 minuti. Torna in **Settings → Pages** e premi **Visit site**.

L’indirizzo sarà simile a **https://TUO-NOME.github.io/cambio-asia/**. Usa quello mostrato da GitHub. Tutti i file devono essere alla radice del repository, con **icons** come sottocartella.

## 2. Installa su Android

1. Apri quell’indirizzo in **Chrome** sul telefono, con Internet attivo.
2. Aspetta che compaiano il cambio e la data di aggiornamento.
3. Premi **Installa Cambio Asia** se appare. Altrimenti apri il menu **⋮** di Chrome → **Installa e crea scorciatoia → Installa** oppure **Aggiungi a schermata Home → Installa** (il testo può variare leggermente).
4. Conferma. Apri **Cambio Asia** dall’icona sul telefono.
5. Prova: scegli una valuta, inserisci un importo, poi attiva la modalità aereo. Chiudi e riapri l’app: il cambio salvato resta disponibile e l’importo torna vuoto.

## Uso quotidiano

- Scegli il Paese e scrivi il prezzo: il valore in euro appare subito.
- Usa **1250**, **12,50** oppure **12.50**. Non usare punti o virgole per separare le migliaia: per mille scrivi **1000**.
- Premi **×** per cancellare l’importo.
- La valuta viene ricordata; l’importo non viene salvato, nemmeno alla riapertura della pagina.
- La data visualizzata è quella del cambio fornito dal servizio, nell’ora locale del dispositivo.
- Se il cambio ha più di 48 ore, compare un avviso. Offline puoi continuare a convertirlo, ma sarà meno aggiornato.
- Commissioni e maggiorazioni delle carte non sono comprese.

## Come funzionano gli aggiornamenti

L’app usa https://open.er-api.com/v6/latest/EUR e divide l’importo per il tasso della valuta selezionata. L’attribuzione al fornitore è sempre presente.

Effettua al massimo **una richiesta ogni 24 ore per installazione/browser e indirizzo dell’app**, anche con più schede aperte. L’aggiornamento avviene all’apertura, al ritorno nell’app o al ritorno online; se resta aperta, controlla una volta all’ora se sono trascorse le 24 ore. Non aggiorna in background quando l’app è chiusa.

Un tentativo online fallito conta nelle 24 ore; l’app conserva l’ultimo cambio valido. Se il primo tentativo fallisce, non ci sono ancora cambi disponibili: riprova dopo 24 ore. Una visita riconosciuta come offline non consuma il tentativo. Cancellare i dati del sito o usare un altro browser azzera la memoria di quel browser.

Sono conservati localmente solo la valuta, i sette cambi con la loro data, l’orario/esito dell’ultimo tentativo e i file necessari per l’uso offline. Nessun importo viene inviato al fornitore o conservato. GitHub ospita l’app e il fornitore riceve la richiesta dei cambi con i normali dati di connessione; l’app non contiene analisi delle visite, font esterni o altri servizi.

## Se qualcosa non funziona

- **Pagina 404:** attendi la pubblicazione e controlla **main / (root)** e che **index.html** sia nella prima schermata del repository.
- **Pagina senza stile:** controlla di aver caricato anche gli altri file e la cartella **icons**.
- **Nessun cambio:** serve il primo caricamento online riuscito. Dopo un errore online attendi 24 ore.
- **Nessun pulsante Installa:** usa il menu di Chrome. Apri l’indirizzo HTTPS pubblicato, non il file HTML dal telefono.
- **Offline senza dati:** apri prima online e aspetta il cambio. Evita la navigazione in incognito e la cancellazione dei dati del sito.

## Per aggiornare i file in futuro

Carica le nuove versioni nel medesimo repository. Chi prepara una nuova versione deve cambiare **app-v1** in **app-v2** in **sw.js** (e così via), affinché la cache dell’interfaccia venga rinnovata. Non cambiare **data-v1**, così il cambio salvato e il limite giornaliero vengono mantenuti. Poi riapri e ricarica l’app online.

## Fonti ufficiali

- GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site
- Impostazioni Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- Installazione Android: https://support.google.com/chrome/answer/9658361?hl=it&co=GENIE.Platform%3DAndroid
- API e attribuzione: https://www.exchangerate-api.com/docs/free

La prova su Android e sul tuo indirizzo GitHub Pages si completa dopo la pubblicazione. Il pacchetto non è già pubblicato nel tuo account.
