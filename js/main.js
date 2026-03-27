/* ============================================================
   IKPEMHINOGHENA ETIUZALE — PORTFOLIO JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Footer year ---- */
  const fy = document.getElementById('footerYear');
  if (fy) fy.textContent = new Date().getFullYear();

  /* ============================================================
     THEME TOGGLE
     ============================================================ */
  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'ie-portfolio-theme';

  // Apply saved preference on load
  if (localStorage.getItem(THEME_KEY) === 'light') {
    document.body.classList.add('light-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light-mode');
      localStorage.setItem(THEME_KEY, isLight ? 'light' : 'dark');
    });
  }

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  /* 
  const cursorDot  = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  });

  // Ring follows with lerp for smooth trailing
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = document.querySelectorAll(
    'a, button, .toggle-btn, .work-card, .skill-item, .about-card, .contact-item'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
  });
  */

  /* ============================================================
     NAVBAR
     ============================================================ */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Smooth-scroll internal links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
      closeMobileMenu();
    });
  });

  /* ============================================================
     MOBILE MENU
     ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  function openMobileMenu() {
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
  });
  mobileClose.addEventListener('click', closeMobileMenu);
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
  });

  /* ============================================================
     TYPEWRITER EFFECT
     ============================================================ */
  const twEl = document.getElementById('typewriterEl');
  const roles = [
    'Software Developer',
    'SEO Specialist',
    'Graphic Designer',
    'Video Editor',
    'Creative Technologist'
  ];

  let ri = 0, ci = 0;
  let typing = true;
  let typingTimeout;

  function typeStep() {
    const word = roles[ri];

    if (typing) {
      ci++;
      twEl.textContent = word.slice(0, ci);
      if (ci >= word.length) {
        typing = false;
        typingTimeout = setTimeout(typeStep, 1800);
        return;
      }
    } else {
      ci--;
      twEl.textContent = word.slice(0, ci);
      if (ci === 0) {
        typing = true;
        ri = (ri + 1) % roles.length;
        typingTimeout = setTimeout(typeStep, 300);
        return;
      }
    }

    const speed = typing ? 70 + Math.random() * 40 : 40;
    typingTimeout = setTimeout(typeStep, speed);
  }

  // Start after a short delay for page load feel
  setTimeout(typeStep, 1200);

  /* ============================================================
     WORKS TOGGLE & PAGINATION
     ============================================================ */
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const toggleSlider = document.getElementById('toggleSlider');
  const panes = document.querySelectorAll('.works-pane');

  function updateSlider(btn) {
    const wrap = btn.closest('.works-toggle');
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    toggleSlider.style.left = (btnRect.left - wrapRect.left + 5) + 'px';
    toggleSlider.style.width = (btnRect.width - 10) + 'px';
  }

  // Position slider on active button initially
  const activeBtn = document.querySelector('.toggle-btn.active');
  if (activeBtn) {
    // Wait for layout
    requestAnimationFrame(() => updateSlider(activeBtn));
  }

  /* --- PAGINATION LOGIC --- */
  const cardsPerPage = 6;
  const cardsPerLoad = 3;
  const viewMoreBtn = document.getElementById('viewMoreWorksBtn');

  function updatePagination() {
    const activePane = document.querySelector('.works-pane.active');
    if (!activePane) return;
    
    const allCards = Array.from(activePane.querySelectorAll('.work-card'));
    let currentlyVisible = parseInt(activePane.dataset.visibleCards || cardsPerPage, 10);
    
    let showingAll = true;
    
    allCards.forEach((card, index) => {
      if (index < currentlyVisible) {
        card.style.display = ''; // restore normal flex/block display
      } else {
        card.style.display = 'none';
        card.classList.remove('visible'); // so it can animate again when shown
        showingAll = false;
      }
    });

    if (viewMoreBtn) {
      // Add inline-flex to button container if it has parent, or inline-flex directly depending on HTML structure.
      // Wait, viewMoreBtn is the <button> itself or the container? It's the button inside the container.
      // Easiest is to hide/show its wrapper:
      const wrapper = viewMoreBtn.closest('.works-view-more');
      if (wrapper) wrapper.style.display = showingAll ? 'none' : 'flex';
      else viewMoreBtn.style.display = showingAll ? 'none' : 'inline-flex';
    }
  }

  // Initialize pagination for all panes on load
  panes.forEach(p => p.dataset.visibleCards = cardsPerPage);
  updatePagination();

  if (viewMoreBtn) {
    viewMoreBtn.addEventListener('click', () => {
      const activePane = document.querySelector('.works-pane.active');
      if (!activePane) return;
      
      let currentlyVisible = parseInt(activePane.dataset.visibleCards || cardsPerPage, 10);
      currentlyVisible += cardsPerLoad;
      activePane.dataset.visibleCards = currentlyVisible;
      
      updatePagination();
      
      // Trigger AOS for the newly shown cards
      const allCards = Array.from(activePane.querySelectorAll('.work-card'));
      allCards.forEach((card, index) => {
        if (index >= currentlyVisible - cardsPerLoad && index < currentlyVisible) {
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        }
      });
    });
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;

      // Update button state
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Move slider
      updateSlider(btn);

      // Show matching pane
      panes.forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById('tab-' + tab);
      if (targetPane) {
        targetPane.classList.add('active');
        
        // Reset pagination for the new tab
        targetPane.dataset.visibleCards = cardsPerPage;
        updatePagination();

        // Trigger AOS for visible cards
        targetPane.querySelectorAll('[data-aos]').forEach(el => {
          if (el.style.display !== 'none') {
            el.classList.remove('visible');
            setTimeout(() => el.classList.add('visible'), 50);
          }
        });
      }
    });
  });

  // Recalculate slider on resize
  window.addEventListener('resize', () => {
    const active = document.querySelector('.toggle-btn.active');
    if (active) updateSlider(active);
  });

  /* ============================================================
     SCROLL ANIMATIONS (Intersection Observer)
     ============================================================ */
  const aosEls = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  aosEls.forEach(el => observer.observe(el));

  // Also observe work cards directly
  document.querySelectorAll('.work-card, .about-card, .skill-cat, .contact-item').forEach(el => {
    observer.observe(el);
    el.setAttribute('data-aos', '');
  });

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  const btt = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btt.classList.add('visible');
    } else {
      btt.classList.remove('visible');
    }
  });

  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     CONTACT FORM — Web3Forms
     ============================================================ */
  const contactForm = document.getElementById('contactForm');
  const formStatus  = document.getElementById('formStatus');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async e => {
      e.preventDefault();

      // Button loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending…</span><i class="fa-solid fa-spinner fa-spin"></i>';
      }
      formStatus.className   = 'form-status';
      formStatus.textContent = '';

      try {
        const formData = new FormData(contactForm);
        const object   = Object.fromEntries(formData);
        const json     = JSON.stringify(object);

        const res = await fetch('https://api.web3forms.com/submit', {
          method:  'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept':       'application/json'
          },
          body: json
        });

        const data = await res.json();

        if (res.ok && data.success) {
          formStatus.className = 'form-status success';
          formStatus.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> Message sent! I\'ll get back to you shortly.';
          contactForm.reset();
        } else {
          throw new Error(data.message || 'Submission failed.');
        }
      } catch (err) {
        formStatus.className = 'form-status error';
        formStatus.innerHTML =
          '<i class="fa-solid fa-circle-exclamation"></i> Something went wrong. Please try again or email me directly.';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            '<span id="submitBtnText">Send Message</span><i class="fa-solid fa-paper-plane" id="submitBtnIcon"></i>';
        }

        // Auto-clear status after 6 seconds
        setTimeout(() => {
          if (formStatus) {
            formStatus.textContent = '';
            formStatus.className   = 'form-status';
          }
        }, 6000);
      }
    });
  }

  /* ============================================================
     HERO ENTRANCE ANIMATIONS
     ============================================================ */
  // Stagger hero elements on load
  const heroText = document.querySelector('.hero-text');
  const heroPhoto = document.querySelector('.hero-photo-wrap');

  if (heroText) {
    heroText.style.opacity = '0';
    heroText.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroText.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroText.style.opacity = '1';
      heroText.style.transform = 'translateY(0)';
    }, 200);
  }

  if (heroPhoto) {
    heroPhoto.style.opacity = '0';
    heroPhoto.style.transform = 'translateY(30px)';
    setTimeout(() => {
      heroPhoto.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      heroPhoto.style.opacity = '1';
      heroPhoto.style.transform = 'translateY(0)';
    }, 450);
  }

  /* ============================================================
     PARALLAX — subtle on scroll
     ============================================================ */
  const orbs = document.querySelectorAll('.atm-orb');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = i === 0 ? 0.06 : 0.04;
      orb.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });

  /* ============================================================
     ACTIVE NAV LINK HIGHLIGHTING
     ============================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ============================================================
     HERO SECTION — number counter animation
     ============================================================ */
  function animateCounter(el, target, suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      const num = el.querySelector('.stat-n');
      if (num) {
        const sup = num.querySelector('sup');
        num.textContent = Math.floor(current) + (sup ? '' : '');
        if (sup) num.appendChild(sup);
      }
    }, 25);
  }

  // Trigger counters when stats are visible
  const statsEl = document.querySelector('.hero-stats');
  if (statsEl) {
    const counterObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const stats = [
            { el: statsEl.querySelectorAll('.stat')[0], target: 4 },
            { el: statsEl.querySelectorAll('.stat')[1], target: 50 },
            { el: statsEl.querySelectorAll('.stat')[2], target: 30 },
          ];
          stats.forEach(s => animateCounter(s.el, s.target));
          counterObs.disconnect();
        }
      });
    }, { threshold: 0.5 });
    counterObs.observe(statsEl);
  }

  /* ============================================================
     SKILL ITEMS — staggered entrance
     ============================================================ */
  const skillCats = document.querySelectorAll('.skill-cat');

  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-item').forEach((item, i) => {
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, i * 60);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  skillCats.forEach(cat => skillObserver.observe(cat));

  /* ============================================================
     MODAL FUNCTIONALITY
     ============================================================ */
  const logoModal = document.getElementById('logoModal');
  const modalClose = document.getElementById('modalClose');
  const printsModal = document.getElementById('printsModal');
  const printsModalClose = document.getElementById('printsModalClose');
  const collectionCards = document.querySelectorAll('.design-collection-card');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // Open the right modal when a collection card is clicked
  collectionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.wcard-link[href="#"]')) return;
      const collection = card.getAttribute('data-collection');
      if (collection === 'logos') openModal(logoModal);
      if (collection === 'prints') openModal(printsModal);
    });
  });

  // Close buttons
  if (modalClose) modalClose.addEventListener('click', () => closeModal(logoModal));
  if (printsModalClose) printsModalClose.addEventListener('click', () => closeModal(printsModal));

  // Close on overlay click
  [logoModal, printsModal].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (logoModal && logoModal.classList.contains('active')) closeModal(logoModal);
      if (printsModal && printsModal.classList.contains('active')) closeModal(printsModal);
    }
  });

  /* ============================================================
     LIGHTBOX FUNCTIONALITY (Prints Modal)
     ============================================================ */
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const printItems = document.querySelectorAll('#printsModal .print-item img');

  if (lightboxOverlay && lightboxImg && printItems.length > 0) {
    printItems.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxOverlay.classList.add('active');
      });
    });

    const closeLightbox = () => {
      lightboxOverlay.classList.remove('active');
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    
    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
        closeLightbox();
        e.stopPropagation(); // prevent modal from closing too if possible
      }
    });
  }

});
