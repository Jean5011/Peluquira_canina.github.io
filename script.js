document.addEventListener('DOMContentLoaded', function () {
  const track = document.querySelector('.carousel-track');
  const items = Array.from(document.querySelectorAll('.carousel-item'));
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');
  const dotsContainer = document.querySelector('.carousel-dots');
  let index = 0;
  let autoplayInterval = null;
  const AUTOPLAY_MS = 5000;

  function createDots() {
    items.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Ir a diapositiva ' + (i + 1));
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(btn);
    });
  }

  function updateDots() {
    const dots = Array.from(dotsContainer.children);
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
  }

  function goTo(i) {
    index = (i + items.length) % items.length;
    const offset = -index * 100;
    track.style.transform = `translateX(${offset}%)`;
    updateDots();
  }

  function next() { goTo(index + 1); }
  function prev() { goTo(index - 1); }

  nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });
  prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });

  function startAutoplay() {
    autoplayInterval = setInterval(next, AUTOPLAY_MS);
  }

  function resetAutoplay() {
    if (autoplayInterval) clearInterval(autoplayInterval);
    startAutoplay();
  }

  // touch support
  let startX = 0;
  let isDragging = false;
  track.addEventListener('pointerdown', (e) => {
    startX = e.clientX;
    isDragging = true;
    track.style.transition = 'none';
  });
  track.addEventListener('pointerup', (e) => {
    if (!isDragging) return;
    const diff = e.clientX - startX;
    track.style.transition = '';
    if (diff < -40) next();
    else if (diff > 40) prev();
    isDragging = false;
    resetAutoplay();
  });

  // init
  createDots();
  startAutoplay();
});