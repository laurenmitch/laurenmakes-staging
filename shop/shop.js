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
  const inch = n => n + "″";
  const fmt = s => { s = Math.max(0, Math.ceil(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };

  // Seconds remaining on each hold, keyed by piece number.
  const holds = {};
  let myHold = null; // piece number the current visitor is holding
  pieces.forEach(p => { if (p.status === "reserved") holds[p.no] = { until: Date.now() + (p.heldSeconds || HOLD) * 1000, mine: false }; });

  const status = p => (holds[p.no] ? "reserved" : p.status);
  const left = no => (holds[no].until - Date.now()) / 1000;

  /* ---------- Placeholder sconce illustrations (swap for photos) ---------- */
  function rng(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
  const SHAPES = {
    arch:  { d: "M58 216 V100 a42 42 0 0 1 84 0 V216 Z", cup: 196, glazeTo: 168 },
    tall:  { d: "M70 226 V68 a30 30 0 0 1 60 0 V226 Z", cup: 204, glazeTo: 176 },
    moon:  { d: "M100 52 a70 70 0 1 1 -0.1 0 Z",          cup: 170, glazeTo: 150 },
    shell: { d: "M36 178 Q36 64 100 50 Q164 64 164 178 Z", cup: 168, glazeTo: 140 }
  };
  let uid = 0;
  function sconce(p, lit) {
    const S = SHAPES[p.shape] || SHAPES.arch, r = rng(parseInt(p.no, 10) * 7 + 3), id = "s" + (uid++);
    let drips = "";
    for (let i = 0; i < 7; i++) {
      const x = 40 + r() * 120, len = 8 + r() * 26, w = 5 + r() * 7;
      drips += `<rect x="${x.toFixed(1)}" y="${S.glazeTo - 6}" width="${w.toFixed(1)}" height="${(len + 6).toFixed(1)}" rx="${(w / 2).toFixed(1)}" fill="${p.glaze}"/>`;
    }
    let specks = "";
    for (let i = 0; i < 46; i++) specks += `<circle cx="${(30 + r() * 140).toFixed(1)}" cy="${(40 + r() * 190).toFixed(1)}" r="${(0.5 + r() * 1.1).toFixed(2)}" fill="#3b2b1c" opacity="${(0.18 + r() * 0.3).toFixed(2)}"/>`;
    let ribs = "";
    if (p.shape === "shell") for (let i = 0; i < 7; i++) { const a = Math.PI * (0.12 + i * 0.127); ribs += `<line x1="100" y1="${S.cup}" x2="${(100 - Math.cos(a) * 80).toFixed(1)}" y2="${(S.cup - Math.sin(a) * 120).toFixed(1)}" stroke="${p.drip}" stroke-width="2" opacity=".35"/>`; }
    const c = S.cup;
    return `<svg viewBox="0 0 200 250" role="img" aria-label="No. ${p.no}, ${p.name}${lit ? ", lit" : ""}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <clipPath id="${id}c"><path d="${S.d}"/></clipPath>
        <radialGradient id="${id}g" cx="50%" cy="${(c - 16) / 2.5}%" r="62%"><stop offset="0" stop-color="#ffd98a" stop-opacity=".95"/><stop offset=".35" stop-color="#ffc56b" stop-opacity=".45"/><stop offset="1" stop-color="#ffc56b" stop-opacity="0"/></radialGradient>
        <linearGradient id="${id}w" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#fff3d1" stop-opacity=".75"/><stop offset=".7" stop-color="#fff3d1" stop-opacity="0"/></linearGradient>
        <filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="3" dy="6" stdDeviation="5" flood-color="#2a2016" flood-opacity="${lit ? 0.18 : 0.28}"/></filter>
      </defs>
      ${lit ? `<rect width="200" height="250" fill="url(#${id}g)"/>` : ""}
      <g filter="url(#${id}s)"><path d="${S.d}" fill="${p.clay}"/></g>
      <g clip-path="url(#${id}c)">
        <rect x="0" y="0" width="200" height="${S.glazeTo}" fill="${p.glaze}"/>
        ${drips}
        <rect x="0" y="${S.glazeTo - 3}" width="200" height="3" fill="${p.drip}" opacity=".35"/>
        ${ribs}${specks}
        ${lit ? `<rect width="200" height="250" fill="url(#${id}w)"/>` : ""}
      </g>
      <rect x="93" y="${c - 22}" width="14" height="12" rx="2" fill="#2a2420"/>
      <circle cx="100" cy="${c - 30}" r="13" fill="${lit ? "#fff7dc" : "#f1ede6"}" stroke="${lit ? "#ffd27a" : "#cfc8bc"}" stroke-width="${lit ? 3 : 1.2}" ${lit ? "" : 'opacity=".9"'}/>
      <path d="M62 ${c - 12} Q100 ${c + 30} 138 ${c - 12} Z" fill="${p.glaze}" stroke="${p.drip}" stroke-width="1.5"/>
      <path d="M64 ${c - 12} H136" stroke="${p.drip}" stroke-width="3" stroke-linecap="round"/>
    </svg>`;
  }

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
      <button class="piece__media" type="button" data-open="${p.no}" aria-label="See No. ${p.no}, ${p.name}">
        <span class="piece__img piece__img--off">${sconce(p, false)}</span>
        <span class="piece__img piece__img--on">${sconce(p, true)}</span>
        ${badge(p)}
        ${st === "reserved" ? `<span class="piece__hold"><b data-timer="${p.no}">${fmt(left(p.no))}</b>${holds[p.no].mine ? "held for you" : "someone's checking out"}</span>` : ""}
        ${st === "sold" ? `<span class="stamp">found<br/>a home</span>` : ""}
        <span class="piece__hint" aria-hidden="true">hover to light it</span>
      </button>
      <div class="piece__body">
        <p class="piece__no">No. ${p.no}</p>
        <h3 class="piece__name">${p.name}</h3>
        <p class="piece__spec">${p.glazeName} · ${inch(p.h)} × ${inch(p.w)}</p>
        <p class="piece__price">${st === "sold" ? "<s>" + money(p.price) + "</s>" : money(p.price)}</p>
      </div>
    </article>`;
  }
  function render() {
    grid.innerHTML = pieces.map(card).join("");
    const open = pieces.filter(p => status(p) === "available").length;
    $("#count").textContent = open === 0 ? "Sold out · thank you!" : `${open} of ${pieces.length} still available`;
  }

  /* ---------- Piece detail ---------- */
  const detail = $("#detail");
  let current = null;
  function openDetail(no) {
    const p = pieces.find(x => x.no === no); current = p;
    const st = status(p);
    $("#d-off").innerHTML = sconce(p, false);
    $("#d-on").innerHTML = sconce(p, true);
    detail.classList.remove("is-lit");
    $("#d-toggle").setAttribute("aria-pressed", "false");
    $("#d-no").textContent = "No. " + p.no;
    $("#d-name").textContent = p.name;
    $("#d-price").textContent = money(p.price);
    $("#d-glaze").textContent = p.glazeName;
    $("#d-clay").textContent = p.clayName;
    $("#d-size").textContent = `${inch(p.h)} tall × ${inch(p.w)} wide`;
    $("#d-ship").textContent = drop.shipping.map(s => `${s.country} ${money(s.price)}`).join(" · ");
    const btn = $("#d-buy"), note = $("#d-state");
    btn.disabled = st !== "available";
    btn.innerHTML = st === "available" ? `Hold it &amp; check out <span>→</span>` : st === "sold" ? "Sold" : "Held right now";
    note.textContent = st === "available"
      ? `Clicking holds it for you for ${drop.holdMinutes} minutes while you check out.`
      : st === "sold" ? "This one found a home. It stays here so you can see what the drop held."
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
    if (myHold && myHold !== no) { alert("You're already holding No. " + myHold + ". Finish or release that one first."); return; }
    const p = pieces.find(x => x.no === no);
    if (status(p) !== "available" && !(holds[no] && holds[no].mine)) return;
    if (!holds[no]) holds[no] = { until: Date.now() + HOLD * 1000, mine: true };
    myHold = no;
    if (detail.open) detail.close();
    $("#c-title").textContent = `No. ${p.no} is held for you`;
    $("#c-name").textContent = p.name;
    $("#c-thumb").innerHTML = sconce(p, true);
    $("#c-price").textContent = money(p.price);
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
    $("#c-total").textContent = money(p.price + s.price);
  }
  $("#c-country").addEventListener("change", updateTotal);
  function release(expired) {
    if (!myHold) return;
    const no = myHold; delete holds[no]; myHold = null;
    if (expired) { co.classList.add("is-expired"); $("#c-title").textContent = `Time's up. No. ${no} is back in the shop.`; }
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
    $("#c-title").textContent = `No. ${no} is yours. Thank you!`;
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
