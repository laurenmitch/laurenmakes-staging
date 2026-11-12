/* =========================================================
   THE POTTERY SHOP: rendering + demo hold/checkout
   Staging preview: holds are simulated in the browser. Later the
   "hold" calls go to the hold service and the checkout panel loads
   Stripe's embedded checkout instead of the placeholder.
   ========================================================= */
(function () {
  const { drop, pieces } = window.SHOP;
  const HOLD = drop.holdMinutes * 60;
  const $ = (s, el = document) => el.querySelector(s);
  const money = n => "$" + n.toLocaleString("en-US");
  const FRAC = { 0.25: "¼", 0.5: "½", 0.75: "¾" };
  const inch = n => { const w = Math.floor(n), f = FRAC[+(n - w).toFixed(2)]; return (f ? (w || "") + f : String(n)) + "″"; };
  const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

  // Seconds remaining on each hold, keyed by piece number.
  const holds = {};
  let myHold = null; // piece number the current visitor is holding
  pieces.forEach(p => { if (p.status === "reserved") holds[p.no] = { until: Date.now() + (p.heldSeconds || HOLD) * 1000, mine: false }; });

  // A hold that has ended (or a "reserved" piece with no live hold) is available again.
  const status = p => (holds[p.no] ? "reserved" : p.status === "sold" ? "sold" : "available");
  const left = no => (holds[no].until - Date.now()) / 1000;

  /* ---------- Placeholder sconce illustrations (swap for photos) ---------- */
  function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
  // Lauren's star: eight points joined by scooped (concave) edges.
  // Shared with the site-wide star icon (assets/img/star.svg).
  function starPath(cx, cy, R, scoop) {
    const P = k => { const a = -Math.PI / 2 + k * Math.PI / 4; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R]; };
    const C = k => { const a = -Math.PI / 2 + (k + 0.5) * Math.PI / 4; return [cx + Math.cos(a) * R * scoop, cy + Math.sin(a) * R * scoop]; };
    const f = v => v[0].toFixed(1) + " " + v[1].toFixed(1);
    let d = "M" + f(P(0));
    for (let k = 0; k < 8; k++) d += " Q" + f(C(k)) + " " + f(P(k + 1));
    return d + " Z";
  }
  const CX = 100, CY = 125, R = 82;
  const STAR = starPath(CX, CY, R, 0.66);
  let uid = 0;
  function sconce(p, lit, twin) {
    const r = rng(parseInt(p.no, 10) * 7 + 3 + (twin ? 101 : 0)), id = "s" + (uid++);
    let specks = "";
    for (let i = 0; i < 55; i++) specks += `<circle cx="${(25 + r() * 150).toFixed(1)}" cy="${(45 + r() * 160).toFixed(1)}" r="${(0.5 + r() * 1.3).toFixed(2)}" fill="${p.drip}" opacity="${(0.25 + r() * 0.4).toFixed(2)}"/>`;
    // Light escaping through the scooped notches, fanning out on the wall.
    let rays = "";
    if (lit) for (let k = 0; k < 8; k++) {
      const a = -Math.PI / 2 + (k + 0.5) * Math.PI / 4, w = 0.2, L = 230;
      const x1 = CX + Math.cos(a - w) * L, y1 = CY + Math.sin(a - w) * L, x2 = CX + Math.cos(a + w) * L, y2 = CY + Math.sin(a + w) * L;
      rays += `<path d="M${CX} ${CY} L${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)} Z" fill="url(#${id}r)"/>`;
    }
    return `<svg viewBox="0 0 200 250" overflow="visible" role="img" aria-label="${p.name}${lit ? ", lit" : ""}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${id}c"><path d="${STAR}"/></clipPath>
        <radialGradient id="${id}g" cx="${CX}" cy="${CY}" r="${R * 1.45}" gradientUnits="userSpaceOnUse"><stop offset=".55" stop-color="#fff4cf" stop-opacity=".95"/><stop offset="1" stop-color="#fff4cf" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}r" cx="${CX}" cy="${CY}" r="230" gradientUnits="userSpaceOnUse"><stop offset=".3" stop-color="#fff1c4" stop-opacity=".9"/><stop offset="1" stop-color="#fff1c4" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}b" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".7" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></radialGradient>
        <filter id="${id}f" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#2a2016" flood-opacity=".28"/></filter>
      </defs>
      ${lit ? `<g filter="url(#${id}f)">${rays}<circle cx="${CX}" cy="${CY}" r="${R * 1.45}" fill="url(#${id}g)"/></g>` : ""}
      <g ${lit ? "" : `filter="url(#${id}s)"`}><path d="${STAR}" fill="${p.glaze}"/></g>
      <g clip-path="url(#${id}c)">
        ${specks}
        <rect width="200" height="250" fill="url(#${id}b)"/>
        ${lit ? `<rect width="200" height="250" fill="#18202c" opacity=".45"/>` : ""}
      </g>
      <path d="${STAR}" fill="none" stroke="${lit ? "#ffe7a8" : p.drip}" stroke-width="${lit ? 1.6 : 2.4}" stroke-linejoin="round" opacity="${lit ? 0.8 : 0.75}"/>
    </svg>`;
  }

  // Pairs: two matching sconces sold together at twice the single price.
  const total = p => (p.pair ? p.price * 2 : p.price);
  const art = (p, lit) => (p.pair ? `<span class="duo">${sconce(p, lit)}${sconce(p, lit, true)}</span>` : sconce(p, lit));
  const priceLine = p => (p.pair ? `${money(total(p))} <small>for the pair</small>` : money(p.price));

  /* ---------- Grid ---------- */
  const grid = $("#grid");
  function badge(p) {
    const st = status(p);
    if (st === "sold") return `<span class="badge badge--sold">Sold</span>`;
    if (st === "reserved") return `<span class="badge badge--held">${holds[p.no].mine ? "Held for you" : "Held"}</span>`;
    return `<span class="badge badge--open">Available</span>`;
  }
  function card(p) {
    const st = status(p);
    return `<article class="piece is-${st}" data-no="${p.no}">
      <button class="piece__media" type="button" data-open="${p.no}" aria-label="See ${p.name}">
        <span class="piece__img piece__img--off">${art(p, false)}</span>
        <span class="piece__img piece__img--on">${art(p, true)}</span>
        ${badge(p)}
        ${p.pair ? `<span class="badge badge--pair">Pair of 2</span>` : ""}
        ${st === "reserved" ? `<span class="piece__hold">${holds[p.no].mine ? "you're checking out" : "someone's checking out"}<span>held for the next <b data-timer="${p.no}">${fmt(left(p.no))}</b></span></span>` : ""}
        <span class="piece__hint" aria-hidden="true">hover to light it</span>
      </button>
      <div class="piece__body">
        <h3 class="piece__name">${p.name}</h3>
        <p class="piece__spec">${p.pair ? "Matching pair · " : ""}${p.glazeName}</p>
        <p class="piece__price">${st === "sold" ? "<s>" + money(total(p)) + "</s>" : priceLine(p)}</p>
      </div>
    </article>`;
  }
  function render() {
    // Available first, then held, then sold; keep piece-number order within each group.
    const rank = { available: 0, reserved: 1, sold: 2 };
    const sorted = pieces.slice().sort((a, b) => rank[status(a)] - rank[status(b)] || a.no.localeCompare(b.no));
    grid.innerHTML = sorted.map(card).join("");
    const open = pieces.filter(p => status(p) === "available").length;
    $("#count").textContent = open === 0 ? "Sold out · thank you!" : `${open} of ${pieces.length} still available`;
  }

  /* ---------- Piece detail ---------- */
  const detail = $("#detail");
  let current = null;
  function openDetail(no) {
    const p = pieces.find(x => x.no === no); current = p;
    const st = status(p);
    $("#d-off").innerHTML = art(p, false);
    $("#d-on").innerHTML = art(p, true);
    $("#d-pair").hidden = !p.pair;
    detail.classList.remove("is-lit");
    $("#d-toggle").setAttribute("aria-pressed", "false");
    $("#d-name").textContent = p.name;
    $("#d-price").innerHTML = p.pair ? `${money(total(p))} <small>for the pair (${money(p.price)} each)</small>` : money(p.price);
    $("#d-qty-row").hidden = $("#d-qty").hidden = !p.pair;
    $("#d-qty").textContent = "A matching pair: 2 sconces";
    $("#d-note").textContent = p.note || "";
    $("#d-glaze").textContent = p.glazeName;
    $("#d-clay").textContent = p.clayName;
    $("#d-size").textContent = `${inch(p.h)} tall × ${inch(p.w)} wide × ${inch(p.d)} deep${p.pair ? ", each" : ""}`;
    const btn = $("#d-buy"), note = $("#d-state");
    btn.disabled = st !== "available";
    btn.innerHTML = st === "available" ? `Hold ${p.pair ? "the pair" : "it"} &amp; check out <span>→</span>` : st === "sold" ? "Sold" : "Held right now";
    note.textContent = st === "available"
      ? `Clicking holds it for you for ${drop.holdMinutes} minutes while you check out.`
      : st === "sold" ? "This one's sold. It stays here so you can see what the drop held."
      : holds[p.no].mine ? "You're holding this one. Your checkout is still open." : "Someone's checking out with this one. If they don't finish, it comes back.";
    if (!detail.open) detail.showModal();
  }
  $("#d-toggle").addEventListener("click", () => {
    const lit = detail.classList.toggle("is-lit");
    $("#d-toggle").setAttribute("aria-pressed", String(lit));
    $("#d-toggle").textContent = lit ? "Turn it off" : "Turn it on";
  });

  /* ---------- Checkout (demo hold) ---------- */
  const co = $("#checkout");
  function startHold(no) {
    if (myHold && myHold !== no) { alert("You're already holding " + pieces.find(x => x.no === myHold).name + ". Finish or release that one first."); return; }
    const p = pieces.find(x => x.no === no);
    if (status(p) !== "available" && !(holds[no] && holds[no].mine)) return;
    if (!holds[no]) holds[no] = { until: Date.now() + HOLD * 1000, mine: true };
    myHold = no;
    if (detail.open) detail.close();
    $("#c-title").textContent = `${p.name} ${p.pair ? "are" : "is"} held for you`;
    $("#c-name").textContent = p.pair ? `${p.name}, pair of 2` : p.name;
    $("#c-thumb").innerHTML = art(p, true);
    $("#c-price").textContent = money(total(p));
    co.classList.remove("is-expired", "is-done");
    updateTotal();
    render();
    co.showModal();
    tick();
  }
  function updateTotal() {
    if (!myHold) return;
    const p = pieces.find(x => x.no === myHold);
    const s = drop.shipping.find(x => x.code === $("#c-country").value);
    $("#c-shipping").textContent = money(s.price);
    $("#c-total").textContent = money(total(p) + s.price);
  }
  $("#c-country").addEventListener("change", updateTotal);
  function release(expired) {
    if (!myHold) return;
    const no = myHold; delete holds[no]; myHold = null;
    if (expired) { co.classList.add("is-expired"); $("#c-title").textContent = `Time's up. ${pieces.find(x => x.no === no).name} went back in the shop.`; }
    else co.close();
    render();
  }
  $("#c-release").addEventListener("click", () => release(false));
  $("#c-close").addEventListener("click", () => co.close());
  $("#c-again").addEventListener("click", () => co.close());
  $("#c-skip").addEventListener("click", () => { if (myHold) holds[myHold].until = Date.now() + 12000; tick(); });
  $("#c-pay").addEventListener("click", () => {
    const no = myHold; if (!no) return;
    delete holds[no]; myHold = null;
    pieces.find(x => x.no === no).status = "sold";
    co.classList.add("is-done");
    $("#c-title").textContent = `${pieces.find(x => x.no === no).name} ${pieces.find(x => x.no === no).pair ? "are" : "is"} yours. Thank you!`;
    render();
  });
  co.addEventListener("cancel", e => { if (myHold) e.preventDefault(); }); // keep it open with Esc while holding

  /* ---------- Clock ---------- */
  function tick() {
    let changed = false;
    Object.keys(holds).forEach(no => {
      const s = left(no);
      if (s <= 0) {
        if (holds[no].mine) release(true); else { delete holds[no]; changed = true; }
        return;
      }
      document.querySelectorAll(`[data-timer="${no}"]`).forEach(el => (el.textContent = fmt(s)));
      if (holds[no].mine) {
        $("#c-clock").textContent = fmt(s);
        $("#c-bar").style.transform = `scaleX(${s / HOLD})`;
        co.classList.toggle("is-urgent", s <= 60);
      }
    });
    if (changed) render();
  }
  setInterval(tick, 1000);

  /* ---------- Events ---------- */
  grid.addEventListener("click", e => { const b = e.target.closest("[data-open]"); if (b) openDetail(b.dataset.open); });
  $("#d-buy").addEventListener("click", () => current && startHold(current.no));
  $("#d-close").addEventListener("click", () => detail.close());
  [detail, co].forEach(d => d.addEventListener("click", e => { if (e.target === d && !(d === co && myHold)) d.close(); }));

  render();
})();
