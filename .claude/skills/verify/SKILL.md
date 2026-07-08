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
4. Gioco (`#vai-gioco`): il prompt vocale dice il bersaglio ("Trova il numero tre");
   risposta sbagliata → carta `.sbagliata` disabilitata, nessuna penalità;
   5 risposte giuste → schermata `.festa`. Attendere ~1,7 s tra i round (delay interno 1,4 s).
5. Parent gate: tap veloce su `#btn-genitori` NON deve aprire; `mouse.down()` + 2,2 s + `mouse.up()` sì.
6. Impostazioni: cambiare opzione → verificare `localStorage.impostazioni` e l'effetto in UI.
7. Offline: caricare la pagina, attendere ~1 s (installazione service worker),
   `context.setOffline(true)` + reload → la home deve ancora caricarsi.

## Attenzioni

- Il pulsante 🏠 porta SEMPRE alla home, non alla schermata precedente.
- Dopo aver modificato i file statici, alzare `VERSIONE` in `sw.js` o la cache servirà i vecchi file.
