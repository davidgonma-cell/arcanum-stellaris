/* ===========================================================================
   ARCANUM STELLARIS — Mazo Original de 78 Cartas
   ---------------------------------------------------------------------------
   Voz psicológica accesible: cada carta = un patrón de vida reconocible,
   descrito en español llano. Sin jerga esotérica.
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
      positiveMeaning: 'Estás al inicio de algo y todavía no sabes lo que es. Esa mezcla de miedo y emoción que sientes es buena señal: significa que vas hacia un sitio nuevo.',
      invertedMeaning: 'Lanzarte sin pensar, o quedarte parado por miedo. Las dos cosas vienen del mismo sitio: no querer mirar de verdad lo que tienes delante.',
      emotionalEnergy: 'Esa especie de mariposas en el estómago de cuando algo empieza.',
      description: 'Es la carta de los comienzos. De cuando dejas algo conocido por algo que aún no existe. No te dice qué va a pasar; te dice que estás dispuesto a averiguarlo.'
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
      positiveMeaning: 'Tienes los recursos que necesitas para lo que quieres hacer. Lo que falta es ponerte en marcha. Esta carta sale cuando dejas de pensar y empiezas.',
      invertedMeaning: 'Tener herramientas y no usarlas. O usarlas para impresionar más que para construir. También: hablar mucho y hacer poco.',
      emotionalEnergy: 'Una claridad activa. Sabes lo que quieres y por dónde empezar.',
      description: 'Habla de tu capacidad para hacer que las cosas pasen. No por magia: por método. Voluntad, recursos y atención puesta donde toca. Te recuerda que ya tienes lo que necesitas para el siguiente paso.'
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
      positiveMeaning: 'Sabes algo que no podrías explicar con palabras. Hazle caso a esa intuición: suele acertar más que tu cabeza.',
      invertedMeaning: 'Ignorar lo que sientes por dentro porque no te parece "lógico". O al revés: ver señales donde no las hay.',
      emotionalEnergy: 'Calma interior. Como cuando estás en silencio y oyes lo que de verdad piensas.',
      description: 'Es la carta de lo que sabes sin saber cómo. Las corazonadas, las sensaciones de que algo va bien o mal antes de tener pruebas. Te invita a parar, escucharte y confiar en lo que escuches.'
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
      keywords: ['abundancia', 'fertilidad', 'belleza', 'creación', 'cuidado'],
      positiveMeaning: 'Estás en un momento fértil: lo que cuides ahora va a crecer. Vale igual para un proyecto, un vínculo o tu propio bienestar.',
      invertedMeaning: 'Dejar de cuidarte por cuidar a otros. O bloquearte y no poder crear. A veces también: querer controlar lo que solo necesita espacio.',
      emotionalEnergy: 'Calidez. Esa sensación de tener algo bueno entre manos.',
      description: 'Habla del momento en que algo florece — un proyecto, una relación, una idea, tu salud. Te recuerda que crear no son solo grandes gestos: también es cuidar lo cotidiano para que dé fruto.'
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
      keywords: ['estructura', 'autoridad', 'orden', 'liderazgo', 'límites'],
      positiveMeaning: 'Es momento de estructura: rutinas, decisiones firmes, decir lo que quieres y lo que no. No es rigidez, es darte un marco.',
      invertedMeaning: 'Querer controlarlo todo. Ser duro contigo o con los demás. O al revés: vivir sin límites y sentirte desbordado.',
      emotionalEnergy: 'Firmeza tranquila. Saber dónde estás parado.',
      description: 'Es la carta del orden y la autoridad sana. Habla de poner límites, organizarte, hacerte responsable. La libertad real necesita una estructura debajo, y esa estructura la pones tú.'
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
      keywords: ['guía', 'enseñanza', 'mentor', 'tradición', 'aprendizaje'],
      positiveMeaning: 'Hay alguien o algo que tiene la respuesta que buscas: un mentor, un libro, una experiencia ya probada. Pedir ayuda no te quita autonomía.',
      invertedMeaning: 'Aceptar reglas sin cuestionarlas. O al contrario: rechazar todo lo establecido por sistema, sin mirar lo que de verdad sirve.',
      emotionalEnergy: 'Esa sensación de estar aprendiendo de alguien que sí sabe.',
      description: 'Es la carta de la enseñanza y la guía. Los maestros, las instituciones, lo que la gente lleva siglos haciendo. No te dice que sigas las reglas: te dice que mires lo que ya está probado antes de inventar tu propio camino.'
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
      keywords: ['amor', 'elección', 'vínculo', 'coherencia', 'decisión'],
      positiveMeaning: 'Una conexión importante en tu vida pide presencia. También puede ser una decisión grande: lo que elijas tiene que ser coherente con quién eres.',
      invertedMeaning: 'Decir sí cuando querías decir no. Vínculos donde pierdes algo de ti. Decisiones tomadas para complacer.',
      emotionalEnergy: 'Calidez con un punto eléctrico. Algo importante está en juego.',
      description: 'Habla de vínculos profundos y de elecciones que importan. No solo amor de pareja: cualquier decisión donde lo que eliges define quién eres. Te recuerda que elegir bien empieza por saber qué necesitas.'
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
      keywords: ['avance', 'voluntad', 'dirección', 'determinación', 'foco'],
      positiveMeaning: 'Tienes claro hacia dónde vas y la determinación para llegar. Avanza, pero sin atropellar: la dirección importa más que la velocidad.',
      invertedMeaning: 'Avanzar sin saber a dónde. Forzar las cosas. O lo contrario: estancado, sin decidir qué dirección tomar.',
      emotionalEnergy: 'Empuje contenido. Energía que pide salir.',
      description: 'Es la carta de avanzar con propósito. Fijar un objetivo y moverte hacia él, gestionando los impulsos contradictorios que tienes dentro. Ya puedes ponerte en marcha — pero tú al volante.'
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
      keywords: ['coraje', 'autocontrol', 'paciencia', 'serenidad', 'firmeza'],
      positiveMeaning: 'La fuerza que necesitas no es la del que grita más alto: es la del que se mantiene tranquilo. Domarte por dentro vale más que pelear por fuera.',
      invertedMeaning: 'Reaccionar en caliente y arrepentirte. O exigirte demasiado y agotarte. La fuerza también se puede usar contra uno mismo.',
      emotionalEnergy: 'Calor sostenido. La fuerza tranquila del que ya no necesita demostrarse.',
      description: 'Habla de coraje, pero del que se ejerce hacia dentro: paciencia, autocontrol, ternura contigo. La fuerza más útil casi nunca es la que se ve. Es la que te permite no estallar y seguir.'
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
      keywords: ['introspección', 'pausa', 'silencio', 'reflexión', 'soledad'],
      positiveMeaning: 'Necesitas tiempo a solas. No es huir: es retirarte para entender. Las respuestas que buscas no están en el ruido.',
      invertedMeaning: 'Aislarte por miedo, no por descanso. Darle vueltas a las cosas en bucle sin avanzar. Soledad que duele.',
      emotionalEnergy: 'Quietud. Como bajar el volumen del mundo y por fin oírte.',
      description: 'Es la carta del momento en que necesitas parar y mirar hacia dentro. No es depresión ni evitación: es el descanso reflexivo donde se ordenan las cosas. Date el tiempo: lo necesitas más de lo que crees.'
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
      keywords: ['cambio', 'ciclo', 'oportunidad', 'movimiento', 'suerte'],
      positiveMeaning: 'Algo cambia y tiende a ir a tu favor. Después de un tiempo plano, la situación se mueve. Aprovecha el viento mientras sople.',
      invertedMeaning: 'Resistirte a un cambio que ya está pasando. Repetir patrones que no funcionan. Sentirte víctima de la suerte.',
      emotionalEnergy: 'Esa sensación de que algo se mueve aunque tú no lo provoques.',
      description: 'Habla de los ciclos: las cosas no se quedan donde están. Lo malo pasa, lo bueno también. Te recuerda que cuando algo se estanca, es cuestión de tiempo que cambie — y cuando va bien, hay que disfrutarlo presente.'
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
      keywords: ['verdad', 'responsabilidad', 'consecuencia', 'claridad', 'integridad'],
      positiveMeaning: 'Recoges lo que sembraste, ni más ni menos. Es momento de claridad: ver las cosas como son, sin maquillaje, y actuar en consecuencia.',
      invertedMeaning: 'Hacer la vista gorda con algo que sabes que no está bien. Echar la culpa fuera. Decisiones tomadas desde el resentimiento.',
      emotionalEnergy: 'Lucidez. Como cuando se te quita una venda de los ojos.',
      description: 'Es la carta de la verdad y la responsabilidad. Lo que hiciste tiene consecuencias, y lo que te hicieron también. Te invita a mirar las cosas con honestidad y a actuar en línea con lo que de verdad es justo.'
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
      keywords: ['pausa', 'perspectiva', 'rendición', 'espera', 'cambio de mirada'],
      positiveMeaning: 'Estás en pausa, y eso está bien. A veces hay que parar y mirar las cosas desde otro ángulo antes de seguir. Es tiempo, no tiempo perdido.',
      invertedMeaning: 'Atascarte y no salir. Sacrificarte por algo o alguien que no lo merece. Esperar y esperar sin decidir.',
      emotionalEnergy: 'Calma rara. Como suspender el tiempo un rato.',
      description: 'Habla de las pausas obligadas — esos momentos en que no puedes avanzar y toca esperar. Lo importante es entender qué te están enseñando: muchas veces lo que se ve estando quieto no se ve corriendo.'
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
      keywords: ['final', 'transformación', 'soltar', 'cierre', 'cambio de etapa'],
      positiveMeaning: 'Algo termina, y aunque cueste, es necesario. Lo que se va deja sitio para algo nuevo. No es un final del todo: es un cambio de capítulo.',
      invertedMeaning: 'Resistirte a soltar algo que ya no funciona. Aferrarte a una relación, un trabajo, una versión de ti que ya pasó.',
      emotionalEnergy: 'Una solemnidad tranquila. Reconocer que algo ya no es.',
      description: 'No habla de muerte literal: habla de finales y transformaciones. De cuando una etapa de tu vida se cierra para que empiece otra. Es difícil pero limpio. Lo que se acaba ya estaba terminándose.'
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
      keywords: ['equilibrio', 'paciencia', 'moderación', 'integración', 'medida'],
      positiveMeaning: 'Toca paciencia y mezcla. No fuerces los tiempos: si dejas que las cosas se asienten, salen mejor que si las apresuras.',
      invertedMeaning: 'Querer todo ya. Excesos por un lado, escasez por otro. Falta de equilibrio entre lo que das y lo que recibes.',
      emotionalEnergy: 'Serenidad activa. Hacer las cosas sin prisa pero sin pausa.',
      description: 'Es la carta del equilibrio y la moderación. Combinar lo opuesto sin que pelee — trabajo y descanso, dar y recibir, pasión y razón. Te recuerda que la mejor versión de las cosas suele estar en el medio.'
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
      keywords: ['apego', 'dependencia', 'patrón', 'sombra', 'lo que te ata'],
      positiveMeaning: 'Hay un patrón que te tiene atrapado: una relación, un hábito, una creencia. Verlo ya es media salida. Las cadenas no son tan fuertes como parecen.',
      invertedMeaning: 'Empezar a salir de algo que te enganchaba. Reconocer una adicción, una dependencia, un lazo tóxico. La luz vuelve.',
      emotionalEnergy: 'Densidad. Estar atrapado pero empezar a entender por qué.',
      description: 'Habla de las cosas a las que estás enganchado, sin juicio, solo describiendo. Adicciones, vínculos tóxicos, miedos que te paralizan, la imagen que crees que tienes que dar. La carta no condena: te muestra para que decidas si te quedas ahí.'
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
      keywords: ['ruptura', 'cambio brusco', 'verdad inesperada', 'derrumbe', 'liberación'],
      positiveMeaning: 'Algo se cae, y aunque sea brusco, era falso. Lo que se rompe abre paso a algo más real. La sacudida duele pero limpia.',
      invertedMeaning: 'Resistirte al derrumbe que ya está pasando. Aferrarte a algo que sabes que no se sostiene. Posponer lo inevitable.',
      emotionalEnergy: 'Sacudida. Como cuando se te cae algo de las manos sin querer.',
      description: 'Es la carta del cambio brusco e inesperado. Una verdad que sale, una situación que estalla, algo que creías estable y resulta que no. Asusta — pero después, las cosas se ven más claras que nunca.'
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
      keywords: ['esperanza', 'calma', 'recuperación', 'fe', 'renovación'],
      positiveMeaning: 'Después de algo difícil, vuelve la calma y la esperanza. La luz al final del túnel es real. Confía: lo peor ya pasó.',
      invertedMeaning: 'Pesimismo que no te deja ver lo que está mejorando. Sentirte sin fe. Esperar que todo siga mal.',
      emotionalEnergy: 'Alivio limpio. Esperanza tranquila después de una tormenta.',
      description: 'Habla del momento en que se sale del bache. No es el subidón: es la calma que llega después. Confianza, descanso, ganas de seguir. Te dice que estás sanando, aunque aún no se vea del todo.'
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
      keywords: ['confusión', 'duda', 'sueños', 'subconsciente', 'incertidumbre'],
      positiveMeaning: 'Las cosas no están claras, y forzar la claridad ahora no funciona. Tus sueños y tus emociones te están diciendo algo: escucha sin querer entenderlo todo.',
      invertedMeaning: 'Confusión que se vuelve obsesión. Miedos que aumentan. Mentirte sobre lo que pasa.',
      emotionalEnergy: 'Niebla. No saber del todo qué sientes ni por qué.',
      description: 'Es la carta de lo que aún no está claro: dudas, miedos, intuiciones difíciles de explicar. No te pide que lo entiendas todo, te pide que aprendas a moverte cuando no ves al cien por cien.'
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
      keywords: ['alegría', 'éxito', 'claridad', 'autenticidad', 'vitalidad'],
      positiveMeaning: 'Todo se aclara y va bien. Es momento de disfrutar lo que has conseguido y dejar que se vea quién eres. La alegría sencilla es la mejor.',
      invertedMeaning: 'Forzarte a estar bien cuando no lo estás. Brillar para la galería pero estar agotado por dentro. Optimismo de manual.',
      emotionalEnergy: 'Esa risa fácil del que está bien y ya está.',
      description: 'Habla de los momentos buenos sin más complicación. Claridad, salud, éxito, vínculos cómodos. Te dice que disfrutes esto sin culpa: no toda etapa tiene que ser una lucha.'
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
      keywords: ['llamada', 'segunda oportunidad', 'vocación', 'despertar', 'decisión grande'],
      positiveMeaning: 'Algo te está llamando a una vida más alineada con quien eres. Una decisión, un cambio, una segunda oportunidad. Es momento de decidir si la coges.',
      invertedMeaning: 'Ignorar lo que sabes que tienes que hacer. Juzgarte con dureza. Quedarte donde estás aunque ya no encaje.',
      emotionalEnergy: 'Solemnidad. Sensación de que algo importante se está decidiendo.',
      description: 'Habla de momentos de despertar — cuando ves clara una vocación, una verdad, un camino. No siempre es agradable: a veces te obliga a soltar lo conocido. Pero te dice que esa llamada interior tiene razón.'
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
      keywords: ['plenitud', 'cierre', 'logro', 'integración', 'ciclo cumplido'],
      positiveMeaning: 'Has cerrado un ciclo y se nota. Hay paz, plenitud, cosa bien hecha. Disfruta el momento: el siguiente capítulo empieza desde más arriba.',
      invertedMeaning: 'Cierres mal hechos. La sensación de que falta algo aunque ya esté todo. No querer soltar lo que ya terminó.',
      emotionalEnergy: 'Paz tranquila. Esa sonrisa que no necesita explicar nada.',
      description: 'Es la carta de los ciclos completos. Algo que llevabas tiempo trabajando llega a su lugar. No es el final del todo — es un descanso bien ganado antes del siguiente capítulo.'
    }
  ],

  // ==================== ARCANOS MENORES (56) ====================
  minors: [] // Se completa programáticamente abajo
};

/* ===========================================================================
   GENERACIÓN PROGRAMÁTICA DE ARCANOS MENORES
   =========================================================================== */

