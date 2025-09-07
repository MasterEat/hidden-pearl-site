(() => {
  const drawer = document.getElementById('drawer');
  const navToggle = document.querySelector('.nav-toggle');
  if (!drawer || !navToggle) return;

  const overlay = drawer.querySelector('.drawer__overlay');
  const panel = drawer.querySelector('.drawer__panel');
  const submenuToggles = panel.querySelectorAll('.drawer__submenu-toggle');
  const focusableSelector =
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  let firstFocusable, lastFocusable, lastFocused, focusables;

  navToggle.setAttribute('aria-expanded', 'false');
  drawer.setAttribute('aria-hidden', 'true');

  const setFocusable = () => {
    focusables = Array.from(panel.querySelectorAll(focusableSelector));
    firstFocusable = focusables[0];
    lastFocusable = focusables.length > 1 ? focusables[focusables.length - 1] : firstFocusable;
  };

  const openDrawer = () => {
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    document.body.classList.add('drawer-open');
    navToggle.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    setFocusable();
    firstFocusable && firstFocusable.focus();
    document.addEventListener('keydown', handleKeydown);
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    navToggle.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleKeydown);
    lastFocused && lastFocused.focus();
  };

  const handleKeydown = (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
    } else if (e.key === 'Tab' && focusables && focusables.length) {
      setFocusable();
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        (lastFocusable || firstFocusable).focus();
      } else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        (firstFocusable || lastFocusable).focus();
      }
    }
  };

  navToggle.addEventListener('click', () => {
    const open = drawer.classList.contains('is-open');
    open ? closeDrawer() : openDrawer();
  });

  drawer.addEventListener('click', (e) => {
    if (e.target === overlay || e.target.closest('[data-drawer-close]')) {
      closeDrawer();
    }
  });

  panel.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]');
    if (link) closeDrawer();
  });

  submenuToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('aria-controls');
      const submenu = id && document.getElementById(id);
      if (!submenu) return;
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      submenuToggles.forEach((other) => {
        if (other !== btn) {
          const otherId = other.getAttribute('aria-controls');
          const otherMenu = otherId && document.getElementById(otherId);
          if (otherMenu) {
            other.setAttribute('aria-expanded', 'false');
            otherMenu.hidden = true;
          }
        }
      });
      btn.setAttribute('aria-expanded', String(!expanded));
      submenu.hidden = expanded;
    });
  });

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      closeDrawer();
    }
  };
  window.addEventListener('resize', handleResize);
})();

(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    if (window.scrollY > 10) {
      document.body.classList.add('scrolled');
    } else {
      document.body.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

