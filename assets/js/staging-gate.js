/* =========================================================
   Staging password screen
   - Only runs on staging.laurenmakes.com (and localhost for testing).
     On laurenmakes.com it does nothing, so it's harmless if this file
     ever gets merged to production.
   - Once the right password is entered, this browser remembers it,
     so every other page opens without asking again.
   - This is a "please knock" sign, not real security: it keeps out
     casual visitors and search engines, not a determined snoop.
   To change the password: put the SHA-256 hash of the new password in
   PASS_HASH (e.g. `printf %s 'newpassword' | shasum -a 256`).
   ========================================================= */
(function () {
  var HOSTS = ["staging.laurenmakes.com", "localhost", "127.0.0.1"];
  if (HOSTS.indexOf(location.hostname) === -1) return;

  var PASS_HASH = "f8e372ad521ceb6264abfad117fdea4051a75a2bf2fd73af93f04e4f5f3abaa3";
  var KEY = "lm-staging-ok";

  // Keep staging out of search results.
  var robots = document.createElement("meta");
  robots.name = "robots"; robots.content = "noindex, nofollow";
  document.head.appendChild(robots);

  function remembered() { try { return localStorage.getItem(KEY) === PASS_HASH; } catch (e) { return false; } }
  if (remembered()) return;

  // Hide the page until the password is entered.
  var hide = document.createElement("style");
  hide.textContent = "body{visibility:hidden !important}";
  document.head.appendChild(hide);

  async function sha256(text) {
    var buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, "0"); }).join("");
  }

  function show() {
    var gate = document.createElement("div");
    gate.setAttribute("role", "dialog");
    gate.setAttribute("aria-label", "Staging password");
    gate.innerHTML =
      '<style>' +
      '.lm-gate{position:fixed;inset:0;z-index:2147483647;visibility:visible;display:grid;place-items:center;padding:16px;' +
      'background:#fdfdfc;background-image:linear-gradient(to right,rgba(20,20,26,.05) 1px,transparent 1px),linear-gradient(to bottom,rgba(20,20,26,.05) 1px,transparent 1px);background-size:46px 46px;' +
      'font-family:"Space Mono",ui-monospace,monospace;color:#1a1712}' +
      '.lm-gate form{width:min(360px,100%);background:#fff;border:1.5px solid #1a1712;border-radius:16px;box-shadow:8px 8px 0 #80A4ED;padding:1.6rem;text-align:center}' +
      '.lm-gate svg{width:44px;height:44px;margin:0 auto .6rem;display:block}' +
      '.lm-gate p{margin:0 0 1rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase}' +
      '.lm-gate input{width:100%;font:inherit;font-size:1rem;padding:.7rem .9rem;border:1.5px solid #1a1712;border-radius:999px;text-align:center;outline:none}' +
      '.lm-gate input:focus{box-shadow:0 0 0 3px #80A4ED}' +
      '.lm-gate button{margin-top:.8rem;width:100%;font:inherit;font-weight:700;font-size:.8rem;letter-spacing:.14em;text-transform:uppercase;padding:.8rem;border-radius:999px;border:0;background:#1a1712;color:#fff;cursor:pointer}' +
      '.lm-gate button:hover{background:#3a5bbf}' +
      '.lm-gate .err{margin:.8rem 0 0;color:#b3654a;min-height:1em;letter-spacing:.08em}' +
      '</style>' +
      '<form autocomplete="off">' +
      '<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M50 2Q62.1 20.7 83.9 16.1Q79.3 37.9 98 50Q79.3 62.1 83.9 83.9Q62.1 79.3 50 98Q37.9 79.3 16.1 83.9Q20.7 62.1 2 50Q20.7 37.9 16.1 16.1Q37.9 20.7 50 2Z" fill="#80A4ED" stroke="#1a1712" stroke-width="4" stroke-linejoin="round"/></svg>' +
      '<p>laurenmakes · staging</p>' +
      '<input type="password" aria-label="Password" placeholder="password" autofocus />' +
      '<button type="submit">Come on in →</button>' +
      '<p class="err" aria-live="polite"></p>' +
      '</form>';
    gate.className = "lm-gate";
    document.documentElement.appendChild(gate);
    var input = gate.querySelector("input"), err = gate.querySelector(".err");
    input.focus();
    gate.querySelector("form").addEventListener("submit", async function (e) {
      e.preventDefault();
      if ((await sha256(input.value)) === PASS_HASH) {
        try { localStorage.setItem(KEY, PASS_HASH); } catch (x) {}
        gate.remove(); hide.remove();
      } else {
        err.textContent = "Not quite. Try again.";
        input.select();
      }
    });
  }
  if (document.body) show(); else document.addEventListener("DOMContentLoaded", show);
})();
