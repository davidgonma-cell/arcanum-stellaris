/* ════════════════════════════════════════════════════════════════════════
   CARD_IMAGES — URLs de Wikimedia Commons (Roses & Lilies 1909, dominio público)
   Pamela Colman Smith · Arthur Edward Waite · 1909 · public domain.

   Cubre las 78 cartas:
     - 22 mayores: pattern "RWS1909 - <NN> <Name>.jpeg"
     - 56 menores: pattern "RWS1909 - <Suit> <NN>.jpeg"
       donde NN va de 01 a 14 (10 numéricas + 4 de corte: Paje=11, Caballero=12, Reina=13, Rey=14)

   Special:FilePath redirige automáticamente al archivo final.
   Si una URL devuelve 404, el onerror del <img> oculta y queda el SVG fallback.
   ════════════════════════════════════════════════════════════════════════ */

const CARD_IMAGES_MAJORS = {
  m00: 'RWS1909 - 00 Fool.jpeg',
  m01: 'RWS1909 - 01 Magician.jpeg',
  m02: 'RWS1909 - 02 High Priestess.jpeg',
  m03: 'RWS1909 - 03 Empress.jpeg',
  m04: 'RWS1909 - 04 Emperor.jpeg',
  m05: 'RWS1909 - 05 Hierophant.jpeg',
  m06: 'RWS1909 - 06 Lovers.jpeg',
  m07: 'RWS1909 - 07 Chariot.jpeg',
  m08: 'RWS1909 - 08 Strength.jpeg',
  m09: 'RWS1909 - 09 Hermit.jpeg',
  m10: 'RWS1909 - 10 Wheel of Fortune.jpeg',
  m11: 'RWS1909 - 11 Justice.jpeg',
  m12: 'RWS1909 - 12 Hanged Man.jpeg',
  m13: 'RWS1909 - 13 Death.jpeg',
  m14: 'RWS1909 - 14 Temperance.jpeg',
  m15: 'RWS1909 - 15 Devil.jpeg',
  m16: 'RWS1909 - 16 Tower.jpeg',
  m17: 'RWS1909 - 17 Star.jpeg',
  m18: 'RWS1909 - 18 Moon.jpeg',
  m19: 'RWS1909 - 19 Sun.jpeg',
  m20: 'RWS1909 - 20 Judgement.jpeg',
  m21: 'RWS1909 - 21 World.jpeg',
};

// Mapa de palos internos → palos en inglés que usa Wikimedia
const SUIT_TO_EN = {
  calices: 'Cups',
  espadas: 'Swords',
  varas: 'Wands',
  pentaculos: 'Pentacles',
};

function buildMinorFilename(card) {
  if (!card || !card.suit) return null;
  const suitEn = SUIT_TO_EN[card.suit];
  if (!suitEn) return null;
  const num = String(card.number || 0).padStart(2, '0');
  return `RWS1909 - ${suitEn} ${num}.jpeg`;
}

// Construye la URL hacia el thumbnail Wikimedia. Usa Special:FilePath que es estable.
function buildCardImageURL(filename, width = 600) {
  const encoded = encodeURIComponent(filename).replace(/%20/g, '_');
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=${width}`;
}

// Devuelve la primera URL para una carta (la primera que intenta el <img src=>)
function getCardImageURL(card, width = 600) {
  const list = getCardImageURLs(card, width);
  return list.length ? list[0] : null;
}

// Devuelve TODAS las URLs candidatas para una carta, en orden de preferencia.
// Si la primera falla, el onerror del <img> intenta la siguiente.
// Esto permite alternar entre .jpeg / .jpg que Wikimedia usa indistintamente.
function getCardImageURLs(card, width = 600) {
  if (!card) return [];
  const out = [];
  if (card.arcana === 'major') {
    const file = CARD_IMAGES_MAJORS[card.id];
    if (file) {
      out.push(buildCardImageURL(file, width));
      // Variante .jpg por si acaso
      out.push(buildCardImageURL(file.replace(/\.jpeg$/, '.jpg'), width));
    }
  } else if (card.arcana === 'minor') {
    const suitEn = SUIT_TO_EN[card.suit];
    if (suitEn && card.number) {
      const num2 = String(card.number).padStart(2, '0');
      const num1 = String(card.number);
      // Patrones a probar en orden
      const candidates = [
        `RWS1909 - ${suitEn} ${num2}.jpeg`,
        `RWS1909 - ${suitEn} ${num2}.jpg`,
        `RWS1909 - ${suitEn} ${num1}.jpeg`,
        `RWS1909 - ${suitEn} ${num1}.jpg`,
      ];
      candidates.forEach(f => out.push(buildCardImageURL(f, width)));
    }
  }
  return out;
}

if (typeof window !== 'undefined') {
  window.CARD_IMAGES_MAJORS = CARD_IMAGES_MAJORS;
  window.getCardImageURL = getCardImageURL;
  window.getCardImageURLs = getCardImageURLs;
  window.buildCardImageURL = buildCardImageURL;
}
