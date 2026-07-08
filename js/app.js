/* ============================================================
   Impara con Me — logica dell'app.
   Navigazione a schermate semplici: una sola azione per volta,
   pulsante "casa" sempre nella stessa posizione.
   ============================================================ */

(function () {
  'use strict';

  const app = document.getElementById('app');

  /* ---------- impostazioni (area genitori), salvate sul dispositivo ---------- */

  const IMPOSTAZIONI_DEFAULT = {
    numScelte: 2,        // scelte nel gioco: 2 = più facile
    maiuscole: true,     // lettere/parole in MAIUSCOLO (più leggibili all'inizio)
    velocita: 0.75,      // velocità della voce (lenta)
    audio: true,
  };

  let impostazioni = caricaImpostazioni();

  function caricaImpostazioni() {
    try {
      return { ...IMPOSTAZIONI_DEFAULT, ...JSON.parse(localStorage.getItem('impostazioni') || '{}') };
    } catch {
      return { ...IMPOSTAZIONI_DEFAULT };
    }
  }

  function salvaImpostazioni() {
    try { localStorage.setItem('impostazioni', JSON.stringify(impostazioni)); } catch {}
  }

  /* ---------- sintesi vocale (voce italiana, lenta e chiara) ---------- */

  let voceItaliana = null;

  function scegliVoce() {
    if (!('speechSynthesis' in window)) return;
    const voci = speechSynthesis.getVoices();
    voceItaliana = voci.find(v => v.lang === 'it-IT') || voci.find(v => v.lang.startsWith('it')) || null;
  }

  if ('speechSynthesis' in window) {
    scegliVoce();
    speechSynthesis.onvoiceschanged = scegliVoce;
  }

  function parla(testo, opzioni = {}) {
    if (!impostazioni.audio || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(testo);
    u.lang = 'it-IT';
    if (voceItaliana) u.voice = voceItaliana;
    u.rate = opzioni.rate || impostazioni.velocita;
    u.pitch = 1.05;
    speechSynthesis.speak(u);
  }

  function casuale(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  }

  function mostraTesto(testo) {
    return impostazioni.maiuscole ? testo.toUpperCase() : testo.toLowerCase();
  }

  /* ---------- struttura comune delle schermate ---------- */

  function render(html) {
    app.innerHTML = html;
    app.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  /* Barra superiore: casa a sinistra, titolo al centro,
     a destra il pulsante genitori (solo in home) o il ripeti-audio. */
  function barra(titolo, opzioni = {}) {
    const sinistra = opzioni.home
      ? `<button class="btn-tondo btn-genitori" id="btn-genitori" aria-label="Area genitori (tieni premuto)">⚙️<span class="anello" id="anello-genitori"></span></button>`
      : `<button class="btn-tondo" id="btn-casa" aria-label="Torna alla pagina iniziale">🏠</button>`;
    return `
      <div class="barra">
        ${sinistra}
        <div class="titolo-schermata">${titolo}</div>
        <div style="width:68px"></div>
      </div>`;
  }

  /* Il pulsante 🏠 porta SEMPRE alla pagina iniziale: un solo
     comportamento, sempre uguale, facile da prevedere. */
  function collegaCasa() {
    const btn = document.getElementById('btn-casa');
    if (btn) btn.addEventListener('click', () => vaiHome());
  }

  /* ---------- HOME ---------- */

  function vaiHome() {
    render(`
      ${barra('', { home: true })}
      <div class="home-testata">
        <div class="logo">🌈</div>
        <h1>Impara con Me</h1>
      </div>
      <div class="menu-moduli">
        <button class="btn-modulo blu" id="vai-numeri"><span class="emoji">🔢</span> Numeri</button>
        <button class="btn-modulo verde" id="vai-lettere"><span class="emoji">🔤</span> Lettere</button>
        <button class="btn-modulo arancio" id="vai-parole"><span class="emoji">🗣️</span> Parole</button>
      </div>
    `);

    document.getElementById('vai-numeri').addEventListener('click', () => { parla('Numeri!'); vaiModulo('numeri'); });
    document.getElementById('vai-lettere').addEventListener('click', () => { parla('Lettere!'); vaiModulo('lettere'); });
    document.getElementById('vai-parole').addEventListener('click', () => { parla('Parole!'); vaiCategorie(); });

    collegaGenitori();
  }

  /* Il pulsante genitori si apre solo tenendolo premuto 2 secondi:
     così il bambino non ci entra per sbaglio. */
  function collegaGenitori() {
    const btn = document.getElementById('btn-genitori');
    const anello = document.getElementById('anello-genitori');
    let timer = null;
    let inizio = 0;
    let animazione = null;

    const parti = (e) => {
      e.preventDefault();
      inizio = Date.now();
      animazione = setInterval(() => {
        const frazione = Math.min((Date.now() - inizio) / 2000, 1);
        anello.style.clipPath = `inset(0 ${100 - frazione * 100}% 0 0)`;
      }, 50);
      timer = setTimeout(() => { ferma(); vaiGenitori(); }, 2000);
    };

    const ferma = () => {
      clearTimeout(timer);
      clearInterval(animazione);
      anello.style.clipPath = 'inset(0 100% 0 0)';
    };

    btn.addEventListener('pointerdown', parti);
    btn.addEventListener('pointerup', ferma);
    btn.addEventListener('pointerleave', ferma);
    btn.addEventListener('pointercancel', ferma);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  /* ---------- MODULO: griglia di numeri o lettere ---------- */

  function vaiModulo(idModulo) {
    const modulo = DATA[idModulo];
    const carte = modulo.items.map((item, i) => {
      const glifo = idModulo === 'lettere' ? mostraTesto(item.glyph) : item.glyph;
      return `<button class="carta" data-i="${i}" aria-label="${item.say}">
                <span class="glifo">${glifo}</span>
                <span class="mini">${item.emoji}</span>
              </button>`;
    }).join('');

    render(`
      ${barra(`${modulo.emoji} ${modulo.titolo}`)}
      <div class="stelle"></div>
      <div class="modulo-${modulo.colore}">
        <div class="griglia">${carte}</div>
      </div>
      <button class="btn-modulo viola" id="vai-gioco" style="margin-bottom:16px">
        <span class="emoji">🎮</span> Gioca
      </button>
    `);

    collegaCasa();
    app.querySelectorAll('.carta').forEach(carta => {
      carta.addEventListener('click', () => {
        vaiDettaglio(idModulo, modulo.items, Number(carta.dataset.i), () => vaiModulo(idModulo));
      });
    });
    document.getElementById('vai-gioco').addEventListener('click', () => {
      vaiGioco(idModulo, modulo.items, () => vaiModulo(idModulo));
    });
  }

  /* ---------- PAROLE: prima le categorie, poi le parole ---------- */

  function vaiCategorie() {
    const carte = DATA.parole.categorie.map(cat => `
      <button class="btn-modulo arancio" data-cat="${cat.id}">
        <span class="emoji">${cat.emoji}</span> ${cat.titolo}
      </button>`).join('');

    render(`
      ${barra('🗣️ Parole')}
      <div class="menu-moduli" style="justify-content:center">${carte}</div>
    `);

    collegaCasa();
    app.querySelectorAll('[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = DATA.parole.categorie.find(c => c.id === btn.dataset.cat);
        parla(cat.titolo);
        vaiCategoria(cat);
      });
    });
  }

  function vaiCategoria(cat) {
    const carte = cat.items.map((item, i) => `
      <button class="carta" data-i="${i}" aria-label="${item.say}">
        <span class="glifo">${item.emoji}</span>
        <span class="mini">${mostraTesto(item.glyph)}</span>
      </button>`).join('');

    render(`
      ${barra(`${cat.emoji} ${cat.titolo}`)}
      <div class="stelle"></div>
      <div class="modulo-arancio">
        <div class="griglia">${carte}</div>
      </div>
      <button class="btn-modulo viola" id="vai-gioco" style="margin-bottom:16px">
        <span class="emoji">🎮</span> Gioca
      </button>
    `);

    collegaCasa();
    app.querySelectorAll('.carta').forEach(carta => {
      carta.addEventListener('click', () => {
        vaiDettaglio('parole', cat.items, Number(carta.dataset.i), () => vaiCategoria(cat));
      });
    });
    document.getElementById('vai-gioco').addEventListener('click', () => {
      vaiGioco('parole', cat.items, () => vaiCategoria(cat));
    });
  }

  /* ---------- DETTAGLIO: una cosa sola, grande, con audio ---------- */

  function vaiDettaglio(idModulo, items, indice, indietro) {
    const item = items[indice];
    let contenuto = '';
    let daDire = '';

    if (idModulo === 'numeri') {
      contenuto = `
        <div class="glifone">${item.glyph}</div>
        <div class="conteggio">${Array(item.count).fill(item.emoji).join(' ')}</div>
        <div class="sotto">${mostraTesto(item.say)}</div>`;
      daDire = item.say;
    } else if (idModulo === 'lettere') {
      contenuto = `
        <div class="glifone">${item.glyph} ${item.glyph.toLowerCase()}</div>
        <div class="figura">${item.emoji}</div>
        <div class="sotto">${mostraTesto(item.parola)}</div>`;
      daDire = `${item.say}. ${item.glyph} come ${item.parola}`;
    } else {
      contenuto = `
        <div class="figura">${item.emoji}</div>
        <div class="glifone parola">${mostraTesto(item.glyph)}</div>`;
      daDire = item.say;
    }

    render(`
      ${barra('')}
      <div class="dettaglio" id="zona-dettaglio">${contenuto}</div>
      <div class="nav-dettaglio">
        <button class="btn-tondo" id="btn-prima" aria-label="Precedente" ${indice === 0 ? 'style="visibility:hidden"' : ''}>⬅️</button>
        <button class="btn-tondo btn-audio" id="btn-ripeti" aria-label="Ascolta di nuovo">🔊</button>
        <button class="btn-tondo" id="btn-dopo" aria-label="Successivo" ${indice === items.length - 1 ? 'style="visibility:hidden"' : ''}>➡️</button>
      </div>
    `);

    collegaCasa();
    parla(daDire);

    document.getElementById('btn-ripeti').addEventListener('click', () => parla(daDire));
    document.getElementById('zona-dettaglio').addEventListener('click', () => parla(daDire));
    const prima = document.getElementById('btn-prima');
    const dopo = document.getElementById('btn-dopo');
    if (indice > 0) prima.addEventListener('click', () => vaiDettaglio(idModulo, items, indice - 1, indietro));
    if (indice < items.length - 1) dopo.addEventListener('click', () => vaiDettaglio(idModulo, items, indice + 1, indietro));
  }

  /* ---------- GIOCO "ASCOLTA E TROVA" ----------
     Nessun tempo limite, nessuna penalità: la risposta sbagliata
     si spegne con dolcezza e si può riprovare subito. */

  const STELLE_PER_VINCERE = 5;

  function vaiGioco(idModulo, pool, indietro, stelle = 0) {
    if (stelle >= STELLE_PER_VINCERE) {
      vaiFesta(idModulo, pool, indietro);
      return;
    }

    const bersaglio = casuale(pool);
    const distrattori = [];
    while (distrattori.length < impostazioni.numScelte - 1) {
      const d = casuale(pool);
      if (d.id !== bersaglio.id && !distrattori.some(x => x.id === d.id)) distrattori.push(d);
    }
    const scelte = [bersaglio, ...distrattori].sort(() => Math.random() - 0.5);

    const domanda =
      idModulo === 'numeri' ? `Trova il numero ${bersaglio.say}` :
      idModulo === 'lettere' ? `Trova la lettera ${bersaglio.say}` :
      `Trova: ${bersaglio.say}`;

    const carte = scelte.map(s => {
      if (idModulo === 'numeri') {
        return `<button class="scelta" data-id="${s.id}">${s.glyph}</button>`;
      }
      if (idModulo === 'lettere') {
        return `<button class="scelta" data-id="${s.id}">${mostraTesto(s.glyph)}</button>`;
      }
      return `<button class="scelta" data-id="${s.id}">${s.emoji}<span class="mini">${mostraTesto(s.glyph)}</span></button>`;
    }).join('');

    const fileStelle =
      '⭐'.repeat(stelle) +
      `<span class="vuota">${'⭐'.repeat(STELLE_PER_VINCERE - stelle)}</span>`;

    render(`
      ${barra('🎮 Trova!')}
      <div class="stelle" aria-label="${stelle} stelle su ${STELLE_PER_VINCERE}">${fileStelle}</div>
      <div class="gioco-domanda">
        <button class="btn-ripeti" id="btn-domanda">🔊 Ascolta</button>
      </div>
      <div class="gioco-scelte ${impostazioni.numScelte === 3 ? 'tre' : ''}">${carte}</div>
      <div style="height:16px"></div>
    `);

    collegaCasa();
    parla(domanda);
    document.getElementById('btn-domanda').addEventListener('click', () => parla(domanda));

    let risolto = false;
    app.querySelectorAll('.scelta').forEach(carta => {
      carta.addEventListener('click', () => {
        if (risolto) return;
        if (carta.dataset.id === bersaglio.id) {
          risolto = true;
          carta.classList.add('giusta');
          parla(casuale(LODI), { rate: 1 });
          setTimeout(() => vaiGioco(idModulo, pool, indietro, stelle + 1), 1400);
        } else {
          carta.classList.add('sbagliata');
          carta.disabled = true;
          parla(casuale(INCORAGGIAMENTI), { rate: 1 });
          // ripete la domanda solo se nel frattempo non si è già risposto bene
          setTimeout(() => { if (!risolto) parla(domanda); }, 1800);
        }
      });
    });
  }

  function vaiFesta(idModulo, pool, indietro) {
    render(`
      ${barra('')}
      <div class="festa">
        <div class="coriandoli">🎉⭐🎉</div>
        <h2>Bravissimo!</h2>
        <div style="font-size:30px">Hai vinto ${STELLE_PER_VINCERE} stelle!</div>
        <button class="btn-grande" id="btn-ancora">🎮 Gioca ancora</button>
        <button class="btn-grande secondario" id="btn-fine">🏠 Basta così</button>
      </div>
    `);

    collegaCasa();
    parla('Bravissimo! Hai vinto cinque stelle! Evviva!', { rate: 0.95 });
    document.getElementById('btn-ancora').addEventListener('click', () => vaiGioco(idModulo, pool, indietro, 0));
    document.getElementById('btn-fine').addEventListener('click', () => vaiHome());
  }

  /* ---------- AREA GENITORI ---------- */

  function vaiGenitori() {
    const opzione = (titolo, nome, valori) => `
      <div class="opzione">
        <div class="etichetta">${titolo}</div>
        <div class="valori">
          ${valori.map(v => `
            <button class="btn-valore ${v.attivo ? 'attivo' : ''}" data-opzione="${nome}" data-valore="${v.valore}">
              ${v.testo}
            </button>`).join('')}
        </div>
      </div>`;

    render(`
      ${barra('⚙️ Genitori')}
      <div class="genitori">
        <p class="nota">Impostazioni per adattare l'app al bambino. Questa pagina si apre solo tenendo premuto l'ingranaggio per 2 secondi.</p>
        ${opzione('Scelte nel gioco (meno scelte = più facile)', 'numScelte', [
          { testo: '2 scelte', valore: '2', attivo: impostazioni.numScelte === 2 },
          { testo: '3 scelte', valore: '3', attivo: impostazioni.numScelte === 3 },
        ])}
        ${opzione('Scrittura di lettere e parole', 'maiuscole', [
          { testo: 'MAIUSCOLE', valore: 'true', attivo: impostazioni.maiuscole },
          { testo: 'minuscole', valore: 'false', attivo: !impostazioni.maiuscole },
        ])}
        ${opzione('Velocità della voce', 'velocita', [
          { testo: '🐢 Lenta', valore: '0.75', attivo: impostazioni.velocita <= 0.8 },
          { testo: '🐇 Normale', valore: '0.95', attivo: impostazioni.velocita > 0.8 },
        ])}
        ${opzione('Voce', 'audio', [
          { testo: '🔊 Accesa', valore: 'true', attivo: impostazioni.audio },
          { testo: '🔇 Spenta', valore: 'false', attivo: !impostazioni.audio },
        ])}
      </div>
    `);

    collegaCasa();
    app.querySelectorAll('.btn-valore').forEach(btn => {
      btn.addEventListener('click', () => {
        const nome = btn.dataset.opzione;
        const valore = btn.dataset.valore;
        if (nome === 'numScelte') impostazioni.numScelte = Number(valore);
        if (nome === 'maiuscole') impostazioni.maiuscole = valore === 'true';
        if (nome === 'velocita') impostazioni.velocita = Number(valore);
        if (nome === 'audio') impostazioni.audio = valore === 'true';
        salvaImpostazioni();
        vaiGenitori();
      });
    });
  }

  /* ---------- avvio ---------- */

  vaiHome();
})();
