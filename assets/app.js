/* ==========================================================================
   5 cosas · comportamiento compartido
   El contenido vive en el HTML; aquí solo se le da vida con atributos data-*:
     <body data-guide="antes" data-total="5">   id de la guía (aísla progreso y métricas)
     <input type="checkbox" data-step="1">       casilla «Hecho» del tema 1
     [data-count]                                se reemplaza por los temas hechos
     [data-dot="1"]  /  [data-bar="1"]           indicadores del tema 1
     [data-copy="id"]                            copia el texto del elemento #id
     [data-share="1"]                            compartir el link al tema 1
     [data-track="nombre"]                       cuenta un clic en GoatCounter
     [data-progress-of="antes" data-total="5"]   (portada de serie) progreso guardado
     [data-cta="canal" | "perfil"]               bloque final según haya canal o no
   ========================================================================== */
(function () {
  "use strict";

  var CONFIG = Object.assign({ goatcounter: "", canal: "", perfil: "" }, window.CINCO_COSAS || {});
  var body = document.body;
  var guide = body.dataset.guide || "";
  var total = parseInt(body.dataset.total || "5", 10);
  var reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Almacenamiento seguro (puede no existir en navegación privada o el visor de IG) ---------- */
  var store = {
    key: function (id) { return "5cosas:" + id + ":v1"; },
    read: function (id) {
      try { return JSON.parse(localStorage.getItem(this.key(id))) || {}; } catch (e) { return {}; }
    },
    write: function (id, data) {
      try { localStorage.setItem(this.key(id), JSON.stringify(data)); } catch (e) { /* sigue funcionando sin guardar */ }
    }
  };

  /* ---------- Medición (GoatCounter, sin cookies) ---------- */
  if (CONFIG.goatcounter) {
    var gc = document.createElement("script");
    gc.async = true;
    gc.src = "https://gc.zgo.at/count.js";
    gc.setAttribute("data-goatcounter", "https://" + CONFIG.goatcounter + ".goatcounter.com/count");
    document.head.appendChild(gc);
  }
  function track(name) {
    if (!name) return;
    var path = (guide ? guide + "/" : "") + name;
    try {
      if (window.goatcounter && typeof window.goatcounter.count === "function") {
        window.goatcounter.count({ path: path, title: path, event: true });
      }
    } catch (e) {}
  }
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-track]");
    if (el) track(el.dataset.track);
  });

  /* ---------- Anunciador accesible ---------- */
  var live = document.createElement("div");
  live.className = "sr-only";
  live.setAttribute("aria-live", "polite");
  body.appendChild(live);
  function announce(msg) { live.textContent = ""; setTimeout(function () { live.textContent = msg; }, 30); }

  /* ---------- Progreso: casillas, contador, puntos ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll("input[data-step]"));
  var state = store.read(guide);
  var done = Array.isArray(state.done) ? state.done.map(String) : [];

  function render(animate) {
    var n = done.length;
    document.querySelectorAll("[data-count]").forEach(function (el) {
      if (el.textContent === String(n)) return;
      el.textContent = String(n);
      if (animate && !reduceMotion && el.closest(".tally__num")) {
        el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick");
      }
    });
    for (var i = 1; i <= total; i++) {
      var on = done.indexOf(String(i)) !== -1;
      document.querySelectorAll('[data-dot="' + i + '"], [data-bar="' + i + '"]').forEach(function (el) {
        el.classList.toggle("is-done", on);
      });
      var card = document.querySelector('[data-topic="' + i + '"]');
      if (card) card.classList.toggle("is-done", on);
    }
    body.classList.toggle("all-done", n >= total && total > 0);
  }

  steps.forEach(function (input) {
    var id = String(input.dataset.step);
    input.checked = done.indexOf(id) !== -1;
    input.addEventListener("change", function () {
      if (input.checked) { if (done.indexOf(id) === -1) done.push(id); }
      else { done = done.filter(function (d) { return d !== id; }); }
      store.write(guide, { done: done, at: Date.now() });
      render(true);
      if (input.checked) {
        if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
        track("hecho-" + pad(id));
        announce(done.length >= total
          ? "¡Lo lograste! " + total + " de " + total + " hechos."
          : done.length + " de " + total + " hechos.");
      } else {
        announce(done.length + " de " + total + " hechos.");
      }
    });
  });
  render(false);

  function pad(n) { n = String(n); return n.length < 2 ? "0" + n : n; }

  /* ---------- Barra superior: aparece al pasar la portada ---------- */
  var topbar = document.querySelector(".topbar");
  var cover = document.querySelector("[data-cover]");
  if (topbar && cover && "IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      var hidden = !entries[0].isIntersecting;
      topbar.classList.toggle("is-visible", hidden);
      topbar.toggleAttribute("inert", !hidden);
    }, { rootMargin: "-40% 0px 0px 0px" }).observe(cover);
    topbar.setAttribute("inert", "");
  } else if (topbar) {
    topbar.classList.add("is-visible");
  }

  /* ---------- Copiar (con respaldo para el navegador interno de Instagram) ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(function () { return legacyCopy(text); });
    }
    return legacyCopy(text);
  }
  function legacyCopy(text) {
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;font-size:16px;";
      body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }
  function flash(btn, msg) {
    var label = btn.querySelector("[data-label]") || btn;
    if (!btn.dataset.original) btn.dataset.original = label.textContent;
    label.textContent = msg;
    btn.classList.add("is-ok");
    announce(msg);
    clearTimeout(btn._t);
    btn._t = setTimeout(function () {
      label.textContent = btn.dataset.original;
      btn.classList.remove("is-ok");
    }, 1800);
  }

  document.querySelectorAll("[data-copy]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var src = document.getElementById(btn.dataset.copy);
      if (!src) return;
      var text = src.textContent.replace(/\s+/g, " ").trim();
      copyText(text).then(function () { flash(btn, "¡Copiado!"); },
                          function () { flash(btn, "Mantén presionado el texto para copiar"); });
    });
  });

  /* ---------- Compartir un tema (mándatelo a tu compu) ---------- */
  document.querySelectorAll("[data-share]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var n = btn.dataset.share;
      var url = location.origin + location.pathname + "#t" + n;
      var title = document.title;
      track("compartir-" + pad(n));
      if (navigator.share) {
        navigator.share({ title: title, text: "Para hacerlo en la compu: " + title, url: url }).catch(function () {});
      } else {
        copyText(url).then(function () { flash(btn, "Link copiado: pégalo donde lo abras en la compu"); },
                           function () { flash(btn, url); });
      }
    });
  });

  /* ---------- Bloque final: canal o perfil ---------- */
  var ctaCanal = document.querySelector('[data-cta="canal"]');
  var ctaPerfil = document.querySelector('[data-cta="perfil"]');
  if (CONFIG.canal && ctaCanal) {
    ctaCanal.hidden = false;
    if (ctaPerfil) ctaPerfil.hidden = true;
    ctaCanal.querySelectorAll("[data-canal-link]").forEach(function (a) { a.href = CONFIG.canal; });
  }
  if (CONFIG.perfil) {
    document.querySelectorAll("[data-perfil-link]").forEach(function (a) { a.href = CONFIG.perfil; });
  }

  /* ---------- Portada de la serie: progreso guardado de cada guía ---------- */
  document.querySelectorAll("[data-progress-of]").forEach(function (el) {
    var d = store.read(el.dataset.progressOf).done;
    var t = parseInt(el.dataset.total || "5", 10);
    if (Array.isArray(d) && d.length) {
      el.textContent = d.length >= t ? "✓ " + t + "/" + t + " hechos" : d.length + "/" + t + " hechos";
    }
  });

  /* ---------- Aparición suave y animaciones que corren una sola vez ---------- */
  var reveals = document.querySelectorAll(".reveal");
  var plays = document.querySelectorAll("[data-play]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target;
        el.classList.add("is-in");
        if (el.hasAttribute("data-play") && !reduceMotion) {
          el.querySelectorAll("animateMotion, animate").forEach(function (a) {
            if (a.beginElement) a.beginElement();
          });
        }
        io.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
    plays.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }
})();
