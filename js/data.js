/* Contenuti dell'app: numeri, lettere e prime parole.
   Ogni elemento ha: id, ciò che si mostra (glyph/emoji) e ciò che si pronuncia (say). */

const DATA = {

  numeri: {
    id: 'numeri',
    titolo: 'Numeri',
    emoji: '🔢',
    colore: 'blu',
    items: [
      { id: 'n1',  glyph: '1',  say: 'uno',     emoji: '🍎', count: 1 },
      { id: 'n2',  glyph: '2',  say: 'due',     emoji: '🍌', count: 2 },
      { id: 'n3',  glyph: '3',  say: 'tre',     emoji: '🐤', count: 3 },
      { id: 'n4',  glyph: '4',  say: 'quattro', emoji: '🌸', count: 4 },
      { id: 'n5',  glyph: '5',  say: 'cinque',  emoji: '⭐', count: 5 },
      { id: 'n6',  glyph: '6',  say: 'sei',     emoji: '🐞', count: 6 },
      { id: 'n7',  glyph: '7',  say: 'sette',   emoji: '🎈', count: 7 },
      { id: 'n8',  glyph: '8',  say: 'otto',    emoji: '🐟', count: 8 },
      { id: 'n9',  glyph: '9',  say: 'nove',    emoji: '🍓', count: 9 },
      { id: 'n10', glyph: '10', say: 'dieci',   emoji: '🚗', count: 10 },
    ],
  },

  lettere: {
    id: 'lettere',
    titolo: 'Lettere',
    emoji: '🔤',
    colore: 'verde',
    /* say = nome tradizionale della lettera (usato solo per l'aria-label,
       cioè per chi naviga con uno screen reader).
       suono = il SUONO fonetico della lettera, quello che oggi si insegna
       per primo a scuola (metodo fonematico, consigliato anche per bambini
       con difficoltà di apprendimento): "mm" invece di "emme", "ff" invece
       di "effe". Le consonanti che si possono "allungare" (m, n, f, l, r,
       s, v, z) si scrivono doppie per farle sostenere di più dalla sintesi
       vocale (parlata comunque molto lenta, vedi RATE_SUONO_LETTERA in
       app.js); le occlusive (b, c, d, g, p, q, t) restano una sola lettera
       perché non sono prolungabili in nessun modo — la voce lenta è l'unica
       leva disponibile senza audio registrato. La H è muta, si insegna il
       nome perché un suono da insegnare non c'è. */
    items: [
      { id: 'lA', glyph: 'A', say: 'a',    suono: 'a',    parola: 'Ape',      emoji: '🐝' },
      { id: 'lB', glyph: 'B', say: 'bi',   suono: 'b',    parola: 'Barca',    emoji: '⛵' },
      { id: 'lC', glyph: 'C', say: 'ci',   suono: 'c',    parola: 'Cane',     emoji: '🐶' },
      { id: 'lD', glyph: 'D', say: 'di',   suono: 'd',    parola: 'Dado',     emoji: '🎲' },
      { id: 'lE', glyph: 'E', say: 'e',    suono: 'e',    parola: 'Elefante', emoji: '🐘' },
      { id: 'lF', glyph: 'F', say: 'effe', suono: 'ff',   parola: 'Fiore',    emoji: '🌸' },
      { id: 'lG', glyph: 'G', say: 'gi',   suono: 'g',    parola: 'Gatto',    emoji: '🐱' },
      { id: 'lH', glyph: 'H', say: 'acca', suono: 'acca', parola: 'Hotel',    emoji: '🏨' },
      { id: 'lI', glyph: 'I', say: 'i',    suono: 'i',    parola: 'Isola',    emoji: '🏝️' },
      { id: 'lL', glyph: 'L', say: 'elle', suono: 'll',   parola: 'Luna',     emoji: '🌙' },
      { id: 'lM', glyph: 'M', say: 'emme', suono: 'mm',   parola: 'Mela',     emoji: '🍎' },
      { id: 'lN', glyph: 'N', say: 'enne', suono: 'nn',   parola: 'Nave',     emoji: '🚢' },
      { id: 'lO', glyph: 'O', say: 'o',    suono: 'o',    parola: 'Orso',     emoji: '🐻' },
      { id: 'lP', glyph: 'P', say: 'pi',   suono: 'p',    parola: 'Palla',    emoji: '⚽' },
      { id: 'lQ', glyph: 'Q', say: 'cu',   suono: 'q',    parola: 'Quadro',   emoji: '🖼️' },
      { id: 'lR', glyph: 'R', say: 'erre', suono: 'rr',   parola: 'Rana',     emoji: '🐸' },
      { id: 'lS', glyph: 'S', say: 'esse', suono: 'ss',   parola: 'Sole',     emoji: '☀️' },
      { id: 'lT', glyph: 'T', say: 'ti',   suono: 't',    parola: 'Treno',    emoji: '🚂' },
      { id: 'lU', glyph: 'U', say: 'u',    suono: 'u',    parola: 'Uva',      emoji: '🍇' },
      { id: 'lV', glyph: 'V', say: 'vu',   suono: 'vv',   parola: 'Vulcano',  emoji: '🌋' },
      { id: 'lZ', glyph: 'Z', say: 'zeta', suono: 'zz',   parola: 'Zaino',    emoji: '🎒' },
    ],
  },

  parole: {
    id: 'parole',
    titolo: 'Parole',
    emoji: '🗣️',
    colore: 'arancio',
    categorie: [
      {
        id: 'famiglia', titolo: 'Famiglia', emoji: '👪',
        items: [
          { id: 'p-mamma', glyph: 'mamma', say: 'mamma', emoji: '👩' },
          { id: 'p-papa',  glyph: 'papà',  say: 'papà',  emoji: '👨' },
          { id: 'p-nonna', glyph: 'nonna', say: 'nonna', emoji: '👵' },
          { id: 'p-nonno', glyph: 'nonno', say: 'nonno', emoji: '👴' },
          { id: 'p-bimbo', glyph: 'bimbo', say: 'bimbo', emoji: '👶' },
          { id: 'p-casa',  glyph: 'casa',  say: 'casa',  emoji: '🏠' },
        ],
      },
      {
        id: 'animali', titolo: 'Animali', emoji: '🐾',
        items: [
          { id: 'p-cane',    glyph: 'cane',    say: 'cane',    emoji: '🐶' },
          { id: 'p-gatto',   glyph: 'gatto',   say: 'gatto',   emoji: '🐱' },
          { id: 'p-pesce',   glyph: 'pesce',   say: 'pesce',   emoji: '🐟' },
          { id: 'p-uccello', glyph: 'uccello', say: 'uccello', emoji: '🐦' },
          { id: 'p-mucca',   glyph: 'mucca',   say: 'mucca',   emoji: '🐮' },
          { id: 'p-cavallo', glyph: 'cavallo', say: 'cavallo', emoji: '🐴' },
        ],
      },
      {
        id: 'cibo', titolo: 'Cibo', emoji: '🍽️',
        items: [
          { id: 'p-mela',   glyph: 'mela',   say: 'mela',   emoji: '🍎' },
          { id: 'p-banana', glyph: 'banana', say: 'banana', emoji: '🍌' },
          { id: 'p-pane',   glyph: 'pane',   say: 'pane',   emoji: '🍞' },
          { id: 'p-latte',  glyph: 'latte',  say: 'latte',  emoji: '🥛' },
          { id: 'p-acqua',  glyph: 'acqua',  say: 'acqua',  emoji: '💧' },
          { id: 'p-pizza',  glyph: 'pizza',  say: 'pizza',  emoji: '🍕' },
        ],
      },
      {
        id: 'oggetti', titolo: 'Oggetti', emoji: '🧸',
        items: [
          { id: 'p-palla',  glyph: 'palla',  say: 'palla',  emoji: '⚽' },
          { id: 'p-libro',  glyph: 'libro',  say: 'libro',  emoji: '📖' },
          { id: 'p-letto',  glyph: 'letto',  say: 'letto',  emoji: '🛏️' },
          { id: 'p-sedia',  glyph: 'sedia',  say: 'sedia',  emoji: '🪑' },
          { id: 'p-scarpe', glyph: 'scarpe', say: 'scarpe', emoji: '👟' },
          { id: 'p-orso',   glyph: 'orso',   say: 'orso',    emoji: '🧸' },
        ],
      },
    ],
  },

  inglese: {
    id: 'inglese',
    titolo: 'Inglese',
    emoji: '🇬🇧',
    colore: 'rosa',
    categorie: [
      {
        id: 'famiglia', titolo: 'Famiglia', emoji: '👪',
        items: [
          { id: 'e-mum',     glyph: 'Mum',     say: 'mum',     emoji: '👩' },
          { id: 'e-dad',     glyph: 'Dad',     say: 'dad',     emoji: '👨' },
          { id: 'e-grandma', glyph: 'Grandma', say: 'grandma', emoji: '👵' },
          { id: 'e-grandpa', glyph: 'Grandpa', say: 'grandpa', emoji: '👴' },
          { id: 'e-brother', glyph: 'Brother', say: 'brother', emoji: '👦' },
          { id: 'e-sister',  glyph: 'Sister',  say: 'sister',  emoji: '👧' },
          { id: 'e-baby',    glyph: 'Baby',    say: 'baby',    emoji: '👶' },
        ],
      },
    ],
  },

  sillabe: {
    id: 'sillabe',
    titolo: 'Sillabe',
    emoji: '🧩',
    colore: 'turchese',
    /* Ogni sillaba ha un PICCOLO POOL di parole possibili (non una sola):
       a ogni ingresso nel gioco (vaiSillabeGioco, js/app.js) se ne pesca
       una a caso per sillaba, così il gruppo non è sempre lo stesso pur
       restando sulla stessa lettera. */
    gruppi: [
      { id: 'b', lettera: 'B', sillabe: ['ba', 'be', 'bi', 'bo', 'bu'], vocaboli: {
        ba: [
          { id: 's-banana',  resto: 'nana',  completa: 'banana',  emoji: '🍌' },
          { id: 's-balena',  resto: 'lena',  completa: 'balena',  emoji: '🐳' },
        ],
        be: [
          { id: 's-befana',    resto: 'fana',    completa: 'befana',    emoji: '🧹' },
          { id: 's-berretto',  resto: 'rretto',  completa: 'berretto',  emoji: '🧢' },
        ],
        bi: [
          { id: 's-bici',      resto: 'ci',      completa: 'bici',      emoji: '🚲' },
          { id: 's-biscotto',  resto: 'scotto',  completa: 'biscotto',  emoji: '🍪' },
          { id: 's-bimbo',     resto: 'mbo',     completa: 'bimbo',     emoji: '👶' },
        ],
        bo: [
          { id: 's-bottiglia', resto: 'ttiglia', completa: 'bottiglia', emoji: '🍾' },
          { id: 's-bosco',     resto: 'sco',      completa: 'bosco',     emoji: '🌲' },
          { id: 's-bocca',     resto: 'cca',      completa: 'bocca',     emoji: '👄' },
        ],
        bu: [
          { id: 's-busta',     resto: 'sta',      completa: 'busta',     emoji: '✉️' },
          { id: 's-buco',      resto: 'co',       completa: 'buco',      emoji: '🕳️' },
          { id: 's-burro',     resto: 'rro',      completa: 'burro',     emoji: '🧈' },
        ],
      } },
      { id: 'c', lettera: 'C', sillabe: ['ca', 'ce', 'ci', 'co', 'cu'], vocaboli: {
        ca: [
          { id: 's-casa',      resto: 'sa',      completa: 'casa',      emoji: '🏠' },
          { id: 's-cane',      resto: 'ne',      completa: 'cane',      emoji: '🐶' },
          { id: 's-cappello',  resto: 'ppello',  completa: 'cappello',  emoji: '🎩' },
        ],
        ce: [
          { id: 's-cesto',     resto: 'sto',     completa: 'cesto',     emoji: '🧺' },
          { id: 's-cerchio',   resto: 'rchio',   completa: 'cerchio',   emoji: '⭕' },
        ],
        ci: [
          { id: 's-ciliegia',  resto: 'liegia',  completa: 'ciliegia',  emoji: '🍒' },
          { id: 's-cinque',    resto: 'nque',    completa: 'cinque',    emoji: '5️⃣' },
        ],
        co: [
          { id: 's-coniglio',  resto: 'niglio',  completa: 'coniglio',  emoji: '🐰' },
          { id: 's-cocco',     resto: 'cco',     completa: 'cocco',     emoji: '🥥' },
          { id: 's-corona',    resto: 'rona',    completa: 'corona',    emoji: '👑' },
        ],
        cu: [
          { id: 's-cuore',     resto: 'ore',     completa: 'cuore',     emoji: '❤️' },
          { id: 's-cuoco',     resto: 'oco',     completa: 'cuoco',     emoji: '👨‍🍳' },
        ],
      } },
      { id: 'f', lettera: 'F', sillabe: ['fa', 'fe', 'fi', 'fo', 'fu'], vocaboli: {
        fa: [
          { id: 's-farfalla',  resto: 'rfalla',  completa: 'farfalla',  emoji: '🦋' },
          { id: 's-fata',      resto: 'ta',      completa: 'fata',      emoji: '🧚' },
        ],
        fe: [
          { id: 's-festa',     resto: 'sta',     completa: 'festa',     emoji: '🎉' },
          { id: 's-fetta',     resto: 'tta',     completa: 'fetta',     emoji: '🍰' },
        ],
        fi: [
          { id: 's-fiore',     resto: 'ore',     completa: 'fiore',     emoji: '🌸' },
          { id: 's-figlio',    resto: 'glio',    completa: 'figlio',    emoji: '👦' },
        ],
        fo: [
          { id: 's-foca',      resto: 'ca',      completa: 'foca',      emoji: '🦭' },
          { id: 's-foglia',    resto: 'glia',    completa: 'foglia',    emoji: '🍃' },
          { id: 's-fontana',   resto: 'ntana',   completa: 'fontana',   emoji: '⛲' },
        ],
        fu: [
          { id: 's-fungo',     resto: 'ngo',     completa: 'fungo',     emoji: '🍄' },
          { id: 's-fuoco',     resto: 'oco',     completa: 'fuoco',     emoji: '🔥' },
          { id: 's-fumo',      resto: 'mo',      completa: 'fumo',      emoji: '💨' },
        ],
      } },
      { id: 'm', lettera: 'M', sillabe: ['ma', 'me', 'mi', 'mo', 'mu'], vocaboli: {
        ma: [
          { id: 's-mano',      resto: 'no',      completa: 'mano',      emoji: '✋' },
          { id: 's-mare',      resto: 're',      completa: 'mare',      emoji: '🌊' },
          { id: 's-maglia',    resto: 'glia',    completa: 'maglia',    emoji: '👕' },
        ],
        me: [
          { id: 's-mela',      resto: 'la',      completa: 'mela',      emoji: '🍎' },
          { id: 's-melone',    resto: 'lone',    completa: 'melone',    emoji: '🍈' },
        ],
        mi: [
          { id: 's-miele',     resto: 'ele',     completa: 'miele',     emoji: '🍯' },
          { id: 's-mimosa',    resto: 'mosa',    completa: 'mimosa',    emoji: '🌼' },
        ],
        mo: [
          { id: 's-moto',      resto: 'to',      completa: 'moto',      emoji: '🏍️' },
          { id: 's-monte',     resto: 'nte',     completa: 'monte',     emoji: '⛰️' },
          { id: 's-moneta',    resto: 'neta',    completa: 'moneta',    emoji: '🪙' },
        ],
        mu: [
          { id: 's-mucca',     resto: 'cca',     completa: 'mucca',     emoji: '🐮' },
          { id: 's-muro',      resto: 'ro',      completa: 'muro',      emoji: '🧱' },
        ],
      } },
      { id: 's', lettera: 'S', sillabe: ['sa', 'se', 'si', 'so', 'su'], vocaboli: {
        sa: [
          { id: 's-sale',      resto: 'le',      completa: 'sale',      emoji: '🧂' },
          { id: 's-sasso',     resto: 'sso',     completa: 'sasso',     emoji: '🪨' },
        ],
        se: [
          { id: 's-sedia',     resto: 'dia',     completa: 'sedia',     emoji: '🪑' },
          { id: 's-serpente',  resto: 'rpente',  completa: 'serpente',  emoji: '🐍' },
        ],
        si: [
          { id: 's-sirena',    resto: 'rena',    completa: 'sirena',    emoji: '🧜‍♀️' },
        ],
        so: [
          { id: 's-sole',      resto: 'le',      completa: 'sole',      emoji: '☀️' },
          { id: 's-sogno',     resto: 'gno',     completa: 'sogno',     emoji: '💭' },
        ],
        su: [
          { id: 's-succo',     resto: 'cco',     completa: 'succo',     emoji: '🧃' },
          { id: 's-suono',     resto: 'ono',     completa: 'suono',     emoji: '🔊' },
        ],
      } },
    ],
  },

  forme: {
    id: 'forme',
    titolo: 'Forme e Figure',
    emoji: '🔷',
    /* Legenda fissa: ogni figura è fatta SOLO con queste 4 combinazioni
       tipo+colore, come nel foglio cartaceo di riferimento. I conteggi
       corretti si calcolano a runtime dalle "forme" di ogni figura
       (js/app.js, vaiForme) — non sono mai scritti a mano, così non
       possono disallinearsi dal disegno. */
    legenda: [
      { tipo: 'cerchio',    colore: 'giallo', nome: 'cerchi gialli' },
      { tipo: 'triangolo',  colore: 'blu',    nome: 'triangoli blu' },
      { tipo: 'rettangolo', colore: 'verde',  nome: 'rettangoli verdi' },
      { tipo: 'quadrato',   colore: 'rosso',  nome: 'quadrati rossi' },
    ],
    figure: [
      { id: 'razzo', viewBox: '0 0 240 300', forme: [
        { tipo: 'rettangolo', colore: 'verde',  x: 90, y: 100, w: 60, h: 140 },
        { tipo: 'triangolo',  colore: 'blu',    punti: '90,100 150,100 120,40' },
        { tipo: 'cerchio',    colore: 'giallo', cx: 120, cy: 140, r: 14 },
        { tipo: 'cerchio',    colore: 'giallo', cx: 120, cy: 180, r: 14 },
        { tipo: 'cerchio',    colore: 'giallo', cx: 120, cy: 220, r: 14 },
        { tipo: 'quadrato',   colore: 'rosso',  x: 60, y: 210, w: 30, h: 30 },
        { tipo: 'quadrato',   colore: 'rosso',  x: 150, y: 210, w: 30, h: 30 },
      ] },
      { id: 'trenino', viewBox: '0 0 320 200', forme: [
        { tipo: 'rettangolo', colore: 'verde',  x: 20, y: 80, w: 90, h: 70 },
        { tipo: 'rettangolo', colore: 'verde',  x: 120, y: 80, w: 90, h: 70 },
        { tipo: 'quadrato',   colore: 'rosso',  x: 220, y: 60, w: 70, h: 90 },
        { tipo: 'cerchio',    colore: 'giallo', cx: 45, cy: 165, r: 14 },
        { tipo: 'cerchio',    colore: 'giallo', cx: 95, cy: 165, r: 14 },
        { tipo: 'cerchio',    colore: 'giallo', cx: 145, cy: 165, r: 14 },
        { tipo: 'cerchio',    colore: 'giallo', cx: 195, cy: 165, r: 14 },
        { tipo: 'triangolo',  colore: 'blu',    punti: '35,80 55,80 45,55' },
        { tipo: 'triangolo',  colore: 'blu',    punti: '135,80 155,80 145,55' },
      ] },
      { id: 'casetta', viewBox: '0 0 240 240', forme: [
        { tipo: 'quadrato',   colore: 'rosso',  x: 60, y: 110, w: 120, h: 100 },
        { tipo: 'triangolo',  colore: 'blu',    punti: '50,110 190,110 120,50' },
        { tipo: 'rettangolo', colore: 'verde',  x: 105, y: 160, w: 30, h: 50 },
        { tipo: 'cerchio',    colore: 'giallo', cx: 85, cy: 140, r: 16 },
        { tipo: 'cerchio',    colore: 'giallo', cx: 155, cy: 140, r: 16 },
      ] },
    ],
  },

  problemi: {
    id: 'problemi',
    titolo: 'Problemi',
    emoji: '➕',
    /* Il risultato non è mai scritto a mano: si calcola da a/op/b a
       runtime (js/app.js, vaiProblemi). Sottrazioni sempre con b <= a,
       risultati sempre nell'intervallo 0-10 (coerente col range insegnato
       in Numeri). */
    elenco: [
      { id: 'pr-veicoli',    op: '+', a: 3, b: 4, emojiA: '🚗', emojiB: '🏍️',
        testo: 'In un parcheggio ci sono {a} automobili e {b} motociclette. Quanti veicoli ci sono in tutto?' },
      { id: 'pr-mele',       op: '-', a: 7, b: 2, emojiA: '🍎',
        testo: 'Ci sono {a} mele. Ne mangi {b}. Quante mele restano?' },
      { id: 'pr-animali',    op: '+', a: 4, b: 2, emojiA: '🐱', emojiB: '🐶',
        testo: 'In giardino ci sono {a} gatti e {b} cani. Quanti animali ci sono in tutto?' },
      { id: 'pr-caramelle',  op: '-', a: 9, b: 4, emojiA: '🍬',
        testo: 'Hai {a} caramelle. Ne mangi {b}. Quante caramelle restano?' },
      { id: 'pr-uccellini',  op: '-', a: 6, b: 2, emojiA: '🐦',
        testo: 'Ci sono {a} uccellini su un ramo. {b} volano via. Quanti uccellini restano?' },
      { id: 'pr-palline',    op: '+', a: 2, b: 5, emojiA: '⚽', emojiB: '🎾',
        testo: 'Nel cesto ci sono {a} palloni e {b} palline. Quanti oggetti ci sono in tutto?' },
      { id: 'pr-fiori',      op: '+', a: 5, b: 3, emojiA: '🌹', emojiB: '🌻',
        testo: 'In giardino ci sono {a} rose e {b} girasoli. Quanti fiori ci sono in tutto?' },
      { id: 'pr-biscotti',   op: '-', a: 8, b: 3, emojiA: '🍪',
        testo: 'Ci sono {a} biscotti nel piatto. Ne mangi {b}. Quanti biscotti restano?' },
      { id: 'pr-palloncini', op: '+', a: 6, b: 2, emojiA: '🎈', emojiB: '🎈',
        testo: 'Ci sono {a} palloncini alla festa. Ne arrivano altri {b}. Quanti palloncini ci sono adesso?' },
      { id: 'pr-pesci',      op: '-', a: 10, b: 4, emojiA: '🐟',
        testo: "Nell'acquario ci sono {a} pesci. {b} vengono spostati in un altro acquario. Quanti pesci restano?" },
    ],
  },
};

