/* ===========================================================================
   ARCANUM STELLARIS — Mazo Original de 78 Cartas
   ---------------------------------------------------------------------------
   Mazo inventado, no copia de barajas comerciales protegidas.
   Inspirado en arquetipos junguianos, astrología y simbolismo cósmico.
   =========================================================================== */

const ARCANUM_DECK = {
  // ==================== ARCANOS MAYORES (22) ====================
  majors: [
    {
      id: 'm00',
      number: 0,
      name: 'El Loco',
      arcana: 'major',
      element: 'aire',
      astrology: 'Urano',
      symbol: '✦',
      gradient: ['#1a0b2e', '#2e1352', '#7b2cbf'],
      keywords: ['inicio', 'libertad', 'inocencia', 'fe', 'aventura'],
      positiveMeaning: 'Comienza un viaje. El alma se asoma al borde del precipicio con los ojos llenos de estrellas. Tu libertad es absoluta y tu fe te sostiene.',
      invertedMeaning: 'Imprudencia, decisiones precipitadas, miedo paralizante a lo desconocido. El salto que evitas se vuelve cárcel.',
      emotionalEnergy: 'Una mezcla embriagadora de vértigo y entusiasmo. Algo nuevo respira dentro de ti.',
      description: 'En el umbral entre lo conocido y el infinito, el Viajero porta solo una bolsa de luz. No carga el pasado: lo ha dejado caer al universo. Esta carta habla del primer paso, del valor invisible que florece cuando el corazón decide confiar.'
    },
    {
      id: 'm01',
      number: 1,
      name: 'El Mago',
      arcana: 'major',
      element: 'fuego',
      astrology: 'Mercurio',
      symbol: '✺',
      gradient: ['#1a0b2e', '#3d0c52', '#c9184a'],
      keywords: ['manifestación', 'voluntad', 'poder', 'enfoque', 'creación'],
      positiveMeaning: 'Tienes todas las herramientas del cosmos a tu alcance. La intención dirigida con maestría se vuelve realidad tangible.',
      invertedMeaning: 'Manipulación, ego inflado, talento desperdiciado, palabras que hieren. Tu poder se vuelve contra ti.',
      emotionalEnergy: 'Una corriente eléctrica que vibra desde tu pecho hasta las puntas de los dedos.',
      description: 'El Tejedor sostiene los cuatro elementos como hilos de luz que entrelaza con precisión. Aquí no hay azar: hay arte. Esta carta te recuerda que eres el alquimista de tu vida, y que la palabra precisa puede mover montañas invisibles.'
    },
    {
      id: 'm02',
      number: 2,
      name: 'La Sacerdotisa',
      arcana: 'major',
      element: 'agua',
      astrology: 'Luna',
      symbol: '☾',
      gradient: ['#0a0e27', '#1e2a5e', '#4a4e9c'],
      keywords: ['intuición', 'misterio', 'silencio', 'sabiduría interior', 'subconsciente'],
      positiveMeaning: 'Escucha lo que no se dice. Bajo la superficie reposan respuestas que la razón no puede alcanzar. Tu intuición es un oráculo despierto.',
      invertedMeaning: 'Secretos que oprimen, intuición ignorada, desconexión con tu voz interior. El velo se ha vuelto muro.',
      emotionalEnergy: 'Quietud lunar. Un silencio que habla más que cualquier palabra.',
      description: 'Sentada entre dos columnas —una blanca como el alba y otra negra como el océano profundo— sostiene un pergamino que solo tú puedes leer. Esta carta es invitación al silencio, al sueño lúcido, al saber sin pruebas.'
    },
    {
      id: 'm03',
      number: 3,
      name: 'La Emperatriz',
      arcana: 'major',
      element: 'tierra',
      astrology: 'Venus',
      symbol: '✿',
      gradient: ['#2d0f3f', '#5a1d57', '#d4af37'],
      keywords: ['abundancia', 'fertilidad', 'belleza', 'creación', 'maternidad cósmica'],
      positiveMeaning: 'Todo lo que tocas florece. Es tiempo de gestar proyectos, vínculos, arte, vida. La abundancia te reconoce.',
      invertedMeaning: 'Bloqueo creativo, dependencia emocional, exceso de control, sentirse desnutrida emocionalmente.',
      emotionalEnergy: 'Calidez nutriente. Una madre cósmica que te abraza desde dentro.',
      description: 'Coronada por doce estrellas y vestida de campos en flor, encarna la fuerza creadora del universo. No es solo madre: es la matriz fértil de toda posibilidad. Su mensaje es claro: lo que cuides con amor crecerá hasta dar fruto.'
    },
    {
      id: 'm04',
      number: 4,
      name: 'El Emperador',
      arcana: 'major',
      element: 'fuego',
      astrology: 'Aries',
      symbol: '♈',
      gradient: ['#3a0a0a', '#7c1c2c', '#d4af37'],
      keywords: ['autoridad', 'estructura', 'orden', 'liderazgo', 'protección'],
      positiveMeaning: 'Construye con disciplina. Tu reino interior se afirma. La estructura sólida es la base de tu libertad real.',
      invertedMeaning: 'Rigidez, autoritarismo, control excesivo, miedo al caos. Una corona pesada que nadie lleva en paz.',
      emotionalEnergy: 'Firmeza tibia. Como el sol del invierno: fuerza serena, no agresiva.',
      description: 'Sentado sobre un trono tallado en estrellas fijas, el Emperador no necesita gritar para gobernar. Su poder viene de haber dominado primero su propio caos. Esta carta habla de la madurez del que se sostiene a sí mismo.'
    },
    {
      id: 'm05',
      number: 5,
      name: 'El Sumo Sacerdote',
      arcana: 'major',
      element: 'tierra',
      astrology: 'Tauro',
      symbol: '☥',
      gradient: ['#1f1235', '#3e2a5c', '#9b6b3c'],
      keywords: ['tradición', 'sabiduría', 'guía', 'fe', 'enseñanza'],
      positiveMeaning: 'Una enseñanza antigua llega a tu vida. Busca al maestro en lo cotidiano. La tradición es puente, no jaula.',
      invertedMeaning: 'Dogmatismo, repetición vacía, rebeldía sin sentido, rechazo a la sabiduría que necesitas.',
      emotionalEnergy: 'Reverencia silenciosa. Algo más grande que tú te está sosteniendo.',
      description: 'Entre columnas talladas con símbolos de todas las eras, el Oráculo une lo terrenal con lo divino. No vende verdades: las custodia. Su consejo: aprende del que ya recorrió el camino antes de inventar el tuyo.'
    },
    {
      id: 'm06',
      number: 6,
      name: 'Los Enamorados',
      arcana: 'major',
      element: 'aire',
      astrology: 'Géminis',
      symbol: '∞',
      gradient: ['#2b0f3f', '#6b1d4d', '#ff4d6d'],
      keywords: ['amor', 'elección', 'alineación', 'vínculo', 'integración'],
      positiveMeaning: 'Una conexión profunda florece. Cuerpo, mente y alma se alinean en una misma dirección. El amor verdadero exige presencia.',
      invertedMeaning: 'Desalineación interior, decisiones tomadas desde el miedo, vínculos tóxicos disfrazados de destino.',
      emotionalEnergy: 'Vibración cálida que ablanda y al mismo tiempo electriza.',
      description: 'Bajo un ángel de alas estelares, dos almas se reconocen. La Unión no es solo romance: es el momento en que tus partes internas dejan de pelear. Esta carta señala que estás eligiendo —y la elección es sagrada—.'
    },
    {
      id: 'm07',
      number: 7,
      name: 'El Carro',
      arcana: 'major',
      element: 'agua',
      astrology: 'Cáncer',
      symbol: '➤',
      gradient: ['#0d1b3d', '#1e3a8a', '#c9b037'],
      keywords: ['victoria', 'voluntad', 'dirección', 'control', 'avance'],
      positiveMeaning: 'Sostén las riendas con firmeza serena. Tu impulso interior, dirigido con conciencia, abre camino entre las estrellas.',
      invertedMeaning: 'Descontrol, fuerzas internas en pugna, ambición ciega, falta de rumbo. El carro se vuelve contra el conductor.',
      emotionalEnergy: 'Adrenalina disciplinada. Algo en ti corre, y tú lo guías.',
      description: 'Tirado por dos esfinges —una de luz y otra de sombra—, el Carro avanza solo si quien lo conduce ha hecho las paces con ambos lados. Esta carta es un sí al movimiento, pero exige conciencia plena.'
    },
    {
      id: 'm08',
      number: 8,
      name: 'La Fuerza',
      arcana: 'major',
      element: 'fuego',
      astrology: 'Leo',
      symbol: '♌',
      gradient: ['#3d0a52', '#7c1f6e', '#ffb627'],
      keywords: ['coraje', 'dominio interno', 'pasión', 'compasión', 'valentía'],
      positiveMeaning: 'No domas a tu león con violencia: lo amansas con ternura. Tu poder más alto es la dulzura firme.',
      invertedMeaning: 'Reactividad, miedo a las propias emociones, pasividad disfrazada de paz, autoexigencia destructiva.',
      emotionalEnergy: 'Calor sostenido. Una llama que arde sin quemar.',
      description: 'Una mujer cierra suavemente las fauces de un león dorado. No con cadenas: con su mirada. Esta carta enseña que la verdadera fuerza es la que se ablanda. Lo salvaje en ti no es enemigo: es maestro.'
    },
    {
      id: 'm09',
      number: 9,
      name: 'El Ermitaño',
      arcana: 'major',
      element: 'tierra',
      astrology: 'Virgo',
      symbol: '✦',
      gradient: ['#0a1628', '#1f3656', '#9ca3af'],
      keywords: ['introspección', 'búsqueda', 'soledad sagrada', 'guía interna', 'verdad'],
      positiveMeaning: 'Retírate del ruido. La luz que buscas no está afuera: la sostienes tú mismo en alto. La soledad fértil es un templo.',
      invertedMeaning: 'Aislamiento doloroso, pensamientos en círculo, miedo a volver al mundo, soberbia espiritual.',
      emotionalEnergy: 'Quietud nocturna. Un silencio que ilumina poco a poco.',
      description: 'En la cumbre de una montaña azul, alza una linterna que contiene una estrella. No huye del mundo: lo prepara mejor. Esta carta es invitación a ese descenso lento dentro de ti donde habitan las respuestas verdaderas.'
    },
    {
      id: 'm10',
      number: 10,
      name: 'La Rueda de la Fortuna',
      arcana: 'major',
      element: 'fuego',
      astrology: 'Júpiter',
      symbol: '☉',
      gradient: ['#1a0b3a', '#4c1d80', '#fbbf24'],
      keywords: ['destino', 'ciclos', 'cambio', 'fortuna', 'movimiento'],
      positiveMeaning: 'La rueda gira a tu favor. Lo que sembraste regresa multiplicado. El cambio se vuelve aliado.',
      invertedMeaning: 'Resistirse al ciclo natural, sentirse víctima del destino, ciclos repetitivos no resueltos.',
      emotionalEnergy: 'Vértigo controlado. Reconocimiento de que algo más grande te sostiene.',
      description: 'Una rueda dorada gira lentamente entre nebulosas, marcada con doce símbolos zodiacales. Lo que sube, baja; lo que baja, sube. Esta carta recuerda que nada es permanente, ni la dicha ni el dolor, y eso —en sí mismo— es liberación.'
    },
    {
      id: 'm11',
      number: 11,
      name: 'La Justicia',
      arcana: 'major',
      element: 'aire',
      astrology: 'Libra',
      symbol: '⚖',
      gradient: ['#1c1c2e', '#3a3a5c', '#d4af37'],
      keywords: ['equilibrio', 'verdad', 'causa y efecto', 'integridad', 'claridad'],
      positiveMeaning: 'La verdad se restablece. Cosechas exactamente lo que sembraste, ni más ni menos. La claridad es tu refugio.',
      invertedMeaning: 'Injusticia percibida, autoengaño, decisiones desequilibradas, miedo a asumir responsabilidad.',
      emotionalEnergy: 'Frescura cortante, como el viento de la verdad despejando niebla.',
      description: 'Sostiene una balanza dorada en una mano y una espada de luz en la otra. No juzga con dureza: revela con precisión. Esta carta dice: lo correcto encontrará su lugar, y tú serás parte de ese acto sagrado.'
    },
    {
      id: 'm12',
      number: 12,
      name: 'El Colgado',
      arcana: 'major',
      element: 'agua',
      astrology: 'Neptuno',
      symbol: '☋',
      gradient: ['#0a1929', '#1e3a5f', '#7ec8e3'],
      keywords: ['rendición', 'perspectiva', 'pausa', 'sacrificio', 'iluminación'],
      positiveMeaning: 'Mirar el mundo al revés revela lo que estaba oculto. La pausa no es debilidad: es sabiduría suspendida.',
      invertedMeaning: 'Estancamiento, sacrificio inútil, victimismo, resistencia al cambio inevitable.',
      emotionalEnergy: 'Una calma extraña, casi flotante, donde el tiempo deja de pesar.',
      description: 'Suspendido entre dos estrellas, sonríe con los ojos abiertos. Su mundo invertido le devela lo que el mundo derecho ocultaba. Esta carta enseña que algunos saberes solo llegan cuando dejas de luchar.'
    },
    {
      id: 'm13',
      number: 13,
      name: 'La Muerte',
      arcana: 'major',
      element: 'agua',
      astrology: 'Escorpio',
      symbol: '☥',
      gradient: ['#0a0a0a', '#2c0a2c', '#6b1d4d'],
      keywords: ['transformación', 'final', 'renacer', 'cierre', 'liberación'],
      positiveMeaning: 'Algo termina para que algo más grande nazca. El cambio profundo no es muerte: es muda. Confía.',
      invertedMeaning: 'Aferrarse a lo que ya no es, miedo paralizante al cambio, duelos no procesados.',
      emotionalEnergy: 'Una solemnidad cálida. El alma sabe que algo necesario está ocurriendo.',
      description: 'Bajo una luna velada, una mariposa de alas estelares emerge de un capullo de huesos antiguos. Esta carta no anuncia muerte literal: anuncia el final de un capítulo y la apertura del siguiente. Se cierra una puerta —y bendícela—.'
    },
    {
      id: 'm14',
      number: 14,
      name: 'La Templanza',
      arcana: 'major',
      element: 'fuego',
      astrology: 'Sagitario',
      symbol: '⚗',
      gradient: ['#1a0d3a', '#4c2d8c', '#c9b037'],
      keywords: ['templanza', 'integración', 'paciencia', 'arte', 'fluidez'],
      positiveMeaning: 'Mezcla sin prisa los opuestos. La paciencia destila milagros. El arte de vivir es saber esperar el punto justo.',
      invertedMeaning: 'Impaciencia, desequilibrio interior, excesos, dificultad para encontrar el medio.',
      emotionalEnergy: 'Una serenidad activa. Como un río que sabe exactamente cómo fluir.',
      description: 'Vierte líquido luminoso entre dos copas sin que una sola gota caiga. Domina lo invisible. Esta carta enseña que la maestría no se grita: se decanta, lentamente, hasta que cada gesto se vuelve oración.'
    },
    {
      id: 'm15',
      number: 15,
      name: 'El Diablo',
      arcana: 'major',
      element: 'tierra',
      astrology: 'Capricornio',
      symbol: '☋',
      gradient: ['#1a0a0a', '#3d0a0a', '#8b0000'],
      keywords: ['apego', 'ilusión', 'sombra', 'tentación', 'materialismo'],
      positiveMeaning: 'Reconoce las cadenas: descubrirás que muchas son de humo. Tu sombra contiene oro si te atreves a mirarla.',
      invertedMeaning: 'Liberación de un patrón tóxico, salir de una adicción, romper un vínculo destructivo. La luz vuelve.',
      emotionalEnergy: 'Una densidad incómoda, pero llena de información valiosa.',
      description: 'Una figura ofrece collares de oro que en realidad son cadenas. La carta no condena: revela. Lo que crees que te posee, en verdad, te enseña qué partes de ti aún piden luz. La sombra integrada se vuelve poder.'
    },
    {
      id: 'm16',
      number: 16,
      name: 'La Torre',
      arcana: 'major',
      element: 'fuego',
      astrology: 'Marte',
      symbol: '⚡',
      gradient: ['#0a0a1a', '#3d1a3d', '#ff6b35'],
      keywords: ['ruptura', 'revelación', 'caída necesaria', 'liberación', 'verdad súbita'],
      positiveMeaning: 'Cae lo que estaba mal construido. Lo que parece destrucción es liberación violenta. Algo sagrado nace en las grietas.',
      invertedMeaning: 'Resistirse al colapso necesario, evitar la verdad, posponer el inevitable derrumbe.',
      emotionalEnergy: 'Un trueno emocional. Después: silencio limpio.',
      description: 'Un rayo dorado parte una torre de mármol falso bajo cielo eléctrico. No es castigo: es revelación. Esta carta marca el momento en que la realidad rompe la ilusión —y aunque duela, te devuelve a ti—.'
    },
    {
      id: 'm17',
      number: 17,
      name: 'La Estrella',
      arcana: 'major',
      element: 'aire',
      astrology: 'Acuario',
      symbol: '★',
      gradient: ['#0a1a3d', '#1e3a8a', '#7dd3fc'],
      keywords: ['esperanza', 'inspiración', 'sanación', 'guía cósmica', 'fe renovada'],
      positiveMeaning: 'Después de la tormenta, el cielo se llena de luz. Una estrella te susurra: confía, eres más vasto de lo que crees.',
      invertedMeaning: 'Pesimismo, fe perdida, desconexión espiritual, sentirse sin rumbo bajo cielo cubierto.',
      emotionalEnergy: 'Una esperanza limpia, casi infantil, que vuelve después del duelo.',
      description: 'Bajo un cielo estrellado, una mujer vierte agua sobre la tierra y sobre el río. Da sin medir. Esta carta es promesa: lo que pasaste no fue en vano, y la luz —tu luz— está volviendo a casa.'
    },
    {
      id: 'm18',
      number: 18,
      name: 'La Luna',
      arcana: 'major',
      element: 'agua',
      astrology: 'Piscis',
      symbol: '☽',
      gradient: ['#0a0a2e', '#2e1a5f', '#a78bfa'],
      keywords: ['ilusión', 'sueños', 'subconsciente', 'misterio', 'navegación nocturna'],
      positiveMeaning: 'Los sueños te hablan. Lo no resuelto sale a la superficie. Aprende a navegar sin ver del todo.',
      invertedMeaning: 'Confusión, miedos irracionales, autoengaño, fantasmas del pasado que regresan disfrazados.',
      emotionalEnergy: 'Una niebla emocional cargada de símbolos.',
      description: 'Dos torres custodian un sendero entre las olas, y un perro y un lobo aúllan a la misma luna. Esta carta no es enemiga: es maestra del territorio que la luz solar no alcanza. Aprende a ver con el corazón.'
    },
    {
      id: 'm19',
      number: 19,
      name: 'El Sol',
      arcana: 'major',
      element: 'fuego',
      astrology: 'Sol',
      symbol: '☀',
      gradient: ['#3d2400', '#c9740a', '#fde047'],
      keywords: ['alegría', 'claridad', 'éxito', 'vitalidad', 'autenticidad'],
      positiveMeaning: 'Todo se ilumina. Tu verdad brilla sin esfuerzo. La alegría sencilla es la más profunda. Es tiempo de florecer al sol.',
      invertedMeaning: 'Optimismo forzado, ego inflado, alegría que oculta vacío, vitalidad agotada.',
      emotionalEnergy: 'Calor radiante. Como reír después de mucho tiempo.',
      description: 'Un niño dorado monta un caballo blanco bajo un sol con rostro sereno. Esta carta es bendición: te dice que has llegado a un lugar de luz, y que tu autenticidad es exactamente donde habita el milagro.'
    },
    {
      id: 'm20',
      number: 20,
      name: 'El Juicio',
      arcana: 'major',
      element: 'fuego',
      astrology: 'Plutón',
      symbol: '☥',
      gradient: ['#1a0a3d', '#4c1d80', '#fbbf24'],
      keywords: ['renacer', 'juicio', 'vocación', 'despertar', 'segunda oportunidad'],
      positiveMeaning: 'Una trompeta cósmica suena dentro de ti. Algo te llama a una vida más grande. Responde sin miedo.',
      invertedMeaning: 'Ignorar la vocación, autocrítica destructiva, miedo a renacer, juzgarse con dureza.',
      emotionalEnergy: 'Vibración solemne. El alma sabe que es un momento sagrado.',
      description: 'Un ángel sopla una trompeta de luz sobre figuras que despiertan de antiguas tumbas. Esta carta marca el instante exacto en que decides volver a vivir —no a sobrevivir—. La segunda oportunidad existe, y es ahora.'
    },
    {
      id: 'm21',
      number: 21,
      name: 'El Mundo',
      arcana: 'major',
      element: 'tierra',
      astrology: 'Saturno',
      symbol: '∞',
      gradient: ['#1a0b3a', '#4c1d80', '#22d3ee'],
      keywords: ['plenitud', 'totalidad', 'cumplimiento', 'integración', 'cierre dichoso'],
      positiveMeaning: 'Has cerrado un ciclo completo. El universo te aplaude en silencio. La paz que sientes es real y merecida.',
      invertedMeaning: 'Cierres incompletos, miedo a soltar lo viejo, sentir que algo aún falta cuando ya está completo.',
      emotionalEnergy: 'Plenitud cálida. Una sonrisa interior que ya no necesita explicarse.',
      description: 'Una figura danza dentro de una corona de laurel cósmica, rodeada de los cuatro símbolos elementales. Esta carta es el final que es comienzo. Has integrado todo —y por eso, cualquier nuevo viaje partirá de un lugar más alto—.'
    }
  ],

  // ==================== ARCANOS MENORES (56) ====================
  // 4 palos × 14 cartas: As-10 + Aprendiz, Caballero, Reina, Rey
  minors: [] // Se completa programáticamente abajo
};

