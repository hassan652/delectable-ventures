// Basic enhancements: nav toggle, scroll progress, scroll reveal, simple carousel
(function () {
  // Theme: apply saved or system preference
  const applyTheme = (t) => {
    const theme = (t === 'light' || t === 'dark') ? t : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
    const btn = document.querySelector('.theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    const sw = document.getElementById('themeSwitch');
    if (sw) {
      sw.checked = theme === 'dark';
      sw.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
    }
  };
  const getPreferredTheme = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  };
  applyTheme(getPreferredTheme());
  const themeBtn = document.querySelector('.theme-toggle');
  themeBtn?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
  const themeSwitch = document.getElementById('themeSwitch');
  themeSwitch?.addEventListener('change', (e) => {
    const next = e.target.checked ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('nav-list');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('open');
    });
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Scroll progress
  const progress = document.getElementById('scrollProgress');
  const onScroll = () => {
    if (!progress) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const p = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progress.style.width = p.toFixed(2) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll reveal
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Simple carousel controls (if added later): buttons with [data-carousel]
  document.querySelectorAll('[data-carousel]')?.forEach((carousel) => {
    const container = carousel.querySelector('.carousel-track');
    const prev = carousel.querySelector('[data-prev]');
    const next = carousel.querySelector('[data-next]');
    const scrollBy = () => container?.scrollBy({ left: container.clientWidth * 0.9, behavior: 'smooth' });
    prev?.addEventListener('click', () => container?.scrollBy({ left: -container.clientWidth * 0.9, behavior: 'smooth' }));
    next?.addEventListener('click', scrollBy);
  });

  // Projects filters
  const filterButtons = document.querySelectorAll('.filters .chip[data-filter]');
  const cards = document.querySelectorAll('.work-card');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.getAttribute('data-filter');
      cards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        const show = f === 'all' || f === cat;
        card.classList.toggle('is-hidden', !show);
      });
    });
  });

  // Modal viewer for projects
  const modal = document.getElementById('projectModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalDesc = document.getElementById('modalDesc');
  const openModal = (title, img, desc) => {
    if (!modal) return;
    modalTitle.textContent = title || 'Project';
    modalImage.src = img || '';
    modalDesc.textContent = desc || '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    // Esc to close
    const onKey = (e) => { if (e.key === 'Escape') closeModal(); };
    modal._onKey = onKey;
    window.addEventListener('keydown', onKey);
  };
  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    if (modal._onKey) window.removeEventListener('keydown', modal._onKey);
  };
  document.querySelectorAll('[data-close]').forEach((el) => el.addEventListener('click', closeModal));
  cards.forEach((card) => {
    card.addEventListener('click', () => {
      openModal(card.getAttribute('data-title'), card.getAttribute('data-image'), card.getAttribute('data-desc'));
    });
  });
})();