const SUITS = {
  calices: {
    name: 'Cálices',
    element: 'agua',
    domain: 'emociones, vínculos, lo que se siente',
    symbol: '♥',
    icon: '🜄',
    gradient: ['#0a1929', '#1e3a5f', '#3b82f6'],
    astrology: 'Cáncer · Escorpio · Piscis'
  },
  espadas: {
    name: 'Espadas',
    element: 'aire',
    domain: 'pensamientos, decisiones, comunicación',
    symbol: '✦',
    icon: '🜁',
    gradient: ['#1c1c2e', '#3a3a5c', '#cbd5e1'],
    astrology: 'Géminis · Libra · Acuario'
  },
  varas: {
    name: 'Varas',
    element: 'fuego',
    domain: 'acción, ganas, proyectos',
    symbol: '✺',
    icon: '🜂',
    gradient: ['#3a0a0a', '#7c1c2c', '#ef4444'],
    astrology: 'Aries · Leo · Sagitario'
  },
  pentaculos: {
    name: 'Pentáculos',
    element: 'tierra',
    domain: 'cuerpo, dinero, lo concreto',
    symbol: '☘',
    icon: '🜃',
    gradient: ['#1a2e1a', '#2d5a2d', '#a3a847'],
    astrology: 'Tauro · Virgo · Capricornio'
  }
};

