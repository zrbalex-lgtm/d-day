// Shared helpers: language toggle, light deobfuscation, typewriter effect
const D = (() => {
  const KEY_LANG = "dday-lang";
  let lang = "ru";
  try { lang = localStorage.getItem(KEY_LANG) || "ru"; } catch (e) {}
  const listeners = [];

  function setLang(l) {
    lang = l;
    try { localStorage.setItem(KEY_LANG, l); } catch (e) {}
    document.querySelectorAll(".lang button").forEach(b => b.classList.toggle("on", b.dataset.l === l));
    document.querySelectorAll("[data-ru]").forEach(el => { el.textContent = el.dataset[l]; });
    listeners.forEach(fn => fn(l));
  }

  // XOR-decode a base64 payload with a string key (keeps answers out of plain page source)
  function decode(b64, key) {
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    const k = new TextEncoder().encode(key);
    return new TextDecoder().decode(bytes.map((b, i) => b ^ k[i % k.length]));
  }

  function type(el, text, speed = 35) {
    return new Promise(res => {
      el.textContent = "";
      let i = 0;
      const tick = () => {
        el.textContent = text.slice(0, ++i);
        if (i < text.length) setTimeout(tick, text[i - 1] === "\n" ? speed * 6 : speed); else res();
      };
      tick();
    });
  }

  function progress(barEl, ms) {
    return new Promise(res => {
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / ms);
        barEl.style.width = (k * 100) + "%";
        k < 1 ? requestAnimationFrame(step) : res();
      };
      requestAnimationFrame(step);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".lang button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.l)));
    setLang(lang);
  });

  return { get lang() { return lang; }, onLang: fn => listeners.push(fn), decode, type, progress };
})();
