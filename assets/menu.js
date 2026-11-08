// Phone menu: a button in the top bar opens every page, Guide topic and how-to article.
(() => {
  const SECTIONS = [
    ['Home', [
      ['Features', '/#features'], ['Pricing', '/#pricing'], ['FAQ', '/#faq'], ['Support', '/#support'], ['Privacy', '/#privacy'],
    ]],
    ['Guide', [
      ['Getting started', '/guide.html#start'], ['Screenshots', '/guide.html#capture'], ['Marking up', '/guide.html#markup'],
      ['Screen recording', '/guide.html#recording'], ['Video to GIF', '/guide.html#gif'], ['Finder action', '/guide.html#finder'],
      ['Board', '/guide.html#board'], ['Timeline', '/guide.html#timeline'], ['Reference', '/guide.html#reference'],
      ['Colors', '/guide.html#colors'], ['Projects & tabs', '/guide.html#projects'], ['Settings', '/guide.html#settings'],
      ['Free and Pro', '/guide.html#pro'], ['Keyboard shortcuts', '/guide.html#shortcuts'],
    ]],
    ['How-to', [
      ['Take a screenshot on a Mac', '/how-to/take-a-screenshot-on-mac.html'],
      ['Annotate a screenshot', '/how-to/annotate-a-screenshot-on-mac.html'],
      ['Screen record on a Mac', '/how-to/screen-record-on-mac.html'],
      ['Convert a video to a GIF', '/how-to/convert-video-to-gif-on-mac.html'],
      ['Make a storyboard', '/how-to/make-a-storyboard-on-mac.html'],
      ['Reference board app', '/how-to/reference-board-app-for-mac.html'],
      ['Color palette from an image', '/how-to/color-palette-from-image-on-mac.html'],
      ['All how-to articles', '/how-to/'],
    ]],
  ];

  const style = document.createElement('style');
  style.textContent = `
    .menu { position: fixed; inset: 0; z-index: 50; background: var(--bg); overflow-y: auto; -webkit-overflow-scrolling: touch;
            opacity: 0; transform: translateY(-8px); pointer-events: none; transition: opacity .22s ease, transform .22s ease; }
    .menu.open { opacity: 1; transform: none; pointer-events: auto; }
    .menu .bar { position: sticky; top: 0; display: flex; justify-content: space-between; align-items: center; height: 64px; padding: 0 20px;
                 background: var(--bg); border-bottom: 1px solid var(--line); }
    .menu .bar b { font-size: 17px; }
    .menu .close { width: 34px; height: 34px; border-radius: 9px; border: 1px solid var(--line); background: transparent; color: var(--text);
                   font-size: 20px; line-height: 1; cursor: pointer; }
    .menu .body { padding: 8px 20px 40px; }
    .menu h3 { margin: 24px 0 6px; color: var(--green); font-size: 12px; font-weight: 600; letter-spacing: .14em; text-transform: uppercase; }
    .menu .links { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .menu .links.single { grid-template-columns: 1fr; }
    .menu a { display: block; padding: 12px 14px; border-radius: 11px; background: var(--panel); border: 1px solid var(--line);
              color: var(--text); font-size: 15.5px; text-decoration: none; }
    .menu a:active { border-color: var(--green); }
    .menu .download { margin-top: 26px; text-align: center; background: #20e261; color: #06130a; font-weight: 650; border: 0; }
    html.menu-open, html.menu-open body { overflow: hidden; }
  `;
  document.head.append(style);

  const nav = document.querySelector('header.top nav') || document.querySelector('nav');
  if (!nav) return;

  const menu = document.createElement('div');
  menu.className = 'menu';
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-label', 'Menu');
  const here = location.pathname.replace(/index\.html$/, '');
  menu.innerHTML = `
    <div class="bar"><b>Feedback</b><button class="close" type="button" aria-label="Close menu">×</button></div>
    <div class="body">
      ${SECTIONS.map(([title, links]) => `
        <h3>${title}</h3>
        <div class="links${title === 'How-to' ? ' single' : ''}">
          ${links.map(([label, href]) => `<a href="${href}"${href === here ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
        </div>`).join('')}
      <a class="download" href="https://apps.apple.com/app/id6832037599">Download on the Mac App Store</a>
    </div>`;
  document.body.append(menu);

  let button = nav.querySelector('.menu-btn');
  if (!button) {
    button = document.createElement('button');
    button.type = 'button';
    button.className = 'menu-btn';
    button.setAttribute('aria-label', 'Open menu');
    button.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    nav.append(button);
  }

  const open = () => { menu.classList.add('open'); document.documentElement.classList.add('menu-open'); };
  const close = () => { menu.classList.remove('open'); document.documentElement.classList.remove('menu-open'); };
  button.addEventListener('click', open);
  menu.querySelector('.close').addEventListener('click', close);
  menu.addEventListener('click', e => { if (e.target.closest('a')) close(); });
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
