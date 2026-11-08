// Click a screenshot to see it bigger: it grows from where it sits on the page,
// and shrinks back on click, Esc or scroll.
(() => {
  const SELECTOR = '.hero-shot img, .feature img, figure img';
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.2, .8, .2, 1)';
  const DURATION = reduceMotion ? 0 : 420;

  const style = document.createElement('style');
  style.textContent = `
    ${SELECTOR} { cursor: zoom-in; }
    .lb { position: fixed; inset: 0; z-index: 100; cursor: zoom-out;
          background: rgba(6, 7, 8, 0); -webkit-backdrop-filter: blur(0); backdrop-filter: blur(0);
          transition: background ${DURATION}ms ${EASE}, backdrop-filter ${DURATION}ms ${EASE}, -webkit-backdrop-filter ${DURATION}ms ${EASE}; }
    .lb.on { background: rgba(6, 7, 8, .86); -webkit-backdrop-filter: blur(12px); backdrop-filter: blur(12px); }
    .lb img { position: fixed; transform-origin: 0 0; border-radius: 10px; max-width: none;
              box-shadow: 0 30px 80px rgba(0, 0, 0, .55);
              transition: transform ${DURATION}ms ${EASE}; will-change: transform; }
    .lb .hint { position: fixed; left: 0; right: 0; bottom: 18px; text-align: center; color: rgba(255,255,255,.55);
                font: 13px -apple-system, BlinkMacSystemFont, sans-serif; opacity: 0; transition: opacity ${DURATION}ms ${EASE}; }
    .lb.on .hint { opacity: 1; }
  `;
  document.head.append(style);

  let current = null;

  // Where the big image goes: as large as fits, never larger than its real size.
  function target(img) {
    const pad = innerWidth < 700 ? 12 : 48;
    const ratio = (img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight
                : img.getBoundingClientRect().width / img.getBoundingClientRect().height;
    let w = Math.min(innerWidth - pad * 2, img.naturalWidth || Infinity);
    let h = w / ratio;
    if (h > innerHeight - pad * 2) { h = innerHeight - pad * 2; w = h * ratio; }
    return { left: (innerWidth - w) / 2, top: (innerHeight - h) / 2, width: w, height: h };
  }

  function transformFrom(rect, t) {
    return `translate(${rect.left - t.left}px, ${rect.top - t.top}px) scale(${rect.width / t.width}, ${rect.height / t.height})`;
  }

  function open(img) {
    const rect = img.getBoundingClientRect();
    const t = target(img);
    const overlay = document.createElement('div');
    overlay.className = 'lb';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', img.alt || 'Image');
    const big = new Image();
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    Object.assign(big.style, { left: t.left + 'px', top: t.top + 'px', width: t.width + 'px', height: t.height + 'px',
                               transform: transformFrom(rect, t) });
    const hint = document.createElement('div');
    hint.className = 'hint';
    hint.textContent = 'Click anywhere or press Esc to close';
    overlay.append(big, hint);
    document.body.append(overlay);
    img.style.visibility = 'hidden';
    current = { img, overlay, big, t };
    big.getBoundingClientRect();                     // start from the small size
    requestAnimationFrame(() => { overlay.classList.add('on'); big.style.transform = 'none'; });
  }

  function close() {
    if (!current) return;
    const { img, overlay, big, t } = current;
    current = null;
    overlay.classList.remove('on');
    big.style.transform = transformFrom(img.getBoundingClientRect(), t);
    const done = () => { overlay.remove(); img.style.visibility = ''; };
    if (DURATION === 0) done(); else setTimeout(done, DURATION);
  }

  document.addEventListener('click', e => {
    if (current) { e.preventDefault(); close(); return; }
    const img = e.target.closest(SELECTOR);
    if (img && img.complete) { e.preventDefault(); open(img); }
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  addEventListener('wheel', () => close(), { passive: true });
  addEventListener('touchmove', () => close(), { passive: true });
  addEventListener('resize', () => close());
})();
