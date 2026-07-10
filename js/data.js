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
       con difficoltà di apprendimento): "mmm" invece di "emme", "fff"
       invece di "effe". Le consonanti che si possono "allungare" (m, n, f,
       l, r, s, v, z) si scrivono ripetute per farle pronunciare così dalla
       sintesi vocale; le occlusive (b, c, d, g, p, q, t) restano una sola
       lettera perché non sono prolungabili — la resa dipende un po' dalla
       voce del dispositivo. La H è muta, si insegna il nome perché un
       suono da insegnare non c'è. */
    items: [
      { id: 'lA', glyph: 'A', say: 'a',    suono: 'a',    parola: 'Ape',      emoji: '🐝' },
      { id: 'lB', glyph: 'B', say: 'bi',   suono: 'b',    parola: 'Barca',    emoji: '⛵' },
      { id: 'lC', glyph: 'C', say: 'ci',   suono: 'c',    parola: 'Cane',     emoji: '🐶' },
      { id: 'lD', glyph: 'D', say: 'di',   suono: 'd',    parola: 'Dado',     emoji: '🎲' },
      { id: 'lE', glyph: 'E', say: 'e',    suono: 'e',    parola: 'Elefante', emoji: '🐘' },
      { id: 'lF', glyph: 'F', say: 'effe', suono: 'fff',  parola: 'Fiore',    emoji: '🌸' },
      { id: 'lG', glyph: 'G', say: 'gi',   suono: 'g',    parola: 'Gatto',    emoji: '🐱' },
      { id: 'lH', glyph: 'H', say: 'acca', suono: 'acca', parola: 'Hotel',    emoji: '🏨' },
      { id: 'lI', glyph: 'I', say: 'i',    suono: 'i',    parola: 'Isola',    emoji: '🏝️' },
      { id: 'lL', glyph: 'L', say: 'elle', suono: 'lll',  parola: 'Luna',     emoji: '🌙' },
      { id: 'lM', glyph: 'M', say: 'emme', suono: 'mmm',  parola: 'Mela',     emoji: '🍎' },
      { id: 'lN', glyph: 'N', say: 'enne', suono: 'nnn',  parola: 'Nave',     emoji: '🚢' },
      { id: 'lO', glyph: 'O', say: 'o',    suono: 'o',    parola: 'Orso',     emoji: '🐻' },
      { id: 'lP', glyph: 'P', say: 'pi',   suono: 'p',    parola: 'Palla',    emoji: '⚽' },
      { id: 'lQ', glyph: 'Q', say: 'cu',   suono: 'q',    parola: 'Quadro',   emoji: '🖼️' },
      { id: 'lR', glyph: 'R', say: 'erre', suono: 'rrr',  parola: 'Rana',     emoji: '🐸' },
      { id: 'lS', glyph: 'S', say: 'esse', suono: 'sss',  parola: 'Sole',     emoji: '☀️' },
      { id: 'lT', glyph: 'T', say: 'ti',   suono: 't',    parola: 'Treno',    emoji: '🚂' },
      { id: 'lU', glyph: 'U', say: 'u',    suono: 'u',    parola: 'Uva',      emoji: '🍇' },
      { id: 'lV', glyph: 'V', say: 'vu',   suono: 'vvv',  parola: 'Vulcano',  emoji: '🌋' },
      { id: 'lZ', glyph: 'Z', say: 'zeta', suono: 'zzz',  parola: 'Zaino',    emoji: '🎒' },
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
          { id: 'p-orso',   glyph: 'orso',   say: 'orsetto', emoji: '🧸' },
        ],
      },
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
