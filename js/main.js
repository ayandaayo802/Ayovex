/* ============================================
   AYOVEX INTERIOR - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- LOADER ----
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
    initAnimations();
  }, 2200);

  // ---- NAVBAR ----
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    navbar.classList.toggle('menu-open');
    document.body.classList.toggle('no-scroll');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      navbar.classList.remove('menu-open');
      document.body.classList.remove('no-scroll');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  });

  // ---- SCROLL TO TOP ----
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
  });
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- ANIMATIONS (Intersection Observer) ----
  function initAnimations() {
    const animElements = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.getAttribute('data-delay') || 0;
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    animElements.forEach(el => observer.observe(el));
  }

  // ---- ANIMATED COUNTERS ----
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  let countersStarted = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersStarted) {
        countersStarted = true;
        animateCounters();
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stats-grid').forEach(el => counterObserver.observe(el));

  function animateCounters() {
    statNumbers.forEach(num => {
      const target = parseInt(num.getAttribute('data-count'));
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        num.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else num.textContent = target;
      }
      requestAnimationFrame(update);
    });
  }

  // ---- PORTFOLIO FILTERS ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeInUp 0.5s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // ---- LIGHTBOX ----
  const lightbox = document.getElementById('lightbox');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxLocation = document.getElementById('lightbox-location');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');

  const projects = [
    { title: 'Modern Living Room', location: 'Umhlanga, Durban', desc: 'A contemporary living space featuring a custom-built TV wall unit with integrated LED lighting, floating shelves, and premium wooden finishes. The design combines minimalism with warmth.', img: 'images/portfolio/portfolio-1.jpg' },
    { title: 'Luxury TV Unit', location: 'Durban North', desc: 'An elegant entertainment center with backlit panels, hidden cable management, and marble accents. Designed to be the focal point of the living area.', img: 'images/portfolio/portfolio-2.jpg' },
    { title: 'Modern Kitchen', location: 'Ballito', desc: 'A sleek kitchen renovation with handleless cabinetry, quartz countertops, and integrated appliances. Smart storage solutions maximize every inch of space.', img: 'images/portfolio/portfolio-3.jpg' },
    { title: 'Luxury Bedroom Suite', location: 'Durban', desc: 'A complete bedroom transformation with custom headboard wall panel, matching bedside units, and a built-in dresser with soft-close drawers.', img: 'images/portfolio/portfolio-4.jpg' },
    { title: 'Walk-in Closet', location: 'Waterfall, Durban', desc: 'A bespoke walk-in closet with glass-front drawers, LED-lit shelving, shoe display, and a central island with velvet-lined accessory trays.', img: 'images/portfolio/portfolio-5.jpg' },
    { title: 'Corporate Office', location: 'Durban CBD', desc: 'A complete office fit-out featuring custom reception desk, executive boardroom table, workstation pods, and a staff break room with modern kitchenette.', img: 'images/portfolio/portfolio-6.jpg' },
    { title: 'Retail Space', location: 'Pavilion Mall, Durban', desc: 'A premium retail interior with custom display units, illuminated signage, fitting rooms, and a customer lounge area designed for comfort.', img: 'images/portfolio/portfolio-7.jpg' },
    { title: 'Open Plan Living', location: 'Glenwood, Durban', desc: 'An open-plan renovation connecting living, dining, and kitchen areas with a consistent design language of clean lines and neutral tones.', img: 'images/portfolio/portfolio-8.jpg' }
  ];

  let currentProject = 0;

  document.querySelectorAll('.portfolio-view').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentProject = parseInt(btn.getAttribute('data-index'));
      openLightbox();
    });
  });

  document.querySelectorAll('.portfolio-image').forEach((img, i) => {
    img.addEventListener('click', () => {
      currentProject = i;
      openLightbox();
    });
  });

  const lightboxImg = document.getElementById('lightbox-img');

  function openLightbox() {
    const project = projects[currentProject];
    lightboxTitle.textContent = project.title;
    lightboxLocation.textContent = project.location;
    lightboxDesc.textContent = project.desc;
    lightboxImg.src = project.img;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  lightboxPrev.addEventListener('click', () => {
    currentProject = (currentProject - 1 + projects.length) % projects.length;
    openLightbox();
  });

  lightboxNext.addEventListener('click', () => {
    currentProject = (currentProject + 1) % projects.length;
    openLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev.click();
    if (e.key === 'ArrowRight') lightboxNext.click();
  });

  // ---- TESTIMONIALS CAROUSEL ----
  const track = document.getElementById('testimonialTrack');
  const dotsContainer = document.getElementById('testimonialDots');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');
  let currentSlide = 0;
  let slidesPerView = 3;
  let autoPlayInterval;

  function updateSlidesPerView() {
    if (window.innerWidth <= 768) slidesPerView = 1;
    else if (window.innerWidth <= 1024) slidesPerView = 2;
    else slidesPerView = 3;
  }

  function getTotalSlides() {
    return Math.ceil(track.children.length / slidesPerView);
  }

  function buildDots() {
    dotsContainer.innerHTML = '';
    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = `testimonial-dot${i === currentSlide ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  function goToSlide(index) {
    const total = getTotalSlides();
    currentSlide = Math.max(0, Math.min(index, total - 1));
    const slideWidth = track.children[0].offsetWidth + 16;
    const offset = currentSlide * slidesPerView * slideWidth;
    track.style.transform = `translateX(-${offset}px)`;

    dotsContainer.querySelectorAll('.testimonial-dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentSlide);
    });
  }

  prevBtn.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetAutoPlay();
  });

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => {
      const total = getTotalSlides();
      goToSlide((currentSlide + 1) % total);
    }, 5000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }

  updateSlidesPerView();
  buildDots();
  goToSlide(0);
  startAutoPlay();

  window.addEventListener('resize', () => {
    updateSlidesPerView();
    buildDots();
    goToSlide(Math.min(currentSlide, getTotalSlides() - 1));
  });

  // ---- FAQ ACCORDION ----
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ---- CONTACT FORM ----
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const successClose = document.getElementById('successClose');
  const submitBtn = contactForm.querySelector('button[type="submit"]');

  const serviceLabels = {
    wardrobes: 'Built-in Wardrobes', 'tv-units': 'Luxury TV Wall Units',
    kitchens: 'Kitchen Cabinets', bedroom: 'Bedroom Cupboards',
    shelves: 'Floating Shelves', ceilings: 'Ceiling Designs',
    office: 'Office Interiors', reception: 'Reception Areas',
    bathroom: 'Bathroom Vanities', panels: 'Wall Panels',
    renovations: 'Home Renovations', commercial: 'Commercial Design'
  };

  function validateField(field) {
    const value = field.value.trim();
    let valid = true;

    if (field.hasAttribute('required') && !value) valid = false;
    if (field.type === 'email' && value) valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    if (field.type === 'tel' && value) valid = /^[\d\s\+\-\(\)]{7,}$/.test(value);
    if (field.tagName === 'SELECT' && field.hasAttribute('required') && !value) valid = false;

    field.classList.toggle('error', !valid);
    return valid;
  }

  contactForm.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    contactForm.querySelectorAll('input[required], textarea[required], select[required]').forEach(field => {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      const firstError = contactForm.querySelector('.error');
      if (firstError) {
        firstError.focus();
        firstError.style.animation = 'none';
        firstError.offsetHeight;
        firstError.style.animation = 'shake 0.4s ease';
      }
      return;
    }

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    data.service = serviceLabels[data.service] || data.service;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch('https://jedccblbeowvvucauxqp.supabase.co/functions/v1/send-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        formSuccess.classList.add('show');
        contactForm.reset();
      } else {
        alert(result.error || 'Failed to send. Please try again.');
      }
    })
    .catch(() => {
      alert('Network error. Please try again or contact us directly.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Submit Quote Request';
    });
  });

  // Close success message
  successClose.addEventListener('click', () => {
    formSuccess.classList.remove('show');
  });

  // ---- MOBILE CALL BUTTON ----
  const callFloat = document.querySelector('.call-float');
  function checkMobile() {
    if (window.innerWidth <= 768) {
      callFloat.style.display = 'flex';
    } else {
      callFloat.style.display = 'none';
    }
  }
  checkMobile();
  window.addEventListener('resize', checkMobile);

  // ---- SMOOTH SCROLL FOR ALL ANCHOR LINKS ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---- PARALLAX HERO ----
  const heroBg = document.querySelector('.hero-bg');
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight) {
      heroBg.style.transform = `scale(1.05) translateY(${window.scrollY * 0.3}px)`;
    }
  });

});

// ---- FADE IN UP KEYFRAME (injected) ----
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);
