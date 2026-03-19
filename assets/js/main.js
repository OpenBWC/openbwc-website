// OpenBWC Modern JavaScript

// Theme Management
const themeManager = {
  init() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.setTheme(this.theme);
    this.bindEvents();
  },

  setTheme(theme) {
    this.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle state
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.checked = theme === 'dark';
    }
  },

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  },

  bindEvents() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('change', () => this.toggleTheme());
    }
  }
};

// Mobile Menu Management
const mobileMenu = {
  init() {
    this.menuBtn = document.getElementById('mobile-menu-btn');
    this.menu = document.getElementById('mobile-menu');
    this.isOpen = false;
    
    if (!this.menuBtn || !this.menu) {
      console.warn('Mobile menu elements not found');
      return;
    }
    
    this.bindEvents();
  },

  toggle() {
    this.isOpen = !this.isOpen;
    this.menu.classList.toggle('active', this.isOpen);
    this.updateButton();
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = this.isOpen ? 'hidden' : '';
    
    // Add aria-expanded for accessibility
    this.menuBtn.setAttribute('aria-expanded', this.isOpen);
  },

  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.menu.classList.remove('active');
    this.updateButton();
    document.body.style.overflow = '';
    this.menuBtn.setAttribute('aria-expanded', 'false');
  },

  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.menu.classList.add('active');
    this.updateButton();
    document.body.style.overflow = 'hidden';
    this.menuBtn.setAttribute('aria-expanded', 'true');
  },

  updateButton() {
    const icon = this.menuBtn.querySelector('svg');
    if (this.isOpen) {
      // X icon for close
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />';
    } else {
      // Hamburger icon
      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />';
    }
  },

  bindEvents() {
    // Toggle on button click
    this.menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });
    
    // Close menu when clicking on a link
    const links = this.menu.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        this.close();
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && 
          !this.menu.contains(e.target) && 
          !this.menuBtn.contains(e.target)) {
        this.close();
      }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
    
    // Close menu on window resize to desktop
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth > 768 && this.isOpen) {
          this.close();
        }
      }, 250);
    });
    
    // Prevent menu close when interacting with menu itself
    this.menu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
};

// Active Navigation Highlighting
const navigationHighlight = {
  init() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }
};

// Scroll Effects
const scrollEffects = {
  init() {
    this.header = document.querySelector('header');
    this.handleScroll();
    window.addEventListener('scroll', () => this.handleScroll());
  },

  handleScroll() {
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }
};

// Intersection Observer for Animations
const animateOnScroll = {
  init() {
    const elements = document.querySelectorAll('.card, .timeline-item, .team-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
  }
};

// Typed.js Initialization
const typedText = {
  init() {
    const typedElement = document.getElementById('typed-headline');
    if (!typedElement || typeof Typed === 'undefined') return;
    
    new Typed('#typed-headline', {
      strings: [
        'Open Body-Worn Camera',
        'Ethical AI Analysis',
        'Evidence-Based Reform',
        'Transparent Policing'
      ],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 2000,
      loop: true,
      showCursor: true,
      cursorChar: '|'
    });
  }
};

// Form Handling
  const contactForm = {
  init() {
    const form = document.getElementById('my-form'); // Using the ID we added earlier
    if (!form) return;
    
    form.addEventListener('submit', (e) => this.handleSubmit(e));
  },

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const status = document.getElementById("my-form-status");
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // 1. Capture Form Data
    const formData = new FormData(form);
    
    // 2. UI: Show loading state
    // We target a span or the firstChild so we don't destroy the SVG icon
    const originalHTML = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;
    
    // 3. The Actual Request
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success Logic
        status.innerHTML = "Success! We've received your message.";
        status.style.color = "var(--accent-teal)";
        form.reset();
      } else {
        // Server-side error logic (e.g., invalid email)
        const data = await response.json();
        if (data.errors) {
          status.innerHTML = data.errors.map(err => err.message).join(", ");
        } else {
          status.innerHTML = "Oops! Something went wrong.";
        }
        status.style.color = "#ff4b2b"; // A bright red/orange
      }
    } catch (error) {
      // Network error logic
      status.innerHTML = "Network error. Please try again later.";
      status.style.color = "#ff4b2b";
    } finally {
      // 4. Reset Button State
      submitBtn.innerHTML = originalHTML;
      submitBtn.disabled = false;
    }
  }
};
// const contactForm = {
//   init() {
//     const form = document.querySelector('form');
//     if (!form) return;
    
//     form.addEventListener('submit', (e) => this.handleSubmit(e));
//   },

//   async handleSubmit(e) {
//     e.preventDefault();
    
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData);
    
//     // Show loading state
//     const submitBtn = e.target.querySelector('button[type="submit"]');
//     const originalText = submitBtn.textContent;
//     submitBtn.textContent = 'Sending...';
//     submitBtn.disabled = true;
    
//     // Simulate form submission (replace with actual endpoint)
//     setTimeout(() => {
//       alert('Thank you for your message! We will get back to you soon.');
//       e.target.reset();
//       submitBtn.textContent = originalText;
//       submitBtn.disabled = false;
//     }, 1000);
//   }
// };


// Smooth Scroll for Anchor Links
const smoothScroll = {
  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });
  }
};

// Body-Worn Camera SVG Animation
const bwcAnimation = {
  init() {
    const recLight = document.getElementById('bwc-rec-light');
    const shutter = document.getElementById('bwc-shutter');
    
    if (!recLight || !shutter) return;
    
    // Blinking red light
    setInterval(() => {
      recLight.style.opacity = recLight.style.opacity === '0.3' ? '1' : '0.3';
    }, 800);
    
    // Subtle shutter animation
    let direction = 1;
    setInterval(() => {
      const currentY = parseInt(shutter.getAttribute('y')) || 45;
      const newY = currentY + direction;
      
      if (newY >= 50 || newY <= 40) {
        direction *= -1;
      }
      
      shutter.setAttribute('y', newY);
    }, 100);
  }
};

// Performance Monitoring
const performanceMonitor = {
  init() {
    // Log page load performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0];
      if (perfData) {
        console.log(`Page loaded in ${perfData.loadEventEnd - perfData.fetchStart}ms`);
      }
    });
  }
};

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
  themeManager.init();
  mobileMenu.init();
  navigationHighlight.init();
  scrollEffects.init();
  animateOnScroll.init();
  typedText.init();
  contactForm.init();
  smoothScroll.init();
  bwcAnimation.init();
  
  // Performance monitoring in development
  if (window.location.hostname === 'localhost') {
    performanceMonitor.init();
  }
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    // Close mobile menu on desktop
    if (window.innerWidth > 768 && mobileMenu.isOpen) {
      mobileMenu.close();
    }
  }, 250);
});

// Export for use in other scripts
window.OpenBWC = {
  theme: themeManager,
  menu: mobileMenu
};