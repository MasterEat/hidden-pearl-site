// Mobile off-canvas drawer logic
(function(){
  const drawer = document.querySelector('.drawer');
  const overlay = document.querySelector('.overlay');
  const toggleBtn = document.querySelector('[aria-controls="drawer"]');
  if(!drawer || !overlay || !toggleBtn) return;

  const closeBtn = drawer.querySelector('.drawer__close');
  const focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  let lastFocused = null;

  function openDrawer(){
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    overlay.classList.add('is-open');
    document.body.classList.add('drawer-open');
    toggleBtn.setAttribute('aria-expanded','true');
    const firstFocusable = drawer.querySelector(focusableSelectors);
    firstFocusable && firstFocusable.focus();
  }

  function closeDrawer(){
    drawer.classList.remove('is-open');
    overlay.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    toggleBtn.setAttribute('aria-expanded','false');
    if(lastFocused) lastFocused.focus();
  }

  toggleBtn.addEventListener('click', () => {
    const open = drawer.classList.contains('is-open');
    open ? closeDrawer() : openDrawer();
  });

  closeBtn && closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(link => link.addEventListener('click', closeDrawer));

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && drawer.classList.contains('is-open')){
      closeDrawer();
    }
  });

  // focus trap
  drawer.addEventListener('keydown', (e) => {
    if(e.key !== 'Tab') return;
    const focusable = Array.from(drawer.querySelectorAll(focusableSelectors));
    if(focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if(e.shiftKey && document.activeElement === first){
      e.preventDefault();
      last.focus();
    }else if(!e.shiftKey && document.activeElement === last){
      e.preventDefault();
      first.focus();
    }
  });

  // accordion menus
  drawer.querySelectorAll('.drawer__nav button[aria-controls]').forEach(btn => {
    const menu = document.getElementById(btn.getAttribute('aria-controls'));
    if(!menu) return;
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open', !expanded);
      if(!expanded){
        menu.style.maxHeight = menu.scrollHeight + 'px';
      }else{
        menu.style.maxHeight = 0;
      }
    });
  });
})();
