/* ============================================================
   COUNTER ANIMATION — HopeForward NGO
   Counts up numbers when they enter the viewport
   ============================================================ */

(function () {
  'use strict';

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el, target, duration, suffix) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = easeOutQuart(progress) * target;

      el.textContent = isFloat
        ? value.toFixed(1)
        : Math.floor(value).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = isFloat
          ? target.toFixed(1)
          : target.toLocaleString();
        // Append suffix span back
        if (suffix) {
          const span = document.createElement('span');
          span.className = 'suffix';
          span.textContent = suffix;
          el.appendChild(span);
        }
      }
    }

    requestAnimationFrame(update);
  }

  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el       = entry.target;
          const target   = parseFloat(el.dataset.count);
          const duration = parseInt(el.dataset.duration) || 2000;
          const suffix   = el.dataset.suffix || '';

          el.classList.add('counting');
          animateCounter(el, target, duration, suffix);

          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounters);
  } else {
    initCounters();
  }

})();