// Energía emocional por número y palo — corta, humana, sin metáfora cerrada
const NUMBER_ENERGY = {
  agua:   { 1: 'Una emoción que recién se abre.',     2: 'Una conexión que empieza a ajustarse.',     3: 'Alegría compartida con la gente que importa.', 4: 'Un poco de apatía, ganas de poco.', 5: 'Duelo o decepción que pide ser sentido.', 6: 'Memoria afectiva que vuelve con calma.', 7: 'Muchas opciones flotando, poca claridad.', 8: 'Algo dejó de llenar, toca soltarlo.', 9: 'Satisfacción real, no impostada.', 10: 'Plenitud afectiva sostenida.' },
  aire:   { 1: 'Un destello de claridad nuevo.',       2: 'Indecisión entre dos opciones.',            3: 'Dolor que pide ser nombrado.',                4: 'Cabeza que pide silencio.',         5: 'Conflicto donde ganar también desgasta.', 6: 'Transición hacia aguas más calmas.',     7: 'Estrategia, lo que no se dice todavía.',     8: 'Sentirse atrapado, pero la salida existe.', 9: 'Ansiedad nocturna, vueltas en la cabeza.', 10: 'Final duro, fondo tocado.' },
  fuego:  { 1: 'Una chispa de entusiasmo nueva.',      2: 'Visión clara, falta dar el paso.',          3: 'Lo sembrado empieza a llegar.',               4: 'Estabilidad alcanzada, momento de celebrar.', 5: 'Roces, competencia, fricción.',     6: 'Reconocimiento que llega.',              7: 'Defender lo tuyo con argumentos.',           8: 'Velocidad, las cosas se aceleran.',     9: 'Última resistencia antes de llegar.', 10: 'Sobrecarga, demasiado peso.' },
  tierra: { 1: 'Una oportunidad concreta sobre la mesa.', 2: 'Malabares con varias cosas a la vez.',    3: 'Trabajo en equipo que funciona.',             4: 'Apego a lo que tienes.',           5: 'Bache material o de salud.',            6: 'Intercambio justo, dar y recibir.',      7: 'Pausa para evaluar lo sembrado.',           8: 'Oficio, dedicación, mejorar lo que haces.', 9: 'Independencia ganada con esfuerzo.', 10: 'Estabilidad sólida y duradera.' }
};

