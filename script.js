'use strict';

/* ============================================================
   BEE BUZZ MIAMI — SCRIPT
   ============================================================ */

/* ---------- Page navigation ---------- */
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === name);
  });

  // Reset form state when revisiting these pages
  if (name === 'booking') resetBooking();
  if (name === 'contact') resetContact();

  closeMenu();
}

/* ---------- Navbar scroll shadow ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* ---------- Theme toggle ---------- */
const html = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('bbm-theme', theme);
}

const savedTheme = localStorage.getItem('bbm-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ---------- Hamburger menu ---------- */
const hamburger   = document.getElementById('hamburger');
const navLinksEl  = document.getElementById('navLinks');

function closeMenu() {
  hamburger.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  navLinksEl.classList.remove('open');
}

hamburger.addEventListener('click', () => {
  const isOpen = navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) closeMenu();
});

/* ---------- Honeycomb hero ---------- */
const CELLS = [
  '🐝','🍯','🌸','🌻','🐝','🍀','🌺','🐝','🍯','🌼',
  '🐝','🌸','🍯','🐝','🌻','🐝','🍀','🌺','🐝','🍯',
  '🌼','🐝','🌸','🍯','🐝'
];

function buildHoneycomb() {
  const el = document.getElementById('heroHoneycomb');
  if (!el) return;
  el.innerHTML = '';
  const opacs = [1, 0.75, 0.55, 0.4, 0.65, 0.85, 0.5];
  CELLS.forEach((emoji, i) => {
    const cell = document.createElement('div');
    cell.className = 'hex-cell';
    cell.textContent = emoji;
    cell.style.animationDelay = (i * 0.06) + 's';
    cell.style.opacity = opacs[i % opacs.length];
    el.appendChild(cell);
  });
}

/* ---------- Testimonials slider ---------- */
let currentSlide = 0;
let slideTimer;
let goToSlide;   // exposed so the resize handler can call it

function initSlider() {
  const track  = document.getElementById('sliderTrack');
  const dotsEl = document.getElementById('sliderDots');
  if (!track) return;

  const cards   = track.querySelectorAll('.testimonial-card');
  const count   = cards.length;
  const wrapper = track.parentElement; // .slider-wrapper

  // Build dots
  dotsEl.innerHTML = '';
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => { goToSlide(i); resetTimer(); });
    dotsEl.appendChild(dot);
  }

  // FIX: translateX with a percentage is relative to the element's OWN width.
  // Because the track is display:flex with 5 full-width cards, its own width
  // is 5× the wrapper — so translateX(-100%) would overshoot by 5×.
  // Use pixel offsets derived from the wrapper's rendered width instead.
  goToSlide = function (n) {
    currentSlide = (n + count) % count;
    const cardPx = wrapper.offsetWidth;
    track.style.transform = `translateX(-${currentSlide * cardPx}px)`;
    dotsEl.querySelectorAll('.dot').forEach((d, i) =>
      d.classList.toggle('active', i === currentSlide)
    );
  };

  document.getElementById('sliderPrev').addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetTimer();
  });
  document.getElementById('sliderNext').addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetTimer();
  });

  function resetTimer() {
    clearInterval(slideTimer);
    slideTimer = setInterval(() => goToSlide(currentSlide + 1), 5500);
  }

  // Touch / swipe
  let touchStartX = 0;
  track.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
      resetTimer();
    }
  }, { passive: true });

  goToSlide(0);
  resetTimer();
}

// Recalculate pixel offset whenever the viewport is resized
window.addEventListener('resize', () => {
  if (typeof goToSlide === 'function') goToSlide(currentSlide);
}, { passive: true });

