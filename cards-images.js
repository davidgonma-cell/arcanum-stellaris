/* ════════════════════════════════════════════════════════════════════════
   CARD_IMAGES — URLs de Wikimedia Commons (Roses & Lilies 1909, dominio público)
   Para los 22 mayores. Los 56 menores se renderizan con SVG en cards-art.js.
   Pamela Colman Smith · Arthur Edward Waite · 1909 · public domain.

   La URL pasa por Special:FilePath de Wikimedia que permite hotlink y devuelve
   un thumbnail al ancho que pidas. Cualquier error de red cae al fallback SVG.
   ════════════════════════════════════════════════════════════════════════ */

const CARD_IMAGES = {
  // Mayores 0-21 — pattern: "RWS1909 - <num> <Name>.jpeg"
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

// Construye la URL hacia el thumbnail Wikimedia de la anchura indicada.
// Special:FilePath redirige automáticamente al archivo final en upload.wikimedia.org.
function buildCardImageURL(filename, width = 600) {
  const encoded = encodeURIComponent(filename).replace(/%20/g, '_');
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encoded}?width=${width}`;
}

function getCardImageURL(card, width = 600) {
  if (!card) return null;
  if (card.arcana === 'major') {
    const file = CARD_IMAGES[card.id];
    return file ? buildCardImageURL(file, width) : null;
  }
  // Para menores devolvemos null → caen al renderizado SVG mejorado en cards-art.js
  return null;
}

if (typeof window !== 'undefined') {
  window.CARD_IMAGES = CARD_IMAGES;
  window.getCardImageURL = getCardImageURL;
  window.buildCardImageURL = buildCardImageURL;
}
