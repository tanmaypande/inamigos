/* ============================================================
   FORM VALIDATION & SUBMISSION — HopeForward NGO
   ============================================================ */

(function () {
  'use strict';

  /* ── Validation helpers ── */
  const validators = {
    required: val => val.trim() !== '',
    email:    val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    phone:    val => val.trim() === '' || /^[\d\s\+\-\(\)]{7,15}$/.test(val.trim()),
    minLen:   (val, n) => val.trim().length >= n,
  };

  function showError(group, msg) {
    clearError(group);
    group.classList.add('has-error');
    const err = document.createElement('span');
    err.className = 'field-error';
    err.style.cssText = 'font-size:0.78rem;color:#c0392b;margin-top:0.3rem;display:block;';
    err.textContent = msg;
    group.appendChild(err);
    const input = group.querySelector('input, textarea, select');
    if (input) input.style.borderColor = '#c0392b';
  }

  function clearError(group) {
    group.classList.remove('has-error');
    const existing = group.querySelector('.field-error');
    if (existing) existing.remove();
    const input = group.querySelector('input, textarea, select');
    if (input) input.style.borderColor = '';
  }

  function showSuccess(form) {
    const successEl = form.querySelector('.form-success');
    if (successEl) {
      successEl.style.display = 'block';
      successEl.style.animation = 'fadeInUp 0.4s ease both';
    }
  }

  function setLoading(btn, loading) {
    if (loading) {
      btn.dataset.original = btn.textContent;
      btn.textContent = 'Sending…';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    } else {
      btn.textContent = btn.dataset.original || 'Submit';
      btn.disabled = false;
      btn.style.opacity = '';
    }
  }

  /* ── Contact form ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Live validation
    contactForm.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('blur', () => {
        const group = input.closest('.form-group');
        if (!group) return;
        validateField(input, group);
      });

      input.addEventListener('input', () => {
        const group = input.closest('.form-group');
        if (group && group.classList.contains('has-error')) clearError(group);
      });
    });

    contactForm.addEventListener('submit', async e => {
      e.preventDefault();
      let valid = true;

      contactForm.querySelectorAll('.form-group').forEach(group => {
        const input = group.querySelector('input, textarea, select');
        if (!input) return;
        if (!validateField(input, group)) valid = false;
      });

      if (!valid) return;

      const btn = contactForm.querySelector('[type="submit"]');
      setLoading(btn, true);

      // Simulate API call
      await new Promise(r => setTimeout(r, 1500));

      setLoading(btn, false);
      showSuccess(contactForm);
      contactForm.reset();
    });
  }

  function validateField(input, group) {
    const name = input.name || input.id;
    const val  = input.value;

    if (input.hasAttribute('required') && !validators.required(val)) {
      showError(group, 'This field is required.');
      return false;
    }

    if (input.type === 'email' && val.trim() && !validators.email(val)) {
      showError(group, 'Please enter a valid email address.');
      return false;
    }

    if ((name === 'phone' || name === 'tel') && !validators.phone(val)) {
      showError(group, 'Please enter a valid phone number.');
      return false;
    }

    if (input.tagName === 'TEXTAREA' && input.hasAttribute('required') && !validators.minLen(val, 10)) {
      showError(group, 'Please write at least 10 characters.');
      return false;
    }

    clearError(group);
    return true;
  }

  /* ── Donate form ── */
  const donateForm = document.getElementById('donate-form');
  if (donateForm) {
    donateForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = donateForm.querySelector('[type="submit"]');
      const amountInput = document.getElementById('custom-amount');
      const amount = amountInput ? parseFloat(amountInput.value) : 0;

      if (!amount || amount < 1) {
        const group = amountInput?.closest('.form-group');
        if (group) showError(group, 'Please enter a valid donation amount.');
        return;
      }

      setLoading(btn, true);
      await new Promise(r => setTimeout(r, 2000));
      setLoading(btn, false);
      showSuccess(donateForm);
      donateForm.reset();
      document.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
    });
  }

  /* ── Volunteer form ── */
  const volunteerForm = document.getElementById('volunteer-form');
  if (volunteerForm) {
    volunteerForm.addEventListener('submit', async e => {
      e.preventDefault();
      const btn = volunteerForm.querySelector('[type="submit"]');
      setLoading(btn, true);
      await new Promise(r => setTimeout(r, 1500));
      setLoading(btn, false);
      showSuccess(volunteerForm);
      volunteerForm.reset();
    });
  }

})();