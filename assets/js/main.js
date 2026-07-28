/* =========================================================
   Design Inspo — interactions (vanilla JS, no libraries)
   1. Scroll-reveal   2. Tilt-on-hover (Millls-style)   3. Marquee loop
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---- 1. Scroll reveal: fade/slide elements in as they enter view ---- */
(() => {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

  // Reveal anything already in or above the viewport on load (covers reloads that
  // restore scroll past an element, which the observer would otherwise skip).
  items.forEach((el) => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
    else io.observe(el);
  });

  // Safety net: nothing should ever stay invisible if JS/observer hiccups.
  window.addEventListener("load", () => {
    setTimeout(() => items.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("in");
    }), 400);
  });
})();

/* ---- 2. Tilt on hover: image leans toward the cursor ---- */
(() => {
  if (reduceMotion) return;
  const MAX = 8;            // max degrees of tilt
  const targets = document.querySelectorAll("[data-tilt]");

  targets.forEach((el) => {
    let raf = null;

    const onMove = (ev) => {
      const r = el.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width - 0.5;   // -0.5 .. 0.5
      const py = (ev.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform =
          `perspective(900px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg) scale(1.02)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.transform = "perspective(900px) rotateX(0) rotateY(0) scale(1)";
    };

    el.style.transition = "transform .25s cubic-bezier(0.22,1,0.36,1)";
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
  });
})();

/* ---- 3. Marquee: duplicate the track so the loop is seamless ---- */
(() => {
  const track = document.querySelector(".marquee__track");
  if (!track) return;
  track.innerHTML += track.innerHTML;   // clone content once for the -50% loop
})();
