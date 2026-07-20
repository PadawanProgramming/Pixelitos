var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_postgres = __toESM(require("postgres"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);

// src/data/initialMaterials.ts
var INITIAL_MATERIALS = [
  // PILAS BLOQUES
  {
    id: "pb-201",
    title: "Desaf\xEDo Pilas Bloques 201",
    url: "https://pilasbloques.program.ar/online/#/desafio/201",
    tool: "Pilas Bloques",
    ageGroup: "Todos / General",
    description: "Desaf\xEDo interactivo oficial de l\xF3gica en Pilas Bloques."
  },
  {
    id: "pb-214",
    title: "Desaf\xEDo Pilas Bloques 214",
    url: "https://pilasbloques.program.ar/online/#/desafio/214",
    tool: "Pilas Bloques",
    ageGroup: "Todos / General",
    description: "Desaf\xEDo interactivo oficial de l\xF3gica en Pilas Bloques."
  },
  {
    id: "pb-233",
    title: "Desaf\xEDo Pilas Bloques 233",
    url: "https://pilasbloques.program.ar/online/#/desafio/233",
    tool: "Pilas Bloques",
    ageGroup: "Todos / General",
    description: "Desaf\xEDo interactivo oficial de l\xF3gica en Pilas Bloques."
  },
  {
    id: "pb-creator",
    title: "Creador de Desaf\xEDos Pilas Bloques",
    url: "https://pilasbloques.program.ar/online/#/creador/seleccionar",
    tool: "Pilas Bloques",
    ageGroup: "Todos / General",
    description: "Herramienta oficial para que los profes creen desaf\xEDos de bloques personalizados."
  },
  {
    id: "pb-littledot",
    title: "Little Dot (Toxicode)",
    url: "https://little-dot.toxicode.fr/",
    tool: "Pilas Bloques",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Excelente recurso interactivo para entrenar la l\xF3gica de secuencias en los m\xE1s chicos."
  },
  // SCRATCH PEQUEÑOS (1° 1 / 7-8 AÑOS)
  {
    id: "sc-nombre-interactivo",
    title: "Mi Nombre Interactivo",
    url: "https://scratch.mit.edu/projects/1128380598/",
    tool: "Scratch",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Proyecto inicial de Scratch para aprender a animar letras con eventos y sonidos."
  },
  {
    id: "sc-pintar-pixelitos",
    title: "A Pintar con Pixelitos",
    url: "https://scratch.mit.edu/projects/1166155611/",
    tool: "Scratch",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Pizarra interactiva de dibujo guiado con herramientas de color y pincel."
  },
  {
    id: "sc-lapiz-magico",
    title: "L\xE1piz M\xE1gico",
    url: "https://scratch.mit.edu/projects/1219173285",
    tool: "Scratch",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Un l\xE1piz inteligente que persigue el cursor creando trazos art\xEDsticos."
  },
  {
    id: "sc-piano",
    title: "Piano Musical",
    url: "https://scratch.mit.edu/projects/1128383934/",
    tool: "Scratch",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Teclado musical interactivo para experimentar con notas, sonido y pulsaci\xF3n."
  },
  {
    id: "sc-laberinto-1",
    title: "Laberinto Nivel 1",
    url: "https://scratch.mit.edu/projects/1164542027/",
    tool: "Scratch",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Juego de laberinto simple controlado con flechas de teclado. Ideal para los inicios."
  },
  {
    id: "sc-caza-topos",
    title: "Caza Topos",
    url: "https://scratch.mit.edu/projects/1209942561",
    editorUrl: "https://scratch.mit.edu/projects/1209942561/editor",
    tool: "Scratch",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Juego r\xE1pido de reflejos donde los alumnos programan la aparici\xF3n aleatoria del topo."
  },
  {
    id: "sc-robin-hood",
    title: "Robin Hood (Proyecto Base)",
    url: "https://scratch.mit.edu/projects/837985034/editor/",
    editorUrl: "https://scratch.mit.edu/projects/837985034/editor/",
    tool: "Scratch",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Plantilla de c\xF3digo inicial para aprender tiro al blanco y controles b\xE1sicos."
  },
  {
    id: "sc-robin-remix",
    title: "Robin Remix Pixelitos",
    url: "https://scratch.mit.edu/projects/1321612427/",
    tool: "Scratch",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Remezcla oficial con assets adaptados de Pixelitos del juego de Robin Hood."
  },
  {
    id: "sc-aventura-mar",
    title: "Aventura en el Mar",
    url: "https://scratch.mit.edu/projects/1215305113",
    tool: "Scratch",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Proyecto de exploraci\xF3n submarina con simp\xE1ticos habitantes del oc\xE9ano y animaciones."
  },
  // SCRATCH MEDIANOS (8-12 AÑOS)
  {
    id: "sc-laberinto-2",
    title: "Laberinto Nivel 2",
    url: "https://scratch.mit.edu/projects/1135830110/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Laberinto con obst\xE1culos m\xF3viles, variables de vidas y cambio de escenarios."
  },
  {
    id: "sc-lanza-pelotas",
    title: "Lanza Pelotas",
    url: "https://scratch.mit.edu/projects/1145012948/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Mec\xE1nicas de f\xEDsica simple y trayectoria de proyectiles."
  },
  {
    id: "sc-monedas",
    title: "Recolector de Monedas",
    url: "https://scratch.mit.edu/projects/1205895029/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Contador de puntos y temporizador con ca\xEDda constante de objetos de puntaje."
  },
  {
    id: "sc-esquivar-autos",
    title: "Esquivar Autos",
    url: "https://scratch.mit.edu/projects/1350116848",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    isNew: true,
    description: "Nuevo proyecto de conducci\xF3n y scroll infinito para esquivar autos en la carretera."
  },
  {
    id: "sc-caza-raton",
    title: "Caza Rat\xF3n Pixelitos",
    url: "https://scratch.mit.edu/projects/1170935105/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Caza de ratones con mec\xE1nicas complejas, incorporando im\xE1genes de IA para el fondo."
  },
  {
    id: "sc-condicionales-murcielago",
    title: "Condicionales Murci\xE9lago",
    url: "https://scratch.mit.edu/projects/1144912709",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Foco pedag\xF3gico: Toma de decisiones en el juego usando la estructura SI/ENTONCES."
  },
  {
    id: "sc-clones-salchi",
    title: "Clones Salchi",
    url: "https://scratch.mit.edu/projects/1145724501/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Uso intensivo de clones y comportamiento independiente de objetos creados din\xE1micamente."
  },
  {
    id: "sc-arkanoid",
    title: "Arkanoid Cl\xE1sico",
    url: "https://scratch.mit.edu/projects/1162719102/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Rompe los bloques usando la pelotita de rebote y una raqueta que sigue al mouse."
  },
  {
    id: "sc-arkanoid-doble",
    title: "Arkanoid DOBLE",
    url: "https://scratch.mit.edu/projects/1180535005/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Versi\xF3n expandida de Arkanoid con dos pelotas, potenciadores de velocidad y dificultad."
  },
  {
    id: "sc-aventura-galactica-1",
    title: "Aventura Gal\xE1ctica I",
    url: "https://scratch.mit.edu/projects/1162256935/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Juego de naves espaciales disparando a asteroides con puntuaciones y meteoritos."
  },
  {
    id: "sc-aventura-galactica-2",
    title: "Aventura Gal\xE1ctica II",
    url: "https://scratch.mit.edu/projects/1152603963/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Segunda entrega con oleadas de jefes finales, m\xFAltiples tipos de disparos y escudos."
  },
  {
    id: "sc-caza-fantasmas",
    title: "Capi Cazafantasmas",
    url: "https://scratch.mit.edu/projects/1205909763/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Mec\xE1nica de cacer\xEDa en cuarto oscuro con puntero que simula una linterna."
  },
  {
    id: "sc-bichos-facil",
    title: "Disparos y Bichos (F\xE1cil)",
    url: "https://scratch.mit.edu/projects/1215302840",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Shooter simplificado: no contiene funciones personalizadas, ideal para introducir clonaci\xF3n."
  },
  {
    id: "sc-bichos-dificil",
    title: "Disparos y Bichos (Dif\xEDcil)",
    url: "https://scratch.mit.edu/projects/1215302622",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Shooter sin funciones con un ritmo acelerado de spawn de enemigos."
  },
  {
    id: "sc-bichos-funciones",
    title: "Disparos y Bichos (Con Funciones)",
    url: "https://scratch.mit.edu/projects/1209309561/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: 'Uso avanzado de bloques "Mis Bloques" (Funciones con par\xE1metros) para ordenar la l\xF3gica.'
  },
  {
    id: "sc-laberinto-terror-roblox",
    title: "Laberinto Terror Roblox",
    url: "https://scratch.mit.edu/projects/1234833947/editor/",
    editorUrl: "https://scratch.mit.edu/projects/1234833947/editor/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Desaf\xEDo espeluznante combinando mec\xE1nicas de laberinto 2D y personajes ic\xF3nicos de Roblox."
  },
  {
    id: "sc-navidad",
    title: "Laberinto de Navidad",
    url: "https://scratch.mit.edu/projects/1249176742",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Proyecto tem\xE1tico festivo para colectar regalos de Navidad y esquivar renos locos."
  },
  {
    id: "sc-ra-pinball",
    title: "Pinball RA (Realidad Aumentada)",
    url: "https://scratch.mit.edu/projects/937429521",
    editorUrl: "https://scratch.mit.edu/projects/397862502/editor/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Utiliza la webcam del alumno para empujar paletas f\xEDsicas virtuales con las manos."
  },
  {
    id: "sc-ra-piano",
    title: "Piano Realidad Aumentada",
    url: "https://scratch.mit.edu/projects/1295041817",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Teclado musical virtual que se acciona detectando colisi\xF3n con las manos del alumno."
  },
  {
    id: "sc-ra-solar",
    title: "Sistema Solar RA",
    url: "https://scratch.mit.edu/projects/1295042867",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Interactuar gestualmente con planetas del Sistema Solar proyectados en la c\xE1mara."
  },
  {
    id: "sc-pokemon",
    title: "Pok\xE9mon Scratch",
    url: "https://scratch.mit.edu/projects/220624676",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Simulaci\xF3n de batallas o selecci\xF3n de criaturas utilizando listas y estructuras l\xF3gicas."
  },
  {
    id: "sc-pacmancraft",
    title: "PacManCraft",
    url: "https://scratch.mit.edu/projects/1241761083/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Divertid\xEDsima fusi\xF3n est\xE9tica de Minecraft y la mec\xE1nica de laberinto de Pac-Man."
  },
  {
    id: "sc-karts-simple",
    title: "Juego de Karts (B\xE1sico)",
    url: "https://scratch.mit.edu/projects/1231813666",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: 'Juego de carreras con vista a\xE9rea ("Top Down") y controles de giro coordinados.'
  },
  {
    id: "sc-karts-funciones",
    title: "Juego de Karts (Con Funciones)",
    url: "https://scratch.mit.edu/projects/1289266662/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Mismo proyecto de carreras pero optimizado con funciones reutilizables para giros y velocidad."
  },
  {
    id: "sc-pelota-simple",
    title: "Juego de la Pelota",
    url: "https://scratch.mit.edu/projects/1276413893",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Una versi\xF3n simplificada para afinar reflejos y coordinar movimientos del rat\xF3n."
  },
  {
    id: "sc-ra-muchas-pelotas",
    title: "Realidad Aumentada (Muchas Pelotas)",
    url: "https://scratch.mit.edu/projects/397862502/editor/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "M\xFAltiples elementos rebotando interactuando directamente con el feed de video del alumno."
  },
  {
    id: "sc-ra-una-pelota",
    title: "Realidad Aumentada (Una Pelota)",
    url: "https://scratch.mit.edu/projects/223593738",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Proyecto cl\xE1sico de dominadas para que los chicos controlen un bal\xF3n virtual en clase."
  },
  {
    id: "sc-mandala",
    title: "Creador de Mandalas (Funciones)",
    url: "https://scratch.mit.edu/projects/1286168686/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Excelente proyecto de arte generativo y geometr\xEDa computacional con l\xE1piz y giros."
  },
  {
    id: "sc-plataformas",
    title: "Juego de Plataformas",
    url: "https://scratch.mit.edu/projects/1328960430/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Implementaci\xF3n avanzada de f\xEDsica con salto, gravedad artificial y colisi\xF3n con el suelo."
  },
  {
    id: "sc-pochoclos",
    title: "Lluvia de Pochoclos",
    url: "https://scratch.mit.edu/projects/1350896827/",
    tool: "Scratch",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Recolectar palomitas pochocleras que caen din\xE1micamente, con niveles de velocidad acelerados."
  },
  // KAHOOTS
  {
    id: "kh-diagnostico-1",
    title: "Diagn\xF3stico Nivel 1 (Duplicado)",
    url: "https://create.kahoot.it/share/duplicado-de-cuanto-aprendimos-nivel-1/d85beb49-fd01-4804-8539-acab2cd5827b",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Examen de diagn\xF3stico del Nivel 1 duplicado para uso r\xE1pido de los profesores."
  },
  {
    id: "kh-mundial",
    title: "Trivia Mundial de F\xFAtbol 2026",
    url: "https://create.kahoot.it/share/preguntas-mundial-2026/0085e8b0-6074-4f09-a9b8-e39cd1dc8e10",
    tool: "Kahoot",
    ageGroup: "Todos / General",
    description: "Juego especial de preguntas y respuestas sobre el Mundial para momentos festivos o de distensi\xF3n."
  },
  {
    id: "kh-bebras-5-6",
    title: "Bebras (5\xB0 y 6\xB0 Grado)",
    url: "https://create.kahoot.it/share/bebras-5-y-6/31e7f8d9-60fc-435c-8977-7b8bdb5bc927",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Desaf\xEDos internacionales de pensamiento computacional adaptados para los grados mayores."
  },
  {
    id: "kh-bebras-4-2",
    title: "Bebras (4to - Secci\xF3n 2)",
    url: "https://create.kahoot.it/share/bebras-4to-2/3d971b36-d84d-420c-8d67-6cb84a37d141",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Desaf\xEDos interactivos de l\xF3gica y organizaci\xF3n computacional Bebras para 4to."
  },
  {
    id: "kh-bebras-4-4",
    title: "Bebras (4to - Secci\xF3n 4)",
    url: "https://create.kahoot.it/share/bebras-4to-4/f8910ab7-e79a-4ea2-bb7f-297214d34e4a",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Ex\xE1menes l\xF3gicos secuenciales para evaluaci\xF3n inicial de resoluci\xF3n de problemas."
  },
  {
    id: "kh-bebras-4-5",
    title: "Bebras (4to - Secci\xF3n 5)",
    url: "https://create.kahoot.it/share/bebras-4to-5/327120e6-ed89-40db-82c0-75ca4d266e74",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Prueba conceptual de pensamiento l\xF3gico estructurado."
  },
  {
    id: "kh-mision-robot",
    title: "Misi\xF3n Robot: Mi Primera Aventura",
    url: "https://create.kahoot.it/share/mision-robot-mi-primera-aventura/edf2bb2d-7732-454f-9502-5443efe6149e",
    tool: "Kahoot",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Kahoot ultra sencillo de bienvenida para los m\xE1s chicos de la academia."
  },
  {
    id: "kh-pensamiento-computacional",
    title: "Conceptos del Pensamiento Computacional",
    url: "https://create.kahoot.it/share/pensamiento-computacional/c0c294e3-5c9f-4fef-8ec3-4ab02fa630c1",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Evaluaci\xF3n r\xE1pida de conceptos como secuencia, condicional, bucle y paralelismo."
  },
  {
    id: "kh-bienvenidos-2026",
    title: "Bienvenidos Pixelitos (Grupo 2 y 5)",
    url: "https://create.kahoot.it/share/grupo-2-y-5-bienvenidos-pixelitos-2026/5cd7ebe3-c4ff-48b6-97b9-ebec9500ae5d",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Kahoot de reencuentro y motivaci\xF3n para comenzar el a\xF1o programando con todo."
  },
  {
    id: "kh-que-aprendimos-grupo-2-5",
    title: "\xBFQu\xE9 aprendimos? (Grupo 2 y 5)",
    url: "https://create.kahoot.it/share/grupo-2-y-5-bienvenidos-pixelitos-2026/cbe27fa0-9bb8-4e0e-a113-07678cc34da6",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Revisi\xF3n r\xE1pida de conocimientos pr\xE1cticos en programaci\xF3n."
  },
  {
    id: "kh-cierre-grupo-1-3-2025",
    title: "Cierre de Ciclo - \xBFCu\xE1nto Aprendimos? B\xE1sico",
    url: "https://create.kahoot.it/share/duplicado-de-cierre-de-ciclo-grupo-1-y-3-pixelitos-2025-cuanto-aprendimos/48b711e3-2c13-4ec9-b322-8cd252897bf1",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Preguntas sobre algoritmos, diferencia objeto/escenario, categor\xEDas de eventos, repetici\xF3n y apariencia."
  },
  {
    id: "kh-mini-pixelitos",
    title: "Mini Pixelitos",
    url: "https://create.kahoot.it/share/mini-pixelitos/92e32e9e-b39d-4f1b-8576-8fe5c2ecc69b",
    tool: "Kahoot",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Juego de preguntas interactivo con fotos sencillas para grupos peque\xF1os."
  },
  {
    id: "kh-cuanto-sabemos-scratch",
    title: "\xBFCu\xE1nto sabemos de Scratch?",
    url: "https://create.kahoot.it/share/cuanto-sabemos-de-scratch/58692b8f-9aa4-4282-9dcf-0fba2c490a1b",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Evaluaci\xF3n exhaustiva de los bloques de Scratch para los alumnos de nivel intermedio."
  },
  {
    id: "kh-show-programado-1",
    title: "Nuestro Show Programado (Nivel 1)",
    url: "https://create.kahoot.it/share/duplicado-de-nuestro-show-programado/1e566425-6139-4022-9724-84e01469e54f",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Reconocer categor\xEDas como Eventos, Apariencia, Movimiento y dos divertidos acertijos l\xF3gicos."
  },
  {
    id: "kh-operadores-variables",
    title: "Operadores y Variables (Nivel 2)",
    url: "https://create.kahoot.it/share/pixelitos/586b987a-dd55-4b31-92f8-1d8c040cf811",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "L\xF3gica matem\xE1tica de operadores de comparaci\xF3n y variables de control en Scratch."
  },
  {
    id: "kh-clones-murcielago",
    title: "Clones Murci\xE9lago Trivia",
    url: "https://create.kahoot.it/share/cuanto-aprendimos-del-proyecto-clones/c0ffad67-0e40-40de-8bf8-3518a0813373",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Examen de comprensi\xF3n conceptual sobre el proyecto de clones de murci\xE9lago."
  },
  {
    id: "kh-arkanoid-simple",
    title: "Arkanoid Simple (Sin Clones)",
    url: "https://create.kahoot.it/share/arkanoid-simple-sin-clones-pixelitos/9b7958dd-7065-489a-a706-c8cef0e7396c",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Conceptos de colisi\xF3n, rebote de \xE1ngulo y coordenadas cartesianas b\xE1sicas en Arkanoid."
  },
  {
    id: "kh-arkanoid-clones",
    title: "Arkanoid con Clones",
    url: "https://create.kahoot.it/share/arkanoid-con-clones-pixelitos/afb9a614-c0dc-4ae6-9be4-dcbc545a8cec",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Trivia avanzada sobre c\xF3mo romper m\xFAltiples ladrillos representados como clones din\xE1micos."
  },
  {
    id: "kh-esquivar-autos-trivia",
    title: "\xBFQu\xE9 aprendimos de Scratch? (Esquivar Autos)",
    url: "https://create.kahoot.it/share/que-hemos-aprendido-de-scratch/8a598906-1203-43ff-a46b-662410e99d22",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Trivia r\xE1pida sobre scroll de fondo continuo y l\xF3gicas de velocidad acumulativa."
  },
  {
    id: "kh-clones-con-guille",
    title: "Clones con pregunta sorpresa de Guille",
    url: "https://create.kahoot.it/share/cuanto-aprendimos-del-proyecto-clones/2e75a7aa-e5e6-47ef-83e2-7ca3a29297c4",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Edici\xF3n especial de clones con preguntas personalizadas del coordinador Guille para el Grupo 1."
  },
  {
    id: "kh-robin-hood-guille",
    title: "Robin Hood (Con preguntas de Guille, Lauti y Nico)",
    url: "https://create.kahoot.it/share/nuestro-show-programado-2/b7b1a934-d625-4278-8354-f763aa7205b3",
    tool: "Kahoot",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Kahoot modificado por profes en Rivadavia para el juego de Robin Hood."
  },
  {
    id: "kh-cazatopos-trivia",
    title: "\xBFCu\xE1nto aprendimos programando Caza Topos?",
    url: "https://create.kahoot.it/share/cuanto-aprendimos-programando-caza-topos/b55dc15b-e559-40ca-98c0-5b4a04b1a049",
    tool: "Kahoot",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Conceptos de temporizador, aumento de puntaje al tocar objeto y velocidad."
  },
  {
    id: "kh-aventura-galactica-trivia",
    title: "\xBFCu\xE1nto aprendimos de Aventura Gal\xE1ctica?",
    url: "https://create.kahoot.it/share/cuanto-aprendimos-programando-aventura-galactica/1974d674-c89f-41dc-a2b2-0c350f21cb82",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Trivia sobre variables complejas de vida, puntaje m\xE1ximo y comportamiento de asteroides."
  },
  {
    id: "kh-aventura-mar-nico",
    title: "Aventura bajo el mar (Con pregunta de Nico)",
    url: "https://create.kahoot.it/share/aventura-en-el-mar/c4f1c004-7953-4f69-a276-bfbc407eecda",
    tool: "Kahoot",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Trivia con aporte especial de los profes de la sede Rivadavia."
  },
  {
    id: "kh-microbit-mascota",
    title: "Micro:bit Mascota y Conceptos B\xE1sicos",
    url: "https://create.kahoot.it/share/micro-bit-and-makecode-basics/ff9799e3-8e95-47c6-91e9-c0e8488e4197",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Preguntas b\xE1sicas sobre la placa f\xEDsica Micro:bit y el entorno de bloques de MakeCode."
  },
  {
    id: "kh-microbit-intro",
    title: "Introducci\xF3n a la Placa Micro:bit",
    url: "https://create.kahoot.it/details/913bfe0d-52ba-4944-b676-7240a14b7454",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Conocer los sensores de luz, temperatura, botones y pantalla de la placa f\xEDsica."
  },
  {
    id: "kh-roblox-lua-diagnostico",
    title: "\xBFCu\xE1nto aprendimos de Roblox Studio? (Lua)",
    url: "https://create.kahoot.it/details/d707f51f-03b0-43cd-a291-b32fde094de6",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Conceptos de programaci\xF3n Lua para 2do a\xF1o de Roblox Studio (propiedades, scripts de partes)."
  },
  {
    id: "kh-roblox-fio",
    title: "Roblox Studio B\xE1sico (Fio)",
    url: "https://create.kahoot.it/details/roblox-studio-1/08200d89-5ad4-4019-a69f-e309e0b3147a?drawer=",
    editorUrl: "https://create.kahoot.it/details/ca803b21-91d4-408e-a0f8-4b583987f3f6",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Trivia introductoria sobre el explorador, la caja de herramientas y las partes f\xEDsicas."
  },
  {
    id: "kh-roblox-antu",
    title: "\xBFCu\xE1nto sabemos de Roblox Studio? (Antu)",
    url: "https://create.kahoot.it/share/cuanto-sabemos-de-roblox-studio/a0619463-e006-4c00-a739-670d1bcd8c6a",
    tool: "Kahoot",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Preguntas de scripting b\xE1sico en Lua para consolidar el conocimiento del motor 3D."
  },
  {
    id: "kh-cierre-2025-practica",
    title: "Pr\xE1ctica Cierre de Ciclo 2025",
    url: "https://create.kahoot.it/share/cierre-de-ciclo-pixelitos-2025-cuanto-aprendimos/54156ff2-0c01-45b4-92ac-37d988cbc97d",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Prueba de ensayo para que los chicos practiquen antes del examen final."
  },
  {
    id: "kh-cierre-2025-oficial",
    title: "Cierre de Ciclo 2025 (Examen Oficial)",
    url: "https://create.kahoot.it/share/cierre-de-ciclo-pixelitos-2025-cuanto-aprendimos/f23b35c6-f80f-428a-a6cf-9be74c75bcf5",
    tool: "Kahoot",
    ageGroup: "Cierre y Diagn\xF3sticos",
    description: "Examen de evaluaci\xF3n integradora para cerrar las clases de fin de a\xF1o."
  },
  // TYNKER
  {
    id: "tk-flappy",
    title: "Flappy Bird Tynker",
    url: "https://www.tynker.com/play/flappybird-v1/684092ba2addb174d66d6572-435431XlelK2d1QnDuxNfWf3EHs1gk",
    tool: "Tynker",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Clon interactivo de Flappy Bird en Tynker para entender gravedad y control de saltos."
  },
  {
    id: "tk-carreras",
    title: "Carreras de Autos",
    url: "https://www.tynker.com/play/carreras/684996140235445edc1e3cdc-807998XhGQ23GSWTfRbVGwNdUxia0k",
    tool: "Tynker",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Juego de conducci\xF3n vertical controlando el auto con flechas direccionales."
  },
  {
    id: "tk-tanque-nave",
    title: "Tanque vs Nave Espacial",
    url: "https://www.tynker.com/play/nave-vs-tanque/6866ce237d262336501c99c2-492242XryEELoCjrYuP7oUfX.SWmMk",
    tool: "Tynker",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Duelo competitivo de disparos bal\xEDsticos entre tierra y aire."
  },
  // MICRO:BIT
  {
    id: "mb-radio-mensaje",
    title: "Mensaje de Radio Personalizado",
    url: "https://makecode.microbit.org/_b0uJ370mkagd",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Env\xEDo de mensajes escritos a trav\xE9s de las antenas de radio incorporadas de la placa."
  },
  {
    id: "mb-radio-numeros",
    title: "Mensajes Num\xE9ricos por Radio",
    url: "https://makecode.microbit.org/_TKPes92vc4MA",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Transmisi\xF3n de coordenadas e indicadores num\xE9ricos mediante radiofrecuencia."
  },
  {
    id: "mb-metegol",
    title: "Metegol Digital",
    url: "https://makecode.microbit.org/_fscbi7i3rRXo",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Marcador interactivo de goles utilizando el pulsador f\xEDsico o sensores de colisi\xF3n."
  },
  {
    id: "mb-mascota",
    title: "Mascota Virtual (Tamagotchi)",
    url: "https://makecode.microbit.org/_iuVJjX3urU3y",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Programaci\xF3n de una mascota pixelada que pide comida y reacciona al movimiento."
  },
  {
    id: "mb-ppt-simple",
    title: "Piedra, Papel o Tijera",
    url: "https://makecode.microbit.org/_fscbi7i3rRXo",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Muestra opciones aleatorias de juego usando el aceler\xF3metro al agitar la microbit."
  },
  {
    id: "mb-ppt-radio",
    title: "Piedra, Papel o Tijera por Radio",
    url: "https://makecode.microbit.org/_a0W73wbuLPHz",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Duelo multijugador enviando la jugada encriptada por radio a la microbit del compa\xF1ero."
  },
  {
    id: "mb-brujula",
    title: "Br\xFAjula Inteligente",
    url: "https://makecode.microbit.org/_fzJP5AdzfPxP",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Uso del magnet\xF3metro de la placa para orientar un puntero LED hacia el Norte magn\xE9tico."
  },
  {
    id: "mb-calculadora-simple",
    title: "Calculadora de Botones",
    url: "https://makecode.microbit.org/_edqLF9Y6p2Kx",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Suma sencilla utilizando los botones A y B para ingresar d\xEDgitos."
  },
  {
    id: "mb-calculadora-funciones",
    title: "Calculadora con Funciones",
    url: "https://makecode.microbit.org/_erhg053mHh1A",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Calculadora estructurada en MakeCode utilizando bloques de funciones matem\xE1ticas reutilizables."
  },
  {
    id: "mb-calculadora-aleatoria",
    title: "Calculadora Aleatoria",
    url: "https://makecode.microbit.org/_TWD7rbAgT79E",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Generaci\xF3n aleatoria de cuentas de suma y resta para que el alumno resuelva en pantalla."
  },
  {
    id: "mb-radio-aleatorio",
    title: "Radio Mensaje Aleatorio",
    url: "https://makecode.microbit.org/_iHAH2FJg31fC",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Env\xEDo aleatorio de respuestas c\xF3micas o m\xE1gicas al presionar los botones."
  },
  {
    id: "mb-papa-caliente",
    title: "Papa Caliente por Radio (Corregido)",
    url: "https://makecode.microbit.org/_0jAAqghgq9Hd",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Un temporizador de bomba viaja por radio. El que tenga la bomba cuando suena pierde."
  },
  {
    id: "mb-codigo-secreto",
    title: "C\xF3digo Secreto (Caja Fuerte)",
    url: "https://makecode.microbit.org/_br9LehHxaXgV",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Desbloquea la placa ingresando una combinaci\xF3n secreta exacta de botones (ej: A+B, A, B)."
  },
  {
    id: "mb-pingpong-simple",
    title: "Ping-Pong por Radio (Sin Contador)",
    url: "https://makecode.microbit.org/S19028-84133-43116-90943",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Juego de tenis virtual de dos pantallas. Una persona empieza con la pelotita y la pasa por radio."
  },
  {
    id: "mb-pingpong-contador",
    title: "Ping-Pong por Radio (Con Contador)",
    url: "https://makecode.microbit.org/S35645-63120-69957-24163",
    tool: "Micro:bit",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "La versi\xF3n competitiva de ping pong con guardado e incremento de goles de cada jugador."
  },
  // CODE.ORG
  {
    id: "co-dino-ra",
    title: "Dino RA (Realidad Aumentada)",
    url: "https://scratch.mit.edu/projects/937430805",
    tool: "Code.org",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Actividad introductoria de realidad aumentada donde dinosaurios interact\xFAan con letras pintadas."
  },
  {
    id: "co-drag-drop",
    title: "Pr\xE1ctica de Arrastrar y Soltar",
    url: "https://studio.code.org/s/coursea-2022/lessons/2/levels/1",
    tool: "Code.org",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Primera clase de Pixelitos de 6 a 8 a\xF1os: aprender a manipular el mouse y encastrar bloques."
  },
  {
    id: "co-angry-birds",
    title: "Secuencias con Angry Birds",
    url: "https://studio.code.org/s/courseb-2021?section_id=5870775",
    tool: "Code.org",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Mover al pajarito rojo hacia el cerdito verde para ejercitar la orientaci\xF3n direccional."
  },
  {
    id: "co-minecraft-acuatico",
    title: "Minecraft: Viaje Acu\xE1tico",
    url: "https://studio.code.org/s/aquatic/lessons/1",
    tool: "Code.org",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Encontrar cofres del tesoro programando a Steve o Alex bajo el agua."
  },
  {
    id: "co-minecraft-heroe",
    title: "Minecraft: Viaje del H\xE9roe",
    url: "https://studio.code.org/s/hero/lessons/1",
    tool: "Code.org",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Completar acertijos de laberinto en Minecraft automatizando caminos con palancas."
  },
  {
    id: "co-music-lab",
    title: "Code.org Music Lab",
    url: "https://studio.code.org/courses/music-tutorial-2024/units/1/lessons/1/levels/1?login_required=true",
    tool: "Code.org",
    ageGroup: "Todos / General",
    description: "Novedosa herramienta de mezcla y programaci\xF3n musical interactiva mediante bucles de compases."
  },
  {
    id: "co-bucles-cosechadora",
    title: "Bucles con la Cosechadora",
    url: "https://studio.code.org/s/courseb-2021/lessons/7/levels/1",
    tool: "Code.org",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: 'Introducci\xF3n del bloque de bucle "Repetir X veces" para recolectar calabazas eficientemente.'
  },
  {
    id: "co-scrat-secuencias",
    title: "Secuencias de Hielo con Scrat",
    url: "https://studio.code.org/s/coursea-2022/lessons/5/levels/2",
    tool: "Code.org",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Ayuda a la ardilla de La Era de Hielo a conseguir su bellota evitando zonas peligrosas."
  },
  {
    id: "co-desafio-artista",
    title: "Desaf\xEDos de Geometr\xEDa del Artista",
    url: "https://studio.code.org/s/coursea-2022/lessons/10/levels/2",
    tool: "Code.org",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Trazar l\xEDneas, cuadrados y formas geom\xE9tricas b\xE1sicas usando bloques de movimiento de l\xE1piz."
  },
  {
    id: "co-play-lab",
    title: "Mini Proyecto Play Lab",
    url: "https://studio.code.org/s/coursea-2022/lessons/12/levels/4",
    tool: "Code.org",
    ageGroup: "Peque\xF1os (1\xB0 1 / 7-8 a\xF1os)",
    description: "Creaci\xF3n libre de historias animadas con di\xE1logos y colisiones entre duendes."
  },
  // RECURSOS Y GUÍAS (DOCENTES)
  {
    id: "rc-drive-no-presenciales",
    title: "Google Drive - Clases No Presenciales",
    url: "https://drive.google.com/drive/u/0/folders/13XHC5tSe7un5o1DbopMI1j3Dkm_WNWiT",
    tool: "Recursos y Gu\xEDas",
    ageGroup: "Todos / General",
    description: "Soporte oficial y materiales de planificaci\xF3n docente para dictado de clases no presenciales."
  },
  {
    id: "rc-canva-prompts",
    title: "Canva - Gu\xEDa de Prompts de IA",
    url: "https://canva.link/su36g0h51a6jti5",
    tool: "Recursos y Gu\xEDas",
    ageGroup: "Todos / General",
    description: "Presentaci\xF3n pedag\xF3gica sobre qu\xE9 es un prompt de Inteligencia Artificial para los alumnos."
  },
  {
    id: "rc-ideogram-explore",
    title: "Ideogram Explore (Inspiraci\xF3n IA)",
    url: "https://ideogram.ai/t/explore",
    tool: "Recursos y Gu\xEDas",
    ageGroup: "Medianos (8-12 a\xF1os)",
    description: "Cat\xE1logo de im\xE1genes creadas con IA para que los chicos exploren y busquen fondos de videojuegos."
  },
  {
    id: "rc-yt-roblox-1",
    title: "Roblox Lua: Primeros Pasos y Modelaci\xF3n (Youtube)",
    url: "https://www.youtube.com/playlist?list=PLmydFO9iFHxtDJ-KclV_vz9wyTrW61pfW",
    tool: "Recursos y Gu\xEDas",
    ageGroup: "Todos / General",
    description: "Playlist inicial: creaci\xF3n de usuario en Roblox, modelado b\xE1sico de bloques y interfaz."
  },
  {
    id: "rc-yt-roblox-2",
    title: "Roblox Lua: Scripting desde Cero (Youtube)",
    url: "https://www.youtube.com/playlist?list=PL14SLYIw8Yncstv8IrGNsiNBaN1Qj60Wr",
    tool: "Recursos y Gu\xEDas",
    ageGroup: "Todos / General",
    description: "Playlist de programaci\xF3n de scripts Lua (eventos Touch, trampas que matan, spawn de monedas)."
  }
];

// server.ts
import_dotenv.default.config();
var PORT = Number(process.env.PORT) || 3e3;
function resolveDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || "";
}
function createSqlClient(connectionString) {
  return (0, import_postgres.default)(connectionString, {
    ssl: "require",
    prepare: false,
    max: process.env.VERCEL ? 1 : 10,
    idle_timeout: 20,
    connect_timeout: 15,
    onnotice: () => {
    }
  });
}
async function startServer() {
  const app = (0, import_express.default)();
  app.use(import_express.default.json());
  const DATABASE_URL = resolveDatabaseUrl();
  if (!DATABASE_URL) {
    console.error(
      "CRITICAL ERROR: DATABASE_URL (or POSTGRES_URL) is not defined in environment."
    );
    process.exit(1);
  }
  const sql = createSqlClient(DATABASE_URL);
  async function initDb() {
    console.log("Initializing Neon Database...");
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS students (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          level TEXT NOT NULL,
          username TEXT NOT NULL,
          password TEXT,
          notes TEXT
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS teachers (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          password TEXT,
          notes TEXT
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS materials (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          url TEXT NOT NULL,
          tool TEXT NOT NULL,
          age_group TEXT NOT NULL,
          description TEXT,
          editor_url TEXT,
          is_favorite BOOLEAN DEFAULT FALSE,
          is_new BOOLEAN DEFAULT FALSE,
          notes TEXT,
          date_added TEXT,
          level TEXT,
          age_range TEXT,
          difficulty TEXT
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS class_plans (
          id TEXT PRIMARY KEY,
          month TEXT NOT NULL,
          target_group TEXT NOT NULL,
          objectives TEXT NOT NULL,
          level TEXT,
          class_ids JSONB DEFAULT '[]'::jsonb,
          realized_class_ids JSONB DEFAULT '[]'::jsonb
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS bulletins (
          id TEXT PRIMARY KEY,
          author TEXT NOT NULL,
          content TEXT NOT NULL,
          color TEXT,
          date TEXT NOT NULL
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS resources (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          url TEXT NOT NULL,
          description TEXT
        )
      `;
      await sql`
        CREATE TABLE IF NOT EXISTS accounts (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          type TEXT NOT NULL,
          platform TEXT NOT NULL,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          notes TEXT,
          level TEXT
        )
      `;
      console.log("Tables validated / created successfully.");
      const studentCountResult = await sql`SELECT count(*)::int as count FROM students`;
      if (studentCountResult[0].count === 0) {
        console.log("Seeding default students...");
        const DEFAULT_STUDENTS = [
          {
            id: "std-1",
            name: "Mateo Gonz\xE1lez",
            level: "1\xB01\xB0",
            username: "mateo_gonzalez_px",
            password: "mateo123",
            notes: "Asiste los lunes 18hs. Le encantan los proyectos de Scratch de laberintos."
          },
          {
            id: "std-2",
            name: "Sof\xEDa Mart\xEDnez",
            level: "1\xB02\xB0",
            username: "sofia_martinez_px",
            password: "sofia123",
            notes: "Tiene buen manejo del mouse, pasa r\xE1pido a desaf\xEDos intermedios."
          },
          {
            id: "std-3",
            name: "Thiago Ben\xEDtez",
            level: "2\xB01\xB0",
            username: "thiago_benitez_px",
            password: "thiago123",
            notes: "Interesado en rob\xF3tica anal\xF3gica con Micro:bit."
          },
          {
            id: "std-4",
            name: "Valentina Rodr\xEDguez",
            level: "2\xB02\xB0",
            username: "valentina_rodriguez_px",
            password: "valen123",
            notes: "Nivel avanzado Roblox Studio. Gran capacidad de abstracci\xF3n."
          }
        ];
        for (const std of DEFAULT_STUDENTS) {
          await sql`
            INSERT INTO students (id, name, level, username, password, notes)
            VALUES (${std.id}, ${std.name}, ${std.level}, ${std.username}, ${std.password}, ${std.notes})
          `;
        }
      }
      const teacherCountResult = await sql`SELECT count(*)::int as count FROM teachers`;
      if (teacherCountResult[0].count === 0) {
        console.log("Seeding default teachers...");
        const DEFAULT_TEACHERS = [
          { id: "t-1", name: "Profesor Principal", password: "profe", notes: "Profesor titular del taller de rob\xF3tica." },
          { id: "t-2", name: "Profe Auxiliar", password: "profe2026", notes: "Asistente de Scratch y Pilas Bloques." }
        ];
        for (const t of DEFAULT_TEACHERS) {
          await sql`
            INSERT INTO teachers (id, name, password, notes)
            VALUES (${t.id}, ${t.name}, ${t.password}, ${t.notes})
          `;
        }
      }
      const materialCountResult = await sql`SELECT count(*)::int as count FROM materials`;
      if (materialCountResult[0].count === 0) {
        console.log("Seeding initial educational materials...");
        for (const m of INITIAL_MATERIALS) {
          await sql`
            INSERT INTO materials (
              id, title, url, tool, age_group, description, editor_url, 
              is_favorite, is_new, notes, date_added, level, age_range, difficulty
            ) VALUES (
              ${m.id}, ${m.title}, ${m.url}, ${m.tool}, ${m.ageGroup || "Todos / General"}, ${m.description || null}, ${m.editorUrl || null},
              ${m.isFavorite || false}, ${m.isNew || false}, ${m.notes || null}, ${m.dateAdded || null}, ${m.level || null},
              ${m.ageRange || null}, ${m.difficulty || null}
            )
          `;
        }
      }
      const accountCountResult = await sql`SELECT count(*)::int as count FROM accounts`;
      if (accountCountResult[0].count === 0) {
        console.log("Seeding default accounts...");
        const DEFAULT_ACCOUNTS = [
          {
            id: "acc-1",
            name: "Cuenta Profe Principal Scratch",
            type: "Profe",
            platform: "Scratch",
            username: "pixelitos_profes_2026",
            password: "PixelitosScratchPass!",
            notes: "Uso general para guardar plantillas de clase. \xA1Cuidado de no modificar los proyectos base!",
            level: null
          },
          {
            id: "acc-2",
            name: "Licencias Estudiantes Roblox Studio Nivel 2\xB02\xB0",
            type: "Alumno",
            platform: "Roblox",
            username: "pixelitos_estudiante_roblox_22",
            password: "RobloxStudent9921",
            notes: "Compartido para los chicos de Roblox del grupo de las 18hs.",
            level: "2\xB02%"
          }
        ];
        for (const acc of DEFAULT_ACCOUNTS) {
          await sql`
            INSERT INTO accounts (id, name, type, platform, username, password, notes, level)
            VALUES (${acc.id}, ${acc.name}, ${acc.type}, ${acc.platform}, ${acc.username}, ${acc.password}, ${acc.notes}, ${acc.level})
          `;
        }
      }
      const bulletinCountResult = await sql`SELECT count(*)::int as count FROM bulletins`;
      if (bulletinCountResult[0].count === 0) {
        console.log("Seeding default bulletins...");
        const DEFAULT_BULLETINS = [
          {
            id: "msg-1",
            author: "Guille (Coordinaci\xF3n)",
            text: '\xA1Hola profes! Recuerden que la cuenta compartida de Scratch es "profespixelitos" con contrase\xF1a "pixelitos123". \xA1No la cambien as\xED todos pueden entrar!',
            color: "yellow",
            date: "08/07/2026"
          },
          {
            id: "msg-2",
            author: "Antu (Profe)",
            text: 'El proyecto "Esquivar Autos" lo prob\xE9 con chicos de 10 a\xF1os y les encant\xF3. Tip: expl\xEDquenles primero c\xF3mo funciona el bloque de sumar a X/Y antes de arrancar.',
            color: "cyan",
            date: "07/07/2026"
          },
          {
            id: "msg-3",
            author: "Fio (Coordinaci\xF3n)",
            text: "\xA1Jefas! Ya organic\xE9 las carpetas de Drive para el material de soporte no presencial. Cualquier cosa me avisan si falta alg\xFAn PDF.",
            color: "pink",
            date: "05/07/2026"
          },
          {
            id: "msg-4",
            author: "Guille (Coordinaci\xF3n)",
            text: "Regla de Oro: En clase trabajemos siempre con copias de los proyectos originales. As\xED los preservamos limpios para las siguientes comisiones.",
            color: "green",
            date: "04/07/2026"
          }
        ];
        for (const b of DEFAULT_BULLETINS) {
          await sql`
            INSERT INTO bulletins (id, author, content, color, date)
            VALUES (${b.id}, ${b.author}, ${b.text}, ${b.color}, ${b.date})
          `;
        }
      }
      console.log("Database seeded successfully.");
    } catch (error) {
      console.error("Error during database initialization/seeding:", error);
      throw error;
    }
  }
  await initDb();
  app.get("/api/health", async (_req, res) => {
    try {
      await sql`SELECT 1`;
      res.json({ ok: true, database: "connected" });
    } catch (err) {
      res.status(503).json({ ok: false, database: "disconnected", error: err.message });
    }
  });
  function mapStudentFromDb(row) {
    return {
      id: row.id,
      name: row.name,
      level: row.level,
      username: row.username,
      password: row.password,
      notes: row.notes
    };
  }
  function mapTeacherFromDb(row) {
    return {
      id: row.id,
      name: row.name,
      password: row.password,
      notes: row.notes
    };
  }
  function mapMaterialFromDb(row) {
    return {
      id: row.id,
      title: row.title,
      url: row.url,
      tool: row.tool,
      ageGroup: row.age_group,
      description: row.description,
      editorUrl: row.editor_url,
      isFavorite: !!row.is_favorite,
      isNew: !!row.is_new,
      notes: row.notes,
      dateAdded: row.date_added,
      level: row.level,
      ageRange: row.age_range,
      difficulty: row.difficulty
    };
  }
  function mapPlanFromDb(row) {
    return {
      id: row.id,
      month: row.month,
      targetGroup: row.target_group,
      objectives: row.objectives,
      level: row.level,
      classIds: row.class_ids || [],
      realizedClassIds: row.realized_class_ids || []
    };
  }
  function mapBulletinFromDb(row) {
    return {
      id: row.id,
      author: row.author,
      text: row.content,
      color: row.color,
      date: row.date
    };
  }
  function mapResourceFromDb(row) {
    return {
      id: row.id,
      title: row.title,
      type: row.type,
      url: row.url,
      description: row.description
    };
  }
  function mapAccountFromDb(row) {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      platform: row.platform,
      username: row.username,
      password: row.password,
      notes: row.notes,
      level: row.level
    };
  }
  app.get("/api/students", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM students ORDER BY name ASC`;
      res.json(rows.map(mapStudentFromDb));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/students", async (req, res) => {
    try {
      const { id, name, level, username, password, notes } = req.body;
      await sql`
        INSERT INTO students (id, name, level, username, password, notes)
        VALUES (${id}, ${name}, ${level}, ${username}, ${password || null}, ${notes || null})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          level = EXCLUDED.level,
          username = EXCLUDED.username,
          password = EXCLUDED.password,
          notes = EXCLUDED.notes
      `;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/students/:id", async (req, res) => {
    try {
      await sql`DELETE FROM students WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/teachers", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM teachers ORDER BY name ASC`;
      res.json(rows.map(mapTeacherFromDb));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/teachers", async (req, res) => {
    try {
      const { id, name, password, notes } = req.body;
      await sql`
        INSERT INTO teachers (id, name, password, notes)
        VALUES (${id}, ${name}, ${password || null}, ${notes || null})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          password = EXCLUDED.password,
          notes = EXCLUDED.notes
      `;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/teachers/:id", async (req, res) => {
    try {
      await sql`DELETE FROM teachers WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/materials", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM materials ORDER BY title ASC`;
      res.json(rows.map(mapMaterialFromDb));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/materials", async (req, res) => {
    try {
      const m = req.body;
      await sql`
        INSERT INTO materials (
          id, title, url, tool, age_group, description, editor_url, 
          is_favorite, is_new, notes, date_added, level, age_range, difficulty
        ) VALUES (
          ${m.id}, ${m.title}, ${m.url}, ${m.tool}, ${m.ageGroup || "Todos / General"}, ${m.description || null}, ${m.editorUrl || null},
          ${m.isFavorite || false}, ${m.isNew || false}, ${m.notes || null}, ${m.dateAdded || null}, ${m.level || null},
          ${m.ageRange || null}, ${m.difficulty || null}
        ) ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          url = EXCLUDED.url,
          tool = EXCLUDED.tool,
          age_group = EXCLUDED.age_group,
          description = EXCLUDED.description,
          editor_url = EXCLUDED.editor_url,
          is_favorite = EXCLUDED.is_favorite,
          is_new = EXCLUDED.is_new,
          notes = EXCLUDED.notes,
          date_added = EXCLUDED.date_added,
          level = EXCLUDED.level,
          age_range = EXCLUDED.age_range,
          difficulty = EXCLUDED.difficulty
      `;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/materials/batch", async (req, res) => {
    try {
      const { materials } = req.body;
      if (!Array.isArray(materials)) {
        return res.status(400).json({ error: "materials must be an array" });
      }
      await sql.begin(async (sqlTrans) => {
        await sqlTrans`TRUNCATE TABLE materials`;
        for (const m of materials) {
          await sqlTrans`
            INSERT INTO materials (
              id, title, url, tool, age_group, description, editor_url, 
              is_favorite, is_new, notes, date_added, level, age_range, difficulty
            ) VALUES (
              ${m.id}, ${m.title}, ${m.url}, ${m.tool}, ${m.ageGroup || "Todos / General"}, ${m.description || null}, ${m.editorUrl || null},
              ${m.isFavorite || false}, ${m.isNew || false}, ${m.notes || null}, ${m.dateAdded || null}, ${m.level || null},
              ${m.ageRange || null}, ${m.difficulty || null}
            )
          `;
        }
      });
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/materials/:id", async (req, res) => {
    try {
      await sql`DELETE FROM materials WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/class-plans", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM class_plans ORDER BY month ASC`;
      res.json(rows.map(mapPlanFromDb));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/class-plans", async (req, res) => {
    try {
      const p = req.body;
      await sql`
        INSERT INTO class_plans (id, month, target_group, objectives, level, class_ids, realized_class_ids)
        VALUES (${p.id}, ${p.month}, ${p.targetGroup}, ${p.objectives}, ${p.level || null}, ${JSON.stringify(p.classIds || [])}, ${JSON.stringify(p.realizedClassIds || [])})
        ON CONFLICT (id) DO UPDATE SET
          month = EXCLUDED.month,
          target_group = EXCLUDED.target_group,
          objectives = EXCLUDED.objectives,
          level = EXCLUDED.level,
          class_ids = EXCLUDED.class_ids,
          realized_class_ids = EXCLUDED.realized_class_ids
      `;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/class-plans/:id", async (req, res) => {
    try {
      await sql`DELETE FROM class_plans WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/bulletins", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM bulletins ORDER BY date DESC`;
      res.json(rows.map(mapBulletinFromDb));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/bulletins", async (req, res) => {
    try {
      const b = req.body;
      await sql`
        INSERT INTO bulletins (id, author, content, color, date)
        VALUES (${b.id}, ${b.author}, ${b.text}, ${b.color || null}, ${b.date})
        ON CONFLICT (id) DO UPDATE SET
          author = EXCLUDED.author,
          content = EXCLUDED.content,
          color = EXCLUDED.color,
          date = EXCLUDED.date
      `;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/bulletins/:id", async (req, res) => {
    try {
      await sql`DELETE FROM bulletins WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/resources", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM resources ORDER BY title ASC`;
      res.json(rows.map(mapResourceFromDb));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/resources", async (req, res) => {
    try {
      const r = req.body;
      await sql`
        INSERT INTO resources (id, title, type, url, description)
        VALUES (${r.id}, ${r.title}, ${r.type}, ${r.url}, ${r.description || null})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          type = EXCLUDED.type,
          url = EXCLUDED.url,
          description = EXCLUDED.description
      `;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/resources/:id", async (req, res) => {
    try {
      await sql`DELETE FROM resources WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.get("/api/accounts", async (req, res) => {
    try {
      const rows = await sql`SELECT * FROM accounts ORDER BY name ASC`;
      res.json(rows.map(mapAccountFromDb));
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.post("/api/accounts", async (req, res) => {
    try {
      const a = req.body;
      await sql`
        INSERT INTO accounts (id, name, type, platform, username, password, notes, level)
        VALUES (${a.id}, ${a.name}, ${a.type}, ${a.platform}, ${a.username}, ${a.password}, ${a.notes || null}, ${a.level || null})
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          type = EXCLUDED.type,
          platform = EXCLUDED.platform,
          username = EXCLUDED.username,
          password = EXCLUDED.password,
          notes = EXCLUDED.notes,
          level = EXCLUDED.level
      `;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      await sql`DELETE FROM accounts WHERE id = ${req.params.id}`;
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  return app;
}
var appPromise = startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
if (!process.env.VERCEL) {
  appPromise.then((app) => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  });
}
var server_default = appPromise;
//# sourceMappingURL=server.cjs.map