/* ===========================================================================
   GENERACIÓN PROGRAMÁTICA DE ARCANOS MENORES
   Cada palo tiene su elemento, color, energía y simbología.
   =========================================================================== */

const SUITS = {
  calices: {
    name: 'Cálices',
    element: 'agua',
    domain: 'emociones, amor, intuición',
    symbol: '♥',
    icon: '🜄',
    gradient: ['#0a1929', '#1e3a5f', '#3b82f6'],
    astrology: 'Cáncer · Escorpio · Piscis'
  },
  espadas: {
    name: 'Espadas',
    element: 'aire',
    domain: 'mente, comunicación, conflicto',
    symbol: '✦',
    icon: '🜁',
    gradient: ['#1c1c2e', '#3a3a5c', '#cbd5e1'],
    astrology: 'Géminis · Libra · Acuario'
  },
  varas: {
    name: 'Varas',
    element: 'fuego',
    domain: 'pasión, acción, creatividad',
    symbol: '✺',
    icon: '🜂',
    gradient: ['#3a0a0a', '#7c1c2c', '#ef4444'],
    astrology: 'Aries · Leo · Sagitario'
  },
  pentaculos: {
    name: 'Pentáculos',
    element: 'tierra',
    domain: 'cuerpo, dinero, lo material',
    symbol: '☘',
    icon: '🜃',
    gradient: ['#1a2e1a', '#2d5a2d', '#a3a847'],
    astrology: 'Tauro · Virgo · Capricornio'
  }
};

