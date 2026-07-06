(function () {
  'use strict';

  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');

  /* ===== Sticky Header ===== */
  function handleScroll() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ===== Mobile Navigation ===== */
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* ===== Scroll Reveal Animations ===== */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ===== Animated Counters ===== */
  function animateCounter(element) {
    const target = parseInt(element.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = Math.floor(eased * target);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target;
      }
    }

    requestAnimationFrame(update);
  }

  const statNumbers = document.querySelectorAll('.stat-number');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((el) => counterObserver.observe(el));

  /* ===== Portfolio Filter ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      portfolioItems.forEach((item) => {
        const category = item.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          item.classList.remove('hidden');
          item.style.animation = 'none';
          item.offsetHeight;
          item.style.animation = '';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ===== Testimonials Slider ===== */
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');
  const dotsContainer = document.getElementById('testimonialDots');
  const slides = track.querySelectorAll('.testimonial-card');
  let currentSlide = 0;
  let autoplayInterval;

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('testimonial-dot');
    dot.setAttribute('aria-label', `Go to testimonial ${index + 1}`);
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.testimonial-dot');

  function goToSlide(index) {
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;

    track.style.transform = `translateX(-${currentSlide * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  function startAutoplay() {
    autoplayInterval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 6000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetAutoplay();
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetAutoplay();
  });

  startAutoplay();

  /* ===== Contact Form Validation ===== */
  const validators = {
    name: (value) => {
      if (!value.trim()) return 'Name is required';
      if (value.trim().length < 2) return 'Name must be at least 2 characters';
      return '';
    },
    email: (value) => {
      if (!value.trim()) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Please enter a valid email';
      return '';
    },
    service: (value) => {
      if (!value) return 'Please select a service';
      return '';
    },
    message: (value) => {
      if (!value.trim()) return 'Message is required';
      if (value.trim().length < 10) return 'Message must be at least 10 characters';
      return '';
    },
  };

  function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const errorEl = document.getElementById(`${fieldId}Error`);
    input.classList.toggle('error', !!message);
    errorEl.textContent = message;
  }

  function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const error = validators[fieldId](input.value);
    showError(fieldId, error);
    return !error;
  }

  Object.keys(validators).forEach((fieldId) => {
    const input = document.getElementById(fieldId);
    input.addEventListener('blur', () => validateField(fieldId));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(fieldId);
      }
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const isValid = Object.keys(validators).every((fieldId) => validateField(fieldId));

    if (isValid) {
      const successEl = document.getElementById('formSuccess');
      successEl.hidden = false;
      contactForm.reset();

      setTimeout(() => {
        successEl.hidden = true;
      }, 5000);
    }
  });

  /* ===== Smooth anchor offset for fixed header ===== */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
})();
