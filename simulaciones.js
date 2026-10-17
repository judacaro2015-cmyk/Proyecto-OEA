"use strict";
/* Simulaciones. Cada una tiene montar(contenedor, ctx).
   ctx.interaccion() se llama cada vez que el estudiante hace algo;
   con 3 interacciones el paso "Simula" se marca como completado.
   Para agregar una: SIMULACIONES.miSim = { montar(c, ctx){ ... } }
   y úsala en datos.js con simulacion: { id: "miSim", ... } */
const SIMULACIONES = {};

(function () {
  const NS = "http://www.w3.org/2000/svg";
  function s(tag, attrs, texto) {
    const el = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs || {})) el.setAttribute(k, v);
    if (texto !== undefined) el.textContent = texto;
    return el;
  }

  /* ---------- Compuertas lógicas ---------- */
  const COMPUERTAS = {
    AND:  (a, b) => a & b,
    OR:   (a, b) => a | b,
    NOT:  (a) => 1 - a,
    NAND: (a, b) => 1 - (a & b),
    NOR:  (a, b) => 1 - (a | b),
    XOR:  (a, b) => a ^ b
  };

  SIMULACIONES.compuertas = {
    montar(cont, ctx) {
      const est = { g: "AND", a: 0, b: 0 };
      const ENC = "#F5A524", APAG = "#8A94A8";

      const grupo = h("div", { class: "sim-grupo", role: "group", "aria-label": "Compuerta" });
      Object.keys(COMPUERTAS).forEach(nombre => {
        grupo.append(h("button", {
          type: "button", "aria-pressed": String(nombre === est.g), "data-g": nombre,
          onclick: () => { est.g = nombre; ctx.interaccion(); pintar(); }
        }, nombre));
      });

      const btnA = h("button", { type: "button", class: "interruptor", "aria-pressed": "false", onclick: () => { est.a = 1 - est.a; ctx.interaccion(); pintar(); } });
      const btnB = h("button", { type: "button", class: "interruptor", "aria-pressed": "false", onclick: () => { est.b = 1 - est.b; ctx.interaccion(); pintar(); } });
      const controles = h("div", { class: "sim-controles" },
        h("span", { text: "Entrada A:" }), btnA, h("span", { text: "Entrada B:" }), btnB);

      const svg = s("svg", { viewBox: "0 0 600 260", class: "sim-svg", role: "img", "aria-label": "Circuito con la compuerta seleccionada" });
      const tabla = h("table", { class: "tabla-v" });
      const nota = h("p", { class: "sim-nota", "aria-live": "polite" });

      function pintar() {
        const unaEntrada = est.g === "NOT";
        const salida = unaEntrada ? COMPUERTAS.NOT(est.a) : COMPUERTAS[est.g](est.a, est.b);

        grupo.querySelectorAll("button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.g === est.g)));
        btnA.textContent = String(est.a); btnA.setAttribute("aria-pressed", String(!!est.a));
        btnB.textContent = String(est.b); btnB.setAttribute("aria-pressed", String(!!est.b));
        btnB.disabled = unaEntrada;

        // Dibujo
        svg.replaceChildren();
        const col = v => (v ? ENC : APAG);
        if (unaEntrada) {
          svg.append(s("line", { x1: 40, y1: 130, x2: 220, y2: 130, stroke: col(est.a), "stroke-width": 8, "stroke-linecap": "round" }));
          svg.append(s("text", { x: 20, y: 136, "font-size": 22, "font-weight": 700, fill: "#1B2740" }, "A"));
        } else {
          svg.append(s("line", { x1: 40, y1: 90, x2: 220, y2: 90, stroke: col(est.a), "stroke-width": 8, "stroke-linecap": "round" }));
          svg.append(s("line", { x1: 40, y1: 170, x2: 220, y2: 170, stroke: col(est.b), "stroke-width": 8, "stroke-linecap": "round" }));
          svg.append(s("text", { x: 20, y: 96, "font-size": 22, "font-weight": 700, fill: "#1B2740" }, "A"));
          svg.append(s("text", { x: 20, y: 176, "font-size": 22, "font-weight": 700, fill: "#1B2740" }, "B"));
        }
        svg.append(s("rect", { x: 220, y: 50, width: 160, height: 160, rx: 16, fill: "#12203A" }));
        svg.append(s("text", { x: 300, y: 140, "text-anchor": "middle", "font-size": 34, "font-weight": 800, fill: "#FFFFFF" }, est.g));
        svg.append(s("line", { x1: 380, y1: 130, x2: 470, y2: 130, stroke: col(salida), "stroke-width": 8, "stroke-linecap": "round" }));
        svg.append(s("circle", { cx: 520, cy: 130, r: 34, fill: salida ? ENC : "#E3E7F0", stroke: "#12203A", "stroke-width": 4 }));
        svg.append(s("text", { x: 520, y: 138, "text-anchor": "middle", "font-size": 24, "font-weight": 800, fill: "#12203A" }, String(salida)));
        svg.append(s("text", { x: 520, y: 190, "text-anchor": "middle", "font-size": 16, fill: "#4A5873" }, "LED (salida)"));

        // Tabla de verdad
        const filas = unaEntrada ? [[0], [1]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
        const enc = unaEntrada ? ["A", "Salida"] : ["A", "B", "Salida"];
        tabla.replaceChildren(
          h("thead", {}, h("tr", {}, enc.map(t => h("th", { scope: "col", text: t })))),
          h("tbody", {}, filas.map(f => {
            const sal = unaEntrada ? COMPUERTAS.NOT(f[0]) : COMPUERTAS[est.g](f[0], f[1]);
            const actual = unaEntrada ? f[0] === est.a : (f[0] === est.a && f[1] === est.b);
            return h("tr", { class: actual ? "actual" : "" }, f.concat([sal]).map(v => h("td", { text: String(v) })));
          })));

        nota.textContent = unaEntrada
          ? "NOT con A=" + est.a + " da " + salida + "."
          : est.g + " con A=" + est.a + " y B=" + est.b + " da " + salida + ".";
      }

      cont.append(grupo, controles, svg, tabla, nota);
      pintar();
    }
  };

  /* ---------- Contador binario de 4 bits ---------- */
  SIMULACIONES.binario = {
    montar(cont, ctx) {
      const valores = [8, 4, 2, 1];
      const bits = [0, 0, 0, 0];
      const grande = h("div", { class: "num-grande", "aria-live": "polite" });
      const suma = h("p", { class: "sim-nota" });
      const fila = h("div", { class: "bits" });

      const botones = valores.map((v, i) => {
        const b = h("button", {
          type: "button", class: "interruptor", "aria-pressed": "false",
          "aria-label": "Bit de valor " + v,
          onclick: () => { bits[i] = 1 - bits[i]; ctx.interaccion(); pintar(); }
        }, "0");
        fila.append(h("div", { class: "bit" }, b, h("span", { text: "vale " + v })));
        return b;
      });

      function pintar() {
        botones.forEach((b, i) => { b.textContent = String(bits[i]); b.setAttribute("aria-pressed", String(!!bits[i])); });
        const total = bits.reduce((t, b, i) => t + b * valores[i], 0);
        grande.textContent = String(total);
        const partes = bits.map((b, i) => (b ? String(valores[i]) : null)).filter(Boolean);
        suma.textContent = "Binario " + bits.join("") + " = " + (partes.length ? partes.join(" + ") + " = " + total : "0");
      }

      cont.append(fila, grande, suma);
      pintar();
    }
  };
})();
