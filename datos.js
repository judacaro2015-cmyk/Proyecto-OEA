"use strict";
/* ==========================================================
   AQUÍ SE LLENA TODO EL CONTENIDO.
   No necesitas tocar el resto del código: copia una unidad,
   cámbiale los textos y la web la muestra sola.
   ========================================================== */

const PROYECTO = {
  nombre: "[NOMBRE DEL PROYECTO]",
  frase: "Aprende tecnología simulando, jugando y resolviendo retos.",
  colegio: "Colegio OEA IED",
  area: "Tecnología e Informática",
  autor: "[Tu nombre]",
  universidad: "[Universidad]",
  anio: 2026,
  grados: [6, 7, 8, 9, 10, 11],   // grados que se muestran en la portada
  gradoPiloto: 9,                  // grado seleccionado al abrir la página
  historiaRetos: "Cada unidad termina con una misión. Si la superas, ganas una insignia y subes de nivel.",
  // Enlaces: pega aquí las direcciones de tus formularios (Google Forms, etc.)
  encuestaEstudiantes: "#docentes",
  encuestaDocentes: "#docentes",
  guiaDocente: "#docentes"
};

/* ----------------------------------------------------------
   UNIDADES
   Tipos de actividad disponibles en "practica":
     relacionar : { tipo, titulo, pares:[[izquierda, derecha], ...] }
     ordenar    : { tipo, titulo, pasos:[paso1, paso2, ...]  }  (en el orden CORRECTO)
     clasificar : { tipo, titulo, categorias:[...], items:[{t:"texto", c:indiceDeCategoria}, ...] }
     quiz       : { tipo, titulo, preguntas:[{p, opciones:[...], correcta:indice, explicacion}] }
   Simulaciones disponibles: "compuertas", "binario" (ver js/simulaciones.js)
   ---------------------------------------------------------- */
