import { useState, useEffect } from "react";

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = "xona_v4_checks";
function loadChecks() {
  try { const r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : {}; }
  catch { return {}; }
}
function saveChecks(obj) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch {}
}

// ─── PILLARS ──────────────────────────────────────────────────────────────────
const PILLARS = {
  INSPIRA:   { label: "INSPIRA",   color: "#00BCD4", emoji: "✨" },
  INDUSTRIA: { label: "INDUSTRIA", color: "#9C27B0", emoji: "📊" },
  CULTURA:   { label: "CULTURA",   color: "#E63946", emoji: "🎭" },
  OFICIO:    { label: "OFICIO",    color: "#2196F3", emoji: "🔧" },
  PROCESO:   { label: "PROCESO",   color: "#4CAF50", emoji: "⚙️" },
};

const DAY_SCHEDULE = [
  { dayName: "Lunes",     pilar: "INSPIRA"   },
  { dayName: "Martes",    pilar: "INDUSTRIA" },
  { dayName: "Miércoles", pilar: "CULTURA"   },
  { dayName: "Jueves",    pilar: "OFICIO"    },
  { dayName: "Viernes",   pilar: "PROCESO"   },
];

// ─── INLINE CONTENT DATA ──────────────────────────────────────────────────────
// Para agregar o editar semanas, modificá solo el array WEEKS.
// Estructura de cada semana:
// { number, block, theme, days: [ { date, pilar, titulo, tiktok: { hook, duracion, workflow_spaces, pantallas, locucion_texto }, instagram: { tipo, slides, titulo, caption, hashtags, workflow_carrusel, historia, guion_slides } } ] }

const REFERENCIAS = [
  { cat: "Marketing Experiencial & Eventos", color: "#E63946", items: [
    { n: "@eventoplus",             r: "Instagram + Web",   d: "La biblia del sector eventos en español.",       url: "https://www.instagram.com/eventoplus" },
    { n: "@wearefearless",          r: "Instagram",         d: "Agencia UK. Estética editorial y casos de lujo.", url: "https://www.instagram.com/wearefearless" },
    { n: "@momentumww",             r: "Instagram+LinkedIn",d: "Momentum Worldwide. Referencia global en brand experience.", url: "https://www.instagram.com/momentumww" },
    { n: "@jackmorton",             r: "Instagram+LinkedIn",d: "Casos de eventos corporativos de primer nivel.", url: "https://www.instagram.com/jackmorton" },
    { n: "experientialmarketingnews.com", r: "Web/Newsletter", d: "Datos, tendencias y casos del sector.",      url: "https://www.experientialmarketingnews.com" },
  ]},
  { cat: "Cultura, Música & Festivales", color: "#E040FB", items: [
    { n: "@glastonburyfestivals",   r: "Instagram",         d: "El festival que inventó la comunidad de marca.", url: "https://www.instagram.com/glastonburyfestivals" },
    { n: "@coachella",              r: "Instagram+TikTok",  d: "Referencia en producción visual y marketing aspiracional.", url: "https://www.instagram.com/coachella" },
    { n: "@boilerroom",             r: "Instagram+YouTube", d: "Identidad global con contenido de nicho.",      url: "https://www.instagram.com/boilerroom" },
    { n: "@redbull",                r: "TikTok+Instagram",  d: "La marca que se convirtió en productora.",      url: "https://www.instagram.com/redbull" },
    { n: "@gentlemonster",          r: "Instagram",         d: "El retail que se convirtió en destino cultural.", url: "https://www.instagram.com/gentlemonster" },
  ]},
  { cat: "Diseño de Experiencias & Espacios", color: "#00BCD4", items: [
    { n: "@meowwolfofficial",       r: "Instagram",         d: "Experiencias inmersivas. Mundos completos.",    url: "https://www.instagram.com/meowwolfofficial" },
    { n: "@teamlab_art",            r: "Instagram",         d: "Arte digital inmersivo japonés.",               url: "https://www.instagram.com/teamlab_art" },
    { n: "@superblue",              r: "Instagram",         d: "Arte inmersivo en Miami.",                      url: "https://www.instagram.com/superblue" },
    { n: "@thewhitakergroup",       r: "Instagram",         d: "Event design de alto nivel.",                   url: "https://www.instagram.com/thewhitakergroup" },
    { n: "@refikanadol",            r: "Instagram",         d: "Data art e IA como expresión artística.",       url: "https://www.instagram.com/refikanadol" },
  ]},
  { cat: "Estrategia de Marca & Marketing", color: "#4CAF50", items: [
    { n: "@marketingexamples",      r: "Instagram+Web",     d: "Análisis profundo de campañas. Indispensable.", url: "https://www.instagram.com/marketingexamples" },
    { n: "@ariyh.co",               r: "Web+LinkedIn",      d: "Ciencia del comportamiento aplicada al marketing.", url: "https://ariyh.com" },
    { n: "@peretti_ad",             r: "Instagram+LinkedIn",d: "Creatividad y estrategia desde Buenos Aires.", url: "https://www.instagram.com/peretti_ad" },
    { n: "@sweathead_ad",           r: "Instagram",         d: "Posts cortos con insights muy densos.",         url: "https://www.instagram.com/sweathead_ad" },
    { n: "theconciergeclub.com",    r: "Web",               d: "Artículos sobre experiential marketing documentados.", url: "https://www.theconciergeclub.com" },
  ]},
  { cat: "Producción Audiovisual", color: "#FF9800", items: [
    { n: "@motiondesign.school",    r: "Instagram",         d: "Motion graphics de referencia.",                url: "https://www.instagram.com/motiondesign.school" },
    { n: "@buck.design",            r: "Instagram",         d: "Motion design y branding audiovisual top.",     url: "https://www.instagram.com/buck.design" },
    { n: "@viewmaster.studio",      r: "Instagram",         d: "Producción audiovisual para eventos y marcas.", url: "https://www.instagram.com/viewmaster.studio" },
    { n: "@thisisdapper",           r: "Instagram",         d: "Producción creativa, calidad editorial.",       url: "https://www.instagram.com/thisisdapper" },
    { n: "@hellomonday",            r: "Instagram",         d: "Diseño interactivo danés de primer nivel.",     url: "https://www.instagram.com/hellomonday" },
  ]},
  { cat: "IA & Tecnología Creativa", color: "#9C27B0", items: [
    { n: "@runwayml",               r: "Instagram+TikTok",  d: "Video IA. Ver qué viene cada semana.",          url: "https://www.instagram.com/runwayml" },
    { n: "@kling_ai",               r: "TikTok+Instagram",  d: "Video IA para b-roll y eventos.",               url: "https://www.tiktok.com/@kling_ai" },
    { n: "@freepik",                r: "Instagram+TikTok",  d: "Freepik Spaces: workflow completo de producción.", url: "https://www.instagram.com/freepik" },
    { n: "@elevenai",               r: "Instagram",         d: "ElevenLabs. Voz integrada en Spaces.",          url: "https://www.instagram.com/elevenai" },
    { n: "@midjourney",             r: "Discord+Web",       d: "Imágenes IA. Esencial para visuales sin fotógrafo.", url: "https://www.midjourney.com" },
  ]},
];

// ─── WEEKS DATA ───────────────────────────────────────────────────────────────
// Importado inline — reemplazar con import desde JSON cuando el entorno lo permita
// Para agregar semanas: copiar la estructura de un objeto de semana y pegarlo al final del array