// Plantillas de significado por número (1-10) y figura
const NUMBER_MEANINGS = {
  calices: {
    1: { name: 'As de Cálices', kw: ['nueva emoción', 'amor naciente', 'apertura'], pos: 'Una fuente fresca de amor brota en ti. El corazón se abre como flor de loto al amanecer.', inv: 'Bloqueo emocional, amor reprimido, copa que se rehúsa a llenarse.', desc: 'Una mano cósmica sostiene una copa de la que brota agua viva. Es la primera ola de un sentimiento puro: bébelo sin miedo.' },
    2: { name: 'Dos de Cálices', kw: ['unión', 'reciprocidad', 'pacto del corazón'], pos: 'Dos almas se reconocen. Algo se equilibra entre tú y otra persona. El amor se vuelve diálogo.', inv: 'Desbalance afectivo, vínculos donde uno da más, malentendidos.', desc: 'Dos copas se elevan en brindis bajo una corona de luz. La carta de los encuentros donde algo profundo se sella sin palabras.' },
    3: { name: 'Tres de Cálices', kw: ['celebración', 'amistad', 'comunidad'], pos: 'La alegría compartida multiplica todo. Es tiempo de brindar con tu tribu, de reír sin razón.', inv: 'Aislamiento, dramas grupales, exceso de celebración que oculta vacío.', desc: 'Tres figuras alzan sus copas bajo una luna festiva. Esta carta canta a la red invisible que te sostiene cuando la vida se vuelve danza.' },
    4: { name: 'Cuatro de Cálices', kw: ['apatía', 'introspección', 'redescubrimiento'], pos: 'Pausa para sentir. Tres copas no te bastan; una cuarta espera silenciosa. Mira con atención.', inv: 'Salir de la apatía, reconectar con el deseo, decir sí a la vida nuevamente.', desc: 'Bajo un árbol estelar, alguien observa tres copas con desinterés mientras una cuarta aparece flotando. La vida te ofrece más de lo que ves.' },
    5: { name: 'Cinco de Cálices', kw: ['duelo', 'pérdida', 'lección emocional'], pos: 'Tres copas se han derramado, pero dos siguen en pie. Honra el dolor —y luego date la vuelta—.', inv: 'Aceptación, perdón, soltar lo perdido y abrazar lo que queda intacto.', desc: 'Una figura encapuchada llora frente al desperdicio, sin ver que detrás aún quedan copas llenas. La carta del duelo necesario y de la mirada que sana.' },
    6: { name: 'Seis de Cálices', kw: ['nostalgia', 'inocencia', 'memoria dulce'], pos: 'Algo del pasado regresa con ternura. Visita tu niño interior. Lo que sembraste hace tiempo florece ahora.', inv: 'Anclaje en el pasado, idealización de lo que fue, dificultad para crecer.', desc: 'Dos figuras pequeñas se ofrecen flores en un jardín antiguo. Esta carta es puente entre quien fuiste y quien estás siendo.' },
    7: { name: 'Siete de Cálices', kw: ['ilusión', 'opciones', 'decisión'], pos: 'Muchas posibilidades flotan ante ti como copas en el aire. Distingue lo real de lo seductor.', inv: 'Claridad recuperada, fin de la fantasía, regreso a la tierra firme.', desc: 'Siete copas flotan en una nube llenas de objetos —algunos reales, otros engañosos—. La carta de las elecciones donde se exige discernimiento profundo.' },
    8: { name: 'Ocho de Cálices', kw: ['búsqueda', 'partir', 'desapego'], pos: 'Algo te ha dejado de nutrir. Es hora de partir hacia lo desconocido sin culpa. Tu alma sabe.', inv: 'Quedarse por miedo, no aceptar el final, postergar la partida necesaria.', desc: 'Una figura solitaria camina entre montañas bajo luna llena, dejando atrás ocho copas. La carta de los adioses que abren caminos.' },
    9: { name: 'Nueve de Cálices', kw: ['satisfacción', 'deseo cumplido', 'gratitud'], pos: 'Tu deseo se cumple. Recibe sin culpa. La vida también puede ser generosa contigo.', inv: 'Vacío bajo el éxito, complacencia, deseos egoístas que no satisfacen.', desc: 'Nueve copas se alinean tras una figura que sonríe, satisfecha. Esta carta es brindis: lo que pediste con corazón limpio, vuelve a ti.' },
    10: { name: 'Diez de Cálices', kw: ['plenitud familiar', 'armonía', 'amor que dura'], pos: 'El amor se vuelve hogar. La armonía con los tuyos es el cielo bajado a la tierra.', inv: 'Desarmonía familiar, expectativas no cumplidas, distancias afectivas.', desc: 'Diez copas forman un arcoíris sobre un hogar bajo cielo despejado. La carta del amor que ya no necesita demostrarse: simplemente es.' }
  },
  espadas: {
    1: { name: 'As de Espadas', kw: ['claridad', 'idea', 'corte limpio'], pos: 'Una verdad atraviesa la niebla. La mente se afila. Decisión clara, palabra exacta.', inv: 'Claridad usada para herir, pensamientos cortantes, verdad mal dicha.', desc: 'Una espada de luz emerge de una nube atravesando una corona estelar. La carta del momento exacto en que ves —y ese ver, libera—.' },
    2: { name: 'Dos de Espadas', kw: ['indecisión', 'pausa', 'equilibrio frágil'], pos: 'Estás entre dos opciones con los ojos vendados. Respira: la respuesta llegará desde el silencio.', inv: 'Decisión tomada, fin del estancamiento mental, aceptar el dilema.', desc: 'Una figura sostiene dos espadas cruzadas sobre el corazón, vendada. La carta del impasse mental que pide pausa más que solución.' },
    3: { name: 'Tres de Espadas', kw: ['dolor', 'verdad dolorosa', 'sanación a través'], pos: 'Algo duele, y duele bien. La herida nombrada empieza a cicatrizar. Llora si necesitas.', inv: 'Recuperación, perdón en proceso, aceptar que el dolor también enseñó.', desc: 'Tres espadas atraviesan un corazón bajo lluvia gris. No es maldición: es la verdad que pide ser sentida para liberarse.' },
    4: { name: 'Cuatro de Espadas', kw: ['descanso', 'recuperación', 'silencio mental'], pos: 'Es tiempo de retirarte y sanar. La quietud no es derrota: es estrategia sagrada.', inv: 'Resistirse al descanso, agotamiento extremo, mente que no calla.', desc: 'Una figura reposa en silencio dentro de un templo, con tres espadas sobre la pared y una bajo el cuerpo. La carta del retiro reparador.' },
    5: { name: 'Cinco de Espadas', kw: ['conflicto', 'victoria amarga', 'ego'], pos: 'Has ganado, pero ¿qué has perdido? Revisa tus batallas: no toda guerra merece pelearse.', inv: 'Reconciliación, soltar el orgullo, reconocer el daño y reparar.', desc: 'Una figura recoge espadas mientras otras se alejan derrotadas bajo cielo gris. La carta donde la razón se vuelve solitaria si no se acompaña de empatía.' },
    6: { name: 'Seis de Espadas', kw: ['transición', 'partida', 'aguas calmas'], pos: 'Cruzas hacia un lugar más sereno. Llevas contigo lo aprendido —no el peso—.', inv: 'Resistirse al cambio, anclarse en la tormenta, dificultad para soltar.', desc: 'Una barca cruza aguas tranquilas hacia una orilla brumosa, llevando seis espadas y dos figuras silenciosas. La carta del éxodo emocional necesario.' },
    7: { name: 'Siete de Espadas', kw: ['estrategia', 'sigilo', 'evasión'], pos: 'A veces la mejor batalla es la que no se libra de frente. Usa la astucia con ética.', inv: 'Engaño que se descubre, confesión necesaria, retomar la sinceridad.', desc: 'Una figura se aleja con cinco espadas, dejando dos clavadas. La carta del momento en que te toca elegir: ¿astucia o transparencia?' },
    8: { name: 'Ocho de Espadas', kw: ['limitación mental', 'sentirse atrapado', 'autoengaño'], pos: 'Las cuerdas que te atan son menos firmes de lo que crees. Abre los ojos: la salida ya está ahí.', inv: 'Liberación mental, romper cadenas autoimpuestas, recuperar el poder.', desc: 'Una figura vendada y atada se rodea de ocho espadas en una playa abierta. La carta de las prisiones invisibles —y de la llave dentro—.' },
    9: { name: 'Nueve de Espadas', kw: ['ansiedad', 'insomnio', 'pensamientos oscuros'], pos: 'La noche del alma. Recuerda: las pesadillas no siempre son profecías. Respira hasta el alba.', inv: 'Aclaración, salir de la espiral, encontrar apoyo y volver a dormir en paz.', desc: 'Una figura se incorpora en su lecho, manos cubriendo el rostro, bajo nueve espadas en la pared. La carta del miedo nocturno que pasa con la luz.' },
    10: { name: 'Diez de Espadas', kw: ['final mental', 'rendirse para renacer', 'fondo'], pos: 'Has tocado fondo. Buena noticia: desde aquí solo se sube. La amanecida está cerca.', inv: 'Resistencia al final, aferrarse a lo que ya murió, alargar el dolor.', desc: 'Diez espadas atraviesan una figura tendida bajo cielo que se aclara al horizonte. La carta del final absoluto que es —en realidad— el primer amanecer.' }
  },
  varas: {
    1: { name: 'As de Varas', kw: ['inspiración', 'chispa', 'inicio creativo'], pos: 'Una idea ardiente nace en ti. Tómala con manos firmes: es semilla de fuego puro.', inv: 'Inspiración bloqueada, miedo al impulso, postergar el llamado creativo.', desc: 'Una mano cósmica sostiene una rama dorada que florece llamas suaves. La carta del momento exacto donde la chispa pide convertirse en hoguera.' },
    2: { name: 'Dos de Varas', kw: ['planificación', 'visión', 'horizonte'], pos: 'Estás en la cumbre desde donde se ven los caminos. Elige con la audacia del que confía.', inv: 'Indecisión, miedo a salir de la zona conocida, planes que no terminan de concretarse.', desc: 'Una figura sostiene un globo terráqueo desde una torre, mirando dos rutas posibles. La carta del estratega que prepara —y luego salta—.' },
    3: { name: 'Tres de Varas', kw: ['expansión', 'expectativa', 'avance'], pos: 'Tus barcos zarpan. Lo que enviaste al mundo está volviendo cargado. Confía en los tiempos.', inv: 'Demora, decepción, expectativas mal calibradas.', desc: 'Una figura observa tres barcos cruzando aguas doradas desde un acantilado. La carta de la siembra que pronto será cosecha.' },
    4: { name: 'Cuatro de Varas', kw: ['celebración', 'estabilidad', 'hogar'], pos: 'Has construido un techo de luz sobre tu vida. Celebra: la base está firme.', inv: 'Falta de raíces, conflictos en el hogar, estabilidad amenazada.', desc: 'Cuatro varas se alzan formando un arco floral bajo el cual dos figuras danzan. La carta del descanso entre logros, del brindis bien ganado.' },
    5: { name: 'Cinco de Varas', kw: ['conflicto', 'competencia', 'fricción'], pos: 'Hay tensión, sí. Pero la fricción también afila. Pelea con honor o cambia el juego.', inv: 'Acuerdo, fin del conflicto, encontrar paz en medio de la diversidad.', desc: 'Cinco figuras blanden varas sin orden claro. La carta del caos creativo que, bien gestionado, se vuelve impulso.' },
    6: { name: 'Seis de Varas', kw: ['victoria', 'reconocimiento', 'logro público'], pos: 'Tu esfuerzo se ve. Cabalgas con la frente alta. Recibe los aplausos sin agrandarte.', inv: 'Falta de reconocimiento, victoria hueca, soberbia que aleja.', desc: 'Una figura victoriosa cabalga con corona de laurel y vara levantada. La carta del triunfo merecido que se festeja con humildad.' },
    7: { name: 'Siete de Varas', kw: ['defensa', 'persistencia', 'mantener posición'], pos: 'Defiende lo tuyo desde lo alto. La ventaja es tuya si no abandonas el terreno.', inv: 'Sentirse abrumado, querer abandonar, agotamiento de defender solo.', desc: 'Una figura repele desde una colina seis varas que la atacan desde abajo. La carta del que se sostiene —solo, pero firme— en su verdad.' },
    8: { name: 'Ocho de Varas', kw: ['velocidad', 'mensajes', 'movimiento'], pos: 'Las cosas se aceleran. Llegan noticias, oportunidades, viajes. Móntate en la corriente.', inv: 'Demoras, malentendidos, mensajes confusos, comunicación trabada.', desc: 'Ocho varas vuelan por el cielo en formación dorada. La carta de la energía rápida que pide acción presente, no análisis prolongado.' },
    9: { name: 'Nueve de Varas', kw: ['resiliencia', 'última batalla', 'persistencia'], pos: 'Estás cerca del final, aunque cansado. Solo un esfuerzo más. Tu fuerza interior es mayor de lo que imaginas.', inv: 'Agotamiento extremo, paranoia defensiva, soltar antes de tiempo.', desc: 'Una figura herida se sostiene en una vara mientras otras ocho lo rodean. La carta del que ya casi llega y debe sostenerse un instante más.' },
    10: { name: 'Diez de Varas', kw: ['carga', 'responsabilidad', 'soltar peso'], pos: 'Llevas mucho. Quizá demasiado. Aprende a delegar o a soltar lo que ya no es tuyo cargar.', inv: 'Liberarse del peso, soltar lo que sobrecarga, recuperar ligereza.', desc: 'Una figura encorvada carga diez varas hacia un destino lejano. La carta que recuerda: no toda responsabilidad merece ser tuya.' }
  },
  pentaculos: {
    1: { name: 'As de Pentáculos', kw: ['oportunidad material', 'siembra', 'manifestación'], pos: 'Una semilla dorada cae en tus manos. Plántala en tierra fértil. Lo que cuides crecerá.', inv: 'Oportunidad perdida, dudar de lo concreto, miedo a la abundancia.', desc: 'Una mano cósmica ofrece una moneda con una estrella grabada sobre un jardín en flor. La carta del comienzo material con bendición invisible.' },
    2: { name: 'Dos de Pentáculos', kw: ['equilibrio', 'malabares', 'flexibilidad'], pos: 'Manejas múltiples cosas con destreza. La danza, no la rigidez, mantendrá todo en pie.', inv: 'Sobrecarga, perder el equilibrio, dejar caer alguna pelota.', desc: 'Una figura juega con dos pentáculos en un símbolo de infinito sobre olas en movimiento. La carta del bailarín que hace de la complejidad arte.' },
    3: { name: 'Tres de Pentáculos', kw: ['colaboración', 'maestría', 'oficio'], pos: 'Trabajas con otros que ven tu valor. La maestría se construye en comunidad.', inv: 'Falta de reconocimiento, equipo disfuncional, mediocridad aceptada.', desc: 'Tres figuras revisan los planos de una catedral en construcción bajo bóveda celeste. La carta del oficio compartido que produce algo más grande que cada uno.' },
    4: { name: 'Cuatro de Pentáculos', kw: ['acumulación', 'control', 'apego material'], pos: 'Tienes lo que necesitas, pero ¿lo aferras o lo disfrutas? El control excesivo asfixia.', inv: 'Soltar el control, generosidad recuperada, abrirse a fluir con lo material.', desc: 'Una figura abraza un pentáculo, otro sobre la cabeza, dos bajo los pies. La carta de quien se aferra al tener y olvida el ser.' },
    5: { name: 'Cinco de Pentáculos', kw: ['carencia', 'aislamiento', 'pérdida'], pos: 'Sientes frío, pero la luz está más cerca de lo que parece. Pide ayuda: no estás solo.', inv: 'Recuperación, salir de la dificultad, aceptar el apoyo ofrecido.', desc: 'Dos figuras caminan en la nieve frente a una iglesia iluminada que no ven. La carta del invierno material que pide alzar la mirada.' },
    6: { name: 'Seis de Pentáculos', kw: ['generosidad', 'flujo', 'dar y recibir'], pos: 'La abundancia se mueve a través de ti. Comparte lo que recibes; recibe lo que mereces.', inv: 'Generosidad desigual, deudas no saldadas, dar para controlar.', desc: 'Una figura distribuye monedas mientras sostiene una balanza dorada. La carta del flujo justo: la abundancia se mide en circulación, no en estancamiento.' },
    7: { name: 'Siete de Pentáculos', kw: ['paciencia', 'evaluación', 'cosecha próxima'], pos: 'Tu siembra está madurando. No la arranques antes de tiempo. La paciencia también es estrategia.', inv: 'Impaciencia, sembrar y esperar lo que no llegará, evaluación errónea.', desc: 'Una figura observa pentáculos crecer en un árbol que no termina de fructificar. La carta del jardinero que sabe esperar el fruto exacto.' },
    8: { name: 'Ocho de Pentáculos', kw: ['oficio', 'dedicación', 'mejora continua'], pos: 'La maestría se forja en la repetición consciente. Cada pequeño detalle es ofrenda al arte.', inv: 'Repetición sin alma, perfeccionismo paralizante, trabajo sin pasión.', desc: 'Una figura graba pentáculos uno a uno sobre una mesa de trabajo iluminada. La carta del artesano sagrado: la disciplina como forma de oración.' },
    9: { name: 'Nueve de Pentáculos', kw: ['independencia', 'lujo merecido', 'autosuficiencia'], pos: 'Has cultivado tu jardín. Disfruta sin culpa: te lo has ganado con tu propio esfuerzo.', inv: 'Soledad disfrazada de independencia, lujo que aísla, miedo a recibir afecto.', desc: 'Una figura camina entre viñedos cargados de pentáculos, un halcón en el guante. La carta de quien ya no necesita pedir permiso para ser libre.' },
    10: { name: 'Diez de Pentáculos', kw: ['legado', 'abundancia familiar', 'estabilidad ancestral'], pos: 'La abundancia se vuelve linaje. Lo que has construido nutre generaciones, visibles e invisibles.', inv: 'Legado tóxico, conflictos hereditarios, dependencia de lo familiar.', desc: 'Diez pentáculos forman el árbol de la vida sobre un jardín multigeneracional. La carta de la riqueza con raíces, la herencia que sí merece celebrarse.' }
  }
};

