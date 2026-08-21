// =========================================================
// AURÉA — interaction layer
// =========================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- header on scroll ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 30);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive:true });

  /* ---------- mobile menu ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      toggle.classList.remove('is-open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- ticker: duplicate content for seamless loop ---------- */
  document.querySelectorAll('.ticker-track').forEach(track => {
    track.innerHTML = track.innerHTML + track.innerHTML;
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- process rail fill line ---------- */
  const railFill = document.querySelector('.rail-line-fill');
  if (railFill) {
    const railIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          railFill.style.width = '100%';
          railIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    railIO.observe(railFill);
  }

  /* ---------- count-up stats ---------- */
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = el.getAttribute('data-count');
    const numeric = parseFloat(target);
    const suffix = target.replace(/^[0-9.]+/, '');
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          let start = 0;
          const dur = 1400;
          const startTime = performance.now();
          const step = (now) => {
            const p = Math.min((now - startTime) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            const val = (numeric * eased);
            el.textContent = (Number.isInteger(numeric) ? Math.round(val) : val.toFixed(2)) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          countIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    countIO.observe(el);
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.acc-item').forEach(item => {
    const head = item.querySelector('.acc-head');
    const body = item.querySelector('.acc-body');
    head.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.accordion').querySelectorAll('.acc-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.acc-body').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });

  /* ---------- reviews horizontal scroller ---------- */
  const scroller = document.querySelector('.reviews-scroller');
  const prevBtn = document.querySelector('[data-scroll="prev"]');
  const nextBtn = document.querySelector('[data-scroll="next"]');
  if (scroller && prevBtn && nextBtn) {
    const scrollAmt = () => scroller.querySelector('.review-card').offsetWidth + 22;
    nextBtn.addEventListener('click', () => scroller.scrollBy({ left: scrollAmt(), behavior:'smooth' }));
    prevBtn.addEventListener('click', () => scroller.scrollBy({ left: -scrollAmt(), behavior:'smooth' }));
  }

  /* ---------- quantity stepper ---------- */
  document.querySelectorAll('.qty-stepper').forEach(stepper => {
    const input = stepper.querySelector('input');
    stepper.querySelector('[data-qty="minus"]')?.addEventListener('click', () => {
      input.value = Math.max(1, parseInt(input.value || '1', 10) - 1);
    });
    stepper.querySelector('[data-qty="plus"]')?.addEventListener('click', () => {
      input.value = Math.min(10, parseInt(input.value || '1', 10) + 1);
    });
  });

  /* ---------- add to cart toast + nav count ---------- */
  const toast = document.querySelector('.cart-toast');
  const cartCount = document.querySelector('.cart-count');
  let count = 0;
  document.querySelectorAll('[data-add-to-cart]').forEach(btn => {
    btn.addEventListener('click', () => {
      const qtyEl = document.querySelector('.qty-stepper input');
      const qty = qtyEl ? parseInt(qtyEl.value || '1', 10) : 1;
      count += qty;
      if (cartCount) {
        cartCount.textContent = count;
        cartCount.classList.add('show');
      }
      if (toast) {
        toast.classList.add('show');
        clearTimeout(window.__toastTimer);
        window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
      }
    });
  });
  document.querySelector('.cart-toast-close')?.addEventListener('click', () => {
    toast.classList.remove('show');
  });

  /* ---------- newsletter mock submit ---------- */
  document.querySelectorAll('.nl-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button span');
      const input = form.querySelector('input');
      if (btn && input && input.value) {
        const original = btn.textContent;
        btn.textContent = 'Welcomed.';
        input.value = '';
        setTimeout(() => { btn.textContent = original; }, 2600);
      }
    });
  });

});


/* ---------- Shopify: product gallery thumbs ---------- */
document.addEventListener('DOMContentLoaded', () => {
  const main = document.querySelector('[data-main-image]');
  document.querySelectorAll('[data-thumb]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!main) return;
      main.src = btn.getAttribute('data-thumb');
      document.querySelectorAll('[data-thumb]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  /* variant select -> update price + button */
  const select = document.querySelector('[data-variant-select]');
  if (select) {
    select.addEventListener('change', () => {
      const opt = select.options[select.selectedIndex];
      const priceEl = document.querySelector('[data-price]');
      const btnEl = document.querySelector('[data-add-label]');
      if (priceEl && opt.dataset.price) priceEl.textContent = opt.dataset.price;
      if (btnEl && opt.dataset.price) btnEl.textContent = 'Add to Cart \u2014 ' + opt.dataset.price;
    });
  }
});