/* ---------- Instagram grid ---------- */
const INSTA_ITEMS = [
  { emoji: '🐝', label: 'Queen sighting!' },
  { emoji: '🍯', label: 'Fresh harvest' },
  { emoji: '🌸', label: 'Pollination' },
  { emoji: '🏚️', label: 'Removal job' },
  { emoji: '🌻', label: 'Apiary day' },
  { emoji: '🐝', label: 'Swarm rescue' },
  { emoji: '🍀', label: 'Miami garden' },
  { emoji: '🌺', label: 'Wild blooms' },
  { emoji: '🍯', label: 'Jar prep' },
];

const INSTA_COLORS = [
  'linear-gradient(135deg,#F5A623,#F7C948)',
  'linear-gradient(135deg,#E8871A,#F5A623)',
  'linear-gradient(135deg,#C46E0E,#E8871A)',
  'linear-gradient(135deg,#D4781A,#F0A020)',
  'linear-gradient(135deg,#A85C10,#D4881A)',
  'linear-gradient(135deg,#F7C948,#FFE080)',
  'linear-gradient(135deg,#8B4A0A,#C46E0E)',
  'linear-gradient(135deg,#E09020,#F5C040)',
  'linear-gradient(135deg,#B86818,#E8921A)',
];

function buildInstagram() {
  const grid = document.getElementById('instaGrid');
  if (!grid) return;

  INSTA_ITEMS.forEach((item, i) => {
    const tile = document.createElement('div');
    tile.className = 'insta-item';
    tile.setAttribute('aria-label', item.label);
    tile.setAttribute('role', 'img');

    const inner = document.createElement('div');
    inner.className = 'insta-inner';
    inner.style.cssText = `background:${INSTA_COLORS[i % INSTA_COLORS.length]};font-size:2.8rem;display:flex;align-items:center;justify-content:center;width:100%;height:100%;`;
    inner.textContent = item.emoji;

    const overlay = document.createElement('div');
    overlay.className = 'insta-overlay';
    overlay.innerHTML = '<i class="fab fa-instagram"></i>';

    tile.appendChild(inner);
    tile.appendChild(overlay);
    tile.addEventListener('click', () =>
      window.open('https://instagram.com', '_blank', 'noopener')
    );
    grid.appendChild(tile);
  });
}

/* ---------- Video modal ---------- */
function openVideo(url) {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  // Safely append autoplay params regardless of whether url already has a query string
  const sep = url.includes('?') ? '&' : '?';
  frame.src = url + sep + 'autoplay=1&rel=0';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeVideo() {
  const modal = document.getElementById('videoModal');
  const frame = document.getElementById('videoFrame');
  modal.classList.remove('open');
  frame.src = '';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeVideo();
});

/* ---------- Booking form ---------- */
function handleBooking(e) {
  e.preventDefault();
  document.getElementById('bookingForm').style.display = 'none';
  document.getElementById('bookingSuccess').classList.add('show');
}

function resetBooking() {
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('bookingSuccess');
  if (!form || !success) return;
  form.reset();
  form.style.display = '';       // remove inline style; let CSS decide
  success.classList.remove('show');
}

/* ---------- Contact form ---------- */
function handleContact(e) {
  e.preventDefault();
  document.getElementById('contactForm').style.display = 'none';
  document.getElementById('contactSuccess').classList.add('show');
}

function resetContact() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  if (!form || !success) return;
  form.reset();
  form.style.display = '';       // remove inline style; let CSS decide
  success.classList.remove('show');
}

/* ---------- Newsletter ---------- */
function handleNewsletter(e) {
  e.preventDefault();
  const el = document.getElementById('newsletterSuccess');
  if (el) { el.classList.add('show'); e.target.reset(); }
}

/* ---------- Booking date minimum ---------- */
function setMinDate() {
  const input = document.querySelector('[name="date"]');
  if (input) input.setAttribute('min', new Date().toISOString().split('T')[0]);
}

/* ---------- Init ---------- */
document.addEventListener('DOMContentLoaded', () => {
  buildHoneycomb();
  initSlider();
  buildInstagram();
  setMinDate();

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === 'home');
  });
});
