/* ============================================================
   КИНКЭ — main.js
   ============================================================ */

/* ---------- Header: тень при скролле ---------- */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

/* ---------- Burger меню ---------- */
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');

burger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
});

// Закрываем при клике на ссылку
mobileNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

// Закрываем при клике вне меню
document.addEventListener('click', (e) => {
  if (!mobileNav.contains(e.target) && !burger.contains(e.target)) {
    mobileNav.classList.remove('open');
  }
});

/* ---------- Reveal при скролле ---------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ---------- Табы продукции ---------- */
const tabs = document.querySelectorAll('.products__tab');
const panels = document.querySelectorAll('.products__panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('active'));
    panels.forEach(p => p.classList.remove('active'));

    tab.classList.add('active');
    const panel = document.getElementById(`tab-${target}`);
    if (panel) {
      panel.classList.add('active');
      // Лёгкий fade-in
      panel.style.animation = 'none';
      panel.offsetHeight; // reflow
      panel.style.animation = 'tabFadeIn .3s ease';
    }
  });
});

/* Анимация смены таба */
const tabStyle = document.createElement('style');
tabStyle.textContent = `
  @keyframes tabFadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(tabStyle);

/* ---------- Карты зон добычи (Leaflet) ---------- */
const TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const TILE_OPTS = { maxZoom: 19, attribution: '© OpenStreetMap © CARTO' };
const MAP_OPTS = {
  zoomControl: false, scrollWheelZoom: false,
  dragging: false, touchZoom: false,
  doubleClickZoom: false, attributionControl: false
};
const MARKER_STYLE = {
  radius: 7, color: '#2997ff', weight: 2,
  fillColor: '#2997ff', fillOpacity: 0.85
};

if (document.getElementById('map-a')) {
  const mapA = L.map('map-a', { ...MAP_OPTS, center: [57, 151], zoom: 4 });
  L.tileLayer(TILE, TILE_OPTS).addTo(mapA);
  L.circleMarker([57, 151], MARKER_STYLE).addTo(mapA);
}
if (document.getElementById('map-b')) {
  const mapB = L.map('map-b', { ...MAP_OPTS, center: [48.2, 140.5], zoom: 5 });
  L.tileLayer(TILE, TILE_OPTS).addTo(mapB);
  L.circleMarker([48.2, 140.5], MARKER_STYLE).addTo(mapB);
}

/* ---------- Smooth scroll для якорей ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

/* ---------- Hero: плавное появление видео ---------- */
const heroVideo = document.querySelector('.hero__video');
const heroFade  = document.querySelector('.hero__video-fade');
if (heroVideo) {
  heroVideo.playbackRate = 0.7;

  // Плавное появление при загрузке
  const reveal = () => heroVideo.classList.add('hero__video--ready');
  if (heroVideo.readyState >= 3) reveal();
  else heroVideo.addEventListener('canplay', reveal, { once: true });

  // Crossfade на стыке петли через rAF
  const FADE = 1.2; // секунд на затухание/появление
  function loopFade() {
    if (heroVideo.duration && !heroVideo.paused) {
      const t = heroVideo.currentTime;
      const d = heroVideo.duration;
      let opacity = 0;
      if (d - t < FADE) opacity = 1 - (d - t) / FADE; // уход в чёрный
      if (t < FADE)     opacity = Math.max(opacity, 1 - t / FADE); // выход из чёрного
      heroFade.style.opacity = opacity;
    }
    requestAnimationFrame(loopFade);
  }
  requestAnimationFrame(loopFade);
}

/* ---------- Форма обратной связи (EmailJS) ---------- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText    = contactForm.querySelector('.cf-btn-text');
    const btnLoading = contactForm.querySelector('.cf-btn-loading');
    const success    = contactForm.querySelector('.contact__form-success');
    const error      = contactForm.querySelector('.contact__form-error');
    const submitBtn  = contactForm.querySelector('.contact__form-submit');

    // Показываем состояние загрузки
    btnText.hidden    = true;
    btnLoading.hidden = false;
    submitBtn.disabled = true;
    success.hidden = true;
    error.hidden   = true;

    try {
      await emailjs.sendForm('service_gtollbj', 'template_f2f1g9g', contactForm);
      success.hidden = false;
      contactForm.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      error.hidden = false;
    } finally {
      btnText.hidden    = false;
      btnLoading.hidden = true;
      submitBtn.disabled = false;
    }
  });
}