/* Frasi di rinforzo positivo e di incoraggiamento (mai punitive).
   Le lodi hanno la versione maschile e femminile; il nome e il genere
   vengono aggiunti da app.js in base al bambino. */
const LODI_M = ['Bravo', 'Bravissimo', 'Che bravo', 'Sei bravissimo', 'Super bravo'];
const LODI_F = ['Brava', 'Bravissima', 'Che brava', 'Sei bravissima', 'Super brava'];
const LODI_NEUTRE = ['Sì, evviva', 'Ottimo lavoro', 'Perfetto', 'Fantastico', 'Wow, che bello', 'Grande', 'Benissimo', 'Uau, che forza'];
const INCORAGGIAMENTI = ['Quasi! Prova ancora.', 'Riprova, ce la fai!', 'Ancora un tentativo!', 'Ci sei quasi!', 'Dai, prova di nuovo!'];

/* Elementi facili da confondere: usati come distrattori "insidiosi" ai livelli
   di difficoltà alti (adattiva). Chiavi: il glifo del bersaglio (le lettere in
   minuscolo). Se il set non basta, i distrattori si completano a caso. */
const SIMILI_NUMERI = {
  '1': ['7', '4'], '2': ['3', '7'], '3': ['8', '5'], '4': ['1', '9'],
  '5': ['6', '3'], '6': ['9', '8'], '7': ['1', '4'], '8': ['3', '6'],
  '9': ['6', '4'], '10': ['1', '6'],
};

const SIMILI_LETTERE = {
  a: ['o', 'e'], b: ['d', 'p'], c: ['o', 'g', 'e'], d: ['b', 'p'],
  e: ['f', 'c', 'a'], f: ['e', 't'], g: ['c', 'q', 'o'], h: ['n', 'b'],
  i: ['l', 't'], l: ['i', 't'], m: ['n', 'u'], n: ['m', 'h', 'u'],
  o: ['c', 'a', 'q'], p: ['q', 'b'], q: ['p', 'o', 'g'], r: ['n', 'p'],
  s: ['z', 'c'], t: ['f', 'l'], u: ['v', 'n'], v: ['u', 'y'], z: ['s', 'n'],
};