const UNIDADES = [
  {
    id: "compuertas-9",
    grado: 9,
    tema: "Electrónica digital",
    titulo: "Compuertas lógicas",
    objetivo: "Identificar las compuertas lógicas básicas y predecir su salida a partir de las entradas.",
    vocabulario: [
      { t: "Bit", d: "Unidad mínima de información: vale 0 o 1." },
      { t: "Compuerta lógica", d: "Circuito que decide una salida según sus entradas." },
      { t: "Tabla de verdad", d: "Lista de todas las entradas posibles y su salida." }
    ],
    explora: {
      tiempo: "~3 min",
      texto: [
        "Los computadores toman decisiones con señales de dos valores: 1 (encendido) y 0 (apagado).",
        "Una compuerta lógica recibe una o dos entradas y entrega una salida según una regla.",
        "AND: la salida es 1 solo si todas las entradas son 1. OR: la salida es 1 si al menos una entrada es 1. NOT: invierte el valor de la entrada."
      ],
      instrucciones: ["Lee las tres ideas.", "Fíjate en la regla de cada compuerta.", "Cuando estés listo, pasa a Simula."]
    },
    simulacion: {
      id: "compuertas",
      nombre: "Simulador de compuertas",
      descripcion: "Cambia las entradas y mira cómo responde cada compuerta.",
      tiempo: "~10 min",
      instrucciones: [
        "Elige una compuerta.",
        "Activa o desactiva los interruptores A y B.",
        "Observa el LED y la fila resaltada de la tabla de verdad."
      ],
      pista: "Si la salida te sorprende, vuelve a Explora y revisa la regla de esa compuerta.",
      observar: "¿Con qué combinación de A y B se enciende el LED en AND? ¿Y en OR?"
    },
    practica: {
      tiempo: "~10 min",
      instrucciones: ["Resuelve las actividades en cualquier orden.", "Cuando todas estén correctas, el paso se completa."],
      pista: "Puedes volver a la simulación para comprobar una respuesta.",
      actividades: [
        {
          tipo: "relacionar",
          titulo: "Relaciona cada compuerta con su regla",
          pares: [
            ["AND", "Salida 1 solo si todas las entradas son 1"],
            ["OR", "Salida 1 si al menos una entrada es 1"],
            ["NOT", "Invierte el valor de la entrada"],
            ["XOR", "Salida 1 si las entradas son diferentes"]
          ]
        },
        {
          tipo: "clasificar",
          titulo: "¿La salida es 1 o es 0?",
          categorias: ["Salida 1", "Salida 0"],
          items: [
            { t: "AND con A=1, B=1", c: 0 },
            { t: "AND con A=1, B=0", c: 1 },
            { t: "OR con A=0, B=1", c: 0 },
            { t: "NOT con A=1", c: 1 },
            { t: "XOR con A=1, B=1", c: 1 },
            { t: "NOR con A=0, B=0", c: 0 }
          ]
        }
      ]
    },
    reta: {
      tiempo: "~5 min",
      titulo: "Reta: elige la compuerta correcta",
      historia: "Eres el ingeniero de un sistema de seguridad. Para cada situación, escoge la compuerta que resuelve el problema.",
      instrucciones: ["Responde las 3 preguntas.", "Necesitas al menos 2 aciertos para ganar la insignia."],
      pista: "Piensa en la regla de cada compuerta y en cuántas entradas deben activarse.",
      minimo: 2,
      insignia: "Maestro de compuertas",
      preguntas: [
        {
          p: "La alarma debe sonar si el sensor de la puerta (A) O el de la ventana (B) detecta movimiento. ¿Qué compuerta usas?",
          opciones: ["AND", "OR", "NOT"], correcta: 1,
          explicacion: "OR da 1 cuando al menos una entrada vale 1."
        },
        {
          p: "Una máquina solo debe arrancar si el operario presiona los DOS botones a la vez. ¿Qué compuerta usas?",
          opciones: ["OR", "XOR", "AND"], correcta: 2,
          explicacion: "AND exige que todas las entradas sean 1."
        },
        {
          p: "¿Cuál es la salida de una compuerta NAND con A=1 y B=1?",
          opciones: ["0", "1", "Depende del voltaje"], correcta: 0,
          explicacion: "NAND es el opuesto de AND: AND da 1, entonces NAND da 0."
        }
      ]
    }
  },

  {
    id: "binario-8",
    grado: 8,
    tema: "Sistemas de numeración",
    titulo: "Números binarios",
    objetivo: "Convertir números binarios de 4 bits a decimal usando el valor posicional.",
    vocabulario: [
      { t: "Bit", d: "Cada dígito de un número binario (0 o 1)." },
      { t: "Valor posicional", d: "Lo que vale un dígito según el lugar que ocupa." },
      { t: "Decimal", d: "El sistema de 10 dígitos que usamos a diario." }
    ],
    explora: {
      tiempo: "~3 min",
      texto: [
        "El sistema binario usa solo dos dígitos: 0 y 1. Cada posición vale el doble que la de su derecha: 1, 2, 4, 8.",
        "Para pasar a decimal se suman los valores de las posiciones que están en 1. Por ejemplo, 1010 es 8 + 2 = 10."
      ],
      instrucciones: ["Lee las dos ideas.", "Prueba mentalmente con 0011."]
    },
    simulacion: {
      id: "binario",
      nombre: "Contador binario de 4 bits",
      descripcion: "Enciende y apaga bits y mira qué número decimal forman.",
      tiempo: "~10 min",
      instrucciones: ["Pulsa los bits para cambiarlos entre 0 y 1.", "Mira la suma que se forma debajo.", "Intenta formar el 9 y el 15."],
      pista: "Recuerda: cada bit vale 8, 4, 2 o 1 de izquierda a derecha.",
      observar: "¿Cuál es el número más grande que puedes formar con 4 bits?"
    },
    practica: {
      tiempo: "~10 min",
      instrucciones: ["Resuelve las dos actividades."],
      pista: "Apóyate en los valores 8, 4, 2, 1.",
      actividades: [
        {
          tipo: "relacionar",
          titulo: "Une cada binario con su decimal",
          pares: [["0101", "5"], ["0011", "3"], ["1000", "8"], ["1111", "15"]]
        },
        {
          tipo: "ordenar",
          titulo: "Ordena los pasos para convertir 0110 a decimal",
          pasos: [
            "Escribe el valor de cada posición: 8, 4, 2, 1",
            "Marca las posiciones que están en 1",
            "Suma los valores marcados (4 + 2)",
            "El resultado es 6"
          ]
        }
      ]
    },
    reta: {
      tiempo: "~5 min",
      titulo: "Reta: traduce el mensaje",
      historia: "Un robot te envía números en binario. Tradúcelos para entenderlo.",
      instrucciones: ["Responde las 3 preguntas.", "Necesitas al menos 2 aciertos."],
      pista: "Suma solo las posiciones que están en 1.",
      minimo: 2,
      insignia: "Traductor binario",
      preguntas: [
        { p: "¿Qué número decimal es 1001?", opciones: ["7", "9", "11"], correcta: 1, explicacion: "8 + 1 = 9." },
        { p: "¿Cuál es el mayor número que se puede escribir con 4 bits?", opciones: ["8", "15", "16"], correcta: 1, explicacion: "1111 = 8 + 4 + 2 + 1 = 15." },
        { p: "¿Cuánto vale 0111?", opciones: ["7", "6", "8"], correcta: 0, explicacion: "4 + 2 + 1 = 7." }
      ]
    }
  }
];
