/* SCRIPT.JS - lógica de la invitación (normalmente no necesitas editarlo) */
(function () {
  const C = window.CONFIG, $ = s => document.querySelector(s);
  const apiOk = C.apiUrl && !C.apiUrl.startsWith("PEGA_AQUI");
  const params = new URLSearchParams(location.search);
  const id = (params.get("id") || "").trim();
  let guest = null;

  /* 1. Rellenar textos, fotos y enlaces desde config.js */
  document.querySelectorAll("[data-bind]").forEach(e => e.textContent = C[e.dataset.bind] ?? "");
  document.querySelectorAll("[data-foto]").forEach(e => e.style.setProperty("--img", `url('${C.fotos[e.dataset.foto]}')`));
  $("#btnMapa").href = C.mapsUrl;
  $("#qrImg").src = C.qr;

  /* 2. Animaciones al hacer scroll */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12 }) : null;
  document.querySelectorAll(".rv,.band,.sec").forEach(e => io ? io.observe(e) : e.classList.add("in"));

  /* Destellos dorados que caen en portada y cierre */
  document.querySelectorAll(".hero,.close").forEach(box => {
    for (let i = 0; i < 14; i++) {
      const s = document.createElement("i"); s.className = "spark";
      s.style.cssText = `left:${Math.random() * 100}%;animation-duration:${9 + Math.random() * 9}s;animation-delay:${-Math.random() * 14}s;transform:scale(${.6 + Math.random()})`;
      box.appendChild(s);
    }
  });

  /* 3. Cuenta regresiva */
  const target = new Date(C.fechaISO).getTime();
  (function tick() {
    let d = Math.max(0, target - Date.now());
    const v = [Math.floor(d / 864e5), Math.floor(d % 864e5 / 36e5), Math.floor(d % 36e5 / 6e4), Math.floor(d % 6e4 / 1e3)];
    ["cD", "cH", "cM", "cS"].forEach((k, i) => $("#" + k).textContent = String(v[i]).padStart(2, "0"));
    setTimeout(tick, 1000);
  })();

  /* 4. Cargar invitado (validado en el servidor) */
  const form = $("#form"), msg = $("#msgForm");
  const say = (t, cls) => { msg.textContent = t; msg.className = "status " + (cls || ""); };
  const lock = t => { form.querySelectorAll("input,select,button").forEach(x => x.disabled = true); say(t, "ok"); };

  async function api(opts, qs) {
    const r = await fetch(C.apiUrl + (qs || ""), opts);
    return r.json();
  }

  async function loadGuest() {
    if (!id) return noGuest("Abre el enlace personal que recibiste para ver tu invitación y confirmar.");
    try {
      if (apiOk) guest = await api({}, "?action=guest&id=" + encodeURIComponent(id));
      else if (id === C.demo.id) guest = { ok: true, nombre: C.demo.nombre, pases: C.demo.pases, estado: "Pendiente" };
      else guest = { ok: false };
    } catch (e) { return noGuest("No pudimos conectar. Revisa tu internet e intenta de nuevo."); }
    if (!guest.ok) return noGuest("Este enlace no es válido. Verifica que esté completo.");
    $("#gNombre").textContent = guest.nombre;
    $("#gPases").innerHTML = `Pases asignados: <b>${guest.pases}</b>`;
    const sel = $("#cant");
    sel.innerHTML = Array.from({ length: guest.pases }, (_, i) => `<option>${i + 1}</option>`).join("");
    sel.value = guest.pases;
    if (guest.estado === "Confirmado") {
      lock("Tu respuesta ya fue registrada. ¡Gracias!");
      $("#gAviso").textContent = "Respuesta registrada";
    }
  }
  function noGuest(t) {
    $("#gAviso").textContent = t; form.querySelectorAll("input,select,button").forEach(x => x.disabled = true);
    say("Necesitas tu enlace personal para confirmar.", "err");
  }

  form.addEventListener("change", () => {
    $("#cantBox").hidden = form.asiste.value !== "SI";
  });

  /* 5. Enviar confirmación (validación en navegador + en el backend) */
  form.addEventListener("submit", async ev => {
    ev.preventDefault();
    if (!guest || !guest.ok) return;
    const asiste = form.asiste.value;
    if (!asiste) return say("Elige si asistirás o no.", "err");
    const n = asiste === "SI" ? parseInt($("#cant").value, 10) : 0;
    if (asiste === "SI" && (!(n >= 1) || n > guest.pases)) return say(`Puedes confirmar entre 1 y ${guest.pases} personas.`, "err");
    $("#enviar").disabled = true; say("Enviando…");
    try {
      let res;
      if (apiOk) {
        // text/plain evita la petición previa (preflight) de CORS que Apps Script no soporta
        res = await api({ method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ id, asiste, asistentes: n }) });
      } else res = { ok: true, demo: true };
      if (res.ok) lock(asiste === "SI" ? "¡Gracias! Tu asistencia fue confirmada." : "Gracias por avisarnos. Lamentamos que no puedas acompañarnos." + (res.demo ? " (modo demo)" : ""));
      else if (res.error === "ya") lock("Tu respuesta ya había sido registrada.");
      else { say(res.mensaje || "No se pudo enviar. Intenta de nuevo.", "err"); $("#enviar").disabled = false; }
    } catch (e) { say("Error de conexión. Intenta de nuevo.", "err"); $("#enviar").disabled = false; }
  });

  loadGuest();
})();
