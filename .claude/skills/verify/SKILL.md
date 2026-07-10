---
name: verify
description: Come avviare e verificare end-to-end l'app "Impara con Me" (PWA statica) in ambiente headless.
---

# Verifica di Impara con Me

App statica senza build: basta un server statico e un browser.

## Avvio

```bash
npx http-server /path/al/repo -p 8321 -s     # oppure python3 -m http.server
```

## Guida con Playwright (headless)

- Usare il modulo `playwright` globale: `NODE_PATH=/opt/node22/lib/node_modules node script.js`
- Contesto mobile: viewport 393×851, `isMobile: true`, `hasTouch: true`, `locale: 'it-IT'`.
- **Audio**: in headless non ci sono voci TTS; per verificare cosa viene pronunciato,
  intercettare `speechSynthesis.speak` con `page.addInitScript` e accumulare `u.text`
  in `window.__spoken`.

## Flussi da guidare

0. PROFILI: dati in `localStorage.profili` = `{profili:[{id,nome,genere,numScelte,maiuscole,statistiche}], attivo}`;
   voce/suoni in `localStorage.dispositivo`. Migrazione automatica dal vecchio
   `impostazioni`/`statistiche` a un profilo. Primo avvio (nessun profilo):
   form `#campo-nome` + `.btn-genere[data-genere=m|f]` (abilita `#btn-inizia`) → home.
   Genere femmina ⇒ i complimenti non devono MAI contenere "bravo/bravissimo"
   maschili (usare `lode()`); il nome compare spesso.
   Area genitori: `.lista-profili` (`[data-scegli]` per attivare, `[data-modifica]`
   per modificare), `#btn-nuovo-bambino` crea un profilo. Le statistiche e la
   difficoltà (numScelte/maiuscole) sono PER BAMBINO; velocità/voce/suoni del dispositivo.
