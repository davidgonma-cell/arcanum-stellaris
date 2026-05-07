# ✦ Arcanum Stellaris

Aplicación web premium de **tarot, astrología e interpretación espiritual**. Sin servidor, sin login, sin telemetría. Tus datos viven solo en tu dispositivo.

> *Diseñada para sentirse como un tarotista profesional moderno desde el móvil: cinematográfica, íntima y elegante.*

---

## 🌌 Características

- **78 cartas originales** (mazo *Arcanum Stellaris*) con nombre, arcana, elemento, asociación astrológica, símbolo, palabras clave, significado positivo, invertido, energía emocional y descripción profunda. Mazo inventado, no copia ningún tarot comercial.
- **7 tipos de tirada:** Una carta · Tres cartas · Cruz Mística · Amor · Dinero · Destino · Carta Astral espiritual.
- **Motor de interpretación dinámico** que combina posición + carta (recta/invertida) + descripción + síntesis. Detecta combinaciones (mayoría de mayores, elemento dominante, palo predominante, mayoría invertida) y produce texto en tono de tarotista profesional moderno.
- **Astrología simplificada coherente:** signo solar, ascendente aproximado, elemento dominante, perfil energético, compatibilidades, consejo emocional y predicción simbólica diaria.
- **Carta del día determinista:** misma carta para el mismo día, pero distinta cada amanecer.
- **Frase espiritual diaria** (31 frases rotativas).
- **Historial local** de lecturas guardadas con vista completa y opción de borrado.
- **Compartir lectura como imagen PNG** (renderizada vía Canvas) o copiar como texto.
- **4 ambientes visuales** intercambiables: Cósmico, Medianoche, Rosa Mística, Bosque Astral.
- **Efectos:** partículas animadas, parallax sutil, glassmorphism, flip 3D de cartas, animaciones cinematográficas, sonidos opcionales (WebAudio API), vibración háptica opcional en móvil.
- **Optimizado para móvil:** safe-area-inset, touch friendly, breakpoints sensibles, `prefers-reduced-motion` respetado.
- **Privacidad total:** 100% LocalStorage, sin servidores externos.

---

## 📦 Estructura

```
tarot-app/
├── index.html      ← SPA con todas las pantallas
├── styles.css      ← Sistema de diseño completo con temas
├── cards.js        ← Mazo Arcanum Stellaris (78 cartas) + datos astrológicos
├── app.js          ← Motor: navegación, lecturas, interpretación, astrología
└── README.md       ← Este documento
```

---

## 🚀 Instalación

### Opción 1 · Apertura directa
Simplemente abre `index.html` con doble clic. Funciona en cualquier navegador moderno (Chrome, Safari, Firefox, Edge).

### Opción 2 · Servidor local (recomendado)
Para evitar restricciones CORS de algunos navegadores:

```bash
# Python 3
cd tarot-app
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Y abre `http://localhost:8000` en tu navegador.

### Opción 3 · Despliegue
Sube los 4 archivos a cualquier hosting estático: **GitHub Pages, Netlify, Vercel, Cloudflare Pages, Surge, Firebase Hosting**, etc. No requiere build, no requiere backend.

---

## 🎨 Imágenes y ambientación

