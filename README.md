# Arcanum Stellaris

Una webapp de tarot y astrología sin servidor, sin tracking, sin ads.
Toda la lógica vive en tu navegador. Tus datos también.

## Estructura

```
arcanum-stellaris/
├── index.html              # Estructura HTML, splash + onboarding + screens
├── styles.css              # Sistema visual completo
├── app.js                  # Motor: tiradas, interpretación, navegación, PWA
├── cards.js                # Las 78 cartas (mayores + menores) con descripciones
├── cards-art.js            # SVG fallback de cartas (usado si la imagen falla)
├── cards-images.js         # URLs Wikimedia con cadena de fallback (.jpeg/.jpg)
│
├── logo-arcanum.png        # Logo principal (splash)
├── manifest.json           # PWA: nombre, iconos, theme-color
├── sw.js                   # Service worker: offline + caché inteligente
├── icon-192.png            # Icono PWA Android (192×192)
├── icon-512.png            # Icono PWA Android (512×512)
├── icon-maskable-512.png   # Icono PWA con padding seguro (maskable)
└── apple-touch-icon.png    # Icono Apple home screen (180×180)
```

## Funcionalidades

- 7 tiradas de tarot (carta única, tres cartas, cruz reflexiva, amor,
  prosperidad, destino, mapa astral)
- Cartas Pamela Colman Smith 1909 desde Wikimedia Commons (dominio público)
- Backgrounds celestiales del Atlas Cellarius "Harmonia Macrocosmica" 1660
- Astrología solar simplificada con 12 signos + 4 elementos
- Carta del día con voz horóscopo-terapéutica
- Historial local guardado en LocalStorage
- 4 temas visuales (cosmic, midnight, rose, forest)
- PWA instalable: funciona offline, modo standalone

## Instalar como app

Ver el desplegable en Ajustes → "Instalar como app". Instrucciones para
Android (Chrome/Edge → menú ⋮ → Instalar app) y iOS (Safari →
Compartir → Añadir a pantalla de inicio).

## Privacidad

Cero servidores propios. Las imágenes Wikimedia se cargan desde
commons.wikimedia.org (dominio público). El service worker las cachea
para que la app funcione sin conexión tras la primera visita.

## Licencia y créditos

- Cartas RWS 1909 Roses & Lilies edition: dominio público (Pamela Colman Smith,
  escaneadas por Saskia Jansen, vía Wikimedia Commons)
- Atlas celeste Cellarius (1660): dominio público (Wikimedia Commons)
- Código de Arcanum Stellaris: MIT
