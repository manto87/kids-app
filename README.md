# Impara con Me 🌈

App mobile per imparare **numeri**, **lettere** e **prime parole**, progettata
per bambini con deficit cognitivo.

È una **PWA** (Progressive Web App): si apre dal browser, si installa sulla
schermata home del telefono o del tablet come una vera app e funziona anche
**senza connessione**. Non richiede installazioni da store e non raccoglie
dati — a parte il riconoscimento vocale opzionale della sezione Inglese
(spento di default, va acceso dal genitore): vedi sotto.

## Cosa contiene

- **🔢 Numeri** — da 1 a 10, con il numero grande, gli oggetti da contare e la voce che li pronuncia.
- **🔤 Lettere** — l'alfabeto italiano (21 lettere), ognuna con una parola e un'immagine ("A come Ape 🐝"). Nei momenti di insegnamento si sente il **suono** della lettera ("mm", non "emme"), come si insegna oggi a scuola — più naturale da collegare alla lettura, pronunciato molto lentamente per essere ben percepibile.
- **🗣️ Parole** — prime parole divise in categorie semplici: Famiglia, Animali, Cibo, Oggetti.
- **🇬🇧 Inglese** — prime parole semplici in inglese, per ora la categoria Famiglia (Mum, Dad, Grandma, Grandpa, Brother, Sister, Baby), pronunciate con voce e accento inglese. Oltre al solito gioco a tocco, se il genitore attiva il riconoscimento vocale (area genitori, spento di default) compare anche "🎤 Ripeti la parola": il bambino pronuncia la parola nel microfono e viene riconosciuta in modo tollerante (piccoli errori di pronuncia vanno bene), senza mai penalità. Disponibile solo sui dispositivi/browser che supportano il riconoscimento vocale; altrove resta comunque il gioco a tocco.
- **🎮 Gioco "Ascolta e trova"** — in ogni sezione, con il pulsante sempre in cima: la voce chiede un elemento e il bambino lo tocca tra 2 (o 3) scelte grandi (per le lettere la voce pronuncia il suono). Nelle Parole le scelte mostrano prima solo la parola scritta: le figure compaiono come aiuto al terzo tentativo. Nessun tempo limite, nessuna penalità. Lo stesso numero/lettera/parola non si ripete mai per 2-3 round di fila, e dopo un complimento c'è una pausa naturale (si aspetta che la voce finisca di parlare) prima della domanda successiva.
- **🧩 Gioco "Completa la parola"** — nella sezione Lettere: una parola con una lettera nascosta, si ascolta la parola e si sceglie la lettera mancante.
- **🦊 Gino, la mascotte, sale di livello** — un traguardo globale per bambino: ogni 10 risposte giuste in QUALSIASI gioco Gino sale di livello (fino a 12), balla con un salto d'entrata ed esce festante con coriandoli sparsi (e un "ta-da" musicale). Nei primi 6 livelli sblocca accessori fissi che restano suoi per sempre — bandana, occhiali da sole, mantello da supereroe, corona, bacchetta magica. Dal livello 7 al 12 sblocca accessori **a tema stagionale** (cappellino, borsa, scarpe, un oggetto speciale, decorazioni fluttuanti e infine una corona suprema): ognuno assume l'aspetto della stagione reale in cui viene sbloccato la prima volta e resta così per sempre — un po' come i personaggi di Duolingo. Una barra di progresso con la miniatura di Gino (già vestito) mostra quanto manca al prossimo livello, al posto delle vecchie stelle.
- **✍️ Scrivi (dettato)** — la voce detta un numero o una lettera e il bambino la scrive col dito sulla lavagna. Se non riesce, aiuti progressivi: compare la traccia grigia da ricalcare (poi più scura) e il controllo diventa via via più generoso. Non conta dove e quanto grande si scrive: conta la forma.
- **👦👧 Più bambini** — ogni bambino ha il suo profilo (nome, genere, difficoltà) e i **suoi** progressi. Dall'area genitori si sceglie chi gioca, si aggiunge un nuovo bambino o si modifica/elimina un profilo. I profili restano salvati sul dispositivo.
- **👋 Nome e genere** — inseriti al primo avvio; i complimenti sono personalizzati e corretti al maschile/femminile ("Brava Sofia!", "Bravissimo Marco!").
- **📊 Progressi per bambino** — l'app registra risposte giuste e sbagliate per ogni attività, separatamente per ciascun bambino; i genitori li vedono nell'area riservata (con azzeramento — il livello di Gino e i suoi accessori restano invece per sempre, sono un traguardo, non una statistica).
- **📈 Difficoltà adattiva** — attiva di default (spegnibile dal genitore): ogni attività ha un livello 1→3 che sale dove il bambino è costantemente bravo e riscende se fatica. Ai livelli alti aumentano le scelte (2→3) e compaiono distrattori insidiosi (6 vs 9, b vs d). La scelta di cosa proporre è bilanciata: allena più spesso i punti deboli. (È un sistema diverso e indipendente dal livello di Gino: quello misura *quanto* è impegnativo il gioco, questo *quanto* il bambino ha giocato in totale.)

## Progettata per bambini con deficit cognitivo

- **Un solo compito per schermata**, navigazione sempre identica (🏠 in alto a sinistra).
- **Pulsanti molto grandi** e ben distanziati, alto contrasto, poche distrazioni.
- **Audio prima di tutto**: ogni elemento viene pronunciato con voce italiana lenta e chiara (sintesi vocale del dispositivo), con una pausa naturale tra un complimento e la domanda successiva — mai una parola sopra l'altra.
- **Solo rinforzo positivo**: la risposta sbagliata si spegne con dolcezza e si riprova subito; niente timer, punteggi negativi o suoni bruschi.
- **Animazioni delicate**, rispettano `prefers-reduced-motion`.
- **Area genitori** protetta (si apre tenendo premuto ⚙️ per 2 secondi) per adattare l'app al bambino:
  - scelta del bambino attivo, aggiunta/modifica/eliminazione dei profili
  - difficoltà adattiva on/off; in manuale, numero di scelte nel gioco (per bambino)
  - scrittura MAIUSCOLO/minuscolo (per bambino)
  - velocità della voce, voce e suoni di festa (per il dispositivo)
  - riconoscimento vocale per l'Inglese on/off (per il dispositivo, spento di default, con nota sulla privacy)
  - progressi per bambino con livello per attività e azzeramento

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
