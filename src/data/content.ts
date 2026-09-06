import type {
  Article,
  Author,
  Category,
  ChartPoint,
  Dataset,
  Experiment,
  Publication,
  SoftwareProject,
} from "../types";

/* ------------------------------------------------------------------ */
/* Imágenes (dirección artística: navy profundo + cyan/teal)           */
/* ------------------------------------------------------------------ */
const IMG = {
  proteina:
    "https://image.qwenlm.ai/generated-images/153b14d3-31f3-4f8c-91c5-006718061f4b/_result.png",
  ia: "https://image.qwenlm.ai/generated-images/90a8fd4a-1c9c-45fb-be64-f6177c8d3742/_result.png",
  genoma:
    "https://image.qwenlm.ai/generated-images/ac36ddd0-ff9b-4674-9cab-ac7565f90cf6/_result.png",
  microbios:
    "https://image.qwenlm.ai/generated-images/39c73f87-bf47-4571-a4c0-26cc79696a36/_result.png",
  crispr:
    "https://image.qwenlm.ai/generated-images/492b6015-eaaf-4632-b5d9-819710697dce/_result.png",
  ecologia:
    "https://image.qwenlm.ai/generated-images/729da623-61f7-44a6-9143-2deeab215d33/_result.png",
  datos:
    "https://image.qwenlm.ai/generated-images/d09a0121-c8c6-4b36-ab90-9faaf26ab323/_result.png",
  fitopatologia:
    "https://image.qwenlm.ai/generated-images/dfd429a8-b959-45ba-92b9-cc95a9896f41/_result.png",
  laboratorio:
    "https://image.qwenlm.ai/generated-images/47d6d106-0da6-44cc-8fad-d946b3817df0/_result.png",
};

/* ------------------------------------------------------------------ */
/* Categorías                                                          */
/* ------------------------------------------------------------------ */
export const categories: Category[] = [
  {
    slug: "biotecnologia",
    name: "Biotecnología",
    tagline: "Ciencia viva, explicada sin jerga.",
    description:
      "CRISPR, fermentación, biofármacos y microbios útiles contados de forma viral: qué es, por qué importa y dónde probarlo en casa o en el lab.",
    icon: "helix",
    tint: "bio",
  },
  {
    slug: "tendencias",
    name: "Tendencias",
    tagline: "Qué se mueve en bio esta semana.",
    description:
      "Noticias cortas 4 min sobre genómica, IA bio y salud: hook, qué pasó, por qué importa y qué sigue. Curado 3×/semana por el agente BiolNexo.",
    icon: "chart",
    tint: "primary",
  },
  {
    slug: "experimentos-caseros",
    name: "Experimentos caseros",
    tagline: "Hazlo tú, seguro y visual.",
    description:
      "Protocolos friendly para casa/aula o lab: materiales caseros, pasos ≤6, video YouTube y ficha de seguridad. De la fresa al microscopio.",
    icon: "flask",
    tint: "aqua",
  },
  {
    slug: "software-salud",
    name: "Software & Salud",
    tagline: "Apps y webs que miden tu salud.",
    description:
      "Programas propios de BiolNexo: calculadoras, visores y webs de ciencias. Con captura, video y links de descarga/repositorio.",
    icon: "terminal",
    tint: "primary",
  },
];

/* ------------------------------------------------------------------ */
/* Autores                                                             */
/* ------------------------------------------------------------------ */
export const authors: Author[] = [
  { id: "elena", name: "Dra. Elena Vargas", role: "Editora de Genómica", area: "Genómica computacional", initials: "EV" },
  { id: "mateo", name: "Dr. Mateo Herrera", role: "Editor de Microbiología", area: "Microbiología aplicada", initials: "MH" },
  { id: "sofia", name: "Ing. Sofía Delgado", role: "Editora de Datos", area: "Ciencia de datos científicos", initials: "SD" },
  { id: "andres", name: "Dr. Andrés Quintero", role: "Editor de Ecología", area: "Ecología cuantitativa", initials: "AQ" },
  { id: "lucia", name: "Dra. Lucía Ferrer", role: "Editora de Biología Molecular", area: "Biología molecular", initials: "LF" },
];

export const getAuthor = (id: string): Author =>
  authors.find((a) => a.id === id) ?? authors[0];