// Plantillas para figuras de la corte
const COURT_MEANINGS = {
  calices: {
    aprendiz: { name: 'Aprendiz de Cálices', kw: ['ternura nueva', 'mensaje afectivo', 'sensibilidad'], pos: 'Un mensaje del corazón llega a tu vida. Recíbelo con la apertura del que aún sabe asombrarse.', inv: 'Inmadurez emocional, sensibilidad desbordada, evitar lo que se siente.', desc: 'Una figura juvenil ofrece una copa de la que emerge un pez plateado. La carta de la novedad emocional que pide ser tratada con dulzura.' },
    caballero: { name: 'Caballero de Cálices', kw: ['romanticismo', 'misión del corazón', 'idealismo'], pos: 'Avanzas hacia tu meta guiado por el corazón. El idealismo, bien encauzado, mueve mundos.', inv: 'Ilusiones, promesas sin sustento, romance que nunca aterriza.', desc: 'Un caballero monta un caballo blanco y ofrece una copa luminosa. La carta del que persigue lo bello como forma de vida.' },
    reina: { name: 'Reina de Cálices', kw: ['empatía', 'intuición profunda', 'amor incondicional'], pos: 'Encarnas la intuición sabia y la empatía fluida. Tu sola presencia sana lo que toca.', inv: 'Codependencia, exceso emocional, sentirse inundada por lo ajeno.', desc: 'Una reina sentada junto al océano sostiene una copa coronada. La carta de quien ha hecho del sentir su brújula sagrada.' },
    rey: { name: 'Rey de Cálices', kw: ['madurez emocional', 'serenidad', 'liderazgo afectivo'], pos: 'Sostienes las emociones como un rey su reino: sin reprimirlas ni dejarse arrastrar. Equilibrio.', inv: 'Manipulación afectiva, frialdad bajo apariencia cálida, control emocional.', desc: 'Un rey en su trono flota sobre olas tranquilas con una copa en mano. La carta del que ha integrado la marea de su sentir.' }
  },
  espadas: {
    aprendiz: { name: 'Aprendiz de Espadas', kw: ['curiosidad mental', 'mensajes', 'aprendizaje rápido'], pos: 'Llega información reveladora. Tu mente despierta a algo nuevo. Aprende sin prejuicio.', inv: 'Chismes, palabras precipitadas, espía de los demás más que de uno mismo.', desc: 'Una figura juvenil sostiene una espada al viento, alerta. La carta de la mente despierta que pide canalizarse con criterio.' },
    caballero: { name: 'Caballero de Espadas', kw: ['acción decidida', 'ímpetu mental', 'corte directo'], pos: 'Avanzas con la espada de la verdad por delante. Tu valor mental abre caminos que el miedo cerraba.', inv: 'Impulsividad, palabras que hieren, acción sin pensar las consecuencias.', desc: 'Un caballero galopa al viento con espada en alto. La carta del que actúa con la rapidez de un relámpago bien dirigido.' },
    reina: { name: 'Reina de Espadas', kw: ['inteligencia clara', 'verdad sin filtros', 'autonomía'], pos: 'Tu mente lúcida ve a través de toda niebla. La verdad dicha con compasión es tu mayor poder.', inv: 'Frialdad, juicio severo, palabras como armas, soledad mental.', desc: 'Una reina sentada en trono de nubes empuña una espada hacia el cielo. La carta de la mujer que ha pagado por su claridad y la honra.' },
    rey: { name: 'Rey de Espadas', kw: ['autoridad mental', 'justicia', 'estrategia'], pos: 'Pensamiento claro, decisiones firmes, palabras precisas. Tu mente es trono y no jaula.', inv: 'Tiranía intelectual, dogmatismo, usar la lógica para evadir el corazón.', desc: 'Un rey severo sostiene una espada vertical sobre cielo despejado. La carta del juez interior que ha aprendido a ser justo, no cruel.' }
  },
  varas: {
    aprendiz: { name: 'Aprendiz de Varas', kw: ['entusiasmo nuevo', 'mensaje creativo', 'aventura'], pos: 'Una idea encendida llega a tu vida. Síguela con el corazón abierto: te llevará lejos.', inv: 'Entusiasmo que no aterriza, distracciones constantes, falta de foco.', desc: 'Una figura joven sostiene una vara florida observando el horizonte. La carta del fuego nuevo que pide ser cuidado para no extinguirse.' },
    caballero: { name: 'Caballero de Varas', kw: ['pasión', 'aventura', 'impulso vital'], pos: 'Avanzas con fuego en la mirada. La pasión bien dirigida es alquimia. Cabalga sin miedo.', inv: 'Imprudencia, ardores que se apagan rápido, prometer y no cumplir.', desc: 'Un caballero monta un corcel ardiente con vara en alto. La carta del aventurero cuyo combustible es la vida misma.' },
    reina: { name: 'Reina de Varas', kw: ['carisma', 'creatividad sostenida', 'magnetismo'], pos: 'Tu presencia ilumina espacios. Eres fuego sostenido, no chispa pasajera. La gente te sigue porque eres tú.', inv: 'Celos, dominancia, fuego que consume al otro, autoexigencia agotadora.', desc: 'Una reina con melena dorada sostiene una vara y un girasol bajo cielo de fuego. La carta de la mujer que ha hecho de su luz su firma.' },
    rey: { name: 'Rey de Varas', kw: ['liderazgo carismático', 'visión audaz', 'inspiración'], pos: 'Lideras con visión y pasión. Tu fuego enciende a otros. Eres motor más que jefe.', inv: 'Ego, autoritarismo, líder que se cree imprescindible, impaciencia.', desc: 'Un rey de capa roja sostiene una vara que se eleva como antorcha. La carta del visionario que actúa en lugar de solo soñar.' }
  },
  pentaculos: {
    aprendiz: { name: 'Aprendiz de Pentáculos', kw: ['nueva oportunidad', 'estudio', 'paciencia inicial'], pos: 'Una semilla concreta llega a tus manos. Estúdiala, cultívala. La paciencia construye fortalezas.', inv: 'Pereza, oportunidad ignorada, falta de compromiso con lo material.', desc: 'Una figura joven contempla un pentáculo dorado en un campo florido. La carta del aprendiz humilde que sabe que hay tiempo.' },
    caballero: { name: 'Caballero de Pentáculos', kw: ['constancia', 'trabajo paciente', 'compromiso'], pos: 'Avanzas paso a paso, sin prisa pero sin pausa. Tu constancia es tu mayor virtud.', inv: 'Estancamiento, rutina excesiva, miedo al cambio, lentitud que paraliza.', desc: 'Un caballero a caballo negro avanza por campo arado con un pentáculo en mano. La carta del trabajador silencioso cuyo paso suma reinos.' },
    reina: { name: 'Reina de Pentáculos', kw: ['nutrición', 'abundancia maternal', 'pragmatismo cálido'], pos: 'Encarnas la abundancia que se comparte. Tu cuerpo, tu hogar, tu trabajo: todo es altar generoso.', inv: 'Materialismo, descuido del propio cuerpo, dar hasta vaciarse.', desc: 'Una reina rodeada de un jardín exuberante sostiene un pentáculo. La carta de la que ha hecho de lo material un templo de cuidado.' },
    rey: { name: 'Rey de Pentáculos', kw: ['prosperidad', 'autoridad terrenal', 'éxito sólido'], pos: 'Has construido tu reino con manos firmes. La abundancia te sienta bien porque la administras con sabiduría.', inv: 'Codicia, materialismo, identidad atada al éxito, miedo a perder estatus.', desc: 'Un rey en trono de viñedos sostiene un pentáculo y un cetro florido. La carta del soberano que sabe que la verdadera riqueza nutre.' }
  }
};