const WEEKS = [
  {
    number: 1, block: 1, theme: "Referentes globales que nos mueven la cabeza",
    days: [
      {
        date: "Lun 21/4", pilar: "INSPIRA",
        titulo: "TeamLab Borderless: cuando el espacio ES la experiencia",
        tiktok: {
          hook: "Una galería en Tokio no tiene paredes. Y con eso cambiaron para siempre cómo pensamos los espacios.",
          duracion: "40 seg",
          workflow_spaces: {
            resumen: "Image Gen (Nano Banana Pro · 9:16) × 4 pantallas → Video Gen (Kling 3.0 · 9:16 · 5s) para hook → Voiceover (11Labs en Spaces) → Premiere Pro / After Effects",
            pasos: [
              { paso: 1, nodo: "Text", detalle: "Escribir el guion completo como referencia de locución" },
              { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2, 3 y 4 — validar en 2K antes de subir a 4K" },
              { paso: 3, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s · 1080p)", detalle: "Pantalla 1 (hook) con imagen como Start Frame" },
              { paso: 4, nodo: "Voiceover (11Labs)", detalle: "Nodo Text → Voiceover → Run → .mp3" },
              { paso: 5, nodo: "Premiere Pro / After Effects", detalle: "Montar assets, animar títulos, color grade" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",     texto: "UNA GALERÍA EN TOKIO\nNO TIENE PAREDES.\n¿POR QUÉ IMPORTA ESO?",                                                       animacion: "Texto blanco sobre negro. Cada línea cae con rebote suave.",                       prompt_imagen: "Futuristic immersive art gallery no walls, light projections floor ceiling, visitors glowing digital water, dark cinematic --ar 9:16", prompt_video: "Slow camera drift borderless art installation, neon light rivers on floor, visitor silhouettes, dreamlike cinematic 4K" },
            { tiempo: "3–14s",  tipo: "CONTEXTO", texto: "TeamLab Borderless, Tokio.\nEl arte se mueve según dónde estás vos.\n\nNo hay salas. No hay guía.\nNo hay límites.",   animacion: "Fade in suave. Última línea en cian con delay.",                                   prompt_imagen: "TeamLab Borderless digital art installation, glowing jellyfish dark room, visitors immersed light, aerial view --ar 9:16", prompt_video: null },
            { tiempo: "14–24s", tipo: "LECCIÓN",  texto: "El espacio no es el contenedor\nde la experiencia.\n\nEl espacio ES la experiencia.",                                    animacion: "Fondo oscuro. Frase final en cian grande con glow pulsante.",                     prompt_imagen: "Minimalist dark background, glowing cyan neon text concept, clean typographic design --ar 9:16", prompt_video: null },
            { tiempo: "24–32s", tipo: "CONEXIÓN", texto: "Cada decisión espacial comunica.\nLa temperatura, la iluminación,\nel recorrido. Todo.",                                animacion: "Blur-to-clear lento. Partículas de luz.",                                         prompt_imagen: "Elegant corporate VIP lounge warm lighting, branded design elements, luxury event backstage, soft bokeh --ar 9:16", prompt_video: null },
            { tiempo: "32–40s", tipo: "CTA",      texto: "¿Qué espacio o experiencia\nte voló la cabeza este año?\n👇",                                                           animacion: "Fondo cian oscuro. Flecha rebotando.",                                            prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Una galería en Tokio no tiene paredes. Y con eso cambiaron para siempre cómo pensamos los espacios. TeamLab Borderless: el arte se mueve según dónde estás vos. No hay salas, no hay guía, no hay límites. La lección: el espacio no es el contenedor de la experiencia. El espacio ES la experiencia. Cada decisión espacial comunica. La temperatura, la iluminación, el recorrido. Todo."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "Esto nos inspiró: TeamLab Borderless",
          caption: "El espacio no contiene la experiencia. El espacio ES la experiencia. ¿Cuándo fue la última vez que un lugar te hizo sentir eso? 🌊",
          hashtags: "#Inspiracion #ExperienceDesign #TeamLab #ArteInmersivo #MarketingExperiencial",
          workflow_carrusel: {
            resumen: "Assistant genera 5 prompts → Nodo Lista → Image Gen (Nano Banana Pro · 4:5 · 2K) batch → Designer para textos → .zip",
            pasos: [
              { paso: 1, nodo: "Assistant (GPT-4 mini)", detalle: "Generar lista de 5 prompts — formato Lista" },
              { paso: 2, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Run en batch → 5 imágenes en paralelo" },
              { paso: 3, nodo: "Designer", detalle: "Superponer títulos y cuerpos con tipografía de marca" },
              { paso: 4, nodo: "Exportar .zip", detalle: "Subir slides en orden como carrusel Feed" },
            ]
          },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Publicar el Reel → 'Agregar a historia' → sticker del reel centrado → fondo negro → texto '¿Qué espacio te voló la cabeza? 👇'" },
          guion_slides: [
            { numero: 1, titulo: "ESTO NOS INSPIRÓ",  subtitulo: "TeamLab Borderless, Tokio", cuerpo: "",                                                                        prompt_imagen: "Dark editorial cover, bold white text, glowing particles, minimalist --ar 4:5" },
            { numero: 2, titulo: "Sin paredes",        cuerpo: "Arte que se mueve según dónde estás vos. Sin salas, sin recorridos fijos.",                                       prompt_imagen: "Immersive digital art installation, light rivers floor, glowing walls --ar 4:5" },
            { numero: 3, titulo: "El concepto clave",  cuerpo: "El espacio no es el CONTENEDOR.\nEl espacio ES la experiencia.",                                                  prompt_imagen: "Bold quote dark slide, cyan accent line, elegant typography --ar 4:5" },
            { numero: 4, titulo: "¿Qué aprendemos?",  cuerpo: "Temperatura, iluminación, recorrido. Cada decisión espacial comunica algo.",                                       prompt_imagen: "Split: empty room vs beautifully designed event space with lighting --ar 4:5" },
            { numero: 5, titulo: "La pregunta",        cuerpo: "¿Cuándo fue la última vez que un espacio te hizo sentir algo?\nContanos.",                                        prompt_imagen: "Dark introspective closing slide, question mark motif, minimal --ar 4:5" },
          ]
        }
      },
      {
        date: "Mar 22/4", pilar: "INDUSTRIA",
        titulo: "El mercado de experiencias vale 500 mil millones de dólares",
        tiktok: {
          hook: "Hay un mercado de 500 mil millones de dólares que la mayoría de las agencias todavía no entendió.",
          duracion: "45 seg",
          workflow_spaces: {
            resumen: "Image Gen (Nano Banana Pro · 9:16) para infografías → Video Gen (Kling 3.0) para hook ticker → Voiceover (11Labs) → Premiere Pro",
            pasos: [
              { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas de datos e infografía" },
              { paso: 2, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "Hook: imagen ticker como Start Frame" },
              { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 4, nodo: "Premiere Pro / After Effects", detalle: "Counter animado para $500B, barras de progreso" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",     texto: "$500.000.000.000\nASÍ DE GRANDE ES EL MERCADO\nDE EXPERIENCIAS.",                                          animacion: "Contador que sube de cero. Ticker financiero.",                             prompt_imagen: "Financial ticker board dark background, glowing green numbers, stock market aesthetic --ar 9:16", prompt_video: "Counter increasing 500 billion, financial data visualization, green neon cinematic" },
            { tiempo: "3–14s",  tipo: "DATO",     texto: "Turismo de experiencias: $430–530B\nNaturaleza y aventura: $250–410B\n\nFuente: Statista 2025",           animacion: "Barras animadas izquierda a derecha.",                                    prompt_imagen: "Clean infographic bars market size dark, purple teal accents, data visualization --ar 9:16", prompt_video: null },
            { tiempo: "14–25s", tipo: "INSIGHT",  texto: "El 51% de las empresas Fortune 1000\nestán AUMENTANDO su inversión\nen marketing experiencial este año.", animacion: "51% enorme en centro. Violeta.",                                           prompt_imagen: "Bold 51% giant purple text, dark corporate background, data visualization --ar 9:16", prompt_video: null },
            { tiempo: "25–35s", tipo: "POSICIÓN", texto: "Ya no alcanza con hacer publicidad.\nHay que hacer que la gente\nVIVA la marca.",                         animacion: "VIVA en rojo grande. Flash.",                                            prompt_imagen: "Crowd live brand event, arms raised, confetti, massive LED screen, concert energy --ar 9:16", prompt_video: "Crowd branded event slow motion confetti, vibrant lighting, emotional faces" },
            { tiempo: "35–45s", tipo: "CTA",      texto: "¿Tu empresa está invirtiendo\nen experiencias?\n👇",                                                      animacion: "Violeta oscuro. Flecha.",                                                 prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Hay un mercado de quinientos mil millones de dólares que la mayoría de las agencias todavía no entendió. El 51% de las empresas Fortune 1000 están aumentando su inversión en marketing experiencial este año. Ya no alcanza con hacer publicidad. Hay que hacer que la gente viva la marca."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "Los números que todo marketero debería conocer",
          caption: "500 mil millones. El mercado de experiencias ya no es el futuro. Es el presente. 📊",
          hashtags: "#DataMarketing #MarketingExperiencial #Tendencias2026 #ExperienceEconomy",
          workflow_carrusel: {
            resumen: "Lista 5 prompts de datos → Image Gen (Nano Banana Pro · 4:5) batch → Designer números grandes → .zip",
            pasos: [
              { paso: 1, nodo: "Assistant + Nodo Lista", detalle: "5 prompts de infografías — énfasis editorial oscuro" },
              { paso: 2, nodo: "Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Batch" },
              { paso: 3, nodo: "Designer", detalle: "$500B, 51%, 78% en tipografía impactante" },
              { paso: 4, nodo: "Exportar .zip", detalle: "Carrusel Feed" },
            ]
          },
          historia: { tipo: "POLL NATIVA", instruccion: "Historia nueva → fondo negro → sticker Poll: '¿Tu empresa invierte en experiencias?' → Sí / Todavía no" },
          guion_slides: [
            { numero: 1, titulo: "LOS NÚMEROS",   subtitulo: "Que todo marketero debería conocer", cuerpo: "",                                                                    prompt_imagen: "Bold editorial dark cover, giant text concept, data elements, purple accent --ar 4:5" },
            { numero: 2, titulo: "$500.000M",      cuerpo: "El mercado global de experiencias en 2025. No es tendencia. Es el mercado más grande.",                               prompt_imagen: "500 billion infographic world map glowing dark purple --ar 4:5" },
            { numero: 3, titulo: "51%",            cuerpo: "De Fortune 1000 aumentaron inversión en experiencias. ¿Tu competencia ya lo hizo?",                                   prompt_imagen: "51% bold purple text competitive analysis dark --ar 4:5" },
            { numero: 4, titulo: "78%",            cuerpo: "De los consumidores son más propensos a comprar tras una experiencia positiva.",                                       prompt_imagen: "Consumer behavior infographic, event crowd overlay, warm --ar 4:5" },
            { numero: 5, titulo: "¿Y tu marca?",   cuerpo: "¿Adentro o afuera?",                                                                                                 prompt_imagen: "Dark closing question slide, red accent, CTA --ar 4:5" },
          ]
        }
      },
      {
        date: "Mié 23/4", pilar: "CULTURA",
        titulo: "Coachella no es un festival — es la campaña de marketing más cara del mundo",
        tiktok: {
          hook: "Coachella no es un festival. Es la campaña de marketing más cara del mundo.",
          duracion: "45 seg",
          workflow_spaces: {
            resumen: "Video Gen (Kling 3.0) para hook aéreo → Image Gen (Nano Banana Pro · 9:16) pantallas 2–5 → Voiceover → Premiere Pro / After Effects",
            pasos: [
              { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Coachella aerial golden desert sunset cinematic drone slow motion'" },
              { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–5" },
              { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 4, nodo: "Premiere Pro / After Effects", detalle: "Logos pantalla 2, número 4.200M con keyframe" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",      texto: "COACHELLA NO ES UN FESTIVAL.\nES LA CAMPAÑA DE MARKETING\nMÁS CARA DEL MUNDO.",              animacion: "Texto letra por letra. Glitch. Polvo dorado.",                prompt_imagen: "Coachella festival aerial, desert, massive crowd, golden hour, ferris wheel --ar 9:16", prompt_video: "Aerial drone Coachella golden sunset, massive crowd, slow motion cinematic" },
            { tiempo: "3–13s",  tipo: "ARGUMENTO", texto: "Revolve, H&M, Amazon.\nPagan millones para aparecer\nen el feed de millones\nque nunca fueron.",    animacion: "Logos fade in uno a uno.",                                    prompt_imagen: "Revolve Festival Coachella activation, influencers, luxury branded space, desert editorial --ar 9:16", prompt_video: null },
            { tiempo: "13–23s", tipo: "INSIGHT",   texto: "El producto no es la música.\nEl producto es el contenido\nque generan los asistentes.",          animacion: "Última línea en dorado. Reveal.",                            prompt_imagen: "Influencer phone Coachella activation, perfect lighting, desert backdrop --ar 9:16", prompt_video: null },
            { tiempo: "23–34s", tipo: "DATO",      texto: "En 2024, el hashtag #Coachella\ngeneró más de 4.200 millones\nde impresiones.\n\nSin un aviso.", animacion: "4.200M crece de pequeño a grande.",                           prompt_imagen: "Social media billions impressions, hashtag data graphic, purple gold --ar 9:16", prompt_video: null },
            { tiempo: "34–45s", tipo: "CTA",       texto: "¿Tu marca todavía depende\nde los avisos?\nSeguinos.",                                           animacion: "Rojo. Texto blanco.",                                         prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Coachella no es un festival. Es la campaña de marketing más cara del mundo. Revolve, H&M y Amazon pagan millones para aparecer en el feed de millones que nunca fueron. El producto no es la música. El producto es el contenido que generan los asistentes. En 2024, el hashtag Coachella generó más de cuatro mil doscientos millones de impresiones. Sin un aviso. Eso es marketing experiencial."
        },
        instagram: {
          tipo: "Carrusel", slides: 6, titulo: "5 cosas que Coachella sabe sobre marketing",
          caption: "Coachella no vende música. Vende identidad. Ahí está el secreto. 👇",
          hashtags: "#Coachella #MarketingExperiencial #BrandStrategy #FestivalMarketing",
          workflow_carrusel: {
            resumen: "Lista 6 prompts golden/dark → Image Gen (Nano Banana Pro · 4:5) batch → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Assistant + Nodo Lista", detalle: "6 prompts estética dorada/oscura festival premium" },
              { paso: 2, nodo: "Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Batch" },
              { paso: 3, nodo: "Designer", detalle: "Portada con numeración, textos de cada lección" },
              { paso: 4, nodo: "Exportar .zip", detalle: "Carrusel" },
            ]
          },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → sticker centrado → '¿Lo sabías? 🎪'" },
          guion_slides: [
            { numero: 1, titulo: "COACHELLA",                       subtitulo: "5 cosas sobre marketing que nadie te dice", cuerpo: "",                                           prompt_imagen: "Coachella premium cover, golden desert, dark luxury design --ar 4:5" },
            { numero: 2, titulo: "No venden música",                cuerpo: "Venden identidad. Ir es mostrar quién sos al mundo.",                                                prompt_imagen: "Coachella identity self expression, fashion festival premium --ar 4:5" },
            { numero: 3, titulo: "Las marcas aparecen, no venden",  cuerpo: "Experiencias que la gente fotografía y comparte.",                                                   prompt_imagen: "Brand activation festival, Instagrammable branded space --ar 4:5" },
            { numero: 4, titulo: "El contenido lo hacen ellos",     cuerpo: "4.200M de impresiones. Sin un aviso pagado.",                                                        prompt_imagen: "UGC phones festival, organic social explosion, golden light --ar 4:5" },
            { numero: 5, titulo: "El lineup es lo de menos",        cuerpo: "Las entradas se agotan antes de anunciar artistas.",                                                 prompt_imagen: "Sold out brand stronger than lineup, editorial dark --ar 4:5" },
            { numero: 6, titulo: "La pregunta",                     cuerpo: "¿Tu marca crea experiencias que la gente quiere fotografiar?",                                       prompt_imagen: "Introspective brand question, dark elegant closing --ar 4:5" },
          ]
        }
      },
      {
        date: "Jue 24/4", pilar: "OFICIO",
        titulo: "El brief que gana premios vs el brief que todos ignoran",
        tiktok: {
          hook: "El 90% de los briefs de eventos son iguales. El 10% restante gana premios.",
          duracion: "50 seg",
          workflow_spaces: {
            resumen: "Image Gen (Nano Banana Pro · 9:16) para pantallas de comparación → Voiceover (11Labs) → After Effects con listas animadas",
            pasos: [
              { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "4 pantallas: contraste 90%/10%, doc gris, doc dorado, comparación" },
              { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 3, nodo: "After Effects", detalle: "Animar aparición secuencial de cada punto, checks grises vs dorados" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",       texto: "EL 90% DE LOS BRIEFS\nSON IGUALES.\n\nEL 10% RESTANTE\nGANA PREMIOS.",                                                              animacion: "90% gris opaco. 10% dorado con spotlight.",          prompt_imagen: "90% grey mundane stack vs 10% golden glowing award document, spotlight --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "EL PROMEDIO", texto: "Brief promedio:\n→ Objetivo\n→ Público objetivo\n→ Fecha y lugar\n→ Presupuesto",                                                 animacion: "Checks grises. Ritmo lento.",                        prompt_imagen: "Generic boring brief checklist, grey corporate document --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "EL GANADOR",  texto: "Brief que gana:\n→ ¿Qué frase dirán al salir?\n→ ¿Qué foto querrán sacarse?\n→ ¿Qué harán diferente después?\n→ ¿Por qué esta experiencia?", animacion: "Checks dorados. Ritmo más rápido.",              prompt_imagen: "Award winning brief golden checkmarks, inspired questions, dark elegant --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "DIFERENCIA",  texto: "Uno describe el evento.\nEl otro describe la transformación.",                                                                     animacion: "Dos columnas. Segunda brilla dorada.",               prompt_imagen: "Two columns event description vs transformation, second glowing golden --ar 9:16", prompt_video: null },
            { tiempo: "36–50s", tipo: "CTA",         texto: "La diferencia entre un evento olvidable\ny uno que te cambia.\n\n¿Cuántas preguntas tiene tu próximo brief? 👇",                   animacion: "Texto firme. Flecha.",                               prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "El 90% de los briefs son iguales. El 10% gana premios. El promedio: objetivo, público, fecha, presupuesto. El que gana pregunta también: qué frase dirán al salir, qué foto querrán sacarse, qué harán diferente después, por qué esta experiencia. Uno describe el evento. El otro describe la transformación."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "El brief que gana — plantilla completa",
          caption: "Guardalo. La diferencia empieza en el brief. 📋",
          hashtags: "#EventPlanning #Brief #MarketingExperiencial #Produccion #EventStrategy",
          workflow_carrusel: {
            resumen: "Lista 5 prompts contraste grises/dorados → Image Gen (4:5) batch → Designer con checklist → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Grises para promedio, dorados para ganador" },
              { paso: 2, nodo: "Designer", detalle: "4 preguntas en tipografía impactante" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" },
            ]
          },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Cuál es la pregunta que nunca falta en tu brief?'" },
          guion_slides: [
            { numero: 1, titulo: "EL BRIEF QUE GANA",      subtitulo: "Plantilla — guardala",                                                       cuerpo: "",                                                                          prompt_imagen: "Award brief cover, dark elegant, golden accent --ar 4:5" },
            { numero: 2, titulo: "El promedio",             cuerpo: "Objetivo · Público · Fecha · Presupuesto. Todos iguales, todos olvidables.",                                                                                        prompt_imagen: "Boring grey checklist document, generic corporate --ar 4:5" },
            { numero: 3, titulo: "Las 4 que faltan",        cuerpo: "→ ¿Qué frase dirán al salir?\n→ ¿Qué foto querrán sacarse?\n→ ¿Qué harán diferente?\n→ ¿Por qué esta experiencia?",                                               prompt_imagen: "Four powerful golden questions, dark impactful typography --ar 4:5" },
            { numero: 4, titulo: "La diferencia",           cuerpo: "Uno describe el evento. El otro la transformación.",                                                                                                                prompt_imagen: "Transformation concept, dark golden accent --ar 4:5" },
            { numero: 5, titulo: "Guardala",                cuerpo: "Respondé las 4 preguntas antes de tu próximo evento.",                                                                                                              prompt_imagen: "Save template, bookmark concept, dark --ar 4:5" },
          ]
        }
      },
      {
        date: "Vie 25/4", pilar: "PROCESO",
        titulo: "Un mes de contenido en un día — el sistema de batching de una agencia",
        tiktok: {
          hook: "Un mes entero de contenido. Producido en un solo día. Sin grabar absolutamente nada.",
          duracion: "55 seg",
          workflow_spaces: {
            resumen: "Video Gen (Kling 3.0) para hook → Image Gen (Nano Banana Pro · 9:16) para pantallas de proceso → Voiceover (11Labs) → Premiere Pro / After Effects",
            pasos: [
              { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'One month calendar batching day content production, time-lapse'" },
              { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–5: diagrama, batching, herramientas, resultado" },
              { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 4, nodo: "After Effects", detalle: "Animar diagrama de flujo, barras de energía, counter de piezas" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",         texto: "UN MES DE CONTENIDO.\nPRODUCIDO EN UN DÍA.\nSIN GRABAR NADA.",                                                                                     animacion: "Calendario que se llena. Colapsa a un día.",                 prompt_imagen: "One month calendar collapsing to single day, content batching workflow --ar 9:16", prompt_video: "Calendar animation 30 days content created in one day, time-lapse" },
            { tiempo: "3–14s",  tipo: "EL SISTEMA",   texto: "1. 5 pilares temáticos\n2. Un pilar por día\n3. Un día al mes: todos los guiones\n4. Assets en bloque\n5. Programar y listo",                      animacion: "Diagrama de flujo. Cada paso con pop.",                      prompt_imagen: "Content system 5 pillars workflow, batching process diagram --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "BATCHING",     texto: "No producís un video por día.\nProducís 20 en un día.\n\nEl cerebro creativo funciona mejor\nhaciendo la misma tarea en bloque.",                  animacion: "Día a día en rojo vs batching en verde.",                    prompt_imagen: "Batching vs daily production, energy levels comparison, efficiency --ar 9:16", prompt_video: null },
            { tiempo: "26–37s", tipo: "HERRAMIENTAS", texto: "Guión: Claude / GPT\nImágenes y video: Freepik Spaces\nVoz: ElevenLabs (en Spaces)\nMontaje: Premiere / After Effects\nProgramación: Later",       animacion: "Pipeline visual. Cada herramienta en su eslabón.",           prompt_imagen: "AI content production pipeline, script to published post, professional --ar 9:16", prompt_video: null },
            { tiempo: "37–48s", tipo: "RESULTADO",    texto: "→ 20 Reels / TikToks\n→ 20 carruseles\n→ 20 historias\n\nSin improvisar. Sin agotarse.",                                                           animacion: "Counter. Verde.",                                            prompt_imagen: null, prompt_video: null },
            { tiempo: "48–55s", tipo: "CTA",          texto: "Guardá este video.\nTe va a ahorrar horas. 📌",                                                                                                     animacion: "Pin animado. Verde oscuro.",                                  prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Un mes de contenido. Producido en un día. Sin grabar nada. El sistema: cinco pilares, un pilar por día, un día al mes se generan todos los guiones, se producen los assets en bloque y se programa. La clave es el batching. Guiones en Claude o GPT, imágenes y video en Freepik Spaces, voz con ElevenLabs integrado, montaje en Premiere o After Effects. Resultado: veinte Reels, veinte carruseles, veinte historias. Sin improvisar. Sin agotarse."
        },
        instagram: {
          tipo: "Carrusel", slides: 6, titulo: "El sistema de batching — paso a paso",
          caption: "Guardalo. El sistema que permite mantener constancia sin agotarse. 📌",
          hashtags: "#ContentStrategy #Batching #WorkflowCreativo #ContentCreation #AgencyLife",
          workflow_carrusel: {
            resumen: "Lista 6 prompts de proceso → Image Gen (4:5) → Designer con pipeline → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Estética sistema/workflow, verde oscuro" },
              { paso: 2, nodo: "Designer", detalle: "Slide 5: pipeline Claude→Spaces→Premiere→Buffer con íconos" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" },
            ]
          },
          historia: { tipo: "ENCUESTA", instruccion: "Historia → Poll '¿Cuánto tiempo por semana producís contenido?' → -1h / 1–3h / +3h / No tengo sistema" },
          guion_slides: [
            { numero: 1, titulo: "UN MES EN UN DÍA",        subtitulo: "El sistema de batching",                                                           cuerpo: "",                                                                   prompt_imagen: "Batching system cover, efficiency, dark elegant --ar 4:5" },
            { numero: 2, titulo: "El problema",             cuerpo: "Improvisar cada publicación agota, genera inconsistencia y mata la voz de marca.",                                                                                prompt_imagen: "Daily content chaos, inconsistent posting, creator burnout --ar 4:5" },
            { numero: 3, titulo: "Los 5 pilares fijos",     cuerpo: "Lun: INSPIRA · Mar: INDUSTRIA · Mié: CULTURA · Jue: OFICIO · Vie: PROCESO",                                                                                      prompt_imagen: "5 content pillars weekly, colored calendar, structured --ar 4:5" },
            { numero: 4, titulo: "El día de batching",      cuerpo: "Un día al mes. Guiones, imágenes, video, voz, montaje, programación. Todo en bloque.",                                                                           prompt_imagen: "Batching day concept, flow state, all production one session --ar 4:5" },
            { numero: 5, titulo: "Las herramientas",        cuerpo: "Claude/GPT → Freepik Spaces (img+video+voz) → Premiere/AE → Buffer/Later",                                                                                       prompt_imagen: "Tool pipeline: Claude Spaces Premiere Buffer --ar 4:5" },
            { numero: 6, titulo: "El resultado",            cuerpo: "60 piezas. Un mes programado. Sin improvisar. Sin agotarse.",                                                                                                     prompt_imagen: "60 pieces full calendar abundance, green accent dark --ar 4:5" },
          ]
        }
      },
    ]
  },
  // ── SEMANAS 2–8 ───────────────────────────────────────────────────────────────
  {
    number: 2, block: 1, theme: "Comunidad, identidad y cultura de marca",
    days: [
      {
        date: "Lun 28/4", pilar: "INSPIRA",
        titulo: "Meow Wolf: cómo construir un mundo sin categoría conocida",
        tiktok: {
          hook: "Una ferretería abandonada. Cero presupuesto. Hoy es un negocio de 100 millones de dólares.",
          duracion: "45 seg",
          workflow_spaces: {
            resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook de transformación → Image Gen (Nano Banana Pro · 9:16 · 2K) para datos y lección → Voiceover (11Labs) → Premiere Pro",
            pasos: [
              { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Abandoned building door opens to glowing immersive art world, dramatic slow reveal, cinematic'" },
              { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: mundo inmersivo, categoría nueva, lección" },
              { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 4, nodo: "Premiere Pro / After Effects", detalle: "Mapa de ciudades animado, $100M con keyframe" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",     texto: "UNA FERRETERÍA ABANDONADA.\nCERO PRESUPUESTO.\n$100 MILLONES DESPUÉS.",              animacion: "Transformación: desordenado → ordenado.",                  prompt_imagen: "Abandoned hardware store transforms into glowing immersive art world, dramatic before/after --ar 9:16", prompt_video: "Abandoned building door opens to spectacular immersive light world, slow motion reveal cinematic" },
            { tiempo: "3–15s",  tipo: "HISTORIA", texto: "Meow Wolf, Nuevo México.\nFundada por artistas sin presupuesto.\n\nHoy: $100M.\nSedes en 4 ciudades.", animacion: "Mapa con puntos. Número crece.",                      prompt_imagen: "Meow Wolf style immersive impossible rooms, surreal colorful world, cinematic --ar 9:16", prompt_video: null },
            { tiempo: "15–28s", tipo: "INSIGHT",  texto: "No es galería. No es parque.\nNo es escape room.\n\nEs un mundo nuevo.\nEso los sacó de toda competencia.", animacion: "Tres categorías tachadas. Nueva en verde.",         prompt_imagen: "Category creation concept, three X marks, new glowing category emerging --ar 9:16", prompt_video: null },
            { tiempo: "28–45s", tipo: "CTA",      texto: "Cuando creás algo que no existe,\nno tenés competencia directa.\n\n¿Tu marca compite o crea? 👇", animacion: "Verde oscuro. Flecha.",                              prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Una ferretería abandonada. Cero presupuesto. Hoy cien millones de dólares. Meow Wolf fue fundada por artistas en Nuevo México y hoy tiene sedes en cuatro ciudades. No es galería, no es parque, no es escape room. Es un mundo nuevo. Eso los sacó de toda competencia. Cuando creás algo que no existe, no tenés competencia directa."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "Meow Wolf: el caso de la marca sin categoría",
          caption: "No competís cuando creás algo que no existe. 🌀",
          hashtags: "#MeowWolf #BrandStrategy #ImmersiveExperience #MarketingCreativo",
          workflow_carrusel: {
            resumen: "Lista 5 prompts surrealistas → Image Gen (Nano Banana Pro · 4:5 · 2K) batch → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Mundos imposibles, colores vibrantes sobre oscuro" },
              { paso: 2, nodo: "Designer", detalle: "Overlay de marca" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" },
            ]
          },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → sticker centrado → '¿Conocías Meow Wolf? 🌀'" },
          guion_slides: [
            { numero: 1, titulo: "MEOW WOLF",          subtitulo: "La marca sin categoría", cuerpo: "",                                                              prompt_imagen: "Meow Wolf surreal immersive world, impossible rooms, vibrant dark editorial cover --ar 4:5" },
            { numero: 2, titulo: "$100M sin categoría",cuerpo: "Ferretería abandonada → $100M en 4 ciudades. Sin publicidad convencional.",                          prompt_imagen: "Underdog success abandoned building to 100M, transformation dark --ar 4:5" },
            { numero: 3, titulo: "La ventaja",         cuerpo: "No galería. No parque. No escape room. Algo nuevo. Sin competencia directa.",                        prompt_imagen: "Category creation X marks new glowing category --ar 4:5" },
            { numero: 4, titulo: "La lección",         cuerpo: "Crear algo que no existe = no tener competencia directa.",                                           prompt_imagen: "Blue ocean strategy brand differentiation experience --ar 4:5" },
            { numero: 5, titulo: "¿Y tu marca?",       cuerpo: "¿Compite en un género conocido o inventa uno nuevo?",                                                prompt_imagen: "Introspective brand question dark elegant --ar 4:5" },
          ]
        }
      },
      {
        date: "Mar 29/4", pilar: "INDUSTRIA",
        titulo: "La economía de la nostalgia: +20% de afinidad con una sola palanca",
        tiktok: {
          hook: "La nostalgia no es un sentimiento. Es una estrategia de marketing que aumenta la afinidad de marca un 20%.",
          duracion: "45 seg",
          workflow_spaces: {
            resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) con estética retro/VHS → Voiceover (11Labs) → After Effects con efectos CRT",
            pasos: [
              { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Prompts iniciar con 'VHS aesthetic retro 90s scan lines' — 5 pantallas" },
              { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 3, nodo: "After Effects", detalle: "Efecto CRT/scanlines + color grade retro sobre las imágenes" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "LA NOSTALGIA NO ES\nUN SENTIMIENTO.\n\nES UNA ESTRATEGIA\nDE MARKETING.",                                    animacion: "VHS 90s. Scan lines. CRT pixelado.",                      prompt_imagen: "VHS retro 90s aesthetic scan lines saturated colors old TV effect, nostalgic marketing --ar 9:16", prompt_video: null },
            { tiempo: "3–13s",  tipo: "DATO",    texto: "Google 2025: campañas nostálgicas\naumentan afinidad hasta 20%.\n\nNintendo, Adidas y Pepsi\nlo usaron con resultados récord.", animacion: "20% enorme. Logos retro.",                         prompt_imagen: "Nostalgia campaign 20% statistic retro brand icons VHS texture --ar 9:16", prompt_video: null },
            { tiempo: "13–23s", tipo: "POR QUÉ", texto: "En un mundo de incertidumbre,\nla nostalgia es el único viaje\nal pasado garantizado.",                      animacion: "Máquina del tiempo. VHS suave.",                          prompt_imagen: "Time machine nostalgic journey warm sepia meets present VHS texture --ar 9:16", prompt_video: null },
            { tiempo: "23–33s", tipo: "TRAMPA",  texto: "No reproducir el pasado.\nRemixarlo.\n\nLa nostalgia que funciona\nmezcla lo conocido con lo nuevo.",         animacion: "Split vintage + moderno fusionándose.",                   prompt_imagen: "Nostalgia remix vintage meets modern design past present fusion --ar 9:16", prompt_video: null },
            { tiempo: "33–45s", tipo: "CTA",     texto: "¿Cuál es la marca que más\nte hace sentir nostalgia? 👇",                                                    animacion: "TV apagándose. Negro.",                                   prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "La nostalgia no es un sentimiento. Es una estrategia de marketing. Dato de Google 2025: las campañas nostálgicas aumentan la afinidad de marca hasta un veinte por ciento. Nintendo, Adidas y Pepsi lo usaron con resultados récord. La trampa: no se trata de reproducir el pasado, sino de remixarlo. La nostalgia que funciona mezcla lo familiar con algo nuevo e inesperado."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "La economía de la nostalgia",
          caption: "+20% de afinidad. El poder de la nostalgia bien usada. 📼",
          hashtags: "#Nostalgia #BrandStrategy #Tendencias2026 #MarketingCreativo",
          workflow_carrusel: {
            resumen: "Lista 5 prompts retro → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer tipografía retro → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "VHS, warm saturated, retro 90s" },
              { paso: 2, nodo: "Designer", detalle: "Tipografía retro, scanlines suave, datos grandes" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" },
            ]
          },
          historia: { tipo: "POLL NOSTÁLGICA", instruccion: "Historia → Poll '¿Con qué te quedás?' → 📺 TV analógica / 🎮 Game Boy / 💿 CD / 📟 Beeper" },
          guion_slides: [
            { numero: 1, titulo: "LA ECONOMÍA DE LA NOSTALGIA", subtitulo: "+20% de afinidad", cuerpo: "",                                                             prompt_imagen: "Nostalgia economy cover retro meets data VHS warm saturated --ar 4:5" },
            { numero: 2, titulo: "+20% de afinidad",            cuerpo: "Campañas nostálgicas aumentan afinidad hasta un 20%. Fuente: Google 2025.",                  prompt_imagen: "20% statistic nostalgia campaign retro aesthetic data --ar 4:5" },
            { numero: 3, titulo: "No reproducir — remixar",     cuerpo: "La que falla recrea el pasado. La que triunfa mezcla familiar + inesperado.",                prompt_imagen: "Remix vintage modern split design --ar 4:5" },
            { numero: 4, titulo: "Casos que funcionaron",       cuerpo: "Nintendo Switch retro icons. Adidas Originals. Air Max 1 relaunch.",                         prompt_imagen: "Successful nostalgia cases brand revival editorial --ar 4:5" },
            { numero: 5, titulo: "En eventos",                  cuerpo: "Un elemento de época y la audiencia siente que el evento fue hecho para ellos.",             prompt_imagen: "Nostalgic event design familiar elements modern space emotional --ar 4:5" },
          ]
        }
      },
      {
        date: "Mié 30/4", pilar: "CULTURA",
        titulo: "Glastonbury: 50 años sin publicidad — la masterclass de comunidad de marca",
        tiktok: {
          hook: "Glastonbury lleva 50 años sin necesitar publicidad. 200.000 personas en lista de espera para entradas sin lineup confirmado.",
          duracion: "50 seg",
          workflow_spaces: {
            resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook aéreo → Image Gen (Nano Banana Pro · 9:16 · 2K) pantallas 2–5 → Voiceover (11Labs) → Premiere Pro",
            pasos: [
              { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Glastonbury festival aerial drone massive crowd muddy fields Pyramid Stage golden hour cinematic'" },
              { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–5: comunidad, pertenencia, árbol de referidos" },
              { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion cálido → .mp3" },
              { paso: 4, nodo: "After Effects", detalle: "Árbol de referidos animado: 1→3→9" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",     texto: "GLASTONBURY:\n50 AÑOS.\nSIN UN SOLO AVISO.",                                                                                    animacion: "Tipografía festiva sobre campo.",              prompt_imagen: "Glastonbury festival aerial massive crowd muddy fields Pyramid Stage British summer --ar 9:16", prompt_video: "Glastonbury aerial drone crowd iconic stage golden hour cinematic" },
            { tiempo: "3–13s",  tipo: "DATOS",    texto: "→ 200.000 registradas\n→ Entradas en 6 minutos\n→ Sin haber visto el lineup\n→ Desde 1970",                                     animacion: "Cada punto como sello. Verde.",                prompt_imagen: "Glastonbury ticket demand massive waiting list community loyalty cultural institution --ar 9:16", prompt_video: null },
            { tiempo: "13–24s", tipo: "POR QUÉ",  texto: "No se vende como festival.\nSe vende como pertenencia.\n\nIr no es ver música.\nEs ser parte de algo que dura toda la vida.",   animacion: "Split: festival vs amigos recordando.",        prompt_imagen: "Friends Glastonbury belonging over music lifelong memory warm cinematic --ar 9:16", prompt_video: null },
            { tiempo: "24–35s", tipo: "LECCIÓN",  texto: "Las marcas que construyen comunidad\nno necesitan convencer.\n\nSus comunidades los convencen por ellos.",                       animacion: "Cita visual. Simplicidad extrema.",            prompt_imagen: null, prompt_video: null },
            { tiempo: "35–50s", tipo: "CTA",      texto: "El objetivo de cualquier experiencia:\nque la gente quiera volver\ny traiga a alguien más.\n\n¿Fuiste a algo así? 👇",          animacion: "Árbol 1→3→9. Verde.",                         prompt_imagen: "Organic community growth tree referral network warm human --ar 9:16", prompt_video: null },
          ],
          locucion_texto: "Glastonbury lleva 50 años sin publicidad. Doscientas mil personas en lista de espera para entradas que se agotan en seis minutos sin haber visto el lineup. No se vende como festival. Se vende como pertenencia. Las marcas que construyen comunidad no necesitan convencer. Sus comunidades los convencen por ellos. El objetivo de cualquier experiencia: que la gente quiera volver y traiga a alguien más."
        },
        instagram: {
          tipo: "Carrusel", slides: 6, titulo: "Glastonbury: el manual de comunidad que nadie enseña",
          caption: "200.000 en lista sin ver el lineup. Eso es poder de comunidad. 🎪",
          hashtags: "#Glastonbury #ComunidadDeMarca #FestivalMarketing #BrandCommunity",
          workflow_carrusel: {
            resumen: "Lista 6 prompts festival británico → Image Gen (Nano Banana Pro · 4:5 · 2K) batch → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Verde, barro, calidez" },
              { paso: 2, nodo: "Designer", detalle: "Datos de demanda en tipografía grande" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" },
            ]
          },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Cuál tiene mejor identidad de marca?' → Glastonbury / Coachella / Lollapalooza / Primavera Sound" },
          guion_slides: [
            { numero: 1, titulo: "GLASTONBURY",              subtitulo: "50 años sin publicidad", cuerpo: "",                                                          prompt_imagen: "Glastonbury iconic editorial cover timeless brand --ar 4:5" },
            { numero: 2, titulo: "Los números",              cuerpo: "200.000 registradas. Entradas en 6 min. Sin lineup. Desde 1970.",                                prompt_imagen: "Glastonbury demand infographic ticket scarcity retro festival --ar 4:5" },
            { numero: 3, titulo: "No venden música",         cuerpo: "Venden pertenencia. Glastonbury se vuelve parte de tu identidad.",                              prompt_imagen: "Glastonbury wristband identity belonging symbol community --ar 4:5" },
            { numero: 4, titulo: "La comunidad es el marketing", cuerpo: "200.000 personas son su equipo de marketing. Todo orgánico.",                              prompt_imagen: "Organic word of mouth community spreading experience --ar 4:5" },
            { numero: 5, titulo: "¿Qué aprendemos?",        cuerpo: "Diseñar para la pertenencia, no para la asistencia. Eso construye décadas.",                   prompt_imagen: "Belonging design generational brand loyalty --ar 4:5" },
            { numero: 6, titulo: "¿Tu evento tiene comunidad?", cuerpo: "¿La gente vuelve porque quiere o porque te contratan?",                                    prompt_imagen: "Brand vs service community loyalty vs transactional --ar 4:5" },
          ]
        }
      },
      {
        date: "Jue 1/5", pilar: "OFICIO",
        titulo: "El arte del moodboard que convence antes de hablar de precio",
        tiktok: {
          hook: "Antes de que el cliente diga que el presupuesto es poco, un buen moodboard ya ganó la presentación.",
          duracion: "50 seg",
          workflow_spaces: {
            resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para moodboards de ejemplo → Voiceover (11Labs) → After Effects con reveales cinematográficos",
            pasos: [
              { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantalla 1: moodboard caótico vs ordenado. Pantallas 2–4: componentes de un moodboard profesional" },
              { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 3, nodo: "After Effects", detalle: "Reveales de imagen: panel que se abre, zoom in con motion blur" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",          texto: "ANTES DE QUE HABLEN\nDE PRESUPUESTO,\nEL MOODBOARD\nYA GANÓ LA REUNIÓN.",                                          animacion: "Texto con impacto. Fondo negro.",                     prompt_imagen: "Professional moodboard winning presentation client impressed dark studio --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "QUÉ ES",        texto: "Un moodboard no es un collage.\n\nEs la primera conversación visual\nentre vos y el cliente.\nSin palabras técnicas.", animacion: "Collage caótico → moodboard ordenado.",               prompt_imagen: "Chaotic collage vs professional curated moodboard comparison before after --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "COMPONENTES",   texto: "Un buen moodboard tiene:\n→ Paleta de color definida\n→ Referencias de textura\n→ Tipografías como emoción\n→ Una imagen rectora",  animacion: "Cada componente aparece y encaja.",      prompt_imagen: "Professional moodboard components color palette textures typography key image --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "EL TRUCO",      texto: "No muestra cómo va a quedar.\nMuestra CÓMO VA A SENTIRSE.\n\nEsa diferencia lo cambia todo.",                        animacion: "Dos palabras clave. Una brilla.",                     prompt_imagen: null, prompt_video: null },
            { tiempo: "36–50s", tipo: "CTA",           texto: "¿Usás moodboards\nantes de las reuniones?\n¿Cuál herramienta usás? 👇",                                             animacion: "Oscuro. Flecha.",                                     prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Antes de que el cliente diga que el presupuesto es poco, un buen moodboard ya ganó la presentación. Un moodboard no es un collage. Es la primera conversación visual entre vos y el cliente, sin palabras técnicas. Los componentes: paleta de color definida, referencias de textura, tipografías como emoción y una imagen rectora que lo une todo. El truco: no muestra cómo va a quedar. Muestra cómo va a sentirse. Esa diferencia lo cambia todo."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "Cómo hacer un moodboard que gana clientes",
          caption: "Antes de hablar de precio, el moodboard ya ganó la reunión. 🎨",
          hashtags: "#Moodboard #DesignProcess #CreativeDirection #EventDesign #Pitch",
          workflow_carrusel: {
            resumen: "Lista 5 prompts de componentes visuales → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Paleta, texturas, tipografías, imagen rectora" },
              { paso: 2, nodo: "Designer", detalle: "Layout de moodboard profesional sobre cada imagen" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Guardable de referencia" },
            ]
          },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Qué herramienta usás para hacer moodboards?'" },
          guion_slides: [
            { numero: 1, titulo: "EL MOODBOARD QUE GANA", subtitulo: "Antes de hablar de precio", cuerpo: "",                                                        prompt_imagen: "Professional moodboard cover dark design studio creative direction --ar 4:5" },
            { numero: 2, titulo: "No es un collage",       cuerpo: "Es la primera conversación visual. Sin palabras técnicas.",                                       prompt_imagen: "Chaotic collage vs curated moodboard before after --ar 4:5" },
            { numero: 3, titulo: "Los 4 componentes",      cuerpo: "Paleta definida · Texturas · Tipografía como emoción · Imagen rectora",                          prompt_imagen: "Moodboard components color palette textures typography key image --ar 4:5" },
            { numero: 4, titulo: "El truco",               cuerpo: "No muestra cómo va a quedar. Muestra cómo va a sentirse.",                                       prompt_imagen: "Feeling over appearance concept emotional design language --ar 4:5" },
            { numero: 5, titulo: "Las herramientas",       cuerpo: "Figma, Milanote, Pinterest o el nodo Designer de Freepik Spaces.",                               prompt_imagen: "Moodboard tools Figma Milanote Pinterest Spaces --ar 4:5" },
          ]
        }
      },
      {
        date: "Vie 2/5", pilar: "PROCESO",
        titulo: "Cómo una agencia produce contenido visual de campaña sin equipo de rodaje",
        tiktok: {
          hook: "Sin fotógrafo, sin camarógrafo, sin locación. Así produce contenido visual una agencia de marketing en 2026.",
          duracion: "50 seg",
          workflow_spaces: {
            resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para pantallas del proceso → Voiceover (11Labs) → Premiere Pro / After Effects",
            pasos: [
              { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas mostrando el proceso de producción visual moderno de agencia" },
              { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Montar el proceso con motion graphics que ilustren cada etapa" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",          texto: "SIN FOTÓGRAFO.\nSIN CAMARÓGRAFO.\nSIN LOCACIÓN.\n\nAsí produce una agencia\nen 2026.", animacion: "Tres líneas tachándose. Impacto.", prompt_imagen: "Modern agency production no traditional crew 2026 concept dark cinematic --ar 9:16", prompt_video: null },
            { tiempo: "3–15s",  tipo: "EL CAMBIO",     texto: "El cambio no fue tecnológico.\nFue conceptual.\n\nUna agencia ya no necesita\nun set para contar una historia.\nNecesita una buena idea\ny un sistema de producción.", animacion: "Contraste set tradicional vs proceso moderno.", prompt_imagen: "Traditional production set vs modern agency workflow conceptual change --ar 9:16", prompt_video: null },
            { tiempo: "15–28s", tipo: "EL PROCESO",    texto: "1. Guion e intención creativa\n2. Visual generado desde la idea\n3. Audio y voz de marca\n4. Montaje y color grade profesional", animacion: "Cuatro pasos animados.", prompt_imagen: "Modern production process script visual audio color grade professional --ar 9:16", prompt_video: null },
            { tiempo: "28–38s", tipo: "LO QUE NO CAMBIA", texto: "Lo que la IA no reemplaza:\n\nEl criterio creativo.\nEl ojo del director de arte.\nLa decisión de qué contar.", animacion: "Frase contundente.", prompt_imagen: "Creative direction judgment art director irreplaceable human --ar 9:16", prompt_video: null },
            { tiempo: "38–50s", tipo: "CTA",           texto: "¿Tu agencia ya adaptó\nel proceso productivo?\n👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Sin fotógrafo, sin camarógrafo, sin locación. Así produce contenido visual una agencia de marketing en 2026. El cambio no fue tecnológico. Fue conceptual. Una agencia ya no necesita un set para contar una historia. Necesita una buena idea y un sistema de producción. Los cuatro pasos: guion e intención creativa, visual generado desde la idea, audio y voz de marca, montaje y color grade profesional. Lo que la IA no reemplaza: el criterio creativo, el ojo del director de arte, la decisión de qué contar."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "Producción de campaña sin crew — el proceso 2026",
          caption: "Sin set. Sin crew. El proceso cambió. Lo que no cambia es el criterio creativo. ⚙️",
          hashtags: "#ContentProduction #AgencyProcess #ProduccionCreativa #MarketingExperiencial",
          workflow_carrusel: {
            resumen: "Lista 5 prompts proceso productivo → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Proceso moderno de agencia, etapas del flujo, cambio conceptual" },
              { paso: 2, nodo: "Designer", detalle: "4 pasos del proceso con tipografía clara" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" },
            ]
          },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Tu equipo ya adaptó el proceso productivo?' → Sí / En transición / Todavía no / No aplica" },
          guion_slides: [
            { numero: 1, titulo: "PRODUCCIÓN SIN CREW", subtitulo: "El proceso 2026", cuerpo: "", prompt_imagen: "Modern agency production no crew cover dark 2026 --ar 4:5" },
            { numero: 2, titulo: "El cambio fue conceptual", cuerpo: "No tecnológico. Ya no necesitás un set para contar una historia.", prompt_imagen: "Conceptual production change traditional vs modern agency --ar 4:5" },
            { numero: 3, titulo: "Los 4 pasos", cuerpo: "Guion → Visual generado → Audio y voz → Montaje profesional", prompt_imagen: "4 step production process script visual audio edit --ar 4:5" },
            { numero: 4, titulo: "Lo que no cambia", cuerpo: "El criterio creativo. El ojo del DA. La decisión de qué contar.", prompt_imagen: "Irreplaceable creative direction human judgment art director --ar 4:5" },
            { numero: 5, titulo: "¿Tu proceso evolucionó?", cuerpo: "El flujo cambió. La calidad del pensamiento creativo, no.", prompt_imagen: "Process evolution creative quality constant agency --ar 4:5" },
          ]
        }
      },
    ]
  },
  {
    number: 3, block: 1, theme: "Estrategia y diferenciación",
    days: [
      {
        date: "Lun 5/5", pilar: "INSPIRA",
        titulo: "Superblue Miami: arte que cobra entrada como un concierto",
        tiktok: {
          hook: "¿Cuánto pagarías por entrar a un museo sin cuadros, sin esculturas, sin nada fijo?",
          duracion: "45 seg",
          workflow_spaces: {
            resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook → Image Gen (Nano Banana Pro · 9:16 · 2K) para datos y lección → Voiceover (11Labs) → Premiere Pro",
            pasos: [
              { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Superblue Miami immersive light art no physical pieces visitors in wonder slow motion cinematic'" },
              { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: datos, insight, lección" },
              { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",     texto: "¿CUÁNTO PAGARÍAS\nPOR ENTRAR A UN MUSEO\nSIN NADA FÍSICO?",                                                animacion: "Pregunta línea a línea.",                              prompt_imagen: "Superblue Miami immersive light installation no physical art visitors wonder --ar 9:16", prompt_video: "Visitors walking glowing immersive light installation wonder awe slow motion" },
            { tiempo: "3–14s",  tipo: "CONTEXTO", texto: "$45 promedio.\nCapacidad limitada e intencional.\nExperiencias que cambian cada temporada.",                animacion: "Datos con ticker.",                                    prompt_imagen: "Superblue premium immersive experience limited capacity luxury --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "INSIGHT",  texto: "Lo que venden no se puede\ndownloadear ni comprar en Amazon.\n\nSolo se puede vivir.",                       animacion: "Lista en rojo de lo que NO se puede. Última frase blanca.", prompt_imagen: "Cannot download experience concept irreplaceable live moment --ar 9:16", prompt_video: null },
            { tiempo: "26–38s", tipo: "LECCIÓN",  texto: "El valor no está en el objeto.\nEstá en el momento.\nEl momento no se puede copiar.",                       animacion: "Tres frases. Pausa. Impacto.",                          prompt_imagen: null, prompt_video: null },
            { tiempo: "38–45s", tipo: "CTA",      texto: "¿Cuánto vale un momento\nque no se puede guardar? 👇",                                                     animacion: "Oscuro. Cálido.",                                      prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "¿Cuánto pagarías por entrar a un museo sin cuadros, sin esculturas, sin nada fijo? Superblue Miami cobra cuarenta y cinco dólares por experiencias que cambian cada temporada con capacidad limitada. Lo que venden no se puede downloadear ni comprar en Amazon. Solo se puede vivir. El valor no está en el objeto. Está en el momento. Y el momento no se puede copiar."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "Superblue: cuando la experiencia vale más que el objeto",
          caption: "No se puede downloadear. Solo se puede vivir. Ese es el negocio del futuro. ✨",
          hashtags: "#Superblue #ExperienceEconomy #ArteInmersivo #ExperientialMarketing",
          workflow_carrusel: {
            resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Arte inmersivo, luz, oscuridad, magia" },
              { paso: 2, nodo: "Designer", detalle: "Precio, datos, frase de cierre" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" },
            ]
          },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Fuiste a alguna experiencia inmersiva? 👇'" },
          guion_slides: [
            { numero: 1, titulo: "SUPERBLUE MIAMI",          subtitulo: "La experiencia que vale más que el objeto", cuerpo: "",                                       prompt_imagen: "Superblue Miami immersive cover glowing light dark premium --ar 4:5" },
            { numero: 2, titulo: "$45 por nada tangible",    cuerpo: "Sin cuadros. Sin esculturas. Solo el momento.",                                                 prompt_imagen: "Experience economy ticket price value proposition --ar 4:5" },
            { numero: 3, titulo: "No se puede copiar",       cuerpo: "No se descarga ni se screenshottea con el mismo efecto. Solo se vive.",                         prompt_imagen: "Irreplaceable live moment cannot download --ar 4:5" },
            { numero: 4, titulo: "El modelo",                cuerpo: "Arte que cambia + capacidad limitada = urgencia real. La escasez es el diseño.",                prompt_imagen: "Scarcity by design limited luxury rotating art --ar 4:5" },
            { numero: 5, titulo: "Para las marcas",          cuerpo: "El valor no está en el objeto. Está en el momento.",                                            prompt_imagen: "Brand value in moments experiential economy --ar 4:5" },
          ]
        }
      },
      {
        date: "Mar 6/5", pilar: "INDUSTRIA",
        titulo: "El Eras Tour: la masterclass de marketing más cara de la historia",
        tiktok: {
          hook: "Taylor Swift no contrató una agencia de marketing. Taylor Swift es una agencia de marketing.",
          duracion: "55 seg",
          workflow_spaces: {
            resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para todas las pantallas → Voiceover (11Labs) → Premiere Pro / After Effects",
            pasos: [
              { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "6 pantallas: concierto masivo, datos, fórmula, fans, lección" },
              { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 3, nodo: "After Effects", detalle: "$2.077M counter con keyframe, línea de tiempo de eras animada" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",     texto: "TAYLOR SWIFT NO CONTRATÓ\nUNA AGENCIA.\n\nTAYLOR SWIFT\nES UNA AGENCIA.",                              animacion: "Primera frase gris. Segunda en rojo.",                prompt_imagen: "Massive concert stadium 70000 people epic scale cinematic aerial --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "DATOS",    texto: "$2.077 millones.\n149 ciudades. 4 continentes.\nEl tour más exitoso de la historia.",                  animacion: "Cada número con ticker.",                             prompt_imagen: "Record breaking tour revenue billions world tour scale data visualization --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "FÓRMULA",  texto: "Eras como capítulos narrativos.\nEaster eggs que activan a los fans.\nLas Swifties como marketing.", animacion: "Lista con íconos.",                                   prompt_imagen: "Taylor Swift Eras chapters storytelling fan engagement mechanisms --ar 9:16", prompt_video: null },
            { tiempo: "26–37s", tipo: "LECCIÓN",  texto: "Ella no vende canciones.\nVende momentos en el tiempo\nque la gente quiere vivir para siempre.",      animacion: "Cita visual. Pausa 1s.",                              prompt_imagen: null, prompt_video: null },
            { tiempo: "37–55s", tipo: "CTA",      texto: "Ese es el negocio del marketing\nexperiencial: crear esos momentos.\n\n¿Fuiste al Eras Tour? 👇",     animacion: "Negro. Simple.",                                     prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Taylor Swift no contrató una agencia de marketing. Taylor Swift es una agencia de marketing. El Eras Tour: dos mil setenta y siete millones de dólares, récord mundial. Las eras como capítulos narrativos, easter eggs que activan fans, y las Swifties como departamento de marketing. Ella no vende canciones. Vende momentos en el tiempo que la gente quiere vivir para siempre. Ese es el negocio del marketing experiencial."
        },
        instagram: {
          tipo: "Carrusel", slides: 6, titulo: "Eras Tour: la masterclass de marketing experiencial",
          caption: "$2.077M sin vender un producto físico. Solo experiencias. 🎤",
          hashtags: "#TaylorSwift #ErasTour #MarketingExperiencial #BrandStrategy",
          workflow_carrusel: {
            resumen: "Lista 6 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Concierto masivo, eras visuales, fans" },
              { paso: 2, nodo: "Designer", detalle: "Números grandes, datos del tour" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" },
            ]
          },
          historia: { tipo: "ENCUESTA", instruccion: "Historia → Poll '¿Fuiste al Eras Tour?' → Yo fui 🙋 / Conozco alguien / No / ¿Qué es?" },
          guion_slides: [
            { numero: 1, titulo: "ERAS TOUR",              subtitulo: "La masterclass de marketing más grande", cuerpo: "",                                           prompt_imagen: "Eras Tour cover iconic concert cultural phenomenon premium --ar 4:5" },
            { numero: 2, titulo: "$2.077 millones",        cuerpo: "Sin productos. Solo experiencias. El tour más exitoso de la historia.",                           prompt_imagen: "Record revenue 2 billion experiences only --ar 4:5" },
            { numero: 3, titulo: "Las Eras como capítulos",cuerpo: "Cada era es un universo visual y emocional. Eso construye devoción.",                            prompt_imagen: "Brand chapters narrative visual evolution timeline --ar 4:5" },
            { numero: 4, titulo: "Los fans son el marketing",cuerpo: "Las Swifties generaron millones de contenido orgánico. Sin planear nada.",                    prompt_imagen: "Fan marketing organic content friendship bracelets viral --ar 4:5" },
            { numero: 5, titulo: "La lección",             cuerpo: "No vendas canciones. Vende momentos que la gente quiera vivir para siempre.",                    prompt_imagen: "Moments over products experience economy emotional brand --ar 4:5" },
            { numero: 6, titulo: "¿Tu marca tiene Eras?",  cuerpo: "¿Hay capítulos? ¿Hay fans que defiendan lo que hacés?",                                          prompt_imagen: "Brand chapters question loyal community --ar 4:5" },
          ]
        }
      },
      {
        date: "Mié 7/5", pilar: "CULTURA",
        titulo: "Burning Man: la economía del regalo y lo que las marcas no entienden",
        tiktok: {
          hook: "El festival más influyente del mundo no acepta dinero. Y eso lo convirtió en el modelo más copiado del planeta.",
          duracion: "50 seg",
          workflow_spaces: {
            resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook desierto nocturno → Image Gen (Nano Banana Pro · 9:16 · 2K) para concepto y lección → Voiceover (11Labs) → Premiere Pro",
            pasos: [
              { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Burning Man desert festival massive fire sculptures community camp surreal night aerial cinematic'" },
              { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: economía del regalo, comunidad, lección" },
              { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",           texto: "EL FESTIVAL MÁS INFLUYENTE\nNO ACEPTA DINERO.\n\nY ESO LO HIZO\nEL MÁS COPIADO.",                                    animacion: "Fuego en el fondo. Blanco sobre naranja.",           prompt_imagen: "Burning Man desert night massive fire sculptures community surreal aerial --ar 9:16", prompt_video: "Burning Man aerial fire installations community camp night cinematic" },
            { tiempo: "3–14s",  tipo: "RADICAL GIFTING",texto: "Burning Man: 'radical gifting'.\n\nNo hay compra-venta.\nTodo se regala o comparte.\nLa moneda es la participación.", animacion: "Regalo. Moneda tachada.",                             prompt_imagen: "Radical gift economy no money sharing community participation currency --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "LA INFLUENCIA",  texto: "70.000 personas radicalmente activas.\nInfluencia directa en Silicon Valley.\n40 años de cultura viva.",              animacion: "Árbol de influencia.",                               prompt_imagen: "Cultural influence Silicon Valley connection 40 year impact global adoption --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "LECCIÓN",        texto: "Las marcas que solo miden ROI\nno entienden el poder\nde crear sin transacción.",                                     animacion: "Contraste ROI vs comunidad.",                         prompt_imagen: null, prompt_video: null },
            { tiempo: "36–50s", tipo: "CTA",            texto: "¿Qué puede regalar tu marca\nen su próxima experiencia?\n\nNo el producto. Algo que valga más. 👇",                   animacion: "Naranja oscuro.",                                     prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "El festival más influyente del mundo no acepta dinero. Burning Man opera con radical gifting: sin compra-venta, todo se regala, la moneda es la participación. Setenta mil personas, influencia directa en Silicon Valley, cuarenta años de cultura viva. Las marcas que solo miden retorno inmediato no entienden el poder de crear sin transacción. ¿Qué puede regalar tu marca en su próxima experiencia?"
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "Burning Man y la economía del regalo",
          caption: "Sin dinero. Sin transacciones. El festival más influyente. 🔥",
          hashtags: "#BurningMan #GiftEconomy #CommunityMarketing #ExperienceDesign",
          workflow_carrusel: {
            resumen: "Lista 5 prompts desierto/comunidad → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Desierto nocturno, fuego, comunidad cálida, naranja oscuro" },
              { paso: 2, nodo: "Designer", detalle: "Tipografía impactante, acento naranja" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" },
            ]
          },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Conocías la economía del regalo de Burning Man? 🔥'" },
          guion_slides: [
            { numero: 1, titulo: "BURNING MAN",              subtitulo: "La economía del regalo", cuerpo: "",                                                         prompt_imagen: "Burning Man cover desert night fire art radical community orange --ar 4:5" },
            { numero: 2, titulo: "No acepta dinero",         cuerpo: "70.000 personas. Sin transacciones. Todo se regala. La participación es la moneda.",            prompt_imagen: "Gift economy concept no money sharing community --ar 4:5" },
            { numero: 3, titulo: "La influencia",            cuerpo: "Silicon Valley adoptó sus principios. 40 años de cultura viva.",                                prompt_imagen: "Cultural influence Silicon Valley adoption 40 years --ar 4:5" },
            { numero: 4, titulo: "La lección",               cuerpo: "El ROI inmediato no es lo único que existe. Crear sin transacción tiene un poder diferente.",   prompt_imagen: "Long term brand building vs immediate ROI community value --ar 4:5" },
            { numero: 5, titulo: "¿Qué puede regalar tu marca?", cuerpo: "No el producto. Una experiencia, un conocimiento, un momento.",                           prompt_imagen: "Brand gifting beyond product valuable moments --ar 4:5" },
          ]
        }
      },
      {
        date: "Jue 8/5", pilar: "OFICIO",
        titulo: "El diseño de sonido en eventos — lo que nadie ve pero todos sienten",
        tiktok: {
          hook: "El error más común en eventos: gastar millones en lo visual y nada en el sonido. Y el sonido es lo primero que sentís.",
          duracion: "50 seg",
          workflow_spaces: {
            resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) con estética de audio/frecuencias → Voiceover (11Labs) → After Effects con formas de onda animadas",
            pasos: [
              { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas: formas de onda, zonas de sonido, frecuencias y emoción" },
              { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 3, nodo: "After Effects", detalle: "Formas de onda animadas sincronizadas con la locución" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",         texto: "GASTAN MILLONES\nEN LO VISUAL.\n\nY EL SONIDO\nES LO PRIMERO QUE SENTÍS.",                                          animacion: "Forma de onda pulsando. Impacto.",                    prompt_imagen: "Audio waveform concept sound design events frequency visualization dark --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "POR QUÉ",      texto: "El sonido llega al cerebro\n0.05 segundos antes que la imagen.\n\nSentís el evento\nantes de verlo.",                animacion: "0.05s aparece grande.",                               prompt_imagen: "Sound arrives brain faster than image neuroscience event experience --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "LOS ERRORES",  texto: "Los 3 errores comunes:\n→ Música sin curatoría\n→ Volumen sin zonas\n→ Silencio no diseñado",                       animacion: "Lista en rojo.",                                      prompt_imagen: "Sound design mistakes events bad music curation volume zones silence --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "LO QUE FUNCIONA", texto: "BPM para el ingreso.\nAmbient para la zona VIP.\nSilencio antes del momento clave.",                            animacion: "Tres zonas como frecuencias.",                        prompt_imagen: "Professional event sound zones BPM ambient strategic silence --ar 9:16", prompt_video: null },
            { tiempo: "36–50s", tipo: "CTA",          texto: "¿Hay un director de sonido\nen tu próximo evento\no alguien que pone Spotify? 👇",                                    animacion: "Verde oscuro. Flecha.",                               prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "El error más común en eventos: gastar millones en lo visual y nada en el sonido. El sonido llega al cerebro 0.05 segundos antes que la imagen. Sentís el evento antes de verlo. Los tres errores más comunes: música sin curatoría, volumen sin zonas diferenciadas, silencio no diseñado. Lo que funciona: BPM específico para el ingreso, ambient para la VIP, y silencio estratégico antes del momento clave."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "El diseño de sonido en eventos — guía práctica",
          caption: "Sentís el evento antes de verlo. El sonido es el primer diseño. 🔊",
          hashtags: "#SoundDesign #EventProduction #ExperienceDesign #Oficio",
          workflow_carrusel: {
            resumen: "Lista 5 prompts audio/frecuencias → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Formas de onda, frecuencias, zonas de sonido visualizadas" },
              { paso: 2, nodo: "Designer", detalle: "Dato 0.05s grande, lista de errores y soluciones" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel de referencia" },
            ]
          },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿En tu próximo evento hay un director de sonido o alguien que pone Spotify?'" },
          guion_slides: [
            { numero: 1, titulo: "DISEÑO DE SONIDO EN EVENTOS", subtitulo: "Lo que nadie ve pero todos sienten", cuerpo: "",                                         prompt_imagen: "Sound design event cover audio waveform dark professional --ar 4:5" },
            { numero: 2, titulo: "0.05 segundos antes",          cuerpo: "El sonido llega al cerebro 0.05s antes que la imagen. Sentís el evento antes de verlo.",  prompt_imagen: "Sound faster than image neuroscience brain waveform --ar 4:5" },
            { numero: 3, titulo: "Los 3 errores comunes",        cuerpo: "Música sin curatoría · Volumen sin zonas · Silencio no diseñado",                          prompt_imagen: "Sound mistakes events bad practices red flags --ar 4:5" },
            { numero: 4, titulo: "Lo que funciona",              cuerpo: "BPM para el ingreso. Ambient para VIP. Silencio antes del momento clave.",                 prompt_imagen: "Professional sound zones BPM ambient silence event design --ar 4:5" },
            { numero: 5, titulo: "El director de sonido",        cuerpo: "No es el que pone Spotify. Es el que diseña la energía del espacio.",                     prompt_imagen: "Sound director professional creative sound curation event --ar 4:5" },
          ]
        }
      },
      {
        date: "Vie 9/5", pilar: "PROCESO",
        titulo: "Cómo presentar una campaña que se aprueba en la primera reunión",
        tiktok: {
          hook: "El 80% de las campañas se aprueban o rechazan en los primeros 3 minutos de presentación. Así se preparan los que aprueban.",
          duracion: "55 seg",
          workflow_spaces: {
            resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para pantallas del proceso → Voiceover (11Labs) → Premiere Pro / After Effects",
            pasos: [
              { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando el proceso de presentación de campaña" },
              { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" },
              { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Montar con animaciones de slides de presentación" },
            ]
          },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",       texto: "EL 80% DE LAS CAMPAÑAS\nSE APRUEBAN O RECHAZAN\nEN LOS PRIMEROS 3 MINUTOS.", animacion: "Reloj. Impacto.", prompt_imagen: "Campaign approved or rejected first 3 minutes presentation moment dark --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "POR QUÉ",    texto: "No por la calidad de la idea.\nSino por cómo se presenta.\n\nEl cliente no compra la campaña.\nCompra la seguridad de que\nva a funcionar.", animacion: "Idea vs seguridad.", prompt_imagen: "Client buys security not idea campaign presentation psychology --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "EL ORDEN",   texto: "El orden que funciona:\n\n1. El problema del cliente\n   (que él ya siente)\n2. El insight que lo cambia todo\n3. La campaña como solución\n4. Por qué va a funcionar", animacion: "Escalera de confianza.", prompt_imagen: "Presentation order problem insight campaign why it works trust --ar 9:16", prompt_video: null },
            { tiempo: "26–38s", tipo: "EL INSIGHT", texto: "El momento que define todo:\nel slide del insight.\n\nSi el cliente dice 'nunca lo había\npensado así', ganaste la sala.", animacion: "El momento clave.", prompt_imagen: "Insight slide key moment winning the room aha moment presentation --ar 9:16", prompt_video: null },
            { tiempo: "38–55s", tipo: "CTA",        texto: "¿Tu última presentación\nempezó por el problema del cliente\no por tu agencia?\n👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "El 80% de las campañas se aprueban o rechazan en los primeros tres minutos de presentación. No por la calidad de la idea. Sino por cómo se presenta. El cliente no compra la campaña. Compra la seguridad de que va a funcionar. El orden que funciona: el problema del cliente, el insight que lo cambia todo, la campaña como solución, y por qué va a funcionar. El momento que define todo: el slide del insight. Si el cliente dice 'nunca lo había pensado así', ganaste la sala."
        },
        instagram: {
          tipo: "Carrusel", slides: 5, titulo: "Cómo presentar una campaña que se aprueba en la primera",
          caption: "No vendés la campaña. Vendés la seguridad de que va a funcionar. Esa diferencia lo cambia todo. 🎯",
          hashtags: "#PresentacionCreativa #AgencyLife #CampaignPresentation #Pitch #MarketingB2B",
          workflow_carrusel: {
            resumen: "Lista 5 prompts proceso de presentación → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip",
            pasos: [
              { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Orden de presentación, el momento del insight, escalera de confianza" },
              { paso: 2, nodo: "Designer", detalle: "Estructura visual clara, escalera numerada" },
              { paso: 3, nodo: "Exportar .zip", detalle: "Guardable de referencia" },
            ]
          },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Tu presentación empieza por?' → El problema del cliente / Tu agencia / La idea / El presupuesto" },
          guion_slides: [
            { numero: 1, titulo: "LA CAMPAÑA QUE SE APRUEBA", subtitulo: "En la primera reunión", cuerpo: "", prompt_imagen: "Campaign approved first meeting cover dark professional --ar 4:5" },
            { numero: 2, titulo: "Lo que el cliente compra", cuerpo: "No la campaña. La seguridad de que va a funcionar.", prompt_imagen: "Client buys security not campaign psychology --ar 4:5" },
            { numero: 3, titulo: "El orden que funciona", cuerpo: "Problema → Insight → Campaña → Por qué funciona", prompt_imagen: "Presentation order stairs trust building --ar 4:5" },
            { numero: 4, titulo: "El momento del insight", cuerpo: "Si el cliente dice 'nunca lo había pensado así', ganaste la sala.", prompt_imagen: "Insight moment aha winning the room presentation --ar 4:5" },
            { numero: 5, titulo: "¿Tu presentación empieza bien?", cuerpo: "Por el problema del cliente, no por tu agencia.", prompt_imagen: "Start with client problem not agency pitch --ar 4:5" },
          ]
        }
      },
    ]
  },
  {
    number: 4, block: 1, theme: "Casos, procesos y posicionamiento",
    days: [
      { date: "Lun 12/5", pilar: "INSPIRA", titulo: "Gentle Monster: la marca que construyó museos como estrategia de venta",
        tiktok: { hook: "Una marca de anteojos que gasta más en arte que en publicidad. Y vende más que todas las demás.", duracion: "45 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Luxury eyewear brand museum store surreal art installation avant-garde retail slow cinematic pan'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: modelo, insight, lección" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "UNA MARCA DE ANTEOJOS\nQUE GASTA MÁS EN ARTE\nQUE EN PUBLICIDAD.", animacion: "Elegancia extrema.", prompt_imagen: "Gentle Monster luxury eyewear museum store surreal art installation avant-garde --ar 9:16", prompt_video: "Luxury eyewear museum store slow cinematic pan surreal art installations architectural" },
            { tiempo: "3–14s",  tipo: "MODELO",  texto: "Gentle Monster, Seúl.\nCada local es instalación de arte.\nCambia cada 6 semanas.\nSin publicidad. La prensa habla.", animacion: "Datos minimalistas.", prompt_imagen: "Gentle Monster Seoul flagship rotating art exhibitions architectural marvel --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "INSIGHT", texto: "Si creás algo tan extraordinario\nque la gente QUIERE ir a verlo,\nno necesitás convencerlos de que compren.", animacion: "Lógica en tres pasos.", prompt_imagen: "Destination retail logic desire over push extraordinary experience --ar 9:16", prompt_video: null },
            { tiempo: "26–45s", tipo: "CTA",     texto: "El retail del futuro no vende.\nCrea destinos.\n\n¿Tu marca crea destinos? 👇", animacion: "Negro. Frase sola.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Una marca de anteojos que gasta más en arte que en publicidad. Gentle Monster, Seúl: cada local es una instalación de arte que cambia cada seis semanas. Sin publicidad. La prensa habla. Si creás algo extraordinario que la gente quiere visitar, no necesitás convencerlos. El retail del futuro no vende. Crea destinos." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Gentle Monster: retail como destino cultural", caption: "Sin publicidad. Cada local es un museo. 🕶️", hashtags: "#GentleMonster #RetailExperience #BrandStrategy #DestinationRetail",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Galería de lujo, minimalismo, arquitectura premium" }, { paso: 2, nodo: "Designer", detalle: "Tipografía editorial" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Conocías Gentle Monster? 🕶️'" },
          guion_slides: [ { numero: 1, titulo: "GENTLE MONSTER", subtitulo: "Retail como destino cultural", cuerpo: "", prompt_imagen: "Gentle Monster luxury cover museum retail avant-garde dark --ar 4:5" }, { numero: 2, titulo: "Cada local: un museo", cuerpo: "Instalaciones que cambian cada 6 semanas.", prompt_imagen: "Rotating art installation retail 6 weeks --ar 4:5" }, { numero: 3, titulo: "Sin publicidad", cuerpo: "La prensa cubre las instalaciones. Los visitantes generan el contenido.", prompt_imagen: "PR driven no paid media organic visitors --ar 4:5" }, { numero: 4, titulo: "La lógica del destino", cuerpo: "Algo extraordinario que la gente quiere visitar = no necesitás convencerlos.", prompt_imagen: "Destination retail logic desire over push --ar 4:5" }, { numero: 5, titulo: "¿Tu marca crea destinos?", cuerpo: "¿O solo puntos de venta?", prompt_imagen: "Future retail shareable destination --ar 4:5" } ] } },
      { date: "Mar 13/5", pilar: "INDUSTRIA", titulo: "El ROI del marketing experiencial — cómo medir lo que nadie sabe medir",
        tiktok: { hook: "La pregunta que paraliza a toda agencia: ¿cómo medís el retorno de una experiencia?", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética data/métricas → Voiceover (11Labs) → After Effects con gráficas animadas", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas de métricas, NPS, UGC" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Escala NPS animada" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",        texto: "¿CÓMO MEDÍS EL RETORNO\nDE UNA EXPERIENCIA?\n\nLa pregunta que paraliza.", animacion: "Signo de interrogación.", prompt_imagen: "ROI question mark experiential marketing measurement dark --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "INÚTILES",    texto: "Métricas de vanidad:\n→ Asistentes\n→ Shares\n→ Menciones sin contexto\n→ Costo por asistente", animacion: "Lista en rojo.", prompt_imagen: "Vanity metrics crossed out attendees shares mentions --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "REALES",      texto: "Las que importan:\n→ NPS post-evento\n→ UGC generado\n→ Conversión a lead\n→ Lifetime value\n→ % que recomienda", animacion: "Lista verde.", prompt_imagen: "Real event metrics NPS UGC conversion lifetime value --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "NPS",         texto: "El NPS es la clave:\n¿Cuántos recomendarían\nla experiencia?", animacion: "Escala NPS animada.", prompt_imagen: "Net Promoter Score scale key event metric --ar 9:16", prompt_video: null },
            { tiempo: "36–50s", tipo: "CTA",         texto: "¿Con qué métrica medís tus eventos? 👇", animacion: "Oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "La pregunta que paraliza a toda agencia: ¿cómo medís el retorno de una experiencia? Las métricas de vanidad: asistentes, shares, menciones, costo por persona. Las que importan: NPS post-evento, UGC generado, conversión a lead, lifetime value y porcentaje que recomienda. El NPS es la clave." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Las métricas de eventos que importan", caption: "Las métricas que importan no son las que te dijeron. 📊", hashtags: "#EventMetrics #NPS #ROI #DataDriven",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Rojo para inútiles, verde para reales" }, { paso: 2, nodo: "Designer", detalle: "NPS visual" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Cuál es la primera métrica que mirás después de un evento?'" },
          guion_slides: [ { numero: 1, titulo: "MÉTRICAS QUE IMPORTAN", subtitulo: "Y las que no", cuerpo: "", prompt_imagen: "Event metrics cover dark data real vs vanity --ar 4:5" }, { numero: 2, titulo: "Las inútiles", cuerpo: "Asistentes. Shares. Menciones. Vanidad pura.", prompt_imagen: "Vanity metrics red X --ar 4:5" }, { numero: 3, titulo: "Las reales", cuerpo: "NPS · UGC · Conversión · Lifetime value · % recomienda", prompt_imagen: "Real metrics green NPS UGC --ar 4:5" }, { numero: 4, titulo: "Por qué el NPS", cuerpo: "Cuántos recomendarían la experiencia. Eso mide si funcionó.", prompt_imagen: "NPS scale key indicator --ar 4:5" }, { numero: 5, titulo: "Definir antes", cuerpo: "Las métricas se definen ANTES del evento, no después.", prompt_imagen: "Metrics roadmap before event --ar 4:5" } ] } },
      { date: "Mié 14/5", pilar: "CULTURA", titulo: "Fuerza Bruta: el caso argentino que conquistó Broadway",
        tiktok: { hook: "Un espectáculo argentino sin sillas ni escenario fijo, donde el público es el protagonista. Fue a Broadway y ganó.", duracion: "50 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Immersive theater no seats audience surrounded performers water projections cinematic'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: expansión, por qué funciona, lección" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",     texto: "SIN SILLAS.\nSIN ESCENARIO FIJO.\nEL PÚBLICO ES EL PROTAGONISTA.\nY FUE A BROADWAY.", animacion: "Texto con impacto.", prompt_imagen: "Immersive theater no seats audience surrounded performers water projections --ar 9:16", prompt_video: "Immersive theater no seats performers surround audience water projection cinematic" },
            { tiempo: "3–14s",  tipo: "CONTEXTO", texto: "Fuerza Bruta, Buenos Aires, 2003.\nMás de 20 años. 60 países.\nNew York Times. Broadway.", animacion: "Mapa de expansión.", prompt_imagen: "Fuerza Bruta Argentine theater international success world tour --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "POR QUÉ",  texto: "No es teatro. No es concierto.\nEs una experiencia de 360°\ndonde no podés ser espectador pasivo.", animacion: "Categorías tachadas. Nueva.", prompt_imagen: "360 immersive experience active audience no passive spectator --ar 9:16", prompt_video: null },
            { tiempo: "26–50s", tipo: "CTA",      texto: "La Argentina tiene una de las industrias\ncreativas más poderosas del mundo.\nY muchas veces no lo sabemos.\n\n¿Fuiste a Fuerza Bruta? 👇", animacion: "Mapa brillando. Rojo.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Un espectáculo sin sillas, sin escenario fijo, donde el público es el protagonista. Fuerza Bruta, Buenos Aires, 2003. Más de veinte años, sesenta países, dos temporadas en Broadway. No es teatro, no es concierto. Es una experiencia de 360 grados donde no podés ser espectador pasivo. La Argentina tiene una de las industrias creativas más poderosas del mundo. Y muchas veces no lo sabemos." },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Fuerza Bruta: Buenos Aires → Broadway", caption: "Sin sillas. Sin escenario. Así se conquista el mundo. 🇦🇷", hashtags: "#FuerzaBruta #Argentina #TeatroInmersivo #CulturaArgentina",
          workflow_carrusel: { resumen: "Lista 6 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Teatro inmersivo, agua, luz, 360" }, { paso: 2, nodo: "Designer", detalle: "Mapa expansión, datos Broadway" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Fuiste a Fuerza Bruta?' → Sí, increíble / No pero quiero / ¿Qué es? / Fui en el exterior" },
          guion_slides: [ { numero: 1, titulo: "FUERZA BRUTA", subtitulo: "Buenos Aires → Broadway", cuerpo: "", prompt_imagen: "Fuerza Bruta immersive theater cover water projections cinematic --ar 4:5" }, { numero: 2, titulo: "Sin sillas. Sin escenario.", cuerpo: "El público se mueve dentro. Cada vez es diferente.", prompt_imagen: "360 theater moving audience no stage --ar 4:5" }, { numero: 3, titulo: "20 años. 60 países.", cuerpo: "De Buenos Aires al New York Times. Broadway.", prompt_imagen: "World map Argentine theater success --ar 4:5" }, { numero: 4, titulo: "Por qué funciona", cuerpo: "No podés ser pasivo. Eso es lo que lo hace imposible de olvidar.", prompt_imagen: "Active immersion experience no passive --ar 4:5" }, { numero: 5, titulo: "La lección", cuerpo: "Cuando rompés la barrera activo/pasivo, la experiencia queda para siempre.", prompt_imagen: "Breaking passive barrier experience --ar 4:5" }, { numero: 6, titulo: "Argentina crea", cuerpo: "Una industria creativa poderosa. Y muchas veces no lo sabemos.", prompt_imagen: "Argentina creative industry cultural export --ar 4:5" } ] } },
      { date: "Jue 15/5", pilar: "OFICIO", titulo: "El checklist de producción que evita el 80% de los errores",
        tiktok: { hook: "El 80% de los problemas del día del evento se podían prevenir con un checklist correcto.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → After Effects con checks animados", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "5 pantallas: caos, organización, D-1, D-Day" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Checks animados secuenciales" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",   texto: "EL 80% DE LOS PROBLEMAS\nDEL DÍA DEL EVENTO\nSE PODÍAN PREVENIR.", animacion: "80% en rojo.", prompt_imagen: "80 percent preventable event problems chaos vs preparation --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "ERRORES",texto: "Los 5 más frecuentes:\n→ Proveedor sin confirmar\n→ Técnica que falla\n→ Timeline no compartido\n→ Sin acreditar\n→ Sin plan B", animacion: "Lista roja.", prompt_imagen: "Event day mistakes red list preventable --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "D-1",    texto: "D-1:\n✓ Confirmar proveedores\n✓ Ensayo técnico\n✓ Timeline al equipo\n✓ Credenciales listas\n✓ Plan B comunicado", animacion: "Checks verdes.", prompt_imagen: "D minus 1 checklist green checkmarks preparation --ar 9:16", prompt_video: null },
            { tiempo: "26–38s", tipo: "D-DAY",  texto: "Día del evento:\n✓ Briefing 8am\n✓ Walk-through\n✓ Test audio y video\n✓ Accesos confirmados\n✓ Comms cada 30 min", animacion: "Checks más rápidos.", prompt_imagen: "Event day checklist morning execution --ar 9:16", prompt_video: null },
            { tiempo: "38–50s", tipo: "CTA",    texto: "No improvisa el que no prepara.\nGuardá este checklist. 📌", animacion: "Pin. Verde.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "El 80% de los problemas del día del evento se podían prevenir. Los cinco más frecuentes: proveedor sin confirmar, técnica que falla, timeline no compartido, sin acreditar, sin plan B. D-1: confirmar proveedores, ensayo, timeline, credenciales y plan B. D-Day: briefing a las 8, walk-through, test AV, accesos, comms cada 30 min. No improvisa el que no prepara." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "El checklist de producción — guardalo", caption: "El 80% era prevenible. 📋", hashtags: "#EventManagement #Checklist #Produccion",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Dark ejecutivo, checks profesionales" }, { paso: 2, nodo: "Designer", detalle: "Checks grandes ✓" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Cuál checklist usás? 📋'" },
          guion_slides: [ { numero: 1, titulo: "EL CHECKLIST", subtitulo: "Guardalo", cuerpo: "", prompt_imagen: "Event production checklist cover dark professional --ar 4:5" }, { numero: 2, titulo: "El 80% era prevenible", cuerpo: "Proveedor sin confirmar. Técnica que falla. Timeline no compartido.", prompt_imagen: "Preventable problems 80% --ar 4:5" }, { numero: 3, titulo: "D-1", cuerpo: "✓ Proveedores ✓ Ensayo ✓ Timeline ✓ Credenciales ✓ Plan B", prompt_imagen: "Day before checklist green --ar 4:5" }, { numero: 4, titulo: "D-Day", cuerpo: "✓ Briefing 8am ✓ Walk-through ✓ AV ✓ Accesos ✓ Comms 30min", prompt_imagen: "Event day execution --ar 4:5" }, { numero: 5, titulo: "No improvisa el que no prepara", cuerpo: "Este sistema funciona.", prompt_imagen: "Preparation system reliability --ar 4:5" } ] } },
      { date: "Vie 16/5", pilar: "PROCESO", titulo: "La estructura de pitch que gana antes de hablar de precio",
        tiktok: { hook: "La mayoría de las propuestas se pierden en el primer slide. Así se hace la que gana.", duracion: "55 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro simulando slides", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Estructura perdedora, ganadora, insight, precio al final" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro", detalle: "Simular avance de slides" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",        texto: "LA MAYORÍA SE PIERDEN\nEN EL PRIMER SLIDE.", animacion: "Propuesta que se desvanece.", prompt_imagen: "Creative proposal fading away lost pitch dark --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "LA QUE PIERDE",texto: "Slide 1: Quiénes somos\nSlide 2: Servicios\nSlide 3: Clientes\nSlide 4: La propuesta", animacion: "Slides aburridos.", prompt_imagen: "Boring pitch structure predictable corporate --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "LA QUE GANA", texto: "Slide 1: El problema del cliente\nSlide 2: El insight que nadie vio\nSlide 3: La solución\nSlide 4: Por qué nosotros", animacion: "Slides dorados.", prompt_imagen: "Winning pitch structure client problem insight solution dark elegant --ar 9:16", prompt_video: null },
            { tiempo: "26–38s", tipo: "INSIGHT",     texto: "El slide 2 es el más importante.\nSi sorprendés ahí,\nganaste la presentación.", animacion: "Spotlight.", prompt_imagen: null, prompt_video: null },
            { tiempo: "38–55s", tipo: "CTA",         texto: "El precio al final. Siempre.\n\n¿Tu pitch empieza con vos\no con el cliente? 👇", animacion: "Rojo. Oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "La mayoría se pierden en el primer slide. La que pierde: quiénes somos, servicios, clientes, propuesta. La que gana: el problema del cliente, el insight que nadie vio, la solución, por qué nosotros. El slide dos es el más importante. Si sorprendés ahí, ganaste. El precio siempre al final." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "La estructura de pitch que gana", caption: "¿Tu propuesta empieza con vos o con el cliente? 📊", hashtags: "#Pitch #PropuestaCreativa #AgencyLife",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Contraste grises vs dorado" }, { paso: 2, nodo: "Designer", detalle: "Dos estructuras enfrentadas" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Tu pitch empieza con?' → Quiénes somos / El problema del cliente / Casos / El precio" },
          guion_slides: [ { numero: 1, titulo: "EL PITCH QUE GANA", subtitulo: "Antes de hablar de precio", cuerpo: "", prompt_imagen: "Winning pitch cover dark elegant golden --ar 4:5" }, { numero: 2, titulo: "La que pierde", cuerpo: "Quiénes somos → Servicios → Clientes → Propuesta. Predecible.", prompt_imagen: "Boring pitch grey structure --ar 4:5" }, { numero: 3, titulo: "La que gana", cuerpo: "Problema → Insight → Solución → Por qué nosotros", prompt_imagen: "Winning pitch golden client first insight --ar 4:5" }, { numero: 4, titulo: "El slide del insight", cuerpo: "Si sorprendés ahí, ganaste la presentación.", prompt_imagen: "Insight slide surprise winning moment --ar 4:5" }, { numero: 5, titulo: "El precio al final", cuerpo: "Primero que quieran la solución. Después lo que cuesta.", prompt_imagen: "Price last strategy desire first --ar 4:5" } ] } },
    ]
  },
  {
    number: 5, block: 2, theme: "Innovación, arte y nuevas herramientas",
    days: [
      { date: "Lun 19/5", pilar: "INSPIRA", titulo: "Refik Anadol: cuando los datos se convierten en arte",
        tiktok: { hook: "Un artista que usa millones de datos como pintura. Sus obras están en el MoMA.", duracion: "45 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Data art flowing light streams neural network visualization cinematic Anadol style'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: datos como material, MoMA, lección" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",     texto: "UN ARTISTA QUE USA\nMILLONES DE DATOS\nCOMO PINTURA.", animacion: "Streams de datos → arte.", prompt_imagen: "Refik Anadol data art installation flowing neural network streams MoMA --ar 9:16", prompt_video: "Data streams flowing becoming visual art neural network cinematic" },
            { tiempo: "3–14s",  tipo: "CONTEXTO", texto: "Refik Anadol.\nObra permanente en el MoMA.\nUsa IA para crear lo que\nningún ser humano imaginaría solo.", animacion: "Datos que fluyen.", prompt_imagen: "Data art MoMA permanent collection AI creative installation --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "INSIGHT",  texto: "¿La IA puede crear arte?\n\nAnadol ya respondió:\ndepende de qué le des\npara pensar.", animacion: "Pregunta. Respuesta en cian.", prompt_imagen: "AI art creation question human data artistic material --ar 9:16", prompt_video: null },
            { tiempo: "26–45s", tipo: "CTA",      texto: "Los datos no son fríos.\nSon la memoria colectiva.\n\n¿La IA puede crear algo bello? 👇", animacion: "Oscuro. Cian.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Un artista que usa millones de datos como pintura. Sus obras están en el MoMA. Refik Anadol usa IA para crear instalaciones que nadie podría imaginar solo. La pregunta: ¿la IA puede crear arte? Depende de qué le des para pensar. Los datos no son fríos. Son la memoria colectiva de la humanidad. Y él los convirtió en belleza." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Refik Anadol: cuando los datos se convierten en arte", caption: "La IA puede crear belleza. Refik Anadol lo demuestra. ✨", hashtags: "#RefikAnadol #AIArt #DataArt #MoMA",
          workflow_carrusel: { resumen: "Lista 5 prompts arte de datos → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Flujos de datos, neural networks, vibrantes sobre negro" }, { paso: 2, nodo: "Designer", detalle: "Tipografía editorial" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿La IA puede crear algo verdaderamente bello? ✨'" },
          guion_slides: [ { numero: 1, titulo: "REFIK ANADOL", subtitulo: "Los datos como arte", cuerpo: "", prompt_imagen: "Refik Anadol data art cover neural streams dark --ar 4:5" }, { numero: 2, titulo: "Datos como pintura", cuerpo: "Millones de datos de hospitales, archivos, memorias. Instalaciones visuales.", prompt_imagen: "Data streams visual art collective memory --ar 4:5" }, { numero: 3, titulo: "El MoMA", cuerpo: "Obra permanente en el MoMA. Primera instalación de IA en la colección.", prompt_imagen: "MoMA AI art permanent collection --ar 4:5" }, { numero: 4, titulo: "La pregunta clave", cuerpo: "¿Puede la IA crear arte? Depende de qué le des para pensar.", prompt_imagen: "AI creativity question data artistic material --ar 4:5" }, { numero: 5, titulo: "Para marcas", cuerpo: "Los datos de tu empresa también son una historia. ¿La estás contando?", prompt_imagen: "Brand data storytelling narrative --ar 4:5" } ] } },
      { date: "Mar 20/5", pilar: "INDUSTRIA", titulo: "Gen Z vs Millennials: dos generaciones, dos expectativas",
        tiktok: { hook: "Gen Z y Millennials no quieren lo mismo en un evento. Si los tratás igual, perdés a los dos.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) split generacional → Voiceover (11Labs) → After Effects split screen", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Split Gen Z/Millennial, expectativas por generación" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Split screen animado" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",        texto: "GEN Z Y MILLENNIALS\nNO QUIEREN LO MISMO.\n\nSi los tratás igual,\nperdés a los dos.", animacion: "Split dos estéticas.", prompt_imagen: "Gen Z vs Millennial split screen different event expectations --ar 9:16", prompt_video: null },
            { tiempo: "3–15s",  tipo: "MILLENNIALS", texto: "Millennials:\n→ La experiencia que se recuerda\n→ Networking significativo\n→ El 'yo estuve ahí'", animacion: "Lado cálido.", prompt_imagen: "Millennial event networking memorable group experience --ar 9:16", prompt_video: null },
            { tiempo: "15–28s", tipo: "GEN Z",       texto: "Gen Z:\n→ Que no sea lo esperado\n→ Crear contenido\n→ Causas reales\n→ Más corto, más intenso", animacion: "Lado raw.", prompt_imagen: "Gen Z unexpected content creation cause driven shorter --ar 9:16", prompt_video: null },
            { tiempo: "28–50s", tipo: "CTA",         texto: "Millennials: '¿cómo lo cuento?'\nGen Z: '¿qué voy a crear?'\n\n¿Diseñás para una o para las dos? 👇", animacion: "Split de nuevo.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Gen Z y Millennials no quieren lo mismo. Los Millennials quieren la experiencia que se recuerda y el networking significativo. La Gen Z quiere que no sea lo esperado, poder crear contenido y causas reales. La diferencia: Millennials preguntan cómo lo van a contar. Gen Z pregunta qué van a poder crear." },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Gen Z vs Millennials en experiencias", caption: "Dos generaciones. Dos expectativas. 📊", hashtags: "#GenZ #Millennials #ExperienceDesign #GenerationalMarketing",
          workflow_carrusel: { resumen: "Lista 6 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Split visual por generación" }, { paso: 2, nodo: "Designer", detalle: "Tabla comparativa" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL DEBATE", instruccion: "Historia → Poll '¿Con cuál te identificás?' → Millennial (recuerdo) / Gen Z (creación)" },
          guion_slides: [ { numero: 1, titulo: "GEN Z VS MILLENNIALS", subtitulo: "En experiencias", cuerpo: "", prompt_imagen: "Generational split cover two aesthetics --ar 4:5" }, { numero: 2, titulo: "Millennials", cuerpo: "Experiencia memorable · Networking · 'Yo estuve ahí'", prompt_imagen: "Millennial event networking memorable --ar 4:5" }, { numero: 3, titulo: "Gen Z", cuerpo: "Que sorprenda · Crear contenido · Causas · Corto e intenso", prompt_imagen: "Gen Z unexpected content creation cause --ar 4:5" }, { numero: 4, titulo: "La diferencia", cuerpo: "Millennials: '¿cómo lo cuento?'. Gen Z: '¿qué voy a crear?'", prompt_imagen: "Two questions storytelling vs creation --ar 4:5" }, { numero: 5, titulo: "Las implicancias", cuerpo: "El espacio, el timing, las activaciones. Todo cambia.", prompt_imagen: "Design implications generations --ar 4:5" }, { numero: 6, titulo: "¿Para quién diseñás?", cuerpo: "Definir la audiencia es el primer paso.", prompt_imagen: "Target audience first step design --ar 4:5" } ] } },
      { date: "Mié 21/5", pilar: "CULTURA", titulo: "Los pop-ups como formato cultural — de Supreme al Louvre",
        tiktok: { hook: "8 horas en cola para una tienda que existe solo 3 días. ¿Cómo logran eso las marcas?", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética pop-up de lujo → Voiceover (11Labs) → After Effects con timer countdown", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Cola de pop-up, espacio efímero, casos" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Timer countdown '72hs' animado" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "8 HORAS EN COLA.\nUNA TIENDA QUE EXISTE\nSOLO 3 DÍAS.", animacion: "Contador regresivo.", prompt_imagen: "Long queue luxury pop-up store 8 hours 3 day exclusive --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "QUÉ ES",  texto: "El pop-up crea urgencia real.\nNo artificial.\nPorque termina.", animacion: "Reloj que corre.", prompt_imagen: "Pop-up real urgency scarcity temporary luxury --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "CASOS",   texto: "Supreme: agotado en horas.\nJacquemus: campo de lavanda.\nEl Louvre: exposición en Beijing.", animacion: "Tres casos.", prompt_imagen: "Supreme pop-up Jacquemus lavender Louvre exhibition temporary --ar 9:16", prompt_video: null },
            { tiempo: "26–50s", tipo: "CTA",     texto: "La escasez diseñada\nno es una táctica.\nEs un lenguaje cultural.\n\n¿Tu marca podría hacer algo\nque exista solo 72 horas? 👇", animacion: "Rojo. Oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Ocho horas en cola para una tienda que existe solo tres días. El pop-up crea urgencia real. Porque termina. Supreme agotado en horas. Jacquemus en un campo de lavanda. El Louvre con exposiciones en Beijing. La escasez diseñada no es una táctica. Es un lenguaje cultural." },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Los pop-ups como formato cultural", caption: "8 horas en cola para 3 días. El pop-up como lenguaje. 🏪", hashtags: "#PopUp #Supreme #BrandCulture #Jacquemus",
          workflow_carrusel: { resumen: "Lista 6 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Colas, espacios efímeros, lujo temporal" }, { paso: 2, nodo: "Designer", detalle: "Timer '72h', casos con datos" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Hiciste cola para un pop-up?' → Sí, horas / Una vez / No pero entiendo / Nunca" },
          guion_slides: [ { numero: 1, titulo: "LOS POP-UPS COMO CULTURA", subtitulo: "De Supreme al Louvre", cuerpo: "", prompt_imagen: "Pop-up culture cover luxury temporary queue editorial --ar 4:5" }, { numero: 2, titulo: "¿Qué es?", cuerpo: "Experiencia de tiempo limitado. La temporalidad es el diseño.", prompt_imagen: "Pop-up temporary ephemeral design concept --ar 4:5" }, { numero: 3, titulo: "Supreme", cuerpo: "10 drops al año. Cada uno agotado en horas. La cola como ritual.", prompt_imagen: "Supreme pop-up queue culture scarcity --ar 4:5" }, { numero: 4, titulo: "Jacquemus en lavanda", cuerpo: "Desfile en Provenza. Sin producto. Solo experiencia.", prompt_imagen: "Jacquemus lavender pop-up luxury ephemeral --ar 4:5" }, { numero: 5, titulo: "El Louvre", cuerpo: "Exposiciones en Beijing y Dubai. Arte en formato efímero.", prompt_imagen: "Louvre temporary exhibition Asia --ar 4:5" }, { numero: 6, titulo: "Escasez como lenguaje", cuerpo: "No es táctica. Es lenguaje cultural.", prompt_imagen: "Scarcity cultural language brand --ar 4:5" } ] } },
      { date: "Jue 22/5", pilar: "OFICIO", titulo: "Cómo construir un brief de identidad visual antes de diseñar una sola pieza",
        tiktok: { hook: "La mayoría de los eventos se ven genéricos porque nadie hizo un brief de identidad visual antes de abrir el programa de diseño.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar componentes de identidad visual → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando los componentes del brief de identidad visual" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Reveales visuales de cada componente del brief" } ] },
          pantallas: [
            { tiempo: "0–3s",  tipo: "HOOK",          texto: "LA MAYORÍA DE LOS EVENTOS\nSE VEN GENÉRICOS\nPORQUE NADIE HIZO\nEL BRIEF DE IDENTIDAD.", animacion: "Contraste: genérico vs con identidad.", prompt_imagen: "Generic event design vs strong visual identity brand dramatic contrast --ar 9:16", prompt_video: null },
            { tiempo: "3–14s", tipo: "QUÉ ES",        texto: "El brief de identidad visual\nno es el logo y los colores.\n\nEs el documento que responde:\n¿Cómo tiene que sentirse esto?", animacion: "La pregunta en grande.", prompt_imagen: "Visual identity brief concept how should this feel question brand --ar 9:16", prompt_video: null },
            { tiempo: "14–26s",tipo: "LOS 5 CAMPOS",  texto: "→ Emoción que buscamos generar\n→ Referencias que sí y que no\n→ Paleta con intención\n→ Tipografías con rol\n→ Restricciones del espacio", animacion: "Cinco campos apareciendo.", prompt_imagen: "5 visual identity brief fields emotion references palette typography constraints --ar 9:16", prompt_video: null },
            { tiempo: "26–36s",tipo: "EL RESULTADO",  texto: "Con ese brief,\ncualquier diseñador puede producir\ncualquier pieza\ny va a hablar el mismo idioma.", animacion: "Múltiples piezas coherentes.", prompt_imagen: "Coherent brand design multiple pieces from same brief --ar 9:16", prompt_video: null },
            { tiempo: "36–50s",tipo: "CTA",           texto: "¿Tu próximo evento arranca\ncon un brief de identidad\no con 'usemos los colores\nde la marca'? 👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "La mayoría de los eventos se ven genéricos porque nadie hizo un brief de identidad visual antes de abrir el programa de diseño. El brief de identidad no es el logo y los colores. Es el documento que responde: ¿cómo tiene que sentirse esto? Los cinco campos: la emoción que buscamos generar, las referencias que sí y que no, la paleta con intención, las tipografías con rol, y las restricciones del espacio. Con ese brief, cualquier diseñador produce cualquier pieza y hablan el mismo idioma." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "El brief de identidad visual — los 5 campos que no pueden faltar", caption: "Antes de abrir el programa de diseño. El brief de identidad. 🎨", hashtags: "#VisualIdentity #DesignBrief #EventBranding #DirectorDeArte #Oficio",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Los 5 campos del brief, contraste genérico vs identidad" }, { paso: 2, nodo: "Designer", detalle: "Cada campo bien separado y legible" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Tu próximo evento arranca con un brief de identidad o con los colores de la marca?'" },
          guion_slides: [ { numero: 1, titulo: "EL BRIEF DE IDENTIDAD", subtitulo: "Los 5 campos que no pueden faltar", cuerpo: "", prompt_imagen: "Visual identity brief cover design process dark professional --ar 4:5" }, { numero: 2, titulo: "No es el logo y los colores", cuerpo: "Es el documento que responde: ¿cómo tiene que sentirse esto?", prompt_imagen: "Visual identity beyond logo colors feeling concept --ar 4:5" }, { numero: 3, titulo: "Los 5 campos", cuerpo: "Emoción buscada · Referencias sí/no · Paleta con intención · Tipografías con rol · Restricciones", prompt_imagen: "5 fields visual identity brief listed clearly dark --ar 4:5" }, { numero: 4, titulo: "El resultado", cuerpo: "Cualquier diseñador produce cualquier pieza y hablan el mismo idioma.", prompt_imagen: "Coherent design multiple pieces same brief result --ar 4:5" }, { numero: 5, titulo: "¿Tu evento arranca bien?", cuerpo: "El brief de identidad es la diferencia entre genérico y memorable.", prompt_imagen: "Generic vs memorable event design brief difference --ar 4:5" } ] } },
      { date: "Vie 23/5", pilar: "PROCESO", titulo: "El día de batching de una agencia — cómo se organiza una jornada de producción",
        tiktok: { hook: "Un día. Una agencia. 40 piezas de contenido producidas. Así se organiza una jornada de batching.", duracion: "55 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar la jornada → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando el timeline del día y el modo single-task" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Timeline animado del día, antes/después del calendario" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",         texto: "UN DÍA.\nUNA AGENCIA.\n40 PIEZAS PRODUCIDAS.\n\nAsí se organiza una\njornada de batching.", animacion: "Counter 0→40. Flash.", prompt_imagen: "Agency batching day 40 content pieces one day production team --ar 9:16", prompt_video: null },
            { tiempo: "3–15s",  tipo: "EL TIMELINE",  texto: "8am — Brief y pilares del mes\n9am — Guiones de todas las semanas\n11am — Assets visuales en bloque\n1pm — Audio y locuciones\n3pm — Montaje\n5pm — Revisión y programación", animacion: "Timeline que avanza.", prompt_imagen: "Agency batching timeline 8am to 5pm production schedule professional --ar 9:16", prompt_video: null },
            { tiempo: "15–28s", tipo: "LA CLAVE",     texto: "La clave no es la velocidad.\nEs el modo single-task.\n\nNadie hace dos cosas a la vez.\nTodos hacen lo mismo al mismo tiempo.\nEl flow es colectivo.", animacion: "Foco. Ritmo.", prompt_imagen: "Single task focus collective flow state agency team production --ar 9:16", prompt_video: null },
            { tiempo: "28–38s", tipo: "ANTES/DESPUÉS",texto: "Antes: improvisar cada semana.\nDesgaste constante.\n\nDespués: un día al mes.\nUn mes de constancia.", animacion: "Contraste.", prompt_imagen: "Before after batching improvise weekly vs batch monthly agency --ar 9:16", prompt_video: null },
            { tiempo: "38–55s", tipo: "CTA",          texto: "¿Tu agencia o equipo\nhace batching de contenido?\n¿Con qué sistema? 👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Un día. Una agencia. Cuarenta piezas producidas. El timeline: a las 8 brief y pilares del mes, a las 9 guiones de todas las semanas, a las 11 assets visuales en bloque, al mediodía audio y locuciones, a las 3 montaje, a las 5 revisión y programación. La clave no es la velocidad. Es el modo single-task: nadie hace dos cosas a la vez, todos hacen lo mismo al mismo tiempo, el estado de flow es colectivo." },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "El día de batching de una agencia — cómo se organiza", caption: "Un día. 40 piezas. Sin improvisar. Así se organiza una jornada de batching. ⚙️", hashtags: "#Batching #AgencyLife #ContentProduction #WorkflowCreativo #ProduccionCreativa",
          workflow_carrusel: { resumen: "Lista 6 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Timeline del día, single-task, antes/después" }, { paso: 2, nodo: "Designer", detalle: "Timeline visual de 8am a 5pm" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Tu equipo hace batching?' → Sí, sistematizado / A veces / No, día a día / ¿Qué es batching?" },
          guion_slides: [ { numero: 1, titulo: "EL DÍA DE BATCHING", subtitulo: "Cómo se organiza una agencia", cuerpo: "", prompt_imagen: "Agency batching day cover organized production dark green --ar 4:5" }, { numero: 2, titulo: "El timeline", cuerpo: "8am → 9am → 11am → 1pm → 3pm → 5pm. Cada hora con su etapa.", prompt_imagen: "Batching timeline 8am to 5pm production stages --ar 4:5" }, { numero: 3, titulo: "Single-task: la clave", cuerpo: "Nadie hace dos cosas a la vez. Flow colectivo.", prompt_imagen: "Single task collective flow agency team --ar 4:5" }, { numero: 4, titulo: "Antes vs después", cuerpo: "Antes: improvisar cada semana. Después: un día al mes, un mes de constancia.", prompt_imagen: "Before after batching improvise vs systematic --ar 4:5" }, { numero: 5, titulo: "Lo que produce", cuerpo: "40 piezas. Un mes programado. Voz de marca consistente.", prompt_imagen: "40 pieces full month consistent brand voice result --ar 4:5" }, { numero: 6, titulo: "¿Tu equipo lo hace?", cuerpo: "Funciona con 2 personas o con 20. Lo importante es la estructura.", prompt_imagen: "Batching scalable 2 to 20 people structure matters --ar 4:5" } ] } },
    ]
  },
  {
    number: 6, block: 2, theme: "Diseño, arte y el ojo del director creativo",
    days: [
      { date: "Lun 26/5", pilar: "INSPIRA", titulo: "The Shed, Nueva York: el edificio que cambia de forma",
        tiktok: { hook: "Un edificio en Nueva York que cambia de forma. Literalmente. Y cambió para siempre lo que entendemos por 'venue'.", duracion: "45 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'The Shed New York building expanding shell rolls rails architectural transformation cinematic'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: mecanismo, insight, lección" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "UN EDIFICIO QUE CAMBIA\nDE FORMA. LITERALMENTE.\n¿Cómo se diseña eso?", animacion: "Edificio expandiéndose.", prompt_imagen: "The Shed New York building expanding shell structure Hudson Yards architectural transformation --ar 9:16", prompt_video: "The Shed building shell rolling expanding architectural transformation cinematic" },
            { tiempo: "3–14s",  tipo: "CONTEXTO",texto: "The Shed, Nueva York.\nUna capa exterior sobre rieles\nque crea distintos espacios internos.\n\nDiseñado para nunca ser\nlo mismo dos veces.", animacion: "Diagrama del mecanismo.", prompt_imagen: "The Shed interior flexible spaces movable shell Hudson Yards architecture --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "INSIGHT", texto: "La pregunta que lo creó:\n¿Y si el espacio pudiera\nadaptarse al evento\nen lugar de que el evento\nse adapte al espacio?", animacion: "Pregunta en blanco. Pausa larga.", prompt_imagen: null, prompt_video: null },
            { tiempo: "26–45s", tipo: "CTA",     texto: "Las restricciones de un venue\nson decisiones de diseño.\n\n¿Alguna vez limitaste\nuna idea por el venue? 👇", animacion: "Cian oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Un edificio en Nueva York que cambia de forma. Literalmente. The Shed: una capa exterior sobre rieles que crea distintos espacios internos. Diseñado para nunca ser lo mismo dos veces. La pregunta que lo creó: ¿y si el espacio pudiera adaptarse al evento en lugar de que el evento se adapte al espacio? Las restricciones de un venue son decisiones de diseño. No son limitaciones." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "The Shed: el edificio que se reinventa", caption: "Un edificio que cambia de forma literalmente. 🏗️", hashtags: "#TheShed #Architecture #EventVenue #ExperienceDesign",
          workflow_carrusel: { resumen: "Lista 5 prompts arquitectura → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Arquitectura transformable, Hudson Yards, espacios flexibles" }, { paso: 2, nodo: "Designer", detalle: "Diagrama del mecanismo, pregunta clave" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Alguna vez limitaste una idea por el venue? 🏗️'" },
          guion_slides: [ { numero: 1, titulo: "THE SHED", subtitulo: "El edificio que se reinventa", cuerpo: "", prompt_imagen: "The Shed New York transformable architecture cover --ar 4:5" }, { numero: 2, titulo: "La capa que se mueve", cuerpo: "Una estructura sobre rieles que expande o contrae el espacio según el evento.", prompt_imagen: "The Shed shell mechanism movable exterior innovation --ar 4:5" }, { numero: 3, titulo: "Nunca igual dos veces", cuerpo: "El mismo edificio puede ser sala de conciertos, galería o espacio industrial.", prompt_imagen: "Flexible venue different configurations same building --ar 4:5" }, { numero: 4, titulo: "La pregunta que lo creó", cuerpo: "¿Y si el espacio se adapta al evento y no al revés?", prompt_imagen: "Design philosophy space adapts to event concept --ar 4:5" }, { numero: 5, titulo: "Las restricciones son diseño", cuerpo: "Las limitaciones de un venue son decisiones. Todo es diseñable.", prompt_imagen: "Constraints as design decisions flexible thinking --ar 4:5" } ] } },
      { date: "Mar 27/5", pilar: "INDUSTRIA", titulo: "Tendencias de producción audiovisual 2026 — lo que ya está pasando",
        tiktok: { hook: "Las 5 tendencias que definen la producción audiovisual en 2026. La mayoría de las agencias todavía no las adoptó.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética tech/futuro → Voiceover (11Labs) → After Effects con listas animadas", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "5 tendencias visualizadas, datos de adopción" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Lista animada con porcentajes de adopción" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",  texto: "5 TENDENCIAS\nQUE DEFINEN LA PRODUCCIÓN\nEN 2026.\n\nLa mayoría no las adoptó.", animacion: "Ticker. Impacto.", prompt_imagen: "2026 production trends concept digital tech future dark editorial --ar 9:16", prompt_video: null },
            { tiempo: "3–36s",  tipo: "LAS 5", texto: "1. Video generativo (Kling, Runway, Sora)\n2. Locuciones IA (ElevenLabs, Murf)\n3. Motion graphics con IA (AE + AI)\n4. Imágenes en batch (Spaces, Midjourney)\n5. Workflows sin cámara para b-roll", animacion: "Cada tendencia con ícono.", prompt_imagen: "Five audiovisual trends 2026 AI tools list tech production evolution --ar 9:16", prompt_video: null },
            { tiempo: "36–44s", tipo: "DATO",  texto: "El 73% de las agencias creativas\nglobales ya usa IA en algún paso\nde su producción.\n\nFuente: Adobe State of Creative 2025", animacion: "73% enorme.", prompt_imagen: "73% agencies using AI production Adobe Creative State data --ar 9:16", prompt_video: null },
            { tiempo: "44–50s", tipo: "CTA",   texto: "¿En cuáles de las 5\nya estás trabajando? 👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Las cinco tendencias que definen la producción audiovisual en 2026: video generativo con Kling, Runway y Sora; locuciones con IA; motion graphics con IA integrada en After Effects; imágenes en batch con Freepik Spaces y Midjourney; y workflows sin cámara para b-roll. El 73% de las agencias creativas globales ya usa IA en algún paso de su producción. Fuente: Adobe State of Creative 2025." },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Tendencias de producción audiovisual 2026", caption: "5 tendencias que definen cómo se produce en 2026. ¿Cuáles adoptaste? 📹", hashtags: "#Produccion2026 #AIVideo #ContentTrends #Tendencias",
          workflow_carrusel: { resumen: "Lista 6 prompts tech → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Tech futurista, cada tendencia con ícono visual" }, { paso: 2, nodo: "Designer", detalle: "Numeración, porcentajes, estética oscura" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Cuál tendencia 2026 adoptaste?' → Video IA / Locución IA / Batch / Ninguna todavía" },
          guion_slides: [ { numero: 1, titulo: "PRODUCCIÓN 2026", subtitulo: "Las 5 tendencias que ya están pasando", cuerpo: "", prompt_imagen: "2026 production trends cover dark tech futuristic --ar 4:5" }, { numero: 2, titulo: "1. Video generativo", cuerpo: "Kling, Runway, Sora. B-roll y campaña sin cámara. Ya es estándar.", prompt_imagen: "AI video generation tools Kling Runway comparison --ar 4:5" }, { numero: 3, titulo: "2. Locuciones IA", cuerpo: "ElevenLabs, Murf. Voz de marca en 30 segundos.", prompt_imagen: "AI voiceover tools professional voice --ar 4:5" }, { numero: 4, titulo: "3. Motion graphics + IA", cuerpo: "After Effects ya integra IA para keyframes, texturas y elementos.", prompt_imagen: "After Effects AI integration motion graphics --ar 4:5" }, { numero: 5, titulo: "4 y 5. Batch + sin cámara", cuerpo: "Freepik Spaces y Midjourney. Flujos completos sin equipo de rodaje.", prompt_imagen: "Batch production no camera workflow Spaces Midjourney --ar 4:5" }, { numero: 6, titulo: "El 73% ya usa IA", cuerpo: "Adobe State of Creative 2025. ¿Estás en ese 73%?", prompt_imagen: "73% adoption statistic agencies using AI --ar 4:5" } ] } },
      { date: "Mié 28/5", pilar: "CULTURA", titulo: "Saul Bass: cuando el diseño gráfico era cultura de masas",
        tiktok: { hook: "Un diseñador que cambió las películas, los aeropuertos y las empresas. Con tijera y papel.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética Saul Bass → Voiceover (11Labs) → After Effects con animaciones geométricas",
            pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Prompts con 'Saul Bass style geometric flat design bold color palette mid-century modern' — pantallas de obra y filosofía" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Animaciones geométricas tipo Saul Bass: formas que se componen y descomponen" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "UN DISEÑADOR.\nTIJERA Y PAPEL.\n\nCAMBIÓ LAS PELÍCULAS,\nLOS AEROPUERTOS\nY LAS EMPRESAS.", animacion: "Formas geométricas que se ensamblan.", prompt_imagen: "Saul Bass style geometric design bold shapes mid-century modern film noir aesthetic --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "QUIÉN",   texto: "Saul Bass, 1920–1996.\n\nLos créditos de Hitchcock.\nLos logos de AT&T y United Airlines.\nLas señales del metro de LA.\n\nTodo con la misma filosofía.", animacion: "Ejemplos apareciendo.", prompt_imagen: "Saul Bass design portfolio Hitchcock title cards corporate logos wayfinding --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "FILOSOFÍA",texto: "La comunicación más poderosa\nes la más simple.\n\nUna forma. Un color. Una idea.",  animacion: "Simplificación progresiva.", prompt_imagen: "Simple geometric communication one shape one color one idea Bass style --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "LECCIÓN", texto: "Cuando algo se puede simplificar,\nnunca se debería complicar.\n\nEso se aplica en diseño,\nen eventos, en todo.", animacion: "Cita visual. Pausa.", prompt_imagen: null, prompt_video: null },
            { tiempo: "36–50s", tipo: "CTA",     texto: "¿Cuál es el diseñador\nque más te impacta? 👇", animacion: "Rojo oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Un diseñador. Tijera y papel. Cambió las películas, los aeropuertos y las empresas. Saul Bass, 1920–1996. Los créditos de Hitchcock, los logos de AT&T y United Airlines, las señales del metro de Los Ángeles. Todo con la misma filosofía: la comunicación más poderosa es la más simple. Una forma, un color, una idea. Cuando algo se puede simplificar, nunca se debería complicar. Eso se aplica en diseño, en eventos, en todo." },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Saul Bass: cuando el diseño era cultura de masas", caption: "Tijera, papel y una idea. Así cambió el diseño gráfico. ✂️", hashtags: "#SaulBass #GraphicDesign #DesignHistory #MidCenturyModern",
          workflow_carrusel: { resumen: "Lista 6 prompts estilo Bass → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Prompts: 'Saul Bass style flat geometric bold red black white mid-century'" }, { paso: 2, nodo: "Designer", detalle: "Tipografía bold, paleta limitada, estética del período" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel con estética propia" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Conocías a Saul Bass?' → Claro, es un referente / Algo / Nada / ¿Quién?" },
          guion_slides: [ { numero: 1, titulo: "SAUL BASS", subtitulo: "Cuando el diseño era cultura de masas", cuerpo: "", prompt_imagen: "Saul Bass style cover bold geometric red black white mid-century --ar 4:5" }, { numero: 2, titulo: "Tijera y papel", cuerpo: "Sin computadoras. Formas recortadas a mano. El lenguaje visual del siglo XX.", prompt_imagen: "Hand cut geometric shapes craft design mid-century process --ar 4:5" }, { numero: 3, titulo: "Los créditos de Hitchcock", cuerpo: "Vértigo, Psicosis. Antes de Bass los créditos eran texto. Después fueron experiencia.", prompt_imagen: "Film title sequence design concept Hitchcock era cinematic typography --ar 4:5" }, { numero: 4, titulo: "Logos que duraron décadas", cuerpo: "AT&T, United Airlines, Minolta. Diseñados para ser atemporales. Y lo son.", prompt_imagen: "Timeless corporate logo geometric brand identity Bass --ar 4:5" }, { numero: 5, titulo: "La filosofía", cuerpo: "La comunicación más poderosa es la más simple. Una forma. Un color. Una idea.", prompt_imagen: "Simple communication philosophy geometric minimalism Bass --ar 4:5" }, { numero: 6, titulo: "La lección", cuerpo: "Cuando algo se puede simplificar, nunca se debería complicar.", prompt_imagen: "Simplification principle design lesson apply everything --ar 4:5" } ] } },
      { date: "Jue 29/5", pilar: "OFICIO", titulo: "Dirección de arte en eventos — cómo se define la identidad visual",
        tiktok: { hook: "La diferencia entre un evento que se ve genérico y uno que parece de campaña global es la dirección de arte.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) contraste genérico vs con dirección → Voiceover (11Labs) → After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Contraste genérico vs con DA, componentes de identidad visual" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Reveales: paleta que se construye, tipografía que aparece, motion guide" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",      texto: "LA DIFERENCIA ENTRE\nUN EVENTO GENÉRICO\nY UNO DE CAMPAÑA GLOBAL:\n\nLA DIRECCIÓN DE ARTE.", animacion: "Split: genérico vs con DA.", prompt_imagen: "Generic event vs art direction guided event dramatic before after --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "QUÉ ES",    texto: "La dirección de arte\nes el sistema de decisiones\nque hace que todo lo visual\nhable el mismo idioma.", animacion: "Sistema construyéndose.", prompt_imagen: "Visual identity system art direction cohesive design language --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "COMPONENTES",texto: "→ Paleta con reglas\n→ Tipografías con jerarquía\n→ Reglas de composición\n→ Guía de motion\n→ Tono fotográfico", animacion: "Cada componente aparece.", prompt_imagen: "Art direction components color typography motion photo tone design system --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "ERROR",     texto: "El error más común:\n\nElegir colores de moda\nen lugar de colores\ncon intención.", animacion: "Paleta de moda vs paleta con intención.", prompt_imagen: "Trendy colors vs intentional brand colors wrong vs right approach --ar 9:16", prompt_video: null },
            { tiempo: "36–50s", tipo: "CTA",       texto: "¿Tu próximo evento tiene\nun sistema visual\no tiene 'los colores que quedaban'? 👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "La diferencia entre un evento genérico y uno que parece de campaña global es la dirección de arte. La dirección de arte es el sistema de decisiones que hace que todo lo visual hable el mismo idioma. Los componentes: paleta con reglas, tipografías con jerarquía, composición, guía de motion y tono fotográfico. El error más común: elegir colores de moda en lugar de colores con intención." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Dirección de arte en eventos — guía práctica", caption: "Genérico vs de campaña global. La diferencia la hace la dirección de arte. 🎨", hashtags: "#DireccionDeArte #ArtDirection #VisualIdentity #EventDesign",
          workflow_carrusel: { resumen: "Lista 5 prompts identidad visual → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Sistema visual, paleta + tipo + composición, before/after" }, { paso: 2, nodo: "Designer", detalle: "Grid visual: paleta + tipografía + motion + foto" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Tenés un sistema visual para tus eventos o empezás de cero cada vez?'" },
          guion_slides: [ { numero: 1, titulo: "DIRECCIÓN DE ARTE", subtitulo: "En eventos", cuerpo: "", prompt_imagen: "Art direction event cover visual identity system dark --ar 4:5" }, { numero: 2, titulo: "Genérico vs con DA", cuerpo: "La diferencia está en el sistema. No en el presupuesto.", prompt_imagen: "Generic vs art directed event dramatic before after --ar 4:5" }, { numero: 3, titulo: "Los 5 componentes", cuerpo: "Paleta con reglas · Tipografías · Composición · Motion guide · Tono fotográfico", prompt_imagen: "5 art direction components design system elements --ar 4:5" }, { numero: 4, titulo: "El error más común", cuerpo: "Elegir colores de moda. En lugar de colores con intención.", prompt_imagen: "Trendy colors wrong vs intentional brand colors --ar 4:5" }, { numero: 5, titulo: "El sistema como herramienta", cuerpo: "Un buen sistema visual se aplica a cualquier pieza. Sin pensar de nuevo.", prompt_imagen: "Visual system scalable consistent application toolkit --ar 4:5" } ] } },
      { date: "Vie 30/5", pilar: "PROCESO", titulo: "Cómo presentar una campaña que se aprueba en la primera reunión",
        tiktok: { hook: "El 80% de las campañas se aprueban o rechazan en los primeros 3 minutos. Así se preparan los que aprueban.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar el proceso de presentación → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando el orden correcto de una presentación de campaña" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Animaciones tipo slides de presentación avanzando" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",       texto: "EL 80% DE LAS CAMPAÑAS\nSE APRUEBAN O RECHAZAN\nEN LOS PRIMEROS 3 MINUTOS.", animacion: "Reloj. Impacto.", prompt_imagen: "Campaign approved rejected first 3 minutes presentation moment dark --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "POR QUÉ",    texto: "No por la calidad de la idea.\nSino por cómo se presenta.\n\nEl cliente no compra la campaña.\nCompra la seguridad de que\nva a funcionar.", animacion: "Idea vs seguridad.", prompt_imagen: "Client buys security not idea campaign presentation psychology dark --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "EL ORDEN",   texto: "El orden que funciona:\n\n1. El problema del cliente\n2. El insight que lo cambia todo\n3. La campaña como solución\n4. Por qué va a funcionar", animacion: "Escalera de confianza.", prompt_imagen: "Presentation order problem insight campaign why it works trust --ar 9:16", prompt_video: null },
            { tiempo: "26–38s", tipo: "EL INSIGHT", texto: "El momento que define todo:\nel slide del insight.\n\nSi el cliente dice 'nunca lo había\npensado así', ganaste la sala.", animacion: "El momento clave. Spotlight.", prompt_imagen: "Insight slide key moment winning the room aha moment presentation --ar 9:16", prompt_video: null },
            { tiempo: "38–50s", tipo: "CTA",        texto: "¿Tu última presentación\nempezó por el problema del cliente\no por tu agencia? 👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "El 80% de las campañas se aprueban o rechazan en los primeros tres minutos. No por la calidad de la idea. Sino por cómo se presenta. El cliente no compra la campaña. Compra la seguridad de que va a funcionar. El orden que funciona: el problema del cliente, el insight que lo cambia todo, la campaña como solución, y por qué va a funcionar. El momento que define todo es el slide del insight. Si el cliente dice 'nunca lo había pensado así', ganaste la sala." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Cómo presentar una campaña que se aprueba en la primera", caption: "No vendés la campaña. Vendés la seguridad de que va a funcionar. 🎯", hashtags: "#PresentacionCreativa #AgencyLife #Pitch #MarketingB2B #CampaignPresentation",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Orden de presentación, el insight, escalera de confianza" }, { paso: 2, nodo: "Designer", detalle: "Escalera numerada, estructura visual clara" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Tu presentación empieza por?' → El problema del cliente / Tu agencia / La idea / El presupuesto" },
          guion_slides: [ { numero: 1, titulo: "LA CAMPAÑA QUE SE APRUEBA", subtitulo: "En la primera reunión", cuerpo: "", prompt_imagen: "Campaign approved first meeting cover dark professional --ar 4:5" }, { numero: 2, titulo: "Lo que el cliente compra", cuerpo: "No la campaña. La seguridad de que va a funcionar.", prompt_imagen: "Client buys security not campaign psychology dark --ar 4:5" }, { numero: 3, titulo: "El orden", cuerpo: "Problema → Insight → Campaña → Por qué funciona", prompt_imagen: "Presentation order stairs trust building --ar 4:5" }, { numero: 4, titulo: "El slide del insight", cuerpo: "Si el cliente dice 'nunca lo había pensado así', ganaste la sala.", prompt_imagen: "Insight moment aha winning the room presentation --ar 4:5" }, { numero: 5, titulo: "¿Empezás bien?", cuerpo: "Por el problema del cliente, no por tu agencia.", prompt_imagen: "Start client problem not agency pitch --ar 4:5" } ] } },
    ]
  },
  {
    number: 7, block: 2, theme: "Arte, identidad y producción avanzada",
    days: [
      { date: "Lun 2/6", pilar: "INSPIRA", titulo: "Tàpies, Basquiat, KAWS — cuando el arte callejero se convirtió en experiencia de marca",
        tiktok: { hook: "¿Cómo pasamos del graffiti ilegal a las paredes más caras del mundo? Tres artistas que cambiaron esa historia.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética street art evolucionando → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Prompts: 'street art style gallery transition, urban art museum quality, Basquiat KAWS influenced'" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro", detalle: "Reveales cinematográficos, zoom in a texturas" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "DEL GRAFFITI ILEGAL\nA LAS PAREDES MÁS CARAS\nDEL MUNDO.\n\n3 ARTISTAS. UNA HISTORIA.", animacion: "Spray que se transforma en galería.", prompt_imagen: "Street art transforms to gallery art urban graffiti to museum quality dramatic --ar 9:16", prompt_video: null },
            { tiempo: "3–15s",  tipo: "LOS TRES",texto: "Tàpies: materiales de la calle\ncomo alta expresión.\n\nBasquiat: el diario de un barrio\nconvertido en mito.\n\nKAWS: el juguete\ncomo lenguaje global.", animacion: "Cada artista con su color.", prompt_imagen: "Three artists Tapies textures Basquiat urban KAWS toys street art gallery evolution --ar 9:16", prompt_video: null },
            { tiempo: "15–28s", tipo: "EN COMÚN",texto: "Los tres convirtieron\nlo cotidiano en lenguaje.\n\nLo que todos pasaban por alto,\nellos lo pusieron en el centro.", animacion: "Objetos cotidianos → arte.", prompt_imagen: "Everyday objects elevated to art street culture becomes high culture --ar 9:16", prompt_video: null },
            { tiempo: "28–38s", tipo: "LECCIÓN", texto: "La cultura de tu audiencia\nno está en los museos.\nEstá en la calle.\n\nLas marcas que lo entienden\nno van a la cultura. La crean.", animacion: "Cita visual. Impacto.", prompt_imagen: null, prompt_video: null },
            { tiempo: "38–50s", tipo: "CTA",     texto: "¿Cuál de los tres te impacta más?\nO ¿hay otro artista de calle\nque te vuela la cabeza? 👇", animacion: "Rojo oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Del graffiti ilegal a las paredes más caras del mundo. Tres artistas que cambiaron esa historia. Tàpies convirtió los materiales de la calle en alta expresión. Basquiat transformó el diario de un barrio en un mito global. KAWS usó el juguete como lenguaje universal. Los tres convirtieron lo cotidiano en lenguaje. La cultura de tu audiencia no está en los museos. Está en la calle." },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Tàpies, Basquiat, KAWS — del graffiti al museo", caption: "Del graffiti ilegal a las paredes más caras del mundo. 🎨", hashtags: "#Basquiat #KAWS #Tapies #StreetArt #CulturaVisual",
          workflow_carrusel: { resumen: "Lista 6 prompts street art/gallery → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Street art con calidad editorial, colores fuertes, texturas urbanas" }, { paso: 2, nodo: "Designer", detalle: "Layout que evoluciona de raw a curado" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel cultural" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Cuál te impacta más?' → Tàpies / Basquiat / KAWS / Ninguno los conocía" },
          guion_slides: [ { numero: 1, titulo: "DEL GRAFFITI AL MUSEO", subtitulo: "Tàpies · Basquiat · KAWS", cuerpo: "", prompt_imagen: "Street art to museum evolution cover urban gallery --ar 4:5" }, { numero: 2, titulo: "Tàpies", cuerpo: "Barcelona. Materiales de la calle como alta expresión. Barro, arena y tela como lenguaje.", prompt_imagen: "Tapies style textures materials street fine art Barcelona --ar 4:5" }, { numero: 3, titulo: "Basquiat", cuerpo: "Nueva York. El diario de un barrio convertido en mito. Palabras tachadas como poesía.", prompt_imagen: "Basquiat urban diary scratched words street mythology New York --ar 4:5" }, { numero: 4, titulo: "KAWS", cuerpo: "New Jersey. El juguete como lenguaje global. De graffiti en camiones a Louis Vuitton.", prompt_imagen: "KAWS toys brand culture collectible global street to luxury --ar 4:5" }, { numero: 5, titulo: "Lo que tienen en común", cuerpo: "Convirtieron lo cotidiano en lenguaje. Lo que todos ignoraban, ellos lo pusieron en el centro.", prompt_imagen: "Everyday elevated to art three artists philosophy --ar 4:5" }, { numero: 6, titulo: "Para marcas", cuerpo: "La cultura de tu audiencia está en la calle. ¿La conocés?", prompt_imagen: "Brand culture from street audience lesson --ar 4:5" } ] } },
      { date: "Mar 3/6", pilar: "INDUSTRIA", titulo: "BTS y el ARMY: cómo un grupo de K-pop redefinió el fan marketing global",
        tiktok: { hook: "Un grupo de música que construyó una de las comunidades de marca más poderosas del mundo. Sin gastar un peso en publicidad tradicional.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética K-pop global → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas: escala global, ARMY como fuerza cultural, datos de impacto" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Mapa global de activaciones, datos animados" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "UN GRUPO DE MÚSICA\nQUE CONSTRUYÓ UNA DE LAS\nCOMUNIDADES DE MARCA\nMÁS PODEROSAS DEL MUNDO.", animacion: "Texto con impacto. Mapa iluminándose.", prompt_imagen: "BTS global phenomenon world map lit up massive fan community culture --ar 9:16", prompt_video: null },
            { tiempo: "3–15s",  tipo: "EL ARMY", texto: "El ARMY no es una base de fans.\nEs una fuerza cultural organizada.\n\n→ Coordinan campañas globales\n→ Compran álbumes en masa para charts\n→ Donan millones en nombre del grupo\n→ Crean contenido que multiplica el mensaje", animacion: "Cada punto con peso.", prompt_imagen: "BTS ARMY coordinated global campaigns organized fan culture movement --ar 9:16", prompt_video: null },
            { tiempo: "15–28s", tipo: "LOS DATOS",texto: "En 2020, el ARMY convirtió\n#BlackLivesMatter en tendencia global\ndespués de que BTS donó $1M.\n\nLa comunidad igualó la donación\nen menos de 24 horas.", animacion: "Datos con impacto.", prompt_imagen: "BTS ARMY matched donation 1 million 24 hours social movement power --ar 9:16", prompt_video: null },
            { tiempo: "28–38s", tipo: "LECCIÓN", texto: "La lección para marcas:\n\nCuando una comunidad se apropia\nde tu identidad,\nya no necesitás departamento\nde marketing.", animacion: "Cita visual. Impacto.", prompt_imagen: null, prompt_video: null },
            { tiempo: "38–50s", tipo: "CTA",     texto: "¿Tu marca tiene una comunidad\nque la defienda\nsin que se lo pidas? 👇", animacion: "Oscuro elegante.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Un grupo de música que construyó una de las comunidades de marca más poderosas del mundo. Sin publicidad tradicional. El ARMY no es una base de fans. Es una fuerza cultural organizada: coordinan campañas globales, compran álbumes en masa para los charts, donan millones en nombre del grupo. En 2020 igualaron una donación de un millón de dólares en menos de veinticuatro horas. La lección: cuando una comunidad se apropia de tu identidad, ya no necesitás departamento de marketing." },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "BTS y el ARMY: la comunidad de marca más poderosa del mundo", caption: "No es una base de fans. Es una fuerza cultural organizada. Lo que toda marca debería estudiar. 🎤", hashtags: "#BTS #ARMY #ComunidadDeMarca #FanMarketing #BrandStrategy",
          workflow_carrusel: { resumen: "Lista 6 prompts K-pop/comunidad global → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Escala global, fuerza cultural organizada, datos de impacto" }, { paso: 2, nodo: "Designer", detalle: "Mapa global, datos en grande, lección final" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Sos parte de alguna comunidad de marca o artista así de activa?' → Sí, de una / No / Conozco una / ¿Qué es el ARMY?" },
          guion_slides: [ { numero: 1, titulo: "BTS Y EL ARMY", subtitulo: "La comunidad de marca más poderosa del mundo", cuerpo: "", prompt_imagen: "BTS global community cover massive cultural force dark editorial --ar 4:5" }, { numero: 2, titulo: "No es una base de fans", cuerpo: "Es una fuerza cultural organizada. Coordinan, donan, crean y amplifican.", prompt_imagen: "ARMY organized community global coordination cultural force --ar 4:5" }, { numero: 3, titulo: "Los charts como estrategia", cuerpo: "Compran álbumes coordinados. Streaman en sincronía. Los números son la táctica.", prompt_imagen: "Music chart strategy fan coordinated buying streaming numbers --ar 4:5" }, { numero: 4, titulo: "El momento de la donación", cuerpo: "BTS donó $1M. El ARMY igualó la cifra en menos de 24 horas.", prompt_imagen: "Donation matching 1 million 24 hours fan community power --ar 4:5" }, { numero: 5, titulo: "La lección", cuerpo: "Cuando una comunidad se apropia de tu identidad, ya no necesitás marketing.", prompt_imagen: "Community owns brand identity no marketing needed lesson --ar 4:5" }, { numero: 6, titulo: "¿Tu marca tiene esto?", cuerpo: "¿Hay personas que la defiendan, amplifiquen y construyan sin que se lo pidas?", prompt_imagen: "Brand community advocates organic defenders question --ar 4:5" } ] } },
      { date: "Mié 4/6", pilar: "CULTURA", titulo: "Casa Batlló de noche: cuando el patrimonio se reinventa por diseño",
        tiktok: { hook: "Un edificio de 1906 recauda más con experiencias nocturnas que con visitas diurnas.", duracion: "45 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook nocturno → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Casa Batllo Barcelona night Gaudi facade illuminated projection mapping slow cinematic pan'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: modelo, datos, lección" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "UN EDIFICIO DE 1906\nRECAUDA MÁS DE NOCHE\nQUE DE DÍA.", animacion: "Fachada iluminada con glow.", prompt_imagen: "Casa Batllo Barcelona night projection mapping Gaudi facade magical --ar 9:16", prompt_video: "Casa Batllo night slow cinematic pan Gaudi facade illuminated projection" },
            { tiempo: "3–14s",  tipo: "MODELO",  texto: "Casa Batlló sumó:\n→ Projection mapping en fachada\n→ Realidad aumentada interior\n→ Narración IA por el espacio\n\n+40% en ingresos.", animacion: "Lista. +40% en rojo.", prompt_imagen: "Casa Batllo immersive night projection AR interior revenue increase --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "INSIGHT", texto: "No era un problema de restauración.\nEra un problema de experiencia.\n\nLo resolvieron con diseño.", animacion: "Contraste restauración vs diseño.", prompt_imagen: null, prompt_video: null },
            { tiempo: "26–45s", tipo: "CTA",     texto: "Cualquier espacio tiene\nuna experiencia latente.\nEl diseño la activa.\n\n¿Cuál es la tuya? 👇", animacion: "Azul oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Un edificio de 1906 recauda más de noche que de día. Casa Batlló sumó projection mapping, realidad aumentada y narración con IA. Resultado: cuarenta por ciento más en ingresos. No era un problema de restauración. Era un problema de experiencia. Lo resolvieron con diseño. Cualquier espacio tiene una experiencia latente. El diseño la activa." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Casa Batlló: diseño que transformó lo histórico", caption: "1906. Reinventado por diseño. +40% en ingresos. 🏛️", hashtags: "#CasaBatllo #ExperienceDesign #Gaudi #ProjectionMapping",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Arquitectura nocturna, projection mapping, azul profundo" }, { paso: 2, nodo: "Designer", detalle: "+40% en tipografía grande" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Conocías este modelo? 🏛️'" },
          guion_slides: [ { numero: 1, titulo: "CASA BATLLÓ", subtitulo: "1906. Reinventado por diseño.", cuerpo: "", prompt_imagen: "Casa Batllo night Gaudi premium dark design projection mapping --ar 4:5" }, { numero: 2, titulo: "+40% de ingresos", cuerpo: "Projection mapping, AR y narración IA. El patrimonio convertido en experiencia.", prompt_imagen: "Heritage building revenue increase experience innovation 40% --ar 4:5" }, { numero: 3, titulo: "No era restauración", cuerpo: "Era un problema de experiencia. El diseño lo resolvió.", prompt_imagen: "Problem vs solution heritage design over restoration --ar 4:5" }, { numero: 4, titulo: "La experiencia latente", cuerpo: "Cualquier espacio tiene una experiencia que espera ser activada.", prompt_imagen: "Latent experience design reveals hidden potential --ar 4:5" }, { numero: 5, titulo: "¿Y tu espacio?", cuerpo: "¿Cuál es la experiencia que todavía no activaste?", prompt_imagen: "Question spaces unexplored potential dark elegant --ar 4:5" } ] } },
      { date: "Jue 5/6", pilar: "OFICIO", titulo: "Cómo construir un sistema visual desde cero — flujo completo en Spaces",
        tiktok: { hook: "Antes del primer slide del pitch ya tenés que tener el sistema visual. Flujo completo en Freepik Spaces.", duracion: "50 seg",
          workflow_spaces: { resumen: "FLUJO COMPLETO: Text + Assistant → Image Gen (referencias) → Designer (manual) → exportar PDF", pasos: [ { paso: 1, nodo: "Text + Assistant", detalle: "Concepto → brief del sistema (colores, tipografías, texturas, mood)" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · distintos ratios)", detalle: "4–6 referencias de textura, color, espacio y tipografía" }, { paso: 3, nodo: "Designer", detalle: "Mini manual: paleta HEX, tipografías, composición, usos" }, { paso: 4, nodo: "Exportar → PDF", detalle: "Manual como PDF para la presentación" } ] },
          pantallas: [
            { tiempo: "0–3s",  tipo: "HOOK",  texto: "ANTES DEL PRIMER SLIDE.\nEL SISTEMA VISUAL.\nFLUJO EN SPACES.", animacion: "Sistema construyéndose.", prompt_imagen: "Visual system building design manual Freepik Spaces workflow --ar 9:16", prompt_video: null },
            { tiempo: "3–14s", tipo: "QUÉ ES",texto: "Paleta con reglas · Tipografías\nComposición · Texturas · Motion guide", animacion: "Cada elemento aparece.", prompt_imagen: "Visual system components color typography composition texture motion --ar 9:16", prompt_video: null },
            { tiempo: "14–26s",tipo: "FLUJO", texto: "1. Concepto → Assistant\n2. Referencias → Image Gen\n3. Manual → Designer\n4. Export PDF", animacion: "Pipeline de nodos.", prompt_imagen: "Freepik Spaces visual system nodes pipeline export --ar 9:16", prompt_video: null },
            { tiempo: "26–50s",tipo: "CTA",  texto: "Con el sistema en mano,\ncualquier persona produce\ny queda bien.\n\n¿Armás sistemas antes? 👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Antes del primer slide del pitch ya tenés que tener el sistema visual. El flujo en Freepik Spaces: concepto al Assistant, referencias con Image Gen, manual con Designer, export como PDF. Con el sistema en mano, cualquier persona del equipo puede producir una pieza y va a quedar bien." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Sistema visual desde cero — flujo Spaces", caption: "Antes del primer slide. El sistema visual. 🎨", hashtags: "#VisualSystem #EventBranding #FreepikSpaces #DesignProcess",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Componentes del sistema visual" }, { paso: 2, nodo: "Designer", detalle: "Mini manual visual" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Armás el sistema antes o sobre la marcha?'" },
          guion_slides: [ { numero: 1, titulo: "SISTEMA VISUAL", subtitulo: "Flujo completo en Spaces", cuerpo: "", prompt_imagen: "Visual system Spaces workflow cover dark --ar 4:5" }, { numero: 2, titulo: "Los componentes", cuerpo: "Paleta · Tipografías · Composición · Texturas · Motion", prompt_imagen: "Visual system components design elements --ar 4:5" }, { numero: 3, titulo: "El flujo", cuerpo: "Concepto → Assistant → Image Gen → Designer → PDF", prompt_imagen: "Spaces visual pipeline nodes --ar 4:5" }, { numero: 4, titulo: "Por qué", cuerpo: "Cualquier persona del equipo puede producir y queda bien.", prompt_imagen: "Team consistency one system --ar 4:5" }, { numero: 5, titulo: "El entregable", cuerpo: "PDF de 4–6 páginas. El sistema que sostiene al evento.", prompt_imagen: "Design manual PDF deliverable --ar 4:5" } ] } },
      { date: "Vie 6/6", pilar: "PROCESO", titulo: "Cómo se define el tono de comunicación de una marca desde cero",
        tiktok: { hook: "El tono de comunicación es lo primero que el público siente antes de leer una sola palabra. Así se define desde cero.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar el ejercicio de tono → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando el ejercicio de personalidad de marca y los ejes de tono" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Contraste visual entre marcas con tono definido vs sin definir" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",       texto: "EL TONO DE COMUNICACIÓN\nES LO PRIMERO QUE\nEL PÚBLICO SIENTE.\n\nAntes de leer una sola palabra.", animacion: "Frase con impacto.", prompt_imagen: "Brand tone communication first impression before reading dark cinematic --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "QUÉ ES",     texto: "El tono no es el estilo gráfico.\nNo es el slogan.\n\nEs la personalidad que tiene\nla marca cuando habla.\nY cuando no habla también.", animacion: "La diferencia visualizada.", prompt_imagen: "Brand tone personality speaking and silence communication style dark --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "EL EJERCICIO",texto: "El ejercicio que funciona:\n\n'¿Si esta marca fuera una persona,\ncómo se vestiría,\ncómo hablaría,\ncómo reaccionaría ante\nuna crisis?'", animacion: "La persona emerge.", prompt_imagen: "Brand as person exercise how would it dress talk react crisis --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "LOS EJES",   texto: "Los 4 ejes del tono:\n→ Formal ↔ Cercano\n→ Serio ↔ Juguetón\n→ Técnico ↔ Accesible\n→ Seguro ↔ Humilde", animacion: "Cuatro ejes con sliders.", prompt_imagen: "Brand tone four axes formal casual serious playful technical accessible --ar 9:16", prompt_video: null },
            { tiempo: "36–50s", tipo: "CTA",        texto: "¿Tu marca tiene tono definido\no habla diferente\nen cada pieza? 👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "El tono de comunicación es lo primero que el público siente, antes de leer una sola palabra. El tono no es el estilo gráfico ni el slogan. Es la personalidad que tiene la marca cuando habla. Y cuando no habla también. El ejercicio que funciona: si esta marca fuera una persona, ¿cómo se vestiría, cómo hablaría, cómo reaccionaría ante una crisis? Los cuatro ejes: formal versus cercano, serio versus juguetón, técnico versus accesible, seguro versus humilde." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Cómo se define el tono de comunicación de una marca", caption: "El tono se siente antes de leer una palabra. Así se define desde cero. 🎙️", hashtags: "#TonoDeMarca #BrandVoice #ComunicacionDeMarca #BrandStrategy #Oficio",
          workflow_carrusel: { resumen: "Lista 5 prompts del ejercicio de tono → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Ejercicio de personalidad, los cuatro ejes, ejemplos de tono" }, { paso: 2, nodo: "Designer", detalle: "Sliders de los 4 ejes, contraste marcas con/sin tono" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Tu marca tiene tono definido?' → Sí, documentado / Más o menos / No / ¿Qué es eso?" },
          guion_slides: [ { numero: 1, titulo: "EL TONO DE COMUNICACIÓN", subtitulo: "Cómo se define desde cero", cuerpo: "", prompt_imagen: "Brand tone communication cover dark professional --ar 4:5" }, { numero: 2, titulo: "No es lo que creés", cuerpo: "No es el estilo gráfico. No es el slogan. Es la personalidad cuando habla.", prompt_imagen: "Brand tone beyond visual identity personality --ar 4:5" }, { numero: 3, titulo: "El ejercicio", cuerpo: "¿Si fuera una persona, cómo se vestiría, hablaría y reaccionaría?", prompt_imagen: "Brand as person exercise personality emergence --ar 4:5" }, { numero: 4, titulo: "Los 4 ejes", cuerpo: "Formal↔Cercano · Serio↔Juguetón · Técnico↔Accesible · Seguro↔Humilde", prompt_imagen: "Four tone axes sliders brand communication spectrum --ar 4:5" }, { numero: 5, titulo: "¿Tu marca tiene tono?", cuerpo: "Una marca sin tono habla diferente en cada pieza. El público lo siente.", prompt_imagen: "Brand with vs without tone consistency perception --ar 4:5" } ] } },
    ]
  },
  {
    number: 8, block: 2, theme: "Cierre del bloque — reflexión y futuro",
    days: [
      { date: "Lun 9/6", pilar: "INSPIRA", titulo: "The Sphere, Las Vegas: el límite del espacio como experiencia",
        tiktok: { hook: "Una esfera de 112 metros con la pantalla más grande del mundo. Y no es para ver. Es para sentir.", duracion: "45 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'The Sphere Las Vegas massive LED dome night lights changing cinematic aerial'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: interior, datos, lección" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "112 METROS.\nLA PANTALLA MÁS GRANDE\nDEL MUNDO.\n\nNO ES PARA VER.\nES PARA SENTIR.", animacion: "Esfera en el desierto.", prompt_imagen: "The Sphere Las Vegas 112 meter LED dome night massive scale cinematic --ar 9:16", prompt_video: "The Sphere Las Vegas aerial night lights changing massive scale cinematic" },
            { tiempo: "3–14s",  tipo: "DATOS",   texto: "$2.300 millones.\n17.600 personas de capacidad.\n\nLos asientos vibran.\nEl aire cambia.\nExperiencia física total.", animacion: "Datos con peso.", prompt_imagen: "Sphere interior 17600 capacity haptic seats sensory experience --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "INSIGHT", texto: "No vendieron conciertos.\nVendieron la primera experiencia\nmultisensorial a esa escala\nde la historia.", animacion: "Multisensorial visualizado.", prompt_imagen: "Multisensory experience sight sound haptic scent The Sphere --ar 9:16", prompt_video: null },
            { tiempo: "26–45s", tipo: "CTA",     texto: "El futuro de las experiencias\nno es más pantallas.\n\nEs más sentidos.\n\n¿Irías a The Sphere? 👇", animacion: "Oscuro. Cian.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Una esfera de 112 metros con la pantalla más grande del mundo. Y no es para ver. Es para sentir. The Sphere: dos mil trescientos millones de dólares, diecisiete mil seiscientas personas. Los asientos vibran. El aire cambia. Es una experiencia física total. No vendieron conciertos. Vendieron la primera experiencia multisensorial a esa escala. El futuro de las experiencias no es más pantallas. Es más sentidos." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "The Sphere: el límite del espacio como experiencia", caption: "112m. $2.300M. Los asientos vibran. El futuro es multisensorial. 🌐", hashtags: "#TheSphere #LasVegas #ExperienceDesign #Multisensory",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "LED dome, haptic interior, multisensorial" }, { paso: 2, nodo: "Designer", detalle: "Escala y datos de inversión" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Irías a The Sphere?' → Sí, de inmediato / Probablemente / No / No sé qué es" },
          guion_slides: [ { numero: 1, titulo: "THE SPHERE", subtitulo: "El límite del espacio como experiencia", cuerpo: "", prompt_imagen: "The Sphere Las Vegas cover massive LED dome dark cinematic --ar 4:5" }, { numero: 2, titulo: "$2.300 millones", cuerpo: "La inversión más grande en un venue de entretenimiento de la historia.", prompt_imagen: "Sphere investment scale construction milestone --ar 4:5" }, { numero: 3, titulo: "Experiencia física total", cuerpo: "Los asientos vibran. El aire cambia. Es multisensorial. Ver no alcanza.", prompt_imagen: "Haptic seats sensory immersion multisensory experience --ar 4:5" }, { numero: 4, titulo: "No vendieron conciertos", cuerpo: "Vendieron la primera experiencia multisensorial a esa escala.", prompt_imagen: "Not concerts but multisensory history experience redefined --ar 4:5" }, { numero: 5, titulo: "El futuro: más sentidos", cuerpo: "No es más pantallas. Es más sentidos. Eso es lo que viene.", prompt_imagen: "Future experiences more senses beyond screens multisensory trend --ar 4:5" } ] } },
      { date: "Mar 10/6", pilar: "INDUSTRIA", titulo: "El mercado experiencial en Argentina 2026 — estado y oportunidades",
        tiktok: { hook: "¿Cómo está el mercado del marketing experiencial en Argentina en 2026? Los datos para tomar decisiones.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) datos de mercado → Voiceover (11Labs) → After Effects con barras animadas", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "5 pantallas: panorama Argentina, sectores, tendencias, oportunidad" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Barras por sector animadas" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",     texto: "MARKETING EXPERIENCIAL\nEN ARGENTINA. 2026.\n¿CÓMO ESTÁ EL MERCADO?", animacion: "Mapa de Argentina iluminándose.", prompt_imagen: "Argentina experiential marketing market 2026 country map illuminated business data --ar 9:16", prompt_video: null },
            { tiempo: "3–15s",  tipo: "SECTORES", texto: "Más inversión:\n→ Tecnología (B2B y consumer)\n→ Entretenimiento y música\n→ Automotriz\n→ Consumo masivo\n→ Finanzas y fintech", animacion: "Barras por sector.", prompt_imagen: "Argentina sectors investing experiential tech entertainment automotive FMCG finance --ar 9:16", prompt_video: null },
            { tiempo: "15–28s", tipo: "TENDENCIAS",texto: "2026:\n→ Experiencias híbridas\n→ Sustentabilidad como condición\n→ IA en producción\n→ Personalización a escala", animacion: "Lista verde.", prompt_imagen: "2026 Argentina experiential trends hybrid AI sustainability personalization --ar 9:16", prompt_video: null },
            { tiempo: "28–38s", tipo: "OPORTUNIDAD",texto: "Pocos actores combinan\nestratégia + producción + tecnología.\nEse espacio define el mercado.", animacion: "Triángulo de capacidades.", prompt_imagen: "Market opportunity strategy production technology triangle gap --ar 9:16", prompt_video: null },
            { tiempo: "38–50s", tipo: "CTA",      texto: "¿En qué sector estás?\n¿Cómo ves el mercado este año? 👇", animacion: "Oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "¿Cómo está el mercado del marketing experiencial en Argentina en 2026? Los sectores que más invierten: tecnología, entretenimiento, automotriz, consumo masivo y finanzas. Las tendencias: experiencias híbridas, sustentabilidad como condición, IA en producción y personalización a escala. La oportunidad: pocos combinan estrategia, producción y tecnología." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Mercado experiencial Argentina 2026", caption: "Los datos para saber dónde está el mercado este año. 📊", hashtags: "#MarketingExperiencial #Argentina2026 #Tendencias #ExperienceMarketing",
          workflow_carrusel: { resumen: "Lista 5 prompts datos de mercado → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Data journalism, oscuro, datos grandes" }, { paso: 2, nodo: "Designer", detalle: "Barras por sector, triángulo de oportunidad" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿En qué sector trabajás?' → Tech / Entretenimiento / Automotriz / Otro" },
          guion_slides: [ { numero: 1, titulo: "MERCADO ARGENTINA 2026", subtitulo: "Estado y oportunidades", cuerpo: "", prompt_imagen: "Argentina experiential market cover dark data 2026 --ar 4:5" }, { numero: 2, titulo: "Los sectores líderes", cuerpo: "Tech · Entretenimiento · Automotriz · FMCG · Finanzas", prompt_imagen: "Leading sectors bar chart dark editorial --ar 4:5" }, { numero: 3, titulo: "Las 4 tendencias", cuerpo: "Híbrido · Sustentabilidad · IA en producción · Personalización", prompt_imagen: "Four trends 2026 bold list dark --ar 4:5" }, { numero: 4, titulo: "La oportunidad", cuerpo: "Pocos combinan estrategia + producción + tecnología.", prompt_imagen: "Market opportunity triangle gap --ar 4:5" }, { numero: 5, titulo: "¿Dónde estás vos?", cuerpo: "¿Tu marca está aprovechando estas tendencias?", prompt_imagen: "Where are you brand positioning question --ar 4:5" } ] } },
      { date: "Mié 11/6", pilar: "CULTURA", titulo: "Refik Anadol en el MoMA: cuando la IA entra al museo más importante del mundo",
        tiktok: { hook: "La IA entró al MoMA. No como herramienta. Como obra permanente. Y eso cambió la conversación para siempre.", duracion: "45 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'MoMA AI data art installation permanent collection neural network visualization cinematic'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: la obra, el debate, la lección para marcas" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",    texto: "LA IA ENTRÓ AL MOMA.\nCOMO OBRA PERMANENTE.\n\nESO CAMBIÓ\nLA CONVERSACIÓN.", animacion: "Streams de datos entrando al museo.", prompt_imagen: "AI art MoMA permanent collection data installation cinematic --ar 9:16", prompt_video: "MoMA AI data art installation neural network cinematic flowing" },
            { tiempo: "3–14s",  tipo: "QUÉ ES",  texto: "Refik Anadol: Machine Hallucinations.\n\nMillones de datos de la colección del MoMA\ntransformados en paisajes visuales\nque se generan en tiempo real.", animacion: "Datos que se transforman.", prompt_imagen: "Machine Hallucinations MoMA data collection visual landscapes real time --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "EL DEBATE",texto: "¿Es arte?\nLa pregunta no tiene una respuesta.\n\nPero el MoMA ya tomó posición:\nsí, y es permanente.", animacion: "La pregunta. La respuesta institucional.", prompt_imagen: "Is this art debate AI MoMA institutional response permanent --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "LECCIÓN", texto: "Para las marcas:\nla IA no reemplaza la creatividad.\nLa amplifica.\n\nAnadol lo demuestra mejor\nque cualquier argumento.", animacion: "Cita visual.", prompt_imagen: null, prompt_video: null },
            { tiempo: "36–45s", tipo: "CTA",     texto: "¿La IA puede crear algo\nverdaderamente nuevo?\n👇", animacion: "Oscuro. Cian.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "La IA entró al MoMA. No como herramienta. Como obra permanente. Refik Anadol, Machine Hallucinations: millones de datos de la colección del MoMA transformados en paisajes visuales que se generan en tiempo real. ¿Es arte? La pregunta no tiene una respuesta. Pero el MoMA ya tomó posición: sí, y es permanente. Para las marcas: la IA no reemplaza la creatividad. La amplifica." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "La IA en el MoMA: cuando el arte cambia de reglas", caption: "La IA entró al MoMA como obra permanente. Eso cambió todo. ✨", hashtags: "#RefikAnadol #MoMA #AIArt #CreatividadIA #ArteFuturo",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Data art, MoMA, neural networks, vibrantes sobre negro" }, { paso: 2, nodo: "Designer", detalle: "Tipografía editorial, pregunta clave destacada" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿La IA puede crear verdadero arte?' → Sí / No / Depende de cómo lo definas / No sé" },
          guion_slides: [ { numero: 1, titulo: "LA IA EN EL MOMA", subtitulo: "Cuando el arte cambia de reglas", cuerpo: "", prompt_imagen: "AI art MoMA cover data installation dark cinematic --ar 4:5" }, { numero: 2, titulo: "Machine Hallucinations", cuerpo: "Millones de datos de la colección del MoMA → paisajes visuales en tiempo real.", prompt_imagen: "Machine Hallucinations MoMA data collection visual real time --ar 4:5" }, { numero: 3, titulo: "¿Es arte?", cuerpo: "La pregunta no tiene respuesta. Pero el MoMA ya tomó posición: sí, y es permanente.", prompt_imagen: "Is this art debate MoMA institutional response --ar 4:5" }, { numero: 4, titulo: "Para las marcas", cuerpo: "La IA no reemplaza la creatividad. La amplifica. Anadol lo demuestra.", prompt_imagen: "AI amplifies creativity brand lesson Anadol proof --ar 4:5" }, { numero: 5, titulo: "La pregunta abierta", cuerpo: "¿Puede la IA crear algo verdaderamente nuevo? La respuesta importa para todo lo que hacemos.", prompt_imagen: "Open question AI creativity implications design --ar 4:5" } ] } },
      { date: "Jue 12/6", pilar: "OFICIO", titulo: "Cómo presentar un presupuesto sin que el cliente se vaya",
        tiktok: { hook: "El 70% de las propuestas se pierden cuando aparece el número. Esto pasa antes de que lo vean.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas: el momento del número, contexto antes, cómo encuadrarlo" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Secuencia de slides de presentación animados" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",      texto: "EL 70% DE LAS PROPUESTAS\nSE PIERDEN\nCUANDO APARECE EL NÚMERO.", animacion: "Número que asusta. Fondo negro.", prompt_imagen: "Budget number appears proposal lost client scared dark --ar 9:16", prompt_video: null },
            { tiempo: "3–14s",  tipo: "POR QUÉ",   texto: "No porque sea caro.\nSino porque apareció\nantes de que el cliente\nquisiera la experiencia.", animacion: "Secuencia: precio → reacción.", prompt_imagen: "Price before desire concept wrong order presentation --ar 9:16", prompt_video: null },
            { tiempo: "14–26s", tipo: "EL ORDEN",  texto: "El orden correcto:\n1. El problema del cliente\n2. La transformación que logramos\n3. El ROI que puede esperar\n4. El número", animacion: "Escalera que sube hasta el número.", prompt_imagen: "Correct presentation order problem transformation ROI then price --ar 9:16", prompt_video: null },
            { tiempo: "26–36s", tipo: "EL ENCUADRE",texto: "El número no es un costo.\nEs el precio de la transformación.\n\nCambiar esa frase\ncambia la conversación.", animacion: "Reencuadre visual.", prompt_imagen: null, prompt_video: null },
            { tiempo: "36–50s", tipo: "CTA",       texto: "¿Cuándo presentás el presupuesto\nen tu propuesta? 👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "El 70% de las propuestas se pierden cuando aparece el número. No porque sea caro. Sino porque apareció antes de que el cliente quisiera la experiencia. El orden correcto: el problema del cliente, la transformación que logramos, el ROI que puede esperar, y después el número. El número no es un costo. Es el precio de la transformación. Cambiar esa frase cambia la conversación." },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Cómo presentar un presupuesto sin perder al cliente", caption: "El número no es un costo. Es el precio de la transformación. 💡", hashtags: "#Presupuesto #Pitch #AgencyLife #MarketingB2B #VentaCreativa",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Presentación ejecutiva, orden correcto, reencuadre" }, { paso: 2, nodo: "Designer", detalle: "Escalera del orden, frase clave destacada" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Cuándo presentás el número?' → Al principio / En el medio / Al final / Cuando me lo piden" },
          guion_slides: [ { numero: 1, titulo: "EL PRESUPUESTO", subtitulo: "Cómo presentarlo sin perder al cliente", cuerpo: "", prompt_imagen: "Budget presentation executive dark professional --ar 4:5" }, { numero: 2, titulo: "El 70% se pierde", cuerpo: "No porque sea caro. Porque apareció antes de que quisieran la experiencia.", prompt_imagen: "Proposal lost before desire price too early --ar 4:5" }, { numero: 3, titulo: "El orden correcto", cuerpo: "Problema → Transformación → ROI → El número", prompt_imagen: "Correct order stairs problem transformation ROI price --ar 4:5" }, { numero: 4, titulo: "El reencuadre", cuerpo: "No es un costo. Es el precio de la transformación.", prompt_imagen: "Price reframe transformation cost mindset --ar 4:5" }, { numero: 5, titulo: "La frase que cambia todo", cuerpo: "Cambiar cómo llamás al número cambia cómo lo reciben.", prompt_imagen: "Language changes perception price transformation --ar 4:5" } ] } },
      { date: "Vie 13/6", pilar: "PROCESO", titulo: "Cómo escalar una agencia sin perder la calidad — el momento en que todo cambia",
        tiktok: { hook: "Hay un momento en la vida de toda agencia en que crecer empieza a significar perder lo que la hacía buena. Así se evita.", duracion: "55 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar el momento del quiebre → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando el momento del quiebre, los sistemas que sostienen la calidad" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Contraste visual: caos de escala vs sistemas que sostienen" } ] },
          pantallas: [
            { tiempo: "0–3s",   tipo: "HOOK",        texto: "HAY UN MOMENTO\nEN QUE CRECER\nEMPIEZA A SIGNIFICAR\nPERDER LO QUE TE HACÍA BUENO.", animacion: "Quiebre visual.", prompt_imagen: "Agency growth vs quality loss moment dark dramatic --ar 9:16", prompt_video: null },
            { tiempo: "3–15s",  tipo: "EL MOMENTO",  texto: "El síntoma más común:\n\nEl cliente nuevo no recibe\nlo mismo que el primero.\n\nEl equipo no sabe\npor qué las cosas se hacen así.", animacion: "La grieta que aparece.", prompt_imagen: "Agency inconsistency new vs original client quality gap dark --ar 9:16", prompt_video: null },
            { tiempo: "15–28s", tipo: "LA SOLUCIÓN", texto: "La calidad no se mantiene\ncon talento individual.\nSe mantiene con sistemas.\n\nProcesos documentados.\nEstandares de entrega.\nOnboarding de equipo.", animacion: "Sistema que sostiene.", prompt_imagen: "Quality through systems processes documentation standards team agency --ar 9:16", prompt_video: null },
            { tiempo: "28–38s", tipo: "EL CRITERIO", texto: "Lo que nunca debe escalar:\n\nEl criterio creativo.\nLa relación con el cliente.\nLa obsesión por los detalles.", animacion: "Lo irreemplazable.", prompt_imagen: "Creative criterion client relationship detail obsession cannot scale --ar 9:16", prompt_video: null },
            { tiempo: "38–55s", tipo: "CTA",         texto: "¿Tu agencia ya tiene\nsistemas que sostienen\nla calidad sin depender\nde una sola persona? 👇", animacion: "Verde oscuro.", prompt_imagen: null, prompt_video: null },
          ],
          locucion_texto: "Hay un momento en la vida de toda agencia en que crecer empieza a significar perder lo que la hacía buena. El síntoma más común: el cliente nuevo no recibe lo mismo que el primero, y el equipo no sabe por qué las cosas se hacen así. La calidad no se mantiene con talento individual. Se mantiene con sistemas: procesos documentados, estándares de entrega, onboarding de equipo. Lo que nunca debe escalar: el criterio creativo, la relación con el cliente, la obsesión por los detalles." },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Cómo escalar una agencia sin perder la calidad",
          caption: "Crecer sin perder lo que te hacía bueno. El momento más difícil de una agencia. ⚡",
          hashtags: "#AgencyGrowth #ScalingUp #AgencyLife #Calidad #ProduccionCreativa",
          workflow_carrusel: { resumen: "Lista 6 prompts del momento de escala → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "El quiebre, los sistemas, lo que no debe escalar" }, { paso: 2, nodo: "Designer", detalle: "Contraste visual caos vs sistema, lista de lo irreemplazable" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Tu agencia o equipo tiene sistemas que mantienen la calidad sin depender de una sola persona?'" },
          guion_slides: [ { numero: 1, titulo: "ESCALAR SIN PERDER CALIDAD", subtitulo: "El momento que cambia todo", cuerpo: "", prompt_imagen: "Agency scaling quality cover dark professional --ar 4:5" }, { numero: 2, titulo: "El síntoma", cuerpo: "El cliente nuevo no recibe lo mismo que el primero. El equipo no sabe por qué.", prompt_imagen: "Agency inconsistency quality gap growth problem --ar 4:5" }, { numero: 3, titulo: "La calidad no escala sola", cuerpo: "Se mantiene con sistemas. Procesos documentados. Estándares. Onboarding.", prompt_imagen: "Quality through systems documentation standards --ar 4:5" }, { numero: 4, titulo: "Lo que sí debe escalar", cuerpo: "Los procesos, los estándares, el onboarding, la documentación.", prompt_imagen: "What should scale processes standards documentation --ar 4:5" }, { numero: 5, titulo: "Lo que no debe escalar", cuerpo: "El criterio creativo. La relación con el cliente. La obsesión por los detalles.", prompt_imagen: "What should not scale creative criterion client relationship details --ar 4:5" }, { numero: 6, titulo: "El objetivo", cuerpo: "Que la calidad no dependa de una sola persona. Ese es el momento en que una agencia madura.", prompt_imagen: "Agency maturity quality independence from single person systems --ar 4:5" } ] } },
    ]
  },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────
function PillarBadge({ pilar, small }) {
  const p = PILLARS[pilar];
  if (!p) return null;
  return (
    <span style={{ background: p.color + "22", color: p.color, border: `1px solid ${p.color}55`, borderRadius: 4, padding: small ? "1px 6px" : "3px 10px", fontSize: small ? 10 : 11, fontWeight: 700, letterSpacing: 1, fontFamily: "monospace", whiteSpace: "nowrap" }}>
      {p.emoji} {p.label}
    </span>
  );
}

const TABS = [
  { id: "calendario",  label: "📅 Calendario"  },
  { id: "guiones",     label: "📝 Guiones"     },
  { id: "referencias", label: "📚 Referencias" },
  { id: "tracker",     label: "✅ Tracker"     },
  { id: "progreso",    label: "📈 Progreso"    },
];

// ─── CALENDARIO ───────────────────────────────────────────────────────────────
function CalendarioTab({ checks, toggleCheck }) {
  const [expanded, setExpanded] = useState(null);
  const byBlock = {};
  WEEKS.forEach(w => { if (!byBlock[w.block]) byBlock[w.block] = []; byBlock[w.block].push(w); });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {DAY_SCHEDULE.map(d => (
          <div key={d.dayName} style={{ background: "#ebebeb", borderRadius: 6, padding: "8px 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#666666", fontSize: 11, fontWeight: 700 }}>{d.dayName}</span>
            <PillarBadge pilar={d.pilar} small />
          </div>
        ))}
      </div>
      {Object.entries(byBlock).map(([block, weeks]) => (
        <div key={block} style={{ marginBottom: 40 }}>
          <div style={{ background: "#E63946", color: "#111111", padding: "8px 16px", borderRadius: 6, display: "inline-block", fontSize: 11, fontWeight: 900, letterSpacing: 3, marginBottom: 16 }}>
            BLOQUE {block} — S{weeks[0].number}–S{weeks[weeks.length - 1].number}
          </div>
          {weeks.map(week => (
            <div key={week.number} style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10, borderBottom: "1px solid #e5e5e5", paddingBottom: 8 }}>
                <span style={{ background: "#ebebeb", color: "#E63946", borderRadius: 4, padding: "3px 10px", fontWeight: 900, fontSize: 11, letterSpacing: 2 }}>S{week.number}</span>
                <span style={{ color: "#888888", fontSize: 13, fontStyle: "italic" }}>{week.theme}</span>
              </div>
              {week.days.map((day, di) => {
                const key = `${week.number}-${di}`;
                const kTT = key + "-tt", kIG = key + "-ig", kST = key + "-st";
                const isOpen = expanded === key;
                return (
                  <div key={di} style={{ background: "#f0f0f0", border: `1px solid ${isOpen ? "#cccccc" : "#e0e0e0"}`, borderRadius: 8, marginBottom: 6, overflow: "hidden" }}>
                    <div onClick={() => setExpanded(isOpen ? null : key)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", cursor: "pointer" }}>
                      <span style={{ color: "#E63946", fontWeight: 700, fontSize: 11, minWidth: 80, fontFamily: "monospace" }}>{day.date}</span>
                      <PillarBadge pilar={day.pilar} small />
                      <span style={{ color: "#222222", fontSize: 13, flex: 1 }}>{day.titulo}</span>
                      <div style={{ display: "flex", gap: 8 }}>
                        {[{ k: kTT, label: "TikTok" }, { k: kIG, label: "Carrusel" }, { k: kST, label: "Historia" }].map(item => (
                          <label key={item.k} onClick={e => e.stopPropagation()} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
                            <input type="checkbox" checked={!!checks[item.k]} onChange={() => toggleCheck(item.k)} />
                            <span style={{ fontSize: 10, color: checks[item.k] ? "#4CAF50" : "#aaaaaa" }}>{item.label}</span>
                          </label>
                        ))}
                      </div>
                      <span style={{ color: "#999999", fontSize: 14, marginLeft: 4 }}>{isOpen ? "▲" : "▼"}</span>
                    </div>
                    {isOpen && (
                      <div style={{ padding: "12px 16px", borderTop: "1px solid #e5e5e5", background: "#f5f5f5" }}>
                        <div style={{ color: "#777777", fontSize: 11, lineHeight: 1.8 }}>
                          <span style={{ color: "#E63946", fontWeight: 700 }}>Hook: </span>"{day.tiktok.hook}"<br />
                          <span style={{ color: "#E040FB", fontWeight: 700 }}>Carrusel: </span>{day.instagram.titulo}<br />
                          <span style={{ color: "#00BCD4", fontWeight: 700 }}>Historia: </span>{day.instagram.historia?.tipo}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── GUIONES ──────────────────────────────────────────────────────────────────
function GuionesTab() {
  const [selW, setSelW] = useState(0);
  const [selD, setSelD] = useState(0);
  const [view, setView] = useState("tiktok");
  const [showWorkflow, setShowWorkflow] = useState(false);
  const week = WEEKS[selW];
  const day = week?.days[selD];
  if (!day) return null;

  return (
    <div style={{ display: "flex", gap: 16, minHeight: 600 }}>
      {/* Sidebar */}
      <div style={{ width: 165, flexShrink: 0 }}>
        {WEEKS.map((w, wi) => (
          <div key={wi} style={{ marginBottom: 14 }}>
            <div style={{ color: "#E63946", fontSize: 9, fontWeight: 700, letterSpacing: 2, marginBottom: 5, padding: "0 4px" }}>B{w.block} · S{w.number}</div>
            {w.days.map((d, di) => (
              <div key={di} onClick={() => { setSelW(wi); setSelD(di); setView("tiktok"); setShowWorkflow(false); }}
                style={{ padding: "7px 10px", marginBottom: 3, borderRadius: 5, cursor: "pointer", background: selW === wi && selD === di ? "#E63946" : "#efefef", fontSize: 11, color: selW === wi && selD === di ? "#ffffff" : "#444444", border: selW === wi && selD === di ? "none" : "1px solid #e0e0e0" }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{d.date}</div>
                <div style={{ opacity: 0.8 }}>{PILLARS[d.pilar]?.emoji} {d.pilar}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <PillarBadge pilar={day.pilar} />
          <span style={{ color: "#111111", fontWeight: 700, fontSize: 14 }}>{day.titulo}</span>
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, flexWrap: "wrap" }}>
          {[{ id: "tiktok", label: "🎵 TikTok / Reel", c: "#E63946" }, { id: "instagram", label: "📸 Carrusel", c: "#E040FB" }].map(n => (
            <button key={n.id} onClick={() => { setView(n.id); setShowWorkflow(false); }}
              style={{ background: view === n.id ? n.c : "#e8e8e8", border: "none", borderRadius: 6, padding: "8px 18px", color: "#111111", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
              {n.label}
            </button>
          ))}
          <button onClick={() => setShowWorkflow(!showWorkflow)}
            style={{ background: showWorkflow ? "#FF9800" : "#e8e8e8", border: "none", borderRadius: 6, padding: "8px 18px", color: "#111111", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
            🛠 Workflow Spaces
          </button>
        </div>

        {/* Workflow Panel */}
        {showWorkflow && (() => {
          const wf = view === "tiktok" ? day.tiktok.workflow_spaces : day.instagram.workflow_carrusel;
          return (
            <div style={{ background: "#f0fff0", border: "1px solid #4CAF5055", borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ color: "#4CAF50", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>
                🛠 FREEPIK SPACES — {view === "tiktok" ? "TIKTOK / REEL" : "CARRUSEL INSTAGRAM"}
              </div>
              <div style={{ background: "#edfaed", borderRadius: 6, padding: 10, marginBottom: 12 }}>
                <div style={{ color: "#8bc34a", fontSize: 12, lineHeight: 1.7 }}>{wf?.resumen}</div>
              </div>
              {wf?.pasos?.map((p, pi) => (
                <div key={pi} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                  <span style={{ background: "#4CAF50", color: "#000", borderRadius: 3, padding: "2px 7px", fontSize: 10, fontWeight: 900, flexShrink: 0 }}>P{p.paso}</span>
                  <div><span style={{ color: "#4CAF50", fontSize: 11, fontWeight: 700 }}>{p.nodo}</span><span style={{ color: "#666666", fontSize: 11 }}> — {p.detalle}</span></div>
                </div>
              ))}
              {view === "instagram" && day.instagram.historia && (
                <div style={{ background: "#f0fffe", borderRadius: 6, padding: 12, marginTop: 12, borderLeft: "3px solid #00BCD4" }}>
                  <div style={{ color: "#00BCD4", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>📲 HISTORIA — {day.instagram.historia.tipo}</div>
                  <div style={{ color: "#b2ebf2", fontSize: 12, lineHeight: 1.7 }}>{day.instagram.historia.instruccion}</div>
                </div>
              )}
            </div>
          );
        })()}

        {/* TikTok View */}
        {view === "tiktok" && (
          <div>
            <div style={{ background: "#E6394611", border: "1px solid #E63946", borderRadius: 8, padding: 14, marginBottom: 14 }}>
              <div style={{ color: "#E63946", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>HOOK — PRIMEROS 3 SEGUNDOS</div>
              <div style={{ color: "#111111", fontSize: 14, fontWeight: 600, marginBottom: 6 }}>"{day.tiktok.hook}"</div>
              <div style={{ color: "#666666", fontSize: 11 }}>⏱ {day.tiktok.duracion} · 🎙 Locución incluida · {day.tiktok.pantallas.length} pantallas</div>
            </div>
            {day.tiktok.pantallas.map((p, pi) => {
              const isHook = pi === 0, isCta = pi === day.tiktok.pantallas.length - 1;
              const accent = isHook ? "#E63946" : isCta ? "#4CAF50" : "#333";
              return (
                <div key={pi} style={{ background: "#f2f2f2", borderRadius: 6, padding: 14, marginBottom: 8, borderLeft: `3px solid ${accent}` }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
                    <span style={{ background: "#e0e0e0", borderRadius: 3, padding: "2px 8px", fontSize: 10, color: "#E63946", fontFamily: "monospace" }}>{p.tiempo}</span>
                    <span style={{ background: "#ebebeb", borderRadius: 3, padding: "2px 8px", fontSize: 10, color: "#666666", letterSpacing: 1 }}>{p.tipo}</span>
                  </div>
                  <div style={{ background: "#ffffff", borderRadius: 4, padding: 10, marginBottom: 8 }}>
                    <div style={{ color: "#888888", fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>TEXTO EN PANTALLA</div>
                    <div style={{ color: "#111111", fontSize: 13, fontWeight: 600, whiteSpace: "pre-line", lineHeight: 1.5 }}>{p.texto}</div>
                  </div>
                  <div style={{ background: "#f0f0ff", borderRadius: 4, padding: 10, marginBottom: 8 }}>
                    <div style={{ color: "#2196F3", fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>🎬 ANIMACIÓN — Premiere Pro / After Effects</div>
                    <div style={{ color: "#555555", fontSize: 12 }}>{p.animacion}</div>
                  </div>
                  {p.prompt_imagen && (
                    <div style={{ background: "#f0fff0", borderRadius: 4, padding: 10, marginBottom: p.prompt_video ? 6 : 0 }}>
                      <div style={{ color: "#4CAF50", fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>🖼 Image Gen — Nano Banana Pro · 9:16 · 2K→4K</div>
                      <div style={{ color: "#8bc34a", fontSize: 11, fontFamily: "monospace", lineHeight: 1.6 }}>{p.prompt_imagen}</div>
                    </div>
                  )}
                  {p.prompt_video && (
                    <div style={{ background: "#fdf0fd", borderRadius: 4, padding: 10 }}>
                      <div style={{ color: "#E040FB", fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>🎥 Video Gen — Kling 3.0 · 9:16 · 5s · 1080p</div>
                      <div style={{ color: "#ce93d8", fontSize: 11, fontFamily: "monospace", lineHeight: 1.6 }}>{p.prompt_video}</div>
                    </div>
                  )}
                </div>
              );
            })}
            {day.tiktok.locucion_texto && (
              <div style={{ background: "#f0fff0", border: "1px solid #4CAF5055", borderRadius: 8, padding: 16 }}>
                <div style={{ color: "#4CAF50", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>🎙 LOCUCIÓN — Voiceover (11Labs en Spaces) → .mp3</div>
                <div style={{ color: "#c8e6c9", fontSize: 13, lineHeight: 1.8, fontStyle: "italic" }}>{day.tiktok.locucion_texto}</div>
              </div>
            )}
          </div>
        )}

        {/* Instagram View */}
        {view === "instagram" && (
          <div>
            <div style={{ background: "#E040FB11", border: "1px solid #E040FB", borderRadius: 8, padding: 14, marginBottom: 14 }}>
              <div style={{ color: "#E040FB", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>CARRUSEL INSTAGRAM FEED</div>
              <div style={{ color: "#111111", fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{day.instagram.titulo}</div>
              <div style={{ color: "#555555", fontSize: 12 }}>{day.instagram.tipo} · {day.instagram.slides} slides</div>
            </div>
            <div style={{ background: "#faf0ff", borderRadius: 8, padding: 14, marginBottom: 14, borderLeft: "3px solid #E040FB" }}>
              <div style={{ color: "#E040FB", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>CAPTION</div>
              <div style={{ color: "#222222", fontSize: 13, fontStyle: "italic", lineHeight: 1.7, marginBottom: 8 }}>{day.instagram.caption}</div>
              <div style={{ color: "#888888", fontSize: 11 }}>{day.instagram.hashtags}</div>
            </div>
            <div style={{ color: "#666666", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>SLIDES — Nano Banana Pro · 4:5 · Nodo Lista batch</div>
            {day.instagram.guion_slides.map((slide, si) => (
              <div key={si} style={{ background: "#f2f2f2", borderRadius: 6, padding: 14, marginBottom: 8, borderLeft: "3px solid #E040FB" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                  <span style={{ background: "#E040FB", borderRadius: 3, padding: "2px 8px", fontSize: 11, color: "#111111", fontWeight: 700 }}>Slide {slide.numero}</span>
                  <span style={{ color: "#111111", fontSize: 13, fontWeight: 600 }}>{slide.titulo}</span>
                </div>
                {slide.subtitulo && <div style={{ color: "#E040FB", fontSize: 12, fontStyle: "italic", marginBottom: 6 }}>{slide.subtitulo}</div>}
                {slide.cuerpo && (
                  <div style={{ background: "#ffffff", borderRadius: 4, padding: 10, marginBottom: 8 }}>
                    <div style={{ color: "#333333", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-line" }}>{slide.cuerpo}</div>
                  </div>
                )}
                {slide.prompt_imagen && (
                  <div style={{ background: "#f0fff0", borderRadius: 4, padding: 10 }}>
                    <div style={{ color: "#4CAF50", fontSize: 9, letterSpacing: 2, marginBottom: 4 }}>🖼 Image Gen — Nano Banana Pro · 4:5 · Nodo Lista</div>
                    <div style={{ color: "#8bc34a", fontSize: 11, fontFamily: "monospace", lineHeight: 1.6 }}>{slide.prompt_imagen}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REFERENCIAS ──────────────────────────────────────────────────────────────
function ReferenciasTab() {
  return (
    <div>
      <div style={{ background: "#E6394611", border: "1px solid #E63946", borderRadius: 8, padding: 14, marginBottom: 24 }}>
        <div style={{ color: "#E63946", fontWeight: 700, marginBottom: 4 }}>30 fuentes curadas para alimentar el contenido</div>
        <div style={{ color: "#666666", fontSize: 12 }}>Inspiración, datos de industria y tendencias del sector.</div>
      </div>
      {REFERENCIAS.map((cat, ci) => (
        <div key={ci} style={{ marginBottom: 28 }}>
          <div style={{ color: "#111111", fontWeight: 700, fontSize: 13, borderBottom: "1px solid #e5e5e5", paddingBottom: 8, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 3, height: 16, background: cat.color, borderRadius: 2 }} />
            {cat.cat}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
            {cat.items.map((item, ii) => (
              <div key={ii} style={{ background: "#f0f0f0", borderRadius: 6, padding: 12, borderLeft: `2px solid ${cat.color}44` }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 4 }}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ color: cat.color, fontWeight: 700, fontSize: 12, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.textDecoration = "underline"}
                    onMouseLeave={e => e.target.style.textDecoration = "none"}>
                    {item.n} ↗
                  </a>
                  <span style={{ background: "#e0e0e0", borderRadius: 3, padding: "1px 6px", fontSize: 9, color: "#777777", whiteSpace: "nowrap" }}>{item.r}</span>
                </div>
                <div style={{ color: "#666666", fontSize: 12, lineHeight: 1.5 }}>{item.d}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── TRACKER ──────────────────────────────────────────────────────────────────
function TrackerTab({ checks, toggleCheck }) {
  const total = WEEKS.reduce((a, w) => a + w.days.length * 3, 0);
  const done = Object.values(checks).filter(Boolean).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div>
      <div style={{ background: "#ebebeb", borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ color: "#111111", fontWeight: 700, fontSize: 16 }}>Progreso total</span>
          <span style={{ color: "#E63946", fontWeight: 900, fontSize: 28 }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: "#d0d0d0", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ height: "100%", width: pct + "%", background: "linear-gradient(90deg,#E63946,#FF6B6B)", borderRadius: 4, transition: "width 0.4s" }} />
        </div>
        <div style={{ color: "#888888", fontSize: 12, marginTop: 8 }}>{done} de {total} piezas · Checks guardados automáticamente 💾</div>
      </div>
      {WEEKS.map(week => (
        <div key={week.number} style={{ marginBottom: 20 }}>
          <div style={{ color: "#777777", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>B{week.block} · S{week.number} — {week.theme}</div>
          {week.days.map((day, di) => {
            const key = `${week.number}-${di}`;
            const kTT = key + "-tt", kIG = key + "-ig", kST = key + "-st";
            const allDone = checks[kTT] && checks[kIG] && checks[kST];
            return (
              <div key={di} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: allDone ? "#f0fff0" : "#fafafa", border: `1px solid ${allDone ? "#4CAF5066" : "#eeeeee"}`, borderRadius: 6, marginBottom: 4 }}>
                <span style={{ color: "#E63946", fontSize: 10, minWidth: 70, fontFamily: "monospace" }}>{day.date}</span>
                <PillarBadge pilar={day.pilar} small />
                <span style={{ color: "#333333", fontSize: 12, flex: 1 }}>{day.titulo}</span>
                {[{ k: kTT, label: "TikTok", c: "#E63946" }, { k: kIG, label: "Carrusel", c: "#E040FB" }, { k: kST, label: "Historia", c: "#00BCD4" }].map(item => (
                  <label key={item.k} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer" }}>
                    <input type="checkbox" checked={!!checks[item.k]} onChange={() => toggleCheck(item.k)} />
                    <span style={{ fontSize: 10, color: checks[item.k] ? item.c : "#aaaaaa", fontWeight: 600 }}>{item.label}</span>
                  </label>
                ))}
                {allDone && <span style={{ color: "#4CAF50", fontSize: 12 }}>✅</span>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── PROGRESO ─────────────────────────────────────────────────────────────────
function ProgresoTab({ checks }) {
  const blocks = {};
  WEEKS.forEach(w => { if (!blocks[w.block]) blocks[w.block] = []; blocks[w.block].push(w); });
  const blockStats = Object.entries(blocks).map(([block, weeks]) => {
    const allDays = weeks.flatMap(w => w.days.map((d, di) => ({ wn: w.number, di })));
    const total = allDays.length * 3;
    const done = allDays.reduce((acc, { wn, di }) => {
      const k = `${wn}-${di}`;
      return acc + ["-tt", "-ig", "-st"].filter(s => checks[k + s]).length;
    }, 0);
    return { block: Number(block), weeks, total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 };
  });
  const grandTotal = blockStats.reduce((a, b) => a + b.total, 0);
  const grandDone = blockStats.reduce((a, b) => a + b.done, 0);
  const grandPct = grandTotal > 0 ? Math.round((grandDone / grandTotal) * 100) : 0;

  return (
    <div>
      <div style={{ background: "#f5f5f5", border: "1px solid #dddddd", borderRadius: 8, padding: 20, marginBottom: 32 }}>
        <div style={{ color: "#666666", fontSize: 10, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>PROGRESO GENERAL</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ color: "#111111", fontWeight: 700, fontSize: 22 }}>Todos los bloques</span>
          <span style={{ color: "#E63946", fontWeight: 900, fontSize: 40 }}>{grandPct}%</span>
        </div>
        <div style={{ height: 12, background: "#e0e0e0", borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
          <div style={{ height: "100%", width: grandPct + "%", background: "linear-gradient(90deg,#E63946,#FF6B6B)", borderRadius: 6, transition: "width 0.6s" }} />
        </div>
        <div style={{ color: "#888888", fontSize: 12 }}>{grandDone} de {grandTotal} piezas totales</div>
      </div>
      {blockStats.map(({ block, weeks, total, done, pct }) => {
        const color = pct === 100 ? "#4CAF50" : pct >= 50 ? "#FF9800" : "#E63946";
        return (
          <div key={block} style={{ background: "#f5f5f5", border: `1px solid ${color}33`, borderRadius: 8, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={{ background: color, color: "#000", borderRadius: 4, padding: "4px 12px", fontSize: 11, fontWeight: 900, letterSpacing: 2, display: "inline-block", marginBottom: 8 }}>BLOQUE {block}</div>
                <div style={{ color: "#666666", fontSize: 12 }}>Semanas {weeks[0].number}–{weeks[weeks.length - 1].number}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ color, fontWeight: 900, fontSize: 36 }}>{pct}%</div>
                <div style={{ color: "#888888", fontSize: 11 }}>{done}/{total} piezas</div>
              </div>
            </div>
            <div style={{ height: 10, background: "#e0e0e0", borderRadius: 5, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ height: "100%", width: pct + "%", background: color, borderRadius: 5, transition: "width 0.6s" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(weeks.length, 4)}, 1fr)`, gap: 8 }}>
              {weeks.map(week => {
                const wDays = week.days.map((d, di) => ({ wn: week.number, di }));
                const wTotal = wDays.length * 3;
                const wDone = wDays.reduce((acc, { wn, di }) => {
                  const k = `${wn}-${di}`;
                  return acc + ["-tt", "-ig", "-st"].filter(s => checks[k + s]).length;
                }, 0);
                const wPct = wTotal > 0 ? Math.round((wDone / wTotal) * 100) : 0;
                const wColor = wPct === 100 ? "#4CAF50" : wPct >= 50 ? "#FF9800" : "#333";
                return (
                  <div key={week.number} style={{ background: "#ebebeb", borderRadius: 6, padding: 12, borderTop: `3px solid ${wColor}` }}>
                    <div style={{ color: "#777777", fontSize: 10, fontWeight: 700, marginBottom: 4 }}>S{week.number}</div>
                    <div style={{ color: "#555555", fontSize: 10, marginBottom: 8, lineHeight: 1.4 }}>{week.theme}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ color: wColor, fontWeight: 900, fontSize: 18 }}>{wPct}%</span>
                      <span style={{ color: "#888888", fontSize: 10 }}>{wDone}/{wTotal}</span>
                    </div>
                    <div style={{ height: 4, background: "#d0d0d0", borderRadius: 2, marginTop: 6, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: wPct + "%", background: wColor, borderRadius: 2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("calendario");
  const [checks, setChecks] = useState(() => loadChecks());

  const toggleCheck = (k) => {
    setChecks(prev => { const next = { ...prev, [k]: !prev[k] }; saveChecks(next); return next; });
  };

  const total = WEEKS.reduce((a, w) => a + w.days.length * 3, 0);
  const done = Object.values(checks).filter(Boolean).length;

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh", color: "#111111", fontFamily: "'DM Sans','Helvetica Neue',sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#f5f5f5", borderBottom: "2px solid #E63946", padding: "18px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 24, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: "#E63946", fontSize: 9, fontWeight: 700, letterSpacing: 4, marginBottom: 4 }}>PLAN ESTRATÉGICO DE CONTENIDO</div>
            <div style={{ color: "#111111", fontSize: 20, fontWeight: 900, letterSpacing: -0.5 }}>TikTok + Instagram · Abril–Junio 2026</div>
            <div style={{ color: "#888888", fontSize: 11, marginTop: 2 }}>Lun–Vie · Flujos Freepik Spaces · Premiere Pro / After Effects</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 20, flexWrap: "wrap" }}>
            {[{ label: "Reels/TikToks", c: "#E63946" }, { label: "Carruseles", c: "#E040FB" }, { label: "Historias", c: "#00BCD4" }].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ color: s.c, fontWeight: 900, fontSize: 22 }}>{WEEKS.reduce((a, w) => a + w.days.length, 0)}</div>
                <div style={{ color: "#888888", fontSize: 10 }}>{s.label}</div>
              </div>
            ))}
            <div style={{ textAlign: "center" }}>
              <div style={{ color: "#4CAF50", fontWeight: 900, fontSize: 22 }}>{total > 0 ? Math.round((done / total) * 100) : 0}%</div>
              <div style={{ color: "#888888", fontSize: 10 }}>Completado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Day strip */}
      <div style={{ background: "#ffffff", borderBottom: "1px solid #e5e5e5", padding: "8px 24px", display: "flex", gap: 6, flexWrap: "wrap" }}>
        {DAY_SCHEDULE.map(d => (
          <div key={d.dayName} style={{ display: "flex", alignItems: "center", gap: 6, background: "#f0f0f0", borderRadius: 4, padding: "4px 10px" }}>
            <span style={{ color: "#888888", fontSize: 10 }}>{d.dayName}</span>
            <span style={{ color: PILLARS[d.pilar].color, fontSize: 10, fontWeight: 700 }}>{PILLARS[d.pilar].emoji} {d.pilar}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#f5f5f5", borderBottom: "1px solid #eeeeee" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ background: "none", border: "none", borderBottom: tab === t.id ? "2px solid #E63946" : "2px solid transparent", color: tab === t.id ? "#E63946" : "#888888", padding: "13px 20px", cursor: "pointer", fontWeight: tab === t.id ? 700 : 400, fontSize: 13 }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
        {tab === "calendario"  && <CalendarioTab checks={checks} toggleCheck={toggleCheck} />}
        {tab === "guiones"     && <GuionesTab />}
        {tab === "referencias" && <ReferenciasTab />}
        {tab === "tracker"     && <TrackerTab checks={checks} toggleCheck={toggleCheck} />}
        {tab === "progreso"    && <ProgresoTab checks={checks} />}
      </div>
    </div>
  );
}