/* ------------------------------------------------------------------ */
/* Artículos                                                           */
/* ------------------------------------------------------------------ */
export const articles: Article[] = [
  {
    slug: "proteinas-estructura",
    title: "Una nueva mirada al funcionamiento de las proteínas",
    category: "biotecnologia",
    excerpt:
      "La función de una proteína no vive solo en su secuencia: emerge de su forma tridimensional y de su movimiento. Así es como la biología estructural moderna está aprendiendo a verlas en acción.",
    date: "2026-01-18",
    readMin: 9,
    authorId: "lucia",
    image: IMG.proteina,
    imageCaption:
      "Visualización de una estructura proteica. La forma tridimensional determina la función molecular.",
    tags: ["proteínas", "estructura", "criomicroscopía", "plegamiento"],
    tier: "Divulgación científica",
    featured: true,
    source: {
      journal: "BiolNexo Divulgación",
      year: 2026,
      doi: "10.5281/biolnexo.demo.0012",
      url: "https://www.rcsb.org",
      license: "CC BY-NC 4.0",
      type: "Artículo de divulgación basado en literatura revisada por pares",
    },
    body: [
      {
        type: "p",
        text: "Cada célula produce miles de proteínas distintas, y cada una de ellas es una máquina molecular con un trabajo específico: catalizar reacciones, transportar señales, sostener estructuras o defender al organismo. Durante décadas, conocer la secuencia de aminoácidos fue el punto de partida; hoy sabemos que la verdadera historia comienza cuando esa cadena se pliega.",
      },
      {
        type: "h2",
        text: "De la secuencia a la forma tridimensional",
      },
      {
        type: "p",
        text: "El plegamiento no es un accidente: está gobernado por la química de los aminoácidos. Las regiones hidrofóbicas tienden a esconderse en el interior, los puentes de hidrógeno estabilizan hélices y láminas, y los puentes disulfuro actúan como grapas moleculares. El resultado es una estructura única que, en la mayoría de los casos, es la termodinámicamente más estable.",
      },
      {
        type: "quote",
        text: "La secuencia es el plano; la estructura es la máquina funcionando. Entender una proteína exige ver ambas cosas a la vez.",
      },
      {
        type: "h2",
        text: "Observar proteínas en movimiento",
      },
      {
        type: "p",
        text: "La criomicroscopía electrónica (cryo-EM), distinguida con el Nobel de Química en 2017, permitió resolver estructuras de complejos grandes sin necesidad de cristalizarlos. Combinada con la difracción de rayos X y la resonancia magnética nuclear, forma un trípode metodológico que ha multiplicado las estructuras disponibles en el Protein Data Bank.",
      },
      {
        type: "list",
        items: [
          "Cryo-EM: ideal para complejos macromoleculares grandes y estados conformacionales.",
          "Rayos X: alta resolución para proteínas cristalizables.",
          "RMN: dinámica de proteínas pequeñas en solución.",
          "Predicción computacional: modelos como AlphaFold ampliaron el alcance a proteomas completos.",
        ],
      },
      {
        type: "h2",
        text: "Por qué importa más allá del laboratorio",
      },
      {
        type: "p",
        text: "Entender la estructura es entender la función, y entender la función abre puertas: diseñar enzimas más eficientes, comprender mutaciones asociadas a enfermedades o identificar bolsillos donde un fármaco puede unirse. La biología estructural dejó de ser una especialidad de nicho para convertirse en infraestructura del descubrimiento biomédico.",
      },
      {
        type: "note",
        text: "Este artículo es contenido de demostración de BiolNexo: resume conocimiento establecido y no reporta resultados nuevos.",
      },
    ],
    references: [
      { text: "Alberts, B. et al. Molecular Biology of the Cell. 6.ª ed. Garland Science, 2015." },
      { text: "Protein Data Bank (RCSB). rcsb.org — repositorio mundial de estructuras 3D." , url: "https://www.rcsb.org" },
      { text: "The Nobel Prize in Chemistry 2017: cryo-EM de biomoléculas. nobelprize.org", url: "https://www.nobelprize.org" },
    ],
  },
  {
    slug: "ia-transforma-biologia",
    title: "Cómo la inteligencia artificial está transformando la biología",
    category: "tendencias",
    excerpt:
      "Del plegamiento de proteínas al diseño de experimentos, los modelos de aprendizaje profundo se están convirtiendo en instrumentos estándar del laboratorio moderno. Esto es lo que ya pueden hacer — y lo que todavía no.",
    date: "2026-01-10",
    readMin: 11,
    authorId: "elena",
    image: IMG.ia,
    imageCaption:
      "Representación conceptual de una red neuronal integrada con una doble hélice de ADN.",
    tags: ["IA", "deep learning", "AlphaFold", "descubrimiento"],
    tier: "Interpretación BiolNexo",
    featured: true,
    source: {
      journal: "BiolNexo Análisis",
      year: 2026,
      doi: "10.5281/biolnexo.demo.0021",
      url: "https://alphafold.ebi.ac.uk",
      license: "CC BY-NC 4.0",
      type: "Análisis editorial con interpretación propia",
    },
    body: [
      {
        type: "p",
        text: "Durante cincuenta años, predecir la estructura de una proteína a partir de su secuencia fue uno de los grandes problemas abiertos de la biología. En 2020, un sistema de aprendizaje profundo logró resoluciones comparables a las experimentales en la evaluación CASP14. Desde entonces, la IA pasó de ser una curiosidad computacional a una herramienta que aparece en protocolos, publicaciones y pipelines de descubrimiento.",
      },
      {
        type: "h2",
        text: "Qué hacen bien los modelos actuales",
      },
      {
        type: "list",
        items: [
          "Predecir estructuras de proteínas individuales con alta confianza en regiones conservadas.",
          "Clasificar imágenes microscópicas y de tejidos con precisión comparable a especialistas.",
          "Detectar variantes patogénicas candidatas en grandes cohortes genómicas.",
          "Generar hipótesis de moléculas candidatas para cribado virtual.",
        ],
      },
      {
        type: "h2",
        text: "Dónde están los límites reales",
      },
      {
        type: "p",
        text: "Un modelo no reemplaza al método científico: lo acelera en etapas específicas. Las predicciones de estructura para complejos dinámicos, regiones intrínsecamente desordenadas o estados raros siguen siendo difíciles. Y toda predicción necesita validación experimental. La regla práctica que usamos en BiolNexo: la IA propone, el experimento dispone.",
      },
      {
        type: "quote",
        text: "La IA no está reemplazando al método científico: está comprimiendo el ciclo entre hipótesis y experimento.",
      },
      {
        type: "h2",
        text: "Lo que esto significa para la investigación",
      },
      {
        type: "p",
        text: "El cambio más profundo no es técnico sino cultural: los equipos de biología incorporan perfiles computacionales, los artículos incluyen modelos como evidencia intermedia y los repositorios de datos se vuelven tan importantes como los biobancos. La alfabetización en datos dejó de ser opcional para quien hace biología.",
      },
    ],
    references: [
      { text: "Jumper, J. et al. (2021). Highly accurate protein structure prediction with AlphaFold. Nature 596.", url: "https://www.nature.com" },
      { text: "AlphaFold Protein Structure Database. alphafold.ebi.ac.uk", url: "https://alphafold.ebi.ac.uk" },
      { text: "CASP — Critical Assessment of protein Structure Prediction. predictioncenter.org", url: "https://predictioncenter.org" },
    ],
  },
  {
    slug: "lenguaje-genoma",
    title: "El lenguaje oculto de nuestro genoma",
    category: "biotecnologia",
    excerpt:
      "Solo una fracción del genoma humano codifica proteínas. El resto está lejos de ser 'ADN basura': regula, organiza y orquesta cuándo y dónde se expresa cada gen. Aprender a leerlo es el gran reto de la genómica.",
    date: "2025-12-28",
    readMin: 10,
    authorId: "elena",
    image: IMG.genoma,
    imageCaption:
      "Abstracción de secuencias genómicas: la información biológica como un flujo de datos legible.",
    tags: ["genoma", "regulación", "ENCODE", "secuenciación"],
    tier: "Divulgación científica",
    featured: true,
    source: {
      journal: "BiolNexo Divulgación",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0008",
      url: "https://www.ncbi.nlm.nih.gov",
      license: "CC BY-NC 4.0",
      type: "Artículo de divulgación basado en literatura revisada por pares",
    },
    body: [
      {
        type: "p",
        text: "Si el genoma humano se escribiera con las letras del alfabeto, ocuparía alrededor de tres mil millones de caracteres. De esa biblioteca, los exones que codifican proteínas representan apenas entre el 1 % y el 2 %. ¿Y el resto? Durante años se le llamó 'ADN basura'. El consorcio ENCODE y otros proyectos mostraron que gran parte de ese territorio tiene actividad bioquímica: promotores, potenciadores, ARN no codificantes y señales de organización tridimensional.",
      },
      {
        type: "sequence",
        label: "Motivo ilustrativo · promotor TATA-box (referencia clásica)",
        text: "5′-T A T A A A G-3′",
      },
      {
        type: "h2",
        text: "Regulación: el sistema operativo de la célula",
      },
      {
        type: "p",
        text: "Todas las células de un organismo comparten el mismo genoma; lo que distingue a una neurona de una célula hepática es qué genes se expresan y cuándo. Los elementos reguladores actúan como interruptores: proteínas que se unen a secuencias específicas y modulan la transcripción. Mutar un potenciador puede tener tanto efecto como mutar el propio gen.",
      },
      {
        type: "h2",
        text: "Leer el genoma con herramientas computacionales",
      },
      {
        type: "p",
        text: "Identificar estos elementos a mano es imposible: se necesitan alineamientos contra genomas de referencia, llamadas de variantes, predicción de motivos y modelos de expresión. Por eso la bioinformática no es un apoyo de la genómica moderna: es su método central. Cada genoma secuenciado es, ante todo, un problema de datos.",
      },
      {
        type: "list",
        items: [
          "Alineamiento contra referencia (GRCh38) con herramientas como BWA o minimap2.",
          "Llamada de variantes (SNVs, indels, estructurales) y su anotación funcional.",
          "Análisis de accesibilidad de la cromatina (ATAC-seq) para localizar regiones activas.",
          "Modelos predictivos de expresión entrenados con datos públicos.",
        ],
      },
      {
        type: "quote",
        text: "El genoma no es un plano estático: es un programa que se ejecuta de forma distinta en cada célula.",
      },
    ],
    references: [
      { text: "ENCODE Project Consortium. An integrated encyclopedia of DNA elements in the human genome. Nature 489 (2012).", url: "https://www.nature.com" },
      { text: "NCBI — National Center for Biotechnology Information. ncbi.nlm.nih.gov", url: "https://www.ncbi.nlm.nih.gov" },
      { text: "Genome Reference Consortium: ensamblaje GRCh38. genome.ucsc.edu", url: "https://genome.ucsc.edu" },
    ],
  },
  {
    slug: "microorganismos-biotecnologia",
    title: "Microorganismos que podrían cambiar la biotecnología",
    category: "biotecnologia",
    excerpt:
      "Bacterias que degradan plásticos, levaduras diseñadas y consorcios microbianos que producen compuestos de alto valor: la microbiología industrial vive un momento de expansión impulsada por la ingeniería metabólica.",
    date: "2025-12-14",
    readMin: 8,
    authorId: "mateo",
    image: IMG.microbios,
    imageCaption:
      "Micrografías de microorganismos en fluorescencia: la diversidad microbiana como plataforma productiva.",
    tags: ["microbiología", "fermentación", "bioplásticos", "metabolismo"],
    tier: "Divulgación científica",
    featured: true,
    source: {
      journal: "BiolNexo Divulgación",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0034",
      url: "https://www.uniprot.org",
      license: "CC BY-NC 4.0",
      type: "Artículo de divulgación basado en literatura revisada por pares",
    },
    body: [
      {
        type: "p",
        text: "Antes de la biología molecular ya existía la biotecnología: fermentar pan, cerveza y quesos es domesticar microorganismos desde hace milenios. Lo que cambió es la precisión. Hoy podemos rediseñar rutas metabólicas completas para que una bacteria produzca insulina, bioplásticos o aromas que antes dependían de cultivos extensivos.",
      },
      {
        type: "h2",
        text: "Células como fábricas programables",
      },
      {
        type: "p",
        text: "La ingeniería metabólica trata a la célula como un sistema de producción: se identifican las rutas que generan el compuesto deseado, se amplifican las enzimas limitantes y se silencian las rutas competitivas. Microorganismos modelo como Escherichia coli y Saccharomyces cerevisiae son los caballos de batalla por su genética conocida y su crecimiento rápido.",
      },
      {
        type: "list",
        items: [
          "PHB y otros polihidroxialcanoatos: polímeros biodegradables acumulados por bacterias.",
          "Levaduras productoras de precursores de fármacos mediante fermentación de precisión.",
          "Consorcios microbianos para biorremediación de suelos y aguas.",
          "Enzimas termoestables descubiertas en ambientes extremos para procesos industriales.",
        ],
      },
      {
        type: "h2",
        text: "El cuello de botella no es biológico: es de escalado",
      },
      {
        type: "p",
        text: "Muchas rutas funcionan en matraz y fallan en biorreactor: la transferencia de oxígeno, el costo del sustrato y la separación del producto definen la viabilidad económica. Por eso la biotecnología moderna es inseparable de la ingeniería de procesos: el organismo y el reactor se diseñan juntos.",
      },
    ],
    references: [
      { text: "Nielsen, J. & Keasling, J. D. Engineering cellular metabolism. Cell 164 (2016).", url: "https://www.cell.com" },
      { text: "UniProt — recurso de secuencias y función de proteínas. uniprot.org", url: "https://www.uniprot.org" },
      { text: "OECD. The Bioeconomy to 2030: designing a policy agenda.", url: "https://www.oecd.org" },
    ],
  },
  {
    slug: "crispr-precision",
    title: "Edición genética: precisión, promesas y límites",
    category: "biotecnologia",
    excerpt:
      "CRISPR-Cas9 convirtió la edición del genoma en una técnica accesible para miles de laboratorios. Una década después, toca distinguir entre lo que la herramienta ya permite, lo que promete y lo que la biología aún no deja resolver.",
    date: "2025-11-30",
    readMin: 12,
    authorId: "lucia",
    image: IMG.crispr,
    imageCaption:
      "Concepto molecular de edición genética: el complejo proteína-ARN cortando una doble hélice.",
    tags: ["CRISPR", "edición genética", "genómica", "terapia"],
    tier: "Interpretación BiolNexo",
    source: {
      journal: "BiolNexo Análisis",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0041",
      url: "https://www.nobelprize.org",
      license: "CC BY-NC 4.0",
      type: "Análisis editorial con interpretación propia",
    },
    body: [
      {
        type: "p",
        text: "CRISPR no se inventó: se descubrió. Las bacterias usan estos sistemas como memoria inmune frente a virus, y la ciencia adaptó ese mecanismo para cortar el ADN en lugares elegidos. El Nobel de Química 2020 a Emmanuelle Charpentier y Jennifer Doudna reconoció una tecnología que en menos de una década reconfiguró la genética experimental.",
      },
      {
        type: "h2",
        text: "El kit molecular, pieza por pieza",
      },
      {
        type: "table",
        header: ["Componente", "Función", "Analogía"],
        rows: [
          ["ARN guía (sgRNA)", "Dirige el complejo a la secuencia objetivo", "Dirección postal"],
          ["Nucleasa Cas", "Corta las dos hebras del ADN", "Tijera molecular"],
          ["Reparación celular", "NHEJ o HDR reescriben la secuencia", "Corrector ortográfico"],
          ["Plantilla de ADN", "Modela la edición en HDR", "Texto de referencia"],
        ],
      },
      {
        type: "h2",
        text: "Qué ya es realidad y qué sigue en camino",
      },
      {
        type: "p",
        text: "Las primeras terapias basadas en CRISPR recibieron aprobaciones regulatorias para enfermedades de la sangre como la anemia de células falciformes. En agricultura, las variedades editadas avanzan con marcos regulatorios propios en varios países. En paralelo, los editores de bases y los editores primarios buscan corregir letras individuales sin cortar la doble hebra.",
      },
      {
        type: "list",
        items: [
          "Efectos fuera de objetivo: cortes en lugares parecidos al sitio elegido.",
          "Eficiencia de entrega: llevar los componentes a las células correctas.",
          "Mosaicismos: células editadas y no editadas en un mismo organismo.",
          "Ética y gobernanza: líneas germinales y límites del mejoramiento humano.",
        ],
      },
      {
        type: "quote",
        text: "Editar un genoma es fácil; editarlo solo donde hace falta, de forma segura y verificable, sigue siendo el verdadero desafío.",
      },
    ],
    references: [
      { text: "Jinek, M. et al. (2012). A programmable dual-RNA-guided DNA endonuclease. Science 337.", url: "https://www.science.org" },
      { text: "The Nobel Prize in Chemistry 2020. nobelprize.org", url: "https://www.nobelprize.org" },
      { text: "Komor, A. C. et al. (2016). Programmable editing of a target base. Nature 533.", url: "https://www.nature.com" },
    ],
  },
  {
    slug: "bosques-sensores-datos",
    title: "Escuchar al bosque: sensores y datos en ecología",
    category: "tendencias",
    excerpt:
      "Cámaras trampa, grabadoras acústicas, drones e imágenes satelitales están generando flujos continuos de datos sobre biodiversidad. La ecología se convierte, cada vez más, en una ciencia de observación distribuida.",
    date: "2025-11-16",
    readMin: 7,
    authorId: "andres",
    image: IMG.ecologia,
    imageCaption:
      "Dosel forestal con capas de análisis superpuestas: la biodiversidad medida como una red de datos.",
    tags: ["ecología", "sensores", "biodiversidad", "monitoreo"],
    tier: "Divulgación científica",
    source: {
      journal: "BiolNexo Divulgación",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0052",
      url: "https://www.gbif.org",
      license: "CC BY-NC 4.0",
      type: "Artículo de divulgación basado en literatura revisada por pares",
    },
    body: [
      {
        type: "p",
        text: "La ecología clásica dependía de libretas de campo y transectos recorridos a pie. Hoy un solo proyecto puede combinar registros de presencia de GBIF, audio continuo de aves e insectos, series temporales satelitales y cámaras que se activan con movimiento. El resultado es una imagen del ecosistema que se actualiza en tiempo casi real.",
      },
      {
        type: "h2",
        text: "La biodiversidad como señal",
      },
      {
        type: "p",
        text: "Los índices acústicos permiten estimar la actividad de un bosque sin identificar cada especie; las curvas de ocupación separan 'no detectada' de 'ausente'; los modelos de distribución de especies proyectan hábitats potenciales bajo escenarios climáticos. Cada técnica convierte observaciones crudas en evidencia comparable.",
      },
      {
        type: "list",
        items: [
          "Cámaras trampa para mamíferos medianos y grandes.",
          "Ecoacústica: grabadoras autónomas e índices de diversidad sonora.",
          "Teledetección: NDVI, altura de dosel y detección de cambios.",
          "Ciencia ciudadana: plataformas de registro que multiplican la cobertura.",
        ],
      },
      {
        type: "quote",
        text: "No podemos conservar lo que no medimos: los datos son la primera línea de defensa de la biodiversidad.",
      },
    ],
    references: [
      { text: "GBIF — Global Biodiversity Information Facility. gbif.org", url: "https://www.gbif.org" },
      { text: "Sugai, J. L. M. et al. (2019). Terrestrial passive acoustic monitoring. BioScience 69.", url: "https://academic.oup.com/bioscience" },
      { text: "NASA Earth Observations: índices de vegetación. earthdata.nasa.gov", url: "https://earthdata.nasa.gov" },
    ],
  },
  {
    slug: "economia-genoma",
    title: "De 100 millones a 200 dólares: la economía del genoma",
    category: "tendencias",
    excerpt:
      "Secuenciar un genoma humano costó cerca de 100 millones de dólares en 2001; hoy ronda los cientos. Esta curva, más abrupta que la Ley de Moore, explica por qué la genómica se volvió una ciencia de datos masivos.",
    date: "2025-10-27",
    readMin: 9,
    authorId: "sofia",
    image: IMG.datos,
    imageCaption:
      "Abstracción de visualización de datos: series temporales y magnitudes en un espacio analítico.",
    tags: ["genómica", "costos", "datos", "secuenciación"],
    tier: "Interpretación BiolNexo",
    source: {
      journal: "BiolNexo Análisis",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0063",
      url: "https://www.genome.gov",
      license: "CC BY-NC 4.0",
      type: "Análisis editorial con interpretación propia",
    },
    body: [
      {
        type: "p",
        text: "El Proyecto Genoma Humano tomó más de una década y un presupuesto monumental. El siguiente punto de quiebre llegó con la secuenciación de nueva generación (NGS): en lugar de leer fragmento por fragmento, millones de lecturas ocurren en paralelo. El efecto sobre el costo por megabase fue el más dramático registrado por el NHGRI en su seguimiento histórico.",
      },
      {
        type: "h2",
        text: "Una curva que reconfiguró las preguntas posibles",
      },
      {
        type: "p",
        text: "Cuando secuenciar era caro, la ciencia preguntaba por un gen a la vez. Cuando es barato, las preguntas cambian de escala: estudios de asociación con cientos de miles de individuos, metagenómica de ecosistemas completos, vigilancia genómica de patógenos en tiempo real. El costo no solo abarató lo mismo: habilitó experimentos que antes no existían.",
      },
      {
        type: "table",
        header: ["Año", "Costo aproximado por genoma", "Tecnología dominante"],
        rows: [
          ["2001", "≈ 95 millones USD", "Sanger"],
          ["2007", "≈ 8 millones USD", "Primeras NGS"],
          ["2015", "≈ 1.500 USD", "NGS de alto rendimiento"],
          ["2023", "≈ 200–600 USD", "NGS + lecturas largas"],
        ],
      },
      {
        type: "note",
        text: "Cifras de referencia ilustrativas basadas en la serie pública de costos de secuenciación del NHGRI; los valores exactos varían por tecnología y escala.",
      },
      {
        type: "quote",
        text: "Cada orden de magnitud que cae el costo de secuenciar sube un orden de magnitud la ambición de las preguntas.",
      },
    ],
    references: [
      { text: "NHGRI — DNA Sequencing Costs: Data. genome.gov", url: "https://www.genome.gov" },
      { text: " Wetterstrand, K. A. DNA Sequencing Costs: Data from the NHGRI Genome Sequencing Program.", url: "https://www.genome.gov" },
      { text: "Reuter, J. A. et al. (2015). Integrative clinical genomics of advanced prostate cancer. Cell 161.", url: "https://www.cell.com" },
    ],
  },
  {
    slug: "vision-artificial-cultivos",
    title: "Diagnosticar cultivos con visión artificial",
    category: "software-salud",
    excerpt:
      "Una hoja con manchas puede fotografiarse, enviarse y clasificarse en segundos. La fitopatología digital combina redes convolucionales, datos de campo y conocimiento agronómico para detectar enfermedades antes de que se dispersen.",
    date: "2025-10-12",
    readMin: 8,
    authorId: "sofia",
    image: IMG.fitopatologia,
    imageCaption:
      "Hoja bajo análisis digital: puntos de detección sobre tejido vegetal escaneado.",
    tags: ["fitopatología", "visión artificial", "agricultura", "sensores"],
    tier: "Interpretación BiolNexo",
    source: {
      journal: "BiolNexo Análisis",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0071",
      url: "https://www.fao.org",
      license: "CC BY-NC 4.0",
      type: "Análisis editorial con interpretación propia",
    },
    body: [
      {
        type: "p",
        text: "Las enfermedades de cultivos causan pérdidas anuales significativas en la producción global de alimentos, según estimaciones de la FAO. Gran parte del daño ocurre porque el diagnóstico llega tarde: cuando la mancha es visible a simple vista, el patógeno ya se dispersó. La visión artificial acorta esa ventana.",
      },
      {
        type: "h2",
        text: "De la foto al diagnóstico",
      },
      {
        type: "p",
        text: "Los modelos convolucionales aprenden a reconocer patrones de síntomas —necrosis, clorosis, esporulación— a partir de miles de imágenes etiquetadas por especialistas. En condiciones controladas superan el 90 % de precisión en conjuntos de datos de referencia; en campo abierto, la luz, el ángulo y las variedades locales obligan a un trabajo de curaduría constante.",
      },
      {
        type: "list",
        items: [
          "Conjuntos de imágenes públicas de hojas con y sin síntomas.",
          "Modelos ligeros que corren en el teléfono del productor.",
          "Integración con datos climáticos para estimar riesgo de infección.",
          "Alertas tempranas coordinadas entre regiones productoras.",
        ],
      },
      {
        type: "quote",
        text: "El modelo clasifica la mancha; el fitopatólogo decide qué hacer con ella. La tecnología es triaje, no reemplazo.",
      },
    ],
    references: [
      { text: "FAO — enfermedades transfronterizas de plantas. fao.org", url: "https://www.fao.org" },
      { text: "Mohanty, S. P. et al. (2016). Using deep learning for image-based plant disease detection. Frontiers in Plant Science 7.", url: "https://www.frontiersin.org" },
      { text: "PlantVillage — diagnóstico de cultivos. plantvillage.psu.edu", url: "https://plantvillage.psu.edu" },
    ],
  },
  {
    slug: "nueva-microscopia",
    title: "Ver lo invisible: la nueva era de la microscopía",
    category: "software-salud",
    excerpt:
      "La superresolución rompió el límite de difracción, la microscopía de hoja de luz fotografía embriones completos en desarrollo y la cryo-EM revela complejos moleculares. Ver mejor sigue siendo la forma más antigua de descubrir.",
    date: "2025-09-28",
    readMin: 10,
    authorId: "mateo",
    image: IMG.laboratorio,
    imageCaption:
      "Trabajo de laboratorio con instrumental de precisión: la observación como tecnología.",
    tags: ["microscopía", "imagen", "instrumentación", "biología celular"],
    tier: "Divulgación científica",
    source: {
      journal: "BiolNexo Divulgación",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0084",
      url: "https://www.nobelprize.org",
      license: "CC BY-NC 4.0",
      type: "Artículo de divulgación basado en literatura revisada por pares",
    },
    body: [
      {
        type: "p",
        text: "Desde los microscopios de Leeuwenhoek en el siglo XVII, cada salto en resolución abrió una capa nueva de la biología: células, organelos, moléculas individuales. En 2014, el Nobel de Química premió la microscopía de superresolución, que permitió observar estructuras por debajo del límite de difracción de la luz.",
      },
      {
        type: "h2",
        text: "Tres revoluciones recientes",
      },
      {
        type: "list",
        items: [
          "STED y PALM/STORM: resolución nanométrica con luz visible.",
          "Microscopía de hoja de luz: volúmenes vivos completos a alta velocidad y baja fototoxicidad.",
          "Cryo-EM y tomografía: estructuras moleculares y celulares sin cristalización.",
          "Expansión: aumentar físicamente la muestra para resolver más con óptica convencional.",
        ],
      },
      {
        type: "h2",
        text: "La imagen también es un dato",
      },
      {
        type: "p",
        text: "Un experimento moderno de imagen produce terabytes: series temporales 3D, múltiples canales, miles de células. Sin pipelines de segmentación, registro y análisis cuantitativo, la fotografía es solo una ilustración. La microscopía del siglo XXI se decide tanto en el software como en el objetivo.",
      },
      {
        type: "quote",
        text: "La biología avanza al ritmo de sus instrumentos: cada nueva forma de ver es una nueva forma de preguntar.",
      },
    ],
    references: [
      { text: "The Nobel Prize in Chemistry 2014: microscopía de fluorescencia de superresolución. nobelprize.org", url: "https://www.nobelprize.org" },
      { text: "The Nobel Prize in Chemistry 2017: cryo-EM. nobelprize.org", url: "https://www.nobelprize.org" },
      { text: "Chen, F. et al. (2015). Expansion microscopy. Science 347.", url: "https://www.science.org" },
    ],
  },
  {
    slug: "arboles-filogeneticos",
    title: "Árboles filogenéticos: la genealogía de la vida",
    category: "biotecnologia",
    excerpt:
      "Un árbol filogenético es una hipótesis sobre quién desciende de quién. Construirlo exige alinear secuencias, elegir modelos evolutivos y cuantificar la incertidumbre: la estadística detrás del dibujo.",
    date: "2025-09-14",
    readMin: 9,
    authorId: "andres",
    image: IMG.ecologia,
    imageCaption:
      "Representación de relaciones evolutivas: ramas que conectan linajes a través del tiempo.",
    tags: ["filogenia", "evolución", "secuencias", "modelos"],
    tier: "Divulgación científica",
    source: {
      journal: "BiolNexo Divulgación",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0090",
      url: "https://www.ebi.ac.uk",
      license: "CC BY-NC 4.0",
      type: "Artículo de divulgación basado en literatura revisada por pares",
    },
    body: [
      {
        type: "p",
        text: "Cuando Darwin dibujó su famoso 'I think', estaba proponiendo que toda la vida comparte ancestros comunes y que esas relaciones pueden representarse como un árbol. Hoy ese árbol se construye con datos: secuencias de ADN y proteínas comparadas posición por posición.",
      },
      {
        type: "h2",
        text: "Del alineamiento a la topología",
      },
      {
        type: "p",
        text: "El primer paso es alinear las secuencias para comparar posiciones homólogas. Luego se elige un modelo de sustitución —cómo cambian las letras con el tiempo— y se busca la topología que mejor explica los datos, por máxima verosimilitud o inferencia bayesiana. El resultado nunca es 'el árbol', sino el árbol mejor soportado junto con medidas de confianza por rama.",
      },
      {
        type: "list",
        items: [
          "Alineamiento múltiple: MUSCLE, MAFFT o Clustal Omega.",
          "Modelos de sustitución: Jukes-Cantor, GTR y sus variantes.",
          "Inferencia: máxima parsimonia, máxima verosimilitud, bayesiana.",
          "Soporte: bootstrap y probabilidades posteriores por nodo.",
        ],
      },
      {
        type: "quote",
        text: "Un árbol sin valores de soporte es una ilustración; con ellos, es una hipótesis científica.",
      },
      {
        type: "h2",
        text: "Para qué sirve en la práctica",
      },
      {
        type: "p",
        text: "La filogenia no es solo sistemática: rastrea brotes epidémicos, identifica el origen de especies en productos pesqueros, guía el descubrimiento de fármacos en grupos emparentados y ordena la biodiversidad en bases de datos como las del EBI. Es, literalmente, el sistema de coordenadas de la biología comparada.",
      },
    ],
    references: [
      { text: "Felsenstein, J. Inferring Phylogenies. Sinauer Associates, 2004." },
      { text: "EMBL-EBI — herramientas de filogenia y alineamiento. ebi.ac.uk", url: "https://www.ebi.ac.uk" },
      { text: "Kumar, S. et al. MEGA: Molecular Evolutionary Genetics Analysis. Molecular Biology and Evolution (2018).", url: "https://www.megasoftware.net" },
    ],
  },
  {
    slug: "pcr-explicada",
    title: "PCR: la fotocopiadora molecular, explicada",
    category: "experimentos-caseros",
    excerpt:
      "La reacción en cadena de la polimerasa convierte trazas de ADN en millones de copias en un par de horas. Es la técnica detrás de diagnósticos, paternidades, forense y de casi toda la biología molecular moderna.",
    date: "2025-08-31",
    readMin: 6,
    authorId: "lucia",
    image: IMG.laboratorio,
    imageCaption:
      "Preparación de muestras moleculares en laboratorio: cada tubo es una reacción programada.",
    tags: ["PCR", "ADN", "diagnóstico", "técnicas"],
    tier: "Divulgación científica",
    source: {
      journal: "BiolNexo Divulgación",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0096",
      url: "https://www.nobelprize.org",
      license: "CC BY-NC 4.0",
      type: "Artículo de divulgación basado en literatura revisada por pares",
    },
    body: [
      {
        type: "p",
        text: "Imagina tener una única copia de un párrafo y necesitar un millón para poder leerlo. La PCR hace exactamente eso con el ADN: copia una región específica de forma exponencial. Por esa invención, Kary Mullis recibió el Nobel de Química en 1993.",
      },
      {
        type: "h2",
        text: "Tres pasos que se repiten",
      },
      {
        type: "list",
        items: [
          "Desnaturalización (~95 °C): la doble hélice se separa en dos hebras.",
          "Alineamiento (~50–65 °C): los cebadores se unen a sus secuencias complementarias.",
          "Extensión (~72 °C): la ADN polimerasa sintetiza la hebra nueva.",
        ],
      },
      {
        type: "sequence",
        label: "Cebador ilustrativo · 20 nt",
        text: "5′-ATG GCT AAG TCC GAT TCA-3′",
      },
      {
        type: "h2",
        text: "Exponencial significa poderoso",
      },
      {
        type: "p",
        text: "Cada ciclo duplica las copias de la región objetivo: tras 30 ciclos, una molécula puede generar más de mil millones de copias teóricas. La variante en tiempo real (qPCR) añade fluorescencia para cuantificar cuánto ADN había al inicio, y por eso es la base de muchos diagnósticos moleculares.",
      },
      {
        type: "quote",
        text: "La PCR no detecta vida: amplifica información. Esa distinción es la que la hace universal.",
      },
    ],
    references: [
      { text: "Mullis, K. B. & Faloona, F. A. (1987). Specific synthesis of DNA in vitro. Methods in Enzymology 155.", url: "https://www.sciencedirect.com" },
      { text: "The Nobel Prize in Chemistry 1993. nobelprize.org", url: "https://www.nobelprize.org" },
      { text: "Bustin, S. A. et al. The MIQE guidelines. Clinical Chemistry 55 (2009).", url: "https://academic.oup.com/clinchem" },
    ],
  },
  {
    slug: "repositorios-genomicos",
    title: "Dónde viven los datos de la vida: repositorios genómicos",
    category: "software-salud",
    excerpt:
      "GenBank, ENA, PDB, UniProt, GBIF: la ciencia moderna funciona porque existe una red global de repositorios donde cada dato es localizable, citable y reutilizable. Esta es la infraestructura invisible del descubrimiento.",
    date: "2025-08-17",
    readMin: 8,
    authorId: "elena",
    image: IMG.datos,
    imageCaption:
      "Abstracción de almacenamiento y flujos de datos científicos a gran escala.",
    tags: ["repositorios", "datos abiertos", "genómica", "infraestructura"],
    tier: "Divulgación científica",
    source: {
      journal: "BiolNexo Divulgación",
      year: 2025,
      doi: "10.5281/biolnexo.demo.0102",
      url: "https://www.insdc.org",
      license: "CC BY-NC 4.0",
      type: "Artículo de divulgación basado en literatura revisada por pares",
    },
    body: [
      {
        type: "p",
        text: "Cuando un artículo científico reporta un genoma nuevo, una estructura proteica o una variante genética, los datos no viven en el PDF: viven en un repositorio con un número de acceso estable. Ese número es el equivalente científico de una dirección postal permanente, y toda la investigación posterior puede construir sobre él.",
      },
      {
        type: "h2",
        text: "La red que sostiene todo",
      },
      {
        type: "table",
        header: ["Repositorio", "Contenido", "Acceso"],
        rows: [
          ["GenBank / ENA / DDBJ", "Secuencias de ácidos nucleicos (INSDC)", "Abierto"],
          ["PDB", "Estructuras 3D de macromoléculas", "Abierto"],
          ["UniProt", "Secuencias y anotación de proteínas", "Abierto"],
          ["GBIF", "Registros de biodiversidad", "Abierto (CC)"],
          ["GEO / ArrayExpress", "Datos de expresión génica", "Abierto"],
        ],
      },
      {
        type: "h2",
        text: "Datos que se citan como artículos",
      },
      {
        type: "p",
        text: "Los principios FAIR —encontrable, accesible, interoperable y reutilizable— convirtieron los datos en objetos de primera clase de la comunicación científica. Un dataset bien depositado, con metadatos completos, puede ser citado y reanalizado durante décadas: es la forma más eficiente de inversión científica que existe.",
      },
      {
        type: "quote",
        text: "Un dato sin metadatos es un espécimen sin etiqueta: existe, pero no dice nada.",
      },
    ],
    references: [
      { text: "INSDC — International Nucleotide Sequence Database Collaboration. insdc.org", url: "https://www.insdc.org" },
      { text: "Wilkinson, M. D. et al. (2016). The FAIR Guiding Principles. Scientific Data 3.", url: "https://www.nature.com/sdata" },
      { text: "NCBI Resource Coordinators. Database resources of the NCBI. Nucleic Acids Research (anual).", url: "https://www.ncbi.nlm.nih.gov" },
    ],
  },
];

