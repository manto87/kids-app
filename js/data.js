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
    items: [
      { id: 'lA', glyph: 'A', say: 'a',    parola: 'Ape',      emoji: '🐝' },
      { id: 'lB', glyph: 'B', say: 'bi',   parola: 'Barca',    emoji: '⛵' },
      { id: 'lC', glyph: 'C', say: 'ci',   parola: 'Cane',     emoji: '🐶' },
      { id: 'lD', glyph: 'D', say: 'di',   parola: 'Dado',     emoji: '🎲' },
      { id: 'lE', glyph: 'E', say: 'e',    parola: 'Elefante', emoji: '🐘' },
      { id: 'lF', glyph: 'F', say: 'effe', parola: 'Fiore',    emoji: '🌸' },
      { id: 'lG', glyph: 'G', say: 'gi',   parola: 'Gatto',    emoji: '🐱' },
      { id: 'lH', glyph: 'H', say: 'acca', parola: 'Hotel',    emoji: '🏨' },
      { id: 'lI', glyph: 'I', say: 'i',    parola: 'Isola',    emoji: '🏝️' },
      { id: 'lL', glyph: 'L', say: 'elle', parola: 'Luna',     emoji: '🌙' },
      { id: 'lM', glyph: 'M', say: 'emme', parola: 'Mela',     emoji: '🍎' },
      { id: 'lN', glyph: 'N', say: 'enne', parola: 'Nave',     emoji: '🚢' },
      { id: 'lO', glyph: 'O', say: 'o',    parola: 'Orso',     emoji: '🐻' },
      { id: 'lP', glyph: 'P', say: 'pi',   parola: 'Palla',    emoji: '⚽' },
      { id: 'lQ', glyph: 'Q', say: 'cu',   parola: 'Quadro',   emoji: '🖼️' },
      { id: 'lR', glyph: 'R', say: 'erre', parola: 'Rana',     emoji: '🐸' },
      { id: 'lS', glyph: 'S', say: 'esse', parola: 'Sole',     emoji: '☀️' },
      { id: 'lT', glyph: 'T', say: 'ti',   parola: 'Treno',    emoji: '🚂' },
      { id: 'lU', glyph: 'U', say: 'u',    parola: 'Uva',      emoji: '🍇' },
      { id: 'lV', glyph: 'V', say: 'vu',   parola: 'Vulcano',  emoji: '🌋' },
      { id: 'lZ', glyph: 'Z', say: 'zeta', parola: 'Zaino',    emoji: '🎒' },
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
