// Mobile navigation
const btnNavEl = document.querySelector('.btn-mobile-nav');
const headerEl = document.querySelector('.header');

btnNavEl.addEventListener('click', function () {
  headerEl.classList.toggle('nav-open');
});

// Smooth scrolling animation
const allLinks = document.querySelectorAll('a:link');

allLinks.forEach(function (link) {
  link.addEventListener('click', function (e) {
    const href = link.getAttribute('href');

    // Scroll back to top
    if (href === '#') {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }

    // Scroll to other links
    if (href !== '#' && href.startsWith('#')) {
      e.preventDefault();
      const sectionEl = document.querySelector(href);
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: 'smooth' });
      }
    }

    // Close mobile navigation
    if (link.classList.contains('main-nav-link')) {
      headerEl.classList.toggle('nav-open');
    }
  });
});

// Sticky navigation
const sectionHeroEl = document.querySelector('.section-hero');

if (sectionHeroEl) {
  const obs = new IntersectionObserver(
    function (entries) {
      const ent = entries[0];

      if (ent.isIntersecting === false) {
        document.body.classList.add('sticky');
      }

      if (ent.isIntersecting === true) {
        document.body.classList.remove('sticky');
      }
    },
    {
      root: null,
      threshold: 0,
      rootMargin: '-80px',
    }
  );
  obs.observe(sectionHeroEl);
}

// Form submission
const ctaForm = document.querySelector('.cta-form');
if (ctaForm) {
  ctaForm.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    
    alert(`Спасибо, ${name}! Ваше сообщение отправлено. Мы свяжемся с вами по адресу ${email}.`);
    this.reset();
  });
}

// Current year for copyright
const yearEl = document.querySelector('.copyright');
if (yearEl) {
  const currentYear = new Date().getFullYear();
  yearEl.textContent = yearEl.textContent.replace('2024', currentYear);
}

// Project hover effects
const projectEls = document.querySelectorAll('.project');
projectEls.forEach(project => {
  project.addEventListener('mouseenter', function () {
    this.style.transform = 'translateY(-1.2rem)';
  });
  
  project.addEventListener('mouseleave', function () {
    this.style.transform = 'translateY(0)';
  });
});

// Add loading animation to project buttons
const projectButtons = document.querySelectorAll('.project .btn');
projectButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    if (this.getAttribute('href') && !this.getAttribute('href').startsWith('#')) {
      this.innerHTML = '<span class="loading">Загрузка...</span>';
      setTimeout(() => {
        this.innerHTML = 'Запустить проект';
      }, 2000);
    }
  });
});