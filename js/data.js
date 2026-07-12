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
    gruppi: [
      { id: 'b', lettera: 'B', sillabe: ['ba', 'be', 'bi', 'bo', 'bu'], parole: [
        { id: 's-banana',    sillaba: 'ba', resto: 'nana',    completa: 'banana',    emoji: '🍌' },
        { id: 's-befana',    sillaba: 'be', resto: 'fana',    completa: 'befana',    emoji: '🧹' },
        { id: 's-bici',      sillaba: 'bi', resto: 'ci',      completa: 'bici',      emoji: '🚲' },
        { id: 's-bottiglia', sillaba: 'bo', resto: 'ttiglia', completa: 'bottiglia', emoji: '🍾' },
        { id: 's-busta',     sillaba: 'bu', resto: 'sta',     completa: 'busta',     emoji: '✉️' },
      ] },
      { id: 'c', lettera: 'C', sillabe: ['ca', 'ce', 'ci', 'co', 'cu'], parole: [
        { id: 's-casa',      sillaba: 'ca', resto: 'sa',      completa: 'casa',      emoji: '🏠' },
        { id: 's-cesto',     sillaba: 'ce', resto: 'sto',     completa: 'cesto',     emoji: '🧺' },
        { id: 's-ciliegia',  sillaba: 'ci', resto: 'liegia',  completa: 'ciliegia',  emoji: '🍒' },
        { id: 's-coniglio',  sillaba: 'co', resto: 'niglio',  completa: 'coniglio',  emoji: '🐰' },
        { id: 's-cuore',     sillaba: 'cu', resto: 'ore',     completa: 'cuore',     emoji: '❤️' },
      ] },
      { id: 'f', lettera: 'F', sillabe: ['fa', 'fe', 'fi', 'fo', 'fu'], parole: [
        { id: 's-farfalla',  sillaba: 'fa', resto: 'rfalla',  completa: 'farfalla',  emoji: '🦋' },
        { id: 's-festa',     sillaba: 'fe', resto: 'sta',     completa: 'festa',     emoji: '🎉' },
        { id: 's-fiore',     sillaba: 'fi', resto: 'ore',     completa: 'fiore',     emoji: '🌸' },
        { id: 's-foca',      sillaba: 'fo', resto: 'ca',      completa: 'foca',      emoji: '🦭' },
        { id: 's-fungo',     sillaba: 'fu', resto: 'ngo',     completa: 'fungo',     emoji: '🍄' },
      ] },
      { id: 'm', lettera: 'M', sillabe: ['ma', 'me', 'mi', 'mo', 'mu'], parole: [
        { id: 's-mano',      sillaba: 'ma', resto: 'no',      completa: 'mano',      emoji: '✋' },
        { id: 's-mela',      sillaba: 'me', resto: 'la',      completa: 'mela',      emoji: '🍎' },
        { id: 's-miele',     sillaba: 'mi', resto: 'ele',     completa: 'miele',     emoji: '🍯' },
        { id: 's-moto',      sillaba: 'mo', resto: 'to',      completa: 'moto',      emoji: '🏍️' },
        { id: 's-mucca',     sillaba: 'mu', resto: 'cca',     completa: 'mucca',     emoji: '🐮' },
      ] },
      { id: 's', lettera: 'S', sillabe: ['sa', 'se', 'si', 'so', 'su'], parole: [
        { id: 's-sale',      sillaba: 'sa', resto: 'le',      completa: 'sale',      emoji: '🧂' },
        { id: 's-sedia',     sillaba: 'se', resto: 'dia',     completa: 'sedia',     emoji: '🪑' },
        { id: 's-sirena',    sillaba: 'si', resto: 'rena',    completa: 'sirena',    emoji: '🧜‍♀️' },
        { id: 's-sole',      sillaba: 'so', resto: 'le',      completa: 'sole',      emoji: '☀️' },
        { id: 's-succo',     sillaba: 'su', resto: 'cco',     completa: 'succo',     emoji: '🧃' },
      ] },
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
