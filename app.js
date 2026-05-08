/* ════════════════════════════════════════════════════════════════════════
   ARCANUM STELLARIS · Motor principal
   ────────────────────────────────────────────────────────────────────────
   Aplicación web premium de tarot, astrología y análisis simbólico.
   Puro vanilla JS — sin frameworks, sin backend.
   Todo el estado del usuario vive en LocalStorage de su dispositivo.
   ════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ════════════════════════════════════════════════════════════════════
     1. CONSTANTES Y ESTADO GLOBAL
     ════════════════════════════════════════════════════════════════════ */

  const STORAGE_KEYS = {
    settings: 'arcanum.settings',
    history:  'arcanum.history',
    daily:    'arcanum.daily',
    astro:    'arcanum.astro',
    profile:  'arcanum.profile'
  };

  const DEFAULT_SETTINGS = {
    sound:     false,
    haptic:    true,
    particles: true,
    theme:     'cosmic',
    visited:   false,
    onboarded: false,
    seenReadGuide: false
  };

  const DEFAULT_PROFILE = {
    name:        '',
    intention:   null,    // amor | trabajo | autoconocimiento | proposito | curiosidad
    experience:  null,    // primera | alguna | habitual
    birthDate:   null,    // 'YYYY-MM-DD'
    birthTime:   null,    // 'HH:MM' o null
    birthTimeUnknown: false,
    birthPlace:  '',
    completedAt: null
  };

  // Estado en memoria de la app
  const state = {
    settings:     loadJSON(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
    history:      loadJSON(STORAGE_KEYS.history, []),
    astro:        loadJSON(STORAGE_KEYS.astro, null),
    profile:      loadJSON(STORAGE_KEYS.profile, null),
    currentSpread: null,
    deck:          [],
    selectedCards: [],
    question:      ''
  };

  /* ════════════════════════════════════════════════════════════════════
     2. UTILIDADES
     ════════════════════════════════════════════════════════════════════ */

  function $(sel, ctx = document)  { return ctx.querySelector(sel); }
  function $$(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  }
  function saveJSON(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); }
    catch (e) { console.warn('No se pudo guardar:', e); }
  }
  function removeKey(key) {
    try { localStorage.removeItem(key); } catch {}
  }

  // Baraja Fisher–Yates con semilla opcional (para carta del día determinista)
  function shuffle(array, seed = null) {
    const a = array.slice();
    const rand = seed === null ? Math.random : mulberry32(seed);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
      s |= 0; s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function dateSeed(d = new Date()) {
    return parseInt(`${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`, 10);
  }
  function todayKey(d = new Date()) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  function vibrate(ms = 12) {
    if (state.settings.haptic && navigator.vibrate) {
      try { navigator.vibrate(ms); } catch {}
    }
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
  }

  /* ════════════════════════════════════════════════════════════════════
     3. NAVEGACIÓN ENTRE PANTALLAS (SPA)
     ════════════════════════════════════════════════════════════════════ */

  const screens = {
    splash:      'screen-splash',
    onboarding:  'screen-onboarding',
    home:        'screen-home',
    tarot:       'screen-tarot',
    reading:     'screen-reading',
    astrology:   'screen-astrology',
    daily:       'screen-daily',
    history:     'screen-history',
    settings:    'screen-settings'
  };

  function showScreen(key) {
    const targetId = screens[key];
    if (!targetId) return;
    $$('.screen').forEach(el => el.classList.remove('is-active'));
    const target = document.getElementById(targetId);
    if (target) target.classList.add('is-active');

    // Hooks específicos al entrar
    if (key === 'home')      onEnterHome();
    if (key === 'tarot')     renderSpreads();
    if (key === 'astrology') renderAstroForm();
    if (key === 'daily')     renderDaily();
    if (key === 'history')   renderHistory();
    if (key === 'settings')  renderSettings();

    // Persistencia: guarda la pantalla actual para que al refrescar no se pierda.
    // Excluimos splash/onboarding para que tras configurar no vuelvan a salir.
    // Excluimos reading porque es un flujo en pasos que no tiene sentido restaurar
    // desde mitad — el usuario vuelve a la lista de tiradas.
    try {
      if (key !== 'splash' && key !== 'onboarding' && key !== 'reading') {
        localStorage.setItem('arcanum:lastScreen', key);
      }
    } catch (e) { /* localStorage podría estar bloqueado */ }

    // Scroll arriba al cambiar de pantalla
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ════════════════════════════════════════════════════════════════════
     4. PARTÍCULAS CÓSMICAS DE FONDO
     ════════════════════════════════════════════════════════════════════ */

  let particlesCtx = null;
  let particlesAnim = null;
  let particles = [];

  function initParticles() {
    const canvas = $('#particles-canvas');
    if (!canvas) return;
    particlesCtx = canvas.getContext('2d');

    function resize() {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    spawnParticles();
    if (state.settings.particles) startParticles();
  }

  function spawnParticles() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const count = Math.min(80, Math.floor((w * h) / 22000));
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.3,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        a: Math.random() * 0.6 + 0.2,
        twk: Math.random() * 0.02 + 0.005,
        tw: Math.random() * Math.PI * 2
      });
    }
  }

  function startParticles() {
    if (!particlesCtx || particlesAnim) return;
    const tick = () => {
      drawParticles();
      particlesAnim = requestAnimationFrame(tick);
    };
    particlesAnim = requestAnimationFrame(tick);
  }
  function stopParticles() {
    if (particlesAnim) cancelAnimationFrame(particlesAnim);
    particlesAnim = null;
    if (particlesCtx) particlesCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
  function drawParticles() {
    const ctx = particlesCtx;
    const w = window.innerWidth, h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      p.tw += p.twk;
      const tw = (Math.sin(p.tw) + 1) / 2;
      const alpha = p.a * (0.5 + 0.5 * tw);
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.8 + 0.4 * tw), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253, 230, 138, ${alpha.toFixed(3)})`;
      ctx.shadowColor = 'rgba(253, 230, 138, 0.6)';
      ctx.shadowBlur = 6;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  /* ════════════════════════════════════════════════════════════════════
     5. SPLASH + INICIO
     ════════════════════════════════════════════════════════════════════ */

  function getGreeting() {
    const h = new Date().getHours();
    const name = (state.profile && state.profile.name) ? state.profile.name : '';
    let base;
    if (h < 6)  base = 'Bajo la noche más profunda';
    else if (h < 12) base = 'Buenos días';
    else if (h < 19) base = 'Buenas tardes';
    else base = 'Buenas noches';
    return name ? `${base}, ${name}` : base;
  }

  function getDailyQuote() {
    const day = new Date().getDate();
    const q = (typeof DAILY_QUOTES !== 'undefined' && DAILY_QUOTES[(day - 1) % DAILY_QUOTES.length])
      || 'Lo que escuchas dentro de ti, cuando bajas el ruido, suele ser sabio.';
    return q;
  }

  function onEnterHome() {
    const g = $('#home-greeting');
    const q = $('#home-quote');
    if (g) g.textContent = getGreeting();
    if (q) q.textContent = '“' + getDailyQuote() + '”';
    renderHomeProfile();
  }

  function renderHomeProfile() {
    const card = $('#home-profile');
    if (!card) return;
    const p = state.profile;
    if (!p || !p.birthDate) { card.hidden = true; return; }
    const [y, m, d] = p.birthDate.split('-').map(Number);
    const sunKey  = getSunSign(m, d);
    const sun     = ZODIAC_SIGNS[sunKey];
    if (!sun) { card.hidden = true; return; }
    let line = `<strong>${sun.name}</strong> · elemento ${sun.element}`;
    if (!p.birthTimeUnknown && p.birthTime) {
      const [hh, mm] = p.birthTime.split(':').map(Number);
      const riseKey = getRisingSign(sunKey, hh || 12, mm || 0);
      const rise = ZODIAC_SIGNS[riseKey];
      if (rise) line = `<strong>${sun.name}</strong> · asc. ${rise.name}`;
    }
    $('#home-profile-line').innerHTML = line;
    $('#home-profile-symbol').textContent = sun.symbol;
    card.hidden = false;
  }

  function initSplash() {
    const enterBtn = $('#splash-enter');
    if (!enterBtn) return;
    enterBtn.addEventListener('click', () => {
      state.settings.visited = true;
      saveJSON(STORAGE_KEYS.settings, state.settings);
      // Si no completó onboarding, allá vamos
      if (!state.settings.onboarded || !state.profile) {
        showScreen('onboarding');
        initOnboarding();
      } else {
        showScreen('home');
      }
    });
  }

  /* ════════════════════════════════════════════════════════════════════
     5b. ONBOARDING — flujo cálido y conversacional
     ════════════════════════════════════════════════════════════════════ */

  const ONB_STEPS = ['welcome', 'name', 'birthdate', 'reveal'];
  let onbStepIndex = 0;
  // Buffer mientras se rellena (no se persiste hasta finalizar)
  const onbDraft = { ...DEFAULT_PROFILE };

  function initOnboarding() {
    onbStepIndex = 0;
    Object.assign(onbDraft, DEFAULT_PROFILE);
    showOnbStep(0);
    bindOnboarding();
  }

  function showOnbStep(idx) {
    onbStepIndex = idx;
    $$('.onb-step').forEach(s => {
      s.classList.remove('is-active');
      s.hidden = true;
    });
    const step = $(`.onb-step[data-onb="${ONB_STEPS[idx]}"]`);
    if (step) {
      step.hidden = false;
      step.classList.add('is-active');
    }
    updateOnbProgress(idx);
    if (ONB_STEPS[idx] === 'reveal') renderOnbReveal();
    // Foco automático en input si lo hay
    setTimeout(() => {
      const inp = step?.querySelector('input:not([type="checkbox"])');
      if (inp && idx > 0) inp.focus();
    }, 400);
  }

  function updateOnbProgress(idx) {
    const dots = $$('#onb-progress .onboarding__dot');
    dots.forEach((d, i) => {
      d.classList.remove('is-active', 'is-done');
      // Hay 7 dots representando 7 pasos (excluimos welcome)
      const dotStep = i + 1;
      if (dotStep < idx) d.classList.add('is-done');
      if (dotStep === idx) d.classList.add('is-active');
    });
  }

  function bindOnboarding() {
    // Avanzar
    $$('[data-onb-next]').forEach(btn => {
      btn.onclick = () => {
        const step = btn.getAttribute('data-onb-next');
        if (validateOnbStep(step)) {
          const next = onbStepIndex + 1;
          if (next < ONB_STEPS.length) showOnbStep(next);
        }
      };
    });
    // Atrás
    $$('[data-onb-back]').forEach(btn => {
      btn.onclick = () => {
        const prev = Math.max(0, onbStepIndex - 1);
        showOnbStep(prev);
      };
    });
    // Finalizar
    $('[data-onb-finish]')?.addEventListener('click', finishOnboarding);

    // Input nombre
    const nameInp = $('#onb-name');
    if (nameInp) {
      nameInp.value = onbDraft.name || '';
      nameInp.oninput = () => {
        onbDraft.name = nameInp.value.trim();
        toggleOnbNext('name', !!onbDraft.name);
      };
      // Enter avanza
      nameInp.onkeydown = e => {
        if (e.key === 'Enter' && onbDraft.name) {
          e.preventDefault();
          showOnbStep(onbStepIndex + 1);
        }
      };
    }

    // Opciones de intención
    $$('#onb-intentions .onb-option').forEach(opt => {
      opt.onclick = () => {
        $$('#onb-intentions .onb-option').forEach(o => o.classList.remove('is-active'));
        opt.classList.add('is-active');
        onbDraft.intention = opt.getAttribute('data-value');
        toggleOnbNext('intention', true);
        vibrate(10);
      };
    });

    // Fecha de nacimiento
    const dateInp = $('#onb-date');
    if (dateInp) {
      // Limitar fechas razonables
      const today = new Date();
      dateInp.max = todayKey(today);
      dateInp.min = '1900-01-01';
      dateInp.value = onbDraft.birthDate || '';
      dateInp.oninput = () => {
        onbDraft.birthDate = dateInp.value;
        const valid = !!dateInp.value;
        toggleOnbNext('birthdate', valid);
        // Mostrar pista del signo solar
        if (valid) {
          const [, m, d] = dateInp.value.split('-').map(Number);
          const sunKey = getSunSign(m, d);
          const sun = ZODIAC_SIGNS[sunKey];
          const hint = $('#onb-date-hint');
          if (sun && hint) {
            hint.hidden = false;
            hint.textContent = `${sun.symbol} Tu sol está en ${sun.name}`;
          }
        } else {
          $('#onb-date-hint').hidden = true;
        }
      };
    }

    // Hora de nacimiento
    const timeInp = $('#onb-time');
    const timeUnknown = $('#onb-time-unknown');
    if (timeInp) {
      timeInp.value = onbDraft.birthTime || '';
      timeInp.oninput = () => {
        onbDraft.birthTime = timeInp.value;
        if (timeInp.value) {
          onbDraft.birthTimeUnknown = false;
          timeUnknown.checked = false;
        }
      };
    }
    if (timeUnknown) {
      timeUnknown.onchange = () => {
        if (timeUnknown.checked) {
          onbDraft.birthTimeUnknown = true;
          onbDraft.birthTime = null;
          timeInp.value = '';
        } else {
          onbDraft.birthTimeUnknown = false;
        }
      };
    }

    // Lugar
    const placeInp = $('#onb-place');
    if (placeInp) {
      placeInp.value = onbDraft.birthPlace || '';
      placeInp.oninput = () => {
        onbDraft.birthPlace = placeInp.value.trim();
        toggleOnbNext('birthplace', !!onbDraft.birthPlace);
      };
      placeInp.onkeydown = e => {
        if (e.key === 'Enter' && onbDraft.birthPlace) {
          e.preventDefault();
          showOnbStep(onbStepIndex + 1);
        }
      };
    }

    // Opciones de experiencia
    $$('#onb-experience .onb-option').forEach(opt => {
      opt.onclick = () => {
        $$('#onb-experience .onb-option').forEach(o => o.classList.remove('is-active'));
        opt.classList.add('is-active');
        onbDraft.experience = opt.getAttribute('data-value');
        toggleOnbNext('experience', true);
        vibrate(10);
      };
    });
  }

  function toggleOnbNext(stepKey, enabled) {
    const btn = document.querySelector(`[data-onb-next="${stepKey}"]`);
    if (btn) btn.disabled = !enabled;
  }

  function validateOnbStep(stepKey) {
    switch (stepKey) {
      case 'welcome':    return true;
      case 'name':       return !!onbDraft.name;
      case 'intention':  return !!onbDraft.intention;
      case 'birthdate':  return !!onbDraft.birthDate;
      case 'birthtime':  return true; // siempre opcional, el botón está habilitado
      case 'birthplace': return !!onbDraft.birthPlace;
      case 'experience': return !!onbDraft.experience;
      default: return true;
    }
  }

  function renderOnbReveal() {
    if (!onbDraft.birthDate) return;
    const [, m, d] = onbDraft.birthDate.split('-').map(Number);
    const sunKey = getSunSign(m, d);
    const sun = ZODIAC_SIGNS[sunKey];
    if (!sun) return;

    let riseLine = '';
    if (!onbDraft.birthTimeUnknown && onbDraft.birthTime) {
      const [hh, mm] = onbDraft.birthTime.split(':').map(Number);
      const riseKey = getRisingSign(sunKey, hh, mm);
      const rise = ZODIAC_SIGNS[riseKey];
      if (rise) riseLine = `<span class="onb-pill"><span class="onb-pill__sym">${rise.symbol}</span>Asc. ${escapeHTML(rise.name)}</span>`;
    }

    $('#onb-reveal-symbol').textContent = sun.symbol;
    $('#onb-reveal-title').innerHTML = `${escapeHTML(onbDraft.name)},<br/>tu sol brilla en ${escapeHTML(sun.name)}`;

    const intentionTexts = {
      amor: 'el amor te trae aquí. Las cartas tienen mucho que decirte sobre el corazón.',
      trabajo: 'estás en una fase de movimiento práctico. El mazo te acompañará en lo material.',
      autoconocimiento: 'has venido a mirarte. La mejor decisión que se puede tomar.',
      proposito: 'buscas dirección. Las cartas son brújula cuando se las pregunta con verdad.',
      curiosidad: 'la curiosidad ya es una forma de sabiduría. Bienvenida sea.'
    };
    const intText = intentionTexts[onbDraft.intention] || '';
    $('#onb-reveal-text').innerHTML = `Has nacido bajo el signo de <strong>${escapeHTML(sun.name)}</strong>, regido por <strong>${escapeHTML(sun.ruler)}</strong>. ${intText ? 'Y ' + intText : ''}`;

    const pills = [
      `<span class="onb-pill"><span class="onb-pill__sym">${sun.symbol}</span>${escapeHTML(sun.name)}</span>`,
      riseLine,
      `<span class="onb-pill"><span class="onb-pill__sym">${elementSymbol(sun.element)}</span>Elemento ${escapeHTML(sun.element)}</span>`
    ].filter(Boolean).join('');
    $('#onb-reveal-pills').innerHTML = pills;
  }

  function finishOnboarding() {
    onbDraft.completedAt = Date.now();
    state.profile = { ...onbDraft };
    saveJSON(STORAGE_KEYS.profile, state.profile);

    // Sincronizar también con state.astro para reuso
    state.astro = {
      name: state.profile.name,
      date: state.profile.birthDate,
      time: state.profile.birthTimeUnknown ? '12:00' : (state.profile.birthTime || '12:00'),
      city: state.profile.birthPlace
    };
    saveJSON(STORAGE_KEYS.astro, state.astro);

    state.settings.onboarded = true;
    saveJSON(STORAGE_KEYS.settings, state.settings);

    showToast(`Bienvenida, ${state.profile.name} ✦`);
    showScreen('home');
  }

  /* ════════════════════════════════════════════════════════════════════
     5c. GLOSARIO — explicaciones plain-language
     ════════════════════════════════════════════════════════════════════ */

  const GLOSSARY = [
    {
      sym: '☷', title: 'Arcanos mayores',
      text: 'Son las <strong>22 cartas grandes</strong> del mazo. Hablan de los temas de fondo de la vida: los grandes momentos, los arquetipos psicológicos, las lecciones que dejan huella. Cuando aparecen varias en una lectura, suele indicar que el momento que vives no es trivial — algo importante para ti se está moviendo.'
    },
    {
      sym: '✦', title: 'Arcanos menores',
      text: 'Son las <strong>56 cartas restantes</strong>, divididas en cuatro palos (Cálices, Espadas, Varas, Pentáculos). Hablan de lo cotidiano, las situaciones del día a día, las emociones, decisiones y movimientos prácticos.'
    },
    {
      sym: '↺', title: 'Carta invertida',
      text: 'Cuando una carta sale <strong>al revés</strong>, no significa "lo malo". Significa que su energía está <em>bloqueada, en sombra o pidiendo integración</em>. Es una invitación a mirar lo que evitas, no una sentencia.'
    },
    {
      sym: '🜂', title: 'Los cuatro elementos',
      text: '<strong>Fuego</strong> (Varas): pasión y acción. <strong>Agua</strong> (Cálices): emoción e intuición. <strong>Aire</strong> (Espadas): mente e ideas. <strong>Tierra</strong> (Pentáculos): cuerpo y materia. Cada palo del tarot pertenece a un elemento, y cada signo zodiacal también.'
    },
    {
      sym: '☉', title: 'Signo solar',
      text: 'Es <strong>tu signo de toda la vida</strong>: el que sale al preguntar "¿de qué signo eres?". Lo determina el día de tu nacimiento. Representa tu <em>esencia, tu fuego interno, tu identidad central</em>.'
    },
    {
      sym: '☾', title: 'Ascendente',
      text: 'Es la <strong>máscara con la que el mundo te conoce primero</strong>. Lo determina tu hora exacta de nacimiento. Por eso a veces alguien te dice "yo no te veo así de [tu signo]" — quizá tu ascendente está hablando más fuerte.'
    },
    {
      sym: '✺', title: 'Elemento dominante',
      text: 'Cuando varios indicadores de tu mapa caen en el mismo elemento, este se vuelve <strong>tu lengua materna energética</strong>. Por ejemplo, alguien con sol y ascendente de fuego es muy "fuego": directo, apasionado, expresivo.'
    },
    {
      sym: '➤', title: 'Posición en una tirada',
      text: 'Cada carta no se lee sola: se lee según <strong>el lugar que ocupa</strong>. La misma carta dice cosas distintas según si cae en "pasado" o en "consejo". Por eso las tiradas tienen estructura — son lentes diferentes para mirar lo mismo.'
    },
    {
      sym: '✦', title: 'La pregunta',
      text: 'No es obligatoria, pero la lectura cambia mucho cuando la haces. Funciona mejor preguntar <strong>"¿cómo me muevo en…?"</strong> que <strong>"¿él me quiere?"</strong>. Las cartas responden mejor a las preguntas que devuelven el poder a tu propio corazón.'
    },
    {
      sym: '☯', title: 'Carta del día',
      text: 'Es <strong>una sola carta determinada por la fecha</strong>. La misma persona ve la misma carta todo el día — y otra al amanecer siguiente. Es una pequeña meditación: una pregunta para llevar contigo.'
    }
  ];

  function renderGlossary() {
    const target = $('#glossary-content');
    if (!target) return;
    target.innerHTML = GLOSSARY.map(g => `
      <div class="glossary-item">
        <div class="glossary-item__head">
          <span class="glossary-item__sym">${g.sym}</span>
          <span class="glossary-item__title">${escapeHTML(g.title)}</span>
        </div>
        <p class="glossary-item__text">${g.text}</p>
      </div>
    `).join('');
  }

  function openGlossary() {
    renderGlossary();
    const m = $('#modal-glossary');
    if (!m) return;
    m.hidden = false;
    m.setAttribute('aria-hidden', 'false');
    setTimeout(() => m.classList.add('is-open'), 10);
  }
  function closeGlossary() {
    const m = $('#modal-glossary');
    if (!m) return;
    m.classList.remove('is-open');
    setTimeout(() => {
      m.hidden = true;
      m.setAttribute('aria-hidden', 'true');
    }, 250);
  }

  /* ════════════════════════════════════════════════════════════════════
     5d. INFO TOOLTIPS INLINE — para términos en interpretación
     ════════════════════════════════════════════════════════════════════ */

  const INFO_TIPS = {
    'arcano-mayor': '<strong>Arcanos mayores:</strong> son las 22 cartas centrales del mazo. Representan momentos importantes y arquetipos psicológicos profundos.',
    'invertida':    '<strong>Carta invertida:</strong> no significa una mala noticia. Suele señalar una energía bloqueada, dormida o que pide más cuidado del habitual.',
    'elemento':     '<strong>Elemento:</strong> fuego, agua, aire o tierra. Cada uno representa un tipo de energía emocional o vital. Ver más en el diccionario.',
    'palo':         '<strong>Palo:</strong> los menores se agrupan en cuatro familias —Cálices, Espadas, Varas, Pentáculos— cada una con su elemento y su tema.',
    'ascendente':   '<strong>Ascendente:</strong> el signo del horizonte al nacer. Es la primera impresión que das, la forma en que el mundo te encuentra.',
    'sol':          '<strong>Signo solar:</strong> tu signo de nacimiento. Representa la esencia central de tu personalidad.'
  };

  function bindInfoTriggers(container) {
    if (!container) container = document;
    $$('.info-trigger', container).forEach(btn => {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        const key = btn.getAttribute('data-info');
        toggleInfoPopup(btn, key);
      });
    });
  }

  function toggleInfoPopup(triggerEl, key) {
    // Si ya hay un popup justo después, lo eliminamos
    const next = triggerEl.parentNode.querySelector(':scope + .info-popup');
    if (next && next.dataset.for === key) {
      next.remove();
      return;
    }
    // Eliminar otros popups visibles
    $$('.info-popup').forEach(p => p.remove());

    const tip = INFO_TIPS[key];
    if (!tip) return;
    const popup = document.createElement('div');
    popup.className = 'info-popup';
    popup.dataset.for = key;
    popup.innerHTML = tip;
    triggerEl.parentNode.parentNode.insertBefore(popup, triggerEl.parentNode.nextSibling);
  }

  function infoTrigger(key, label = '?') {
    return `<button class="info-trigger" type="button" data-info="${key}" aria-label="Saber más">${label}</button>`;
  }

  /* ════════════════════════════════════════════════════════════════════
     6. DEFINICIÓN DE TIRADAS
     ════════════════════════════════════════════════════════════════════ */

  // SVGs evocadores para cada tirada — gold lines sobre transparente
  const SPREAD_ICONS = {
    single: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="24" r="6" fill="currentColor" fill-opacity="0.15"/>
      <path d="M24 8 L26 22 L40 24 L26 26 L24 40 L22 26 L8 24 L22 22 Z" fill="currentColor" fill-opacity="0.85"/>
      <circle cx="24" cy="24" r="14" stroke-opacity="0.35"/>
      <circle cx="24" cy="24" r="20" stroke-opacity="0.2"/>
    </svg>`,
    three: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
      <rect x="8"  y="14" width="9" height="22" rx="1.5" stroke-opacity="0.6"/>
      <rect x="19.5" y="10" width="9" height="26" rx="1.5"/>
      <rect x="31" y="14" width="9" height="22" rx="1.5" stroke-opacity="0.6"/>
      <circle cx="12.5" cy="25" r="1.2" fill="currentColor" stroke="none"/>
      <circle cx="24" cy="23" r="1.4" fill="currentColor" stroke="none"/>
      <circle cx="35.5" cy="25" r="1.2" fill="currentColor" stroke="none"/>
    </svg>`,
    cross: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round">
      <circle cx="24" cy="24" r="3.5" fill="currentColor" fill-opacity="0.3"/>
      <line x1="24" y1="6" x2="24" y2="14"/>
      <line x1="24" y1="34" x2="24" y2="42"/>
      <line x1="6" y1="24" x2="14" y2="24"/>
      <line x1="34" y1="24" x2="42" y2="24"/>
      <circle cx="24" cy="6" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="24" cy="42" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="6" cy="24" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="42" cy="24" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="24" cy="24" r="11" stroke-opacity="0.3"/>
    </svg>`,
    love: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 38 C 14 30, 8 22, 12 16 C 15 12, 21 13, 24 18 C 27 13, 33 12, 36 16 C 40 22, 34 30, 24 38 Z"
            fill="currentColor" fill-opacity="0.18"/>
      <circle cx="17" cy="17" r="2" fill="currentColor" stroke="none"/>
      <circle cx="31" cy="17" r="2" fill="currentColor" stroke="none"/>
      <path d="M14 8 L14 12 M12 10 L16 10" stroke-opacity="0.6"/>
      <path d="M34 8 L34 12 M32 10 L36 10" stroke-opacity="0.6"/>
    </svg>`,
    money: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M24 8 C 26 14, 30 18, 36 18 C 32 22, 30 26, 30 32 C 26 28, 22 28, 18 32 C 18 26, 16 22, 12 18 C 18 18, 22 14, 24 8 Z"
            fill="currentColor" fill-opacity="0.15"/>
      <circle cx="24" cy="22" r="3" stroke-opacity="0.6"/>
      <line x1="24" y1="32" x2="24" y2="40"/>
      <line x1="20" y1="40" x2="28" y2="40"/>
    </svg>`,
    destiny: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M8 36 C 16 28, 22 26, 32 16" stroke-opacity="0.7"/>
      <path d="M30 12 L36 14 L34 20" stroke-width="1.6"/>
      <circle cx="32" cy="16" r="2" fill="currentColor" stroke="none"/>
      <circle cx="10" cy="34" r="1.5" fill="currentColor" stroke="none" opacity="0.6"/>
      <circle cx="20" cy="28" r="1" fill="currentColor" stroke="none" opacity="0.5"/>
      <path d="M14 8 L14.8 10 L17 10 L15.2 11.5 L16 13.8 L14 12.5 L12 13.8 L12.8 11.5 L11 10 L13.2 10 Z" fill="currentColor" stroke="none" opacity="0.6"/>
    </svg>`,
    astral: `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="24" r="14" stroke-opacity="0.4"/>
      <path d="M24 10 L27.5 21 L39 21 L29.5 27.5 L33 38 L24 31.5 L15 38 L18.5 27.5 L9 21 L20.5 21 Z"
            fill="currentColor" fill-opacity="0.2"/>
      <circle cx="24" cy="24" r="2" fill="currentColor" stroke="none"/>
    </svg>`
  };

  const SPREADS = [
    {
      key: 'single',
      title: 'Una carta',
      subtitle: 'Una mirada breve a tu día',
      icon: SPREAD_ICONS.single,
      count: 1,
      layout: 'single',
      positions: [
        { name: 'Mensaje del momento', meaning: 'Lo que parece importante que veas ahora mismo.' }
      ]
    },
    {
      key: 'three',
      title: 'Tres cartas',
      subtitle: 'Pasado · Presente · Camino',
      icon: SPREAD_ICONS.three,
      count: 3,
      layout: 'three',
      positions: [
        { name: 'Pasado',   meaning: 'Lo que ha estado dando forma al momento que vives.' },
        { name: 'Presente', meaning: 'Cómo se siente este instante, en lo más honesto.' },
        { name: 'Camino',   meaning: 'Hacia dónde apuntan las cosas si todo sigue igual.' }
      ]
    },
    {
      key: 'cross',
      title: 'Cruz reflexiva',
      subtitle: 'Una mirada en cinco ángulos',
      icon: SPREAD_ICONS.cross,
      count: 5,
      layout: 'cross',
      positions: [
        { name: 'Situación', meaning: 'El centro de lo que estás atravesando.' },
        { name: 'Desafío',   meaning: 'Lo que se cruza en tu camino y pide ser entendido.' },
        { name: 'Raíces',    meaning: 'Lo que dejaste atrás pero todavía influye.' },
        { name: 'Horizonte', meaning: 'Lo que se acerca si mantienes este rumbo.' },
        { name: 'Pista',     meaning: 'Una sugerencia útil para los próximos días.' }
      ]
    },
    {
      key: 'love',
      title: 'Vínculos',
      subtitle: 'Tres voces sobre una relación',
      icon: SPREAD_ICONS.love,
      count: 3,
      layout: 'love',
      positions: [
        { name: 'Tú',                meaning: 'Lo que de verdad habita en ti hoy en este vínculo.' },
        { name: 'La otra parte',     meaning: 'Cómo parece estar la otra persona o el vínculo en sí.' },
        { name: 'El movimiento',     meaning: 'Hacia dónde parece moverse esta relación.' }
      ]
    },
    {
      key: 'money',
      title: 'Trabajo y proyectos',
      subtitle: 'Cómo está el terreno material',
      icon: SPREAD_ICONS.money,
      count: 3,
      layout: 'money',
      positions: [
        { name: 'Tu energía actual', meaning: 'Cómo te encuentras tú con lo profesional o material.' },
        { name: 'Lo que pesa',       meaning: 'Lo que está limitando tu avance, dentro o fuera.' },
        { name: 'Lo que se abre',    meaning: 'La oportunidad o dirección que está disponible.' }
      ]
    },
    {
      key: 'destiny',
      title: 'Camino',
      subtitle: 'Una mirada al rumbo personal',
      icon: SPREAD_ICONS.destiny,
      count: 3,
      layout: 'destiny',
      positions: [
        { name: 'Lo que te llama',  meaning: 'Esa voz interna que sigue susurrando algo, aunque no sepas bien qué.' },
        { name: 'Lo que frena',     meaning: 'Lo que aún cargas y dificulta moverte.' },
        { name: 'El horizonte',     meaning: 'La dirección posible si das un paso honesto.' }
      ]
    },
    {
      key: 'astral',
      title: 'Las cinco capas',
      subtitle: 'Energía · Mente · Corazón · Cuerpo · Camino',
      icon: SPREAD_ICONS.astral,
      count: 5,
      layout: 'astral',
      positions: [
        { name: 'Energía',  meaning: 'Cómo está tu fuerza vital general estos días.' },
        { name: 'Mente',    meaning: 'Cómo se mueven hoy tus pensamientos y palabras.' },
        { name: 'Corazón',  meaning: 'Tu paisaje emocional más profundo en este momento.' },
        { name: 'Cuerpo',   meaning: 'Lo que tu cuerpo te está diciendo, si lo escuchas.' },
        { name: 'Camino',   meaning: 'La dirección general del momento que vives.' }
      ]
    }
  ];

  function getSpread(key) {
    return SPREADS.find(s => s.key === key);
  }

  /* ════════════════════════════════════════════════════════════════════
     7. RENDERIZADO DEL SELECTOR DE TIRADAS
     ════════════════════════════════════════════════════════════════════ */

  function renderSpreads() {
    const list = $('#spreads-list');
    if (!list) return;
    list.innerHTML = '';
    SPREADS.forEach(sp => {
      const btn = document.createElement('button');
      btn.className = 'spread-card';
      btn.type = 'button';
      btn.innerHTML = `
        <span class="spread-card__icon">${sp.icon}</span>
        <span class="spread-card__body">
          <span class="spread-card__title">${escapeHTML(sp.title)}</span>
          <span class="spread-card__sub">${escapeHTML(sp.subtitle)}</span>
        </span>
        <span class="spread-card__count">${sp.count} ${sp.count === 1 ? 'carta' : 'cartas'}</span>
      `;
      btn.addEventListener('click', () => startReading(sp.key));
      list.appendChild(btn);
    });
  }

  /* ════════════════════════════════════════════════════════════════════
     8. FLUJO DE LECTURA — INICIO
     ════════════════════════════════════════════════════════════════════ */

  function startReading(spreadKey) {
    const sp = getSpread(spreadKey);
    if (!sp) return;
    state.currentSpread = sp;
    state.deck = shuffle(ARCANUM_DECK.all);
    state.selectedCards = [];
    state.question = '';

    const titleEl = $('#reading-title');
    if (titleEl) titleEl.textContent = sp.title;

    // Reset visibility de los pasos
    showStep('step-question');
    const qEl = $('#user-question'); if (qEl) qEl.value = '';
    const totalEl = $('#selected-total'); if (totalEl) totalEl.textContent = sp.count;
    const neededEl = $('#cards-needed');  if (neededEl) neededEl.textContent = sp.count;

    showScreen('reading');
  }

  function showStep(id) {
    $$('.reading__step').forEach(el => el.hidden = (el.id !== id));
  }

  /* ════════════════════════════════════════════════════════════════════
     9. FASE 1 → MEZCLAR
     ════════════════════════════════════════════════════════════════════ */

  function onShuffleClick() {
    const qEl = $('#user-question');
    state.question = qEl ? qEl.value.trim() : '';
    showStep('step-shuffle');
    soundShuffle(true);
    vibrate(20);

    const messages = [
      'Las cartas se barajan…',
      'Respira hondo mientras se mezclan…',
      'Deja que tu pregunta se asiente…',
      'En unos segundos podrás elegir…'
    ];
    let i = 0;
    const msgEl = $('#shuffle-msg');
    const msgInt = setInterval(() => {
      i = (i + 1) % messages.length;
      if (msgEl) msgEl.textContent = messages[i];
    }, 900);

    setTimeout(() => {
      clearInterval(msgInt);
      soundShuffle(false);
      // Re-baraja (refuerzo simbólico) y abre selector
      state.deck = shuffle(state.deck);
      buildFanDeck();
      showStep('step-select');
    }, 3200);
  }

  /* ════════════════════════════════════════════════════════════════════
     10. FASE 2 → ABANICO DE SELECCIÓN
     ════════════════════════════════════════════════════════════════════ */

  function buildFanDeck() {
    const fan = $('#fan-deck');
    if (!fan) return;
    fan.innerHTML = '';
    const N = 21; // mostramos 21 cartas en abanico
    const cards = state.deck.slice(0, N);
    const arc = 60; // grados totales del abanico
    const step = arc / (N - 1);
    const start = -arc / 2;

    cards.forEach((card, idx) => {
      const angle = start + idx * step;
      const wrap = document.createElement('button');
      wrap.className = 'fan-card';
      wrap.type = 'button';
      wrap.style.setProperty('--angle', `${angle}deg`);
      wrap.style.setProperty('--idx', idx);
      wrap.dataset.cardId = card.id;
      wrap.innerHTML = `
        <div class="fan-card__back">
          <div class="fan-card__sigil">✦</div>
        </div>
      `;
      wrap.addEventListener('click', () => onFanCardClick(wrap, card));
      fan.appendChild(wrap);
    });

    const cnt = $('#selected-count');
    if (cnt) cnt.textContent = '0';
  }

  function onFanCardClick(el, card) {
    if (el.classList.contains('is-selected')) return;
    const need = state.currentSpread.count;
    if (state.selectedCards.length >= need) return;

    el.classList.add('is-selected');
    vibrate(15);
    soundChime(660 + state.selectedCards.length * 80);

    // ~28% probabilidad de que salga invertida
    const isInverted = Math.random() < 0.28;
    state.selectedCards.push({ ...card, isInverted });

    const cnt = $('#selected-count');
    if (cnt) cnt.textContent = state.selectedCards.length;

    if (state.selectedCards.length === need) {
      setTimeout(() => goToReveal(), 700);
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     11. FASE 3 → REVELACIÓN DE CARTAS
     ════════════════════════════════════════════════════════════════════ */

  function goToReveal() {
    showStep('step-reveal');
    const layout = $('#spread-layout');
    if (!layout) return;

    const sp = state.currentSpread;
    layout.className = 'spread-layout spread-layout--' + sp.layout;
    layout.innerHTML = '';

    state.selectedCards.forEach((card, idx) => {
      const pos = sp.positions[idx];
      const slot = document.createElement('div');
      slot.className = 'spread-slot';
      slot.style.setProperty('--pos', idx);
      slot.innerHTML = `
        <div class="spread-slot__label">${escapeHTML(pos.name)}</div>
        ${renderCard3D(card, idx)}
      `;
      layout.appendChild(slot);
    });

    // Volteo secuencial con partículas doradas
    const cards3d = $$('.card-3d', layout);
    cards3d.forEach((c, i) => {
      setTimeout(() => {
        c.classList.add('is-flipped');
        burstSparks(c);
        vibrate(10);
        soundChime(440 + i * 60);
      }, 350 + i * 480);
    });

    // Activar tilt 3D cuando todas estén reveladas
    setTimeout(() => bindCardTilt(layout), 350 + cards3d.length * 480 + 600);
  }

  // ──────────────────────────────────────────────────────────────────
  // Partículas doradas al revelar una carta — burst breve sobre el card
  // ──────────────────────────────────────────────────────────────────
  function burstSparks(cardEl) {
    if (!cardEl) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const burst = document.createElement('div');
    burst.className = 'card-burst';
    cardEl.appendChild(burst);

    const N = 14;
    for (let i = 0; i < N; i++) {
      const s = document.createElement('span');
      s.className = 'card-burst__spark';
      const angle = (Math.PI * 2 * i / N) + Math.random() * 0.3;
      const dist = 60 + Math.random() * 50;
      s.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      s.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      s.style.setProperty('--delay', (Math.random() * 120) + 'ms');
      s.style.setProperty('--size', (3 + Math.random() * 3) + 'px');
      burst.appendChild(s);
    }

    setTimeout(() => burst.remove(), 1400);
  }

  // Convierte número arábigo (0-22) a romano editorial
  function toRoman(n) {
    if (n === 0) return '0';
    const map = [
      [10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']
    ];
    let r = '';
    for (const [v, s] of map) { while (n >= v) { r += s; n -= v; } }
    return r;
  }

  function renderCard3D(card, idx) {
    const grad = card.gradient || ['#c9a96e', '#e09b85', '#c97b63'];
    const elemCls = card.element ? ` card-3d--${card.element}` : '';
    const arcanaCls = card.arcana === 'major' ? ' card-3d--mayor' : '';
    const cls = `card-3d${card.isInverted ? ' is-inverted' : ''}${elemCls}${arcanaCls}`;

    // Etiqueta del número
    let cornerLabel = '';
    let arcanaTag = '';
    if (card.arcana === 'major') {
      cornerLabel = toRoman(card.number || 0);
      arcanaTag = 'Arcano mayor';
    } else if (card.suit && SUITS[card.suit]) {
      cornerLabel = card.number > 10
        ? (COURT_MEANINGS && COURT_MEANINGS[card.courtRole]?.title?.[0] || '·')
        : (card.number || '').toString();
      arcanaTag = SUITS[card.suit].name;
    }

    // Arte de la carta — sistema único:
    //   1) MAYORES → URL Wikimedia (Pamela Colman Smith 1909, dominio público)
    //                Renderizamos un <img> SOBRE el SVG fallback. Si la imagen falla,
    //                el SVG queda visible debajo (capa de respaldo).
    //   2) MENORES → SVG mejorado en ARCANUM_ART (gold-on-cream, estilo Rider-Waite)
    //   3) Último recurso → símbolo grande con nombre.
    let frontArt = '';
    let backArt = '';
    let useImage = false;

    // Cadena de URLs candidatas — si la primera falla, prueba la siguiente, etc.
    const imageURLs = (typeof getCardImageURLs === 'function')
      ? getCardImageURLs(card, 600) : [];
    const imageURL = imageURLs[0] || null;

    // Construye SVG fallback (siempre lo tenemos disponible aunque la URL cargue bien)
    let svgFallback = '';
    if (typeof ARCANUM_ART !== 'undefined') {
      if (card.arcana === 'major' && ARCANUM_ART.MAJORS[card.id]) {
        svgFallback = ARCANUM_ART.MAJORS[card.id];
      } else if (card.arcana === 'minor' && typeof ARCANUM_ART.buildMinor === 'function') {
        svgFallback = ARCANUM_ART.buildMinor(card);
      }
    }
    if (!svgFallback) {
      svgFallback = `<div class="card-3d__art-circle"><span class="card-3d__art-symbol">${card.symbol || '✦'}</span></div>`;
    }

    if (imageURL) {
      useImage = true;
      // Cadena onerror: cada fallo intenta el siguiente URL. Si todos fallan, oculta y queda el SVG.
      // onload: marca como is-loaded para que el SVG fallback debajo se oculte.
      const restURLs = JSON.stringify(imageURLs.slice(1));
      frontArt = `
        <div class="card-art-stack">
          <div class="card-art-stack__fallback">${svgFallback}</div>
          <img class="card-img card-img--front"
               src="${imageURL}"
               alt="${escapeHTML(card.name)}"
               loading="lazy"
               draggable="false"
               data-fallback-urls='${restURLs.replace(/'/g, '&#39;')}'
               onload="this.classList.add('is-loaded')"
               onerror="(function(img){var u=JSON.parse(img.dataset.fallbackUrls||'[]');if(u.length){img.src=u.shift();img.dataset.fallbackUrls=JSON.stringify(u);}else{img.style.display='none';}})(this)">
        </div>
      `;
    } else {
      frontArt = svgFallback;
    }

    // Reverso de carta: SVG inline siempre (sin imagen externa)
    backArt = (typeof ARCANUM_ART !== 'undefined' && ARCANUM_ART.BACK)
      ? ARCANUM_ART.BACK
      : `<div class="card-3d__pattern"></div><div class="card-3d__sigil">✦</div>`;

    // Cuando usamos imagen externa la carta TRAE su nombre/número impresos.
    const overlayClass = useImage ? 'card-3d__overlay card-3d__overlay--minimal' : 'card-3d__overlay';
    const overlayHTML = useImage
      ? (card.isInverted ? '<div class="card-3d__inv-tag">Invertida</div>' : '')
      : `
          <div class="card-3d__corner card-3d__corner--tl">${cornerLabel}</div>
          <div class="card-3d__corner card-3d__corner--tr">${escapeHTML(arcanaTag)}</div>
          <div class="card-3d__title">${escapeHTML(card.name)}</div>
          ${card.isInverted ? '<div class="card-3d__inv-tag">Invertida</div>' : ''}
        `;

    return `
      <div class="${cls}${useImage ? ' card-3d--has-img' : ''}" data-idx="${idx}" data-tilt
           style="--g1:${grad[0]};--g2:${grad[1]};--g3:${grad[2]}">
        <div class="card-3d__inner">
          <div class="card-3d__face card-3d__back">${backArt}</div>
          <div class="card-3d__face card-3d__front">
            ${frontArt}
            <div class="${overlayClass}">${overlayHTML}</div>
          </div>
        </div>
        <div class="card-3d__shadow"></div>
      </div>
    `;
  }

  // ──────────────────────────────────────────────────────────────────
  // Efecto 3D-tilt con seguimiento del puntero (gyroscope)
  // Da a cada carta sensación de objeto físico 3D que reacciona a la luz.
  // Se activa solo en cartas reveladas (interp/daily), no en el deck en abanico.
  // Respeta prefers-reduced-motion.
  // ──────────────────────────────────────────────────────────────────
  function bindCardTilt(container) {
    if (!container) container = document;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = $$('[data-tilt]', container);
    cards.forEach(card => {
      if (card.dataset.tiltBound) return;
      card.dataset.tiltBound = '1';

      let raf = null;
      const onMove = (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX || (e.touches && e.touches[0]?.clientX) || rect.left + rect.width / 2) - rect.left;
        const py = (e.clientY || (e.touches && e.touches[0]?.clientY) || rect.top + rect.height / 2) - rect.top;
        const rx = Math.max(-1, Math.min(1, (px - rect.width / 2) / (rect.width / 2)));
        const ry = Math.max(-1, Math.min(1, (py - rect.height / 2) / (rect.height / 2)));
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.setProperty('--tilt-x', rx.toFixed(3));
          card.style.setProperty('--tilt-y', ry.toFixed(3));
          card.classList.add('is-tilting');
        });
      };
      const onLeave = () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.setProperty('--tilt-x', '0');
        card.style.setProperty('--tilt-y', '0');
        card.classList.remove('is-tilting');
      };

      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
      card.addEventListener('pointercancel', onLeave);
    });
  }

  function onInterpretClick() {
    showStep('step-interpret');
    const target = $('#interpretation-content');
    if (!target) return;
    target.innerHTML = renderInterpretation(
      state.currentSpread,
      state.selectedCards,
      state.question
    );
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Vincular tooltips inline
    bindInfoTriggers(target);

    // Cierre de la guía de lectura primera vez
    const closeGuide = $('#close-read-guide', target);
    if (closeGuide) {
      closeGuide.addEventListener('click', () => {
        $('#read-guide', target)?.remove();
        state.settings.seenReadGuide = true;
        saveJSON(STORAGE_KEYS.settings, state.settings);
      });
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     12. MOTOR DE INTERPRETACIÓN
     ────────────────────────────────────────────────────────────────────
     Combina nombre + significado (recto/invertido) + posición + descripción.
     Detecta combinaciones: mayoría de mayores, elemento dominante, palo
     predominante, mayoría invertida. Genera párrafos en tono de tarotista
     profesional moderno en español.
     ════════════════════════════════════════════════════════════════════ */

  function renderInterpretation(spread, cards, question) {
    const intro = buildIntro(spread, cards, question);
    const perCard = cards.map((c, i) => buildCardBlock(c, spread.positions[i], i)).join('');
    const synthesis = buildSynthesis(spread, cards);

    // Guía de lectura primera vez (solo principiantes)
    let guide = '';
    const isFirstTime = state.profile?.experience === 'primera' && !state.settings.seenReadGuide;
    if (isFirstTime) {
      guide = `
        <div class="read-guide" id="read-guide">
          <div class="read-guide__title">Cómo leer esto · primera vez</div>
          <p class="read-guide__text">Lo que sigue es un espejo, no un pronóstico. Tiene tres partes: una <strong>mirada general</strong> a lo que muestran las cartas que elegiste, las <strong>cartas una por una</strong> con preguntas para ti, y una <strong>síntesis</strong> que recoge los hilos. Las cartas <em>invertidas</em> no son negativas — son matices que piden atención más cuidadosa. Toca el ${infoTrigger('invertida')} junto a cualquier término para entenderlo mejor.</p>
          <button class="read-guide__close" id="close-read-guide">Entendido, no mostrar más</button>
        </div>
      `;
    }

    return `
      <article class="interp">
        <header class="interp__head">
          <span class="interp__spread">${escapeHTML(spread.title)}</span>
          ${question ? `<p class="interp__question">«${escapeHTML(question)}»</p>` : ''}
        </header>
        ${guide}
        <section class="interp__intro">${intro}</section>
        <section class="interp__cards">${perCard}</section>
        <section class="interp__synth">
          <h3 class="interp__synth-title">Para llevarte</h3>
          ${synthesis}
        </section>
        <p class="interp__sign">— Que estas palabras te acompañen estos días.</p>
      </article>
    `;
  }

  function buildIntro(spread, cards, question) {
    const openings = [
      'Hay algo aquí que vale la pena leer despacio. Esto es lo que las cartas tienen que decirte hoy.',
      'Antes de meternos en cada carta, una mirada al conjunto. Suele decir más de lo que parece.',
      'Las cartas no adivinan tu vida — la describen. Y lo que han dibujado tiene sentido.',
      'Tómate un momento. Lo que sigue está pensado para ti, no para sonar bonito.'
    ];
    let txt = `<p>${pick(openings)}</p>`;

    if (question) {
      const qOpen = [
        `Llevabas dentro esta pregunta: <em>«${escapeHTML(question)}»</em>. Es una buena pregunta. Vale la pena tomársela en serio.`,
        `Tu pregunta —<em>«${escapeHTML(question)}»</em>— marca el tono de toda la lectura. Mantenla cerca mientras lees, te va a servir de brújula.`,
        `Hiciste una pregunta importante: <em>«${escapeHTML(question)}»</em>. Lo que aparece a continuación responde a eso, aunque a veces de forma que no esperas.`
      ];
      txt += `<p>${pick(qOpen)}</p>`;
    }

    // Tono general — sin lenguaje místico, como escritor de horóscopos modernos
    const majors = cards.filter(c => c.arcana === 'major').length;
    const inv = cards.filter(c => c.isInverted).length;

    if (majors >= Math.ceil(cards.length / 2) && cards.length > 1) {
      txt += `<p>Esto que estás viviendo no es un detalle pasajero. <strong>Aparecen varias cartas mayores</strong>, y eso suele significar que el momento te importa más de lo que estás reconociendo. No corras: léelo todo con calma.</p>`;
    }
    if (inv >= Math.ceil(cards.length / 2) && cards.length > 1) {
      txt += `<p>Hay <strong>varias cartas invertidas</strong>. No te asustes — no son malas noticias. Suele aparecer así cuando llevas tiempo cargando algo en silencio o cuando necesitas mirar las cosas desde otro ángulo. Léelo como una invitación, no como un aviso.</p>`;
    }
    return txt;
  }

  function buildCardBlock(card, position, idx) {
    const meaning = card.isInverted ? card.invertedMeaning : card.positiveMeaning;
    const arcanaLabel = card.arcana === 'major' ? 'Arcano mayor' :
      (SUITS[card.suit] ? `${SUITS[card.suit].name} · ${SUITS[card.suit].element}` : '');
    const arcanaInfo = card.arcana === 'major' ? infoTrigger('arcano-mayor') : infoTrigger('palo');
    const elemInfoTrigger = card.element ? infoTrigger('elemento') : '';
    const astro = card.astrology ? `<span class="interp__chip">✦ ${escapeHTML(card.astrology)}</span>` : '';
    const elem = card.element ? `<span class="interp__chip">${elementSymbol(card.element)} ${escapeHTML(card.element)}${elemInfoTrigger}</span>` : '';

    const grad = card.gradient || ['#c9a96e', '#e09b85', '#c97b63'];

    // La voz cálida va primero — es lo que el usuario lee y siente como suyo
    const horoscopeRead = buildHoroscopeRead(card, position, idx);
    const reflectionPrompt = generateReflectionPrompt(card, position, idx);
    const invFlag = card.isInverted ? `<span class="interp-card__inv">↺ invertida</span>${infoTrigger('invertida')}` : '';

    // El significado raw queda como contexto secundario, claramente etiquetado
    const meaningBlock = `
      <details class="interp-card__details">
        <summary class="interp-card__details-toggle">Ver significado tradicional de la carta</summary>
        <p class="interp-card__meaning">${escapeHTML(meaning)}</p>
        ${card.description ? `<p class="interp-card__desc">${escapeHTML(card.description)}</p>` : ''}
      </details>
    `;

    return `
      <div class="interp-card" style="--g1:${grad[0]};--g2:${grad[1]};--g3:${grad[2]}">
        <div class="interp-card__head">
          <div class="interp-card__symbol">${card.symbol || '✦'}</div>
          <div class="interp-card__titles">
            <h4 class="interp-card__name">${escapeHTML(card.name)} ${invFlag}</h4>
            <p class="interp-card__pos">Para <strong>${escapeHTML(position.name.toLowerCase())}</strong></p>
            <p class="interp-card__meta">${escapeHTML(arcanaLabel)} ${arcanaInfo}</p>
            <div class="interp-card__chips">${astro}${elem}</div>
          </div>
        </div>
        <div class="interp-card__horoscope">${horoscopeRead}</div>
        ${meaningBlock}
        <div class="interp-card__prompt">
          <span class="interp-card__prompt-label">Para reflexionar</span>
          <p class="interp-card__prompt-text">${reflectionPrompt}</p>
        </div>
      </div>
    `;
  }

  function generateReflectionPrompt(card, position, idx) {
    const isInv = card.isInverted;
    const elem = card.element;

    // Preguntas tipo "amigo que te conoce bien" — sin inserciones gramaticalmente forzadas
    const generalPrompts = [
      `Si tuvieras que resumir esta carta en una frase tuya, ¿cuál sería?`,
      `¿Qué es lo primero que se te viene a la cabeza al leer esto? Eso suele ser la pista.`,
      `¿Aparece alguien o algo concreto en tu mente — una persona, una conversación, una sensación familiar?`,
      `Si esta carta fuera una voz amiga hablándote sin filtros, ¿qué crees que querría que entendieras?`,
      `¿Qué parte de ti reconoce esto, y qué parte se resiste a aceptarlo?`,
      `Cuando lees esto, ¿se te aprieta algo por dentro? Ahí suele estar lo importante.`
    ];

    const invPrompts = [
      `¿Qué llevas tiempo evitando mirar de frente? No para juzgarte — solo para nombrarlo.`,
      `Si pudieras hablarle con cariño a la parte de ti que se siente así, ¿qué le dirías?`,
      `¿Qué pequeño gesto, no heroico, podrías hacer hoy para destrabar un poco esto?`,
      `¿Hay alguien con quien podrías hablar de esto, aunque solo sea para soltarlo en voz alta?`,
      `Si te dieras permiso de no tener todas las respuestas hoy, ¿qué se aliviaría?`
    ];

    const elementalPrompts = {
      fuego: [
        `¿Dónde está hoy tu energía? ¿Qué te enciende, y qué te apaga?`,
        `Si tuvieras un poco más de coraje esta semana, ¿en qué lo usarías?`,
        `¿Hay algo que sabes que tienes que hacer pero llevas tiempo dándole largas?`
      ],
      agua: [
        `¿Qué emoción está pidiendo espacio para ser sentida, sin tener que resolverla aún?`,
        `¿A qué relación —contigo o con alguien— vuelve tu mente al leer esto?`,
        `Si te permitieras llorar o reír sin filtro un momento, ¿por qué sería?`
      ],
      aire: [
        `¿Qué pensamiento estás repitiendo últimamente? ¿Es tuyo, o lo heredaste?`,
        `Si bajaras el volumen mental un momento, ¿qué quedaría debajo?`,
        `¿Hay algo que no te has permitido decir, en voz alta o por escrito?`
      ],
      tierra: [
        `¿Qué necesita tu cuerpo o tu rutina que no se está atendiendo?`,
        `¿Qué pieza concreta —dinero, hogar, tiempo, salud— está pidiendo atención práctica?`,
        `¿Cuál es el siguiente paso pequeño y posible, no el plan grande?`
      ]
    };

    if (isInv && Math.random() < 0.6) return pick(invPrompts);
    if (elem && elementalPrompts[elem] && Math.random() < 0.5) return pick(elementalPrompts[elem]);
    return pick(generalPrompts);
  }

  // ──────────────────────────────────────────────────────────────────
  // Voz "horóscopo premium" — directa, en presente, segunda persona.
  // Ensambla una lectura de 2-4 frases combinando bancos según:
  //   - posición de la tirada (pasado/presente/camino/centro/etc.)
  //   - estado (recta o invertida)
  //   - elemento (fuego/agua/aire/tierra) o arcano mayor
  // ──────────────────────────────────────────────────────────────────

  // Aperturas que enganchan emocionalmente
  const HOROSCOPE_OPENERS = {
    upright: [
      'Hay algo bonito moviéndose aquí, y no es casualidad.',
      'Esta carta llega en buen momento.',
      'Algo se está acomodando, aunque todavía no lo veas claro.',
      'Puede que no lo sientas todavía, pero algo está empezando a fluir.',
      'Esto es de las cartas que dan tregua.',
      'Hay claridad disponible. Solo hay que dejarla entrar.',
      'No hace falta que fuerces nada aquí.'
    ],
    inverted: [
      'No es momento de forzarte tanto.',
      'Para. Respira. Léelo despacio.',
      'Hay algo aquí que llevas tiempo cargando, y se nota.',
      'Esta carta no viene a regañarte. Viene a señalarte algo.',
      'No es lo que querías leer. Tampoco es lo que crees.',
      'Hay un nudo aquí, y vale la pena nombrarlo.',
      'Algo no termina de fluir, y está bien admitirlo.'
    ]
  };

  // Cuerpos centrales — donde la carta se conecta al estado emocional.
  // Se evita meter el nombre de la posición crudo en la frase (queda raro
  // en español: "En presente, ..."). En su lugar se usa "aquí", "esta área"
  // o frases que ya tienen sentido por sí mismas. El nombre de la posición
  // ya está visible en el encabezado de la carta.
  function buildBody(card, position, isInv) {
    const elem = card.element;
    const isMajor = card.arcana === 'major';

    const invByElement = {
      fuego: [
        `Llevas tiempo tirando del carro tú solo y se te nota. Esta carta no te juzga — solo dice lo evidente: necesitas bajar el ritmo antes de que el cuerpo lo decida por ti.`,
        `Hay rabia o frustración acumulada que no estás dejando salir. No es saludable seguir tragándotelo. Buscar dónde soltarlo no es debilidad, es lógica.`,
        `Te has quedado sin combustible y estás intentando moverte igual. Eso explica por qué últimamente todo te cuesta el doble.`
      ],
      agua: [
        `Hay una emoción aquí que llevas tiempo evitando sentir. No la juzgues — solo escúchala. A veces lo único que pide es ser nombrada.`,
        `Algo te dolió y todavía no terminaste de procesarlo. No pasa nada — no todo se sana en línea recta. Date el tiempo que necesite.`,
        `Lo que sientes es legítimo, aunque te dé miedo nombrarlo. No tienes que justificarlo ante nadie, ni siquiera ante ti.`
      ],
      aire: [
        `Llevas días dándole vueltas a algo que no se va a aclarar pensándolo más. Tu cabeza ya hizo su parte. Toca soltar la pelota un rato.`,
        `Te estás contando una historia que ya no encaja con lo que sientes. Quizá toca actualizar la versión, aunque cueste.`,
        `Hay ruido mental aquí. Bajar el volumen no es huir del asunto — es lo único que te va a dejar pensar con claridad.`
      ],
      tierra: [
        `Hay algo concreto que llevas postergando. No por flojera, por miedo. Y postergarlo te está pesando más que enfrentarlo.`,
        `Llevas tiempo cuidando todo menos lo que tu cuerpo o tu rutina necesitan. Eso pasa factura, aunque tarde.`,
        `Hay un asunto material aquí que estás ignorando porque te incomoda. Mirarlo no lo empeora — solo lo hace manejable.`
      ]
    };

    const upByElement = {
      fuego: [
        `Tu energía está donde tiene que estar. La pregunta no es si puedes — es qué vas a hacer con ella. Y esa decisión es solo tuya.`,
        `Hay impulso disponible aquí. Si algo te pide moverte, probablemente no se equivoca. Confía en esa señal.`,
        `Las ganas vuelven, y vuelven para algo concreto, no para perderse en el aire. Aprovéchalas mientras estén calientes.`
      ],
      agua: [
        `Tus emociones están encontrando su sitio. Déjalas asentarse antes de explicarlas. No hace falta tener todo claro hoy.`,
        `Hay ternura disponible — tuya, hacia ti o hacia alguien. No la racionalices. Vívela y ya.`,
        `Algo se está abriendo en lo afectivo. Llega despacio, pero llega. No fuerces el ritmo.`
      ],
      aire: [
        `La cabeza tiene espacio para pensar con claridad. Aprovéchalo antes de que vuelva el ruido. Las decisiones tomadas en calma duran más.`,
        `Las palabras justas están cerca. Lo que necesitas decir, podrás decirlo. Solo busca el momento, no lo fuerces.`,
        `Hay claridad mental disponible. Decide ahora lo que estabas dejando para después — vas a sentirte mejor cuando lo hagas.`
      ],
      tierra: [
        `Lo concreto está colaborando contigo. Es buen momento para ocuparte de lo tangible: cuerpo, casa, dinero, rutina.`,
        `Tu cuerpo y tus rutinas tienen mucho que decirte hoy. Escúchalos antes que a los pensamientos.`,
        `Los pasos pequeños suman más de lo que crees. Avanza sin prisa pero sin pausa, y pronto vas a mirar atrás sorprendido.`
      ]
    };

    // Genéricos para arcanos mayores o cartas sin elemento
    const invGeneric = [
      `Hay algo que llevas tiempo sintiendo y que ahora empieza a hacerse imposible de ignorar. No tienes que arreglarlo hoy — solo dejar de fingir que no está.`,
      `Llevas días pidiéndote más de lo que te puedes dar. Y se nota en cómo te estás tratando. Eso también es información.`,
      `Hay una verdad incómoda aquí que ya conoces, aunque no quieras formularla. Te toca decidir si vas a seguir esquivándola.`,
      `Algo importante está pidiendo otra mirada. Lo que ves desde donde estás ahora ya no encaja del todo, y eso explica el ruido.`
    ];

    const upGeneric = [
      `Hay algo que llevas tiempo trabajando y empieza a dar fruto, aunque tú no lo notes todavía. Confía un poco más en lo que has construido.`,
      `Las cosas están más en su sitio de lo que parecen. Si llevas días dudando, probablemente la duda está en ti, no en el camino.`,
      `Ya sabes la respuesta. Solo necesitas dejar de buscarla en otro sitio. La tienes desde antes de hacer la pregunta.`,
      `Está pasando algo bueno, aunque silencioso. No todo lo importante hace ruido — a veces lo que más cuenta llega despacio.`
    ];

    const majorAdd = isMajor ? [
      ' Y ojo: esta no es una carta menor. Cuando aparece, suele hablar de algo de fondo, no de una situación pasajera.',
      ' Es una carta mayor — habla de un tema que vuelve hasta que lo miras de verdad.',
      ' Esta carta tiene peso. Lo que dice no es solo para esta semana.'
    ] : [];

    let pool;
    if (isInv) {
      pool = (elem && invByElement[elem]) ? invByElement[elem] : invGeneric;
    } else {
      pool = (elem && upByElement[elem]) ? upByElement[elem] : upGeneric;
    }

    let text = pick(pool);
    if (majorAdd.length && Math.random() < 0.5) text += pick(majorAdd);
    return text;
  }

  // Cierres que dejan al lector con algo concreto en la mano
  const HOROSCOPE_CLOSERS = {
    upright: [
      'Si algo dentro de ti dice que sí, probablemente puedes confiar en ese sí.',
      'No tienes que tenerlo todo claro hoy. Solo el siguiente paso.',
      'Date permiso de disfrutarlo sin necesitar entenderlo entero.',
      'Lo que viene después depende de cómo elijas mirar lo que ya tienes.',
      'Suelta el control un poco. Aquí no te toca hacer todo el trabajo.',
      'No subestimes lo que ya está en marcha. A veces lo discreto es lo que más importa.'
    ],
    inverted: [
      'No tienes que arreglarlo hoy. Nombrar ya es empezar.',
      'Sé suave contigo en los próximos días. Lo necesitas más de lo que admites.',
      'Pausa no es retroceso. A veces es lo único que te lleva adelante.',
      'No es debilidad. Es honestidad. Y eso siempre cuenta.',
      'Lo que está pidiendo aire, dáselo. No tiene que ser un cambio grande.',
      'No tienes que justificarte ante nadie por sentir lo que sientes ahora.'
    ]
  };

  function buildHoroscopeRead(card, position, idx) {
    const isInv = !!card.isInverted;
    const opener = pick(isInv ? HOROSCOPE_OPENERS.inverted : HOROSCOPE_OPENERS.upright);
    const body   = buildBody(card, position, isInv);
    const closer = pick(isInv ? HOROSCOPE_CLOSERS.inverted : HOROSCOPE_CLOSERS.upright);
    // Devolvemos como párrafos cortos para mejor lectura
    return `<p>${opener}</p><p>${body}</p><p class="interp-card__close">${closer}</p>`;
  }

  function elementSymbol(el) {
    return ({ fuego: '🜂', agua: '🜄', aire: '🜁', tierra: '🜃' })[el] || '✦';
  }

  function buildSynthesis(spread, cards) {
    const parts = [];

    // 1. Elemento dominante — explicado en clave cotidiana
    const elements = cards.map(c => c.element).filter(Boolean);
    const elCount = countBy(elements);
    const topEl = topKey(elCount);
    if (topEl && elCount[topEl] >= Math.max(2, Math.ceil(cards.length / 2))) {
      const elFrames = {
        fuego: 'Tu lectura está movida por <strong>fuego</strong>: ganas, acción, energía vital. Si llevas días sintiendo que algo te empuja, no te lo estás inventando. Eso sí — el fuego sin dirección quema. Decide bien dónde lo pones.',
        agua: 'Domina el <strong>agua</strong> en esta lectura: emociones, vínculos, lo que se siente más que lo que se dice. Si andas más sensible últimamente, no es debilidad. Es información.',
        aire: 'Pesa el <strong>aire</strong> en lo que has leído: pensamiento, palabras, decisiones. Es momento de poner en orden la cabeza, pero sin perder de vista el cuerpo.',
        tierra: 'Mucha <strong>tierra</strong> en esta lectura: cuerpo, dinero, rutina, hogar. Lo concreto está pidiendo atención. Lo etéreo puede esperar un poco.'
      };
      parts.push(`<p>${elFrames[topEl] || ('La lectura está marcada por <strong>' + escapeHTML(topEl) + '</strong>.')}</p>`);
    }

    // 2. Palo dominante
    const suits = cards.map(c => c.suit).filter(Boolean);
    const suCount = countBy(suits);
    const topSu = topKey(suCount);
    if (topSu && suCount[topSu] >= 2 && SUITS[topSu]) {
      const s = SUITS[topSu];
      parts.push(`<p>Aparecen varios <strong>${escapeHTML(s.name)}</strong>. En lenguaje simple: ahí está el centro de gravedad de tu momento — todo lo que tiene que ver con ${escapeHTML(s.domain)}.</p>`);
    }

    // 3. Equilibrio rectas / invertidas
    const inv = cards.filter(c => c.isInverted).length;
    const direct = cards.length - inv;
    if (cards.length > 1) {
      if (inv === 0) {
        parts.push(`<p>Algo importante: <strong>todas las cartas están en su sitio</strong>. Eso suele indicar que las cosas están más fluidas de lo que tú las sientes. Si dudas, probablemente la duda está en ti, no en el camino.</p>`);
      } else if (inv === cards.length) {
        parts.push(`<p>Todas las cartas vinieron <strong>invertidas</strong>. No te asustes — no es mal augurio. Es una invitación a parar antes que avanzar. Antes de mover algo afuera, parece que toca ordenar algo dentro.</p>`);
      } else if (inv > direct) {
        parts.push(`<p>Hay más cartas invertidas que rectas. La lectura sugiere <strong>limpiar antes de avanzar</strong>: revisar pensamientos viejos, conversaciones pendientes, emociones sin nombrar. Lo nuevo entra mejor en un espacio aireado.</p>`);
      }
    }

    // 4. Tono de cierre según última carta
    const last = cards[cards.length - 1];
    if (last) {
      if (last.isInverted) {
        parts.push(`<p>La última carta llega invertida. Sé suave contigo en los próximos días — hay algo que aún necesita cuidado antes de cerrar este capítulo. No te exijas conclusiones ahora.</p>`);
      } else {
        parts.push(`<p>La última carta llega en su posición natural. Eso suele leerse bien: hay algo que va a asentarse o aclararse si le das tiempo. Lo principal es no forzarlo.</p>`);
      }
    }

    // Cierre — directo, tipo amigo cerrando una conversación importante
    const closings = [
      `<p>Y una última cosa: estas cartas no deciden nada por ti. Te ponen palabras a lo que ya sentías. Quédate con lo que te resuene y suelta el resto sin culpa — tú te conoces mejor que cualquier carta.</p>`,
      `<p>Tómatelo con calma. Algunas cosas que aparecen aquí se entienden mejor en unos días, cuando la vida las roce. No tienes que sacar conclusiones ahora mismo.</p>`,
      `<p>Léelo más de una vez si hace falta. A veces lo que parece simple al principio cobra otro sentido al releerlo. Y eso también está bien.</p>`
    ];
    parts.push(pick(closings));

    return parts.join('');
  }

  function countBy(arr) {
    return arr.reduce((acc, x) => { acc[x] = (acc[x] || 0) + 1; return acc; }, {});
  }
  function topKey(obj) {
    let best = null, n = 0;
    for (const k in obj) if (obj[k] > n) { n = obj[k]; best = k; }
    return best;
  }

  /* ════════════════════════════════════════════════════════════════════
     13. GUARDAR / COMPARTIR LECTURA
     ════════════════════════════════════════════════════════════════════ */

  function onSaveReading() {
    const sp = state.currentSpread;
    if (!sp) return;
    const entry = {
      id: 'read_' + Date.now(),
      ts: Date.now(),
      date: todayKey(),
      spreadKey: sp.key,
      spreadTitle: sp.title,
      question: state.question,
      cards: state.selectedCards.map(c => ({
        id: c.id, name: c.name, symbol: c.symbol || '✦',
        gradient: c.gradient, isInverted: !!c.isInverted,
        arcana: c.arcana, suit: c.suit || null
      })),
      interpretationHTML: $('#interpretation-content')?.innerHTML || ''
    };
    state.history.unshift(entry);
    if (state.history.length > 60) state.history.length = 60;
    saveJSON(STORAGE_KEYS.history, state.history);
    showToast('Lectura guardada en tu historial ✦');
    vibrate(15);
  }

  function onShareReading() {
    openShareModal();
  }

  function openShareModal() {
    const modal = $('#modal-share');
    if (!modal) return;
    const preview = $('#share-card-preview');
    if (preview) preview.innerHTML = buildSharePreview();
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(() => modal.classList.add('is-open'), 10);
  }
  function closeShareModal() {
    const modal = $('#modal-share');
    if (!modal) return;
    modal.classList.remove('is-open');
    setTimeout(() => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
    }, 250);
  }

  function buildSharePreview() {
    const sp = state.currentSpread;
    const cards = state.selectedCards;
    if (!sp || !cards.length) return '<p>No hay lectura activa.</p>';

    const cardsHTML = cards.map(c => {
      const grad = c.gradient || ['#1a0b2e', '#2e1352', '#7b2cbf'];
      return `
        <div class="share-mini-card" style="--g1:${grad[0]};--g2:${grad[1]};--g3:${grad[2]}">
          <div class="share-mini-card__sym">${c.symbol || '✦'}</div>
          <div class="share-mini-card__name">${escapeHTML(c.name)}</div>
          ${c.isInverted ? '<div class="share-mini-card__inv">invertida</div>' : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="share-card__inner">
        <div class="share-card__brand">ARCANUM STELLARIS</div>
        <div class="share-card__title">${escapeHTML(sp.title)}</div>
        ${state.question ? `<div class="share-card__q">«${escapeHTML(state.question)}»</div>` : ''}
        <div class="share-card__cards">${cardsHTML}</div>
        <div class="share-card__date">${new Date().toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' })}</div>
        <div class="share-card__sigil">✦</div>
      </div>
    `;
  }

  async function onDownloadShare() {
    const card = $('#share-card-preview');
    if (!card) return;
    const blob = await renderShareImage(state.currentSpread, state.selectedCards, state.question);
    if (!blob) { showToast('No se pudo generar la imagen'); return; }
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arcanum-stellaris-${todayKey()}.png`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    showToast('Imagen descargada ✦');
  }

  function renderShareImage(spread, cards, question) {
    return new Promise(resolve => {
      const W = 1080, H = 1350;
      const canvas = document.createElement('canvas');
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext('2d');

      // Fondo gradiente cósmico
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#0b0420');
      bg.addColorStop(0.5, '#1a0b3a');
      bg.addColorStop(1, '#06010f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Estrellas
      for (let i = 0; i < 220; i++) {
        const x = Math.random() * W, y = Math.random() * H;
        const r = Math.random() * 1.6 + 0.4;
        const a = Math.random() * 0.7 + 0.2;
        ctx.fillStyle = `rgba(253,230,138,${a})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }

      // Marca
      ctx.fillStyle = 'rgba(253,230,138,0.85)';
      ctx.font = '300 36px Cinzel, serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '8px';
      ctx.fillText('ARCANUM STELLARIS', W / 2, 110);

      // Línea decorativa
      ctx.strokeStyle = 'rgba(253,230,138,0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(W/2 - 80, 140); ctx.lineTo(W/2 + 80, 140); ctx.stroke();
      ctx.fillStyle = 'rgba(253,230,138,0.85)';
      ctx.font = '36px serif';
      ctx.fillText('✦', W/2, 175);

      // Título spread
      ctx.fillStyle = '#f5e9c0';
      ctx.font = '600 64px Cinzel, serif';
      ctx.fillText(spread.title, W / 2, 260);

      // Pregunta
      if (question) {
        ctx.fillStyle = 'rgba(245,233,192,0.7)';
        ctx.font = 'italic 32px "Cormorant Garamond", serif';
        wrapText(ctx, '« ' + question + ' »', W / 2, 320, W - 200, 40);
      }

      // Dibuja cartas miniatura
      const cardW = 200, cardH = 320, gap = 30;
      const totalW = cards.length * cardW + (cards.length - 1) * gap;
      const startX = (W - totalW) / 2;
      const cardY = question ? 460 : 410;

      cards.forEach((c, i) => {
        const x = startX + i * (cardW + gap);
        drawMiniCard(ctx, c, x, cardY, cardW, cardH);
      });

      // Pie de imagen
      ctx.fillStyle = 'rgba(245,233,192,0.55)';
      ctx.font = '26px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';
      const dateTxt = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      ctx.fillText(dateTxt, W / 2, H - 130);
      ctx.fillStyle = 'rgba(253,230,138,0.7)';
      ctx.font = '28px Cinzel, serif';
      ctx.fillText('✦', W/2, H - 80);

      canvas.toBlob(b => resolve(b), 'image/png');
    });
  }

  function drawMiniCard(ctx, card, x, y, w, h) {
    const grad = card.gradient || ['#1a0b2e', '#2e1352', '#7b2cbf'];
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, grad[0]); g.addColorStop(0.5, grad[1]); g.addColorStop(1, grad[2]);

    // Cuerpo
    ctx.save();
    if (card.isInverted) { ctx.translate(x + w/2, y + h/2); ctx.rotate(Math.PI); ctx.translate(-(x + w/2), -(y + h/2)); }
    roundRect(ctx, x, y, w, h, 18);
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = 'rgba(253,230,138,0.5)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, x + 8, y + 8, w - 16, h - 16, 12); ctx.stroke();

    // Símbolo
    ctx.fillStyle = 'rgba(253,230,138,0.92)';
    ctx.font = '92px serif';
    ctx.textAlign = 'center';
    ctx.fillText(card.symbol || '✦', x + w/2, y + h/2 + 10);

    // Nombre
    ctx.fillStyle = '#fde68a';
    ctx.font = '600 22px Cinzel, serif';
    wrapText(ctx, card.name, x + w/2, y + h - 60, w - 24, 26);
    ctx.restore();

    if (card.isInverted) {
      ctx.fillStyle = 'rgba(253,230,138,0.7)';
      ctx.font = '16px "Cormorant Garamond", serif';
      ctx.textAlign = 'center';
      ctx.fillText('invertida', x + w/2, y + h + 22);
    }
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.arcTo(x+w, y, x+w, y+h, r);
    ctx.arcTo(x+w, y+h, x, y+h, r);
    ctx.arcTo(x, y+h, x, y, r);
    ctx.arcTo(x, y, x+w, y, r);
    ctx.closePath();
  }
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    let yy = y;
    for (let i = 0; i < words.length; i++) {
      const test = line + words[i] + ' ';
      if (ctx.measureText(test).width > maxWidth && i > 0) {
        ctx.fillText(line.trim(), x, yy);
        line = words[i] + ' ';
        yy += lineHeight;
      } else { line = test; }
    }
    ctx.fillText(line.trim(), x, yy);
  }

  function onCopyShare() {
    const sp = state.currentSpread;
    const cards = state.selectedCards;
    if (!sp || !cards.length) return;
    const txt = [
      '✦ ARCANUM STELLARIS ✦',
      `Tirada: ${sp.title}`,
      state.question ? `Pregunta: «${state.question}»` : '',
      '',
      ...cards.map((c, i) => {
        const pos = sp.positions[i];
        return `${i + 1}. ${pos.name}: ${c.name}${c.isInverted ? ' (invertida)' : ''}\n   ${c.isInverted ? c.invertedMeaning : c.positiveMeaning}`;
      }),
      '',
      `Lectura realizada el ${new Date().toLocaleDateString('es-ES', { year:'numeric', month:'long', day:'numeric' })}`
    ].filter(Boolean).join('\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt).then(
        () => showToast('Lectura copiada al portapapeles ✦'),
        () => fallbackCopy(txt)
      );
    } else { fallbackCopy(txt); }
  }
  function fallbackCopy(txt) {
    const ta = document.createElement('textarea');
    ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast('Copiado ✦'); } catch { showToast('No se pudo copiar'); }
    ta.remove();
  }

  function onNewReading() {
    state.currentSpread = null;
    state.selectedCards = [];
    state.question = '';
    showScreen('tarot');
  }

  function onRestartReading() {
    if (!state.currentSpread) return showScreen('tarot');
    startReading(state.currentSpread.key);
  }

  /* ════════════════════════════════════════════════════════════════════
     14. ASTROLOGÍA — CÁLCULO Y RENDER
     ════════════════════════════════════════════════════════════════════ */

  function getSunSign(month, day) {
    for (const [key, data] of Object.entries(ZODIAC_SIGNS)) {
      const [[sm, sd], [em, ed]] = data.dates;
      if (sm === em) {
        if (month === sm && day >= sd && day <= ed) return key;
      } else {
        // Capricornio cruza año (12,22 a 1,19)
        if ((month === sm && day >= sd) || (month === em && day <= ed)) return key;
      }
    }
    return 'aries';
  }

  // Cálculo de ascendente simplificado: avanza un signo cada 2 horas
  // partiendo del signo solar al amanecer (~6:00).
  function getRisingSign(sunKey, hour, minute = 0) {
    const order = Object.keys(ZODIAC_SIGNS);
    const sunIdx = order.indexOf(sunKey);
    const totalMin = hour * 60 + minute;
    const baseMin  = 6 * 60;       // 6:00 amanecer simbólico
    const diffMin  = totalMin - baseMin;
    const advance  = Math.floor(((diffMin % 1440 + 1440) % 1440) / 120);
    return order[(sunIdx + advance) % order.length];
  }

  function dominantElement(sunKey, riseKey) {
    const counts = {};
    [sunKey, riseKey].forEach(k => {
      const el = ZODIAC_SIGNS[k]?.element;
      if (el) counts[el] = (counts[el] || 0) + 1;
    });
    return topKey(counts);
  }

  function renderAstroForm() {
    // Prioridad: state.astro (lo que el usuario haya guardado en astrología)
    // Fallback: state.profile (lo que vino del onboarding)
    let source = state.astro;
    if (!source && state.profile && state.profile.birthDate) {
      source = {
        name: state.profile.name,
        date: state.profile.birthDate,
        time: state.profile.birthTimeUnknown ? '12:00' : (state.profile.birthTime || '12:00'),
        city: state.profile.birthPlace
      };
    }
    if (source) {
      $('#astro-name').value = source.name || '';
      $('#astro-date').value = source.date || '';
      $('#astro-time').value = source.time || '';
      $('#astro-city').value = source.city || '';
      // Si hay datos completos, calcular y mostrar
      if (source.date) {
        state.astro = source;
        saveJSON(STORAGE_KEYS.astro, state.astro);
        computeAstro(false);
      }
    }
  }

  function onAstroSubmit() {
    const name = $('#astro-name').value.trim();
    const date = $('#astro-date').value;
    const time = $('#astro-time').value || '12:00';
    const city = $('#astro-city').value.trim() || 'tu ciudad';

    if (!name) return showToast('Cuéntanos cómo te llamas ✦');
    if (!date) return showToast('Necesitamos tu fecha de nacimiento');

    state.astro = { name, date, time, city };
    saveJSON(STORAGE_KEYS.astro, state.astro);
    computeAstro(true);
  }

  function computeAstro(showFeedback) {
    if (!state.astro) return;
    const { name, date, time, city } = state.astro;
    const [y, m, d] = date.split('-').map(Number);
    const [hh, mm] = time.split(':').map(Number);

    const sunKey  = getSunSign(m, d);
    const riseKey = getRisingSign(sunKey, hh || 12, mm || 0);
    const sun     = ZODIAC_SIGNS[sunKey];
    const rise    = ZODIAC_SIGNS[riseKey];
    const elem    = dominantElement(sunKey, riseKey);
    const elemData = ELEMENT_ENERGIES[elem];
    const profile  = ZODIAC_PROFILES[sunKey];
    const compat   = COMPATIBILITIES[sunKey];

    // Predicción simbólica diaria — semilla por fecha + signo
    const pred = generatePrediction(sunKey);

    const result = $('#astro-result');
    if (!result) return;
    result.hidden = false;
    result.innerHTML = `
      <div class="astro-card astro-card--hero" style="--el-color:${elemData?.color || '#fde68a'}">
        <div class="astro-card__symbol">${sun.symbol}</div>
        <h3 class="astro-card__title">${escapeHTML(name)}</h3>
        <p class="astro-card__sub">${escapeHTML(city)} · ${formatDate(date)} ${escapeHTML(time)}</p>
        <div class="astro-grid">
          <div class="astro-pill"><span>Sol</span><strong>${sun.symbol} ${escapeHTML(sun.name)}</strong></div>
          <div class="astro-pill"><span>Ascendente</span><strong>${rise.symbol} ${escapeHTML(rise.name)}</strong></div>
          <div class="astro-pill"><span>Elemento</span><strong>${elementSymbol(elem)} ${escapeHTML(elem)}</strong></div>
          <div class="astro-pill"><span>Modalidad</span><strong>${escapeHTML(sun.modality)}</strong></div>
        </div>
      </div>

      <div class="astro-card">
        <h4 class="astro-card__h">Tu perfil energético</h4>
        <p>${escapeHTML(profile.profile)}</p>
        <div class="astro-bar">
          <div class="astro-bar__label">${elementSymbol(elem)} energía dominante: <strong>${escapeHTML(elem)}</strong></div>
          <div class="astro-bar__track"><div class="astro-bar__fill" style="background:${elemData?.color}"></div></div>
          <p class="astro-bar__desc">${escapeHTML(elemData?.description || '')}</p>
        </div>
      </div>

      <div class="astro-card">
        <h4 class="astro-card__h">Tu Sol y tu Ascendente</h4>
        <p><strong>Sol en ${escapeHTML(sun.name)}:</strong> es la esencia que te trajo al mundo, lo que te ilumina por dentro. Regido por <strong>${escapeHTML(sun.ruler)}</strong>, te conecta con ${escapeHTML(sun.modality === 'cardinal' ? 'el inicio y la iniciativa' : sun.modality === 'fijo' ? 'la constancia y la profundidad' : 'la adaptación y el cambio')}.</p>
        <p><strong>Ascendente en ${escapeHTML(rise.name)}:</strong> es la máscara con la que el mundo te conoce primero, tu cuerpo energético de presentación. Esta combinación da una persona ${ascCombo(sunKey, riseKey)}.</p>
      </div>

      <div class="astro-card">
        <h4 class="astro-card__h">Compatibilidades</h4>
        <p><strong>Con quienes te entiendes con facilidad:</strong> ${(compat.mejor || []).map(s => `<span class="astro-tag">${ZODIAC_SIGNS[s].symbol} ${escapeHTML(ZODIAC_SIGNS[s].name)}</span>`).join('')}</p>
        <p><strong>Con quienes te cuesta más, y por eso enseñan más:</strong> ${(compat.desafiante || []).map(s => `<span class="astro-tag astro-tag--alt">${ZODIAC_SIGNS[s].symbol} ${escapeHTML(ZODIAC_SIGNS[s].name)}</span>`).join('')}</p>
      </div>

      <div class="astro-card">
        <h4 class="astro-card__h">Una nota para hoy</h4>
        <p>${escapeHTML(profile.advice)}</p>
      </div>

      <div class="astro-card astro-card--prediction">
        <h4 class="astro-card__h">Inspiración del día</h4>
        <p>${pred}</p>
      </div>
    `;

    if (showFeedback) {
      showToast('Tu carta natal está lista');
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function ascCombo(sun, rise) {
    if (sun === rise) return 'coherente y consistente: lo que sientes por dentro y lo que muestras van de la mano';
    const sunEl  = ZODIAC_SIGNS[sun].element;
    const riseEl = ZODIAC_SIGNS[rise].element;
    if (sunEl === riseEl) return `claramente de ${sunEl}: lo que muestras y lo que sientes están en la misma frecuencia`;
    return `con matices interesantes: tu esencia es de ${sunEl} y la primera impresión que das es de ${riseEl} — eso te hace alguien con capas que no todos captan al inicio`;
  }

  function formatDate(iso) {
    try {
      const d = new Date(iso + 'T00:00:00');
      return d.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return iso; }
  }

  function generatePrediction(sunKey) {
    const seed = dateSeed() + sunKey.charCodeAt(0);
    const rand = mulberry32(seed);
    const openings = [
      'El día se abre con espacio para algo nuevo, si te lo permites.',
      'Hay una sensación tranquila en este día — vale la pena no llenarlo de ruido.',
      'Una pequeña sincronía puede esperar a ser notada hoy.',
      'Presta atención a los detalles: a veces ahí están las respuestas que llevas semanas buscando.'
    ];
    const middles = [
      'Una conversación inesperada puede traerte claridad sobre algo.',
      'Confía en la primera intuición que aparezca antes del mediodía.',
      'Si dudas entre dos caminos, suele ayudar elegir el que requiere algo más de coraje.',
      'Un detalle aparentemente pequeño puede cambiar el ánimo de tu tarde.',
      'Quizá alguien cercano necesite hoy una palabra amable de tu parte.'
    ];
    const closings = [
      'Cerrar el día con un pensamiento de gratitud puede ayudarte a dormir mejor.',
      'Antes de dormir, suelta lo que pesa: mañana llega ligero.',
      'Permítete un acto de ternura contigo mismo/a antes de descansar.'
    ];
    const a = openings[Math.floor(rand() * openings.length)];
    const b = middles[Math.floor(rand() * middles.length)];
    const c = closings[Math.floor(rand() * closings.length)];
    return `<em>${escapeHTML(a)}</em> ${escapeHTML(b)} ${escapeHTML(c)}`;
  }

  /* ════════════════════════════════════════════════════════════════════
     15. CARTA DEL DÍA
     ════════════════════════════════════════════════════════════════════ */

  function getDailyCard() {
    const key = todayKey();
    const cache = loadJSON(STORAGE_KEYS.daily, {});
    if (cache[key]) return cache[key];

    // Determinista por fecha
    const seed = dateSeed();
    const shuffled = shuffle(ARCANUM_DECK.all, seed);
    const rand = mulberry32(seed + 7);
    const isInverted = rand() < 0.25;
    const card = { ...shuffled[0], isInverted };

    cache[key] = card;
    // Limpia entradas antiguas (deja solo últimas 14)
    const keys = Object.keys(cache).sort();
    while (keys.length > 14) { delete cache[keys.shift()]; }
    saveJSON(STORAGE_KEYS.daily, cache);
    return card;
  }

  function renderDaily() {
    const target = $('#daily-content');
    if (!target) return;
    const card = getDailyCard();
    const quote = getDailyQuote();
    const meaning = card.isInverted ? card.invertedMeaning : card.positiveMeaning;
    const dateStr = new Date().toLocaleDateString('es-ES', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

    target.innerHTML = `
      <div class="daily__date">${escapeHTML(dateStr)}</div>
      <div class="daily__quote">“${escapeHTML(quote)}”</div>
      <div class="daily__card-wrap">
        ${renderCard3D(card, 0)}
      </div>
      <div class="daily__name">${escapeHTML(card.name)}${card.isInverted ? ' <span class="daily__inv">(invertida)</span>' : ''}</div>
      <p class="daily__meaning">${escapeHTML(meaning)}</p>
      ${card.description ? `<p class="daily__desc">${escapeHTML(card.description)}</p>` : ''}
      <p class="daily__energy">${escapeHTML(card.emotionalEnergy || '')}</p>
    `;

    // Voltea la carta tras un breve respiro
    setTimeout(() => {
      const c3d = $('.card-3d', target);
      if (c3d) {
        c3d.classList.add('is-flipped');
        burstSparks(c3d);
        soundChime(520);
      }
      bindCardTilt(target);
    }, 600);
  }

  /* ════════════════════════════════════════════════════════════════════
     16. HISTORIAL DE LECTURAS
     ════════════════════════════════════════════════════════════════════ */

  function renderHistory() {
    const list = $('#history-list');
    if (!list) return;
    if (!state.history.length) {
      list.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">✦</div>
          <p>Aún no hay lecturas guardadas.</p>
          <p class="empty-state__hint">Cuando hagas una tirada, podrás guardarla aquí para visitarla cuando lo necesites.</p>
        </div>
      `;
      return;
    }

    list.innerHTML = state.history.map(entry => `
      <article class="history-entry" data-id="${entry.id}">
        <header class="history-entry__head">
          <div>
            <h4>${escapeHTML(entry.spreadTitle)}</h4>
            <small>${formatDateTime(entry.ts)}</small>
          </div>
          <button class="icon-btn icon-btn--small" data-history-del="${entry.id}" aria-label="Borrar">🗑</button>
        </header>
        ${entry.question ? `<p class="history-entry__q">«${escapeHTML(entry.question)}»</p>` : ''}
        <div class="history-entry__cards">
          ${entry.cards.map(c => `
            <div class="history-mini" style="--g1:${c.gradient?.[0] || '#1a0b2e'};--g2:${c.gradient?.[1] || '#2e1352'};--g3:${c.gradient?.[2] || '#7b2cbf'}">
              <span class="history-mini__sym">${c.symbol}</span>
              <span class="history-mini__name">${escapeHTML(c.name)}${c.isInverted ? ' ↺' : ''}</span>
            </div>
          `).join('')}
        </div>
        <button class="btn btn--ghost btn--small" data-history-open="${entry.id}">Ver lectura completa</button>
      </article>
    `).join('');

    // Hooks
    list.querySelectorAll('[data-history-del]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const id = btn.getAttribute('data-history-del');
        deleteHistoryEntry(id);
      });
    });
    list.querySelectorAll('[data-history-open]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-history-open');
        openHistoryEntry(id);
      });
    });
  }

  function deleteHistoryEntry(id) {
    state.history = state.history.filter(e => e.id !== id);
    saveJSON(STORAGE_KEYS.history, state.history);
    renderHistory();
    showToast('Lectura eliminada');
  }

  function openHistoryEntry(id) {
    const entry = state.history.find(e => e.id === id);
    if (!entry) return;
    // Abre modal de lectura
    const m = $('#modal-share');
    if (!m) return;
    $('#share-card-preview').innerHTML = `
      <div class="history-full">
        <header class="history-full__head">
          <h3>${escapeHTML(entry.spreadTitle)}</h3>
          <small>${formatDateTime(entry.ts)}</small>
        </header>
        ${entry.question ? `<p class="history-full__q">«${escapeHTML(entry.question)}»</p>` : ''}
        <div class="history-full__interp">${entry.interpretationHTML}</div>
      </div>
    `;
    m.hidden = false;
    m.setAttribute('aria-hidden', 'false');
    setTimeout(() => m.classList.add('is-open'), 10);
  }

  function formatDateTime(ts) {
    return new Date(ts).toLocaleString('es-ES', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function onClearHistory() {
    if (!state.history.length) return showToast('Tu historial ya está vacío');
    if (!confirm('¿Borrar todas las lecturas guardadas? Esta acción no se puede deshacer.')) return;
    state.history = [];
    saveJSON(STORAGE_KEYS.history, state.history);
    renderHistory();
    showToast('Historial borrado');
  }

  /* ════════════════════════════════════════════════════════════════════
     17. AJUSTES Y TEMAS
     ════════════════════════════════════════════════════════════════════ */

  function renderSettings() {
    $('#set-sound').checked     = !!state.settings.sound;
    $('#set-haptic').checked    = !!state.settings.haptic;
    $('#set-particles').checked = !!state.settings.particles;
    applyTheme(state.settings.theme);
    syncSoundIcon();

    // Marca tema activo
    $$('.theme-chip').forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.theme === state.settings.theme);
    });
  }

  function applyTheme(name) {
    document.body.classList.remove('theme-cosmic', 'theme-midnight', 'theme-rose', 'theme-forest');
    document.body.classList.add('theme-' + name);
    state.settings.theme = name;
    saveJSON(STORAGE_KEYS.settings, state.settings);
  }

  function onToggleSound() {
    state.settings.sound = !state.settings.sound;
    saveJSON(STORAGE_KEYS.settings, state.settings);
    syncSoundIcon();
    if (state.settings.sound) soundChime(660);
    showToast(state.settings.sound ? 'Sonidos activados ✦' : 'Sonidos en silencio');
  }
  function syncSoundIcon() {
    const ic = $('#sound-icon');
    if (ic) ic.textContent = state.settings.sound ? '🔔' : '🔇';
  }

  function onClearAll() {
    if (!confirm('Vas a borrar TODOS tus datos: historial, ajustes, perfil, datos astrológicos y carta del día. ¿Estás seguro?')) return;
    Object.values(STORAGE_KEYS).forEach(k => removeKey(k));
    state.settings = { ...DEFAULT_SETTINGS };
    state.history = [];
    state.astro = null;
    state.profile = null;
    saveJSON(STORAGE_KEYS.settings, state.settings);
    applyTheme('cosmic');
    renderSettings();
    showToast('Todo borrado. Tu dispositivo está limpio ✦');
  }

  /* ════════════════════════════════════════════════════════════════════
     18. SONIDOS (WEBAUDIO API)
     ════════════════════════════════════════════════════════════════════ */

  let audioCtx = null;
  let shuffleOsc = null;
  let shuffleGain = null;

  function ensureAudio() {
    if (!state.settings.sound) return null;
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch { return null; }
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  }

  function soundChime(freq = 660) {
    const ctx = ensureAudio();
    if (!ctx) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.18, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.4);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 1.4);

    // Armónico suave
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = 'sine'; osc2.frequency.value = freq * 1.5;
    g2.gain.setValueAtTime(0.0001, t);
    g2.gain.exponentialRampToValueAtTime(0.06, t + 0.05);
    g2.gain.exponentialRampToValueAtTime(0.0001, t + 1.0);
    osc2.connect(g2).connect(ctx.destination);
    osc2.start(t); osc2.stop(t + 1.0);
  }

  function soundShuffle(start) {
    const ctx = ensureAudio();
    if (!ctx) return;
    if (start) {
      if (shuffleOsc) return;
      shuffleOsc = ctx.createOscillator();
      shuffleGain = ctx.createGain();
      shuffleOsc.type = 'triangle';
      shuffleOsc.frequency.value = 90;
      shuffleGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      shuffleGain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.4);
      shuffleOsc.connect(shuffleGain).connect(ctx.destination);
      shuffleOsc.start();
    } else if (shuffleOsc) {
      try {
        shuffleGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
        shuffleOsc.stop(ctx.currentTime + 0.45);
      } catch {}
      shuffleOsc = null; shuffleGain = null;
    }
  }

  /* ════════════════════════════════════════════════════════════════════
     19. TOAST GLOBAL
     ════════════════════════════════════════════════════════════════════ */

  let toastTimer = null;
  function showToast(msg, duration = 2400) {
    const t = $('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('is-visible');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-visible'), duration);
  }

  /* ════════════════════════════════════════════════════════════════════
     20. WIRING DE EVENTOS GLOBALES
     ════════════════════════════════════════════════════════════════════ */

  function bindEvents() {
    // Navegación por data-nav
    document.addEventListener('click', e => {
      const navBtn = e.target.closest('[data-nav]');
      if (navBtn) {
        const key = navBtn.getAttribute('data-nav');
        showScreen(key);
        return;
      }

      // Acciones nombradas
      const actBtn = e.target.closest('[data-action]');
      if (actBtn) {
        const a = actBtn.getAttribute('data-action');
        if (a === 'toggle-sound') onToggleSound();
      }

      // Cerrar modal
      const closeM = e.target.closest('[data-modal-close]');
      if (closeM) closeShareModal();
    });

    // Splash
    initSplash();

    // Lectura — fases
    const btnShuffle  = $('#btn-shuffle');
    const btnInterpret = $('#btn-interpret');
    const btnSave     = $('#btn-save');
    const btnShare    = $('#btn-share');
    const btnNew      = $('#btn-new');
    const btnRestart  = $('#reading-restart');
    if (btnShuffle)   btnShuffle.addEventListener('click', onShuffleClick);
    if (btnInterpret) btnInterpret.addEventListener('click', onInterpretClick);
    if (btnSave)      btnSave.addEventListener('click', onSaveReading);
    if (btnShare)     btnShare.addEventListener('click', onShareReading);
    if (btnNew)       btnNew.addEventListener('click', onNewReading);
    if (btnRestart)   btnRestart.addEventListener('click', onRestartReading);

    // Astrología
    const btnAstro = $('#btn-astro');
    if (btnAstro) btnAstro.addEventListener('click', onAstroSubmit);

    // Historial
    const btnClearH = $('#history-clear');
    if (btnClearH) btnClearH.addEventListener('click', onClearHistory);

    // Settings
    $('#set-sound')?.addEventListener('change', e => {
      state.settings.sound = e.target.checked;
      saveJSON(STORAGE_KEYS.settings, state.settings);
      syncSoundIcon();
    });
    $('#set-haptic')?.addEventListener('change', e => {
      state.settings.haptic = e.target.checked;
      saveJSON(STORAGE_KEYS.settings, state.settings);
      if (e.target.checked) vibrate(20);
    });
    $('#set-particles')?.addEventListener('change', e => {
      state.settings.particles = e.target.checked;
      saveJSON(STORAGE_KEYS.settings, state.settings);
      if (e.target.checked) startParticles();
      else stopParticles();
    });
    $('#set-clear-all')?.addEventListener('click', onClearAll);

    // Glosario
    $('#open-glossary')?.addEventListener('click', openGlossary);

    // Theme picker
    $$('.theme-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        applyTheme(chip.dataset.theme);
        $$('.theme-chip').forEach(c => c.classList.toggle('is-active', c === chip));
        showToast('Ambiente actualizado ✦');
      });
    });

    // Share modal
    $('#btn-download')?.addEventListener('click', onDownloadShare);
    $('#btn-copy')?.addEventListener('click', onCopyShare);

    // Cerrar modal con ESC
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeShareModal();
    });
  }

  /* ════════════════════════════════════════════════════════════════════
     21. INICIALIZACIÓN
     ════════════════════════════════════════════════════════════════════ */

  function init() {
    // Tema y ajustes guardados
    applyTheme(state.settings.theme || 'cosmic');

    // Partículas
    initParticles();

    // Eventos
    bindEvents();

    // Decidir pantalla inicial
    if (!state.settings.visited) {
      // Primer arranque absoluto: splash queda activo (HTML por defecto)
      onEnterHome(); // pre-pinta home en background
    } else if (!state.settings.onboarded || !state.profile) {
      // Visitó antes pero no terminó onboarding: ir directo allí
      $('#screen-splash')?.classList.remove('is-active');
      showScreen('onboarding');
      initOnboarding();
    } else {
      // Usuario habitual: restaura la última pantalla visitada (o home por defecto).
      // Si refresca el navegador desde una pantalla, vuelve ahí — no a splash.
      let restoreKey = 'home';
      try {
        const saved = localStorage.getItem('arcanum:lastScreen');
        if (saved && screens[saved] && saved !== 'splash' && saved !== 'onboarding' && saved !== 'reading') {
          restoreKey = saved;
        }
      } catch (e) { /* localStorage bloqueado */ }
      $('#screen-splash')?.classList.remove('is-active');
      showScreen(restoreKey);
    }

    // Reduce-motion: deshabilita partículas si el usuario lo prefiere
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      stopParticles();
    }

    console.log('%c✦ Arcanum Stellaris ✦', 'color:#fde68a; font-size:16px; letter-spacing:4px;');
    console.log('Mazo cargado: ' + ARCANUM_DECK.all.length + ' cartas. Tus datos viven solo en este dispositivo.');
  }

  // Arranca cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ════════════════════════════════════════════════════════════════════
   PWA INSTALL — captura beforeinstallprompt + hint en home + ajustes
   ════════════════════════════════════════════════════════════════════ */