// Construcción del mazo de menores
function buildMinors() {
  const minors = [];
  const courtOrder = ['aprendiz', 'caballero', 'reina', 'rey'];

  for (const [suitKey, suitData] of Object.entries(SUITS)) {
    // 1-10 numéricas
    for (let n = 1; n <= 10; n++) {
      const meaning = NUMBER_MEANINGS[suitKey][n];
      minors.push({
        id: `${suitKey.slice(0, 3)}-${n}`,
        number: n,
        name: meaning.name,
        arcana: 'minor',
        suit: suitKey,
        suitName: suitData.name,
        element: suitData.element,
        astrology: suitData.astrology,
        symbol: suitData.symbol,
        gradient: suitData.gradient,
        keywords: meaning.kw,
        positiveMeaning: meaning.pos,
        invertedMeaning: meaning.inv,
        emotionalEnergy: `${suitData.element.charAt(0).toUpperCase() + suitData.element.slice(1)} en su forma ${n === 1 ? 'germinal' : n <= 3 ? 'naciente' : n <= 6 ? 'plena' : n <= 9 ? 'madura' : 'culminante'}.`,
        description: meaning.desc
      });
    }
    // Cortes
    courtOrder.forEach((court, idx) => {
      const meaning = COURT_MEANINGS[suitKey][court];
      minors.push({
        id: `${suitKey.slice(0, 3)}-${court}`,
        number: 11 + idx,
        court: court,
        name: meaning.name,
        arcana: 'minor',
        suit: suitKey,
        suitName: suitData.name,
        element: suitData.element,
        astrology: suitData.astrology,
        symbol: suitData.symbol,
        gradient: suitData.gradient,
        keywords: meaning.kw,
        positiveMeaning: meaning.pos,
        invertedMeaning: meaning.inv,
        emotionalEnergy: `Energía de corte: ${court === 'aprendiz' ? 'curiosa y abierta' : court === 'caballero' ? 'activa y decidida' : court === 'reina' ? 'sostenida e integrada' : 'consolidada y soberana'}.`,
        description: meaning.desc
      });
    });
  }
  return minors;
}

