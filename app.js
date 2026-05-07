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
      || 'El universo siempre habla. Solo necesitas silencio para escucharlo.';
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

  const ONB_STEPS = ['welcome', 'name', 'intention', 'birthdate', 'birthtime', 'birthplace', 'experience', 'reveal'];
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
      text: 'Son las <strong>22 cartas grandes</strong> del mazo. Hablan de fuerzas profundas del alma: los grandes ciclos, los arquetipos, las lecciones de vida. Cuando aparecen muchas en una lectura, indican que el momento es de <em>destino activo</em>.'
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
    'arcano-mayor': '<strong>Arcanos mayores:</strong> son las 22 cartas más profundas del mazo. Hablan de fuerzas del alma y momentos clave de vida.',
    'invertida':    '<strong>Carta invertida:</strong> no es "mal augurio", es energía pidiendo ser mirada. Lo que evitas es lo que pide paso.',
    'elemento':     '<strong>Elemento:</strong> fuego, agua, aire o tierra. Cada uno habla de un tipo de fuerza vital. Ver más en el diccionario.',
    'palo':         '<strong>Palo:</strong> los menores se agrupan en cuatro familias —Cálices, Espadas, Varas, Pentáculos— cada una con su elemento y su tema.',
    'ascendente':   '<strong>Ascendente:</strong> el signo del horizonte al nacer. La máscara energética con la que el mundo te conoce primero.',
    'sol':          '<strong>Signo solar:</strong> tu signo de toda la vida. Esencia central, lo que te ilumina por dentro.'
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

  const SPREADS = [
    {
      key: 'single',
      title: 'Una carta',
      subtitle: 'La voz directa del momento',
      icon: '✦',
      count: 1,
      layout: 'single',
      positions: [
        { name: 'Mensaje del momento', meaning: 'Lo que tu alma necesita escuchar ahora.' }
      ]
    },
    {
      key: 'three',
      title: 'Tres cartas',
      subtitle: 'Pasado · Presente · Futuro',
      icon: '☷',
      count: 3,
      layout: 'three',
      positions: [
        { name: 'Pasado',   meaning: 'Las raíces invisibles del momento que vives.' },
        { name: 'Presente', meaning: 'Lo que late aquí y ahora en tu energía.' },
        { name: 'Futuro',   meaning: 'Hacia dónde fluye el río si no cambias el cauce.' }
      ]
    },
    {
      key: 'cross',
      title: 'Cruz Mística',
      subtitle: 'Una mirada profunda en cinco direcciones',
      icon: '✺',
      count: 5,
      layout: 'cross',
      positions: [
        { name: 'Situación', meaning: 'El centro de lo que estás atravesando.' },
        { name: 'Desafío',   meaning: 'La fuerza que cruza tu camino y pide ser comprendida.' },
        { name: 'Pasado',    meaning: 'Lo que dejaste pero aún resuena en ti.' },
        { name: 'Futuro',    meaning: 'Lo que se acerca si mantienes este rumbo.' },
        { name: 'Consejo',   meaning: 'La sabiduría que el universo te susurra.' }
      ]
    },
    {
      key: 'love',
      title: 'Amor',
      subtitle: 'El corazón hablando en tres voces',
      icon: '♥',
      count: 3,
      layout: 'love',
      positions: [
        { name: 'Tu corazón',     meaning: 'Lo que habita realmente en tu pecho hoy.' },
        { name: 'El otro / vínculo', meaning: 'La energía de la persona o vínculo en cuestión.' },
        { name: 'El destino del lazo', meaning: 'Hacia dónde tiende esta unión.' }
      ]
    },
    {
      key: 'money',
      title: 'Dinero y trabajo',
      subtitle: 'El flujo de la abundancia',
      icon: '☘',
      count: 3,
      layout: 'money',
      positions: [
        { name: 'Tu energía actual', meaning: 'Cómo se mueve tu fuerza con lo material.' },
        { name: 'Lo que bloquea',    meaning: 'La piedra invisible en el camino del flujo.' },
        { name: 'Lo que se abre',    meaning: 'La puerta que el universo está dispuesto a mostrarte.' }
      ]
    },
    {
      key: 'destiny',
      title: 'Destino',
      subtitle: 'El hilo que el alma ya conoce',
      icon: '➤',
      count: 3,
      layout: 'destiny',
      positions: [
        { name: 'Tu llamado',    meaning: 'La voz de tu alma cuando nadie escucha.' },
        { name: 'El obstáculo',  meaning: 'Lo que aún sostienes y te impide volar.' },
        { name: 'El horizonte',  meaning: 'Lo que está siendo escrito ahora mismo para ti.' }
      ]
    },
    {
      key: 'astral',
      title: 'Carta Astral espiritual',
      subtitle: 'Espíritu · Mente · Corazón · Cuerpo · Destino',
      icon: '✷',
      count: 5,
      layout: 'astral',
      positions: [
        { name: 'Espíritu', meaning: 'El fuego invisible que te sostiene.' },
        { name: 'Mente',    meaning: 'Cómo se mueven hoy tus pensamientos y palabras.' },
        { name: 'Corazón',  meaning: 'Tu paisaje emocional profundo.' },
        { name: 'Cuerpo',   meaning: 'Lo que tu materia física te está diciendo.' },
        { name: 'Destino',  meaning: 'La dirección energética del momento.' }
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
      'Las cartas se mezclan con tu energía…',
      'El universo afina su voz…',
      'Tu intención toma forma…',
      'Los hilos del destino se ordenan…'
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

    // Volteo secuencial
    const cards3d = $$('.card-3d', layout);
    cards3d.forEach((c, i) => {
      setTimeout(() => {
        c.classList.add('is-flipped');
        vibrate(10);
        soundChime(440 + i * 60);
      }, 350 + i * 480);
    });
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
    const grad = card.gradient || ['#1a0b2e', '#2e1352', '#7b2cbf'];
    const cls = card.isInverted ? 'card-3d is-inverted' : 'card-3d';
    const symbol = card.symbol || '✦';
    // Etiqueta esquina: número romano para mayores, número árabe + palo para menores
    let cornerLeft = symbol;
    let cornerRight = symbol;
    let arcanaTag = '';
    if (card.arcana === 'major') {
      cornerLeft = toRoman(card.number || 0);
      cornerRight = symbol;
      arcanaTag = 'Arcano Mayor';
    } else if (card.suit && SUITS[card.suit]) {
      cornerLeft = card.number ? card.number.toString() : SUITS[card.suit].symbol;
      cornerRight = SUITS[card.suit].symbol || symbol;
      arcanaTag = SUITS[card.suit].name;
    }
    return `
      <div class="${cls}" data-idx="${idx}" style="--g1:${grad[0]};--g2:${grad[1]};--g3:${grad[2]}">
        <div class="card-3d__inner">
          <div class="card-3d__face card-3d__back">
            <div class="card-3d__pattern"></div>
            <div class="card-3d__sigil">✦</div>
          </div>
          <div class="card-3d__face card-3d__front">
            <div class="card-3d__corner card-3d__corner--tl">${cornerLeft}</div>
            <div class="card-3d__corner card-3d__corner--br">${cornerRight}</div>
            <div class="card-3d__art">
              <div class="card-3d__art-circle">
                <span class="card-3d__art-symbol">${symbol}</span>
              </div>
            </div>
            <div class="card-3d__name">${escapeHTML(card.name)}</div>
            <div class="card-3d__meta">${escapeHTML(arcanaTag)}</div>
            ${card.isInverted ? '<div class="card-3d__inv-tag">Invertida</div>' : ''}
          </div>
        </div>
      </div>
    `;
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
          <p class="read-guide__text">Lo que sigue tiene tres partes: una <strong>introducción general</strong>, las <strong>cartas una a una</strong> en su posición, y una <strong>síntesis final</strong>. Las cartas <em>invertidas</em> no son malas — son fuerzas pidiendo ser miradas. Toca el ${infoTrigger('invertida')} junto a cualquier término para entenderlo mejor.</p>
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
          <h3 class="interp__synth-title">Síntesis del oráculo</h3>
          ${synthesis}
        </section>
        <p class="interp__sign">— Que esta lectura te acompañe. ✦</p>
      </article>
    `;
  }

  function buildIntro(spread, cards, question) {
    const openings = [
      'Las cartas han hablado, y lo han hecho con voz clara.',
      'El mazo ha caído tal como debía caer en este instante.',
      'Hay algo que el universo quiere que mires hoy con honestidad.',
      'Lo que aparece aquí no es casualidad: es la voz silenciosa de tu propio momento.'
    ];
    let txt = `<p>${pick(openings)}</p>`;

    if (question) {
      const qOpen = [
        `Le has preguntado al oráculo: <em>«${escapeHTML(question)}»</em> — y la respuesta llega en capas.`,
        `Tu pregunta —<em>«${escapeHTML(question)}»</em>— ha encontrado eco en estas cartas.`,
        `Dejas en el aire una inquietud: <em>«${escapeHTML(question)}»</em>. Las cartas la reciben con cuidado.`
      ];
      txt += `<p>${pick(qOpen)}</p>`;
    }

    // Detección rápida de tono general
    const majors = cards.filter(c => c.arcana === 'major').length;
    const inv = cards.filter(c => c.isInverted).length;

    if (majors >= Math.ceil(cards.length / 2) && cards.length > 1) {
      txt += `<p>Esta lectura está atravesada por <strong>arcanos mayores</strong>, lo que indica que estás en un momento de <em>destino activo</em>: las fuerzas grandes del alma se están moviendo y poco depende del azar pequeño.</p>`;
    }
    if (inv >= Math.ceil(cards.length / 2) && cards.length > 1) {
      txt += `<p>Aparecen varias cartas <strong>invertidas</strong>, y eso no es un mal augurio: es una invitación a mirar las sombras con honestidad. Lo invertido no es lo opuesto, es lo que pide ser integrado.</p>`;
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

    const transitions = [
      'En la posición de',
      'Bajo el lente de',
      'Como voz de',
      'Como respuesta a la pregunta de'
    ];
    const transition = pick(transitions);

    const grad = card.gradient || ['#1a0b2e', '#2e1352', '#7b2cbf'];

    const personalReading = generatePersonalReading(card, position, idx);
    const invFlag = card.isInverted ? `<span class="interp-card__inv">↺ invertida</span>${infoTrigger('invertida')}` : '';

    return `
      <div class="interp-card" style="--g1:${grad[0]};--g2:${grad[1]};--g3:${grad[2]}">
        <div class="interp-card__head">
          <div class="interp-card__symbol">${card.symbol || '✦'}</div>
          <div class="interp-card__titles">
            <h4 class="interp-card__name">${escapeHTML(card.name)} ${invFlag}</h4>
            <p class="interp-card__pos">${transition} <strong>${escapeHTML(position.name)}</strong></p>
            <p class="interp-card__meta">${escapeHTML(arcanaLabel)} ${arcanaInfo}</p>
            <div class="interp-card__chips">${astro}${elem}</div>
          </div>
        </div>
        <p class="interp-card__meaning">${escapeHTML(meaning)}</p>
        ${card.description ? `<p class="interp-card__desc">${escapeHTML(card.description)}</p>` : ''}
        <p class="interp-card__personal">${personalReading}</p>
      </div>
    `;
  }

  function generatePersonalReading(card, position, idx) {
    // Tejido de frases que mezcla la posición con la energía emocional
    const energy = card.emotionalEnergy || '';
    const posName = position.name.toLowerCase();
    const posMeaning = position.meaning;

    const templates = [
      `En relación a <strong>${escapeHTML(posName)}</strong>, esta carta te invita a mirar lo siguiente: ${escapeHTML(posMeaning)} ${escapeHTML(energy)}`,
      `Aquí, donde se habla de ${escapeHTML(posName)}, el mensaje es íntimo. ${escapeHTML(posMeaning)} ${escapeHTML(energy)}`,
      `Lo que esta carta sostiene en este lugar es delicado: ${escapeHTML(posMeaning)} ${escapeHTML(energy)}`,
      `Detente un momento aquí. ${escapeHTML(posMeaning)} ${escapeHTML(energy)}`
    ];

    let txt = templates[idx % templates.length];

    if (card.isInverted) {
      const invFrames = [
        ' Su forma invertida no anuncia desgracia: anuncia integración. Lo que evitas mirar es justamente lo que está pidiendo paso.',
        ' Al estar al revés, la carta te pide pausa antes de actuar. Hay algo que necesita ser sentido, no resuelto.',
        ' Su giro indica que la energía está atrapada y necesita movimiento honesto, no fuerza.'
      ];
      txt += pick(invFrames);
    } else {
      const posFrames = [
        ' Confía: la energía está alineada para sostenerte si das el paso.',
        ' Esta es una bendición silenciosa que ya está obrando contigo.',
        ' La invitación es clara: avanza con suavidad pero sin dudar de ti.'
      ];
      txt += pick(posFrames);
    }
    return txt;
  }

  function elementSymbol(el) {
    return ({ fuego: '🜂', agua: '🜄', aire: '🜁', tierra: '🜃' })[el] || '✦';
  }

  function buildSynthesis(spread, cards) {
    const parts = [];

    // 1. Elemento dominante
    const elements = cards.map(c => c.element).filter(Boolean);
    const elCount = countBy(elements);
    const topEl = topKey(elCount);
    if (topEl && elCount[topEl] >= Math.max(2, Math.ceil(cards.length / 2))) {
      const elDesc = (typeof ELEMENT_ENERGIES !== 'undefined' && ELEMENT_ENERGIES[topEl])
        ? ELEMENT_ENERGIES[topEl].description
        : '';
      parts.push(`<p>La lectura está marcada por el elemento <strong>${escapeHTML(topEl)}</strong>. ${escapeHTML(elDesc)} Tu momento pide moverse en clave de ${escapeHTML(topEl)}.</p>`);
    }

    // 2. Palo dominante
    const suits = cards.map(c => c.suit).filter(Boolean);
    const suCount = countBy(suits);
    const topSu = topKey(suCount);
    if (topSu && suCount[topSu] >= 2 && SUITS[topSu]) {
      const s = SUITS[topSu];
      parts.push(`<p>Predominan los <strong>${escapeHTML(s.name)}</strong>, ligados a ${escapeHTML(s.domain)}. Es el terreno donde se está jugando la partida principal de este ciclo.</p>`);
    }

    // 3. Cartas inv vs rectas
    const inv = cards.filter(c => c.isInverted).length;
    const direct = cards.length - inv;
    if (cards.length > 1) {
      if (inv === 0) {
        parts.push(`<p>Todas las cartas aparecen rectas: hay <strong>fluidez</strong>. La energía está disponible. Solo falta tu sí consciente.</p>`);
      } else if (inv === cards.length) {
        parts.push(`<p>Todas las cartas vienen invertidas: el universo te pide <strong>pausa, escucha y honestidad interna</strong> antes que acción. No es bloqueo: es introspección sagrada.</p>`);
      } else if (inv > direct) {
        parts.push(`<p>Hay más cartas invertidas que rectas. La lectura te invita a <strong>limpiar antes de avanzar</strong>: revisar creencias, sanar nudos antes de mover el cuerpo.</p>`);
      }
    }

    // 4. Combinaciones especiales
    const majors = cards.filter(c => c.arcana === 'major');
    if (majors.length >= 2 && cards.length >= 3) {
      parts.push(`<p>La presencia de <strong>${majors.length} arcanos mayores</strong> en esta tirada subraya que no estás solo en este momento: hay fuerzas más grandes acompañándote. Confía en el guion del alma.</p>`);
    }

    // 5. Si la primera carta es muy "luminosa" o muy "sombra" → cierre
    const last = cards[cards.length - 1];
    if (last) {
      if (last.isInverted) {
        parts.push(`<p>El cierre de la lectura llega <em>en sombra</em>: la última carta te recuerda que la luz no se busca afuera, se enciende dentro. Sé suave contigo en los próximos días.</p>`);
      } else {
        parts.push(`<p>El cierre de la lectura es luminoso: la última carta confirma que algo bueno se está cocinando. La paciencia será tu mayor virtud.</p>`);
      }
    }

    // Cierre poético siempre
    const closings = [
      `<p>Recuerda: el oráculo no impone destino, solo nombra el viento que ya sopla. Tú eres quien decide cómo navegarlo.</p>`,
      `<p>Lleva esta lectura como una semilla. Algunas verdades necesitan días, otras semanas, para abrirse del todo.</p>`,
      `<p>Lo que aquí se ha dicho es un espejo, no un veredicto. Eres más grande que cualquier carta.</p>`
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
        <h4 class="astro-card__h">Compatibilidades del alma</h4>
        <p><strong>Más afín:</strong> ${(compat.mejor || []).map(s => `<span class="astro-tag">${ZODIAC_SIGNS[s].symbol} ${escapeHTML(ZODIAC_SIGNS[s].name)}</span>`).join('')}</p>
        <p><strong>Más desafiante (y por tanto, más maestra):</strong> ${(compat.desafiante || []).map(s => `<span class="astro-tag astro-tag--alt">${ZODIAC_SIGNS[s].symbol} ${escapeHTML(ZODIAC_SIGNS[s].name)}</span>`).join('')}</p>
      </div>

      <div class="astro-card">
        <h4 class="astro-card__h">Consejo emocional</h4>
        <p>${escapeHTML(profile.advice)}</p>
      </div>

      <div class="astro-card astro-card--prediction">
        <h4 class="astro-card__h">Predicción simbólica de hoy</h4>
        <p>${pred}</p>
      </div>
    `;

    if (showFeedback) {
      showToast('Tu mapa energético está listo ✦');
      result.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function ascCombo(sun, rise) {
    if (sun === rise) return 'profundamente coherente: tu interior y tu exterior van de la mano';
    const sunEl  = ZODIAC_SIGNS[sun].element;
    const riseEl = ZODIAC_SIGNS[rise].element;
    if (sunEl === riseEl) return `con un alma claramente de ${sunEl}: lo que muestras y lo que sientes vibran al mismo ritmo`;
    return `magnética y compleja: tu interior es de ${sunEl} y tu envoltura energética es de ${riseEl}, lo que te da matices que pocos perciben a primera vista`;
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
      'El día se abre como un libro que solo tú puedes leer.',
      'Hay una corriente sutil avanzando contigo hoy.',
      'Una pequeña sincronía espera ser notada.',
      'El cosmos te guiña el ojo: presta atención a los detalles.'
    ];
    const middles = [
      'Una conversación inesperada puede traerte claridad.',
      'Confía en la primera intuición que aparezca antes del mediodía.',
      'Si dudas entre dos caminos, elige el que requiera más coraje.',
      'Un detalle pequeño puede cambiar el rumbo de tu tarde.',
      'Alguien necesitará tu palabra cálida hoy.'
    ];
    const closings = [
      'La noche te traerá una respuesta si la pides en silencio.',
      'Cierra el día con un pensamiento de gratitud.',
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
      if (c3d) { c3d.classList.add('is-flipped'); soundChime(520); }
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
      // Usuario habitual: directo al home
      $('#screen-splash')?.classList.remove('is-active');
      $('#screen-home')?.classList.add('is-active');
      onEnterHome();
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
