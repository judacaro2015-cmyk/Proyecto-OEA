"use strict";
/* Página de inicio: arma grados, unidades, simulaciones, retos y progreso. */
(function () {
  aplicarProyecto();
  document.title = PROYECTO.nombre;

  let gradoActivo = PROYECTO.gradoPiloto;
  const unidadesDe = g => UNIDADES.filter(u => u.grado === g);

  function pctGrado(g) {
    const us = unidadesDe(g);
    if (!us.length) return 0;
    const hechos = us.reduce((s, u) => s + Progreso.pasosDe(u.id), 0);
    return Math.round((100 * hechos) / (us.length * 4));
  }

  /* ---- Progreso (portada) ---- */
  function pintarProgreso() {
    const n = Progreso.total();
    const nivel = 1 + Math.floor(n / 4);
    const pct = ((n % 4) / 4) * 100;
    document.getElementById("tp-nivel").textContent = "Nivel " + nivel;
    document.getElementById("tp-fill").style.width = pct + "%";
    document.getElementById("tp-barra").setAttribute("aria-valuenow", String(Math.round(pct)));
    document.getElementById("tp-texto").textContent = n + (n === 1 ? " paso completado" : " pasos completados");
    const ganadas = Progreso.insignias()
      .map(id => UNIDADES.find(u => u.id === id))
      .filter(Boolean);
    const slots = [];
    for (let i = 0; i < 3; i++) {
      const u = ganadas[i];
      slots.push(u
        ? h("div", { class: "slot ganada", text: u.reta.insignia })
        : h("div", { class: "slot", text: "insignia" }));
    }
    document.getElementById("tp-slots").replaceChildren(...slots);
  }

  /* ---- Grados ---- */
  function pintarGrados() {
    const cont = document.getElementById("grados-lista");
    cont.replaceChildren(...PROYECTO.grados.map(g => {
      const n = unidadesDe(g).length;
      return h("button", {
        class: "grado" + (g === gradoActivo ? " activo" : ""),
        type: "button",
        "aria-pressed": String(g === gradoActivo),
        onclick: () => { gradoActivo = g; pintarGrados(); pintarUnidades(true); }
      },
        h("span", { class: "grado-num", text: g + "°" }),
        h("span", { class: "grado-info", text: n ? n + (n === 1 ? " unidad" : " unidades") : "Próximamente" }),
        h("span", { class: "barra" }, h("span", { class: "barra-fill", style: "width:" + pctGrado(g) + "%" }))
      );
    }));
  }

  function pintarUnidades(desplazar) {
    const panel = document.getElementById("panel-unidades");
    const us = unidadesDe(gradoActivo);
    const titulo = h("h3", { text: "Unidades de grado " + gradoActivo + "°" });
    if (!us.length) {
      panel.replaceChildren(titulo, h("p", { class: "suave", text: "Aún no hay unidades para este grado." }));
    } else {
      panel.replaceChildren(titulo, h("div", { class: "rejilla-3" }, us.map(u => {
        const hechos = Progreso.pasosDe(u.id);
        return h("a", { class: "u-tarjeta", href: "unidad.html?u=" + encodeURIComponent(u.id) },
          h("div", { class: "tags" }, h("span", { class: "tag", text: u.tema })),
          h("h4", { text: u.titulo }),
          h("p", { class: "suave", text: u.objetivo }),
          h("span", { class: "estado", text: hechos === 4 ? "Unidad completada" : hechos + " de 4 pasos" })
        );
      })));
    }
    if (desplazar) panel.scrollIntoView({ block: "nearest" });
  }

  /* ---- Simulaciones ---- */
  function pintarSims() {
    document.getElementById("sims-lista").replaceChildren(...UNIDADES.map(u =>
      h("div", { class: "sim-card" },
        h("div", { class: "vista" },
          u.simulacion.imagen
            ? h("img", { src: u.simulacion.imagen, alt: "Vista previa de " + u.simulacion.nombre, loading: "lazy" })
            : u.simulacion.nombre),
        h("div", { class: "tags" },
          h("span", { class: "tag", text: "Grado " + u.grado + "°" }),
          h("span", { class: "tag", text: u.tema })),
        h("h3", { text: u.simulacion.nombre }),
        h("p", { text: u.simulacion.descripcion }),
        h("a", { class: "btn btn-violeta", href: "unidad.html?u=" + encodeURIComponent(u.id) + "&paso=simula", style: "align-self:flex-start" }, "Abrir")
      )));
  }

  /* ---- Retos ---- */
  function pintarRetos() {
    const ganadas = Progreso.insignias();
    document.getElementById("insignias-lista").replaceChildren(...UNIDADES.map(u =>
      h("div", {
        class: "insignia" + (ganadas.includes(u.id) ? " ganada" : ""),
        title: u.reta.insignia
      }, ganadas.includes(u.id) ? u.reta.insignia : "?")));
    document.getElementById("misiones-lista").replaceChildren(...UNIDADES.map((u, i) =>
      h("a", { class: "mision", href: "unidad.html?u=" + encodeURIComponent(u.id) + "&paso=reta" },
        h("span", { class: "num", text: String(i + 1) }),
        h("span", {}, h("strong", { text: u.reta.titulo }), h("small", { text: "Grado " + u.grado + "° · " + u.titulo })))));
  }

  pintarProgreso();
  pintarGrados();
  pintarUnidades(false);
  pintarSims();
  pintarRetos();
})();