ARCANUM_DECK.minors = buildMinors();
ARCANUM_DECK.all = [...ARCANUM_DECK.majors, ...ARCANUM_DECK.minors];

// Sanity check (debe ser 78)
// console.log('Total cartas:', ARCANUM_DECK.all.length);

// Frases espirituales diarias (rotación)
const DAILY_QUOTES = [
  'El cielo no se apresura, y aun así, todo florece a su tiempo.',
  'Tu intuición es el lenguaje en que el universo te susurra.',
  'Lo que es tuyo te encontrará incluso si caminas con los ojos cerrados.',
  'Cada estrella fue una vez oscuridad atravesada por fe.',
  'No todas las heridas son obstáculos: algunas son puertas.',
  'El alma sabe el camino. Solo le pesa cuando la mente discute.',
  'Hoy también el universo conspira en tu favor, aunque no lo veas.',
  'Lo que sueltes con amor regresará en otra forma de luz.',
  'Eres el silencio entre las notas y también la música entera.',
  'El miedo es solo amor que olvidó cómo se llamaba.',
  'Donde pones tu atención, allí floreces.',
  'Lo que más temes contar es probablemente lo que más te liberará.',
  'No hay atajos hacia tu propia luz. Pero el camino también ilumina.',
  'Tu sensibilidad no es debilidad: es tu antena hacia lo invisible.',
  'Las puertas cerradas son a veces el regalo más grande.',
  'Cada amanecer es una segunda oportunidad disfrazada de costumbre.',
  'El universo escribe contigo, no a pesar de ti.',
  'La paciencia es fe vestida de cotidianidad.',
  'Lo sagrado vive en lo simple: en una taza, en una mirada, en tu respiración.',
  'No tienes que entenderlo todo. Solo confiar en lo que ya sabes desde dentro.',
  'Tu cuerpo es tu primer templo. Habítalo con ternura.',
  'Lo que se aleja es porque algo más alto está por llegar.',
  'A veces estar perdido es la forma del alma de buscar lo verdadero.',
  'Eres más vasto que cualquier cosa que te haya ocurrido.',
  'El silencio también es una respuesta. Y a veces la mejor.',
  'Cada vez que eliges presencia, sanas un linaje completo.',
  'Lo que parece ruina puede ser cimiento.',
  'Tu vulnerabilidad es la grieta por donde entra la magia.',
  'No estás atrasado. Estás justo donde necesitas crecer.',
  'La luna también descansa antes de volver a llenarse.',
  'Tu sí más sagrado a veces empieza por un no firme.'
];

