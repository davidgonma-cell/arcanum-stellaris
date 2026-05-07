/* ═══════════════════════════════════════════════════════════════════════
   ARCANUM · ILUSTRACIONES DE CARTAS
   ─────────────────────────────────────────────────────────────────────
   Cada carta lleva una escena SVG real, con marco decorativo, número
   romano, título y fondo elemental. Estilo: ilustración editorial cálida,
   trazo fino, línea continua, paleta de papel (terracota/oro/salvia).
   Todo es vectorial — pesa poco, escala perfecto y no depende de imágenes
   externas (sin problemas de copyright).
   ═══════════════════════════════════════════════════════════════════════ */

(function (root) {
  'use strict';

  // ── Paleta limitada para que todas las cartas se sientan del mismo set
  const C = {
    ink: '#3a322a',
    line: '#9b7e4a',          // contorno principal
    lineSoft: '#bfa67a',      // contornos secundarios
    accent: '#c97b63',        // terracota (acentos cálidos)
    accentDeep: '#a05a44',
    gold: '#c9a96e',
    sage: '#7a8d68',
    rose: '#d4998c',
    paper: '#faf6ef',
    cream: '#f0e6d2',
    sand: '#e3d6bd'
  };

  // ──────────────────────────────────────────────────────────────────
  // CARDS DESDE IMÁGENES REALES (extraídas de la lámina del usuario)
  // ──────────────────────────────────────────────────────────────────
  // Si existe una imagen para esta carta, devolvemos un wrapper <div>
  // (Las imágenes de mayores se gestionan en cards-images.js + app.js renderCard3D.
  //  Los menores y figuras de corte se generan como SVG vectorial puro abajo.)

  function frame(content, opts = {}) {
    const tint = opts.tint || C.line;
    const id = opts.id || 'd';

    // Constelación de fondo sutil (puntos diminutos en posiciones aleatorias deterministas)
    const constellation = `
      <g opacity="0.32" fill="${C.gold}">
        <circle cx="22" cy="40" r="0.7"/>
        <circle cx="178" cy="55" r="0.6"/>
        <circle cx="35" cy="78" r="0.5"/>
        <circle cx="165" cy="115" r="0.7"/>
        <circle cx="28" cy="145" r="0.5"/>
        <circle cx="172" cy="180" r="0.6"/>
        <circle cx="32" cy="220" r="0.6"/>
        <circle cx="168" cy="245" r="0.5"/>
        <circle cx="20" cy="252" r="0.7"/>
        <circle cx="180" cy="22" r="0.5"/>
      </g>
    `;

    // Crescent en cabecera + ramita botánica abajo (firma del marco)
    const headerMoon = `
      <g transform="translate(100, 22)" opacity="0.85">
        <path d="M-7 0 A7 7 0 1 0 -7 0.1
                 A5 5 0 1 1 -7 -0.1 Z"
              fill="${tint}" opacity="0.6"/>
        <circle cx="-12" cy="-3" r="0.6" fill="${C.gold}"/>
        <circle cx="9" cy="-2" r="0.6" fill="${C.gold}"/>
        <circle cx="0" cy="-7" r="0.5" fill="${C.gold}"/>
      </g>
    `;
    const footerSprig = `
      <g transform="translate(100, 258)" opacity="0.7" stroke="${C.sage}" stroke-width="0.6" fill="none" stroke-linecap="round">
        <line x1="0" y1="-6" x2="0" y2="4"/>
        <path d="M0 -3 Q-6 -5 -8 -2 Q-5 -4 0 -2"/>
        <path d="M0 -3 Q6 -5 8 -2 Q5 -4 0 -2"/>
        <path d="M0 1 Q-5 0 -6 3"/>
        <path d="M0 1 Q5 0 6 3"/>
        <circle cx="0" cy="-7" r="0.7" fill="${C.sage}" stroke="none"/>
      </g>
    `;

    return `
      <svg class="cardart" viewBox="0 0 200 280" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <linearGradient id="cardBg-${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${opts.bg1 || C.paper}"/>
            <stop offset="100%" stop-color="${opts.bg2 || C.cream}"/>
          </linearGradient>
          <radialGradient id="cardSpot-${id}" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stop-color="${opts.spot || '#fff'}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${opts.spot || '#fff'}" stop-opacity="0"/>
          </radialGradient>
          <pattern id="grain-${id}" patternUnits="userSpaceOnUse" width="4" height="4">
            <circle cx="2" cy="2" r="0.15" fill="${tint}" opacity="0.18"/>
          </pattern>
        </defs>

        <!-- Fondo papel + halo + grano sutil -->
        <rect width="200" height="280" fill="url(#cardBg-${id})"/>
        <ellipse cx="100" cy="120" rx="90" ry="100" fill="url(#cardSpot-${id})"/>
        <rect width="200" height="280" fill="url(#grain-${id})"/>

        <!-- Constelación de fondo -->
        ${constellation}

        <!-- Marco doble + esquinas -->
        <rect x="8" y="8" width="184" height="264" fill="none"
              stroke="${tint}" stroke-width="0.7" opacity="0.65"/>
        <rect x="12" y="12" width="176" height="256" fill="none"
              stroke="${tint}" stroke-width="0.4" opacity="0.5"/>
        <g stroke="${tint}" stroke-width="0.6" fill="none" opacity="0.78" stroke-linecap="round">
          <path d="M14 22 Q14 14 22 14"/>
          <circle cx="14" cy="14" r="1.2" fill="${tint}" stroke="none"/>
          <path d="M186 22 Q186 14 178 14"/>
          <circle cx="186" cy="14" r="1.2" fill="${tint}" stroke="none"/>
          <path d="M14 258 Q14 266 22 266"/>
          <circle cx="14" cy="266" r="1.2" fill="${tint}" stroke="none"/>
          <path d="M186 258 Q186 266 178 266"/>
          <circle cx="186" cy="266" r="1.2" fill="${tint}" stroke="none"/>
        </g>

        <!-- Decoraciones del marco -->
        ${headerMoon}
        ${footerSprig}

        <!-- Escena central -->
        <g transform="translate(0, 30)">${content}</g>
      </svg>
    `;
  }

  // ──────────────────────────────────────────────────────────────────
  // ESCENAS — 22 ARCANOS MAYORES
  // ──────────────────────────────────────────────────────────────────

  // Helper: figura humana estilizada (cuerpo + cabeza)
  const figure = (x, y, scale = 1, color = C.line) => `
    <g transform="translate(${x},${y}) scale(${scale})" stroke="${color}" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="0" cy="-22" r="6" fill="${C.cream}"/>
      <path d="M0 -16 L0 8 M-9 -10 L9 -10 M-7 8 L-2 26 M7 8 L2 26"/>
    </g>
  `;

  // Helper: estrellas en el cielo
  const stars = (positions, color = C.gold) => positions.map(p =>
    `<g transform="translate(${p[0]},${p[1]})" fill="${color}">
       <path d="M0 -3 L0.8 -0.8 L3 0 L0.8 0.8 L0 3 L-0.8 0.8 L-3 0 L-0.8 -0.8 Z"/>
     </g>`
  ).join('');

  const MAJORS = {

    // 0 · El Viajero Cósmico — figura caminando, estrellas, borde
    m00: frame(`
      ${stars([[40,30],[160,40],[55,80],[170,90],[30,140]], C.gold)}
      <circle cx="100" cy="60" r="14" fill="none" stroke="${C.line}" stroke-width="0.8" opacity="0.6"/>
      <path d="M30 200 Q100 195 170 200" stroke="${C.line}" stroke-width="0.6" fill="none" opacity="0.6"/>
      <path d="M55 198 L75 175 L95 198" stroke="${C.line}" stroke-width="0.6" fill="none" opacity="0.5"/>
      ${figure(100, 165, 1.4, C.accent)}
      <path d="M100 145 L100 90" stroke="${C.line}" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.55"/>
    `, { id: 'm00', tint: C.line }),

    // 1 · La Maga / La Tejedora — figura con manos arriba, símbolos infinito
    m01: frame(`
      ${stars([[40,30],[160,30]], C.gold)}
      <path d="M70 60 Q100 40 130 60 Q100 80 70 60" stroke="${C.accent}" stroke-width="0.8" fill="none"/>
      <path d="M85 90 L100 70 L115 90" stroke="${C.line}" stroke-width="0.7" fill="none"/>
      ${figure(100, 165, 1.5, C.accent)}
      <line x1="60" y1="195" x2="140" y2="195" stroke="${C.line}" stroke-width="0.8"/>
      <circle cx="60" cy="195" r="2" fill="${C.gold}"/>
      <circle cx="140" cy="195" r="2" fill="${C.gold}"/>
      <path d="M85 175 Q100 160 115 175" stroke="${C.line}" stroke-width="0.5" fill="none" opacity="0.5"/>
    `, { id: 'm01' }),

    // 2 · La Sacerdotisa de la Luna — luna creciente entre dos columnas
    m02: frame(`
      <path d="M100 50 A28 28 0 1 1 110 95 A22 22 0 1 0 100 50 Z" fill="${C.cream}" stroke="${C.line}" stroke-width="0.9"/>
      ${stars([[55,40],[145,40],[40,80],[160,80]], C.gold)}
      <line x1="55" y1="115" x2="55" y2="220" stroke="${C.line}" stroke-width="1.2"/>
      <line x1="145" y1="115" x2="145" y2="220" stroke="${C.line}" stroke-width="1.2"/>
      <circle cx="55" cy="115" r="3" fill="${C.gold}"/>
      <circle cx="145" cy="115" r="3" fill="${C.gold}"/>
      <circle cx="55" cy="220" r="3" fill="${C.gold}"/>
      <circle cx="145" cy="220" r="3" fill="${C.gold}"/>
      <path d="M85 170 Q100 155 115 170 L115 220 L85 220 Z" fill="${C.cream}" stroke="${C.line}" stroke-width="0.8"/>
    `, { id: 'm02', bg1: '#f6efe2', bg2: '#ede2cf' }),

    // 3 · La Emperatriz / Madre Tierra
    m03: frame(`
      <path d="M100 60 L108 85 L135 85 L113 100 L121 125 L100 110 L79 125 L87 100 L65 85 L92 85 Z"
            fill="none" stroke="${C.gold}" stroke-width="0.9"/>
      ${figure(100, 175, 1.6, C.accent)}
      <path d="M50 220 Q100 205 150 220" stroke="${C.line}" stroke-width="0.7" fill="none"/>
      <g stroke="${C.sage}" stroke-width="0.6" fill="none">
        <path d="M55 215 Q60 205 65 215"/>
        <path d="M75 218 Q80 208 85 218"/>
        <path d="M115 218 Q120 208 125 218"/>
        <path d="M135 215 Q140 205 145 215"/>
      </g>
    `, { id: 'm03', bg1: '#f6f1e2', bg2: '#ebe2c7' }),

    // 4 · El Emperador — trono, montañas
    m04: frame(`
      <path d="M40 130 L80 80 L120 110 L160 75 L160 200 L40 200 Z"
            fill="${C.sand}" stroke="${C.line}" stroke-width="0.7" opacity="0.6"/>
      ${figure(100, 180, 1.5, C.accentDeep)}
      <rect x="80" y="195" width="40" height="35" fill="none" stroke="${C.line}" stroke-width="0.8"/>
      <path d="M75 195 L75 175 L80 195 M125 195 L125 175 L120 195" stroke="${C.line}" stroke-width="0.8" fill="none"/>
    `, { id: 'm04' }),

    // 5 · El Oráculo Eterno — figura sentada con escritos
    m05: frame(`
      ${stars([[40,40],[160,40]], C.gold)}
      <rect x="60" y="60" width="80" height="50" fill="${C.cream}" stroke="${C.line}" stroke-width="0.7"/>
      <line x1="68" y1="72" x2="132" y2="72" stroke="${C.line}" stroke-width="0.4" opacity="0.5"/>
      <line x1="68" y1="80" x2="132" y2="80" stroke="${C.line}" stroke-width="0.4" opacity="0.5"/>
      <line x1="68" y1="88" x2="120" y2="88" stroke="${C.line}" stroke-width="0.4" opacity="0.5"/>
      <line x1="68" y1="96" x2="125" y2="96" stroke="${C.line}" stroke-width="0.4" opacity="0.5"/>
      ${figure(100, 175, 1.5, C.accent)}
      <path d="M80 135 Q100 130 120 135" stroke="${C.line}" stroke-width="0.6" fill="none" opacity="0.5"/>
    `, { id: 'm05' }),

    // 6 · Los Amantes — dos figuras + corazón
    m06: frame(`
      <path d="M100 65 L94 75 Q82 75 82 87 Q82 100 100 110 Q118 100 118 87 Q118 75 106 75 Z"
            fill="${C.rose}" opacity="0.5" stroke="${C.accent}" stroke-width="0.7"/>
      ${stars([[50,40],[150,40],[100,30]], C.gold)}
      ${figure(75, 175, 1.3, C.accent)}
      ${figure(125, 175, 1.3, C.accentDeep)}
      <path d="M85 165 Q100 155 115 165" stroke="${C.accent}" stroke-width="0.6" fill="none" opacity="0.6"/>
    `, { id: 'm06', bg1: '#faf2ed', bg2: '#f2e2d8' }),

    // 7 · El Carro / Movimiento
    m07: frame(`
      ${stars([[40,30],[160,30],[100,20]], C.gold)}
      <rect x="60" y="120" width="80" height="50" fill="${C.cream}" stroke="${C.line}" stroke-width="0.8"/>
      <circle cx="70" cy="180" r="14" fill="none" stroke="${C.line}" stroke-width="0.9"/>
      <circle cx="130" cy="180" r="14" fill="none" stroke="${C.line}" stroke-width="0.9"/>
      <line x1="70" y1="166" x2="70" y2="194" stroke="${C.line}" stroke-width="0.5"/>
      <line x1="56" y1="180" x2="84" y2="180" stroke="${C.line}" stroke-width="0.5"/>
      <line x1="130" y1="166" x2="130" y2="194" stroke="${C.line}" stroke-width="0.5"/>
      <line x1="116" y1="180" x2="144" y2="180" stroke="${C.line}" stroke-width="0.5"/>
      ${figure(100, 130, 1.1, C.accent)}
      <path d="M40 215 L160 215" stroke="${C.line}" stroke-width="0.5" stroke-dasharray="3 4" opacity="0.5"/>
    `, { id: 'm07' }),

    // 8 · La Fuerza — figura tocando un león estilizado
    m08: frame(`
      <path d="M100 50 L104 60 L114 60 L106 67 L109 77 L100 71 L91 77 L94 67 L86 60 L96 60 Z"
            fill="${C.gold}" opacity="0.7"/>
      <ellipse cx="135" cy="160" rx="22" ry="16" fill="${C.sand}" stroke="${C.line}" stroke-width="0.8"/>
      <circle cx="148" cy="155" r="1.5" fill="${C.ink}"/>
      <path d="M155 153 Q165 150 165 145 M155 158 Q170 160 170 168 M155 165 Q165 170 165 178"
            stroke="${C.gold}" stroke-width="0.7" fill="none"/>
      ${figure(75, 175, 1.3, C.accent)}
      <path d="M90 158 Q105 155 120 158" stroke="${C.accent}" stroke-width="0.5" fill="none"/>
    `, { id: 'm08', bg1: '#f7f0de', bg2: '#ecddb8' }),

    // 9 · El Ermitaño — figura con bastón y luz
    m09: frame(`
      <circle cx="100" cy="70" r="18" fill="${C.gold}" opacity="0.55"/>
      <circle cx="100" cy="70" r="11" fill="${C.gold}" opacity="0.85"/>
      ${stars([[50,50],[150,50]], C.gold)}
      ${figure(100, 165, 1.5, C.accentDeep)}
      <line x1="115" y1="130" x2="135" y2="220" stroke="${C.line}" stroke-width="1.1"/>
      <path d="M30 230 Q100 220 170 230" stroke="${C.line}" stroke-width="0.5" fill="none" opacity="0.5"/>
    `, { id: 'm09', bg1: '#f5edd9', bg2: '#e8d8b3' }),

    // 10 · La Rueda — círculo de transformación
    m10: frame(`
      <circle cx="100" cy="130" r="55" fill="none" stroke="${C.line}" stroke-width="1.2"/>
      <circle cx="100" cy="130" r="42" fill="none" stroke="${C.line}" stroke-width="0.6" opacity="0.6"/>
      <circle cx="100" cy="130" r="22" fill="none" stroke="${C.accent}" stroke-width="0.8"/>
      <g stroke="${C.line}" stroke-width="0.7" stroke-linecap="round">
        <line x1="100" y1="75" x2="100" y2="185"/>
        <line x1="45" y1="130" x2="155" y2="130"/>
        <line x1="61" y1="91" x2="139" y2="169"/>
        <line x1="139" y1="91" x2="61" y2="169"/>
      </g>
      <circle cx="100" cy="130" r="6" fill="${C.gold}"/>
      ${stars([[40,40],[160,40],[100,220]], C.gold)}
    `, { id: 'm10' }),

    // 11 · Justicia — balanza
    m11: frame(`
      ${stars([[40,40],[160,40]], C.gold)}
      <line x1="100" y1="60" x2="100" y2="180" stroke="${C.line}" stroke-width="1"/>
      <line x1="55" y1="90" x2="145" y2="90" stroke="${C.line}" stroke-width="1"/>
      <line x1="55" y1="90" x2="55" y2="115" stroke="${C.line}" stroke-width="0.5"/>
      <line x1="145" y1="90" x2="145" y2="115" stroke="${C.line}" stroke-width="0.5"/>
      <ellipse cx="55" cy="120" rx="18" ry="6" fill="${C.cream}" stroke="${C.line}" stroke-width="0.8"/>
      <ellipse cx="145" cy="120" rx="18" ry="6" fill="${C.cream}" stroke="${C.line}" stroke-width="0.8"/>
      ${figure(100, 220, 1.2, C.accent)}
    `, { id: 'm11' }),

    // 12 · El Suspendido — figura colgando, tranquila
    m12: frame(`
      <line x1="60" y1="50" x2="140" y2="50" stroke="${C.line}" stroke-width="1.2"/>
      <line x1="100" y1="50" x2="100" y2="120" stroke="${C.line}" stroke-width="1"/>
      <g transform="translate(100,170) rotate(180)">
        <circle cx="0" cy="-22" r="7" fill="${C.cream}" stroke="${C.accent}" stroke-width="1"/>
        <path d="M0 -15 L0 14 M-10 -8 L10 -8 M-7 14 L-3 35 M7 14 L3 35"
              stroke="${C.accent}" stroke-width="1.1" fill="none" stroke-linecap="round"/>
      </g>
      ${stars([[40,80],[160,80]], C.gold)}
      <circle cx="100" cy="148" r="22" fill="none" stroke="${C.gold}" stroke-width="0.6" opacity="0.55"/>
    `, { id: 'm12', bg1: '#f4ede0', bg2: '#e7dabe' }),

    // 13 · La Transformación — guadaña reinterpretada como puerta
    m13: frame(`
      ${stars([[40,40],[160,40],[100,30]], C.gold)}
      <path d="M70 90 Q70 60 100 60 Q130 60 130 90 L130 220 L70 220 Z"
            fill="${C.cream}" stroke="${C.line}" stroke-width="0.9"/>
      <path d="M100 60 L100 220" stroke="${C.line}" stroke-width="0.5" opacity="0.5"/>
      <circle cx="92" cy="145" r="1.2" fill="${C.gold}"/>
      <circle cx="108" cy="145" r="1.2" fill="${C.gold}"/>
      <path d="M85 90 Q100 75 115 90" stroke="${C.accent}" stroke-width="0.5" fill="none" opacity="0.5"/>
    `, { id: 'm13', bg1: '#f0e9da', bg2: '#dfd2b1' }),

    // 14 · La Templanza — agua entre dos cálices
    m14: frame(`
      ${stars([[40,40],[160,40]], C.gold)}
      <path d="M65 100 Q65 130 80 145 L75 175 L100 175 L95 145 Q110 130 110 100 Z"
            fill="${C.cream}" stroke="${C.line}" stroke-width="0.8"/>
      <path d="M125 80 Q125 110 140 125 L135 155 L160 155 L155 125 Q170 110 170 80 Z"
            fill="${C.cream}" stroke="${C.line}" stroke-width="0.8"/>
      <path d="M105 100 Q120 90 135 100" stroke="${C.accent}" stroke-width="1.2" fill="none"/>
      <path d="M108 110 Q123 100 138 110" stroke="${C.accent}" stroke-width="0.7" fill="none" opacity="0.6"/>
      ${figure(100, 230, 1, C.line)}
    `, { id: 'm14' }),

    // 15 · La Sombra — figura observándose
    m15: frame(`
      <ellipse cx="100" cy="220" rx="60" ry="12" fill="${C.line}" opacity="0.25"/>
      ${stars([[40,40],[160,40]], C.gold)}
      ${figure(100, 175, 1.4, C.accentDeep)}
      <g opacity="0.4">${figure(100, 230, 1.4, C.line)}</g>
      <path d="M100 195 L100 215" stroke="${C.line}" stroke-width="0.5" stroke-dasharray="2 3" opacity="0.5"/>
    `, { id: 'm15', bg1: '#f0e8d6', bg2: '#dccfae' }),

    // 16 · La Torre — algo cae para liberarse
    m16: frame(`
      <path d="M75 200 L75 100 L80 95 L80 80 L120 80 L120 95 L125 100 L125 200 Z"
            fill="${C.sand}" stroke="${C.line}" stroke-width="0.9"/>
      <path d="M80 80 L100 60 L120 80" fill="${C.accent}" opacity="0.5" stroke="${C.line}" stroke-width="0.7"/>
      <line x1="85" y1="115" x2="115" y2="115" stroke="${C.line}" stroke-width="0.5" opacity="0.5"/>
      <line x1="85" y1="135" x2="115" y2="135" stroke="${C.line}" stroke-width="0.5" opacity="0.5"/>
      <line x1="85" y1="155" x2="115" y2="155" stroke="${C.line}" stroke-width="0.5" opacity="0.5"/>
      <line x1="85" y1="175" x2="115" y2="175" stroke="${C.line}" stroke-width="0.5" opacity="0.5"/>
      <g stroke="${C.gold}" stroke-width="1" fill="none" stroke-linecap="round">
        <path d="M55 60 L70 75 M145 60 L130 75 M40 90 L55 88 M160 90 L145 88"/>
      </g>
    `, { id: 'm16', bg1: '#f7eee0', bg2: '#ecdbba' }),

    // 17 · La Estrella — esperanza, agua, estrella grande
    m17: frame(`
      <path d="M100 50 L106 75 L132 75 L111 90 L118 115 L100 100 L82 115 L89 90 L68 75 L94 75 Z"
            fill="${C.gold}" opacity="0.85"/>
      ${stars([[40,60],[160,60],[35,100],[165,100],[55,140],[145,140]], C.gold)}
      <path d="M50 200 Q100 185 150 200 L150 230 L50 230 Z"
            fill="${C.cream}" stroke="${C.line}" stroke-width="0.6"/>
      <path d="M60 215 Q100 205 140 215" stroke="${C.accent}" stroke-width="0.5" fill="none" opacity="0.6"/>
      <path d="M70 222 Q100 215 130 222" stroke="${C.accent}" stroke-width="0.4" fill="none" opacity="0.4"/>
    `, { id: 'm17' }),

    // 18 · La Luna — luna llena + agua
    m18: frame(`
      <circle cx="100" cy="80" r="32" fill="${C.cream}" stroke="${C.line}" stroke-width="0.9"/>
      <path d="M120 65 Q132 85 120 105" stroke="${C.line}" stroke-width="0.5" fill="none" opacity="0.5"/>
      ${stars([[40,50],[160,50],[40,130],[160,130]], C.gold)}
      <path d="M40 180 Q70 170 100 180 Q130 190 160 180" stroke="${C.line}" stroke-width="0.7" fill="none"/>
      <path d="M40 200 Q70 190 100 200 Q130 210 160 200" stroke="${C.line}" stroke-width="0.6" fill="none" opacity="0.7"/>
      <path d="M40 220 Q70 210 100 220 Q130 230 160 220" stroke="${C.line}" stroke-width="0.5" fill="none" opacity="0.5"/>
    `, { id: 'm18', bg1: '#eee5d2', bg2: '#dac8a3' }),

    // 19 · El Sol — gran sol con rayos
    m19: frame(`
      <g stroke="${C.gold}" stroke-width="1.4" stroke-linecap="round">
        <line x1="100" y1="40" x2="100" y2="55"/>
        <line x1="100" y1="180" x2="100" y2="195"/>
        <line x1="35" y1="120" x2="50" y2="120"/>
        <line x1="150" y1="120" x2="165" y2="120"/>
        <line x1="55" y1="75" x2="65" y2="85"/>
        <line x1="135" y1="155" x2="145" y2="165"/>
        <line x1="145" y1="75" x2="135" y2="85"/>
        <line x1="65" y1="155" x2="55" y2="165"/>
      </g>
      <circle cx="100" cy="120" r="42" fill="${C.gold}" opacity="0.4"/>
      <circle cx="100" cy="120" r="32" fill="${C.gold}" opacity="0.7"/>
      <circle cx="100" cy="120" r="22" fill="${C.gold}"/>
      <g stroke="${C.line}" stroke-width="0.5" fill="none" opacity="0.55">
        <path d="M40 220 Q70 215 100 220 Q130 215 160 220"/>
      </g>
      ${figure(100, 240, 1, C.accent)}
    `, { id: 'm19', bg1: '#fbf1d4', bg2: '#f0d9a3' }),

    // 20 · El Despertar — flor de loto / círculo + alas
    m20: frame(`
      ${stars([[40,40],[160,40]], C.gold)}
      <circle cx="100" cy="120" r="48" fill="none" stroke="${C.gold}" stroke-width="0.6"/>
      <circle cx="100" cy="120" r="32" fill="none" stroke="${C.gold}" stroke-width="0.8"/>
      <g stroke="${C.accent}" stroke-width="0.9" fill="none" stroke-linecap="round">
        <path d="M100 90 Q105 110 100 130 Q95 110 100 90 Z"/>
        <path d="M70 110 Q90 115 100 120 Q90 125 70 130 Q80 120 70 110 Z"/>
        <path d="M130 110 Q110 115 100 120 Q110 125 130 130 Q120 120 130 110 Z"/>
        <path d="M100 150 Q95 130 100 110 Q105 130 100 150 Z"/>
      </g>
      <circle cx="100" cy="120" r="6" fill="${C.accent}"/>
    `, { id: 'm20' }),

    // 21 · El Mundo — ouroboros, mundo cerrado
    m21: frame(`
      ${stars([[40,40],[160,40],[40,200],[160,200]], C.gold)}
      <ellipse cx="100" cy="130" rx="60" ry="75" fill="none" stroke="${C.gold}" stroke-width="1.4"/>
      <g opacity="0.6" stroke="${C.line}" stroke-width="0.5" fill="none">
        <path d="M48 130 Q100 105 152 130"/>
        <path d="M48 130 Q100 155 152 130"/>
      </g>
      ${figure(100, 165, 1.4, C.accent)}
      <g fill="${C.gold}">
        <circle cx="100" cy="55" r="3"/>
        <circle cx="100" cy="205" r="3"/>
        <circle cx="40" cy="130" r="3"/>
        <circle cx="160" cy="130" r="3"/>
      </g>
    `, { id: 'm21' })
  };

  // ──────────────────────────────────────────────────────────────────
  // ESCENAS — ARCANOS MENORES (por elemento)
  // Cada palo recibe una escena base + un patrón de "pip" según el número
  // ──────────────────────────────────────────────────────────────────

  // Escena de fondo por elemento (decoración del palo)
  const ELEMENT_SCENES = {
    fuego: `
      ${stars([[40,40],[160,40]], C.gold)}
      <g stroke="${C.accent}" stroke-width="1.2" stroke-linecap="round" fill="none" opacity="0.85">
        <path d="M100 70 Q88 90 100 110 Q112 90 100 70 Z" fill="${C.accent}" opacity="0.7"/>
      </g>
      <path d="M40 220 L70 195 L100 215 L130 190 L160 220 Z"
            fill="${C.sand}" stroke="${C.line}" stroke-width="0.5" opacity="0.5"/>`,
    agua: `
      <circle cx="100" cy="75" r="22" fill="${C.cream}" stroke="${C.line}" stroke-width="0.7" opacity="0.85"/>
      <path d="M115 65 Q125 85 115 105" stroke="${C.line}" stroke-width="0.4" fill="none" opacity="0.5"/>
      ${stars([[45,55],[155,55]], C.gold)}
      <path d="M30 180 Q60 170 90 180 Q120 190 150 180 L170 180" stroke="${C.line}" stroke-width="0.7" fill="none"/>
      <path d="M30 200 Q60 190 90 200 Q120 210 150 200 L170 200" stroke="${C.line}" stroke-width="0.5" fill="none" opacity="0.65"/>
      <path d="M30 220 Q60 210 90 220 Q120 230 150 220 L170 220" stroke="${C.line}" stroke-width="0.4" fill="none" opacity="0.45"/>`,
    aire: `
      ${stars([[40,40],[100,30],[160,40],[55,80],[145,80]], C.gold)}
      <g stroke="${C.line}" stroke-width="0.6" fill="none" stroke-linecap="round" opacity="0.7">
        <path d="M40 130 Q70 110 100 125 Q130 140 160 120"/>
        <path d="M40 150 Q70 130 100 145 Q130 160 160 140"/>
        <path d="M50 175 Q80 165 100 175 Q130 185 150 170"/>
      </g>
      <path d="M85 205 Q100 195 115 205 L100 230 Z" fill="${C.cream}" stroke="${C.line}" stroke-width="0.6"/>`,
    tierra: `
      <path d="M100 65 L107 90 L100 115 L93 90 Z" fill="${C.sage}" opacity="0.7"/>
      <line x1="100" y1="115" x2="100" y2="155" stroke="${C.line}" stroke-width="0.7"/>
      <path d="M100 130 Q90 120 80 125 M100 140 Q110 130 120 135"
            stroke="${C.sage}" stroke-width="0.7" fill="none"/>
      ${stars([[45,45],[155,45]], C.gold)}
      <path d="M30 220 Q100 200 170 220 L170 240 L30 240 Z"
            fill="${C.sand}" opacity="0.6" stroke="${C.line}" stroke-width="0.5"/>
      <g stroke="${C.sage}" stroke-width="0.5" opacity="0.6">
        <path d="M55 218 Q60 208 65 218" fill="none"/>
        <path d="M125 218 Q130 208 135 218" fill="none"/>
      </g>`
  };

  // Símbolo del palo (copa, espada, vara, pentáculo)
  const SUIT_SYMBOLS = {
    calices: `
      <g transform="translate(0,0)" stroke="${C.line}" stroke-width="0.9" fill="${C.cream}">
        <path d="M-9 -10 Q-9 4 0 10 Q9 4 9 -10 Z"/>
        <path d="M-3 12 L0 18 L3 12" fill="none" stroke-linecap="round"/>
      </g>`,
    espadas: `
      <g transform="translate(0,0)" stroke="${C.line}" stroke-width="0.9" stroke-linecap="round">
        <line x1="0" y1="-12" x2="0" y2="10"/>
        <line x1="-7" y1="6" x2="7" y2="6"/>
        <path d="M-2 -12 L0 -16 L2 -12" fill="${C.line}"/>
      </g>`,
    varas: `
      <g transform="translate(0,0) rotate(20)" stroke="${C.line}" stroke-width="1.4" stroke-linecap="round">
        <line x1="0" y1="-13" x2="0" y2="13"/>
        <circle cx="0" cy="-13" r="2.5" fill="${C.gold}" stroke="none"/>
        <path d="M-3 -10 L3 -10 M-3 -6 L3 -6" stroke-width="0.5"/>
      </g>`,
    pentaculos: `
      <g transform="translate(0,0)" stroke="${C.line}" stroke-width="0.8" fill="${C.gold}" fill-opacity="0.5">
        <circle r="11"/>
        <path d="M0 -8 L2.4 -2.5 L8 -2.5 L3.5 1 L5.5 7 L0 3.5 L-5.5 7 L-3.5 1 L-8 -2.5 L-2.4 -2.5 Z" fill="${C.line}" stroke="none"/>
      </g>`
  };

  // Posiciones para los pips (1 a 10) en una grilla del centro
  function pipPositions(n) {
    if (n === 1) return [[100, 130]];
    if (n === 2) return [[100, 100], [100, 160]];
    if (n === 3) return [[100, 90], [100, 130], [100, 170]];
    if (n === 4) return [[80, 100], [120, 100], [80, 160], [120, 160]];
    if (n === 5) return [[80, 100], [120, 100], [100, 130], [80, 160], [120, 160]];
    if (n === 6) return [[80, 95], [120, 95], [80, 130], [120, 130], [80, 165], [120, 165]];
    if (n === 7) return [[80, 90], [120, 90], [100, 110], [80, 135], [120, 135], [80, 170], [120, 170]];
    if (n === 8) return [[80, 90], [120, 90], [80, 115], [120, 115], [80, 145], [120, 145], [80, 170], [120, 170]];
    if (n === 9) return [[75, 90], [100, 90], [125, 90], [75, 130], [100, 130], [125, 130], [75, 170], [100, 170], [125, 170]];
    return [[75, 85], [100, 85], [125, 85], [75, 115], [125, 115], [75, 145], [125, 145], [75, 175], [100, 175], [125, 175]];
  }

  // Escenas para figuras de la corte (aprendiz, caballera, reina, rey)
  function buildCourt(card, suit) {
    const courtFigures = {
      aprendiz: `${figure(100, 175, 1.4, C.accent)}`,
      caballera: `
        ${figure(100, 165, 1.4, C.accentDeep)}
        <ellipse cx="100" cy="220" rx="50" ry="10" fill="${C.line}" opacity="0.2"/>
        <path d="M55 215 Q70 205 85 215 M115 215 Q130 205 145 215" stroke="${C.line}" stroke-width="0.5" fill="none"/>`,
      reina: `
        <path d="M88 80 L96 70 L100 78 L104 70 L112 80 L100 75 Z" fill="${C.gold}"/>
        ${figure(100, 175, 1.5, C.accentDeep)}`,
      rey: `
        <path d="M85 80 L90 70 L95 78 L100 68 L105 78 L110 70 L115 80 L100 75 Z" fill="${C.gold}"/>
        ${figure(100, 175, 1.6, C.accentDeep)}`
    };
    const sym = SUIT_SYMBOLS[suit] || '';
    return `
      ${ELEMENT_SCENES[card.element] || ''}
      ${courtFigures[card.courtRole] || courtFigures.aprendiz}
      <g transform="translate(100, 110)">${sym}</g>
    `;
  }

  // Construye la escena de un menor numerado: pips del palo en grilla
  function buildNumeric(card, suit) {
    const n = card.number;
    const positions = pipPositions(n);
    const sym = SUIT_SYMBOLS[suit] || '';
    const pips = positions.map(p =>
      `<g transform="translate(${p[0]},${p[1]}) scale(0.85)">${sym}</g>`
    ).join('');
    return `
      ${ELEMENT_SCENES[card.element] || ''}
      ${pips}
    `;
  }

  // Builder principal de menores: SVG directo (las imágenes Wikimedia solo aplican a mayores)
  function buildMinor(card) {
    if (!card || !card.suit) return '';
    const suit = card.suit;
    const isCourt = card.number > 10 || ['aprendiz','caballera','reina','rey'].includes(card.courtRole || '');
    const tint = ({
      fuego: C.accent,
      agua: C.sage,
      aire: C.gold,
      tierra: C.sage
    })[card.element] || C.line;
    const id = card.id || ('m_' + Math.random().toString(36).slice(2, 7));

    const inner = isCourt
      ? buildCourt(card, suit)
      : buildNumeric(card, suit);

    return frame(inner, { id, tint });
  }

  // Builder de mayores: devuelve el SVG (la URL Wikimedia se gestiona aparte en renderCard3D)
  function buildMajor(card) {
    if (!card) return '';
    return MAJORS[card.id] || '';
  }

  // ──────────────────────────────────────────────────────────────────
  // BACK ART — SVG inline con luna creciente y constelaciones (sin imagen externa)
  // ──────────────────────────────────────────────────────────────────
  const BACK_ART = `
    <svg class="cardback" viewBox="0 0 200 320" preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgBack" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0e0a24"/>
          <stop offset="100%" stop-color="#1a1238"/>
        </linearGradient>
        <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#e8c896" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#d4a574" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <rect width="200" height="320" fill="url(#bgBack)"/>

      <!-- Marco doble dorado -->
      <rect x="6" y="6" width="188" height="308" rx="14"
            fill="none" stroke="#d4a574" stroke-width="0.8" opacity="0.7"/>
      <rect x="11" y="11" width="178" height="298" rx="10"
            fill="none" stroke="#b89758" stroke-width="0.4" opacity="0.5"/>

      <!-- Halo central -->
      <circle cx="100" cy="160" r="68" fill="url(#moonGlow)"/>

      <!-- Círculo decorativo concéntrico (mandala sutil) -->
      <circle cx="100" cy="160" r="58" fill="none" stroke="#d4a574" stroke-width="0.5" opacity="0.6"/>
      <circle cx="100" cy="160" r="52" fill="none" stroke="#d4a574" stroke-width="0.3" opacity="0.45"/>
      <circle cx="100" cy="160" r="46" fill="none" stroke="#d4a574" stroke-width="0.3" opacity="0.35"/>

      <!-- 12 estrellas en círculo -->
      <g fill="#e8c896" opacity="0.85">
        ${Array.from({length: 12}, (_, i) => {
          const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x = 100 + Math.cos(a) * 58;
          const y = 160 + Math.sin(a) * 58;
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${i % 3 === 0 ? 1.3 : 0.8}"/>`;
        }).join('')}
      </g>

      <!-- Luna creciente en el centro -->
      <g transform="translate(100, 160)">
        <path d="M -16 0 A 18 18 0 1 0 -2 -16 A 14 14 0 1 1 -16 0 Z"
              fill="#e8c896" opacity="0.95" transform="rotate(-15)"/>
      </g>

      <!-- Estrellas pequeñas distribuidas en el fondo -->
      <g fill="#d4a574" opacity="0.7">
        <circle cx="40" cy="50" r="0.8"/>
        <circle cx="160" cy="55" r="0.6"/>
        <circle cx="55" cy="75" r="0.5"/>
        <circle cx="155" cy="100" r="0.7"/>
        <circle cx="38" cy="115" r="0.5"/>
        <circle cx="172" cy="200" r="0.6"/>
        <circle cx="42" cy="225" r="0.7"/>
        <circle cx="158" cy="245" r="0.5"/>
        <circle cx="50" cy="265" r="0.6"/>
        <circle cx="155" cy="280" r="0.7"/>
        <circle cx="100" cy="40" r="1.0"/>
        <circle cx="100" cy="285" r="0.9"/>
      </g>

      <!-- Estrella superior centrada (8 puntas) -->
      <g transform="translate(100, 50)" fill="#e8c896">
        <path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" opacity="0.9"/>
      </g>

      <!-- Esquinas decorativas -->
      <g stroke="#d4a574" stroke-width="0.6" fill="none" opacity="0.6">
        <path d="M16 16 L26 16 M16 16 L16 26"/>
        <path d="M184 16 L174 16 M184 16 L184 26"/>
        <path d="M16 304 L26 304 M16 304 L16 294"/>
        <path d="M184 304 L174 304 M184 304 L184 294"/>
      </g>
    </svg>
  `;

  // ──────────────────────────────────────────────────────────────────
  // Exportar
  // ──────────────────────────────────────────────────────────────────
  root.ARCANUM_ART = {
    MAJORS: MAJORS,             // SVG-only (fallback)
    BACK: BACK_ART,             // imagen reverso real
    buildMinor: buildMinor,     // prefiere imagen, fallback SVG
    buildMajor: buildMajor,     // prefiere imagen, fallback SVG
    palette: C
  };

})(typeof window !== 'undefined' ? window : this);
