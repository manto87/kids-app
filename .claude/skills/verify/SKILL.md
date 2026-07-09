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

1. Home → Numeri → carta → dettaglio (glifo, conteggio emoji, audio) → frecce avanti/indietro.
2. Home → Lettere → carta A → dettaglio ("A a", "a. A come Ape").
3. Home → Parole → categoria → parola → dettaglio.
4. Gioco (`#vai-gioco`): il prompt vocale dice il bersaglio ("Trova il numero tre";
   per le lettere pronuncia SOLO la lettera, es. "emme");
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
   "Scrivi: cinque"; si disegna sul canvas `#lavagna-canvas` con eventi pointer
   (mouse down/move/up funzionano). Scarabocchio + `#btn-fatto` → compare `.guida.visibile`
   (aiuto). Per scrivere "bene" in test: campiona i pixel del glifo da un canvas
   offscreen (font `bold 190px Trebuchet MS`), ordina i punti nearest-neighbor,
   spezza in tratti sui salti >24px e ricalca col mouse. La valutazione normalizza
   posizione/scala, quindi non serve allineamento perfetto.
9. Suono ta-da: spia `AudioContext.prototype.createOscillator` in addInitScript;
   una risposta giusta crea 3 oscillatori.

## Attenzioni

- I timer dei giochi usano `dopo()` (legato alla generazione di schermata):
  navigare altrove annulla avanzamenti e ripetizioni vocali pendenti.
  Nei test comunque meglio attendere ~2 s dopo una risposta giusta prima di navigare.

- Il pulsante 🏠 porta SEMPRE alla home, non alla schermata precedente.
- Dopo aver modificato i file statici, alzare `VERSIONE` in `sw.js` o la cache servirà i vecchi file.
