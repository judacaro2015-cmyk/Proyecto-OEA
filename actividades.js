"use strict";
/* Motores de actividades. Cada uno recibe (configuración, alTerminar) y devuelve un elemento. */
const Actividades = (function () {
  const fb = () => h("p", { class: "fb", "aria-live": "polite" });

  /* Relacionar: elige uno a la izquierda y su pareja a la derecha */
  function relacionar(cfg, alTerminar) {
    const izq = cfg.pares.map((p, i) => ({ t: p[0], i }));
    const der = mezclar(cfg.pares.map((p, i) => ({ t: p[1], i })));
    let sel = null, aciertos = 0;
    const msg = fb();
    const bI = new Map();
    const colI = h("div", { class: "col" });
    const colD = h("div", { class: "col" });

    izq.forEach(x => {
      const b = h("button", {
        type: "button", class: "opcion",
        onclick: () => {
          if (b.disabled) return;
          if (sel !== null) bI.get(sel).classList.remove("sel");
          sel = x.i;
          b.classList.add("sel");
          msg.textContent = "Ahora elige su pareja a la derecha.";
        }
      }, x.t);
      bI.set(x.i, b);
      colI.append(b);
    });

    der.forEach(x => {
      const b = h("button", {
        type: "button", class: "opcion",
        onclick: () => {
          if (b.disabled) return;
          if (sel === null) { msg.textContent = "Primero elige un elemento de la izquierda."; return; }
          const bi = bI.get(sel);
          if (sel === x.i) {
            [bi, b].forEach(e => { e.classList.remove("sel"); e.classList.add("ok"); e.disabled = true; });
            sel = null;
            aciertos++;
            if (aciertos === izq.length) {
              msg.textContent = "¡Todas las parejas correctas!";
              if (alTerminar) alTerminar();
            } else {
              msg.textContent = "¡Correcto!";
            }
          } else {
            b.classList.add("mal");
            bi.classList.add("mal");
            msg.textContent = "Esa no es la pareja. Intenta de nuevo.";
            sel = null;
            setTimeout(() => { b.classList.remove("mal"); bi.classList.remove("mal", "sel"); }, 700);
          }
        }
      }, x.t);
      colD.append(b);
    });

    return h("div", { class: "act-cuerpo" }, h("div", { class: "dos-col" }, colI, colD), msg);
  }

  /* Ordenar: sube y baja los pasos con botones */
  function ordenar(cfg, alTerminar) {
    const base = cfg.pasos.map((t, i) => ({ t, i }));
    let lista = mezclar(base);
    if (lista.length > 1) while (lista.every((x, k) => x.i === k)) lista = mezclar(base);
    let marcas = [], hecho = false;
    const ul = h("ol", { class: "lista-orden" });
    const msg = fb();

    function pintar() {
      ul.replaceChildren(...lista.map((x, k) =>
        h("li", { class: "item-orden" + (marcas[k] === true ? " ok" : marcas[k] === false ? " mal" : "") },
          h("span", { class: "item-texto", text: x.t }),
          h("span", { class: "mover" },
            h("button", { type: "button", class: "mini", "aria-label": "Subir paso", disabled: k === 0 || hecho, onclick: () => mover(k, -1) }, "↑"),
            h("button", { type: "button", class: "mini", "aria-label": "Bajar paso", disabled: k === lista.length - 1 || hecho, onclick: () => mover(k, 1) }, "↓")))));
    }
    function mover(k, d) {
      [lista[k], lista[k + d]] = [lista[k + d], lista[k]];
      marcas = [];
      msg.textContent = "";
      pintar();
    }
    const btn = h("button", {
      type: "button", class: "btn btn-ambar", style: "align-self:flex-start",
      onclick: () => {
        marcas = lista.map((x, k) => x.i === k);
        if (marcas.every(Boolean)) {
          hecho = true;
          msg.textContent = "¡Orden correcto!";
          if (alTerminar) alTerminar();
        } else {
          msg.textContent = "Hay pasos fuera de lugar (marcados con ✗). Muévelos e inténtalo de nuevo.";
        }
        pintar();
      }
    }, "Comprobar orden");
    pintar();
    return h("div", { class: "act-cuerpo" }, ul, btn, msg);
  }

  /* Clasificar: elige un elemento y luego su categoría */
  function clasificar(cfg, alTerminar) {
    let pool = mezclar(cfg.items.map((x, i) => ({ t: x.t, c: x.c, i })));
    let sel = null;
    const msg = fb();
    const poolEl = h("div", { class: "pool" });
    const cols = cfg.categorias.map(() => h("ul", { class: "colocados" }));

    function pintarPool() {
      poolEl.replaceChildren(...pool.map(x =>
        h("button", {
          type: "button", class: "opcion" + (sel === x.i ? " sel" : ""),
          onclick: () => { sel = x.i; msg.textContent = "Ahora elige la categoría."; pintarPool(); }
        }, x.t)));
    }
    function colocar(ci) {
      if (sel === null) { msg.textContent = "Primero elige un elemento."; return; }
      const it = pool.find(x => x.i === sel);
      if (it.c === ci) {
        cols[ci].append(h("li", { class: "ok", text: it.t }));
        pool = pool.filter(x => x.i !== sel);
        sel = null;
        pintarPool();
        if (!pool.length) {
          msg.textContent = "¡Todo clasificado!";
          if (alTerminar) alTerminar();
        } else {
          msg.textContent = "¡Correcto!";
        }
      } else {
        msg.textContent = "Esa no va ahí. Prueba con otra categoría.";
      }
    }
    const cats = cfg.categorias.map((c, ci) =>
      h("div", { class: "categoria" },
        h("button", { type: "button", class: "btn btn-borde-v", onclick: () => colocar(ci) }, "Poner en: " + c),
        cols[ci]));
    pintarPool();
    return h("div", { class: "act-cuerpo" }, poolEl, h("div", { class: "categorias" }, cats), msg);
  }

  /* Quiz: una pregunta a la vez, con explicación */
  function quiz(cfg, alTerminar) {
    let i = 0, aciertos = 0;
    const cont = h("div", { class: "act-cuerpo" });

    function pintar() {
      const total = cfg.preguntas.length;
      if (i >= total) {
        const aprobo = aciertos >= (cfg.minimo || 0);
        cont.replaceChildren(
          h("p", { class: "resultado", text: "Resultado: " + aciertos + " de " + total + "." }),
          h("p", { class: "fb", text: aprobo ? "¡Muy bien!" : "Repasa el paso Explora y vuelve a intentarlo." }),
          aprobo ? null : h("button", { type: "button", class: "btn btn-ambar", style: "align-self:flex-start", onclick: () => { i = 0; aciertos = 0; pintar(); } }, "Reintentar"));
        if (alTerminar) alTerminar(aciertos, total, aprobo);
        return;
      }
      const q = cfg.preguntas[i];
      const msg = fb();
      const opciones = [];
      let respondida = false;
      const sig = h("button", {
        type: "button", class: "btn btn-ambar oculto", style: "align-self:flex-start",
        onclick: () => { i++; pintar(); }
      }, i === total - 1 ? "Ver resultado" : "Siguiente pregunta");
      q.opciones.forEach((o, k) => {
        const b = h("button", {
          type: "button", class: "opcion",
          onclick: () => {
            if (respondida) return;
            respondida = true;
            const bien = k === q.correcta;
            if (bien) aciertos++;
            b.classList.add(bien ? "ok" : "mal");
            if (!bien) opciones[q.correcta].classList.add("ok");
            opciones.forEach(x => { x.disabled = true; });
            msg.textContent = (bien ? "¡Correcto! " : "No es esa. ") + (q.explicacion || "");
            sig.classList.remove("oculto");
          }
        }, o);
        opciones.push(b);
      });
      cont.replaceChildren(
        h("p", { class: "progreso-q", text: "Pregunta " + (i + 1) + " de " + total }),
        h("p", { class: "pregunta", text: q.p }),
        h("div", { class: "opciones" }, opciones),
        msg, sig);
    }
    pintar();
    return cont;
  }

  return { relacionar, ordenar, clasificar, quiz };
})();