(function() {
  let deferredPrompt = null;

  // Detectar si la app YA está corriendo en modo standalone (instalada)
  function isStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.matchMedia('(display-mode: minimal-ui)').matches ||
           window.navigator.standalone === true; // iOS Safari
  }

  function updateInstallUI() {
    const hostBtn = document.getElementById('install-prompt-host');
    const hint = document.getElementById('home-install-hint');
    const installed = document.getElementById('install-installed');

    if (isStandalone()) {
      // Ya instalada — esconde botones, muestra "ya instalada"
      if (hostBtn) hostBtn.hidden = true;
      if (hint) hint.hidden = true;
      if (installed) installed.hidden = false;
      return;
    }
    // No instalada
    if (installed) installed.hidden = true;
    // El hint del home siempre se muestra (para que iOS Safari también lo vea)
    if (hint) hint.hidden = false;
    // El botón nativo solo si Chrome/Edge ofrecieron beforeinstallprompt
    if (hostBtn) hostBtn.hidden = !deferredPrompt;
  }

  // Chrome/Edge dispararán este evento cuando la app sea instalable
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenimos el banner automático de Chrome — lo ofrecemos nosotros
    e.preventDefault();
    deferredPrompt = e;
    updateInstallUI();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    updateInstallUI();
    // Toast opcional si la función global existe
    if (typeof window.showToast === 'function') {
      window.showToast('Arcanum se ha instalado ✦');
    }
  });

  // Click en "Instalar Arcanum" (botón nativo)
  document.addEventListener('click', async (e) => {
    const trigger = e.target.closest('#install-trigger');
    if (!trigger) return;
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    updateInstallUI();
  });

  // Click en hint del home → navega a ajustes y abre el details Android automáticamente
  document.addEventListener('click', (e) => {
    const hint = e.target.closest('#home-install-btn');
    if (!hint) return;
    // El data-nav="settings" ya hace la navegación.
    // Tras un tick, abre el primer details (Android) y hace scroll a la sección.
    setTimeout(() => {
      const group = document.getElementById('install-group');
      if (group) {
        group.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstDetails = group.querySelector('details.install-details');
        if (firstDetails) firstDetails.open = true;
      }
    }, 250);
  });

  // Inicializa al cargar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateInstallUI);
  } else {
    updateInstallUI();
  }

  // Escucha cambios de display-mode (por si el usuario instala mientras la app está abierta)
  if (window.matchMedia) {
    try {
      window.matchMedia('(display-mode: standalone)').addEventListener('change', updateInstallUI);
    } catch (e) { /* Safari viejo */ }
  }
})();

/* ════════════════════════════════════════════════════════════════════
   Service Worker — convierte la app en PWA instalable + offline
   Se registra fuera del IIFE porque no necesita acceso al estado interno.
   ════════════════════════════════════════════════════════════════════ */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('✦ Service Worker activo — Arcanum funciona offline.');
        // Si hay una nueva versión esperando, recarga al actualizar
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          if (!newSW) return;
          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              // Hay nueva versión — el próximo refresh la activará automáticamente
              console.log('Nueva versión de Arcanum disponible. Se aplicará al recargar.');
            }
          });
        });
      })
      .catch((err) => {
        console.warn('Service Worker no se pudo registrar:', err.message);
      });
  });
}
