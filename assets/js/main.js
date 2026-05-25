(function () {
  const THEME_KEY = 'ya-theme';
  const root = document.documentElement;

  function getTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function setTheme(theme) {
    const next = theme === 'light' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    const meta = document.getElementById('meta-theme-color') || document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'light' ? '#ffffff' : '#0c0c0c');
  }

  document.querySelectorAll('#theme-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      setTheme(getTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  const burger = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('hidden');
      burger.setAttribute('aria-expanded', String(!open));
    });
  }

  document.querySelectorAll('[data-submenu-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-submenu-toggle');
      const panel = document.getElementById(id);
      if (panel) panel.classList.toggle('hidden');
    });
  });

  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('cookie-accept');
  if (cookieBanner && cookieAccept) {
    if (localStorage.getItem('ya-cookie-ok')) {
      cookieBanner.classList.add('is-hidden');
    }
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('ya-cookie-ok', '1');
      cookieBanner.classList.add('is-hidden');
    });
  }

  if (typeof Swiper !== 'undefined') {
    document.querySelectorAll('.review-swiper').forEach((el) => {
      new Swiper(el, {
        slidesPerView: 1,
        spaceBetween: 16,
        pagination: { el: el.querySelector('.swiper-pagination'), clickable: true },
        breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
      });
    });
  }

  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    });
  }
})();
