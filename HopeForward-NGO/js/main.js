/* ============================================================
   MAIN JS — HopeForward NGO
   Navigation, Scroll Reveal, Mobile Menu, General interactions
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar scroll state ── */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  /* ── Active nav link ── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ── Mobile hamburger ── */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks  = document.querySelector('.nav-links');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open);
      // Animate spans
      const spans = hamburger.querySelectorAll('span');
      if (open) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  /* ── Scroll Reveal (Intersection Observer) ── */
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const revealEls = document.querySelectorAll(revealClasses.join(', '));

  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  /* ── Progress bars animate on scroll ── */
  const progressBars = document.querySelectorAll('.progress-fill');
  if (progressBars.length) {
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.width;
          entry.target.style.width = target + '%';
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
      const w = bar.style.width;
      bar.dataset.width = parseInt(w);
      bar.style.width = '0%';
      barObserver.observe(bar);
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href');
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight + 20 : 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── Gallery lightbox ── */
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (galleryItems.length) {
    // Simple lightbox overlay
    const overlay = document.createElement('div');
    overlay.id = 'lightbox';
    overlay.style.cssText = `
      display:none; position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,0.92); align-items:center; justify-content:center;
      cursor:zoom-out;
    `;

    const img = document.createElement('img');
    img.style.cssText = 'max-width:90vw; max-height:90vh; border-radius:8px; box-shadow:0 20px 60px rgba(0,0,0,0.5);';
    overlay.appendChild(img);
    document.body.appendChild(overlay);

    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const src = item.querySelector('img')?.src;
        if (!src) return;
        img.src = src;
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      });
    });

    overlay.addEventListener('click', () => {
      overlay.style.display = 'none';
      document.body.style.overflow = '';
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') { overlay.style.display = 'none'; document.body.style.overflow = ''; }
    });
  }

  /* ── Donate amount buttons ── */
  const amountBtns = document.querySelectorAll('.amount-btn');
  const customInput = document.getElementById('custom-amount');

  if (amountBtns.length) {
    amountBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        amountBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (customInput && btn.dataset.amount !== 'custom') {
          customInput.value = btn.dataset.amount;
        } else if (customInput) {
          customInput.value = '';
          customInput.focus();
        }
      });
    });
  }

  /* ── Newsletter form ── */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      if (input && input.value.trim()) {
        const btn = form.querySelector('button');
        btn.textContent = '✓ Done!';
        btn.style.background = '#2a6b6b';
        input.value = '';
        setTimeout(() => {
          btn.textContent = '→';
          btn.style.background = '';
        }, 3000);
      }
    });
  });

  /* ── Tooltip on stat items ── */
  document.querySelectorAll('.stat-item').forEach(item => {
    item.style.cursor = 'default';
  });

})();