// Definiciones astrológicas básicas
const ZODIAC_SIGNS = {
  aries:       { name: 'Aries',       element: 'fuego',  modality: 'cardinal',  ruler: 'Marte',    symbol: '♈', dates: [[3,21],[4,19]] },
  tauro:       { name: 'Tauro',       element: 'tierra', modality: 'fijo',      ruler: 'Venus',    symbol: '♉', dates: [[4,20],[5,20]] },
  geminis:     { name: 'Géminis',     element: 'aire',   modality: 'mutable',   ruler: 'Mercurio', symbol: '♊', dates: [[5,21],[6,20]] },
  cancer:      { name: 'Cáncer',      element: 'agua',   modality: 'cardinal',  ruler: 'Luna',     symbol: '♋', dates: [[6,21],[7,22]] },
  leo:         { name: 'Leo',         element: 'fuego',  modality: 'fijo',      ruler: 'Sol',      symbol: '♌', dates: [[7,23],[8,22]] },
  virgo:       { name: 'Virgo',       element: 'tierra', modality: 'mutable',   ruler: 'Mercurio', symbol: '♍', dates: [[8,23],[9,22]] },
  libra:       { name: 'Libra',       element: 'aire',   modality: 'cardinal',  ruler: 'Venus',    symbol: '♎', dates: [[9,23],[10,22]] },
  escorpio:    { name: 'Escorpio',    element: 'agua',   modality: 'fijo',      ruler: 'Plutón',   symbol: '♏', dates: [[10,23],[11,21]] },
  sagitario:   { name: 'Sagitario',   element: 'fuego',  modality: 'mutable',   ruler: 'Júpiter',  symbol: '♐', dates: [[11,22],[12,21]] },
  capricornio: { name: 'Capricornio', element: 'tierra', modality: 'cardinal',  ruler: 'Saturno',  symbol: '♑', dates: [[12,22],[1,19]] },
  acuario:     { name: 'Acuario',     element: 'aire',   modality: 'fijo',      ruler: 'Urano',    symbol: '♒', dates: [[1,20],[2,18]] },
  piscis:      { name: 'Piscis',      element: 'agua',   modality: 'mutable',   ruler: 'Neptuno',  symbol: '♓', dates: [[2,19],[3,20]] }
};

