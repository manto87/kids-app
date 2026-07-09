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
   ("Trova il numero tre"; per le lettere pronuncia SOLO la lettera, es. "emme");
   nelle PAROLE le scelte mostrano solo `.parola-scritta` (le `.figura` sono hidden),
   le carte sbagliate NON si disabilitano (classe `.scossa` temporanea) e dopo
   2 errori le figure diventano visibili;
   risposta sbagliata → carta `.sbagliata` disabilitata, nessuna penalità;
   risposta giusta → compare la mascotte `#mascotte-pop` (sparisce da sola dopo ~1,6 s);
   5 risposte giuste → schermata `.festa`. Attendere ~1,9 s tra i round (delay interno 1,6 s).
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

## Attenzioni

- I timer dei giochi usano `dopo()` (legato alla generazione di schermata):
  navigare altrove annulla avanzamenti e ripetizioni vocali pendenti.
  Nei test comunque meglio attendere ~2 s dopo una risposta giusta prima di navigare.

- Il pulsante 🏠 porta SEMPRE alla home, non alla schermata precedente.
- Dopo aver modificato i file statici, alzare `VERSIONE` in `sw.js` o la cache servirà i vecchi file.