export const getArticle = (slug: string) =>
  articles.find((a) => a.slug === slug);

export const articlesByCategory = (slug: string) =>
  articles.filter((a) => a.category === slug);

export const relatedTo = (slug: string, n = 3) => {
  const current = getArticle(slug);
  if (!current) return articles.slice(0, n);
  return articles
    .filter((a) => a.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.category === current.category) -
          Number(a.category === current.category) ||
        (a.tags.filter((t) => current.tags.includes(t)).length <
        b.tags.filter((t) => current.tags.includes(t)).length
          ? 1
          : -1),
    )
    .slice(0, n);
};

/* ------------------------------------------------------------------ */
/* Experimentos                                                        */
/* ------------------------------------------------------------------ */
export const experiments: Experiment[] = [
  {
    id: "adn-fresas",
    title: "Extracción de ADN visible a partir de fresas",
    level: "Educativo",
    area: "Biología molecular",
    duration: "45 min",
    difficulty: "Baja",
    objective:
      "Observar ADN macroscópico extraído de tejido vegetal usando materiales caseros, y comprender por qué las fresas son una fuente ideal (octoploidía y pared celular fácil de lisar).",
    materials: [
      "2 fresas maduras sin tallo",
      "Bolsa plástica con cierre",
      "Detergente líquido (2 cucharaditas) y sal (1 cucharadita) en 100 ml de agua",
      "Colador o filtro de café",
      "Alcohol etílico muy frío (96°)",
      "Vaso transparente y palillo o brocheta",
    ],
    procedure: [
      "Tritura las fresas dentro de la bolsa hasta obtener una pulpa homogénea.",
      "Añade la solución de detergente y sal; mezcla suave durante 1 minuto sin hacer espuma.",
      "Filtra el líquido hacia el vaso transparente, reteniendo los sólidos.",
      "Inclina el vaso y vierte lentamente el alcohol frío por la pared hasta formar una capa superior.",
      "Espera 2–3 minutos: en la interfase aparecerá una nube blanquecina. Recógela con el palillo.",
    ],
    results:
      "En la interfase alcohol/extracto se forma un material filamentoso blanco: es ADN (junto con algo de ARN y proteínas) precipitado por el alcohol.",
    observations:
      "La solución detergente-sal rompe membranas (el detergente disuelve lípidos) y neutraliza cargas (la sal), liberando el ADN. El alcohol frío lo deshidrata y lo hace visible. Con fresas el rendimiento es alto porque cada célula aporta 8 juegos de cromosomas.",
    explanation:
      "El ADN es soluble en agua pero no en alcohol: al cambiar el solvente, precipita. Este mismo principio de lisis + precipitación está en la base de kits comerciales de extracción, aunque con reactivos purificados y pasos de limpieza adicionales.",
    safety: [
      "No consumir el producto: no es apto para ingestión.",
      "Manejar el alcohol lejos de llamas y en espacios ventilados.",
      "Lavarse las manos al terminar; los residuos pueden desecharse con la basura doméstica.",
    ],
    references: [
      { text: "Cold Spring Harbor Laboratory — DNA Extraction protocols (recursos educativos).", url: "https://www.dnalc.org" },
      { text: "National Human Genome Research Institute — materiales educativos.", url: "https://www.genome.gov" },
    ],
  },
  {
    id: "pigmentos-cromatografia",
    title: "Separación de pigmentos fotosintéticos por cromatografía en papel",
    level: "Educativo",
    area: "Fisiología vegetal",
    duration: "1 h",
    difficulty: "Media",
    objective:
      "Separar clorofilas y carotenoides de hojas verdes y estimar su diversidad a partir de la distancia de migración en fase estacionaria.",
    materials: [
      "Hojas verdes frescas (espinaca ideal)",
      "Alcohol etílico o acetona (solvente de extracción)",
      "Papel de filtro o de cromatografía",
      "Tira de papel de filtro como fase estacionaria",
      "Frasco con tapa, mortero y embudo",
    ],
    procedure: [
      "Tritura las hojas con una pequeña cantidad de solvente hasta obtener un extracto verde intenso.",
      "Filtra y concentra: el extracto debe ser oscuro.",
      "Dibuja una línea de origen a 1,5 cm del borde inferior de la tira y aplica el extracto en puntos repetidos, dejando secar entre aplicaciones.",
      "Coloca la tira en el frasco con 1 cm de solvente, sin que el nivel toque la línea de origen. Tapa.",
      "Cuando el frente del solvente esté a 1 cm del tope, retira, marca el frente y deja secar.",
    ],
    results:
      "Se observan bandas de distintos colores: carotenos (amarillo-naranja, más móviles), xantofilas (amarillas), clorofila a (verde azulada) y clorofila b (verde oliva).",
    observations:
      "La separación depende de la afinidad de cada pigmento por la fase móvil vs. la fase estacionaria. Calcula el Rf = distancia del pigmento / distancia del frente para comparar entre extractos.",
    explanation:
      "La cromatografía separa mezclas por partición diferencial entre fases. En fotosíntesis, cada pigmento captura longitudes de onda distintas: la diversidad de bandas refleja la estrategia de la planta para aprovechar el espectro luminoso.",
    safety: [
      "Usar en espacio ventilado; los solventes son inflamables.",
      "Evitar contacto con ojos y piel; usar guantes si es posible.",
      "Disponer los solventes usados en recipiente cerrado, nunca en el desagüe.",
    ],
    references: [
      { text: "Harborne, J. B. Phytochemical Methods. Springer.", url: "https://link.springer.com" },
      { text: "Recursos de laboratorio de fisiología vegetal — SEB (Society for Experimental Biology).", url: "https://www.societyforexperimentalbiology.org" },
    ],
  },
  {
    id: "placas-ambientales",
    title: "Observación de microorganismos ambientales en placas de cultivo",
    level: "Supervisado",
    area: "Microbiología",
    duration: "3–5 días",
    difficulty: "Media",
    objective:
      "Visualizar la diversidad microbiana de superficies cotidianas cultivando muestras en agar nutritivo y aprendiendo técnicas asépticas básicas.",
    materials: [
      "Placas Petri con agar nutritivo (compradas estériles)",
      "Hisopos estériles",
      "Cinta de laboratorio y marcador permanente",
      "Incubadora o lugar templado (25–30 °C)",
      "Guantes y solución desinfectante (hipoclorito 1 %)",
    ],
    procedure: [
      "Rotula las placas: superficie de origen, fecha y grupo.",
      "Pasa el hisopo estéril por la superficie elegida (manija, teclado, hoja de planta) y estríalo en zigzag sobre el agar.",
      "Incluye una placa control sin inocular.",
      "Sella con cinta, incuba invertidas a 25–30 °C entre 48 y 96 horas.",
      "Observa sin abrir: registra morfologías de colonia (color, borde, relieve, tamaño).",
      "Desinfecta y desecha las placas selladas; no las abras después del crecimiento.",
    ],
    results:
      "Aparecen colonias de distinta morfología: bacterianas (pequeñas, brillantes) y fúngicas (algodonosas, pigmentadas). La placa control debe permanecer sin crecimiento si la técnica fue aséptica.",
    observations:
      "Cada colonia visible proviene de una o pocas células: es una unidad formadora de colonia (UFC). La diversidad observada subestima la real, porque la mayoría de los microorganismos no crecen en estas condiciones.",
    explanation:
      "El cultivo selectivo revela solo la fracción cultivable (<1 % en muchos ambientes). Comparar superficies enseña sobre microbiomas, higiene y límites del método de cultivo, que hoy se complementa con secuenciación del gen 16S rRNA.",
    safety: [
      "Requiere supervisión de un docente o técnico: nivel de bioseguridad 1.",
      "Nunca abrir las placas una vez incubadas.",
      "Desinfectar con hipoclorito antes de desechar; usar guantes en todo momento.",
    ],
    references: [
      { text: "ASM — American Society for Microbiology, guías de laboratorio seguro.", url: "https://asm.org" },
      { text: "OSHA — Biosafety in Microbiological Laboratories (BMBL).", url: "https://www.cdc.gov" },
    ],
  },
  {
    id: "germinacion-salinidad",
    title: "Efecto de la salinidad en la germinación de semillas",
    level: "Educativo",
    area: "Ecología y fisiología",
    duration: "7–10 días",
    difficulty: "Baja",
    objective:
      "Cuantificar cómo distintas concentraciones de NaCl afectan el porcentaje y la velocidad de germinación, aplicando diseño experimental con controles y réplicas.",
    materials: [
      "60 semillas de lenteja o poroto (mismo lote)",
      "5 recipientes con papel absorbente",
      "Soluciones de NaCl: 0 %, 0,5 %, 1 %, 2 % y 4 %",
      "Regla, balanza (opcional) y planilla de registro",
    ],
    procedure: [
      "Prepara las soluciones salinas con agua destilada o de botella.",
      "Coloca 12 semillas por tratamiento, con 3 réplicas de 4 semillas cada una.",
      "Humedece cada recipiente con su solución correspondiente; mantiene condiciones iguales de luz y temperatura.",
      "Registra cada 24 h: semillas germinadas (radícula > 2 mm) y longitud de radícula.",
      "Calcula porcentaje de germinación final y germinación acumulada por día para cada tratamiento.",
    ],
    results:
      "Típicamente: el control germina > 90 %; a mayor salinidad, menor porcentaje y mayor latencia. Concentraciones altas pueden inhibir totalmente la germinación.",
    observations:
      "La sal reduce el potencial hídrico: la semilla 'siente' sequía aunque esté húmeda (estrés osmótico), y el exceso de iones puede ser tóxico para el embrión (estrés iónico).",
    explanation:
      "Este bioensayo clásico modela la salinización de suelos agrícolas, un problema que afecta a una fracción importante de la tierra irrigada del mundo según la FAO. Comparar especies permite discutir tolerancia y adaptación.",
    safety: [
      "Experimento de bajo riesgo apto para todo público.",
      "No ingerir soluciones ni semillas tratadas.",
      "Lavarse las manos tras manipular; las soluciones pueden desecharse diluidas por el desagüe.",
    ],
    references: [
      { text: "FAO — suelos afectados por sales: recursos y datos.", url: "https://www.fao.org" },
      { text: "ISTA — International Seed Testing Association, métodos de germinación.", url: "https://www.seedtest.org" },
    ],
  },
  {
    id: "electroforesis-agarosa",
    title: "Separación de fragmentos de ADN por electroforesis en gel de agarosa",
    level: "Protocolo de investigación",
    area: "Biología molecular",
    duration: "2 h",
    difficulty: "Alta",
    objective:
      "Separar fragmentos de ADN por tamaño para verificar digestiones, PCRs o extracciones, usando campo eléctrico sobre una matriz de agarosa.",
    materials: [
      "Agarosa grado molecular (0,8–1,5 % según rango)",
      "Tampón TAE o TBE 1×",
      "Cámara y fuente de electroforesis, peine y molde",
      "Marcador de peso molecular (ladder)",
      "Tinte de carga y sistema de visualización de ADN",
      "Micropipetas calibradas y puntas con filtro",
    ],
    procedure: [
      "Prepara el gel: agarosa en TAE 1×, fundir, entibiar y verter con peine.",
      "Monta el gel en la cámara con TAE 1× cubriendo la superficie.",
      "Mezcla las muestras con tinte de carga y siembra en los pocillos junto al ladder.",
      "Corre a 5–8 V/cm hasta que el frente del tinte alcance ~2/3 del gel.",
      "Visualiza con el sistema de imagen documentado y registra la corrida completa.",
      "Interpreta: compara movilidad relativa contra el ladder para estimar tamaños.",
    ],
    results:
      "Bandas discretas cuya migración es inversamente proporcional al logaritmo del tamaño. Controles negativos sin banda; controles positivos en el tamaño esperado.",
    observations:
      "Bandas difusas pueden indicar degradación o sobrecarga; arrastre ('smiling') sugiere voltaje excesivo o tampón agotado. Documentar siempre voltaje, tiempo y porcentaje de gel para reproducibilidad.",
    explanation:
      "El ADN es una macromolécula cargada negativamente: migra hacia el ánodo a través de la matriz, que actúa como tamiz molecular. Es la técnica de verificación más usada en clonado, genotipado y control de calidad de ácidos nucleicos.",
    safety: [
      "Protocolo de laboratorio con supervisión: riesgo eléctrico y reactivos de visualización.",
      "Usar guantes, bata y protección ocular; no manipular la fuente con la cámara abierta.",
      "Desechar geles y buffers según el plan de residuos del laboratorio.",
    ],
    references: [
      { text: "Sambrook, J. & Russell, D. W. Molecular Cloning: A Laboratory Manual. 4.ª ed. CSHL Press.", url: "https://www.cshlpress.org" },
      { text: "Thermo Fisher — guías técnicas de electroforesis.", url: "https://www.thermofisher.com" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Datasets                                                            */
/* ------------------------------------------------------------------ */
export const datasets: Dataset[] = [
  {
    id: "genbank",
    name: "GenBank (INSDC)",
    org: "NCBI / EMBL-EBI / DDBJ",
    kind: "Secuencias de ácidos nucleicos",
    records: "> 2.800 M de registros",
    formats: ["FASTA", "GenBank", "XML"],
    license: "Dominio público",
    url: "https://www.ncbi.nlm.nih.gov/genbank/",
    description:
      "La colección de referencia mundial de secuencias anotadas de nucleótidos, sincronizada diariamente entre los tres nodos del INSDC.",
    spark: [12, 18, 27, 41, 60, 88, 120],
  },
  {
    id: "pdb",
    name: "Protein Data Bank",
    org: "RCSB / wwPDB",
    kind: "Estructuras 3D de macromoléculas",
    records: "> 220.000 estructuras",
    formats: ["PDB", "mmCIF", "JSON"],
    license: "CC0",
    url: "https://www.rcsb.org",
    description:
      "Estructuras experimentales de proteínas y ácidos nucleicos resueltas por rayos X, RMN y cryo-EM, con metadatos completos.",
    spark: [8, 12, 19, 30, 47, 66, 90],
  },
  {
    id: "uniprot",
    name: "UniProt",
    org: "Consorcio UniProt",
    kind: "Secuencias y función de proteínas",
    records: "> 250 M de secuencias",
    formats: ["FASTA", "XML", "TSV"],
    license: "CC BY 4.0",
    url: "https://www.uniprot.org",
    description:
      "Anotación funcional curada (Swiss-Prot) más traducciones computacionales (TrEMBL): el punto de partida de casi todo análisis proteómico.",
    spark: [20, 31, 45, 58, 71, 84, 100],
  },
  {
    id: "gbif",
    name: "GBIF",
    org: "Red GBIF (nodos nacionales)",
    kind: "Registros de biodiversidad",
    records: "> 2.900 M de ocurrencias",
    formats: ["DwC-A", "CSV", "API"],
    license: "CC BY / CC0",
    url: "https://www.gbif.org",
    description:
      "Registros de presencia de especies aportados por museos, herbarios, monitoreos y ciencia ciudadana en todo el mundo.",
    spark: [15, 25, 38, 52, 68, 85, 98],
  },
  {
    id: "demo-germinacion",
    name: "Ensayo de germinación — salinidad",
    org: "BiolNexo Labs (demo)",
    kind: "Bioensayo · datos tabulares",
    records: "600 observaciones",
    formats: ["CSV"],
    license: "CC BY 4.0",
    demo: true,
    description:
      "Datos de demostración que acompañan al experimento educativo de salinidad: tratamiento, réplica, germinación diaria y longitud de radícula.",
    spark: [5, 12, 28, 49, 67, 82, 91],
  },
  {
    id: "demo-expresion",
    name: "Expresión génica diferencial (demo)",
    org: "BiolNexo Labs (demo)",
    kind: "RNA-seq · matriz de expresión",
    records: "18.400 genes × 12 muestras",
    formats: ["CSV", "H5AD"],
    license: "CC BY 4.0",
    demo: true,
    description:
      "Matriz sintética de demostración para practicar análisis de expresión diferencial, PCA y enriquecimiento funcional con R o Python.",
    spark: [30, 26, 34, 42, 39, 55, 61],
  },
];

/* ------------------------------------------------------------------ */
/* Software & Salud (programas propios demo)                             */
/* ------------------------------------------------------------------ */
export const softwareProjects: SoftwareProject[] = [
  {
    slug: "calculadora-bio-salud",
    titulo: "CalculaBio — Salud a un clic",
    resumen:
      "Calculadora web que estima IMC, TMB y riesgo metabólico con visualización instantánea. Pensada para estudiantes y público curioso, sin jerga.",
    coverImage: IMG.datos,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    downloadUrl: "https://github.com/JhonyLezama/biolnexo/releases/tag/calculabio-v1",
    repoUrl: "https://github.com/JhonyLezama/biolnexo",
    stack: ["React", "TypeScript", "Tailwind"],
    areaSalud: "Nutrición",
    destacado: true,
  },
  {
    slug: "visor-fasta",
    titulo: "Visor FASTA BiolNexo",
    resumen:
      "Pega tu secuencia y ve GC%, traducción y motivos en vivo. Ideal para clases de biotecnología, 100% en el navegador.",
    coverImage: IMG.genoma,
    repoUrl: "https://github.com/JhonyLezama/biolnexo",
    stack: ["Vite", "Biopython-like JS"],
    areaSalud: "Genómica",
  },
  {
    slug: "analizador-pcr",
    titulo: "PCR Check — Validador de cebadores",
    resumen:
      "Valida Tm, dímeros y especificidad de tus primers antes de pedirlos. Evita un gel fallido en 15 segundos.",
    coverImage: IMG.laboratorio,
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    downloadUrl: "https://github.com/JhonyLezama/biolnexo",
    stack: ["Python", "Streamlit"],
    areaSalud: "Biología molecular",
  },
];

/* ------------------------------------------------------------------ */
/* Publicaciones (ficha de investigación — demostración)               */
/* ------------------------------------------------------------------ */
export const publications: Publication[] = [
  {
    id: "ensambladores",
    title:
      "Evaluación comparativa de ensambladores de novo para genomas bacterianos con lecturas híbridas",
    authors: ["E. Vargas", "S. Delgado", "M. Herrera"],
    year: 2025,
    journal: "Revista Latinoamericana de Bioinformática (demo)",
    area: "Genómica computacional",
    doi: "10.5281/zenodo.biolnexo.0001",
    question:
      "¿Cómo varía la continuidad y exactitud de los ensamblajes bacterianos al combinar lecturas cortas y largas con tres ensambladores de uso común?",
    methodology:
      "Se compararon tres ensambladores sobre 12 genomas bacterianos de referencia con métricas estándar (N50, completitud BUSCO, tasa de errores) y pruebas de significancia por pares.",
    results:
      "Los enfoques híbridos mejoraron la continuidad en todos los casos; la exactitud a nivel de base dependió del pulido final. Las diferencias entre ensambladores fueron consistentes pero dependientes del genoma.",
    conclusion:
      "No existe un ensamblador universalmente mejor: la elección debe guiarse por las métricas del organismo objetivo y documentar parámetros para garantizar reproducibilidad.",
    references: 34,
  },
  {
    id: "hojas-cnn",
    title:
      "Clasificación de especies arbóreas a partir de imágenes de hojas con redes convolucionales ligeras",
    authors: ["S. Delgado", "A. Quintero"],
    year: 2025,
    journal: "Congreso de Tecnología Aplicada a la Biodiversidad (demo)",
    area: "IA científica",
    doi: "10.5281/zenodo.biolnexo.0002",
    question:
      "¿Puede un modelo ligero, ejecutable en teléfonos móviles, clasificar especies arbóreas regionales con precisión útil para monitoreo de campo?",
    methodology:
      "Se entrenaron y compararon tres arquitecturas ligeras sobre un conjunto etiquetado de 8.400 imágenes, con validación por partición geográfica para estimar generalización real.",
    results:
      "El mejor modelo alcanzó precisión macro-F1 de 0,87 con 18 MB de tamaño; la validación geográfica redujo el rendimiento un 9 % frente a la partición aleatoria, evidenciando sesgo de distribución.",
    conclusion:
      "Los modelos de campo deben evaluarse con particiones que reflejen el despliegue real; el tamaño reducido no sacrificó precisión de forma significativa.",
    references: 27,
  },
  {
    id: "microsuelos",
    title:
      "Diversidad microbiana de suelos agrícolas bajo tres manejos: un estudio piloto con 16S rRNA",
    authors: ["M. Herrera", "E. Vargas", "L. Ferrer"],
    year: 2024,
    journal: "Boletín de Microbiología Aplicada (demo)",
    area: "Microbiología",
    doi: "10.5281/zenodo.biolnexo.0003",
    question:
      "¿Difiere la composición de las comunidades bacterianas del suelo entre manejo convencional, integrado y agroecológico en una misma región productiva?",
    methodology:
      "Muestreo pareado de 18 parcelas, extracción de ADN de suelo, secuenciación del amplicón V4 del gen 16S rRNA y análisis de diversidad alfa y beta con controles negativos de extracción.",
    results:
      "La diversidad alfa fue mayor en manejo agroecológico; la estructura de comunidades (beta diversidad) se agrupó por manejo y por bloque, con los controles negativos sin amplificación significativa.",
    conclusion:
      "El manejo agrícola deja una firma microbiana detectable; se requiere seguimiento temporal para distinguir efectos persistentes de variación estacional.",
    references: 41,
  },
  {
    id: "poblaciones",
    title:
      "Modelado de dinámica poblacional de aves con datos abiertos de ciencia ciudadana",
    authors: ["A. Quintero", "S. Delgado"],
    year: 2024,
    journal: "Revista de Ecología Cuantitativa (demo)",
    area: "Ecología",
    doi: "10.5281/zenodo.biolnexo.0004",
    question:
      "¿Qué tan robustas son las tendencias poblacionales estimadas desde registros de ciencia ciudadana frente a sesgos de esfuerzo de muestreo?",
    methodology:
      "Modelos de ocupación dinámica sobre 10 años de registros abiertos, con covariables de esfuerzo (listas completas, duración, observadores) y validación contra conteos estructurados.",
    results:
      "Las tendencias coincidieron en 7 de 9 especies con las de monitoreo estructurado cuando se modeló el esfuerzo explícitamente; sin ese ajuste, tres especies mostraron tendencias falsamente negativas.",
    conclusion:
      "Los datos de ciencia ciudadana son útiles para vigilancia de tendencias si el esfuerzo de muestreo se incorpora como variable de primer orden en el modelo.",
    references: 22,
  },
];

/* ------------------------------------------------------------------ */
/* Datos para visualizaciones                                          */
/* ------------------------------------------------------------------ */
export const sequencingCost: ChartPoint[] = [
  { label: "2001", value: 95_000_000, display: "≈ 95 M USD" },
  { label: "2007", value: 8_000_000, display: "≈ 8 M USD" },
  { label: "2011", value: 6_000, display: "≈ 6.000 USD" },
  { label: "2015", value: 1_500, display: "≈ 1.500 USD" },
  { label: "2020", value: 600, display: "≈ 600 USD" },
  { label: "2024", value: 200, display: "≈ 200 USD" },
];

export const genomicGrowth: ChartPoint[] = [
  { label: "2010", value: 12, display: "12 GB" },
  { label: "2012", value: 15, display: "15 GB" },
  { label: "2014", value: 20, display: "20 GB" },
  { label: "2016", value: 30, display: "30 GB" },
  { label: "2018", value: 45, display: "45 GB" },
  { label: "2020", value: 66, display: "66 GB" },
  { label: "2022", value: 90, display: "90 GB" },
  { label: "2024", value: 118, display: "118 GB" },
];

export const bioTools = [
  "BLAST",
  "AlphaFold",
  "UniProt",
  "R / Bioconductor",
  "Python",
  "Nextflow",
  "MAFFT",
  "QIIME 2",
  "PyMOL",
  "MEGA",
];

export const tickerItems = [
  "ATG·GCT·AAG·TCC·GAT·TCA",
  "GRCh38 · chr7:117,120,017",
  "BLAST → 3.2e-41",
  "AlphaFold pLDDT 92.4",
  "16S rRNA · V4 · 251 pb",
  "BUSCO 98,6 % completo",
  "R² = 0.94 · σ = 0.003",
  "QIIME2 · ASV table 4.812",
  "Cryo-EM 2,8 Å",
  "GBIF · 2.9e9 ocurrencias",
  "NGS · 2×150 pb · Q30 94 %",
  "PDB 8XYZ · homodímero",
];

/* ------------------------------------------------------------------ */
/* Utilidades                                                          */
/* ------------------------------------------------------------------ */
export function fmtDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function categoryName(slug: string): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug;
}

export function categoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

/* ------------------------------------------------------------------ */
/* Supabase híbrido — backend real con fallback estático (nicho 4)       */
/* ------------------------------------------------------------------ */
import { supabase, isSupabaseConfigured } from "../lib/supabase";

export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured || !supabase) return categories;
  const { data, error } = await supabase.from("categories").select("*").order("name");
  if (error || !data?.length) return categories;
  return data as Category[];
}

export async function fetchArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured || !supabase) return articles;
  const { data, error } = await supabase.from("articles").select("*").order("date", { ascending: false });
  if (error || !data?.length) return articles;
  // mapea snake_case de DB a camelCase del tipo
  return (data as unknown as Array<Record<string, unknown>>).map((r) => ({
    slug: r.slug as string,
    title: r.title as string,
    category: r.category as Article["category"],
    excerpt: r.excerpt as string,
    date: r.date as string,
    readMin: (r.read_min as number) ?? (r.readMin as number),
    authorId: (r.author_id as string) ?? (r.authorId as string),
    image: r.image as string,
    imageCaption: (r.image_caption as string) ?? (r.imageCaption as string),
    tags: (r.tags as string[]) ?? [],
    tier: r.tier as Article["tier"],
    featured: (r.featured as boolean) ?? false,
    source: r.source as Article["source"],
    body: r.body as Article["body"],
    references: r.references as Article["references"],
  }));
}

export async function fetchSoftwareProjects(): Promise<SoftwareProject[]> {
  if (!isSupabaseConfigured || !supabase) return softwareProjects;
  const { data, error } = await supabase.from("software_projects").select("*").order("created_at", { ascending: false });
  if (error || !data?.length) return softwareProjects;
  return (data as unknown as Array<Record<string, unknown>>).map((r) => ({
    slug: r.slug as string,
    titulo: (r.titulo as string) ?? (r.title as string),
    resumen: r.resumen as string,
    coverImage: (r.cover_image as string) ?? (r.coverImage as string),
    videoUrl: (r.video_url as string) ?? (r.videoUrl as string),
    downloadUrl: (r.download_url as string) ?? (r.downloadUrl as string),
    repoUrl: (r.repo_url as string) ?? (r.repoUrl as string),
    stack: (r.stack as string[]) ?? [],
    areaSalud: (r.area_salud as string) ?? (r.areaSalud as string),
    destacado: (r.destacado as boolean) ?? false,
  }));
}
