/* ============================================================
   Impara con Me — logica dell'app.
   Navigazione a schermate semplici: una sola azione per volta,
   pulsante "casa" sempre nella stessa posizione.
   ============================================================ */

(function () {
  'use strict';

  const app = document.getElementById('app');

  /* ---------- profili dei bambini e impostazioni del dispositivo ----------
     Ogni bambino ha il suo profilo (nome, genere, difficoltà) con le SUE
     statistiche. Sul dispositivo restano le impostazioni comuni (voce).
     I profili sono ricordati e si può passare da un bambino all'altro o
     crearne di nuovi dall'area genitori. */

  const uid = () => 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const profiloNuovo = (nome, genere) => ({
    id: uid(),
    nome: nome || '',
    genere: genere || null,
    numScelte: 2,        // scelte nel gioco (usato solo se adattiva è spenta)
    maiuscole: true,     // lettere/parole in MAIUSCOLO
    adattiva: true,      // difficoltà che sale/scende da sola
    livelli: {},         // livello (1..3) per attività
    recenti: {},         // finestra recente di esiti (1/0) per attività
    statistiche: {},     // giusti/sbagliati per attività e per elemento
  });

  // aggiunge i campi mancanti a profili vecchi (migrazione morbida)
  const completaProfilo = (p) => ({
    numScelte: 2, maiuscole: true, adattiva: true,
    livelli: {}, recenti: {}, statistiche: {}, ...p,
  });

  // profilo di scorta, usato solo prima che ne esista uno vero (onboarding)
  const PROFILO_SCORTA = profiloNuovo('', null);

  let profili = [];
  let attivoId = null;

  /* Impostazioni del dispositivo (valgono per tutti i bambini). */
  const DISPOSITIVO_DEFAULT = { velocita: 0.75, audio: true, suoni: true };
  let dispositivo = { ...DISPOSITIVO_DEFAULT };

  function salvaDispositivo() {
    try { localStorage.setItem('dispositivo', JSON.stringify(dispositivo)); } catch {}
  }

  function salvaProfili() {
    try { localStorage.setItem('profili', JSON.stringify({ profili, attivo: attivoId })); } catch {}
  }

  function profiloAttivo() {
    return profili.find(p => p.id === attivoId) || null;
  }

  // scorciatoia sempre valida (mai null) per leggere il profilo corrente
  const P = () => profiloAttivo() || PROFILO_SCORTA;

  /* Carica i dati; se trova il vecchio formato a profilo singolo lo migra
     in un profilo, senza perdere né le impostazioni né le statistiche. */
  function caricaDati() {
    let vecchie = {};
    try { vecchie = JSON.parse(localStorage.getItem('impostazioni') || '{}'); } catch {}

    // impostazioni del dispositivo (nuovo formato o migrazione dal vecchio)
    try {
      const disp = JSON.parse(localStorage.getItem('dispositivo') || 'null');
      if (disp) dispositivo = { ...DISPOSITIVO_DEFAULT, ...disp };
      else {
        if (vecchie.velocita != null) dispositivo.velocita = vecchie.velocita;
        if (vecchie.audio != null) dispositivo.audio = vecchie.audio;
        if (vecchie.suoni != null) dispositivo.suoni = vecchie.suoni;
      }
    } catch {}

    // profili (nuovo formato)
    try {
      const raw = JSON.parse(localStorage.getItem('profili') || 'null');
      if (raw && Array.isArray(raw.profili) && raw.profili.length) {
        profili = raw.profili.map(completaProfilo);
        attivoId = raw.attivo && profili.some(p => p.id === raw.attivo) ? raw.attivo : profili[0].id;
        return;
      }
    } catch {}

    // migrazione dal vecchio profilo singolo
    if (vecchie.onboardingFatto && vecchie.genere) {
      let stat = {};
      try { stat = JSON.parse(localStorage.getItem('statistiche') || '{}'); } catch {}
      const p = profiloNuovo(vecchie.nome, vecchie.genere);
      if (vecchie.numScelte) p.numScelte = vecchie.numScelte;
      if (vecchie.maiuscole != null) p.maiuscole = vecchie.maiuscole;
      p.statistiche = stat || {};
      profili = [p];
      attivoId = p.id;
      salvaProfili();
      salvaDispositivo();
    }
  }

  caricaDati();

  /* ---------- statistiche (giusti/sbagliati), per bambino ----------
     Registrate nel profilo attivo, sia per attività sia per singolo
     elemento: base per i progressi e per la futura difficoltà adattiva. */

  function registra(attivita, itemId, giusto) {
    const prof = profiloAttivo();
    if (!prof) return;
    const s = prof.statistiche;
    if (!s[attivita]) s[attivita] = { giusti: 0, sbagliati: 0, items: {} };
    const a = s[attivita];
    if (giusto) a.giusti++; else a.sbagliati++;
    if (itemId != null) {
      if (!a.items[itemId]) a.items[itemId] = { giusti: 0, sbagliati: 0 };
      if (giusto) a.items[itemId].giusti++; else a.items[itemId].sbagliati++;
    }
    if (prof.adattiva) aggiornaLivello(prof, attivita, giusto);
    salvaProfili();
  }

  /* ---------- difficoltà adattiva ----------
     Un livello (1..3) per attività, per bambino. Sale dove il bambino è
     costantemente bravo (graduale, con isteresi), scende se fatica. La
     selezione è "bilanciata": propone più spesso gli elementi deboli e, ai
     livelli alti, aggiunge distrattori insidiosi. Tutte le manopole qui: */
  const ADATTIVA = {
    FINESTRA: 12,        // quante risposte recenti si guardano
    MIN_PROMO: 8,        // campioni minimi prima di poter salire
    MIN_DEMO: 6,         // campioni minimi prima di poter scendere
    SOGLIA_PROMO: 0.85,  // accuratezza recente per salire
    SOGLIA_DEMO: 0.50,   // accuratezza recente per scendere
    LIVELLO_MAX: 3,
    SCELTE: { 1: 2, 2: 3, 3: 3 },  // scelte nel gioco per livello
    SIMILI_DA: 3,        // dal livello 3 i distrattori diventano insidiosi
  };

  function livelloAttivita(attivita) {
    const l = P().livelli[attivita];
    return l && l >= 1 ? Math.min(l, ADATTIVA.LIVELLO_MAX) : 1;
  }

  // scelte effettive: automatiche se adattiva, altrimenti quelle del genitore
  function numScelteEffettive(attivita) {
    return P().adattiva ? ADATTIVA.SCELTE[livelloAttivita(attivita)] : P().numScelte;
  }

  function distrattoriSimili(attivita) {
    return P().adattiva && livelloAttivita(attivita) >= ADATTIVA.SIMILI_DA;
  }

  // aggiorna la finestra recente e, se serve, promuove/retrocede il livello
  function aggiornaLivello(prof, attivita, giusto) {
    const r = prof.recenti[attivita] || (prof.recenti[attivita] = []);
    r.push(giusto ? 1 : 0);
    while (r.length > ADATTIVA.FINESTRA) r.shift();
    const somma = r.reduce((s, x) => s + x, 0);
    const acc = r.length ? somma / r.length : 0;
    const liv = prof.livelli[attivita] || 1;
    if (r.length >= ADATTIVA.MIN_PROMO && acc >= ADATTIVA.SOGLIA_PROMO && liv < ADATTIVA.LIVELLO_MAX) {
      prof.livelli[attivita] = liv + 1;
      prof.recenti[attivita] = [];   // si riparte per guadagnare il livello dopo
    } else if (r.length >= ADATTIVA.MIN_DEMO && acc <= ADATTIVA.SOGLIA_DEMO && liv > 1) {
      prof.livelli[attivita] = liv - 1;
      prof.recenti[attivita] = [];
    }
  }

  // padronanza di un elemento: 0.5 senza dati, → 1 se sempre giusto (Laplace)
  function padronanza(attivita, itemId) {
    const it = ((P().statistiche[attivita] || {}).items || {})[itemId];
    const g = it ? it.giusti : 0;
    const s = it ? it.sbagliati : 0;
    return (g + 1) / (g + s + 2);
  }

  // scelta pesata sui punti deboli (bilanciata); evita di ripetere l'ultimo
  let ultimoBersaglio = null;
  function scegliBersaglio(pool, attivita) {
    if (!P().adattiva) return casuale(pool);
    const candidati = pool.length > 1 ? pool.filter(x => x.id !== ultimoBersaglio) : pool;
    const pesi = candidati.map(x => 1 - padronanza(attivita, x.id) + 0.15);
    const totale = pesi.reduce((s, w) => s + w, 0);
    let soglia = Math.random() * totale;
    let scelto = candidati[candidati.length - 1];
    for (let i = 0; i < candidati.length; i++) {
      soglia -= pesi[i];
      if (soglia <= 0) { scelto = candidati[i]; break; }
    }
    ultimoBersaglio = scelto.id;
    return scelto;
  }

  /* Distrattori (item con id) per il gioco Trova: ai livelli alti si
     preferiscono quelli simili al bersaglio, poi si completa a caso. */
  function scegliDistrattori(bersaglio, pool, n, { simili, similiDi, glifoDi }) {
    const altri = pool.filter(x => x.id !== bersaglio.id);
    const scelti = [];
    const prendiDa = (lista) => {
      const disponibili = lista.filter(x => !scelti.some(s => s.id === x.id));
      while (scelti.length < n && disponibili.length) {
        const i = Math.floor(Math.random() * disponibili.length);
        scelti.push(disponibili.splice(i, 1)[0]);
      }
    };
    if (simili) {
      const set = similiDi(bersaglio) || [];
      prendiDa(altri.filter(x => set.includes(glifoDi(x))));
    }
    prendiDa(altri);   // riempi a caso se i simili non bastano
    return scelti;
  }

  /* ---------- sintesi vocale (voce italiana, viva e calorosa) ---------- */

  let voceItaliana = null;

  /* Sceglie la voce italiana più bella disponibile: le voci "naturali"
     di Google/Apple suonano molto più accattivanti di quelle di sistema,
     e una voce femminile morbida è più adatta a un bambino piccolo. */
  function scegliVoce() {
    if (!('speechSynthesis' in window)) return;
    const voci = speechSynthesis.getVoices().filter(v => v.lang && v.lang.toLowerCase().startsWith('it'));
    if (!voci.length) { voceItaliana = null; return; }
    const punteggio = (v) => {
      const n = (v.name || '').toLowerCase();
      let s = 0;
      if (v.lang.toLowerCase() === 'it-it') s += 2;
      if (/google/.test(n)) s += 6;                                   // voci Google: molto naturali
      if (/(natural|neural|enhanced|premium|siri)/.test(n)) s += 6;    // voci ad alta qualità
      if (/(alice|federica|elsa|carla|paola|giulia|chiara|emma)/.test(n)) s += 3; // femminili morbide
      if (/(luca|diego|cosimo)/.test(n)) s += 1;
      return s;
    };
    voci.sort((a, b) => punteggio(b) - punteggio(a));
    voceItaliana = voci[0];
  }

  if ('speechSynthesis' in window) {
    scegliVoce();
    speechSynthesis.onvoiceschanged = scegliVoce;
  }

  /* parla(testo, { rate, pitch, festa })
     - festa: consegna allegra ed espressiva (voce più acuta e vivace),
       usata per i complimenti così suonano davvero entusiasti. */
  function parla(testo, opzioni = {}) {
    if (!dispositivo.audio || !('speechSynthesis' in window)) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(testo);
    u.lang = 'it-IT';
    if (voceItaliana) u.voice = voceItaliana;
    if (opzioni.festa) {
      // acuto e un po' più veloce: suona gioioso e sorpreso
      u.rate = opzioni.rate || Math.max(dispositivo.velocita, 1.0);
      u.pitch = opzioni.pitch || (1.3 + Math.random() * 0.2);
    } else {
      u.rate = opzioni.rate || dispositivo.velocita;
      u.pitch = opzioni.pitch || 1.15;
    }
    speechSynthesis.speak(u);
  }

  function casuale(lista) {
    return lista[Math.floor(Math.random() * lista.length)];
  }

  /* ---------- complimenti e incoraggiamenti (col nome e col genere) ---------- */

  /* Complimento vario: a volte di genere (Bravo/Brava), a volte neutro,
     e spesso col nome del bambino, così ogni festa suona diversa. */
  function lode() {
    const genere = P().genere === 'f' ? LODI_F : LODI_M;
    let frase = Math.random() < 0.6 ? casuale(genere) : casuale(LODI_NEUTRE);
    if (P().nome && Math.random() < 0.6) frase += ` ${P().nome}`;
    return frase + '!';
  }

  function incoraggiamento() {
    let frase = casuale(INCORAGGIAMENTI);
    if (P().nome && Math.random() < 0.35) frase = `Dai ${P().nome}! ${frase}`;
    return frase;
  }

  /* ---------- suono di festa (Web Audio, nessun file esterno) ---------- */

  let contestoAudio = null;

  function suonaTaDa() {
    if (!dispositivo.suoni) return;
    try {
      contestoAudio = contestoAudio || new (window.AudioContext || window.webkitAudioContext)();
      if (contestoAudio.state === 'suspended') contestoAudio.resume();
      // tre note morbide (do-mi-sol): allegro ma non brusco
      [523.25, 659.25, 783.99].forEach((frequenza, i) => {
        const osc = contestoAudio.createOscillator();
        const gain = contestoAudio.createGain();
        osc.type = 'triangle';
        osc.frequency.value = frequenza;
        const t = contestoAudio.currentTime + i * 0.13;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.22, t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.connect(gain).connect(contestoAudio.destination);
        osc.start(t);
        osc.stop(t + 0.6);
      });
    } catch {}
  }

  function mostraTesto(testo) {
    return P().maiuscole ? testo.toUpperCase() : testo.toLowerCase();
  }

  /* ---------- Gino, la mascotte che festeggia ---------- */

  function mascotte(pose = 'felice', size = 150) {
    const braccia = pose === 'felice'
      // braccia in alto con le zampette: evviva!
      ? `<ellipse cx="28" cy="105" rx="12" ry="30" fill="#f5a54a" transform="rotate(42 28 105)"/>
         <ellipse cx="172" cy="105" rx="12" ry="30" fill="#f5a54a" transform="rotate(-42 172 105)"/>
         <circle cx="12" cy="86" r="11" fill="#f5a54a"/>
         <circle cx="188" cy="86" r="11" fill="#f5a54a"/>`
      // braccia lungo il corpo
      : `<ellipse cx="34" cy="132" rx="12" ry="26" fill="#f5a54a" transform="rotate(-25 34 132)"/>
         <ellipse cx="166" cy="132" rx="12" ry="26" fill="#f5a54a" transform="rotate(25 166 132)"/>`;
    const bocca = pose === 'felice'
      ? `<path d="M 78 128 Q 100 152 122 128 Z" fill="#8c4a2f"/>
         <path d="M 86 128 Q 100 140 114 128 Z" fill="#ff9d9d"/>`
      : `<path d="M 82 130 Q 100 142 118 130" stroke="#8c4a2f" stroke-width="6" fill="none" stroke-linecap="round"/>`;
    return `
      <svg viewBox="0 0 200 200" width="${size}" height="${size}" aria-hidden="true">
        <ellipse cx="58" cy="42" rx="22" ry="32" fill="#f5a54a" transform="rotate(-18 58 42)"/>
        <ellipse cx="142" cy="42" rx="22" ry="32" fill="#f5a54a" transform="rotate(18 142 42)"/>
        <ellipse cx="58" cy="46" rx="11" ry="18" fill="#ffd9a8" transform="rotate(-18 58 46)"/>
        <ellipse cx="142" cy="46" rx="11" ry="18" fill="#ffd9a8" transform="rotate(18 142 46)"/>
        ${braccia}
        <circle cx="100" cy="112" r="70" fill="#f5a54a"/>
        <ellipse cx="100" cy="140" rx="46" ry="34" fill="#ffe9cc"/>
        <circle cx="76" cy="94" r="15" fill="#fff"/>
        <circle cx="124" cy="94" r="15" fill="#fff"/>
        <circle cx="79" cy="97" r="7.5" fill="#3a3330"/>
        <circle cx="121" cy="97" r="7.5" fill="#3a3330"/>
        <circle cx="82" cy="94" r="2.5" fill="#fff"/>
        <circle cx="124" cy="94" r="2.5" fill="#fff"/>
        <circle cx="58" cy="118" r="10" fill="#ff9d9d" opacity="0.75"/>
        <circle cx="142" cy="118" r="10" fill="#ff9d9d" opacity="0.75"/>
        <ellipse cx="100" cy="114" rx="9" ry="7" fill="#8c4a2f"/>
        ${bocca}
      </svg>`;
  }

  /* Gino salta fuori dal bordo dello schermo con i coriandoli
     ogni volta che la risposta è giusta (poi sparisce da solo). */
  function festeggiaMascotte() {
    suonaTaDa();
    const vecchio = document.getElementById('mascotte-pop');
    if (vecchio) vecchio.remove();
    const div = document.createElement('div');
    div.id = 'mascotte-pop';
    let coriandoli = '';
    const simboli = ['🎉', '⭐', '✨', '🎊', '💛'];
    for (let i = 0; i < 10; i++) {
      const sinistra = 8 + Math.random() * 84;
      const ritardo = Math.random() * 0.35;
      const durata = 0.9 + Math.random() * 0.6;
      coriandoli += `<span class="coriandolo" style="left:${sinistra}%;animation-delay:${ritardo}s;animation-duration:${durata}s">${casuale(simboli)}</span>`;
    }
    div.innerHTML = `${coriandoli}<div class="mascotte-salto">${mascotte('felice', 160)}</div>`;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1600);
  }

  /* ---------- struttura comune delle schermate ---------- */

  let generazione = 0;

  function render(html) {
    generazione++;
    app.innerHTML = html;
    app.scrollTop = 0;
    window.scrollTo(0, 0);
  }

  /* Timer legato alla schermata corrente: se nel frattempo si è
     navigato altrove, non fa nulla (niente salti di schermata
     o voci "fantasma" dei giochi precedenti). */
  function dopo(ms, fn) {
    const g = generazione;
    setTimeout(() => { if (g === generazione) fn(); }, ms);
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

  /* ---------- FORM PROFILO: crea o modifica un bambino ----------
     - primo=true: primissimo avvio, nessun profilo ancora (niente 🏠)
     - idModifica impostato: modifica un profilo esistente
     - altrimenti: crea un nuovo bambino (dall'area genitori) */

  function vaiProfiloForm({ idModifica = null, primo = false } = {}) {
    const esistente = idModifica ? profili.find(p => p.id === idModifica) : null;
    let genereScelto = esistente ? esistente.genere : null;
    const valoreNome = (esistente ? esistente.nome : '') || '';

    render(`
      ${primo ? '' : barra(esistente ? '✏️ Modifica' : '➕ Nuovo bambino')}
      <div class="onboarding">
        <div class="mascotte-dondola">${mascotte('felice', 150)}</div>
        <h1>${esistente ? 'Chi sei?' : 'Ciao!'}</h1>
        <p class="nota grande">Come si chiama il bambino o la bambina?</p>
        <input id="campo-nome" class="campo-nome" type="text" maxlength="16"
               placeholder="Nome" value="${valoreNome.replace(/"/g, '&quot;')}"
               autocomplete="off" autocapitalize="words">
        <p class="nota grande">È un maschietto o una femminuccia?</p>
        <div class="scelte-genere">
          <button class="btn-genere ${genereScelto === 'm' ? 'attivo' : ''}" data-genere="m">
            <span class="faccia">👦</span><span>Maschio</span>
          </button>
          <button class="btn-genere ${genereScelto === 'f' ? 'attivo' : ''}" data-genere="f">
            <span class="faccia">👧</span><span>Femmina</span>
          </button>
        </div>
        <button class="btn-grande" id="btn-inizia" ${genereScelto ? '' : 'disabled'}>
          ${esistente ? '💾 Salva' : (primo ? '🚀 Inizia!' : '➕ Crea')}
        </button>
        ${esistente && profili.length > 1
          ? `<button class="btn-elimina" id="btn-elimina">🗑️ Elimina questo bambino</button>` : ''}
      </div>
    `);

    if (!primo) collegaCasa();

    const btnElimina = document.getElementById('btn-elimina');
    if (btnElimina) btnElimina.addEventListener('click', () => {
      profili = profili.filter(p => p.id !== esistente.id);
      if (attivoId === esistente.id) attivoId = profili[0] ? profili[0].id : null;
      salvaProfili();
      vaiGenitori();
    });

    app.querySelectorAll('.btn-genere').forEach(btn => {
      btn.addEventListener('click', () => {
        genereScelto = btn.dataset.genere;
        app.querySelectorAll('.btn-genere').forEach(b => b.classList.toggle('attivo', b === btn));
        document.getElementById('btn-inizia').disabled = false;
        parla(genereScelto === 'f' ? 'Femmina' : 'Maschio');
      });
    });

    document.getElementById('btn-inizia').addEventListener('click', () => {
      if (!genereScelto) return;
      const nome = document.getElementById('campo-nome').value.trim().slice(0, 16);
      if (esistente) {
        esistente.nome = nome;
        esistente.genere = genereScelto;
      } else {
        const p = profiloNuovo(nome, genereScelto);
        profili.push(p);
        attivoId = p.id;   // il bambino appena creato diventa quello attivo
      }
      salvaProfili();
      if (primo) {
        vaiHome();
        const saluto = nome ? `Ciao ${nome}!` : 'Ciao!';
        parla(`${saluto} Impariamo insieme!`, { festa: true });
      } else {
        vaiGenitori();
      }
    });
  }

  /* ---------- HOME ---------- */

  function vaiHome() {
    render(`
      ${barra('', { home: true })}
      <div class="home-testata">
        <div class="logo mascotte-dondola">${mascotte('normale', 130)}</div>
        <h1>Impara con Me</h1>
      </div>
      <div class="menu-moduli">
        <button class="btn-modulo blu" id="vai-numeri"><span class="emoji">🔢</span> Numeri</button>
        <button class="btn-modulo verde" id="vai-lettere"><span class="emoji">🔤</span> Lettere</button>
        <button class="btn-modulo arancio" id="vai-parole"><span class="emoji">🗣️</span> Parole</button>
        <button class="btn-modulo viola" id="vai-scrivi"><span class="emoji">✍️</span> Scrivi</button>
      </div>
    `);

    document.getElementById('vai-numeri').addEventListener('click', () => { parla('Numeri!'); vaiModulo('numeri'); });
    document.getElementById('vai-lettere').addEventListener('click', () => { parla('Lettere!'); vaiModulo('lettere'); });
    document.getElementById('vai-parole').addEventListener('click', () => { parla('Parole!'); vaiCategorie(); });
    document.getElementById('vai-scrivi').addEventListener('click', () => { parla('Scrivi!'); vaiScrivi(); });

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
      <div class="giochi-testa">
        <button class="btn-modulo viola" id="vai-gioco">
          <span class="emoji">🎮</span> Trova
        </button>
        ${idModulo === 'lettere' ? `
        <button class="btn-modulo viola" id="vai-gioco-parola">
          <span class="emoji">🧩</span> Completa la parola
        </button>` : ''}
      </div>
      <div class="modulo-${modulo.colore}">
        <div class="griglia">${carte}</div>
      </div>
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
    const btnParola = document.getElementById('vai-gioco-parola');
    if (btnParola) btnParola.addEventListener('click', () => vaiGiocoParola());
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
      <div class="giochi-testa">
        <button class="btn-modulo viola" id="vai-gioco">
          <span class="emoji">🎮</span> Gioca
        </button>
      </div>
      <div class="modulo-arancio">
        <div class="griglia">${carte}</div>
      </div>
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
      vaiFesta(() => vaiGioco(idModulo, pool, indietro, 0));
      return;
    }

    const attivita = 'trova-' + idModulo;
    const bersaglio = scegliBersaglio(pool, attivita);
    // distrattori insidiosi solo per numeri/lettere (le parole del pool sono già
    // tutte della stessa categoria, quindi "simili" per natura)
    const mappaSimili = idModulo === 'numeri' ? SIMILI_NUMERI : idModulo === 'lettere' ? SIMILI_LETTERE : null;
    const glifoDi = (x) => idModulo === 'lettere' ? x.glyph.toLowerCase() : x.glyph;
    const distrattori = scegliDistrattori(bersaglio, pool, numScelteEffettive(attivita) - 1, {
      simili: distrattoriSimili(attivita) && !!mappaSimili,
      similiDi: (b) => mappaSimili ? (mappaSimili[glifoDi(b)] || []) : [],
      glifoDi,
    });
    const scelte = [bersaglio, ...distrattori].sort(() => Math.random() - 0.5);

    // per le lettere si pronuncia SOLO la lettera, senza frasi intorno
    const domanda =
      idModulo === 'numeri' ? `Trova il numero ${bersaglio.say}` :
      idModulo === 'lettere' ? bersaglio.say :
      `Trova: ${bersaglio.say}`;

    const carte = scelte.map(s => {
      if (idModulo === 'numeri') {
        return `<button class="scelta" data-id="${s.id}">${s.glyph}</button>`;
      }
      if (idModulo === 'lettere') {
        return `<button class="scelta" data-id="${s.id}">${mostraTesto(s.glyph)}</button>`;
      }
      // parole: prima solo la parola scritta; la figura è nascosta
      // e compare come aiuto dopo due tentativi sbagliati
      return `<button class="scelta scelta-parola" data-id="${s.id}">
                <span class="figura" hidden>${s.emoji}</span>
                <span class="parola-scritta">${mostraTesto(s.glyph)}</span>
              </button>`;
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
      <div class="gioco-scelte ${scelte.length >= 3 ? 'tre' : ''}">${carte}</div>
      <div style="height:16px"></div>
    `);

    collegaCasa();
    parla(domanda);
    document.getElementById('btn-domanda').addEventListener('click', () => parla(domanda));

    let risolto = false;
    let errori = 0;
    app.querySelectorAll('.scelta').forEach(carta => {
      carta.addEventListener('click', () => {
        if (risolto) return;
        if (carta.dataset.id === bersaglio.id) {
          risolto = true;
          registra('trova-' + idModulo, bersaglio.id, true);
          carta.classList.add('giusta');
          festeggiaMascotte();
          parla(lode(), { festa: true });
          dopo(1600, () => vaiGioco(idModulo, pool, indietro, stelle + 1));
          return;
        }
        errori++;
        registra('trova-' + idModulo, bersaglio.id, false);
        if (idModulo === 'parole') {
          // nelle parole la carta sbagliata non si spegne: si riprova,
          // e al terzo tentativo compaiono le figure come aiuto
          carta.classList.add('scossa');
          dopo(500, () => carta.classList.remove('scossa'));
          if (errori >= 2) {
            app.querySelectorAll('.scelta .figura').forEach(f => { f.hidden = false; });
            parla(`${incoraggiamento()} Guarda i disegni!`);
          } else {
            parla(incoraggiamento());
          }
        } else {
          carta.classList.add('sbagliata');
          carta.disabled = true;
          parla(incoraggiamento());
        }
        // ripete la domanda solo se nel frattempo non si è già risposto bene
        dopo(1800, () => { if (!risolto) parla(domanda); });
      });
    });
  }

  function vaiFesta(riparti) {
    const bravissimo = P().genere === 'f' ? 'Bravissima' : 'Bravissimo';
    const conNome = P().nome ? `${bravissimo} ${P().nome}` : bravissimo;
    render(`
      ${barra('')}
      <div class="festa">
        <div class="coriandoli">🎉⭐🎉</div>
        <div class="mascotte-dondola">${mascotte('felice', 190)}</div>
        <h2>${conNome}!</h2>
        <div style="font-size:30px">Hai vinto ${STELLE_PER_VINCERE} stelle!</div>
        <button class="btn-grande" id="btn-ancora">🎮 Gioca ancora</button>
        <button class="btn-grande secondario" id="btn-fine">🏠 Basta così</button>
      </div>
    `);

    collegaCasa();
    parla(`${conNome}! Hai vinto cinque stelle! Evviva!`, { festa: true });
    document.getElementById('btn-ancora').addEventListener('click', riparti);
    document.getElementById('btn-fine').addEventListener('click', () => vaiHome());
  }

  /* ---------- GIOCO "COMPLETA LA PAROLA" ----------
     Una parola con una lettera nascosta: si ascolta la parola
     e si sceglie la lettera che manca. */

  function tutteLeParole() {
    return DATA.parole.categorie.flatMap(cat => cat.items);
  }

  function vaiGiocoParola(stelle = 0) {
    if (stelle >= STELLE_PER_VINCERE) {
      vaiFesta(() => vaiGiocoParola(0));
      return;
    }

    const parola = casuale(tutteLeParole());
    const lettere = parola.glyph.split('');
    // si nasconde solo una lettera "semplice" (niente accentate)
    const indiciValidi = lettere
      .map((l, i) => ({ l: l.toLowerCase(), i }))
      .filter(x => 'abcdefghilmnopqrstuvz'.includes(x.l))
      .map(x => x.i);
    // adattiva: si buca la lettera in cui il bambino è più debole
    let buco;
    if (P().adattiva) {
      buco = indiciValidi.reduce((peggio, i) =>
        padronanza('completa', lettere[i].toLowerCase()) < padronanza('completa', lettere[peggio].toLowerCase()) ? i : peggio,
        indiciValidi[0]);
    } else {
      buco = casuale(indiciValidi);
    }
    const letteraGiusta = lettere[buco].toLowerCase();

    const alfabeto = DATA.lettere.items.map(x => x.glyph.toLowerCase());
    const simili = distrattoriSimili('completa');
    const distrattori = [];
    // ai livelli alti si preferiscono lettere facili da confondere
    if (simili) {
      const set = (SIMILI_LETTERE[letteraGiusta] || []).filter(l => l !== letteraGiusta);
      for (const l of set.sort(() => Math.random() - 0.5)) {
        if (distrattori.length < numScelteEffettive('completa') - 1 && !distrattori.includes(l)) distrattori.push(l);
      }
    }
    while (distrattori.length < numScelteEffettive('completa') - 1) {
      const d = casuale(alfabeto);
      if (d !== letteraGiusta && !distrattori.includes(d)) distrattori.push(d);
    }
    const scelte = [letteraGiusta, ...distrattori].sort(() => Math.random() - 0.5);

    const tessere = lettere.map((l, i) =>
      i === buco
        ? `<span class="tessera buco" id="tessera-buco">?</span>`
        : `<span class="tessera">${mostraTesto(l)}</span>`
    ).join('');

    const carte = scelte.map(l =>
      `<button class="scelta" data-lettera="${l}">${mostraTesto(l)}</button>`
    ).join('');

    const fileStelle =
      '⭐'.repeat(stelle) +
      `<span class="vuota">${'⭐'.repeat(STELLE_PER_VINCERE - stelle)}</span>`;

    render(`
      ${barra('🧩 Completa')}
      <div class="stelle" aria-label="${stelle} stelle su ${STELLE_PER_VINCERE}">${fileStelle}</div>
      <div class="parola-zona">
        <div class="parola-figura">${parola.emoji}</div>
        <div class="parola-tessere">${tessere}</div>
        <button class="btn-ripeti" id="btn-domanda">🔊 Ascolta</button>
      </div>
      <div class="gioco-scelte ${scelte.length >= 3 ? 'tre' : ''}">${carte}</div>
      <div style="height:16px"></div>
    `);

    collegaCasa();
    parla(parola.say);
    document.getElementById('btn-domanda').addEventListener('click', () => parla(parola.say));

    let risolto = false;
    app.querySelectorAll('.scelta').forEach(carta => {
      carta.addEventListener('click', () => {
        if (risolto) return;
        if (carta.dataset.lettera === letteraGiusta) {
          risolto = true;
          registra('completa', letteraGiusta, true);
          carta.classList.add('giusta');
          const tessera = document.getElementById('tessera-buco');
          tessera.textContent = mostraTesto(letteraGiusta);
          tessera.classList.add('riempita');
          festeggiaMascotte();
          parla(`${lode()} ${parola.say}!`, { festa: true });
          dopo(1900, () => vaiGiocoParola(stelle + 1));
        } else {
          registra('completa', letteraGiusta, false);
          carta.classList.add('sbagliata');
          carta.disabled = true;
          parla(incoraggiamento());
          dopo(1800, () => { if (!risolto) parla(parola.say); });
        }
      });
    });
  }

  /* ---------- SCRIVI: dettato di lettere e numeri ----------
     La voce detta, il bambino scrive col dito sulla lavagna.
     Aiuti progressivi: se non riesce compare la traccia grigia
     da ricalcare, e i controlli diventano via via più generosi. */

  const FONTE_SCRITTURA = '"Trebuchet MS", "Segoe UI", Arial, sans-serif';

  function vaiScrivi() {
    render(`
      ${barra('✍️ Scrivi')}
      <div class="menu-moduli" style="justify-content:center">
        <button class="btn-modulo blu" id="detta-numeri"><span class="emoji">🔢</span> Numeri</button>
        <button class="btn-modulo verde" id="detta-lettere"><span class="emoji">🔤</span> Lettere</button>
      </div>
    `);
    collegaCasa();
    document.getElementById('detta-numeri').addEventListener('click', () => { parla('Numeri!'); vaiDettato('numeri'); });
    document.getElementById('detta-lettere').addEventListener('click', () => { parla('Lettere!'); vaiDettato('lettere'); });
  }

  /* Confronta il disegno del bambino con la forma del glifo.
     Il disegno viene prima riportato (spostato e scalato) sulla sagoma,
     così non importa DOVE e QUANTO GRANDE ha scritto; poi si misurano
     le distanze punto-per-punto in entrambe le direzioni:
     - precisione: quanta scrittura sta vicino alla forma giusta
     - copertura:  quanta forma giusta è stata effettivamente ripassata
     - eccesso:    tratto troppo lungo = scarabocchio, non scrittura */
  function valutaScrittura(tratti, glifo, tentativi) {
    // ricampiona i tratti a passo fisso e misura la lunghezza totale
    const inchiostro = [];
    let lunghezza = 0;
    for (const tratto of tratti) {
      for (let i = 0; i < tratto.length; i++) {
        if (i === 0) { inchiostro.push(tratto[i]); continue; }
        const [x0, y0] = tratto[i - 1];
        const [x1, y1] = tratto[i];
        const d = Math.hypot(x1 - x0, y1 - y0);
        lunghezza += d;
        const n = Math.max(1, Math.floor(d / 4));
        for (let k = 1; k <= n; k++) {
          inchiostro.push([x0 + (x1 - x0) * k / n, y0 + (y1 - y0) * k / n]);
        }
      }
    }
    if (inchiostro.length < 12) return { ok: false, pochiPunti: true };

    // sagoma del glifo
    const W = 220, H = 280;
    const tela = document.createElement('canvas');
    tela.width = W; tela.height = H;
    const ctx = tela.getContext('2d');
    ctx.font = `bold 190px ${FONTE_SCRITTURA}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(glifo, W / 2, H / 2);
    const dati = ctx.getImageData(0, 0, W, H).data;
    const sagoma = [];
    for (let y = 0; y < H; y += 3) {
      for (let x = 0; x < W; x += 3) {
        if (dati[(y * W + x) * 4 + 3] > 40) sagoma.push([x, y]);
      }
    }

    const bbox = (pts) => {
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
      for (const [x, y] of pts) {
        if (x < x0) x0 = x; if (y < y0) y0 = y;
        if (x > x1) x1 = x; if (y > y1) y1 = y;
      }
      return { x0, y0, w: Math.max(x1 - x0, 4), h: Math.max(y1 - y0, 4) };
    };
    const boxS = bbox(sagoma);
    const boxI = bbox(inchiostro);
    const scala = Math.min(boxS.w / boxI.w, boxS.h / boxI.h);
    const norm = inchiostro.map(([x, y]) => [
      boxS.x0 + boxS.w / 2 + (x - boxI.x0 - boxI.w / 2) * scala,
      boxS.y0 + boxS.h / 2 + (y - boxI.y0 - boxI.h / 2) * scala,
    ]);

    // griglie spaziali per cercare i punti vicini in fretta
    const cella = 8;
    const inGriglia = (pts) => {
      const g = new Map();
      for (const p of pts) {
        const k = ((p[0] / cella) | 0) + ',' + ((p[1] / cella) | 0);
        if (!g.has(k)) g.set(k, []);
        g.get(k).push(p);
      }
      return g;
    };
    const cerca = (griglia, [x, y], raggio) => {
      const r = Math.ceil(raggio / cella);
      const cx = (x / cella) | 0, cy = (y / cella) | 0;
      for (let gx = cx - r; gx <= cx + r; gx++) {
        for (let gy = cy - r; gy <= cy + r; gy++) {
          const lista = griglia.get(gx + ',' + gy);
          if (!lista) continue;
          for (const [px, py] of lista) {
            if ((px - x) ** 2 + (py - y) ** 2 <= raggio * raggio) return true;
          }
        }
      }
      return false;
    };

    const TOLLERANZA_PRECISIONE = 8;   // quanto può sbordare il tratto
    const TOLLERANZA_COPERTURA = 14;   // metà spessore del glifo + un po' di gioco

    const grigliaSagoma = inGriglia(sagoma);
    let vicini = 0;
    for (const p of norm) if (cerca(grigliaSagoma, p, TOLLERANZA_PRECISIONE)) vicini++;
    const precisione = vicini / norm.length;

    const grigliaInchiostro = inGriglia(norm);
    let coperti = 0;
    for (const p of sagoma) if (cerca(grigliaInchiostro, p, TOLLERANZA_COPERTURA)) coperti++;
    const copertura = coperti / sagoma.length;

    // invasione: quanta parte delle zone VUOTE dentro la cornice del glifo
    // (i buchi della O, gli angoli liberi) è stata toccata dall'inchiostro.
    // La scrittura vera non le tocca; righe e riempimenti sì.
    const vuoti = [];
    for (let y = boxS.y0; y <= boxS.y0 + boxS.h; y += 6) {
      for (let x = boxS.x0; x <= boxS.x0 + boxS.w; x += 6) {
        if (!cerca(grigliaSagoma, [x, y], 12)) vuoti.push([x, y]);
      }
    }
    let vuotiToccati = 0;
    for (const p of vuoti) if (cerca(grigliaInchiostro, p, 8)) vuotiToccati++;
    const invasione = vuoti.length ? vuotiToccati / vuoti.length : 0;

    // tratto molto più lungo dello scheletro del glifo = scarabocchio
    const scheletro = (sagoma.length * 9) / 24;
    const eccesso = (lunghezza * scala) / Math.max(scheletro, 1);

    // soglie via via più generose ad ogni tentativo (mai frustrare),
    // ma l'eccesso resta sempre un limite: la scrittura vera è un tratto
    // solo, poco più lungo dello scheletro; le righe che riempiono la
    // lavagna lo superano sempre
    const soglie = tentativi === 0 ? [0.80, 0.80] : tentativi === 1 ? [0.70, 0.70] : [0.65, 0.65];
    const ok = precisione >= soglie[0] && copertura >= soglie[1] && eccesso <= 2.5 && invasione <= 0.35;
    return { ok, precisione, copertura, eccesso, invasione };
  }

  function vaiDettato(idModulo, stelle = 0) {
    if (stelle >= STELLE_PER_VINCERE) {
      vaiFesta(() => vaiDettato(idModulo, 0));
      return;
    }

    const item = scegliBersaglio(DATA[idModulo].items, 'scrivi-' + idModulo);
    const glifo = idModulo === 'lettere' ? mostraTesto(item.glyph) : item.glyph;
    // si pronuncia SOLO la lettera o il numero, senza frasi intorno
    const domanda = item.say;

    const fileStelle =
      '⭐'.repeat(stelle) +
      `<span class="vuota">${'⭐'.repeat(STELLE_PER_VINCERE - stelle)}</span>`;

    render(`
      ${barra('✍️ Scrivi')}
      <div class="stelle" aria-label="${stelle} stelle su ${STELLE_PER_VINCERE}">${fileStelle}</div>
      <div class="gioco-domanda" style="margin-bottom:12px">
        <button class="btn-ripeti" id="btn-domanda">🔊 Ascolta</button>
      </div>
      <div class="lavagna">
        <div class="guida" id="guida" aria-hidden="true">${glifo}</div>
        <canvas id="lavagna-canvas"></canvas>
      </div>
      <div class="dettato-bottoni">
        <button class="btn-tondo" id="btn-cancella" aria-label="Cancella e riprova">🗑️</button>
        <button class="btn-fatto" id="btn-fatto">✅ Fatto!</button>
        <button class="btn-tondo" id="btn-aiuto" aria-label="Mostra la traccia da ricalcare">💡</button>
      </div>
    `);

    collegaCasa();
    parla(domanda);
    document.getElementById('btn-domanda').addEventListener('click', () => parla(domanda));

    /* --- lavagna: disegno col dito --- */
    const canvas = document.getElementById('lavagna-canvas');
    const ctx = canvas.getContext('2d');
    const rett = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rett.width * dpr;
    canvas.height = rett.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.strokeStyle = '#4a90d9';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    let tratti = [];
    let trattoCorrente = null;

    const posizione = (e) => {
      const r = canvas.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top];
    };

    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      canvas.setPointerCapture(e.pointerId);
      trattoCorrente = [posizione(e)];
      tratti.push(trattoCorrente);
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!trattoCorrente) return;
      const p = posizione(e);
      const prima = trattoCorrente[trattoCorrente.length - 1];
      trattoCorrente.push(p);
      ctx.beginPath();
      ctx.moveTo(prima[0], prima[1]);
      ctx.lineTo(p[0], p[1]);
      ctx.stroke();
    });
    const fineTratto = () => { trattoCorrente = null; };
    canvas.addEventListener('pointerup', fineTratto);
    canvas.addEventListener('pointercancel', fineTratto);

    const pulisci = () => {
      tratti = [];
      trattoCorrente = null;
      ctx.clearRect(0, 0, rett.width, rett.height);
    };

    const guida = document.getElementById('guida');
    const mostraAiuto = (forte) => {
      guida.classList.add('visibile');
      if (forte) guida.classList.add('forte');
    };

    document.getElementById('btn-cancella').addEventListener('click', pulisci);
    document.getElementById('btn-aiuto').addEventListener('click', () => {
      mostraAiuto(false);
      parla(`Ricalca con il dito. ${item.say}`);
    });

    /* --- controllo con aiuti progressivi --- */
    let tentativi = 0;
    let risolto = false;

    document.getElementById('btn-fatto').addEventListener('click', () => {
      if (risolto) return;
      const esito = valutaScrittura(tratti, glifo, tentativi);
      window.__ultimoEsito = esito; // per diagnosi e test automatici

      if (esito.ok) {
        risolto = true;
        registra('scrivi-' + idModulo, item.id, true);
        festeggiaMascotte();
        parla(`${lode()} ${item.say}!`, { festa: true });
        dopo(1900, () => vaiDettato(idModulo, stelle + 1));
        return;
      }

      tentativi++;
      if (esito.pochiPunti) {
        mostraAiuto(tentativi >= 2);
        parla('Scrivi qui, bello grande!');
        return;
      }
      registra('scrivi-' + idModulo, item.id, false);
      // primo aiuto: compare la traccia grigia; poi diventa più scura
      mostraAiuto(tentativi >= 2);
      pulisci();
      parla(tentativi === 1
        ? `Quasi! Ricalca la traccia grigia. ${item.say}`
        : `Prova ancora, segui la traccia. ${item.say}`);
    });
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

    // elenco dei bambini: si tocca per rendere attivo, ✏️ per modificare
    const listaBambini = profili.map(p => {
      const faccia = p.genere === 'f' ? '👧' : '👦';
      const attivo = p.id === attivoId;
      return `
        <div class="riga-profilo ${attivo ? 'attivo' : ''}">
          <button class="btn-profilo" data-scegli="${p.id}">
            <span class="faccia">${faccia}</span>
            <span class="nome-profilo">${(p.nome || 'Senza nome')}</span>
            ${attivo ? '<span class="spunta">✓</span>' : ''}
          </button>
          <button class="btn-valore piccolo" data-modifica="${p.id}" aria-label="Modifica ${p.nome}">✏️</button>
        </div>`;
    }).join('');

    render(`
      ${barra('⚙️ Genitori')}
      <div class="genitori">
        <p class="nota">Impostazioni per adattare l'app al bambino. Questa pagina si apre solo tenendo premuto l'ingranaggio per 2 secondi.</p>

        <div class="opzione">
          <div class="etichetta">Bambini</div>
          <p class="nota">Tocca un nome per farlo giocare. Ogni bambino ha i suoi progressi.</p>
          <div class="lista-profili">${listaBambini}</div>
          <div class="valori"><button class="btn-valore" id="btn-nuovo-bambino">➕ Aggiungi bambino</button></div>
        </div>

        ${bloccoProgressi()}

        ${opzione('Difficoltà adattiva (si regola da sola)', 'adattiva', [
          { testo: '✨ Attiva', valore: 'true', attivo: P().adattiva },
          { testo: '✋ Manuale', valore: 'false', attivo: !P().adattiva },
        ])}
        ${P().adattiva ? '' : opzione('Scelte nel gioco (meno scelte = più facile)', 'numScelte', [
          { testo: '2 scelte', valore: '2', attivo: P().numScelte === 2 },
          { testo: '3 scelte', valore: '3', attivo: P().numScelte === 3 },
        ])}
        ${opzione('Scrittura di lettere e parole', 'maiuscole', [
          { testo: 'MAIUSCOLE', valore: 'true', attivo: P().maiuscole },
          { testo: 'minuscole', valore: 'false', attivo: !P().maiuscole },
        ])}
        ${opzione('Velocità della voce', 'velocita', [
          { testo: '🐢 Lenta', valore: '0.75', attivo: dispositivo.velocita <= 0.8 },
          { testo: '🐇 Normale', valore: '0.95', attivo: dispositivo.velocita > 0.8 },
        ])}
        ${opzione('Voce', 'audio', [
          { testo: '🔊 Accesa', valore: 'true', attivo: dispositivo.audio },
          { testo: '🔇 Spenta', valore: 'false', attivo: !dispositivo.audio },
        ])}
        ${opzione('Suoni di festa', 'suoni', [
          { testo: '🎵 Accesi', valore: 'true', attivo: dispositivo.suoni },
          { testo: '🔕 Spenti', valore: 'false', attivo: !dispositivo.suoni },
        ])}
      </div>
    `);

    collegaCasa();

    // le impostazioni di difficoltà sono del BAMBINO; voce/suoni del dispositivo
    app.querySelectorAll('.opzione .btn-valore[data-opzione]').forEach(btn => {
      btn.addEventListener('click', () => {
        const nome = btn.dataset.opzione;
        const valore = btn.dataset.valore;
        if (nome === 'numScelte') { P().numScelte = Number(valore); salvaProfili(); }
        else if (nome === 'adattiva') { P().adattiva = valore === 'true'; salvaProfili(); }
        else if (nome === 'maiuscole') { P().maiuscole = valore === 'true'; salvaProfili(); }
        else if (nome === 'velocita') { dispositivo.velocita = Number(valore); salvaDispositivo(); }
        else if (nome === 'audio') { dispositivo.audio = valore === 'true'; salvaDispositivo(); }
        else if (nome === 'suoni') { dispositivo.suoni = valore === 'true'; salvaDispositivo(); }
        vaiGenitori();
      });
    });

    // scegli quale bambino gioca
    app.querySelectorAll('[data-scegli]').forEach(btn => {
      btn.addEventListener('click', () => {
        attivoId = btn.dataset.scegli;
        salvaProfili();
        vaiGenitori();
      });
    });
    app.querySelectorAll('[data-modifica]').forEach(btn => {
      btn.addEventListener('click', () => vaiProfiloForm({ idModifica: btn.dataset.modifica }));
    });
    document.getElementById('btn-nuovo-bambino').addEventListener('click', () => vaiProfiloForm({}));

    const btnAzzera = document.getElementById('btn-azzera');
    if (btnAzzera) btnAzzera.addEventListener('click', () => {
      const prof = profiloAttivo();
      if (prof) { prof.statistiche = {}; salvaProfili(); }
      vaiGenitori();
    });
  }

  /* Riepilogo dei progressi per l'area genitori: totali e dettaglio
     per attività, con la percentuale di risposte corrette. */
  const ETICHETTE_ATTIVITA = {
    'trova-numeri': '🎮 Trova numeri',
    'trova-lettere': '🎮 Trova lettere',
    'trova-parole': '🎮 Trova parole',
    'completa': '🧩 Completa la parola',
    'scrivi-numeri': '✍️ Scrivi numeri',
    'scrivi-lettere': '✍️ Scrivi lettere',
  };

  function bloccoProgressi() {
    const stat = P().statistiche;
    const nome = P().nome || 'questo bambino';
    const chiavi = Object.keys(ETICHETTE_ATTIVITA).filter(k => stat[k]);
    if (!chiavi.length) {
      return `
        <div class="opzione">
          <div class="etichetta">Progressi di ${nome}</div>
          <p class="nota">Ancora nessun gioco completato. Qui vedrai quante risposte giuste e sbagliate fa in ogni attività.</p>
        </div>`;
    }

    const adattiva = P().adattiva;
    let totG = 0, totS = 0;
    const righe = chiavi.map(k => {
      const s = stat[k];
      totG += s.giusti; totS += s.sbagliati;
      const tot = s.giusti + s.sbagliati;
      const perc = tot ? Math.round(s.giusti / tot * 100) : 0;
      const liv = (P().livelli[k] || 1);
      const badge = adattiva ? `<span class="livello">Liv. ${liv}/${ADATTIVA.LIVELLO_MAX}</span> ` : '';
      return `
        <div class="riga-stat">
          <span class="nome-stat">${ETICHETTE_ATTIVITA[k]}</span>
          <span class="val-stat">${badge}<span class="ok">${s.giusti} ✓</span> · <span class="ko">${s.sbagliati} ✗</span> · ${perc}%</span>
        </div>`;
    }).join('');

    const totTot = totG + totS;
    const percTot = totTot ? Math.round(totG / totTot * 100) : 0;

    return `
      <div class="opzione">
        <div class="etichetta">Progressi di ${nome}</div>
        <div class="riga-stat totale">
          <span class="nome-stat">Totale</span>
          <span class="val-stat"><span class="ok">${totG} ✓</span> · <span class="ko">${totS} ✗</span> · ${percTot}%</span>
        </div>
        ${righe}
        <p class="nota">${adattiva
          ? 'Con la difficoltà adattiva il livello sale dove il bambino è costantemente bravo (fino a ' + ADATTIVA.LIVELLO_MAX + ') e riscende se fatica.'
          : 'Le percentuali più alte indicano dove il bambino è più sicuro.'}</p>
        <div class="valori"><button class="btn-valore" id="btn-azzera">🗑️ Azzera i progressi</button></div>
      </div>`;
  }

  /* ---------- avvio ---------- */

  if (profili.length) vaiHome();
  else vaiProfiloForm({ primo: true });
})();