const COURT_ENERGY = {
  aprendiz:  'Curiosidad nueva, todavía sin pulir.',
  caballero: 'Acción decidida, energía que empuja.',
  reina:     'Sostenida desde dentro, integrada.',
  rey:       'Consolidada, con autoridad serena.'
};

// Plantillas de significado por número y palo — voz psicológica accesible
const NUMBER_MEANINGS = {
  calices: {
    1: { name: 'As de Cálices', kw: ['emoción nueva', 'apertura', 'amor naciente'], pos: 'Algo en ti se abre por el lado emocional. Una nueva relación, una emoción que vuelve, ganas de querer y de dejarte querer.', inv: 'Bloquearte por dentro. No dejar entrar lo que sientes. Quedarte seco emocionalmente por miedo.', desc: 'Habla de algo nuevo que está naciendo en tu vida emocional. No tiene que ser amor de pareja: puede ser una amistad, una reconciliación, las ganas de volver a sentir.' },
    2: { name: 'Dos de Cálices', kw: ['conexión', 'reciprocidad', 'pareja'], pos: 'Una conexión importante: vínculo recíproco, química, equipo. Hay alguien que te entiende y a quien tú también entiendes.', inv: 'Vínculos donde uno da más que el otro. Malentendidos. Algo que parece que va a empezar y no termina de cuajar.', desc: 'Es la carta del vínculo de a dos. Pareja, amistad cercana, sociedad de trabajo donde hay química real. Habla de cuando dos personas se ajustan bien.' },
    3: { name: 'Tres de Cálices', kw: ['celebración', 'amistad', 'comunidad'], pos: 'Es tiempo de celebrar con tu gente. Las amistades, los planes en grupo, la sensación de pertenecer. Disfruta sin ahorrar alegría.', inv: 'Aislarte cuando necesitas a otros. Drama de grupo. Fiestas que esconden vacío. Sentirte fuera del círculo.', desc: 'Habla de la alegría compartida con la gente que te quiere. Amigos, familia elegida, comunidad. Te recuerda que también necesitas estos momentos para estar bien.' },
    4: { name: 'Cuatro de Cálices', kw: ['apatía', 'desinterés', 'aburrimiento'], pos: 'Estás un poco apático con cosas que antes te ilusionaban. No es depresión, es saturación. Mira con calma: hay algo nuevo que aún no estás viendo.', inv: 'Salir del bajón. Volver a interesarte por la vida. Aceptar la oferta que tenías delante.', desc: 'Es la carta del aburrimiento o desinterés temporal. Cuando tienes cosas buenas pero no las disfrutas. Te avisa de que estás dejando pasar algo por mirar para otro lado.' },
    5: { name: 'Cinco de Cálices', kw: ['duelo', 'pérdida', 'decepción'], pos: 'Hay un duelo o una decepción ahí. Está bien sentirlo. Pero también: lo que has perdido no es todo lo que tienes. Mira lo que sigue en pie.', inv: 'Aceptar lo perdido y seguir. Perdonar — a otros o a ti. Recuperar lo que aún sirve.', desc: 'Habla de pérdidas y desilusiones — el final de una relación, un sueño que no fue, una decepción reciente. Es la carta del duelo necesario, pero también de poder mirar lo que queda.' },
    6: { name: 'Seis de Cálices', kw: ['memoria', 'pasado', 'reencuentro'], pos: 'Algo del pasado vuelve, y vuelve bien. Un recuerdo dulce, alguien de antes, las ganas de cuidar a tu yo niño. Reconecta.', inv: 'Vivir en el pasado. Idealizar lo que fue. Quedarte en una nostalgia que no te deja crecer.', desc: 'Es la carta de la memoria afectiva: lo que te marcó de pequeño, lo que dejaste atrás y vuelve, los reencuentros. Te invita a mirar de dónde vienes con cariño, no con peso.' },
    7: { name: 'Siete de Cálices', kw: ['opciones', 'fantasía', 'decisión'], pos: 'Tienes muchas opciones delante y eso es a la vez bonito y abrumador. Distingue las reales de las que solo brillan. Pregúntate qué quieres de verdad.', inv: 'Recuperar la claridad. Bajar a tierra después de tanta fantasía. Decidirte por algo concreto.', desc: 'Habla del exceso de posibilidades cuando paralizan más que entusiasman. Sueños, planes, fantasías. Te recuerda que no todo lo que parece bueno lo es — y que elegir significa renunciar a otras cosas.' },
    8: { name: 'Ocho de Cálices', kw: ['salida', 'soltar', 'despedida'], pos: 'Algo dejó de llenarte y lo sabes. Es momento de soltarlo y de irte aunque no esté del todo claro a dónde. Confía en esa señal interna.', inv: 'Quedarte por miedo a lo desconocido. Posponer una salida que ya tenías que hacer. Aferrarte por costumbre.', desc: 'Es la carta de las salidas necesarias — irte de un trabajo, de una relación, de una ciudad, de una versión de ti que ya no encajas. Habla del valor de soltar cuando algo ya no es.' },
    9: { name: 'Nueve de Cálices', kw: ['satisfacción', 'deseo cumplido', 'gratitud'], pos: 'Algo que querías llega. Es momento de disfrutarlo sin culpa. Tienes derecho a estar bien.', inv: 'Conseguir lo que querías y notar que no llena. Vacío bajo el éxito. Deseos que en realidad eran de otros.', desc: 'Es la carta del deseo cumplido: lo bueno que te pasa cuando te pasa. Te recuerda que recibir también es una habilidad — y que celebrar lo conseguido es parte del trabajo.' },
    10: { name: 'Diez de Cálices', kw: ['hogar', 'familia', 'armonía'], pos: 'Estabilidad afectiva. La gente con la que cuentas, el hogar emocional. No es perfecto, pero es real y sostiene.', inv: 'Tensiones familiares. Sentir distancia con los tuyos. Discusiones que no se cierran.', desc: 'Habla de la armonía emocional duradera — familia, hogar, círculo cercano. La sensación de tener un sitio donde apoyarte. Te recuerda valorarlo cuando lo tienes.' }
  },
  espadas: {
    1: { name: 'As de Espadas', kw: ['claridad', 'verdad', 'decisión'], pos: 'Llega claridad. Una idea, una verdad, una decisión que estaba pendiente y de pronto la ves nítida. Aprovecha ese momento.', inv: 'Verdades que duelen y se usan para herir. Decisión tomada en caliente. Pensar antes de hablar.', desc: 'Es la carta de los momentos lúcidos: cuando entiendes algo que llevabas dándole vueltas. Te invita a usar esa claridad bien, sin convertirla en arma.' },
    2: { name: 'Dos de Espadas', kw: ['indecisión', 'bloqueo', 'dilema'], pos: 'Estás entre dos opciones y no quieres decidir. Has cerrado los ojos para no mirar. Toma aire: la respuesta llegará si te quitas la venda.', inv: 'Por fin decidir. Cerrar el dilema. Aceptar que tienes que elegir aunque ninguna opción sea perfecta.', desc: 'Habla del bloqueo mental ante una decisión. Cuando no quieres elegir porque todas las opciones tienen algo malo. Te dice: la indecisión también es una decisión, y suele salir más cara.' },
    3: { name: 'Tres de Espadas', kw: ['dolor', 'herida', 'desilusión'], pos: 'Algo te ha dolido. Una traición, una verdad, una pérdida. Llóralo si lo necesitas: el dolor nombrado se va antes que el callado.', inv: 'Empezar a recuperarte. Perdonar — a otros o a ti. Aceptar que el dolor también enseñó.', desc: 'Es la carta del dolor emocional concreto: una decepción afectiva, una verdad incómoda, una herida fresca. No le pone bonito: te dice que duele y que ese duelo merece su tiempo.' },
    4: { name: 'Cuatro de Espadas', kw: ['descanso', 'pausa mental', 'recuperación'], pos: 'Necesitas parar. Descanso, silencio, recuperación. La cabeza te pide un alto y hay que hacerle caso.', inv: 'Resistirte al descanso. Mente que no para. Agotamiento extremo que necesita atención profesional.', desc: 'Habla del descanso necesario — físico y mental. Cuando vienes de mucho y el cuerpo te pasa factura. Te recuerda que parar no es perder tiempo: es lo que te permite seguir.' },
    5: { name: 'Cinco de Espadas', kw: ['conflicto', 'orgullo', 'discusión'], pos: 'Has ganado una discusión, ¿pero a qué precio? Mira las batallas que peleas. No todas merecen pelearse.', inv: 'Reconciliarte. Soltar el orgullo. Reconocer que tenías razón pero quizá no de qué manera.', desc: 'Es la carta del conflicto donde ganar te deja peor. Discusiones donde el ego pesa más que la razón. Te invita a elegir mejor qué peleas das y cómo las das.' },
    6: { name: 'Seis de Espadas', kw: ['transición', 'avanzar', 'aguas más calmas'], pos: 'Estás dejando atrás un periodo difícil. El cambio se nota: más calma, menos drama. Sigue así, aún no has llegado pero ya casi.', inv: 'Costarte mucho dejar atrás. Llevarte el peso aunque te muevas. Repetir lo que querías dejar.', desc: 'Habla de las transiciones después de algo duro. Mudanzas, cambios de etapa, salir de relaciones complicadas. Te dice: lo peor ya pasó, ahora toca el camino de vuelta a la calma.' },
    7: { name: 'Siete de Espadas', kw: ['estrategia', 'discreción', 'astucia'], pos: 'A veces hay que jugar la carta de la astucia. Pero ojo: con ética. Mejor no decir todo que mentir, mejor evadir un momento que enfrentarse a destiempo.', inv: 'Engaños que se descubren. Confesar lo que ocultabas. Volver a la transparencia.', desc: 'Es la carta de la estrategia y la falta de transparencia. A veces la usas tú, a veces la usan contigo. Te invita a mirar dónde estás siendo poco directo — y por qué.' },
    8: { name: 'Ocho de Espadas', kw: ['atrapado', 'autoengaño', 'salida cerca'], pos: 'Te sientes atrapado, pero la salida está más cerca de lo que crees. Las cuerdas que ves no son tan fuertes. Mira con calma.', inv: 'Salir de la trampa. Darte cuenta de que podías irte. Recuperar el poder de decisión.', desc: 'Habla de cuando te sientes sin opciones, pero las opciones existen y eres tú quien no las quiere ver. Suele pasar por miedo o por costumbre. Te recuerda que tu cabeza también te encierra.' },
    9: { name: 'Nueve de Espadas', kw: ['ansiedad', 'insomnio', 'agobio mental'], pos: 'Mucha ansiedad, pensamientos que dan vueltas, insomnio. Reconócelo: estás pasando por una mala racha mental. Pide ayuda si la necesitas.', inv: 'Bajar la espiral. Hablar lo que te angustia. Volver a dormir tranquilo.', desc: 'Es la carta de la ansiedad y el agobio mental. Cuando los pensamientos no se apagan y la noche se hace larga. Te dice: lo que te angustia normalmente es menos terrible de lo que tu cabeza está construyendo.' },
    10: { name: 'Diez de Espadas', kw: ['final duro', 'fondo', 'cierre tajante'], pos: 'Has tocado fondo en algo. La buena noticia: desde aquí solo se sube. Lo peor ya está pasando.', inv: 'Resistirte al final. Aferrarte a algo que ya murió. Alargar el sufrimiento por miedo a soltar.', desc: 'Habla de finales duros — un capítulo que se cierra de manera tajante. Asusta, pero limpia. Después de esto vuelve la luz.' }
  },
  varas: {
    1: { name: 'As de Varas', kw: ['inspiración', 'impulso', 'arranque'], pos: 'Una idea o un impulso nuevo te enciende. Tómalo: cuando algo te emociona así, hay que probar.', inv: 'Inspiración bloqueada. Apagar la chispa por miedo. Posponer lo que te ilusiona.', desc: 'Es la carta del momento en que te entran ganas. Un proyecto, un viaje, algo que quieres hacer. Te dice: ese impulso vale, ponle pasos.' },
    2: { name: 'Dos de Varas', kw: ['planificación', 'decisión', 'horizonte'], pos: 'Tienes una visión clara y opciones reales. Es momento de elegir el camino y empezar. Lo difícil ya está hecho — pensarlo —, ahora toca moverse.', inv: 'Quedarte en la zona conocida. Plan que no se ejecuta. Indecisión sobre qué hacer cuando ya sabes lo que quieres.', desc: 'Habla del momento en que ya tienes pensado lo que quieres y solo te queda decidirte. Es la carta del paso de la idea a la acción. No le des más vueltas.' },
    3: { name: 'Tres de Varas', kw: ['expansión', 'espera fértil', 'avance'], pos: 'Lo que pusiste en marcha empieza a dar señales. Confía en los tiempos: lo que sembraste viene de camino.', inv: 'Demoras, decepciones. Expectativas mal calibradas. Esperar resultados que no van a llegar como pensabas.', desc: 'Es la carta de la espera fértil: ya hiciste lo tuyo, ahora toca dejar que las cosas se cocinen. Te recuerda que algunos resultados tardan.' },
    4: { name: 'Cuatro de Varas', kw: ['celebración', 'estabilidad', 'hito'], pos: 'Has construido algo y se nota. Toca celebrarlo: una mudanza, un éxito, un proyecto que llegó. Disfruta lo conseguido.', inv: 'Falta de raíces. Conflictos en casa. Estabilidad que se tambalea.', desc: 'Habla de la estabilidad y la celebración. Bodas, mudanzas, hitos cumplidos. Te dice que pares un momento a ver lo que has hecho.' },
    5: { name: 'Cinco de Varas', kw: ['fricción', 'competencia', 'roces'], pos: 'Hay roces en un grupo o en tu entorno. No es grave, es competición. Defiéndete con argumentos, no con ego.', inv: 'Acuerdo. Conflictos que se apaciguan. Encontrar terreno común.', desc: 'Es la carta del conflicto pequeño pero presente — discusiones, competencia laboral, choques de egos. Te invita a pelear con elegancia, no con visceralidad.' },
    6: { name: 'Seis de Varas', kw: ['reconocimiento', 'éxito visible', 'logro'], pos: 'Reconocimiento. Tu esfuerzo se ve y la gente lo nota. Aceptar el aplauso también es parte del trabajo.', inv: 'Falta de reconocimiento. Victoria hueca. Soberbia que aleja a los demás.', desc: 'Habla del momento en que el esfuerzo da resultado público — un ascenso, un éxito visible, un logro celebrado. Te dice: te lo has ganado, recíbelo.' },
    7: { name: 'Siete de Varas', kw: ['defender', 'sostener', 'persistir'], pos: 'Defiende lo tuyo. Tienes la razón, pero te toca sostenerla. Mantente firme aunque la presión sea alta.', inv: 'Sentirte abrumado. Querer abandonar la lucha. Cansancio de defender solo.', desc: 'Es la carta del que tiene que mantener su posición frente a varios. Críticas, presiones, gente que pone en duda lo que haces. Te recuerda: tu sitio no se cede.' },
    8: { name: 'Ocho de Varas', kw: ['velocidad', 'movimiento', 'noticias'], pos: 'Las cosas se aceleran. Llegan respuestas, mensajes, oportunidades. Aprovecha el ritmo: este momento pide acción rápida.', inv: 'Demoras. Mensajes confusos. Comunicaciones que no llegan o se malinterpretan.', desc: 'Habla de los momentos en que todo va deprisa — semanas en que pasan más cosas que en meses. Te dice: súbete a la ola, no la analices demasiado.' },
    9: { name: 'Nueve de Varas', kw: ['resistencia', 'último esfuerzo', 'casi llegando'], pos: 'Estás cansado, pero ya casi llegas. Un esfuerzo más. Tu resistencia es mayor de la que crees.', inv: 'Agotamiento. Paranoia defensiva. Soltar antes de tiempo lo que ya casi tenías.', desc: 'Es la carta de la resistencia final — los últimos metros del maratón. Has aguantado mucho, queda poco. Te recuerda que ya pasaste por más.' },
    10: { name: 'Diez de Varas', kw: ['sobrecarga', 'peso', 'soltar'], pos: 'Llevas demasiada carga. Aprende a delegar o a soltar lo que no es tuyo. Cargar con todo no te hace más responsable, te hace menos eficaz.', inv: 'Soltar peso. Liberarte de responsabilidades que asumiste sin necesidad. Recuperar ligereza.', desc: 'Habla de la sobrecarga. Trabajo, responsabilidades, problemas de los demás que cargas tú. Te dice claro: si no sueltas algo, te vas a romper.' }
  },
  pentaculos: {
    1: { name: 'As de Pentáculos', kw: ['oportunidad', 'comienzo concreto', 'siembra'], pos: 'Llega una oportunidad concreta — trabajo, dinero, proyecto. No es magia, es algo real. Aprovéchala con calma.', inv: 'Dejar pasar la oportunidad. Dudar de lo bueno. Miedo a comprometerte con algo serio.', desc: 'Es la carta del comienzo material — un nuevo trabajo, una inversión, el inicio de algo concreto. Te dice: cuídala desde el principio.' },
    2: { name: 'Dos de Pentáculos', kw: ['malabares', 'flexibilidad', 'adaptación'], pos: 'Estás haciendo malabares con varias cosas y, mientras te muevas, salen. La flexibilidad es la clave ahora.', inv: 'Sobrecarga. Perder el equilibrio. Una pelota que se cae cuando intentas con demasiadas.', desc: 'Habla de los momentos en que estás manejando varias cosas a la vez. Trabajo, casa, finanzas, salud. Te recuerda que la clave no es la fuerza, es el equilibrio.' },
    3: { name: 'Tres de Pentáculos', kw: ['equipo', 'colaboración', 'oficio'], pos: 'Trabajo en equipo. Lo que estás haciendo necesita la habilidad de otros y la tuya. Juntos sale mejor que solos.', inv: 'Equipos que no funcionan. Falta de reconocimiento. Trabajo en grupo donde no te valoran.', desc: 'Es la carta de la colaboración y la maestría compartida. Te recuerda que las cosas grandes casi siempre se hacen con otros, no contra otros.' },
    4: { name: 'Cuatro de Pentáculos', kw: ['apego', 'control', 'seguridad'], pos: 'Tienes lo que necesitas. ¿Lo aferras o lo disfrutas? Cuidar lo tuyo está bien, pero el control excesivo lo asfixia.', inv: 'Soltar el control. Volverte más generoso. Abrirte a fluir con el dinero y lo material.', desc: 'Habla del apego — al dinero, a las cosas, a la seguridad. Te recuerda que tener algo no es lo mismo que disfrutarlo, y que el miedo a perder a veces te impide gozar lo que ya tienes.' },
    5: { name: 'Cinco de Pentáculos', kw: ['bache', 'aislamiento', 'pedir ayuda'], pos: 'Estás pasando una mala racha — económica, de salud, de soledad. Pide ayuda: la luz está más cerca de lo que parece.', inv: 'Recuperación. Salir del bache. Aceptar el apoyo que te ofrecen.', desc: 'Es la carta del bache material — pérdida de trabajo, problemas de salud, sensación de aislamiento. Difícil pero no permanente. Te dice: esto pasa, y no estás tan solo como te sientes.' },
    6: { name: 'Seis de Pentáculos', kw: ['intercambio', 'dar y recibir', 'flujo'], pos: 'Hay un movimiento sano de dar y recibir — dinero, ayuda, recursos. Cuando el flujo va bien, todos ganan.', inv: 'Generosidad desigual. Deudas que pesan. Dar para controlar.', desc: 'Habla del intercambio justo — laboral, económico, afectivo. La abundancia se mide en circulación. Te recuerda que dar y recibir son dos caras de la misma cosa.' },
    7: { name: 'Siete de Pentáculos', kw: ['paciencia', 'cosecha próxima', 'evaluar'], pos: 'Tu trabajo está madurando. No lo arranques antes de tiempo. La paciencia ahora es estrategia.', inv: 'Impaciencia. Esperar resultados que no llegan. Esfuerzo mal dirigido.', desc: 'Es la carta del momento intermedio: ya sembraste, falta cosechar. Te invita a evaluar con calma si vas bien o si conviene cambiar el plan, sin precipitarte.' },
    8: { name: 'Ocho de Pentáculos', kw: ['oficio', 'dedicación', 'mejorar'], pos: 'Es momento de oficio: dedicación, repetición, mejorar lo que haces. La maestría no es talento, es trabajo bien hecho.', inv: 'Repetir sin alma. Perfeccionismo paralizante. Trabajar sin pasión.', desc: 'Habla del trabajo paciente, del aprendizaje constante. Te recuerda que dominar algo lleva tiempo y que cada pequeño avance suma.' },
    9: { name: 'Nueve de Pentáculos', kw: ['independencia', 'logro propio', 'autosuficiencia'], pos: 'Has construido algo tuyo y puedes disfrutarlo sin pedir permiso. Independencia ganada con esfuerzo: te lo mereces.', inv: 'Soledad disfrazada de independencia. Lujo que aísla. Miedo a recibir afecto.', desc: 'Es la carta de la autosuficiencia bien lograda. Tener tu casa, tu trabajo, tu vida. Te dice que disfrutar lo conseguido también es trabajo.' },
    10: { name: 'Diez de Pentáculos', kw: ['legado', 'familia', 'estabilidad sólida'], pos: 'Estabilidad sólida — material, familiar, generacional. Lo que has construido nutre a más gente que tú. Un legado.', inv: 'Conflictos hereditarios. Legado tóxico. Dependencia de lo familiar.', desc: 'Habla de la abundancia que se vuelve familia, comunidad, herencia. Te recuerda que algunas cosas se construyen para más de una persona y para más de una generación.' }
  }
};

