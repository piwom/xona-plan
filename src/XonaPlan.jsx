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
    { n: "@eventoplus",             r: "Instagram + Web",   d: "La biblia del sector eventos en español." },
    { n: "@wearefearless",          r: "Instagram",         d: "Agencia UK. Estética editorial y casos de lujo." },
    { n: "@momentumww",             r: "Instagram+LinkedIn",d: "Momentum Worldwide. Referencia global en brand experience." },
    { n: "@jackmorton",             r: "Instagram+LinkedIn",d: "Casos de eventos corporativos de primer nivel." },
    { n: "experientialmarketingnews.com", r: "Web/Newsletter", d: "Datos, tendencias y casos del sector." },
  ]},
  { cat: "Cultura, Música & Festivales", color: "#E040FB", items: [
    { n: "@glastonburyfestivals",   r: "Instagram",         d: "El festival que inventó la comunidad de marca." },
    { n: "@coachella",              r: "Instagram+TikTok",  d: "Referencia en producción visual y marketing aspiracional." },
    { n: "@boilerroom",             r: "Instagram+YouTube", d: "Identidad global con contenido de nicho." },
    { n: "@redbull",                r: "TikTok+Instagram",  d: "La marca que se convirtió en productora." },
    { n: "@gentlemonster",          r: "Instagram",         d: "El retail que se convirtió en destino cultural." },
  ]},
  { cat: "Diseño de Experiencias & Espacios", color: "#00BCD4", items: [
    { n: "@meowwolfofficial",       r: "Instagram",         d: "Experiencias inmersivas. Mundos completos." },
    { n: "@teamlab_art",            r: "Instagram",         d: "Arte digital inmersivo japonés." },
    { n: "@superblue",              r: "Instagram",         d: "Arte inmersivo en Miami." },
    { n: "@thewhitakergroup",       r: "Instagram",         d: "Event design de alto nivel." },
    { n: "@refikanadol",            r: "Instagram",         d: "Data art e IA como expresión artística." },
  ]},
  { cat: "Estrategia de Marca & Marketing", color: "#4CAF50", items: [
    { n: "@marketingexamples",      r: "Instagram+Web",     d: "Análisis profundo de campañas. Indispensable." },
    { n: "@ariyh.co",               r: "Web+LinkedIn",      d: "Ciencia del comportamiento aplicada al marketing." },
    { n: "@peretti_ad",             r: "Instagram+LinkedIn",d: "Creatividad y estrategia desde Buenos Aires." },
    { n: "@sweathead_ad",           r: "Instagram",         d: "Posts cortos con insights muy densos." },
    { n: "theconciergeclub.com",    r: "Web",               d: "Artículos sobre experiential marketing documentados." },
  ]},
  { cat: "Producción Audiovisual", color: "#FF9800", items: [
    { n: "@motiondesign.school",    r: "Instagram",         d: "Motion graphics de referencia." },
    { n: "@buck.design",            r: "Instagram",         d: "Motion design y branding audiovisual top." },
    { n: "@viewmaster.studio",      r: "Instagram",         d: "Producción audiovisual para eventos y marcas." },
    { n: "@thisisdapper",           r: "Instagram",         d: "Producción creativa, calidad editorial." },
    { n: "@hellomonday",            r: "Instagram",         d: "Diseño interactivo danés de primer nivel." },
  ]},
  { cat: "IA & Tecnología Creativa", color: "#9C27B0", items: [
    { n: "@runwayml",               r: "Instagram+TikTok",  d: "Video IA. Ver qué viene cada semana." },
    { n: "@kling_ai",               r: "TikTok+Instagram",  d: "Video IA para b-roll y eventos." },
    { n: "@freepik",                r: "Instagram+TikTok",  d: "Freepik Spaces: workflow completo de producción." },
    { n: "@elevenai",               r: "Instagram",         d: "ElevenLabs. Voz integrada en Spaces." },
    { n: "@midjourney",             r: "Discord+Web",       d: "Imágenes IA. Esencial para visuales sin fotógrafo." },
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
            { tipo: "HOOK",     texto_pantalla: "UNA GALERÍA SIN PAREDES.",                        voz_off: "Una galería en Tokio no tiene paredes. Y con eso cambiaron cómo pensamos los espacios para siempre.",                                                                              animacion: "Texto blanco sobre negro. Cada línea cae con rebote suave.",        prompt_imagen: "Futuristic immersive art gallery no walls, light projections floor ceiling, visitors glowing digital water, dark cinematic --ar 9:16", prompt_video: "Slow camera drift borderless art installation, neon light rivers on floor, visitor silhouettes, dreamlike cinematic 4K" },
            { tipo: "CONTEXTO", texto_pantalla: "EL ARTE SE MUEVE CON VOS.",                       voz_off: "TeamLab Borderless: no hay salas, no hay guía, no hay recorrido fijo. El arte reacciona a dónde estás parado.",                                                                  animacion: "Fade in suave. Última línea en cian con delay.",                     prompt_imagen: "TeamLab Borderless digital art installation, glowing jellyfish dark room, visitors immersed light, aerial view --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN",  texto_pantalla: "EL ESPACIO ES LA EXPERIENCIA.",                   voz_off: "El espacio no es el contenedor de la experiencia. El espacio es la experiencia. Esa distinción lo cambia todo.",                                                                   animacion: "Fondo oscuro. Frase final en cian grande con glow pulsante.",       prompt_imagen: "Minimalist dark background, glowing cyan neon text concept, clean typographic design --ar 9:16", prompt_video: null },
            { tipo: "CONEXIÓN", texto_pantalla: "TODO COMUNICA.",                                  voz_off: "La temperatura, la iluminación, el recorrido. Cada decisión espacial le dice algo al público. Todo.",                                                                              animacion: "Blur-to-clear lento. Partículas de luz.",                           prompt_imagen: "Elegant corporate VIP lounge warm lighting, branded design elements, luxury event backstage, soft bokeh --ar 9:16", prompt_video: null },
            { tipo: "CTA",      texto_pantalla: "¿QUÉ ESPACIO TE VOLÓ LA CABEZA? 👇",             voz_off: "¿Cuál fue el último espacio o experiencia que te dejó sin palabras? Contanos abajo.",                                                                                             animacion: "Fondo cian oscuro. Flecha rebotando.",                              prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",     texto_pantalla: "$500.000.000.000",                                      voz_off: "Hay un mercado de quinientos mil millones de dólares que la mayoría de las agencias todavía no entendió.",                                             animacion: "Contador que sube de cero. Ticker financiero.",      prompt_imagen: "Financial ticker board dark background, glowing green numbers, stock market aesthetic --ar 9:16", prompt_video: "Counter increasing 500 billion, financial data visualization, green neon cinematic" },
            { tipo: "DATO",     texto_pantalla: "EL MERCADO MÁS GRANDE.",                                voz_off: "Turismo de experiencias: 430 a 530 mil millones. Naturaleza y aventura: 250 a 410 mil millones. Fuente: Statista 2025.",                               animacion: "Barras animadas izquierda a derecha.",               prompt_imagen: "Clean infographic bars market size dark, purple teal accents, data visualization --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT",  texto_pantalla: "51% DE FORTUNE 1000.",                                  voz_off: "El 51% de las empresas Fortune 1000 están aumentando su inversión en marketing experiencial este año. ¿Tu competencia está en ese grupo?",              animacion: "51% enorme en centro. Violeta.",                     prompt_imagen: "Bold 51% giant purple text, dark corporate background, data visualization --ar 9:16", prompt_video: null },
            { tipo: "POSICIÓN", texto_pantalla: "HACÉ QUE LA GENTE LO VIVA.",                            voz_off: "Ya no alcanza con hacer publicidad. Hay que hacer que la gente viva la marca. Esa es la diferencia.",                                                   animacion: "VIVA en rojo grande. Flash.",                        prompt_imagen: "Crowd live brand event, arms raised, confetti, massive LED screen, concert energy --ar 9:16", prompt_video: "Crowd branded event slow motion confetti, vibrant lighting, emotional faces" },
            { tipo: "CTA",      texto_pantalla: "¿TU EMPRESA INVIERTE EN EXPERIENCIAS? 👇",              voz_off: "¿Tu empresa ya está invirtiendo en experiencias o todavía espera? Respondé abajo.",                                                                     animacion: "Violeta oscuro. Flecha.",                            prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",      texto_pantalla: "COACHELLA NO ES UN FESTIVAL.",                    voz_off: "Coachella no es un festival. Es la campaña de marketing más cara del mundo.",                                                                               animacion: "Texto letra por letra. Glitch. Polvo dorado.",       prompt_imagen: "Coachella festival aerial, desert, massive crowd, golden hour, ferris wheel --ar 9:16", prompt_video: "Aerial drone Coachella golden sunset, massive crowd, slow motion cinematic" },
            { tipo: "ARGUMENTO", texto_pantalla: "PAGAN MILLONES POR TU FEED.",                    voz_off: "Revolve, H&M, Amazon. Pagan millones para aparecer en el feed de millones de personas que nunca pisaron el festival.",                                       animacion: "Logos fade in uno a uno.",                           prompt_imagen: "Revolve Festival Coachella activation, influencers, luxury branded space, desert editorial --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT",   texto_pantalla: "EL PRODUCTO ES EL CONTENIDO.",                   voz_off: "El producto no es la música. El producto es el contenido que generan los mismos asistentes. Eso es lo que compran las marcas.",                              animacion: "Última línea en dorado. Reveal.",                    prompt_imagen: "Influencer phone Coachella activation, perfect lighting, desert backdrop --ar 9:16", prompt_video: null },
            { tipo: "DATO",      texto_pantalla: "4.200 MILLONES DE IMPRESIONES.",                 voz_off: "En 2024, el hashtag Coachella generó más de cuatro mil doscientos millones de impresiones. Sin un solo aviso pago.",                                         animacion: "4.200M crece de pequeño a grande.",                  prompt_imagen: "Social media billions impressions, hashtag data graphic, purple gold --ar 9:16", prompt_video: null },
            { tipo: "CTA",       texto_pantalla: "¿TU MARCA DEPENDE DE LOS AVISOS? 👇",           voz_off: "¿Tu marca todavía depende de los avisos para existir? Seguinos.",                                                                                            animacion: "Rojo. Texto blanco.",                                prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",        texto_pantalla: "90% DE BRIEFS SON IGUALES.",                   voz_off: "El 90% de los briefs de eventos son todos iguales. El 10% restante gana premios. La diferencia está en las preguntas.",                                     animacion: "90% gris opaco. 10% dorado con spotlight.",          prompt_imagen: "90% grey mundane stack vs 10% golden glowing award document, spotlight --ar 9:16", prompt_video: null },
            { tipo: "EL PROMEDIO", texto_pantalla: "OBJETIVO · FECHA · PRESUPUESTO.",              voz_off: "El brief promedio: objetivo, público, fecha y presupuesto. Suficiente para ejecutar. Insuficiente para crear algo que importe.",                            animacion: "Checks grises. Ritmo lento.",                        prompt_imagen: "Generic boring brief checklist, grey corporate document --ar 9:16", prompt_video: null },
            { tipo: "EL GANADOR",  texto_pantalla: "¿QUÉ VAN A DECIR AL SALIR?",                  voz_off: "El brief que gana pregunta: qué frase dirán al salir, qué foto querrán sacarse, qué van a hacer diferente después, por qué esta experiencia y no otra.",    animacion: "Checks dorados. Ritmo más rápido.",                  prompt_imagen: "Award winning brief golden checkmarks, inspired questions, dark elegant --ar 9:16", prompt_video: null },
            { tipo: "DIFERENCIA",  texto_pantalla: "UNO DESCRIBE. EL OTRO TRANSFORMA.",           voz_off: "Uno describe el evento. El otro describe la transformación. Esa es la distancia entre un evento olvidable y uno que te cambia.",                             animacion: "Dos columnas. Segunda brilla dorada.",               prompt_imagen: "Two columns event description vs transformation, second glowing golden --ar 9:16", prompt_video: null },
            { tipo: "CTA",         texto_pantalla: "¿CUÁNTAS PREGUNTAS TIENE TU BRIEF? 👇",       voz_off: "¿Cuántas de esas preguntas tiene tu próximo brief? Contanos.",                                                                                              animacion: "Texto firme. Flecha.",                               prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",         texto_pantalla: "UN MES EN UN DÍA.",                           voz_off: "Un mes entero de contenido. Producido en un solo día. Sin grabar absolutamente nada.",                                                                      animacion: "Calendario que se llena. Colapsa a un día.",         prompt_imagen: "One month calendar collapsing to single day, content batching workflow --ar 9:16", prompt_video: "Calendar animation 30 days content created in one day, time-lapse" },
            { tipo: "EL SISTEMA",   texto_pantalla: "5 PILARES. UN DÍA AL MES.",                   voz_off: "Cinco pilares temáticos, un pilar por día de la semana, y un día al mes donde se generan todos los guiones y se producen los assets en bloque.",            animacion: "Diagrama de flujo. Cada paso con pop.",              prompt_imagen: "Content system 5 pillars workflow, batching process diagram --ar 9:16", prompt_video: null },
            { tipo: "BATCHING",     texto_pantalla: "NO UNO POR DÍA. 20 EN UN DÍA.",              voz_off: "No producís un video por día. Producís veinte en un día. El cerebro creativo funciona mejor haciendo la misma tarea en bloque.",                             animacion: "Día a día en rojo vs batching en verde.",            prompt_imagen: "Batching vs daily production, energy levels comparison, efficiency --ar 9:16", prompt_video: null },
            { tipo: "HERRAMIENTAS", texto_pantalla: "GUION → IMAGEN → VOZ → MONTAJE.",             voz_off: "Guiones con IA, imágenes y video en Freepik Spaces, voz con ElevenLabs, montaje en Premiere. Cada eslabón en su lugar.",                                    animacion: "Pipeline visual. Cada herramienta en su eslabón.",   prompt_imagen: "AI content production pipeline, script to published post, professional --ar 9:16", prompt_video: null },
            { tipo: "CTA",          texto_pantalla: "GUARDÁ ESTO. TE AHORRA HORAS. 📌",            voz_off: "Resultado: veinte Reels, veinte carruseles, veinte historias. Sin improvisar. Sin agotarse. Guardalo.",                                                       animacion: "Pin animado. Verde oscuro.",                         prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",     texto_pantalla: "UNA FERRETERÍA. $100M DESPUÉS.",                  voz_off: "Una ferretería abandonada, cero presupuesto. Hoy es un negocio de cien millones de dólares.",                                                               animacion: "Transformación: desordenado → ordenado.",            prompt_imagen: "Abandoned hardware store transforms into glowing immersive art world, dramatic before/after --ar 9:16", prompt_video: "Abandoned building door opens to spectacular immersive light world, slow motion reveal cinematic" },
            { tipo: "HISTORIA", texto_pantalla: "MEOW WOLF. 4 CIUDADES.",                          voz_off: "Meow Wolf fue fundada por artistas en Nuevo México. Hoy tiene sedes en cuatro ciudades y sin publicidad convencional.",                                     animacion: "Mapa con puntos. Número crece.",                     prompt_imagen: "Meow Wolf style immersive impossible rooms, surreal colorful world, cinematic --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT",  texto_pantalla: "NO ES GALERÍA. NO ES PARQUE.",                    voz_off: "No es galería, no es parque, no es escape room. Es un mundo nuevo. Y eso los sacó de toda competencia directa.",                                            animacion: "Tres categorías tachadas. Nueva en verde.",          prompt_imagen: "Category creation concept, three X marks, new glowing category emerging --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN",  texto_pantalla: "CREÁS ALGO NUEVO. NO HAY COMPETENCIA.",           voz_off: "Cuando creás algo que no existe, no tenés competencia directa. No hay con qué compararte.",                                                                 animacion: "Verde oscuro. Frase sola.",                          prompt_imagen: "Blue ocean strategy brand differentiation experience --ar 9:16", prompt_video: null },
            { tipo: "CTA",      texto_pantalla: "¿TU MARCA COMPITE O CREA? 👇",                   voz_off: "¿Tu marca compite dentro de una categoría conocida o está inventando una nueva? Contanos.",                                                                 animacion: "Verde oscuro. Flecha.",                              prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",    texto_pantalla: "LA NOSTALGIA ES ESTRATEGIA.",                      voz_off: "La nostalgia no es un sentimiento. Es una estrategia de marketing con resultados medibles.",                                                                 animacion: "VHS 90s. Scan lines. CRT pixelado.",                 prompt_imagen: "VHS retro 90s aesthetic scan lines saturated colors old TV effect, nostalgic marketing --ar 9:16", prompt_video: null },
            { tipo: "DATO",    texto_pantalla: "+20% DE AFINIDAD DE MARCA.",                       voz_off: "Según Google 2025, las campañas nostálgicas aumentan la afinidad de marca hasta un veinte por ciento. Nintendo, Adidas y Pepsi lo usaron con resultados récord.", animacion: "20% enorme. Logos retro.",                          prompt_imagen: "Nostalgia campaign 20% statistic retro brand icons VHS texture --ar 9:16", prompt_video: null },
            { tipo: "POR QUÉ", texto_pantalla: "VIAJE AL PASADO GARANTIZADO.",                     voz_off: "En un mundo de incertidumbre, la nostalgia es el único viaje al pasado que siempre funciona. El cerebro lo busca.",                                          animacion: "Máquina del tiempo. VHS suave.",                     prompt_imagen: "Time machine nostalgic journey warm sepia meets present VHS texture --ar 9:16", prompt_video: null },
            { tipo: "TRAMPA",  texto_pantalla: "NO REPRODUCIR. REMIXAR.",                          voz_off: "La trampa: no se trata de reproducir el pasado. La nostalgia que funciona mezcla lo familiar con algo nuevo e inesperado.",                                  animacion: "Split vintage + moderno fusionándose.",              prompt_imagen: "Nostalgia remix vintage meets modern design past present fusion --ar 9:16", prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿QUÉ MARCA TE DA MÁS NOSTALGIA? 👇",              voz_off: "¿Cuál es la marca que más te hace sentir nostalgia? Contanos abajo.",                                                                                        animacion: "TV apagándose. Negro.",                              prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",    texto_pantalla: "50 AÑOS. CERO PUBLICIDAD.",                        voz_off: "Glastonbury lleva cincuenta años sin necesitar publicidad. Doscientas mil personas en lista de espera para entradas sin lineup confirmado.",                  animacion: "Tipografía festiva sobre campo.",                    prompt_imagen: "Glastonbury festival aerial massive crowd muddy fields Pyramid Stage British summer --ar 9:16", prompt_video: "Glastonbury aerial drone crowd iconic stage golden hour cinematic" },
            { tipo: "DATOS",   texto_pantalla: "ENTRADAS AGOTADAS EN 6 MINUTOS.",                  voz_off: "Seis minutos. Sin haber visto el lineup. Sin un aviso. Desde 1970 sin parar.",                                                                               animacion: "Cada punto como sello. Verde.",                      prompt_imagen: "Glastonbury ticket demand massive waiting list community loyalty cultural institution --ar 9:16", prompt_video: null },
            { tipo: "POR QUÉ", texto_pantalla: "NO VENDEN MÚSICA. VENDEN PERTENENCIA.",            voz_off: "No se vende como festival. Se vende como pertenencia. Ir no es ver música. Es ser parte de algo que dura toda la vida.",                                     animacion: "Split: festival vs amigos recordando.",              prompt_imagen: "Friends Glastonbury belonging over music lifelong memory warm cinematic --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "LA COMUNIDAD CONVENCE POR VOS.",                   voz_off: "Las marcas que construyen comunidad no necesitan convencer. Sus comunidades los convencen por ellos.",                                                        animacion: "Cita visual. Simplicidad extrema.",                  prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿FUISTE A ALGO ASÍ? 👇",                          voz_off: "El objetivo de cualquier experiencia: que la gente quiera volver y traiga a alguien más. ¿Fuiste a algo así?",                                               animacion: "Árbol 1→3→9. Verde.",                               prompt_imagen: "Organic community growth tree referral network warm human --ar 9:16", prompt_video: null },
          ],
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
            { tipo: "HOOK",        texto_pantalla: "EL MOODBOARD YA GANÓ LA REUNIÓN.",             voz_off: "Antes de que el cliente hable de presupuesto, un buen moodboard ya ganó la presentación.",                                                                  animacion: "Texto con impacto. Fondo negro.",                    prompt_imagen: "Professional moodboard winning presentation client impressed dark studio --ar 9:16", prompt_video: null },
            { tipo: "QUÉ ES",      texto_pantalla: "NO ES UN COLLAGE.",                            voz_off: "Un moodboard no es un collage. Es la primera conversación visual entre vos y el cliente. Sin palabras técnicas.",                                            animacion: "Collage caótico → moodboard ordenado.",              prompt_imagen: "Chaotic collage vs professional curated moodboard comparison before after --ar 9:16", prompt_video: null },
            { tipo: "COMPONENTES", texto_pantalla: "PALETA · TEXTURAS · TIPO · IMAGEN.",           voz_off: "Los componentes: paleta de color definida, referencias de textura, tipografías como emoción y una imagen rectora que lo une todo.",                         animacion: "Cada componente aparece y encaja.",                  prompt_imagen: "Professional moodboard components color palette textures typography key image --ar 9:16", prompt_video: null },
            { tipo: "EL TRUCO",    texto_pantalla: "MUESTRA CÓMO VA A SENTIRSE.",                  voz_off: "El truco: no muestra cómo va a quedar. Muestra cómo va a sentirse. Esa diferencia lo cambia todo.",                                                         animacion: "Dos palabras clave. Una brilla.",                    prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",         texto_pantalla: "¿QUÉ HERRAMIENTA USÁS? 👇",                   voz_off: "¿Usás moodboards antes de las reuniones? ¿Con qué herramienta? Contanos.",                                                                                  animacion: "Oscuro. Flecha.",                                    prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",           texto_pantalla: "SIN FOTÓGRAFO. SIN LOCACIÓN.",              voz_off: "Sin fotógrafo, sin camarógrafo, sin locación. Así produce contenido visual una agencia de marketing en 2026.",                                              animacion: "Tres líneas tachándose. Impacto.",                   prompt_imagen: "Modern agency production no traditional crew 2026 concept dark cinematic --ar 9:16", prompt_video: null },
            { tipo: "EL CAMBIO",      texto_pantalla: "EL CAMBIO FUE CONCEPTUAL.",                 voz_off: "El cambio no fue tecnológico. Fue conceptual. Una agencia ya no necesita un set para contar una historia. Necesita una buena idea y un sistema.",           animacion: "Contraste set tradicional vs proceso moderno.",      prompt_imagen: "Traditional production set vs modern agency workflow conceptual change --ar 9:16", prompt_video: null },
            { tipo: "EL PROCESO",     texto_pantalla: "GUION → VISUAL → AUDIO → MONTAJE.",         voz_off: "Los cuatro pasos: guion e intención creativa, visual generado desde la idea, audio y voz de marca, montaje y color grade profesional.",                    animacion: "Cuatro pasos animados.",                             prompt_imagen: "Modern production process script visual audio color grade professional --ar 9:16", prompt_video: null },
            { tipo: "LO QUE NO CAMBIA", texto_pantalla: "EL CRITERIO NO SE REEMPLAZA.",           voz_off: "Lo que la IA no reemplaza: el criterio creativo, el ojo del director de arte, la decisión de qué contar.",                                                  animacion: "Frase contundente.",                                 prompt_imagen: "Creative direction judgment art director irreplaceable human --ar 9:16", prompt_video: null },
            { tipo: "CTA",            texto_pantalla: "¿TU AGENCIA YA ADAPTÓ EL PROCESO? 👇",     voz_off: "¿Tu agencia ya adaptó el proceso productivo o todavía trabaja como hace cinco años? Contanos.",                                                             animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",     texto_pantalla: "$45 POR NADA FÍSICO.",                            voz_off: "¿Cuánto pagarías por entrar a un museo sin cuadros, sin esculturas, sin nada fijo? Superblue Miami cobra cuarenta y cinco dólares.",                        animacion: "Pregunta línea a línea.",                            prompt_imagen: "Superblue Miami immersive light installation no physical art visitors wonder --ar 9:16", prompt_video: "Visitors walking glowing immersive light installation wonder awe slow motion" },
            { tipo: "CONTEXTO", texto_pantalla: "CAPACIDAD LIMITADA. SIEMPRE CAMBIA.",             voz_off: "Capacidad limitada e intencional. Experiencias que cambian cada temporada. Todo diseñado para que no puedas volver a ver lo mismo.",                        animacion: "Datos con ticker.",                                  prompt_imagen: "Superblue premium immersive experience limited capacity luxury --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT",  texto_pantalla: "NO SE PUEDE DOWNLOADEAR.",                        voz_off: "Lo que venden no se puede downloadear ni comprar en Amazon. No se screenshottea con el mismo efecto. Solo se puede vivir.",                                 animacion: "Lista en rojo de lo que NO se puede. Última frase blanca.", prompt_imagen: "Cannot download experience concept irreplaceable live moment --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN",  texto_pantalla: "EL VALOR ESTÁ EN EL MOMENTO.",                    voz_off: "El valor no está en el objeto. Está en el momento. Y el momento no se puede copiar. Esa es la ventaja competitiva definitiva.",                              animacion: "Tres frases. Pausa. Impacto.",                       prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",      texto_pantalla: "¿CUÁNTO VALE UN MOMENTO ASÍ? 👇",                voz_off: "¿Cuánto vale un momento que no se puede guardar? Contanos qué experiencia inmersiva te impactó.",                                                           animacion: "Oscuro. Cálido.",                                    prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",    texto_pantalla: "TAYLOR SWIFT ES UNA AGENCIA.",                     voz_off: "Taylor Swift no contrató una agencia de marketing. Taylor Swift es una agencia de marketing.",                                                               animacion: "Primera frase gris. Segunda en rojo.",               prompt_imagen: "Massive concert stadium 70000 people epic scale cinematic aerial --ar 9:16", prompt_video: null },
            { tipo: "DATOS",   texto_pantalla: "$2.077M. RÉCORD MUNDIAL.",                         voz_off: "Dos mil setenta y siete millones de dólares. Ciento cuarenta y nueve ciudades. Cuatro continentes. El tour más exitoso de la historia.",                    animacion: "Cada número con ticker.",                            prompt_imagen: "Record breaking tour revenue billions world tour scale data visualization --ar 9:16", prompt_video: null },
            { tipo: "FÓRMULA", texto_pantalla: "ERAS · EASTER EGGS · SWIFTIES.",                   voz_off: "Las eras como capítulos narrativos, easter eggs que activan fans, y las Swifties como departamento de marketing orgánico.",                                 animacion: "Lista con íconos.",                                  prompt_imagen: "Taylor Swift Eras chapters storytelling fan engagement mechanisms --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "NO VENDE CANCIONES. VENDE MOMENTOS.",              voz_off: "Ella no vende canciones. Vende momentos en el tiempo que la gente quiere vivir para siempre. Ese es el negocio.",                                           animacion: "Cita visual. Pausa 1s.",                             prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿TU MARCA TIENE CAPÍTULOS? 👇",                   voz_off: "Ese es el negocio del marketing experiencial: crear esos momentos. ¿Tu marca tiene capítulos así?",                                                         animacion: "Negro. Simple.",                                    prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",            texto_pantalla: "EL FESTIVAL MÁS INFLUYENTE SIN DINERO.",  voz_off: "El festival más influyente del mundo no acepta dinero. Y eso lo convirtió en el modelo más copiado del planeta.",                                           animacion: "Fuego en el fondo. Blanco sobre naranja.",           prompt_imagen: "Burning Man desert night massive fire sculptures community surreal aerial --ar 9:16", prompt_video: "Burning Man aerial fire installations community camp night cinematic" },
            { tipo: "RADICAL GIFTING", texto_pantalla: "LA MONEDA ES LA PARTICIPACIÓN.",          voz_off: "Burning Man opera con radical gifting: no hay compra-venta, todo se regala, la moneda es la participación activa.",                                         animacion: "Regalo. Moneda tachada.",                            prompt_imagen: "Radical gift economy no money sharing community participation currency --ar 9:16", prompt_video: null },
            { tipo: "LA INFLUENCIA",   texto_pantalla: "SILICON VALLEY. 40 AÑOS DE CULTURA.",     voz_off: "Setenta mil personas radicalmente activas. Influencia directa en Silicon Valley. Cuarenta años de cultura viva sin publicidad.",                            animacion: "Árbol de influencia.",                               prompt_imagen: "Cultural influence Silicon Valley connection 40 year impact global adoption --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN",         texto_pantalla: "CREAR SIN TRANSACCIÓN TIENE PODER.",      voz_off: "Las marcas que solo miden ROI inmediato no entienden el poder de crear sin transacción. La generosidad construye más lealtad que la publicidad.",           animacion: "Contraste ROI vs comunidad.",                        prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",             texto_pantalla: "¿QUÉ PUEDE REGALAR TU MARCA? 👇",        voz_off: "¿Qué puede regalar tu marca en su próxima experiencia? No el producto. Algo que valga más.",                                                                animacion: "Naranja oscuro.",                                    prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",          texto_pantalla: "EL SONIDO LLEGA ANTES QUE LA IMAGEN.",      voz_off: "El sonido llega al cerebro 0.05 segundos antes que la imagen. Sentís el evento antes de verlo.",                                                             animacion: "Forma de onda pulsando. Impacto.",                   prompt_imagen: "Audio waveform concept sound design events frequency visualization dark --ar 9:16", prompt_video: null },
            { tipo: "LOS ERRORES",   texto_pantalla: "3 ERRORES MUY COMUNES.",                    voz_off: "Los tres errores más comunes: música sin curatoría, volumen sin zonas diferenciadas, y silencio no diseñado. El silencio también es diseño.",                animacion: "Lista en rojo.",                                     prompt_imagen: "Sound design mistakes events bad music curation volume zones silence --ar 9:16", prompt_video: null },
            { tipo: "LO QUE FUNCIONA", texto_pantalla: "BPM · AMBIENT · SILENCIO ESTRATÉGICO.",  voz_off: "Lo que funciona: BPM específico para el ingreso, ambient para la zona VIP, y silencio calculado justo antes del momento clave del evento.",                  animacion: "Tres zonas como frecuencias.",                       prompt_imagen: "Professional event sound zones BPM ambient strategic silence --ar 9:16", prompt_video: null },
            { tipo: "EL ROL",        texto_pantalla: "NO ES EL QUE PONE SPOTIFY.",                voz_off: "El director de sonido no es el que pone Spotify. Es el que diseña la energía del espacio. Es un rol creativo, no técnico.",                                  animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",           texto_pantalla: "¿TU EVENTO TIENE DIRECTOR DE SONIDO? 👇",  voz_off: "¿Hay un director de sonido en tu próximo evento o alguien que pone Spotify? Contanos.",                                                                       animacion: "Verde oscuro. Flecha.",                              prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",       texto_pantalla: "3 MINUTOS. APROBADA O RECHAZADA.",              voz_off: "El 80% de las campañas se aprueban o rechazan en los primeros tres minutos de presentación. No por la idea. Por cómo se presenta.",                        animacion: "Reloj. Impacto.",                                    prompt_imagen: "Campaign approved or rejected first 3 minutes presentation moment dark --ar 9:16", prompt_video: null },
            { tipo: "POR QUÉ",    texto_pantalla: "EL CLIENTE COMPRA SEGURIDAD.",                  voz_off: "El cliente no compra la campaña. Compra la seguridad de que va a funcionar. Esa distinción cambia todo lo que hacés antes de entrar.",                     animacion: "Idea vs seguridad.",                                 prompt_imagen: "Client buys security not idea campaign presentation psychology --ar 9:16", prompt_video: null },
            { tipo: "EL ORDEN",   texto_pantalla: "PROBLEMA → INSIGHT → CAMPAÑA.",                 voz_off: "El orden que funciona: el problema del cliente, el insight que lo cambia todo, la campaña como solución, y por qué va a funcionar.",                        animacion: "Escalera de confianza.",                             prompt_imagen: "Presentation order problem insight campaign why it works trust --ar 9:16", prompt_video: null },
            { tipo: "EL INSIGHT", texto_pantalla: "EL SLIDE DEL INSIGHT LO DEFINE TODO.",          voz_off: "El momento que define todo es el slide del insight. Si el cliente dice 'nunca lo había pensado así', ganaste la sala.",                                    animacion: "El momento clave.",                                  prompt_imagen: "Insight slide key moment winning the room aha moment presentation --ar 9:16", prompt_video: null },
            { tipo: "CTA",        texto_pantalla: "¿TU PRESENTACIÓN EMPIEZA CON EL CLIENTE? 👇",  voz_off: "¿Tu última presentación empezó por el problema del cliente o por tu agencia? Contanos.",                                                                   animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
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
            { tipo: "HOOK",    texto_pantalla: "MÁS EN ARTE QUE EN PUBLICIDAD.",                   voz_off: "Una marca de anteojos que gasta más en arte que en publicidad. Y vende más que todas las demás del sector.",                                                 animacion: "Elegancia extrema.",                                 prompt_imagen: "Gentle Monster luxury eyewear museum store surreal art installation avant-garde --ar 9:16", prompt_video: "Luxury eyewear museum store slow cinematic pan surreal art installations architectural" },
            { tipo: "MODELO",  texto_pantalla: "CADA LOCAL ES UN MUSEO.",                          voz_off: "Gentle Monster, Seúl. Cada local es una instalación de arte que cambia cada seis semanas. Sin publicidad. La prensa habla sola.",                           animacion: "Datos minimalistas.",                                prompt_imagen: "Gentle Monster Seoul flagship rotating art exhibitions architectural marvel --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT", texto_pantalla: "CREÁS DESTINO. NO NECESITÁS CONVENCER.",           voz_off: "Si creás algo tan extraordinario que la gente quiere ir a verlo, no necesitás convencerlos de que compren. El deseo llega solo.",                           animacion: "Lógica en tres pasos.",                              prompt_imagen: "Destination retail logic desire over push extraordinary experience --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "EL RETAIL DEL FUTURO CREA DESTINOS.",              voz_off: "El retail del futuro no vende. Crea destinos. La diferencia entre un punto de venta y un lugar que la gente elige visitar.",                                animacion: "Negro. Frase sola.",                                 prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿TU MARCA CREA DESTINOS? 👇",                     voz_off: "¿Tu marca crea destinos o tiene puntos de venta? ¿Conocías Gentle Monster?",                                                                                animacion: "Negro. Flecha.",                                     prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Gentle Monster: retail como destino cultural", caption: "Sin publicidad. Cada local es un museo. 🕶️", hashtags: "#GentleMonster #RetailExperience #BrandStrategy #DestinationRetail",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen (Nano Banana Pro · 4:5 · 2K)", detalle: "Galería de lujo, minimalismo, arquitectura premium" }, { paso: 2, nodo: "Designer", detalle: "Tipografía editorial" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Conocías Gentle Monster? 🕶️'" },
          guion_slides: [ { numero: 1, titulo: "GENTLE MONSTER", subtitulo: "Retail como destino cultural", cuerpo: "", prompt_imagen: "Gentle Monster luxury cover museum retail avant-garde dark --ar 4:5" }, { numero: 2, titulo: "Cada local: un museo", cuerpo: "Instalaciones que cambian cada 6 semanas.", prompt_imagen: "Rotating art installation retail 6 weeks --ar 4:5" }, { numero: 3, titulo: "Sin publicidad", cuerpo: "La prensa cubre las instalaciones. Los visitantes generan el contenido.", prompt_imagen: "PR driven no paid media organic visitors --ar 4:5" }, { numero: 4, titulo: "La lógica del destino", cuerpo: "Algo extraordinario que la gente quiere visitar = no necesitás convencerlos.", prompt_imagen: "Destination retail logic desire over push --ar 4:5" }, { numero: 5, titulo: "¿Tu marca crea destinos?", cuerpo: "¿O solo puntos de venta?", prompt_imagen: "Future retail shareable destination --ar 4:5" } ] } },
      { date: "Mar 13/5", pilar: "INDUSTRIA", titulo: "El ROI del marketing experiencial — cómo medir lo que nadie sabe medir",
        tiktok: { hook: "La pregunta que paraliza a toda agencia: ¿cómo medís el retorno de una experiencia?", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética data/métricas → Voiceover (11Labs) → After Effects con gráficas animadas", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas de métricas, NPS, UGC" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Escala NPS animada" } ] },
          pantallas: [
            { tipo: "HOOK",     texto_pantalla: "¿CÓMO MEDÍS UNA EXPERIENCIA?",                   voz_off: "La pregunta que paraliza a toda agencia: ¿cómo medís el retorno de una experiencia? Hay métricas que importan y métricas de vanidad.",                     animacion: "Signo de interrogación.",                            prompt_imagen: "ROI question mark experiential marketing measurement dark --ar 9:16", prompt_video: null },
            { tipo: "INÚTILES", texto_pantalla: "ASISTENTES. SHARES. VANIDAD.",                    voz_off: "Las métricas de vanidad: asistentes, shares, menciones sin contexto, costo por persona. Suenan bien. No dicen nada.",                                       animacion: "Lista en rojo.",                                     prompt_imagen: "Vanity metrics crossed out attendees shares mentions --ar 9:16", prompt_video: null },
            { tipo: "REALES",   texto_pantalla: "NPS · UGC · CONVERSIÓN · LIFETIME VALUE.",        voz_off: "Las que importan: NPS post-evento, UGC generado, conversión a lead, lifetime value y porcentaje que recomienda la experiencia.",                            animacion: "Lista verde.",                                       prompt_imagen: "Real event metrics NPS UGC conversion lifetime value --ar 9:16", prompt_video: null },
            { tipo: "NPS",      texto_pantalla: "EL NPS LO DICE TODO.",                            voz_off: "El NPS es la métrica clave: cuántos recomendarían la experiencia. Si ese número es alto, el evento funcionó. Si es bajo, hay que entender por qué.",       animacion: "Escala NPS animada.",                                prompt_imagen: "Net Promoter Score scale key event metric --ar 9:16", prompt_video: null },
            { tipo: "CTA",      texto_pantalla: "¿CON QUÉ MÉTRICA MEDÍS TUS EVENTOS? 👇",         voz_off: "¿Con qué métrica medís tus eventos? Las métricas se definen antes del evento, no después. Contanos.",                                                        animacion: "Oscuro.",                                            prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Las métricas de eventos que importan", caption: "Las métricas que importan no son las que te dijeron. 📊", hashtags: "#EventMetrics #NPS #ROI #DataDriven",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Rojo para inútiles, verde para reales" }, { paso: 2, nodo: "Designer", detalle: "NPS visual" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Cuál es la primera métrica que mirás después de un evento?'" },
          guion_slides: [ { numero: 1, titulo: "MÉTRICAS QUE IMPORTAN", subtitulo: "Y las que no", cuerpo: "", prompt_imagen: "Event metrics cover dark data real vs vanity --ar 4:5" }, { numero: 2, titulo: "Las inútiles", cuerpo: "Asistentes. Shares. Menciones. Vanidad pura.", prompt_imagen: "Vanity metrics red X --ar 4:5" }, { numero: 3, titulo: "Las reales", cuerpo: "NPS · UGC · Conversión · Lifetime value · % recomienda", prompt_imagen: "Real metrics green NPS UGC --ar 4:5" }, { numero: 4, titulo: "Por qué el NPS", cuerpo: "Cuántos recomendarían la experiencia. Eso mide si funcionó.", prompt_imagen: "NPS scale key indicator --ar 4:5" }, { numero: 5, titulo: "Definir antes", cuerpo: "Las métricas se definen ANTES del evento, no después.", prompt_imagen: "Metrics roadmap before event --ar 4:5" } ] } },
      { date: "Mié 14/5", pilar: "CULTURA", titulo: "Fuerza Bruta: el caso argentino que conquistó Broadway",
        tiktok: { hook: "Un espectáculo argentino sin sillas ni escenario fijo, donde el público es el protagonista. Fue a Broadway y ganó.", duracion: "50 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Immersive theater no seats audience surrounded performers water projections cinematic'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: expansión, por qué funciona, lección" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tipo: "HOOK",     texto_pantalla: "SIN SILLAS. EL PÚBLICO ES EL PROTAGONISTA.",     voz_off: "Un espectáculo argentino sin sillas, sin escenario fijo, donde el público es el protagonista. Fue a Broadway y ganó.",                                       animacion: "Texto con impacto.",                                 prompt_imagen: "Immersive theater no seats audience surrounded performers water projections --ar 9:16", prompt_video: "Immersive theater no seats performers surround audience water projection cinematic" },
            { tipo: "CONTEXTO", texto_pantalla: "BUENOS AIRES → 60 PAÍSES → BROADWAY.",           voz_off: "Fuerza Bruta, Buenos Aires, 2003. Más de veinte años. Sesenta países. Dos temporadas en Broadway y el New York Times.",                                      animacion: "Mapa de expansión.",                                 prompt_imagen: "Fuerza Bruta Argentine theater international success world tour --ar 9:16", prompt_video: null },
            { tipo: "POR QUÉ",  texto_pantalla: "NO PODÉS SER ESPECTADOR PASIVO.",                voz_off: "No es teatro, no es concierto. Es una experiencia de 360 grados donde no podés quedarte pasivo. Eso lo hace imposible de olvidar.",                         animacion: "Categorías tachadas. Nueva.",                        prompt_imagen: "360 immersive experience active audience no passive spectator --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN",  texto_pantalla: "ARGENTINA CREA PARA EL MUNDO.",                  voz_off: "La Argentina tiene una de las industrias creativas más poderosas del mundo. Y muchas veces no lo sabemos.",                                                  animacion: "Mapa brillando. Rojo.",                              prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",      texto_pantalla: "¿FUISTE A FUERZA BRUTA? 👇",                    voz_off: "Cuando rompés la barrera activo-pasivo, la experiencia queda para siempre. ¿Fuiste a Fuerza Bruta?",                                                         animacion: "Rojo oscuro.",                                       prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Fuerza Bruta: Buenos Aires → Broadway", caption: "Sin sillas. Sin escenario. Así se conquista el mundo. 🇦🇷", hashtags: "#FuerzaBruta #Argentina #TeatroInmersivo #CulturaArgentina",
          workflow_carrusel: { resumen: "Lista 6 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Teatro inmersivo, agua, luz, 360" }, { paso: 2, nodo: "Designer", detalle: "Mapa expansión, datos Broadway" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Fuiste a Fuerza Bruta?' → Sí, increíble / No pero quiero / ¿Qué es? / Fui en el exterior" },
          guion_slides: [ { numero: 1, titulo: "FUERZA BRUTA", subtitulo: "Buenos Aires → Broadway", cuerpo: "", prompt_imagen: "Fuerza Bruta immersive theater cover water projections cinematic --ar 4:5" }, { numero: 2, titulo: "Sin sillas. Sin escenario.", cuerpo: "El público se mueve dentro. Cada vez es diferente.", prompt_imagen: "360 theater moving audience no stage --ar 4:5" }, { numero: 3, titulo: "20 años. 60 países.", cuerpo: "De Buenos Aires al New York Times. Broadway.", prompt_imagen: "World map Argentine theater success --ar 4:5" }, { numero: 4, titulo: "Por qué funciona", cuerpo: "No podés ser pasivo. Eso es lo que lo hace imposible de olvidar.", prompt_imagen: "Active immersion experience no passive --ar 4:5" }, { numero: 5, titulo: "La lección", cuerpo: "Cuando rompés la barrera activo/pasivo, la experiencia queda para siempre.", prompt_imagen: "Breaking passive barrier experience --ar 4:5" }, { numero: 6, titulo: "Argentina crea", cuerpo: "Una industria creativa poderosa. Y muchas veces no lo sabemos.", prompt_imagen: "Argentina creative industry cultural export --ar 4:5" } ] } },
      { date: "Jue 15/5", pilar: "OFICIO", titulo: "El checklist de producción que evita el 80% de los errores",
        tiktok: { hook: "El 80% de los problemas del día del evento se podían prevenir con un checklist correcto.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → After Effects con checks animados", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "5 pantallas: caos, organización, D-1, D-Day" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Checks animados secuenciales" } ] },
          pantallas: [
            { tipo: "HOOK",    texto_pantalla: "EL 80% ERA PREVENIBLE.",                           voz_off: "El 80% de los problemas del día del evento se podían prevenir con un checklist correcto.",                                                                  animacion: "80% en rojo.",                                       prompt_imagen: "80 percent preventable event problems chaos vs preparation --ar 9:16", prompt_video: null },
            { tipo: "ERRORES", texto_pantalla: "LOS 5 MÁS FRECUENTES.",                           voz_off: "Los cinco más frecuentes: proveedor sin confirmar, técnica que falla, timeline no compartido, sin acreditar, sin plan B.",                                  animacion: "Lista roja.",                                        prompt_imagen: "Event day mistakes red list preventable --ar 9:16", prompt_video: null },
            { tipo: "D-1",     texto_pantalla: "EL DÍA ANTES LO DEFINE TODO.",                    voz_off: "D-1: confirmar proveedores, ensayo técnico, timeline al equipo, credenciales listas y plan B comunicado a todos.",                                          animacion: "Checks verdes.",                                     prompt_imagen: "D minus 1 checklist green checkmarks preparation --ar 9:16", prompt_video: null },
            { tipo: "D-DAY",   texto_pantalla: "BRIEFING 8AM. COMMS CADA 30 MIN.",                voz_off: "Día del evento: briefing a las 8, walk-through completo, test de audio y video, accesos confirmados y comunicación cada treinta minutos.",                  animacion: "Checks más rápidos.",                                prompt_imagen: "Event day checklist morning execution --ar 9:16", prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "GUARDÁ ESTE CHECKLIST. 📌",                       voz_off: "No improvisa el que no prepara. Guardá este video. Te va a ahorrar un caos.",                                                                               animacion: "Pin. Verde.",                                        prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "El checklist de producción — guardalo", caption: "El 80% era prevenible. 📋", hashtags: "#EventManagement #Checklist #Produccion",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Dark ejecutivo, checks profesionales" }, { paso: 2, nodo: "Designer", detalle: "Checks grandes ✓" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Cuál checklist usás? 📋'" },
          guion_slides: [ { numero: 1, titulo: "EL CHECKLIST", subtitulo: "Guardalo", cuerpo: "", prompt_imagen: "Event production checklist cover dark professional --ar 4:5" }, { numero: 2, titulo: "El 80% era prevenible", cuerpo: "Proveedor sin confirmar. Técnica que falla. Timeline no compartido.", prompt_imagen: "Preventable problems 80% --ar 4:5" }, { numero: 3, titulo: "D-1", cuerpo: "✓ Proveedores ✓ Ensayo ✓ Timeline ✓ Credenciales ✓ Plan B", prompt_imagen: "Day before checklist green --ar 4:5" }, { numero: 4, titulo: "D-Day", cuerpo: "✓ Briefing 8am ✓ Walk-through ✓ AV ✓ Accesos ✓ Comms 30min", prompt_imagen: "Event day execution --ar 4:5" }, { numero: 5, titulo: "No improvisa el que no prepara", cuerpo: "Este sistema funciona.", prompt_imagen: "Preparation system reliability --ar 4:5" } ] } },
      { date: "Vie 16/5", pilar: "PROCESO", titulo: "La estructura de pitch que gana antes de hablar de precio",
        tiktok: { hook: "La mayoría de las propuestas se pierden en el primer slide. Así se hace la que gana.", duracion: "55 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro simulando slides", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Estructura perdedora, ganadora, insight, precio al final" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro", detalle: "Simular avance de slides" } ] },
          pantallas: [
            { tipo: "HOOK",        texto_pantalla: "LA MAYORÍA SE PIERDE EN EL PRIMER SLIDE.",    voz_off: "La mayoría de las propuestas se pierden en el primer slide. No por la idea. Por el orden en que la presentan.",                                              animacion: "Propuesta que se desvanece.",                        prompt_imagen: "Creative proposal fading away lost pitch dark --ar 9:16", prompt_video: null },
            { tipo: "LA QUE PIERDE", texto_pantalla: "QUIÉNES SOMOS. SERVICIOS. CLIENTES.",      voz_off: "La que pierde: quiénes somos, servicios, clientes y después la propuesta. Predecible. El cliente se desconecta antes de llegar a lo bueno.",                animacion: "Slides aburridos.",                                  prompt_imagen: "Boring pitch structure predictable corporate --ar 9:16", prompt_video: null },
            { tipo: "LA QUE GANA", texto_pantalla: "PROBLEMA → INSIGHT → SOLUCIÓN.",             voz_off: "La que gana: el problema del cliente, el insight que nadie vio, la solución, y por qué nosotros. En ese orden.",                                             animacion: "Slides dorados.",                                    prompt_imagen: "Winning pitch structure client problem insight solution dark elegant --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT",     texto_pantalla: "EL SLIDE 2 ES EL MÁS IMPORTANTE.",           voz_off: "El slide dos es el más importante. Si sorprendés ahí, ganaste la presentación antes de mostrar la campaña.",                                                 animacion: "Spotlight.",                                         prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",         texto_pantalla: "¿TU PITCH EMPIEZA CON VOS O CON EL CLIENTE? 👇", voz_off: "El precio siempre al final. ¿Tu pitch empieza con vos o con el cliente?",                                                                              animacion: "Rojo. Oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
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
            { tipo: "HOOK",     texto_pantalla: "MILLONES DE DATOS COMO PINTURA.",                 voz_off: "Un artista que usa millones de datos como pintura. Sus obras están en el MoMA.",                                                                             animacion: "Streams de datos → arte.",                          prompt_imagen: "Refik Anadol data art installation flowing neural network streams MoMA --ar 9:16", prompt_video: "Data streams flowing becoming visual art neural network cinematic" },
            { tipo: "CONTEXTO", texto_pantalla: "OBRA PERMANENTE EN EL MoMA.",                     voz_off: "Refik Anadol usa IA para crear instalaciones que ningún ser humano podría imaginar solo. Primera obra de IA en la colección permanente del MoMA.",           animacion: "Datos que fluyen.",                                  prompt_imagen: "Data art MoMA permanent collection AI creative installation --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT",  texto_pantalla: "DEPENDE DE QUÉ LE DAS PARA PENSAR.",              voz_off: "La pregunta: ¿la IA puede crear arte? Anadol ya respondió. Depende de qué le des para pensar. El material importa.",                                         animacion: "Pregunta. Respuesta en cian.",                       prompt_imagen: "AI art creation question human data artistic material --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN",  texto_pantalla: "LOS DATOS SON MEMORIA COLECTIVA.",                voz_off: "Los datos no son fríos. Son la memoria colectiva de la humanidad. Y él los convirtió en belleza.",                                                           animacion: "Oscuro. Cian.",                                      prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",      texto_pantalla: "¿LA IA PUEDE CREAR ALGO BELLO? 👇",              voz_off: "¿Creés que la IA puede crear algo verdaderamente bello? Contanos.",                                                                                          animacion: "Oscuro. Cian.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Refik Anadol: cuando los datos se convierten en arte", caption: "La IA puede crear belleza. Refik Anadol lo demuestra. ✨", hashtags: "#RefikAnadol #AIArt #DataArt #MoMA",
          workflow_carrusel: { resumen: "Lista 5 prompts arte de datos → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Flujos de datos, neural networks, vibrantes sobre negro" }, { paso: 2, nodo: "Designer", detalle: "Tipografía editorial" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿La IA puede crear algo verdaderamente bello? ✨'" },
          guion_slides: [ { numero: 1, titulo: "REFIK ANADOL", subtitulo: "Los datos como arte", cuerpo: "", prompt_imagen: "Refik Anadol data art cover neural streams dark --ar 4:5" }, { numero: 2, titulo: "Datos como pintura", cuerpo: "Millones de datos de hospitales, archivos, memorias. Instalaciones visuales.", prompt_imagen: "Data streams visual art collective memory --ar 4:5" }, { numero: 3, titulo: "El MoMA", cuerpo: "Obra permanente en el MoMA. Primera instalación de IA en la colección.", prompt_imagen: "MoMA AI art permanent collection --ar 4:5" }, { numero: 4, titulo: "La pregunta clave", cuerpo: "¿Puede la IA crear arte? Depende de qué le des para pensar.", prompt_imagen: "AI creativity question data artistic material --ar 4:5" }, { numero: 5, titulo: "Para marcas", cuerpo: "Los datos de tu empresa también son una historia. ¿La estás contando?", prompt_imagen: "Brand data storytelling narrative --ar 4:5" } ] } },
      { date: "Mar 20/5", pilar: "INDUSTRIA", titulo: "Gen Z vs Millennials: dos generaciones, dos expectativas",
        tiktok: { hook: "Gen Z y Millennials no quieren lo mismo en un evento. Si los tratás igual, perdés a los dos.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) split generacional → Voiceover (11Labs) → After Effects split screen", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Split Gen Z/Millennial, expectativas por generación" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Split screen animado" } ] },
          pantallas: [
            { tipo: "HOOK",        texto_pantalla: "DOS GENERACIONES. DOS EXPECTATIVAS.",          voz_off: "Gen Z y Millennials no quieren lo mismo en un evento. Si los tratás igual, perdés a los dos.",                                                               animacion: "Split dos estéticas.",                               prompt_imagen: "Gen Z vs Millennial split screen different event expectations --ar 9:16", prompt_video: null },
            { tipo: "MILLENNIALS", texto_pantalla: "MILLENNIALS: EL YO ESTUVE AHÍ.",              voz_off: "Los Millennials quieren la experiencia que se recuerda, el networking significativo, el 'yo estuve ahí'.",                                                   animacion: "Lado cálido.",                                       prompt_imagen: "Millennial event networking memorable group experience --ar 9:16", prompt_video: null },
            { tipo: "GEN Z",       texto_pantalla: "GEN Z: QUE NO SEA LO ESPERADO.",              voz_off: "La Gen Z quiere que no sea lo esperado, poder crear contenido, causas reales y algo más corto e intenso.",                                                   animacion: "Lado raw.",                                          prompt_imagen: "Gen Z unexpected content creation cause driven shorter --ar 9:16", prompt_video: null },
            { tipo: "DIFERENCIA",  texto_pantalla: "¿CÓMO LO CUENTO? VS ¿QUÉ VOY A CREAR?",      voz_off: "La diferencia está en la pregunta. Millennials: ¿cómo lo cuento? Gen Z: ¿qué voy a poder crear? El diseño del evento cambia completamente.",                animacion: "Split de nuevo.",                                    prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",         texto_pantalla: "¿DISEÑÁS PARA UNA O PARA LAS DOS? 👇",        voz_off: "¿Diseñás tus experiencias para una generación o para las dos? Contanos.",                                                                                    animacion: "Split de nuevo.",                                    prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Gen Z vs Millennials en experiencias", caption: "Dos generaciones. Dos expectativas. 📊", hashtags: "#GenZ #Millennials #ExperienceDesign #GenerationalMarketing",
          workflow_carrusel: { resumen: "Lista 6 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Split visual por generación" }, { paso: 2, nodo: "Designer", detalle: "Tabla comparativa" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL DEBATE", instruccion: "Historia → Poll '¿Con cuál te identificás?' → Millennial (recuerdo) / Gen Z (creación)" },
          guion_slides: [ { numero: 1, titulo: "GEN Z VS MILLENNIALS", subtitulo: "En experiencias", cuerpo: "", prompt_imagen: "Generational split cover two aesthetics --ar 4:5" }, { numero: 2, titulo: "Millennials", cuerpo: "Experiencia memorable · Networking · 'Yo estuve ahí'", prompt_imagen: "Millennial event networking memorable --ar 4:5" }, { numero: 3, titulo: "Gen Z", cuerpo: "Que sorprenda · Crear contenido · Causas · Corto e intenso", prompt_imagen: "Gen Z unexpected content creation cause --ar 4:5" }, { numero: 4, titulo: "La diferencia", cuerpo: "Millennials: '¿cómo lo cuento?'. Gen Z: '¿qué voy a crear?'", prompt_imagen: "Two questions storytelling vs creation --ar 4:5" }, { numero: 5, titulo: "Las implicancias", cuerpo: "El espacio, el timing, las activaciones. Todo cambia.", prompt_imagen: "Design implications generations --ar 4:5" }, { numero: 6, titulo: "¿Para quién diseñás?", cuerpo: "Definir la audiencia es el primer paso.", prompt_imagen: "Target audience first step design --ar 4:5" } ] } },
      { date: "Mié 21/5", pilar: "CULTURA", titulo: "Los pop-ups como formato cultural — de Supreme al Louvre",
        tiktok: { hook: "8 horas en cola para una tienda que existe solo 3 días. ¿Cómo logran eso las marcas?", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética pop-up de lujo → Voiceover (11Labs) → After Effects con timer countdown", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Cola de pop-up, espacio efímero, casos" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Timer countdown '72hs' animado" } ] },
          pantallas: [
            { tipo: "HOOK",    texto_pantalla: "8 HORAS DE COLA. 3 DÍAS NOMÁS.",                   voz_off: "Ocho horas en cola para una tienda que existe solo tres días. ¿Cómo logran eso las marcas?",                                                                 animacion: "Contador regresivo.",                                prompt_imagen: "Long queue luxury pop-up store 8 hours 3 day exclusive --ar 9:16", prompt_video: null },
            { tipo: "QUÉ ES",  texto_pantalla: "URGENCIA REAL. NO ARTIFICIAL.",                    voz_off: "El pop-up crea urgencia real, no artificial. Porque termina. Y eso cambia cómo la gente lo valora.",                                                         animacion: "Reloj que corre.",                                   prompt_imagen: "Pop-up real urgency scarcity temporary luxury --ar 9:16", prompt_video: null },
            { tipo: "CASOS",   texto_pantalla: "SUPREME · JACQUEMUS · EL LOUVRE.",                 voz_off: "Supreme agotado en horas. Jacquemus en un campo de lavanda. El Louvre con exposiciones en Beijing. La escasez como lenguaje.",                               animacion: "Tres casos.",                                        prompt_imagen: "Supreme pop-up Jacquemus lavender Louvre exhibition temporary --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "LA ESCASEZ DISEÑADA ES CULTURAL.",                 voz_off: "La escasez diseñada no es una táctica. Es un lenguaje cultural. El límite de tiempo convierte cualquier cosa en evento.",                                    animacion: "Rojo. Oscuro.",                                      prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿TU MARCA PODRÍA EXISTIR 72 HORAS? 👇",           voz_off: "¿Tu marca podría hacer algo que exista solo 72 horas? Contanos.",                                                                                            animacion: "Rojo. Oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Los pop-ups como formato cultural", caption: "8 horas en cola para 3 días. El pop-up como lenguaje. 🏪", hashtags: "#PopUp #Supreme #BrandCulture #Jacquemus",
          workflow_carrusel: { resumen: "Lista 6 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Colas, espacios efímeros, lujo temporal" }, { paso: 2, nodo: "Designer", detalle: "Timer '72h', casos con datos" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Hiciste cola para un pop-up?' → Sí, horas / Una vez / No pero entiendo / Nunca" },
          guion_slides: [ { numero: 1, titulo: "LOS POP-UPS COMO CULTURA", subtitulo: "De Supreme al Louvre", cuerpo: "", prompt_imagen: "Pop-up culture cover luxury temporary queue editorial --ar 4:5" }, { numero: 2, titulo: "¿Qué es?", cuerpo: "Experiencia de tiempo limitado. La temporalidad es el diseño.", prompt_imagen: "Pop-up temporary ephemeral design concept --ar 4:5" }, { numero: 3, titulo: "Supreme", cuerpo: "10 drops al año. Cada uno agotado en horas. La cola como ritual.", prompt_imagen: "Supreme pop-up queue culture scarcity --ar 4:5" }, { numero: 4, titulo: "Jacquemus en lavanda", cuerpo: "Desfile en Provenza. Sin producto. Solo experiencia.", prompt_imagen: "Jacquemus lavender pop-up luxury ephemeral --ar 4:5" }, { numero: 5, titulo: "El Louvre", cuerpo: "Exposiciones en Beijing y Dubai. Arte en formato efímero.", prompt_imagen: "Louvre temporary exhibition Asia --ar 4:5" }, { numero: 6, titulo: "Escasez como lenguaje", cuerpo: "No es táctica. Es lenguaje cultural.", prompt_imagen: "Scarcity cultural language brand --ar 4:5" } ] } },
      { date: "Jue 22/5", pilar: "OFICIO", titulo: "Cómo construir un brief de identidad visual antes de diseñar una sola pieza",
        tiktok: { hook: "La mayoría de los eventos se ven genéricos porque nadie hizo un brief de identidad visual antes de abrir el programa de diseño.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar componentes de identidad visual → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando los componentes del brief de identidad visual" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Reveales visuales de cada componente del brief" } ] },
          pantallas: [
            { tipo: "HOOK",         texto_pantalla: "LOS EVENTOS SE VEN GENÉRICOS POR ESTO.",     voz_off: "La mayoría de los eventos se ven genéricos porque nadie hizo un brief de identidad visual antes de abrir el programa de diseño.",                           animacion: "Contraste: genérico vs con identidad.",              prompt_imagen: "Generic event design vs strong visual identity brand dramatic contrast --ar 9:16", prompt_video: null },
            { tipo: "QUÉ ES",       texto_pantalla: "NO ES EL LOGO Y LOS COLORES.",               voz_off: "El brief de identidad no es el logo y los colores. Es el documento que responde una sola pregunta: ¿cómo tiene que sentirse esto?",                         animacion: "La pregunta en grande.",                             prompt_imagen: "Visual identity brief concept how should this feel question brand --ar 9:16", prompt_video: null },
            { tipo: "LOS 5 CAMPOS", texto_pantalla: "EMOCIÓN · REFERENCIAS · PALETA · TIPO · RESTRICCIONES.", voz_off: "Los cinco campos: emoción que buscamos, referencias que sí y que no, paleta con intención, tipografías con rol, y restricciones del espacio.", animacion: "Cinco campos apareciendo.",                          prompt_imagen: "5 visual identity brief fields emotion references palette typography constraints --ar 9:16", prompt_video: null },
            { tipo: "EL RESULTADO", texto_pantalla: "CUALQUIER DISEÑADOR. MISMO IDIOMA.",          voz_off: "Con ese brief, cualquier diseñador puede producir cualquier pieza y todas hablan el mismo idioma visual.",                                                   animacion: "Múltiples piezas coherentes.",                       prompt_imagen: "Coherent brand design multiple pieces from same brief --ar 9:16", prompt_video: null },
            { tipo: "CTA",          texto_pantalla: "¿TU EVENTO ARRANCA CON UN BRIEF? 👇",        voz_off: "¿Tu próximo evento arranca con un brief de identidad o con 'usemos los colores de la marca'? Contanos.",                                                     animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "El brief de identidad visual — los 5 campos que no pueden faltar", caption: "Antes de abrir el programa de diseño. El brief de identidad. 🎨", hashtags: "#VisualIdentity #DesignBrief #EventBranding #DirectorDeArte #Oficio",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Los 5 campos del brief, contraste genérico vs identidad" }, { paso: 2, nodo: "Designer", detalle: "Cada campo bien separado y legible" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Tu próximo evento arranca con un brief de identidad o con los colores de la marca?'" },
          guion_slides: [ { numero: 1, titulo: "EL BRIEF DE IDENTIDAD", subtitulo: "Los 5 campos que no pueden faltar", cuerpo: "", prompt_imagen: "Visual identity brief cover design process dark professional --ar 4:5" }, { numero: 2, titulo: "No es el logo y los colores", cuerpo: "Es el documento que responde: ¿cómo tiene que sentirse esto?", prompt_imagen: "Visual identity beyond logo colors feeling concept --ar 4:5" }, { numero: 3, titulo: "Los 5 campos", cuerpo: "Emoción buscada · Referencias sí/no · Paleta con intención · Tipografías con rol · Restricciones", prompt_imagen: "5 fields visual identity brief listed clearly dark --ar 4:5" }, { numero: 4, titulo: "El resultado", cuerpo: "Cualquier diseñador produce cualquier pieza y hablan el mismo idioma.", prompt_imagen: "Coherent design multiple pieces same brief result --ar 4:5" }, { numero: 5, titulo: "¿Tu evento arranca bien?", cuerpo: "El brief de identidad es la diferencia entre genérico y memorable.", prompt_imagen: "Generic vs memorable event design brief difference --ar 4:5" } ] } },
      { date: "Vie 23/5", pilar: "PROCESO", titulo: "El día de batching de una agencia — cómo se organiza una jornada de producción",
        tiktok: { hook: "Un día. Una agencia. 40 piezas de contenido producidas. Así se organiza una jornada de batching.", duracion: "55 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar la jornada → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando el timeline del día y el modo single-task" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Timeline animado del día, antes/después del calendario" } ] },
          pantallas: [
            { tipo: "HOOK",          texto_pantalla: "UN DÍA. 40 PIEZAS.",                        voz_off: "Un día. Una agencia. Cuarenta piezas producidas. Así se organiza una jornada de batching.",                                                                  animacion: "Counter 0→40. Flash.",                               prompt_imagen: "Agency batching day 40 content pieces one day production team --ar 9:16", prompt_video: null },
            { tipo: "EL TIMELINE",   texto_pantalla: "8AM BRIEF → 5PM PROGRAMACIÓN.",             voz_off: "8 de la mañana: brief y pilares del mes. 9: guiones. 11: assets visuales. 1pm: audio. 3: montaje. 5: revisión y programación.",                            animacion: "Timeline que avanza.",                               prompt_imagen: "Agency batching timeline 8am to 5pm production schedule professional --ar 9:16", prompt_video: null },
            { tipo: "LA CLAVE",      texto_pantalla: "SINGLE-TASK. FLOW COLECTIVO.",               voz_off: "La clave no es la velocidad. Es el modo single-task. Nadie hace dos cosas a la vez. Todos hacen lo mismo al mismo tiempo. El flow es colectivo.",           animacion: "Foco. Ritmo.",                                       prompt_imagen: "Single task focus collective flow state agency team production --ar 9:16", prompt_video: null },
            { tipo: "ANTES/DESPUÉS", texto_pantalla: "IMPROVISAR CADA SEMANA VS UN DÍA AL MES.",  voz_off: "Antes: improvisar cada semana, desgaste constante. Después: un día al mes, un mes entero de constancia y voz de marca consistente.",                        animacion: "Contraste.",                                         prompt_imagen: "Before after batching improvise weekly vs batch monthly agency --ar 9:16", prompt_video: null },
            { tipo: "CTA",           texto_pantalla: "¿TU EQUIPO HACE BATCHING? 👇",              voz_off: "¿Tu agencia o equipo hace batching de contenido? ¿Con qué sistema? Contanos.",                                                                               animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
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
            { tipo: "HOOK",    texto_pantalla: "UN EDIFICIO QUE CAMBIA DE FORMA.",                 voz_off: "Un edificio en Nueva York que cambia de forma. Literalmente. Y cambió para siempre lo que entendemos por venue.",                                             animacion: "Edificio expandiéndose.",                            prompt_imagen: "The Shed New York building expanding shell structure Hudson Yards architectural transformation --ar 9:16", prompt_video: "The Shed building shell rolling expanding architectural transformation cinematic" },
            { tipo: "CONTEXTO",texto_pantalla: "UNA CAPA EXTERIOR SOBRE RIELES.",                  voz_off: "The Shed: una capa exterior sobre rieles que crea distintos espacios internos. Diseñado para nunca ser lo mismo dos veces.",                                  animacion: "Diagrama del mecanismo.",                            prompt_imagen: "The Shed interior flexible spaces movable shell Hudson Yards architecture --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT", texto_pantalla: "¿Y SI EL ESPACIO SE ADAPTA AL EVENTO?",            voz_off: "La pregunta que lo creó: ¿y si el espacio pudiera adaptarse al evento en lugar de que el evento se adapte al espacio?",                                      animacion: "Pregunta en blanco. Pausa larga.",                   prompt_imagen: null, prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "LAS RESTRICCIONES SON DECISIONES DE DISEÑO.",      voz_off: "Las restricciones de un venue no son limitaciones. Son decisiones de diseño. Todo es diseñable si hacés la pregunta correcta.",                              animacion: "Cian oscuro.",                                       prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿LIMITASTE UNA IDEA POR EL VENUE? 👇",            voz_off: "¿Alguna vez limitaste una idea por el venue? Contanos.",                                                                                                      animacion: "Cian oscuro.",                                       prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "The Shed: el edificio que se reinventa", caption: "Un edificio que cambia de forma literalmente. 🏗️", hashtags: "#TheShed #Architecture #EventVenue #ExperienceDesign",
          workflow_carrusel: { resumen: "Lista 5 prompts arquitectura → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Arquitectura transformable, Hudson Yards, espacios flexibles" }, { paso: 2, nodo: "Designer", detalle: "Diagrama del mecanismo, pregunta clave" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Alguna vez limitaste una idea por el venue? 🏗️'" },
          guion_slides: [ { numero: 1, titulo: "THE SHED", subtitulo: "El edificio que se reinventa", cuerpo: "", prompt_imagen: "The Shed New York transformable architecture cover --ar 4:5" }, { numero: 2, titulo: "La capa que se mueve", cuerpo: "Una estructura sobre rieles que expande o contrae el espacio según el evento.", prompt_imagen: "The Shed shell mechanism movable exterior innovation --ar 4:5" }, { numero: 3, titulo: "Nunca igual dos veces", cuerpo: "El mismo edificio puede ser sala de conciertos, galería o espacio industrial.", prompt_imagen: "Flexible venue different configurations same building --ar 4:5" }, { numero: 4, titulo: "La pregunta que lo creó", cuerpo: "¿Y si el espacio se adapta al evento y no al revés?", prompt_imagen: "Design philosophy space adapts to event concept --ar 4:5" }, { numero: 5, titulo: "Las restricciones son diseño", cuerpo: "Las limitaciones de un venue son decisiones. Todo es diseñable.", prompt_imagen: "Constraints as design decisions flexible thinking --ar 4:5" } ] } },
      { date: "Mar 27/5", pilar: "INDUSTRIA", titulo: "Tendencias de producción audiovisual 2026 — lo que ya está pasando",
        tiktok: { hook: "Las 5 tendencias que definen la producción audiovisual en 2026. La mayoría de las agencias todavía no las adoptó.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética tech/futuro → Voiceover (11Labs) → After Effects con listas animadas", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "5 tendencias visualizadas, datos de adopción" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Lista animada con porcentajes de adopción" } ] },
          pantallas: [
            { tipo: "HOOK",  texto_pantalla: "5 TENDENCIAS. LA MAYORÍA NO LAS ADOPTÓ.",           voz_off: "Las cinco tendencias que definen la producción audiovisual en 2026. La mayoría de las agencias todavía no las adoptó.",                                       animacion: "Ticker. Impacto.",                                   prompt_imagen: "2026 production trends concept digital tech future dark editorial --ar 9:16", prompt_video: null },
            { tipo: "LAS 5", texto_pantalla: "VIDEO IA · LOCUCIONES IA · MOTION + IA.",           voz_off: "Video generativo con Kling y Runway, locuciones con IA, motion graphics con IA integrada en After Effects, imágenes en batch y workflows sin cámara.",       animacion: "Cada tendencia con ícono.",                          prompt_imagen: "Five audiovisual trends 2026 AI tools list tech production evolution --ar 9:16", prompt_video: null },
            { tipo: "DATO",  texto_pantalla: "EL 73% YA USA IA EN SU PRODUCCIÓN.",                voz_off: "El 73% de las agencias creativas globales ya usa IA en algún paso de su producción. Fuente: Adobe State of Creative 2025.",                                 animacion: "73% enorme.",                                        prompt_imagen: "73% agencies using AI production Adobe Creative State data --ar 9:16", prompt_video: null },
            { tipo: "REALIDAD", texto_pantalla: "NO ES EL FUTURO. ES HOY.",                       voz_off: "No es el futuro. Es lo que está pasando ahora. Las agencias que no adoptaron estas herramientas ya están compitiendo en desventaja.",                         animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",   texto_pantalla: "¿EN CUÁLES DE LAS 5 YA TRABAJÁS? 👇",              voz_off: "¿En cuáles de las cinco ya estás trabajando? ¿En cuáles no? Contanos.",                                                                                       animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Tendencias de producción audiovisual 2026", caption: "5 tendencias que definen cómo se produce en 2026. ¿Cuáles adoptaste? 📹", hashtags: "#Produccion2026 #AIVideo #ContentTrends #Tendencias",
          workflow_carrusel: { resumen: "Lista 6 prompts tech → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Tech futurista, cada tendencia con ícono visual" }, { paso: 2, nodo: "Designer", detalle: "Numeración, porcentajes, estética oscura" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Cuál tendencia 2026 adoptaste?' → Video IA / Locución IA / Batch / Ninguna todavía" },
          guion_slides: [ { numero: 1, titulo: "PRODUCCIÓN 2026", subtitulo: "Las 5 tendencias que ya están pasando", cuerpo: "", prompt_imagen: "2026 production trends cover dark tech futuristic --ar 4:5" }, { numero: 2, titulo: "1. Video generativo", cuerpo: "Kling, Runway, Sora. B-roll y campaña sin cámara. Ya es estándar.", prompt_imagen: "AI video generation tools Kling Runway comparison --ar 4:5" }, { numero: 3, titulo: "2. Locuciones IA", cuerpo: "ElevenLabs, Murf. Voz de marca en 30 segundos.", prompt_imagen: "AI voiceover tools professional voice --ar 4:5" }, { numero: 4, titulo: "3. Motion graphics + IA", cuerpo: "After Effects ya integra IA para keyframes, texturas y elementos.", prompt_imagen: "After Effects AI integration motion graphics --ar 4:5" }, { numero: 5, titulo: "4 y 5. Batch + sin cámara", cuerpo: "Freepik Spaces y Midjourney. Flujos completos sin equipo de rodaje.", prompt_imagen: "Batch production no camera workflow Spaces Midjourney --ar 4:5" }, { numero: 6, titulo: "El 73% ya usa IA", cuerpo: "Adobe State of Creative 2025. ¿Estás en ese 73%?", prompt_imagen: "73% adoption statistic agencies using AI --ar 4:5" } ] } },
      { date: "Mié 28/5", pilar: "CULTURA", titulo: "Saul Bass: cuando el diseño gráfico era cultura de masas",
        tiktok: { hook: "Un diseñador que cambió las películas, los aeropuertos y las empresas. Con tijera y papel.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética Saul Bass → Voiceover (11Labs) → After Effects con animaciones geométricas",
            pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Prompts con 'Saul Bass style geometric flat design bold color palette mid-century modern' — pantallas de obra y filosofía" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Animaciones geométricas tipo Saul Bass: formas que se componen y descomponen" } ] },
          pantallas: [
            { tipo: "HOOK",      texto_pantalla: "TIJERA Y PAPEL. CAMBIÓ TODO.",                   voz_off: "Un diseñador. Tijera y papel. Cambió las películas, los aeropuertos y las empresas.",                                                                         animacion: "Formas geométricas que se ensamblan.",               prompt_imagen: "Saul Bass style geometric design bold shapes mid-century modern film noir aesthetic --ar 9:16", prompt_video: null },
            { tipo: "QUIÉN",     texto_pantalla: "HITCHCOCK · AT&T · METRO DE LA.",               voz_off: "Saul Bass, 1920–1996. Los créditos de Hitchcock, los logos de AT&T y United Airlines, las señales del metro de Los Ángeles. Todo con la misma filosofía.",   animacion: "Ejemplos apareciendo.",                              prompt_imagen: "Saul Bass design portfolio Hitchcock title cards corporate logos wayfinding --ar 9:16", prompt_video: null },
            { tipo: "FILOSOFÍA", texto_pantalla: "UNA FORMA. UN COLOR. UNA IDEA.",                 voz_off: "La comunicación más poderosa es la más simple. Una forma, un color, una idea. Eso es todo lo que necesitás para decir algo importante.",                      animacion: "Simplificación progresiva.",                         prompt_imagen: "Simple geometric communication one shape one color one idea Bass style --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN",   texto_pantalla: "SI SE PUEDE SIMPLIFICAR, NO SE COMPLICA.",       voz_off: "Cuando algo se puede simplificar, nunca se debería complicar. Eso se aplica en diseño, en eventos, en todo.",                                                 animacion: "Cita visual. Pausa.",                                prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",       texto_pantalla: "¿QUÉ DISEÑADOR TE IMPACTA MÁS? 👇",             voz_off: "¿Cuál es el diseñador que más te impacta? Contanos.",                                                                                                          animacion: "Rojo oscuro.",                                       prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Saul Bass: cuando el diseño era cultura de masas", caption: "Tijera, papel y una idea. Así cambió el diseño gráfico. ✂️", hashtags: "#SaulBass #GraphicDesign #DesignHistory #MidCenturyModern",
          workflow_carrusel: { resumen: "Lista 6 prompts estilo Bass → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Prompts: 'Saul Bass style flat geometric bold red black white mid-century'" }, { paso: 2, nodo: "Designer", detalle: "Tipografía bold, paleta limitada, estética del período" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel con estética propia" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Conocías a Saul Bass?' → Claro, es un referente / Algo / Nada / ¿Quién?" },
          guion_slides: [ { numero: 1, titulo: "SAUL BASS", subtitulo: "Cuando el diseño era cultura de masas", cuerpo: "", prompt_imagen: "Saul Bass style cover bold geometric red black white mid-century --ar 4:5" }, { numero: 2, titulo: "Tijera y papel", cuerpo: "Sin computadoras. Formas recortadas a mano. El lenguaje visual del siglo XX.", prompt_imagen: "Hand cut geometric shapes craft design mid-century process --ar 4:5" }, { numero: 3, titulo: "Los créditos de Hitchcock", cuerpo: "Vértigo, Psicosis. Antes de Bass los créditos eran texto. Después fueron experiencia.", prompt_imagen: "Film title sequence design concept Hitchcock era cinematic typography --ar 4:5" }, { numero: 4, titulo: "Logos que duraron décadas", cuerpo: "AT&T, United Airlines, Minolta. Diseñados para ser atemporales. Y lo son.", prompt_imagen: "Timeless corporate logo geometric brand identity Bass --ar 4:5" }, { numero: 5, titulo: "La filosofía", cuerpo: "La comunicación más poderosa es la más simple. Una forma. Un color. Una idea.", prompt_imagen: "Simple communication philosophy geometric minimalism Bass --ar 4:5" }, { numero: 6, titulo: "La lección", cuerpo: "Cuando algo se puede simplificar, nunca se debería complicar.", prompt_imagen: "Simplification principle design lesson apply everything --ar 4:5" } ] } },
      { date: "Jue 29/5", pilar: "OFICIO", titulo: "Dirección de arte en eventos — cómo se define la identidad visual",
        tiktok: { hook: "La diferencia entre un evento que se ve genérico y uno que parece de campaña global es la dirección de arte.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) contraste genérico vs con dirección → Voiceover (11Labs) → After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Contraste genérico vs con DA, componentes de identidad visual" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Reveales: paleta que se construye, tipografía que aparece, motion guide" } ] },
          pantallas: [
            { tipo: "HOOK",        texto_pantalla: "GENÉRICO VS CAMPAÑA GLOBAL: LA DA.",           voz_off: "La diferencia entre un evento que se ve genérico y uno que parece de campaña global es la dirección de arte.",                                               animacion: "Split: genérico vs con DA.",                         prompt_imagen: "Generic event vs art direction guided event dramatic before after --ar 9:16", prompt_video: null },
            { tipo: "QUÉ ES",      texto_pantalla: "EL SISTEMA QUE HABLA EL MISMO IDIOMA.",        voz_off: "La dirección de arte es el sistema de decisiones que hace que todo lo visual hable el mismo idioma. No es estética. Es coherencia.",                        animacion: "Sistema construyéndose.",                            prompt_imagen: "Visual identity system art direction cohesive design language --ar 9:16", prompt_video: null },
            { tipo: "COMPONENTES", texto_pantalla: "PALETA · TIPO · COMPOSICIÓN · MOTION · FOTO.", voz_off: "Los componentes: paleta con reglas, tipografías con jerarquía, composición, guía de motion y tono fotográfico.",                                           animacion: "Cada componente aparece.",                           prompt_imagen: "Art direction components color typography motion photo tone design system --ar 9:16", prompt_video: null },
            { tipo: "ERROR",       texto_pantalla: "COLORES DE MODA VS COLORES CON INTENCIÓN.",    voz_off: "El error más común: elegir colores de moda en lugar de colores con intención. La tendencia pasa. La intención queda.",                                     animacion: "Paleta de moda vs paleta con intención.",            prompt_imagen: "Trendy colors vs intentional brand colors wrong vs right approach --ar 9:16", prompt_video: null },
            { tipo: "CTA",         texto_pantalla: "¿TU EVENTO TIENE SISTEMA VISUAL? 👇",          voz_off: "¿Tu próximo evento tiene un sistema visual o tiene 'los colores que quedaban'? Contanos.",                                                                  animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Dirección de arte en eventos — guía práctica", caption: "Genérico vs de campaña global. La diferencia la hace la dirección de arte. 🎨", hashtags: "#DireccionDeArte #ArtDirection #VisualIdentity #EventDesign",
          workflow_carrusel: { resumen: "Lista 5 prompts identidad visual → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Sistema visual, paleta + tipo + composición, before/after" }, { paso: 2, nodo: "Designer", detalle: "Grid visual: paleta + tipografía + motion + foto" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Tenés un sistema visual para tus eventos o empezás de cero cada vez?'" },
          guion_slides: [ { numero: 1, titulo: "DIRECCIÓN DE ARTE", subtitulo: "En eventos", cuerpo: "", prompt_imagen: "Art direction event cover visual identity system dark --ar 4:5" }, { numero: 2, titulo: "Genérico vs con DA", cuerpo: "La diferencia está en el sistema. No en el presupuesto.", prompt_imagen: "Generic vs art directed event dramatic before after --ar 4:5" }, { numero: 3, titulo: "Los 5 componentes", cuerpo: "Paleta con reglas · Tipografías · Composición · Motion guide · Tono fotográfico", prompt_imagen: "5 art direction components design system elements --ar 4:5" }, { numero: 4, titulo: "El error más común", cuerpo: "Elegir colores de moda. En lugar de colores con intención.", prompt_imagen: "Trendy colors wrong vs intentional brand colors --ar 4:5" }, { numero: 5, titulo: "El sistema como herramienta", cuerpo: "Un buen sistema visual se aplica a cualquier pieza. Sin pensar de nuevo.", prompt_imagen: "Visual system scalable consistent application toolkit --ar 4:5" } ] } },
      { date: "Vie 30/5", pilar: "PROCESO", titulo: "Cómo presentar una campaña que se aprueba en la primera reunión",
        tiktok: { hook: "El 80% de las campañas se aprueban o rechazan en los primeros 3 minutos. Así se preparan los que aprueban.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar el proceso de presentación → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando el orden correcto de una presentación de campaña" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Animaciones tipo slides de presentación avanzando" } ] },
          pantallas: [
            { tipo: "HOOK",       texto_pantalla: "3 MINUTOS. APROBADA O RECHAZADA.",              voz_off: "El 80% de las campañas se aprueban o rechazan en los primeros tres minutos. No por la calidad de la idea. Sino por cómo se presenta.",                      animacion: "Reloj. Impacto.",                                    prompt_imagen: "Campaign approved rejected first 3 minutes presentation moment dark --ar 9:16", prompt_video: null },
            { tipo: "POR QUÉ",    texto_pantalla: "EL CLIENTE COMPRA SEGURIDAD.",                  voz_off: "El cliente no compra la campaña. Compra la seguridad de que va a funcionar. Esa distinción cambia todo lo que hacés antes de entrar.",                     animacion: "Idea vs seguridad.",                                 prompt_imagen: "Client buys security not idea campaign presentation psychology dark --ar 9:16", prompt_video: null },
            { tipo: "EL ORDEN",   texto_pantalla: "PROBLEMA → INSIGHT → CAMPAÑA.",                 voz_off: "El orden que funciona: el problema del cliente, el insight que lo cambia todo, la campaña como solución, y por qué va a funcionar.",                        animacion: "Escalera de confianza.",                             prompt_imagen: "Presentation order problem insight campaign why it works trust --ar 9:16", prompt_video: null },
            { tipo: "EL INSIGHT", texto_pantalla: "EL SLIDE DEL INSIGHT LO DEFINE TODO.",          voz_off: "El momento que define todo es el slide del insight. Si el cliente dice 'nunca lo había pensado así', ganaste la sala.",                                    animacion: "El momento clave. Spotlight.",                       prompt_imagen: "Insight slide key moment winning the room aha moment presentation --ar 9:16", prompt_video: null },
            { tipo: "CTA",        texto_pantalla: "¿TU PRESENTACIÓN EMPIEZA CON EL CLIENTE? 👇",  voz_off: "¿Tu última presentación empezó por el problema del cliente o por tu agencia?",                                                                              animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
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
            { tipo: "HOOK",    texto_pantalla: "DEL GRAFFITI A LAS PAREDES MÁS CARAS.",            voz_off: "¿Cómo pasamos del graffiti ilegal a las paredes más caras del mundo? Tres artistas que cambiaron esa historia.",                                             animacion: "Spray que se transforma en galería.",                prompt_imagen: "Street art transforms to gallery art urban graffiti to museum quality dramatic --ar 9:16", prompt_video: null },
            { tipo: "LOS TRES",texto_pantalla: "TÀPIES · BASQUIAT · KAWS.",                        voz_off: "Tàpies convirtió los materiales de la calle en alta expresión. Basquiat transformó el diario de un barrio en un mito global. KAWS usó el juguete como lenguaje universal.", animacion: "Cada artista con su color.",                        prompt_imagen: "Three artists Tapies textures Basquiat urban KAWS toys street art gallery evolution --ar 9:16", prompt_video: null },
            { tipo: "EN COMÚN",texto_pantalla: "LO COTIDIANO CONVERTIDO EN LENGUAJE.",             voz_off: "Los tres convirtieron lo cotidiano en lenguaje. Lo que todos pasaban por alto, ellos lo pusieron en el centro.",                                             animacion: "Objetos cotidianos → arte.",                         prompt_imagen: "Everyday objects elevated to art street culture becomes high culture --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "LA CULTURA ESTÁ EN LA CALLE.",                     voz_off: "La cultura de tu audiencia no está en los museos. Está en la calle. Las marcas que lo entienden no van a la cultura. La crean.",                             animacion: "Cita visual. Impacto.",                              prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿CUÁL DE LOS TRES TE IMPACTA MÁS? 👇",            voz_off: "¿Cuál de los tres te impacta más? ¿O hay otro artista de calle que te vuela la cabeza? Contanos.",                                                           animacion: "Rojo oscuro.",                                       prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "Tàpies, Basquiat, KAWS — del graffiti al museo", caption: "Del graffiti ilegal a las paredes más caras del mundo. 🎨", hashtags: "#Basquiat #KAWS #Tapies #StreetArt #CulturaVisual",
          workflow_carrusel: { resumen: "Lista 6 prompts street art/gallery → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Street art con calidad editorial, colores fuertes, texturas urbanas" }, { paso: 2, nodo: "Designer", detalle: "Layout que evoluciona de raw a curado" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel cultural" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Cuál te impacta más?' → Tàpies / Basquiat / KAWS / Ninguno los conocía" },
          guion_slides: [ { numero: 1, titulo: "DEL GRAFFITI AL MUSEO", subtitulo: "Tàpies · Basquiat · KAWS", cuerpo: "", prompt_imagen: "Street art to museum evolution cover urban gallery --ar 4:5" }, { numero: 2, titulo: "Tàpies", cuerpo: "Barcelona. Materiales de la calle como alta expresión. Barro, arena y tela como lenguaje.", prompt_imagen: "Tapies style textures materials street fine art Barcelona --ar 4:5" }, { numero: 3, titulo: "Basquiat", cuerpo: "Nueva York. El diario de un barrio convertido en mito. Palabras tachadas como poesía.", prompt_imagen: "Basquiat urban diary scratched words street mythology New York --ar 4:5" }, { numero: 4, titulo: "KAWS", cuerpo: "New Jersey. El juguete como lenguaje global. De graffiti en camiones a Louis Vuitton.", prompt_imagen: "KAWS toys brand culture collectible global street to luxury --ar 4:5" }, { numero: 5, titulo: "Lo que tienen en común", cuerpo: "Convirtieron lo cotidiano en lenguaje. Lo que todos ignoraban, ellos lo pusieron en el centro.", prompt_imagen: "Everyday elevated to art three artists philosophy --ar 4:5" }, { numero: 6, titulo: "Para marcas", cuerpo: "La cultura de tu audiencia está en la calle. ¿La conocés?", prompt_imagen: "Brand culture from street audience lesson --ar 4:5" } ] } },
      { date: "Mar 3/6", pilar: "INDUSTRIA", titulo: "BTS y el ARMY: cómo un grupo de K-pop redefinió el fan marketing global",
        tiktok: { hook: "Un grupo de música que construyó una de las comunidades de marca más poderosas del mundo. Sin gastar un peso en publicidad tradicional.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) estética K-pop global → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas: escala global, ARMY como fuerza cultural, datos de impacto" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Mapa global de activaciones, datos animados" } ] },
          pantallas: [
            { tipo: "HOOK",    texto_pantalla: "LA COMUNIDAD DE MARCA MÁS PODEROSA.",              voz_off: "Un grupo de música que construyó una de las comunidades de marca más poderosas del mundo. Sin gastar un peso en publicidad tradicional.",                    animacion: "Texto con impacto. Mapa iluminándose.",              prompt_imagen: "BTS global phenomenon world map lit up massive fan community culture --ar 9:16", prompt_video: null },
            { tipo: "EL ARMY", texto_pantalla: "NO ES FANS. ES FUERZA CULTURAL.",                  voz_off: "El ARMY no es una base de fans. Es una fuerza cultural organizada: coordinan campañas globales, compran álbumes en masa y donan millones en nombre del grupo.", animacion: "Cada punto con peso.",                              prompt_imagen: "BTS ARMY coordinated global campaigns organized fan culture movement --ar 9:16", prompt_video: null },
            { tipo: "EL DATO", texto_pantalla: "$1M IGUALADO EN 24 HORAS.",                        voz_off: "En 2020, BTS donó un millón de dólares. El ARMY igualó la cifra en menos de veinticuatro horas. Sin que nadie se los pidiera.",                              animacion: "Datos con impacto.",                                 prompt_imagen: "BTS ARMY matched donation 1 million 24 hours social movement power --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "CUANDO LA COMUNIDAD SE APROPIA DE VOS.",           voz_off: "Cuando una comunidad se apropia de tu identidad, ya no necesitás departamento de marketing. Ellos son el marketing.",                                         animacion: "Cita visual. Impacto.",                              prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿TU MARCA TIENE QUIEN LA DEFIENDA? 👇",           voz_off: "¿Tu marca tiene una comunidad que la defienda sin que se lo pidas? Contanos.",                                                                                animacion: "Oscuro elegante.",                                   prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 6, titulo: "BTS y el ARMY: la comunidad de marca más poderosa del mundo", caption: "No es una base de fans. Es una fuerza cultural organizada. Lo que toda marca debería estudiar. 🎤", hashtags: "#BTS #ARMY #ComunidadDeMarca #FanMarketing #BrandStrategy",
          workflow_carrusel: { resumen: "Lista 6 prompts K-pop/comunidad global → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Escala global, fuerza cultural organizada, datos de impacto" }, { paso: 2, nodo: "Designer", detalle: "Mapa global, datos en grande, lección final" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Sos parte de alguna comunidad de marca o artista así de activa?' → Sí, de una / No / Conozco una / ¿Qué es el ARMY?" },
          guion_slides: [ { numero: 1, titulo: "BTS Y EL ARMY", subtitulo: "La comunidad de marca más poderosa del mundo", cuerpo: "", prompt_imagen: "BTS global community cover massive cultural force dark editorial --ar 4:5" }, { numero: 2, titulo: "No es una base de fans", cuerpo: "Es una fuerza cultural organizada. Coordinan, donan, crean y amplifican.", prompt_imagen: "ARMY organized community global coordination cultural force --ar 4:5" }, { numero: 3, titulo: "Los charts como estrategia", cuerpo: "Compran álbumes coordinados. Streaman en sincronía. Los números son la táctica.", prompt_imagen: "Music chart strategy fan coordinated buying streaming numbers --ar 4:5" }, { numero: 4, titulo: "El momento de la donación", cuerpo: "BTS donó $1M. El ARMY igualó la cifra en menos de 24 horas.", prompt_imagen: "Donation matching 1 million 24 hours fan community power --ar 4:5" }, { numero: 5, titulo: "La lección", cuerpo: "Cuando una comunidad se apropia de tu identidad, ya no necesitás marketing.", prompt_imagen: "Community owns brand identity no marketing needed lesson --ar 4:5" }, { numero: 6, titulo: "¿Tu marca tiene esto?", cuerpo: "¿Hay personas que la defiendan, amplifiquen y construyan sin que se lo pidas?", prompt_imagen: "Brand community advocates organic defenders question --ar 4:5" } ] } },
      { date: "Mié 4/6", pilar: "CULTURA", titulo: "Casa Batlló de noche: cuando el patrimonio se reinventa por diseño",
        tiktok: { hook: "Un edificio de 1906 recauda más con experiencias nocturnas que con visitas diurnas.", duracion: "45 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook nocturno → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'Casa Batllo Barcelona night Gaudi facade illuminated projection mapping slow cinematic pan'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: modelo, datos, lección" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tipo: "HOOK",    texto_pantalla: "1906. RECAUDA MÁS DE NOCHE.",                      voz_off: "Un edificio de 1906 recauda más de noche que de día. Y la diferencia la hizo el diseño, no la restauración.",                                               animacion: "Fachada iluminada con glow.",                        prompt_imagen: "Casa Batllo Barcelona night projection mapping Gaudi facade magical --ar 9:16", prompt_video: "Casa Batllo night slow cinematic pan Gaudi facade illuminated projection" },
            { tipo: "MODELO",  texto_pantalla: "PROJECTION MAPPING + AR + IA. +40%.",              voz_off: "Casa Batlló sumó projection mapping en la fachada, realidad aumentada interior y narración con IA. Resultado: cuarenta por ciento más en ingresos.",        animacion: "Lista. +40% en rojo.",                               prompt_imagen: "Casa Batllo immersive night projection AR interior revenue increase --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT", texto_pantalla: "NO ERA RESTAURACIÓN. ERA EXPERIENCIA.",            voz_off: "No era un problema de restauración. Era un problema de experiencia. Lo resolvieron con diseño, no con obra.",                                               animacion: "Contraste restauración vs diseño.",                  prompt_imagen: null, prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "CUALQUIER ESPACIO TIENE UNA EXPERIENCIA LATENTE.", voz_off: "Cualquier espacio tiene una experiencia latente esperando ser activada. El diseño es lo que la despierta.",                                                  animacion: "Azul oscuro.",                                       prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿CUÁL ES TU EXPERIENCIA LATENTE? 👇",             voz_off: "¿Cuál es la experiencia que tu espacio todavía no activó? Contanos.",                                                                                        animacion: "Azul oscuro.",                                       prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Casa Batlló: diseño que transformó lo histórico", caption: "1906. Reinventado por diseño. +40% en ingresos. 🏛️", hashtags: "#CasaBatllo #ExperienceDesign #Gaudi #ProjectionMapping",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Arquitectura nocturna, projection mapping, azul profundo" }, { paso: 2, nodo: "Designer", detalle: "+40% en tipografía grande" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "COMPARTIR REEL", instruccion: "Reel → historia → '¿Conocías este modelo? 🏛️'" },
          guion_slides: [ { numero: 1, titulo: "CASA BATLLÓ", subtitulo: "1906. Reinventado por diseño.", cuerpo: "", prompt_imagen: "Casa Batllo night Gaudi premium dark design projection mapping --ar 4:5" }, { numero: 2, titulo: "+40% de ingresos", cuerpo: "Projection mapping, AR y narración IA. El patrimonio convertido en experiencia.", prompt_imagen: "Heritage building revenue increase experience innovation 40% --ar 4:5" }, { numero: 3, titulo: "No era restauración", cuerpo: "Era un problema de experiencia. El diseño lo resolvió.", prompt_imagen: "Problem vs solution heritage design over restoration --ar 4:5" }, { numero: 4, titulo: "La experiencia latente", cuerpo: "Cualquier espacio tiene una experiencia que espera ser activada.", prompt_imagen: "Latent experience design reveals hidden potential --ar 4:5" }, { numero: 5, titulo: "¿Y tu espacio?", cuerpo: "¿Cuál es la experiencia que todavía no activaste?", prompt_imagen: "Question spaces unexplored potential dark elegant --ar 4:5" } ] } },
      { date: "Jue 5/6", pilar: "OFICIO", titulo: "Cómo construir un sistema visual desde cero — flujo completo en Spaces",
        tiktok: { hook: "Antes del primer slide del pitch ya tenés que tener el sistema visual. Flujo completo en Freepik Spaces.", duracion: "50 seg",
          workflow_spaces: { resumen: "FLUJO COMPLETO: Text + Assistant → Image Gen (referencias) → Designer (manual) → exportar PDF", pasos: [ { paso: 1, nodo: "Text + Assistant", detalle: "Concepto → brief del sistema (colores, tipografías, texturas, mood)" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · distintos ratios)", detalle: "4–6 referencias de textura, color, espacio y tipografía" }, { paso: 3, nodo: "Designer", detalle: "Mini manual: paleta HEX, tipografías, composición, usos" }, { paso: 4, nodo: "Exportar → PDF", detalle: "Manual como PDF para la presentación" } ] },
          pantallas: [
            { tipo: "HOOK",   texto_pantalla: "ANTES DEL PRIMER SLIDE: EL SISTEMA.",               voz_off: "Antes del primer slide del pitch ya tenés que tener el sistema visual. Así se arma el flujo completo en Freepik Spaces.",                                    animacion: "Sistema construyéndose.",                            prompt_imagen: "Visual system building design manual Freepik Spaces workflow --ar 9:16", prompt_video: null },
            { tipo: "QUÉ ES", texto_pantalla: "PALETA · TIPO · COMPOSICIÓN · MOTION.",             voz_off: "Paleta con reglas, tipografías definidas, composición, texturas y guía de motion. Todo en un documento que sostiene al evento.",                             animacion: "Cada elemento aparece.",                             prompt_imagen: "Visual system components color typography composition texture motion --ar 9:16", prompt_video: null },
            { tipo: "FLUJO",  texto_pantalla: "CONCEPTO → IMAGE GEN → DESIGNER → PDF.",            voz_off: "El flujo en Spaces: concepto al Assistant, referencias con Image Gen, manual con Designer, y export como PDF listo para presentar.",                        animacion: "Pipeline de nodos.",                                 prompt_imagen: "Freepik Spaces visual system nodes pipeline export --ar 9:16", prompt_video: null },
            { tipo: "POR QUÉ",texto_pantalla: "CUALQUIER PERSONA PRODUCE. QUEDA BIEN.",            voz_off: "Con el sistema en mano, cualquier persona del equipo puede producir una pieza y va a quedar bien. El sistema democratiza la calidad.",                       animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",    texto_pantalla: "¿ARMÁS SISTEMAS ANTES O SOBRE LA MARCHA? 👇",       voz_off: "¿Armás el sistema visual antes de diseñar o lo improvisás sobre la marcha? Contanos.",                                                                       animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Sistema visual desde cero — flujo Spaces", caption: "Antes del primer slide. El sistema visual. 🎨", hashtags: "#VisualSystem #EventBranding #FreepikSpaces #DesignProcess",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Componentes del sistema visual" }, { paso: 2, nodo: "Designer", detalle: "Mini manual visual" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "CAJA DE PREGUNTAS", instruccion: "Historia → sticker Preguntas: '¿Armás el sistema antes o sobre la marcha?'" },
          guion_slides: [ { numero: 1, titulo: "SISTEMA VISUAL", subtitulo: "Flujo completo en Spaces", cuerpo: "", prompt_imagen: "Visual system Spaces workflow cover dark --ar 4:5" }, { numero: 2, titulo: "Los componentes", cuerpo: "Paleta · Tipografías · Composición · Texturas · Motion", prompt_imagen: "Visual system components design elements --ar 4:5" }, { numero: 3, titulo: "El flujo", cuerpo: "Concepto → Assistant → Image Gen → Designer → PDF", prompt_imagen: "Spaces visual pipeline nodes --ar 4:5" }, { numero: 4, titulo: "Por qué", cuerpo: "Cualquier persona del equipo puede producir y queda bien.", prompt_imagen: "Team consistency one system --ar 4:5" }, { numero: 5, titulo: "El entregable", cuerpo: "PDF de 4–6 páginas. El sistema que sostiene al evento.", prompt_imagen: "Design manual PDF deliverable --ar 4:5" } ] } },
      { date: "Vie 6/6", pilar: "PROCESO", titulo: "Cómo se define el tono de comunicación de una marca desde cero",
        tiktok: { hook: "El tono de comunicación es lo primero que el público siente antes de leer una sola palabra. Así se define desde cero.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar el ejercicio de tono → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando el ejercicio de personalidad de marca y los ejes de tono" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Contraste visual entre marcas con tono definido vs sin definir" } ] },
          pantallas: [
            { tipo: "HOOK",        texto_pantalla: "EL TONO SE SIENTE ANTES DE LEER.",             voz_off: "El tono de comunicación es lo primero que el público siente antes de leer una sola palabra.",                                                               animacion: "Frase con impacto.",                                 prompt_imagen: "Brand tone communication first impression before reading dark cinematic --ar 9:16", prompt_video: null },
            { tipo: "QUÉ ES",      texto_pantalla: "NO ES EL SLOGAN. ES LA PERSONALIDAD.",         voz_off: "El tono no es el estilo gráfico ni el slogan. Es la personalidad que tiene la marca cuando habla. Y cuando no habla también.",                              animacion: "La diferencia visualizada.",                         prompt_imagen: "Brand tone personality speaking and silence communication style dark --ar 9:16", prompt_video: null },
            { tipo: "EL EJERCICIO",texto_pantalla: "SI FUERA PERSONA, ¿CÓMO SERÍA?",               voz_off: "El ejercicio que funciona: si esta marca fuera una persona, ¿cómo se vestiría, cómo hablaría, cómo reaccionaría ante una crisis?",                        animacion: "La persona emerge.",                                 prompt_imagen: "Brand as person exercise how would it dress talk react crisis --ar 9:16", prompt_video: null },
            { tipo: "LOS EJES",    texto_pantalla: "FORMAL ↔ CERCANO. SERIO ↔ JUGUETÓN.",          voz_off: "Los cuatro ejes del tono: formal versus cercano, serio versus juguetón, técnico versus accesible, seguro versus humilde. Definirlos es el trabajo.",       animacion: "Cuatro ejes con sliders.",                           prompt_imagen: "Brand tone four axes formal casual serious playful technical accessible --ar 9:16", prompt_video: null },
            { tipo: "CTA",         texto_pantalla: "¿TU MARCA TIENE TONO DEFINIDO? 👇",            voz_off: "¿Tu marca tiene tono definido o habla diferente en cada pieza? El público lo siente.",                                                                       animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
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
            { tipo: "HOOK",    texto_pantalla: "112 METROS. NO ES PARA VER. ES PARA SENTIR.",      voz_off: "Una esfera de 112 metros con la pantalla más grande del mundo. Y no es para ver. Es para sentir.",                                                           animacion: "Esfera en el desierto.",                             prompt_imagen: "The Sphere Las Vegas 112 meter LED dome night massive scale cinematic --ar 9:16", prompt_video: "The Sphere Las Vegas aerial night lights changing massive scale cinematic" },
            { tipo: "DATOS",   texto_pantalla: "$2.300M. LOS ASIENTOS VIBRAN.",                    voz_off: "Dos mil trescientos millones de dólares, diecisiete mil seiscientas personas. Los asientos vibran, el aire cambia. Experiencia física total.",               animacion: "Datos con peso.",                                    prompt_imagen: "Sphere interior 17600 capacity haptic seats sensory experience --ar 9:16", prompt_video: null },
            { tipo: "INSIGHT", texto_pantalla: "NO VENDIERON CONCIERTOS.",                         voz_off: "No vendieron conciertos. Vendieron la primera experiencia multisensorial a esa escala en la historia del entretenimiento.",                                   animacion: "Multisensorial visualizado.",                        prompt_imagen: "Multisensory experience sight sound haptic scent The Sphere --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "EL FUTURO: MÁS SENTIDOS.",                         voz_off: "El futuro de las experiencias no es más pantallas. Es más sentidos. Vista, sonido, tacto, olfato. Esa es la dirección.",                                     animacion: "Oscuro. Cian.",                                      prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿IRÍAS A THE SPHERE? 👇",                         voz_off: "¿Irías a The Sphere? ¿O te parece demasiado? Contanos.",                                                                                                      animacion: "Oscuro. Cian.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "The Sphere: el límite del espacio como experiencia", caption: "112m. $2.300M. Los asientos vibran. El futuro es multisensorial. 🌐", hashtags: "#TheSphere #LasVegas #ExperienceDesign #Multisensory",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "LED dome, haptic interior, multisensorial" }, { paso: 2, nodo: "Designer", detalle: "Escala y datos de inversión" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Irías a The Sphere?' → Sí, de inmediato / Probablemente / No / No sé qué es" },
          guion_slides: [ { numero: 1, titulo: "THE SPHERE", subtitulo: "El límite del espacio como experiencia", cuerpo: "", prompt_imagen: "The Sphere Las Vegas cover massive LED dome dark cinematic --ar 4:5" }, { numero: 2, titulo: "$2.300 millones", cuerpo: "La inversión más grande en un venue de entretenimiento de la historia.", prompt_imagen: "Sphere investment scale construction milestone --ar 4:5" }, { numero: 3, titulo: "Experiencia física total", cuerpo: "Los asientos vibran. El aire cambia. Es multisensorial. Ver no alcanza.", prompt_imagen: "Haptic seats sensory immersion multisensory experience --ar 4:5" }, { numero: 4, titulo: "No vendieron conciertos", cuerpo: "Vendieron la primera experiencia multisensorial a esa escala.", prompt_imagen: "Not concerts but multisensory history experience redefined --ar 4:5" }, { numero: 5, titulo: "El futuro: más sentidos", cuerpo: "No es más pantallas. Es más sentidos. Eso es lo que viene.", prompt_imagen: "Future experiences more senses beyond screens multisensory trend --ar 4:5" } ] } },
      { date: "Mar 10/6", pilar: "INDUSTRIA", titulo: "El mercado experiencial en Argentina 2026 — estado y oportunidades",
        tiktok: { hook: "¿Cómo está el mercado del marketing experiencial en Argentina en 2026? Los datos para tomar decisiones.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) datos de mercado → Voiceover (11Labs) → After Effects con barras animadas", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "5 pantallas: panorama Argentina, sectores, tendencias, oportunidad" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Barras por sector animadas" } ] },
          pantallas: [
            { tipo: "HOOK",       texto_pantalla: "EL MERCADO EN ARGENTINA. 2026.",                voz_off: "¿Cómo está el mercado del marketing experiencial en Argentina en 2026? Los datos para tomar decisiones.",                                                    animacion: "Mapa de Argentina iluminándose.",                    prompt_imagen: "Argentina experiential marketing market 2026 country map illuminated business data --ar 9:16", prompt_video: null },
            { tipo: "SECTORES",   texto_pantalla: "TECH · ENTRETENIMIENTO · FINANZAS.",            voz_off: "Los sectores que más invierten: tecnología, entretenimiento, automotriz, consumo masivo y finanzas.",                                                        animacion: "Barras por sector.",                                 prompt_imagen: "Argentina sectors investing experiential tech entertainment automotive FMCG finance --ar 9:16", prompt_video: null },
            { tipo: "TENDENCIAS", texto_pantalla: "HÍBRIDO · IA · SUSTENTABILIDAD · PERSONALIZACIÓN.", voz_off: "Las cuatro tendencias del año: experiencias híbridas, sustentabilidad como condición, IA en producción y personalización a escala.",                animacion: "Lista verde.",                                       prompt_imagen: "2026 Argentina experiential trends hybrid AI sustainability personalization --ar 9:16", prompt_video: null },
            { tipo: "OPORTUNIDAD",texto_pantalla: "ESTRATEGIA + PRODUCCIÓN + TECNOLOGÍA.",         voz_off: "La oportunidad: pocos actores combinan estrategia, producción y tecnología al mismo tiempo. Ese triángulo define el mercado.",                              animacion: "Triángulo de capacidades.",                          prompt_imagen: "Market opportunity strategy production technology triangle gap --ar 9:16", prompt_video: null },
            { tipo: "CTA",        texto_pantalla: "¿EN QUÉ SECTOR ESTÁS? 👇",                     voz_off: "¿En qué sector trabajás? ¿Cómo ves el mercado este año? Contanos.",                                                                                          animacion: "Oscuro.",                                            prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Mercado experiencial Argentina 2026", caption: "Los datos para saber dónde está el mercado este año. 📊", hashtags: "#MarketingExperiencial #Argentina2026 #Tendencias #ExperienceMarketing",
          workflow_carrusel: { resumen: "Lista 5 prompts datos de mercado → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Data journalism, oscuro, datos grandes" }, { paso: 2, nodo: "Designer", detalle: "Barras por sector, triángulo de oportunidad" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿En qué sector trabajás?' → Tech / Entretenimiento / Automotriz / Otro" },
          guion_slides: [ { numero: 1, titulo: "MERCADO ARGENTINA 2026", subtitulo: "Estado y oportunidades", cuerpo: "", prompt_imagen: "Argentina experiential market cover dark data 2026 --ar 4:5" }, { numero: 2, titulo: "Los sectores líderes", cuerpo: "Tech · Entretenimiento · Automotriz · FMCG · Finanzas", prompt_imagen: "Leading sectors bar chart dark editorial --ar 4:5" }, { numero: 3, titulo: "Las 4 tendencias", cuerpo: "Híbrido · Sustentabilidad · IA en producción · Personalización", prompt_imagen: "Four trends 2026 bold list dark --ar 4:5" }, { numero: 4, titulo: "La oportunidad", cuerpo: "Pocos combinan estrategia + producción + tecnología.", prompt_imagen: "Market opportunity triangle gap --ar 4:5" }, { numero: 5, titulo: "¿Dónde estás vos?", cuerpo: "¿Tu marca está aprovechando estas tendencias?", prompt_imagen: "Where are you brand positioning question --ar 4:5" } ] } },
      { date: "Mié 11/6", pilar: "CULTURA", titulo: "Refik Anadol en el MoMA: cuando la IA entra al museo más importante del mundo",
        tiktok: { hook: "La IA entró al MoMA. No como herramienta. Como obra permanente. Y eso cambió la conversación para siempre.", duracion: "45 seg",
          workflow_spaces: { resumen: "Video Gen (Kling 3.0 · 9:16 · 5s) para hook → Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro", pasos: [ { paso: 1, nodo: "Video Gen (Kling 3.0 · 9:16 · 5s)", detalle: "'MoMA AI data art installation permanent collection neural network visualization cinematic'" }, { paso: 2, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas 2–4: la obra, el debate, la lección para marcas" }, { paso: 3, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" } ] },
          pantallas: [
            { tipo: "HOOK",    texto_pantalla: "LA IA ENTRÓ AL MOMA. COMO OBRA PERMANENTE.",       voz_off: "La IA entró al MoMA. No como herramienta. Como obra permanente. Y eso cambió la conversación para siempre.",                                                animacion: "Streams de datos entrando al museo.",                prompt_imagen: "AI art MoMA permanent collection data installation cinematic --ar 9:16", prompt_video: "MoMA AI data art installation neural network cinematic flowing" },
            { tipo: "QUÉ ES",  texto_pantalla: "MILLONES DE DATOS → PAISAJES VISUALES.",           voz_off: "Refik Anadol, Machine Hallucinations: millones de datos de la colección del MoMA transformados en paisajes visuales que se generan en tiempo real.",         animacion: "Datos que se transforman.",                          prompt_imagen: "Machine Hallucinations MoMA data collection visual landscapes real time --ar 9:16", prompt_video: null },
            { tipo: "EL DEBATE",texto_pantalla: "¿ES ARTE? EL MOMA YA DECIDIÓ.",                  voz_off: "¿Es arte? La pregunta no tiene una respuesta universal. Pero el MoMA ya tomó posición: sí, y es permanente.",                                               animacion: "La pregunta. La respuesta institucional.",           prompt_imagen: "Is this art debate AI MoMA institutional response permanent --ar 9:16", prompt_video: null },
            { tipo: "LECCIÓN", texto_pantalla: "LA IA AMPLIFICA. NO REEMPLAZA.",                   voz_off: "Para las marcas: la IA no reemplaza la creatividad. La amplifica. Anadol lo demuestra mejor que cualquier argumento teórico.",                              animacion: "Cita visual.",                                       prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",     texto_pantalla: "¿LA IA PUEDE CREAR ALGO VERDADERAMENTE NUEVO? 👇", voz_off: "¿Puede la IA crear algo verdaderamente nuevo? La respuesta importa para todo lo que hacemos. Contanos.",                                                  animacion: "Oscuro. Cian.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "La IA en el MoMA: cuando el arte cambia de reglas", caption: "La IA entró al MoMA como obra permanente. Eso cambió todo. ✨", hashtags: "#RefikAnadol #MoMA #AIArt #CreatividadIA #ArteFuturo",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Data art, MoMA, neural networks, vibrantes sobre negro" }, { paso: 2, nodo: "Designer", detalle: "Tipografía editorial, pregunta clave destacada" }, { paso: 3, nodo: "Exportar .zip", detalle: "Carrusel" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿La IA puede crear verdadero arte?' → Sí / No / Depende de cómo lo definas / No sé" },
          guion_slides: [ { numero: 1, titulo: "LA IA EN EL MOMA", subtitulo: "Cuando el arte cambia de reglas", cuerpo: "", prompt_imagen: "AI art MoMA cover data installation dark cinematic --ar 4:5" }, { numero: 2, titulo: "Machine Hallucinations", cuerpo: "Millones de datos de la colección del MoMA → paisajes visuales en tiempo real.", prompt_imagen: "Machine Hallucinations MoMA data collection visual real time --ar 4:5" }, { numero: 3, titulo: "¿Es arte?", cuerpo: "La pregunta no tiene respuesta. Pero el MoMA ya tomó posición: sí, y es permanente.", prompt_imagen: "Is this art debate MoMA institutional response --ar 4:5" }, { numero: 4, titulo: "Para las marcas", cuerpo: "La IA no reemplaza la creatividad. La amplifica. Anadol lo demuestra.", prompt_imagen: "AI amplifies creativity brand lesson Anadol proof --ar 4:5" }, { numero: 5, titulo: "La pregunta abierta", cuerpo: "¿Puede la IA crear algo verdaderamente nuevo? La respuesta importa para todo lo que hacemos.", prompt_imagen: "Open question AI creativity implications design --ar 4:5" } ] } },
      { date: "Jue 12/6", pilar: "OFICIO", titulo: "Cómo presentar un presupuesto sin que el cliente se vaya",
        tiktok: { hook: "El 70% de las propuestas se pierden cuando aparece el número. Esto pasa antes de que lo vean.", duracion: "50 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas: el momento del número, contexto antes, cómo encuadrarlo" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "After Effects", detalle: "Secuencia de slides de presentación animados" } ] },
          pantallas: [
            { tipo: "HOOK",       texto_pantalla: "EL 70% SE PIERDE CON EL NÚMERO.",               voz_off: "El 70% de las propuestas se pierden cuando aparece el número. No porque sea caro. Por cuándo aparece.",                                                     animacion: "Número que asusta. Fondo negro.",                    prompt_imagen: "Budget number appears proposal lost client scared dark --ar 9:16", prompt_video: null },
            { tipo: "POR QUÉ",    texto_pantalla: "ANTES DE QUE QUIERAN LA EXPERIENCIA.",          voz_off: "El número aparece antes de que el cliente quisiera la experiencia. Eso es lo que lo mata. El orden lo cambia todo.",                                         animacion: "Secuencia: precio → reacción.",                      prompt_imagen: "Price before desire concept wrong order presentation --ar 9:16", prompt_video: null },
            { tipo: "EL ORDEN",   texto_pantalla: "PROBLEMA → TRANSFORMACIÓN → ROI → NÚMERO.",     voz_off: "El orden correcto: el problema del cliente, la transformación que logramos, el ROI que puede esperar, y recién después el número.",                          animacion: "Escalera que sube hasta el número.",                 prompt_imagen: "Correct presentation order problem transformation ROI then price --ar 9:16", prompt_video: null },
            { tipo: "EL ENCUADRE",texto_pantalla: "NO ES UN COSTO. ES EL PRECIO DE LA TRANSFORMACIÓN.", voz_off: "El número no es un costo. Es el precio de la transformación. Cambiar esa frase cambia cómo lo reciben.",                                          animacion: "Reencuadre visual.",                                  prompt_imagen: null, prompt_video: null },
            { tipo: "CTA",        texto_pantalla: "¿CUÁNDO PRESENTÁS EL NÚMERO? 👇",               voz_off: "¿Cuándo presentás el presupuesto en tu propuesta? Al principio o al final. Contanos.",                                                                       animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
        instagram: { tipo: "Carrusel", slides: 5, titulo: "Cómo presentar un presupuesto sin perder al cliente", caption: "El número no es un costo. Es el precio de la transformación. 💡", hashtags: "#Presupuesto #Pitch #AgencyLife #MarketingB2B #VentaCreativa",
          workflow_carrusel: { resumen: "Lista 5 prompts → Image Gen (Nano Banana Pro · 4:5 · 2K) → Designer → .zip", pasos: [ { paso: 1, nodo: "Nodo Lista + Image Gen · 4:5 · 2K", detalle: "Presentación ejecutiva, orden correcto, reencuadre" }, { paso: 2, nodo: "Designer", detalle: "Escalera del orden, frase clave destacada" }, { paso: 3, nodo: "Exportar .zip", detalle: "Guardable" } ] },
          historia: { tipo: "POLL", instruccion: "Historia → Poll '¿Cuándo presentás el número?' → Al principio / En el medio / Al final / Cuando me lo piden" },
          guion_slides: [ { numero: 1, titulo: "EL PRESUPUESTO", subtitulo: "Cómo presentarlo sin perder al cliente", cuerpo: "", prompt_imagen: "Budget presentation executive dark professional --ar 4:5" }, { numero: 2, titulo: "El 70% se pierde", cuerpo: "No porque sea caro. Porque apareció antes de que quisieran la experiencia.", prompt_imagen: "Proposal lost before desire price too early --ar 4:5" }, { numero: 3, titulo: "El orden correcto", cuerpo: "Problema → Transformación → ROI → El número", prompt_imagen: "Correct order stairs problem transformation ROI price --ar 4:5" }, { numero: 4, titulo: "El reencuadre", cuerpo: "No es un costo. Es el precio de la transformación.", prompt_imagen: "Price reframe transformation cost mindset --ar 4:5" }, { numero: 5, titulo: "La frase que cambia todo", cuerpo: "Cambiar cómo llamás al número cambia cómo lo reciben.", prompt_imagen: "Language changes perception price transformation --ar 4:5" } ] } },
      { date: "Vie 13/6", pilar: "PROCESO", titulo: "Cómo escalar una agencia sin perder la calidad — el momento en que todo cambia",
        tiktok: { hook: "Hay un momento en la vida de toda agencia en que crecer empieza a significar perder lo que la hacía buena. Así se evita.", duracion: "55 seg",
          workflow_spaces: { resumen: "Image Gen (Nano Banana Pro · 9:16 · 2K) para ilustrar el momento del quiebre → Voiceover (11Labs) → Premiere Pro / After Effects", pasos: [ { paso: 1, nodo: "Image Gen (Nano Banana Pro · 9:16 · 2K)", detalle: "Pantallas ilustrando el momento del quiebre, los sistemas que sostienen la calidad" }, { paso: 2, nodo: "Voiceover (11Labs)", detalle: "Guion → .mp3" }, { paso: 3, nodo: "Premiere Pro / After Effects", detalle: "Contraste visual: caos de escala vs sistemas que sostienen" } ] },
          pantallas: [
            { tipo: "HOOK",        texto_pantalla: "CRECER EMPIEZA A SIGNIFICAR PERDER.",          voz_off: "Hay un momento en la vida de toda agencia en que crecer empieza a significar perder lo que la hacía buena.",                                                 animacion: "Quiebre visual.",                                    prompt_imagen: "Agency growth vs quality loss moment dark dramatic --ar 9:16", prompt_video: null },
            { tipo: "EL MOMENTO",  texto_pantalla: "EL CLIENTE NUEVO NO RECIBE LO MISMO.",        voz_off: "El síntoma más común: el cliente nuevo no recibe lo mismo que el primero, y el equipo no sabe por qué las cosas se hacen así.",                             animacion: "La grieta que aparece.",                             prompt_imagen: "Agency inconsistency new vs original client quality gap dark --ar 9:16", prompt_video: null },
            { tipo: "LA SOLUCIÓN", texto_pantalla: "LA CALIDAD SE MANTIENE CON SISTEMAS.",        voz_off: "La calidad no se mantiene con talento individual. Se mantiene con sistemas: procesos documentados, estándares de entrega, onboarding de equipo.",            animacion: "Sistema que sostiene.",                              prompt_imagen: "Quality through systems processes documentation standards team agency --ar 9:16", prompt_video: null },
            { tipo: "EL CRITERIO", texto_pantalla: "EL CRITERIO. LA RELACIÓN. LOS DETALLES.",     voz_off: "Lo que nunca debe escalar: el criterio creativo, la relación con el cliente, la obsesión por los detalles. Eso es lo que te hace bueno.",                   animacion: "Lo irreemplazable.",                                 prompt_imagen: "Creative criterion client relationship detail obsession cannot scale --ar 9:16", prompt_video: null },
            { tipo: "CTA",         texto_pantalla: "¿TU AGENCIA TIENE SISTEMAS QUE SOSTIENEN? 👇", voz_off: "¿Tu agencia ya tiene sistemas que sostienen la calidad sin depender de una sola persona? Contanos.",                                                       animacion: "Verde oscuro.",                                      prompt_imagen: null, prompt_video: null },
          ],
        },
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
                  <div key={di} style={{ background: "#f0f0f0", border: `1px solid ${isOpen ? "#333" : "#1e1e1e"}`, borderRadius: 8, marginBottom: 6, overflow: "hidden" }}>
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
                style={{ padding: "7px 10px", marginBottom: 3, borderRadius: 5, cursor: "pointer", background: selW === wi && selD === di ? "#E63946" : "#ebebeb", fontSize: 11, color: selW === wi && selD === di ? "#ffffff" : "#444444" }}>
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
                  <div style={{ color: "#333333", fontSize: 12, lineHeight: 1.7 }}>{day.instagram.historia.instruccion}</div>
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
              <div style={{ color: "#666666", fontSize: 11 }}>📱 5 placas · 5s por placa · 25s total · 🎙 Voz en off por placa</div>
            </div>
            {day.tiktok.pantallas.map((p, pi) => {
              const isHook = pi === 0, isCta = pi === day.tiktok.pantallas.length - 1;
              const accent = isHook ? "#E63946" : isCta ? "#4CAF50" : "#333";
              // soporte doble estructura: nueva (texto_pantalla/voz_off) y legacy (texto/locucion_texto)
              const textoDisplay = p.texto_pantalla || p.texto;
              const vozDisplay   = p.voz_off;
              return (
                <div key={pi} style={{ background: "#f2f2f2", borderRadius: 6, padding: 14, marginBottom: 8, borderLeft: `3px solid ${accent}` }}>
                  <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                    <span style={{ background: "#111111", color: "#E63946", borderRadius: 3, padding: "2px 8px", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>P{pi + 1}</span>
                    <span style={{ background: "#ebebeb", borderRadius: 3, padding: "2px 8px", fontSize: 10, color: "#666666", letterSpacing: 1 }}>{p.tipo}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <div style={{ background: "#ffffff", borderRadius: 4, padding: 10 }}>
                      <div style={{ color: "#E63946", fontSize: 9, letterSpacing: 2, fontWeight: 700, marginBottom: 6 }}>TEXTO EN PANTALLA</div>
                      <div style={{ color: "#111111", fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>{textoDisplay}</div>
                    </div>
                    {vozDisplay && (
                      <div style={{ background: "#f5f0ff", borderRadius: 4, padding: 10 }}>
                        <div style={{ color: "#9C27B0", fontSize: 9, letterSpacing: 2, fontWeight: 700, marginBottom: 6 }}>🎙 VOZ EN OFF</div>
                        <div style={{ color: "#333333", fontSize: 12, lineHeight: 1.6, fontStyle: "italic" }}>{vozDisplay}</div>
                      </div>
                    )}
                  </div>
                  <div style={{ background: "#f0f0ff", borderRadius: 4, padding: 8, marginBottom: 6 }}>
                    <div style={{ color: "#2196F3", fontSize: 9, letterSpacing: 2, marginBottom: 3 }}>🎬 ANIMACIÓN</div>
                    <div style={{ color: "#555555", fontSize: 11 }}>{p.animacion}</div>
                  </div>
                  {p.prompt_imagen && (
                    <div style={{ background: "#f0fff0", borderRadius: 4, padding: 8, marginBottom: p.prompt_video ? 6 : 0 }}>
                      <div style={{ color: "#4CAF50", fontSize: 9, letterSpacing: 2, marginBottom: 3 }}>🖼 IMAGE GEN — Nano Banana Pro · 9:16 · 2K</div>
                      <div style={{ color: "#8bc34a", fontSize: 11, fontFamily: "monospace", lineHeight: 1.5 }}>{p.prompt_imagen}</div>
                    </div>
                  )}
                  {p.prompt_video && (
                    <div style={{ background: "#fdf0fd", borderRadius: 4, padding: 8 }}>
                      <div style={{ color: "#E040FB", fontSize: 9, letterSpacing: 2, marginBottom: 3 }}>🎥 VIDEO GEN — Kling 3.0 · 9:16 · 5s</div>
                      <div style={{ color: "#9c27b0", fontSize: 11, fontFamily: "monospace", lineHeight: 1.5 }}>{p.prompt_video}</div>
                    </div>
                  )}
                </div>
              );
            })}
            {day.tiktok.locucion_texto && !day.tiktok.pantallas[0]?.voz_off && (
              <div style={{ background: "#f0fff0", border: "1px solid #4CAF5055", borderRadius: 8, padding: 16 }}>
                <div style={{ color: "#4CAF50", fontSize: 10, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>🎙 LOCUCIÓN COMPLETA — 11Labs → .mp3</div>
                <div style={{ color: "#555555", fontSize: 13, lineHeight: 1.8, fontStyle: "italic" }}>{day.tiktok.locucion_texto}</div>
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
                  <span style={{ color: cat.color, fontWeight: 700, fontSize: 12 }}>{item.n}</span>
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
      <div style={{ background: "#f0f0f0", borderBottom: "1px solid #eeeeee", padding: "8px 24px", display: "flex", gap: 6, flexWrap: "wrap" }}>
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
