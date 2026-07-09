# Impara con Me 🌈

App mobile per imparare **numeri**, **lettere** e **prime parole**, progettata
per bambini con deficit cognitivo.

È una **PWA** (Progressive Web App): si apre dal browser, si installa sulla
schermata home del telefono o del tablet come una vera app e funziona anche
**senza connessione**. Non richiede installazioni da store né raccoglie dati.

## Cosa contiene

- **🔢 Numeri** — da 1 a 10, con il numero grande, gli oggetti da contare e la voce che li pronuncia.
- **🔤 Lettere** — l'alfabeto italiano (21 lettere), ognuna con una parola e un'immagine ("A come Ape 🐝").
- **🗣️ Parole** — prime parole divise in categorie semplici: Famiglia, Animali, Cibo, Oggetti.
- **🎮 Gioco "Ascolta e trova"** — in ogni sezione, con il pulsante sempre in cima: la voce chiede un elemento e il bambino lo tocca tra 2 (o 3) scelte grandi (per le lettere la voce pronuncia solo la lettera). Nelle Parole le scelte mostrano prima solo la parola scritta: le figure compaiono come aiuto al terzo tentativo. Si vincono 5 stelle e si festeggia. Nessun tempo limite, nessuna penalità.
- **🧩 Gioco "Completa la parola"** — nella sezione Lettere: una parola con una lettera nascosta, si ascolta la parola e si sceglie la lettera mancante.
- **🦊 Gino, la mascotte** — salta fuori e festeggia con i coriandoli (e un "ta-da" musicale) a ogni risposta giusta.
- **✍️ Scrivi (dettato)** — la voce detta un numero o una lettera e il bambino la scrive col dito sulla lavagna. Se non riesce, aiuti progressivi: compare la traccia grigia da ricalcare (poi più scura) e il controllo diventa via via più generoso. Non conta dove e quanto grande si scrive: conta la forma.

## Progettata per bambini con deficit cognitivo

- **Un solo compito per schermata**, navigazione sempre identica (🏠 in alto a sinistra).
- **Pulsanti molto grandi** e ben distanziati, alto contrasto, poche distrazioni.
- **Audio prima di tutto**: ogni elemento viene pronunciato con voce italiana lenta e chiara (sintesi vocale del dispositivo).
- **Solo rinforzo positivo**: la risposta sbagliata si spegne con dolcezza e si riprova subito; niente timer, punteggi negativi o suoni bruschi.
- **Animazioni delicate**, rispettano `prefers-reduced-motion`.
- **Area genitori** protetta (si apre tenendo premuto ⚙️ per 2 secondi) per adattare l'app al bambino:
  - numero di scelte nel gioco (2 = più facile, 3 = più difficile)
  - scrittura in MAIUSCOLO o minuscolo
  - velocità della voce (lenta / normale)
  - voce accesa / spenta

## Come provarla

Serve solo un server statico, ad esempio:

```bash
npx serve .        # oppure: python3 -m http.server 8000
```

poi apri `http://localhost:8000` dal browser (meglio se da telefono/tablet sulla stessa rete).

## Come installarla sul telefono

1. Pubblica il repository con **GitHub Pages** (Settings → Pages → branch `main`, cartella `/`), oppure su qualsiasi hosting statico.
2. Apri l'indirizzo con Chrome (Android) o Safari (iPhone/iPad).
3. Scegli **"Aggiungi a schermata Home"** / **"Installa app"**.
4. L'app si apre a schermo intero e funziona anche offline.

> La voce usa la sintesi vocale del dispositivo (`SpeechSynthesis`): su Android
> verifica che sia installata la voce italiana di Google; su iOS è già inclusa.

## Struttura del codice

```
index.html            pagina unica dell'app
css/style.css         stile (variabili, pulsanti grandi, animazioni delicate)
js/data.js            contenuti: numeri, lettere, parole, frasi di rinforzo
js/app.js             navigazione, sintesi vocale, gioco, area genitori
manifest.webmanifest  installazione come app
sw.js                 funzionamento offline (cache)
icons/                icona dell'app (SVG + PNG)
```

Nessuna dipendenza, nessun passaggio di build: HTML, CSS e JavaScript puri.