// Plantillas para figuras de la corte — voz accesible
const COURT_MEANINGS = {
  calices: {
    aprendiz:  { name: 'Aprendiz de Cálices', kw: ['emoción nueva', 'mensaje afectivo', 'sensibilidad'], pos: 'Llega un mensaje afectivo, una propuesta tierna, una emoción nueva. Recíbelo sin defenderte.', inv: 'Inmadurez emocional. Sensibilidad a flor de piel. Evitar lo que sientes.', desc: 'Es la carta de las emociones que están empezando, todavía un poco torpes pero genuinas. Habla de la apertura sentimental sin demasiadas defensas.' },
    caballero: { name: 'Caballero de Cálices', kw: ['romanticismo', 'idealismo', 'perseguir lo bonito'], pos: 'Avanzas con el corazón por delante. Buscas algo o a alguien con romanticismo. Está bien — pero aterriza tus expectativas.', inv: 'Ilusiones que no se sostienen. Promesas vacías. Idealización que decepciona.', desc: 'Habla del que va detrás de lo que siente con romanticismo. Funciona si es realista, falla si fantasea demasiado.' },
    reina:     { name: 'Reina de Cálices', kw: ['empatía', 'cuidado', 'intuición afectiva'], pos: 'Empatía profunda, intuición que acierta, capacidad de cuidar a otros. Eres el sostén afectivo de tu entorno.', inv: 'Codependencia. Absorber lo ajeno hasta agotarte. No saber poner límites afectivos.', desc: 'Es la carta de la persona que sostiene emocionalmente a los demás. Te recuerda: cuidar de otros es valioso, pero también necesitas cuidarte tú.' },
    rey:       { name: 'Rey de Cálices', kw: ['madurez emocional', 'serenidad', 'gestión afectiva'], pos: 'Madurez emocional: saber lo que sientes y gestionarlo sin reprimirlo ni dejarte arrastrar. Equilibrio.', inv: 'Frialdad bajo apariencia cálida. Manipulación afectiva. Control emocional disfrazado de sabiduría.', desc: 'Habla de la persona que ha integrado sus emociones — no las niega, no las dramatiza. Te muestra cómo se ven las emociones gestionadas con calma.' }
  },
  espadas: {
    aprendiz:  { name: 'Aprendiz de Espadas', kw: ['curiosidad', 'aprendizaje', 'mente despierta'], pos: 'Llega información reveladora. Curiosidad, ganas de aprender. Mente despierta.', inv: 'Cotilleos. Palabras precipitadas. Espiar a otros más que a uno mismo.', desc: 'Es la carta de la mente curiosa que está en modo aprender. Funciona si la curiosidad va acompañada de criterio.' },
    caballero: { name: 'Caballero de Espadas', kw: ['acción rápida', 'decisión', 'argumentos'], pos: 'Avanzas con argumentos claros. Decisión rápida. La verdad por delante.', inv: 'Impulsividad. Palabras que hieren. Acción sin medir consecuencias.', desc: 'Habla del que actúa con la cabeza, rápido y directo. Útil cuando hay que decidir, peligroso cuando atropella.' },
    reina:     { name: 'Reina de Espadas', kw: ['lucidez', 'autonomía', 'verdad'], pos: 'Inteligencia clara, autonomía, capacidad de ver lo que es. Tu mente es tu mejor herramienta.', inv: 'Frialdad. Juicio severo. Palabras como cuchillos. Soledad por exigirte demasiado.', desc: 'Es la carta de la persona que ha aprendido a pensar con claridad — y a veces lo ha pagado caro. Lucidez que necesita compasión.' },
    rey:       { name: 'Rey de Espadas', kw: ['autoridad mental', 'criterio', 'justicia'], pos: 'Pensamiento claro, decisiones firmes, palabras precisas. Justicia bien ejercida.', inv: 'Tiranía intelectual. Dogmatismo. Usar la lógica para evadir el corazón.', desc: 'Habla de la autoridad mental — la persona que decide bien porque piensa bien. Te muestra cómo se usa la cabeza con responsabilidad.' }
  },
  varas: {
    aprendiz:  { name: 'Aprendiz de Varas', kw: ['entusiasmo', 'idea nueva', 'aventura'], pos: 'Una idea encendida llega a tu vida. Síguela. La ilusión nueva es buena guía.', inv: 'Entusiasmo que no aterriza. Distracciones constantes. Empezar mucho y no acabar nada.', desc: 'Es la carta del fuego nuevo — entusiasmo, ganas, ideas. Funciona si hay constancia detrás.' },
    caballero: { name: 'Caballero de Varas', kw: ['pasión', 'aventura', 'impulso'], pos: 'Avanzas con pasión. Aventura, riesgo bien calculado, energía que mueve. Tu impulso enciende.', inv: 'Imprudencia. Prometer y no cumplir. Pasiones que se apagan rápido.', desc: 'Habla del que se lanza con todo. Útil para empezar cosas, peligroso si no calcula.' },
    reina:     { name: 'Reina de Varas', kw: ['carisma', 'magnetismo', 'fuerza serena'], pos: 'Carisma sostenido. Tu presencia ilumina. Lideras siendo tú, no aparentando.', inv: 'Celos. Dominancia. Fuego que consume al de al lado. Autoexigencia agotadora.', desc: 'Es la carta del fuego sostenido — el carisma del que es genuino. Atrae sin esfuerzo.' },
    rey:       { name: 'Rey de Varas', kw: ['liderazgo', 'visión', 'inspirar'], pos: 'Liderazgo carismático, visión audaz, capacidad de inspirar a otros. Eres motor más que jefe.', inv: 'Ego. Autoritarismo. Líder que se cree imprescindible. Impaciencia.', desc: 'Habla del visionario que actúa, no solo sueña. Te muestra cómo el carisma se convierte en logro real.' }
  },
  pentaculos: {
    aprendiz:  { name: 'Aprendiz de Pentáculos', kw: ['oportunidad', 'estudio', 'paciencia'], pos: 'Llega una oportunidad concreta. Estúdiala, cultívala. La paciencia inicial construye fortalezas.', inv: 'Pereza. Oportunidad ignorada. Falta de compromiso con lo material.', desc: 'Es la carta del que empieza con humildad, sabiendo que las cosas buenas tardan. Funciona si hay constancia.' },
    caballero: { name: 'Caballero de Pentáculos', kw: ['constancia', 'compromiso', 'paso a paso'], pos: 'Avanzas paso a paso, sin prisa pero sin pausa. Tu constancia es tu mayor virtud.', inv: 'Estancamiento. Rutina excesiva. Lentitud que paraliza.', desc: 'Habla del trabajador silencioso, del que suma día a día. Útil cuando hay que sostener algo en el tiempo.' },
    reina:     { name: 'Reina de Pentáculos', kw: ['cuidado', 'abundancia', 'pragmatismo'], pos: 'Abundancia que se comparte. Cuidas tu cuerpo, tu casa, tu trabajo con calidez práctica.', inv: 'Materialismo. Descuido del propio cuerpo. Dar hasta vaciarse.', desc: 'Es la carta de la persona que cuida lo material como un acto de amor. Realista, generosa, pies en la tierra.' },
    rey:       { name: 'Rey de Pentáculos', kw: ['prosperidad', 'autoridad terrenal', 'éxito sólido'], pos: 'Has construido un reino con manos firmes. Sabes administrar lo tuyo. Prosperidad sólida y sin alardes.', inv: 'Codicia. Identidad atada al éxito. Miedo a perder estatus.', desc: 'Habla del que ha conseguido estabilidad material y sabe sostenerla con sabiduría. Lo que sabe se traduce en bienestar concreto.' }
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
      const energy = NUMBER_ENERGY[suitData.element]?.[n] || `${suitData.name} en su número ${n}.`;
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
        emotionalEnergy: energy,
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
        emotionalEnergy: COURT_ENERGY[court],
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
