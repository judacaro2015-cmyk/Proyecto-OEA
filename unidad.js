"use strict";
/* Página de unidad: arma los 4 pasos a partir de los datos de la unidad. */
(function () {
  aplicarProyecto();
  const q = new URLSearchParams(location.search);
  const u = UNIDADES.find(x => x.id === q.get("u")) || UNIDADES[0];
  const PASOS = [
    { id: "explora", nombre: "Explora", c: "p1" },
    { id: "simula", nombre: "Simula", c: "p2" },
    { id: "practica", nombre: "Practica", c: "p3" },
    { id: "reta", nombre: "Reta", c: "p4" }
  ];

  let actual = PASOS.findIndex(p => p.id === q.get("paso"));
  if (actual < 0) {
    actual = PASOS.findIndex(p => !Progreso.hecho(u.id, p.id));
    if (actual < 0) actual = 0;
  }

  const elPasos = document.getElementById("u-pasos");
  const elCentro = document.getElementById("u-centro");
  const elGuia = document.getElementById("u-guia");
  const btnAnt = document.getElementById("btn-ant");
  const btnSig = document.getElementById("btn-sig");

  document.title = u.titulo + " · " + PROYECTO.nombre;
  document.getElementById("titulo-u").textContent = u.titulo;
  document.getElementById("migas").replaceChildren(
    h("a", { href: "index.html" }, "Inicio"),
    " › Grado " + u.grado + "° › " + u.titulo);

  function pintarPasos() {
    elPasos.replaceChildren(
      h("div", { class: "rotulo", text: "PASOS" }),
      ...PASOS.map((p, i) => h("button", {
        type: "button",
        class: "paso-btn " + p.c + (Progreso.hecho(u.id, p.id) ? " hecho" : ""),
        "aria-current": i === actual ? "step" : null,
        onclick: () => ir(i)
      }, h("span", { class: "num", text: String(i + 1) }), p.nombre)));
    const hechos = Progreso.pasosDe(u.id);
    const pct = Math.round((hechos / 4) * 100);
    document.getElementById("mp-fill").style.width = pct + "%";
    document.getElementById("mp-barra").setAttribute("aria-valuenow", String(pct));
  }

  function lista(items) {
    return h("ol", {}, items.map(t => h("li", { text: t })));
  }

  function pintarGuia() {
    const paso = u[PASOS[actual].id] || {};
    const cajas = [
      h("div", { class: "panel" }, h("h3", { text: "Objetivo de aprendizaje" }), h("p", { text: u.objetivo }))
    ];
    if (paso.instrucciones && paso.instrucciones.length) {
      cajas.push(h("div", { class: "panel" }, h("h3", { text: "Instrucciones" }), lista(paso.instrucciones)));
    }
    if (paso.pista) {
      cajas.push(h("div", { class: "panel" }, h("h3", { text: "Pista" }), h("p", { text: paso.pista })));
    }
    if (u.vocabulario && u.vocabulario.length) {
      cajas.push(h("div", { class: "panel" }, h("h3", { text: "Vocabulario" }),
        h("dl", {}, u.vocabulario.map(v => [h("dt", { text: v.t }), h("dd", { text: v.d })]))));
    }
    elGuia.replaceChildren(...cajas);
  }

  /* ---- Contenido de cada paso ---- */
  function pasoExplora() {
    const e = u.explora;
    return [
      h("div", { class: "panel" },
        h("div", { class: "panel-cabeza" }, h("h2", { text: "Explora" }), h("span", { class: "tiempo", style: "color:var(--verde)", text: e.tiempo || "" })),
        h("div", { class: "texto-largo" },
          (e.texto || []).map(t => h("p", { text: t })),
          e.imagen ? h("img", { src: e.imagen.src, alt: e.imagen.alt || "", loading: "lazy" }) : null),
        h("button", {
          type: "button", class: "btn btn-verde", style: "align-self:flex-start",
          onclick: () => { Progreso.marcar(u.id, "explora"); ir(1); }
        }, "Entendido, ir a Simula"))
    ];
  }

  function pasoSimula() {
    const sm = u.simulacion;
    const area = h("div", { class: "sim-area" });
    const aviso = h("p", { class: "fb", "aria-live": "polite" });
    let veces = 0;
    const ctx = {
      interaccion() {
        veces++;
        if (veces === 3 && !Progreso.hecho(u.id, "simula")) {
          Progreso.marcar(u.id, "simula");
          aviso.textContent = "¡Paso completado! Ya puedes pasar a Practica.";
          pintarPasos();
        }
      }
    };
    const motor = SIMULACIONES[sm.id];
    if (motor) motor.montar(area, ctx);
    else area.append(h("p", { text: "[Aquí irá la simulación: " + sm.id + "]" }));
    return [
      h("div", { class: "panel" },
        h("div", { class: "panel-cabeza" }, h("h2", { text: "Simula · " + sm.nombre }), h("span", { class: "tiempo", style: "color:var(--violeta)", text: sm.tiempo || "" })),
        area, aviso),
      sm.observar ? h("div", { class: "observar" }, h("h3", { text: "Qué observar" }), h("p", { text: sm.observar })) : null
    ];
  }

  function pasoPractica() {
    const p = u.practica;
    const aviso = h("p", { class: "fb", "aria-live": "polite" });
    let hechas = 0;
    const paneles = p.actividades.map(a => {
      let contada = false;
      const alTerminar = () => {
        if (contada) return;
        contada = true;
        hechas++;
        if (hechas === p.actividades.length) {
          Progreso.marcar(u.id, "practica");
          aviso.textContent = "¡Practica completada! Sigue con el Reta.";
          pintarPasos();
        }
      };
      const motor = Actividades[a.tipo];
      return h("div", { class: "panel" },
        h("h2", { text: a.titulo || "Actividad" }),
        motor ? motor(a, alTerminar) : h("p", { text: "Tipo de actividad no reconocido: " + a.tipo }));
    });
    return [
      h("div", { class: "panel-cabeza", style: "padding:0 4px" }, h("h2", { text: "Practica" }), h("span", { class: "tiempo", style: "color:var(--ambar-o)", text: p.tiempo || "" })),
      ...paneles, aviso
    ];
  }

  function pasoReta() {
    const r = u.reta;
    const aviso = h("p", { class: "fb", "aria-live": "polite" });
    const juego = Actividades.quiz({ preguntas: r.preguntas, minimo: r.minimo }, (aciertos, total, aprobo) => {
      if (aprobo) {
        Progreso.marcar(u.id, "reta");
        Progreso.otorgar(u.id);
        aviso.textContent = "¡Ganaste la insignia: " + r.insignia + "!";
        pintarPasos();
      }
    });
    return [
      h("div", { class: "panel" },
        h("div", { class: "panel-cabeza" }, h("h2", { text: r.titulo }), h("span", { class: "tiempo", style: "color:var(--coral)", text: r.tiempo || "" })),
        r.historia ? h("p", { text: r.historia }) : null,
        juego, aviso)
    ];
  }

  const CONSTRUCTORES = { explora: pasoExplora, simula: pasoSimula, practica: pasoPractica, reta: pasoReta };

  function pintar() {
    pintarPasos();
    pintarGuia();
    elCentro.replaceChildren(...CONSTRUCTORES[PASOS[actual].id]().filter(Boolean));
    btnAnt.disabled = actual === 0;
    btnAnt.textContent = actual === 0 ? "‹ Anterior" : "‹ Anterior: " + PASOS[actual - 1].nombre;
    if (actual === PASOS.length - 1) {
      btnSig.textContent = "Volver al inicio";
    } else {
      btnSig.textContent = "Siguiente: " + PASOS[actual + 1].nombre + " ›";
    }
  }

  function ir(i) {
    actual = Math.max(0, Math.min(PASOS.length - 1, i));
    pintar();
    window.scrollTo(0, 0);
  }

  btnAnt.addEventListener("click", () => ir(actual - 1));
  btnSig.addEventListener("click", () => {
    if (actual === PASOS.length - 1) location.href = "index.html";
    else ir(actual + 1);
  });

  pintar();
})();