const ZODIAC_PROFILES = {
  aries:       { profile: 'Eres pionero, valiente y directo. Tu energía abre caminos donde otros ven muros. Tu mayor lección: aprender a sostener la llama, no solo a encenderla.', advice: 'Canaliza tu impulso en un proyecto que te apasione esta semana.' },
  tauro:       { profile: 'Sereno, sensual y enraizado. Tu fortaleza viene de la constancia. Tu mayor lección: soltar el control sobre lo que cambia naturalmente.', advice: 'Permítete un placer simple sin culpa: una comida lenta, música, un abrazo largo.' },
  geminis:     { profile: 'Curioso, mental y comunicativo. Vives en muchos mundos a la vez. Tu mayor lección: bajar al cuerpo y comprometerte con lo que amas.', advice: 'Conversa con alguien nuevo o escribe lo que llevas tiempo callando.' },
  cancer:      { profile: 'Empático, profundo y protector. Sientes lo que otros no ven. Tu mayor lección: cuidarte tanto como cuidas a los demás.', advice: 'Crea un ritual de hogar esta semana: un té, una vela, un rincón solo tuyo.' },
  leo:         { profile: 'Magnético, generoso y luminoso. Tu presencia ilumina espacios. Tu mayor lección: brillar sin necesitar aprobación externa.', advice: 'Haz algo creativo solo por el placer de hacerlo, sin mostrarlo.' },
  virgo:       { profile: 'Analítico, servicial y refinado. Ves los detalles que otros pasan por alto. Tu mayor lección: aceptar la imperfección como parte de la belleza.', advice: 'Hoy descansa una hora sin productividad. El universo no se va a romper.' },
  libra:       { profile: 'Diplomático, estético y armonizador. Buscas el equilibrio en todo. Tu mayor lección: tomar decisiones desde tu deseo, no desde el de otros.', advice: 'Escribe un sí y un no claros que llevas postergando. Tu balanza pide acción.' },
  escorpio:    { profile: 'Intenso, transformador y profundo. Vas donde otros temen entrar. Tu mayor lección: confiar antes de exigir prueba.', advice: 'Suelta esta semana un rencor pequeño. Verás cómo se libera algo más grande.' },
  sagitario:   { profile: 'Aventurero, optimista y filosófico. Tu alma busca horizonte. Tu mayor lección: encontrar profundidad en el aquí, no solo en el allá.', advice: 'Estudia algo que te apasione esta semana, aunque solo sea una hora.' },
  capricornio: { profile: 'Disciplinado, ambicioso y leal. Construyes a largo plazo. Tu mayor lección: jugar también es productivo —y necesario—.', advice: 'Date un permiso esta semana: ríe sin propósito, descansa sin culpa.' },
  acuario:     { profile: 'Visionario, libre e innovador. Ves el futuro antes que el resto. Tu mayor lección: bajar tus ideales al cuerpo y a los vínculos cercanos.', advice: 'Conecta con alguien que te importe sin agenda, solo por presencia.' },
  piscis:      { profile: 'Soñador, compasivo y artístico. Vives entre mundos visibles e invisibles. Tu mayor lección: poner límites sin sentir que pierdes magia.', advice: 'Crea o consume arte esta semana. Es tu medicina natural.' }
};

const ELEMENT_ENERGIES = {
  fuego:  { description: 'Acción, pasión, inspiración. Tu energía es chispa que enciende el mundo.', color: '#ff6b35' },
  tierra: { description: 'Estabilidad, sensualidad, manifestación. Tu energía es raíz que sostiene reinos.', color: '#a3a847' },
  aire:   { description: 'Mente, comunicación, ideas. Tu energía es viento que mueve realidades.', color: '#7dd3fc' },
  agua:   { description: 'Emoción, intuición, sanación. Tu energía es marea que limpia y nutre.', color: '#3b82f6' }
};

const COMPATIBILITIES = {
  aries:       { mejor: ['leo', 'sagitario', 'geminis'], desafiante: ['cancer', 'capricornio'] },
  tauro:       { mejor: ['virgo', 'capricornio', 'cancer'], desafiante: ['leo', 'acuario'] },
  geminis:     { mejor: ['libra', 'acuario', 'aries'], desafiante: ['virgo', 'piscis'] },
  cancer:      { mejor: ['escorpio', 'piscis', 'tauro'], desafiante: ['aries', 'libra'] },
  leo:         { mejor: ['aries', 'sagitario', 'libra'], desafiante: ['tauro', 'escorpio'] },
  virgo:       { mejor: ['tauro', 'capricornio', 'cancer'], desafiante: ['geminis', 'sagitario'] },
  libra:       { mejor: ['geminis', 'acuario', 'leo'], desafiante: ['cancer', 'capricornio'] },
  escorpio:    { mejor: ['cancer', 'piscis', 'capricornio'], desafiante: ['leo', 'acuario'] },
  sagitario:   { mejor: ['aries', 'leo', 'acuario'], desafiante: ['virgo', 'piscis'] },
  capricornio: { mejor: ['tauro', 'virgo', 'escorpio'], desafiante: ['aries', 'libra'] },
  acuario:     { mejor: ['geminis', 'libra', 'sagitario'], desafiante: ['tauro', 'escorpio'] },
  piscis:      { mejor: ['cancer', 'escorpio', 'capricornio'], desafiante: ['geminis', 'sagitario'] }
};
