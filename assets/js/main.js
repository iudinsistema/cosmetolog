(function () {
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

  document.querySelectorAll('[data-book-cta-toggle]').forEach((btn) => {
    const panel = btn.parentElement?.querySelector('[data-book-cta-panel]');
    if (!panel) return;

    btn.addEventListener('click', () => {
      const open = panel.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!open));
    });

    document.addEventListener('click', (event) => {
      if (!btn.parentElement?.contains(event.target)) {
        panel.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
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

  document.querySelectorAll('[data-gallery]').forEach((gallery) => {
    const lightbox = gallery.querySelector('[data-gallery-lightbox]');
    const image = lightbox?.querySelector('.gallery-lightbox__image');
    const caption = lightbox?.querySelector('.gallery-lightbox__caption');
    if (!lightbox || !image) return;

    let lastFocus = null;

    const closeLightbox = () => {
      lightbox.hidden = true;
      lightbox.classList.remove('is-open');
      document.body.classList.remove('gallery-lightbox-open');
      image.removeAttribute('src');
      image.alt = '';
      if (caption) caption.textContent = '';
      if (lastFocus) {
        lastFocus.focus();
        lastFocus = null;
      }
    };

    const openLightbox = (trigger) => {
      lastFocus = trigger;
      image.src = trigger.dataset.src || '';
      image.alt = trigger.dataset.alt || '';
      if (caption) caption.textContent = trigger.dataset.caption || '';
      lightbox.hidden = false;
      lightbox.classList.add('is-open');
      document.body.classList.add('gallery-lightbox-open');
      lightbox.querySelector('[data-gallery-close]')?.focus();
    };

    gallery.querySelectorAll('[data-gallery-open]').forEach((trigger) => {
      trigger.addEventListener('click', () => openLightbox(trigger));
    });

    lightbox.querySelectorAll('[data-gallery-close]').forEach((btn) => {
      btn.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', (event) => {
      if (!lightbox.hidden && event.key === 'Escape') closeLightbox();
    });
  });
})();