Las imágenes de fondo se cargan desde **Unsplash** mediante URLs directas (uso libre comercial según su [licencia](https://unsplash.com/license)). El CSS las carga vía variable `--hero-image` por tema, con overlay oscuro y vignette para legibilidad.

Cada tema usa una imagen distinta de naturaleza astral/mística:

| Tema | Inspiración visual |
|---|---|
| Cósmico | Galaxia, nebulosa violeta |
| Medianoche | Cielo estrellado azul profundo |
| Rosa Mística | Atardecer rosa, energía cósmica |
| Bosque Astral | Bosque nocturno con luna |

> **Si quieres usar tus propias imágenes:** modifica las variables `--hero-image` en la sección `:root` y los selectores `body.theme-*` de `styles.css`. Ten en cuenta el contraste: usa siempre overlay oscuro suficiente para que el texto dorado sea legible.

---

## 🔮 Arquitectura técnica

### Mazo (`cards.js`)
- 22 arcanos mayores escritos a mano, cada uno con su gradient propio, símbolo, regente astrológico, elemento, palabras clave y descripción literaria.
- 56 arcanos menores generados a partir de plantillas (`SUITS`, `NUMBER_MEANINGS`, `COURT_MEANINGS`) que combinan número + palo de forma coherente.
- Cada carta es un objeto inmutable. El barajado se hace por copia con Fisher–Yates.

### App (`app.js`)
- Sin frameworks. IIFE con `'use strict'`.
- **State machine simple** para flujo de lectura: `question → shuffle → select → reveal → interpret`.
- **Motor de interpretación** procedural con detección de combinaciones y plantillas variables para evitar repetición.
- **Astrología simplificada:**
  - **Signo solar:** rangos exactos por fecha (con caso especial Capricornio que cruza año).
  - **Ascendente:** aproximación basada en hora — un signo cada 2 horas a partir del amanecer simbólico (06:00). No reemplaza un cálculo astronómico real con coordenadas, pero produce resultados coherentes y poéticos.
  - **Elemento dominante:** combinación Sol + Ascendente.
- **Carta del día:** semilla determinista a partir de `YYYYMMDD`. Misma carta todo el día, distinta al amanecer siguiente.
- **Compartir como imagen:** el `Canvas` 1080×1350 dibuja fondo cósmico, estrellas, marca, título, pregunta y miniaturas de cartas con sus gradients propios. Exporta a PNG.
- **Sonidos:** WebAudio API genera tonos suaves al vuelo (sine wave + armónico). No se cargan archivos pesados. Drone de barajado opcional.
- **LocalStorage keys:**
  - `arcanum.settings` — preferencias del usuario
  - `arcanum.history` — lecturas guardadas (máx 60)
  - `arcanum.daily` — caché de cartas del día (máx 14 días)
  - `arcanum.astro` — datos astrológicos del usuario

---

## 🎭 Personalización

### Cambiar el tono de las interpretaciones
Edita en `app.js` los arrays `openings`, `templates`, `closings` dentro de `buildIntro`, `generatePersonalReading` y `buildSynthesis`. El tono se controla por el conjunto de plantillas.

### Añadir tiradas nuevas
En `app.js`, añade un objeto al array `SPREADS`:

```js
{
  key: 'sombra',
  title: 'La Sombra',
  subtitle: 'Lo que tu inconsciente esconde',
  icon: '☾',
  count: 4,
  layout: 'three',  // o crea uno nuevo en CSS
  positions: [
    { name: 'Lo que muestras', meaning: '…' },
    // …
  ]
}
```

### Añadir cartas al mazo
Añade objetos al array `ARCANUM_DECK.majors`. Mantén la estructura: `id`, `number`, `name`, `arcana: 'major'`, `element`, `astrology`, `symbol`, `gradient[3]`, `keywords[]`, `positiveMeaning`, `invertedMeaning`, `emotionalEnergy`, `description`.

### Cambiar la paleta o crear un tema nuevo
En `styles.css`, sección de variables CSS y selectores `body.theme-*`. Define:

```css
body.theme-mio {
  --bg-primary: #0a0a0a;
  --gold: #f7d774;
  --hero-image: url('https://…');
}
```

Luego añade el chip al HTML en la sección de ajustes.

---

## ⚖️ Licencias y créditos

- **Mazo Arcanum Stellaris:** creación original. Inspirado libremente en los arquetipos clásicos del tarot, los símbolos junguianos y la astrología occidental, pero sin copiar ningún mazo comercial protegido.
- **Imágenes:** Unsplash (licencia libre comercial).
- **Tipografías:** Cinzel, Cormorant Garamond, Outfit (Google Fonts, OFL).
- **Iconos / símbolos:** caracteres Unicode astronómicos y alquímicos.

---

## 🧘 Buenas prácticas y rendimiento

- ✅ Imágenes cargadas con `loading="eager"` solo en la pantalla activa (resto se cargan al navegar).
- ✅ No hay requests externos durante el uso normal salvo la primera carga de fonts e imágenes.
- ✅ Las partículas usan `requestAnimationFrame` y se pausan automáticamente con `prefers-reduced-motion`.
- ✅ El servicio funciona sin conexión a internet tras la primera carga (gracias al caché del navegador).
- ✅ `safe-area-inset` aplicado para móviles con notch.
- ✅ Toda la app pasa Lighthouse PWA básico salvo el manifest (puede añadirse fácilmente).

### Convertir en PWA (opcional)
1. Añade un `manifest.json`.
2. Implementa un `service-worker.js` simple que cachee los 4 archivos.
3. Registra el SW en `app.js` (hay un hook reservado en la función `init`).

---

## 🛡️ Privacidad

> **Todos tus datos permanecen únicamente en tu dispositivo.**

- No se envía nada a servidores externos.
- No hay analítica, ni cookies de seguimiento, ni publicidad.
- Las lecturas guardadas, datos astrológicos y preferencias viven solo en tu navegador (LocalStorage).
- Puedes borrarlo todo desde Ajustes → "Borrar todos mis datos".

---

## 🌠 Filosofía de la app

Esta app es un puente entre lo simbólico y lo emocional. Los arquetipos del tarot y la astrología no predicen el futuro: nombran lo que ya está vivo dentro de ti, y te invitan a mirarlo con honestidad. Que su uso sea siempre acompañado de tu propia intuición y discernimiento.

> *"El oráculo no impone destino, solo nombra el viento que ya sopla. Tú eres quien decide cómo navegarlo."*

— ✦ Arcanum Stellaris
