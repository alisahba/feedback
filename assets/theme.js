// Light / dark switch. Dark is the default; the choice is remembered on this browser.
(() => {
  const root = document.documentElement;
  // Images that have a light version: images/x.jpg → images/x-light.jpg
  const SWAP = /images\/(shot-\d|finder|menubar|board-export|reference-export|icon|favicon-32)\.(jpg|png)$/;

  function applyImages(theme) {
    document.querySelectorAll('img').forEach(img => {
      const dark = img.dataset.darkSrc || img.getAttribute('src');
      if (!SWAP.test(dark)) return;
      img.dataset.darkSrc = dark;
      const want = theme === 'light' ? dark.replace(/\.(jpg|png)$/, '-light.$1') : dark;
      if (img.getAttribute('src') !== want) img.setAttribute('src', want);
    });
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#ffffff' : '#0d0e10');
  }

  function setTheme(theme, animate) {
    if (animate) {
      root.classList.add('theme-anim');
      setTimeout(() => root.classList.remove('theme-anim'), 350);
    }
    root.dataset.theme = theme;
    try { localStorage.setItem('theme', theme); } catch (e) {}
    applyImages(theme);
    button.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    button.title = button.getAttribute('aria-label');
  }

  const existing = document.querySelector('.theme-toggle');
  const button = existing || document.createElement('button');
  if (!existing) {
    button.type = 'button';
    button.className = 'theme-toggle';
    button.innerHTML =
      '<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    const nav = document.querySelector('header.top nav') || document.querySelector('nav');
    if (nav) {
      const cta = nav.querySelector('.cta');
      cta ? nav.insertBefore(button, cta) : nav.append(button);
    }
  }
  button.addEventListener('click', () => setTheme(root.dataset.theme === 'light' ? 'dark' : 'light', true));
  setTheme(root.dataset.theme === 'light' ? 'light' : 'dark', false);
})();