1. Home → Numeri → carta → dettaglio (glifo, conteggio emoji, audio) → frecce avanti/indietro.
2. Home → Lettere → carta A → dettaglio ("A a", "a. A come Ape").
3. Home → Parole → categoria → parola → dettaglio.
4. Gioco (`#vai-gioco`, pulsante SOPRA la griglia): il prompt vocale dice il bersaglio
   ("Trova il numero tre"; per le lettere pronuncia il SUONO fonetico, es. "mmm" per
   la M, non il nome "emme" — vedi punto 12);
   nelle PAROLE le scelte mostrano solo `.parola-scritta` (le `.figura` sono hidden),
   le carte sbagliate NON si disabilitano (classe `.scossa` temporanea) e dopo
   2 errori le figure diventano visibili;
   risposta sbagliata → carta `.sbagliata` disabilitata, nessuna penalità;
   risposta giusta → compare la mascotte `#mascotte-pop` (sparisce da sola dopo ~1,6 s);
   5 risposte giuste → schermata `.festa`. Il round successivo NON parte con un
   ritardo fisso: `parlaEPoi()` aspetta la fine vera del complimento (evento
   `onend`/`onerror` dell'utterance) + `PAUSA_DOPO_LODE` (700ms) prima di richiamare
   il round dopo — nei test conviene attendere l'evento con `page.waitForFunction`
   invece di un `waitForTimeout` fisso (vedi punto 13).
4b. Gioco "Completa la parola" (`#vai-gioco-parola`, solo in Lettere): tessere `.tessera`
   con un `.tessera.buco` ("?"); la voce dice la parola; scelta giusta → buco riempito
   (`.tessera.riempita`) + mascotte. Nota: la parola scritta "orso" viene pronunciata "orsetto".
5. Parent gate: tap veloce su `#btn-genitori` NON deve aprire; `mouse.down()` + 2,2 s + `mouse.up()` sì.
6. Impostazioni: cambiare opzione → verificare `localStorage.impostazioni` e l'effetto in UI.
7. Offline: caricare la pagina, attendere ~1 s (installazione service worker),
   `context.setOffline(true)` + reload → la home deve ancora caricarsi.

8. Scrivi/dettato (`#vai-scrivi` → `#detta-numeri`/`#detta-lettere`): la voce dice
   SOLO il bersaglio (es. "cinque"); si disegna sul canvas `#lavagna-canvas` con eventi pointer
   (mouse down/move/up funzionano). Scarabocchio + `#btn-fatto` → compare `.guida.visibile`
   (aiuto). Per scrivere "bene" in test: campiona i pixel del glifo da un canvas
   offscreen (font `bold 190px Trebuchet MS`), ordina i punti nearest-neighbor,
   spezza in tratti sui salti >24px e ricalca col mouse. La valutazione normalizza
   posizione/scala, quindi non serve allineamento perfetto. La metrica è a distanze
   (precisione Tp=8px, copertura Tc=14px su glifo 190px, eccesso lunghezza ≤3,8×):
   scarabocchi, riempimenti e glifi dissimili falliscono; nei test sintetici
   tracciare la LINEA CENTRALE (centri delle corse per riga+colonna, dedupe 12px),
   non l'area piena: l'eccesso (≤2,5×) e l'invasione delle zone vuote (≤0,35)
   respingono i tracciati densi.
9. Suono ta-da: spia `AudioContext.prototype.createOscillator` in addInitScript;
   una risposta giusta crea 3 oscillatori.
10. Statistiche: `registra(attivita, itemId, giusto)` scrive in
    `profiloAttivo().statistiche` (per attività e per elemento) → `localStorage.profili`.
    L'area genitori mostra Progressi del bambino attivo (`.riga-stat.totale`) e
    `#btn-azzera` (reset solo del bambino attivo).
11. Difficoltà adattiva (profilo `adattiva`, default ON; costanti in `ADATTIVA`):
    livello 1..3 per attività in `profilo.livelli`, finestra recente in `profilo.recenti`.
    Sale dopo ≥8 risposte con acc ≥0.85, scende dopo ≥6 con acc ≤0.5 (isteresi: la
    finestra si azzera al cambio). Livello→scelte: 1→2, 2→3, 3→3; a L3 distrattori
    "simili" (`SIMILI_NUMERI`/`SIMILI_LETTERE`). Selezione bilanciata: `scegliBersaglio`
    pesa sui punti deboli (padronanza di Laplace). Interruttore `[data-opzione="adattiva"]`;
    quando ON il controllo `[data-opzione="numScelte"]` è nascosto. NB nei test: il round
    successivo si renderizza dopo ~1600ms (`dopo()`), quindi attendere prima di leggere
    le scelte. Test dedicato: `scratchpad/verify-adattiva.js`.
12. Anti-ripetizione: `scegliBersaglio` tiene in `storiaRecente[attivita]` gli ultimi
    `MEMORIA_RECENTI=3` id proposti (numeri/lettere/parole in Trova e Scrivi, e le
    parole in Completa via la chiave `'completa-parola'`) e li esclude dal pool prima
    di scegliere — stesso bersaglio non torna prima di 4 round, sia con difficoltà
    adattiva sia manuale. Se il pool residuo è vuoto il vincolo si rilassa. Verificato
    con `scratchpad/verify-fix3.js`: 14 round consecutivi, 0 violazioni.
13. Lettere: ogni voce di `DATA.lettere.items` ha `say` (nome tradizionale, es. "emme" —
    usato SOLO per `aria-label`, accessibilità) e `suono` (il suono fonetico, es. "mmm" —
    usato in tutti i punti dove si INSEGNA la lettera: gioco Trova, dettaglio, dettato).
    Le consonanti prolungabili sono ripetute 3 volte (mmm, nnn, fff, lll, rrr, sss, vvv,
    zzz) per farle "allungare" dalla sintesi vocale; le occlusive (b,c,d,g,p,q,t) restano
    una lettera sola (non prolungabili, resa non garantita su ogni voce/dispositivo);
    H resta "acca" (muta, nessun suono da insegnare). Verificare leggendo
    `DATA.lettere.items` via `page.evaluate` e controllando il flusso reale in
    `vaiDettaglio`/`vaiGioco`/`vaiDettato` (`scratchpad/verify-fix3.js`).

## Attenzioni

- I timer dei giochi usano `dopo()` (legato alla generazione di schermata):
  navigare altrove annulla avanzamenti e ripetizioni vocali pendenti.
  Nei test comunque meglio attendere ~2 s dopo una risposta giusta prima di navigare.

- Il pulsante 🏠 porta SEMPRE alla home, non alla schermata precedente.
- Dopo aver modificato i file statici, alzare `VERSIONE` in `sw.js` o la cache servirà i vecchi file.
