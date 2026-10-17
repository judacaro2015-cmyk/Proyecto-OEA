"use strict";
/* Utilidades compartidas: crear elementos, mezclar, guardar progreso. */

/* h("div", {class:"x", onclick:fn, text:"hola"}, hijo1, hijo2) -> elemento */
function h(tag, attrs, ...hijos) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === null || v === undefined || v === false) continue;
    if (k === "class") el.className = v;
    else if (k === "text") el.textContent = v;
    else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  (function agregar(lista) {
    for (const x of lista) {
      if (x === null || x === undefined || x === false) continue;
      if (Array.isArray(x)) agregar(x);
      else el.append(x.nodeType ? x : document.createTextNode(String(x)));
    }
  })(hijos);
  return el;
}

function mezclar(lista) {
  const a = lista.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Progreso guardado en el navegador del estudiante (localStorage). */
const Progreso = {
  clave: "proyecto-progreso-v1",
  PASOS: ["explora", "simula", "practica", "reta"],
  leer() {
    try {
      const d = JSON.parse(localStorage.getItem(this.clave));
      if (d && d.unidades) return d;
    } catch (e) { /* sin almacenamiento */ }
    return { unidades: {}, insignias: [] };
  },
  guardar(d) {
    try { localStorage.setItem(this.clave, JSON.stringify(d)); } catch (e) { /* ignorar */ }
  },
  hecho(uid, paso) {
    const d = this.leer();
    return !!(d.unidades[uid] && d.unidades[uid][paso]);
  },
  marcar(uid, paso) {
    const d = this.leer();
    d.unidades[uid] = d.unidades[uid] || {};
    d.unidades[uid][paso] = true;
    this.guardar(d);
  },
  pasosDe(uid) {
    return this.PASOS.filter(p => this.hecho(uid, p)).length;
  },
  total() {
    const d = this.leer();
    return Object.values(d.unidades).reduce((s, u) => s + Object.values(u).filter(Boolean).length, 0);
  },
  insignias() {
    return this.leer().insignias;
  },
  otorgar(uid) {
    const d = this.leer();
    if (!d.insignias.includes(uid)) {
      d.insignias.push(uid);
      this.guardar(d);
    }
  }
};

/* Rellena los textos y enlaces marcados con data-p / data-enlace desde PROYECTO. */
function aplicarProyecto() {
  document.querySelectorAll("[data-p]").forEach(el => {
    const v = PROYECTO[el.dataset.p];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll("[data-enlace]").forEach(el => {
    const v = PROYECTO[el.dataset.enlace];
    if (v) el.setAttribute("href", v);
  });
}

/* Uso sin conexión: solo funciona cuando la web está publicada (https). */
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => { /* ignorar */ });
  });
}
