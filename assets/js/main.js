/**
 * LUXORA REALTY - Main Application & VIP Interactions
 * Direct Advisory Desk: +91 85869 76911
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav-links');

  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      mainNav.classList.toggle('active');
    });

    // Close when clicking any nav link
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!mainNav.contains(e.target) && !mobileToggle.contains(e.target)) {
        mainNav.classList.remove('active');
      }
    });
  }

  // Certificate / Award Modal Viewer
  const modal = document.getElementById('certificate-modal');
  const modalImg = document.getElementById('modal-cert-image');
  const modalCaption = document.getElementById('modal-cert-caption');
  const modalClose = document.getElementById('modal-close-btn');

  document.querySelectorAll('.award-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const imgSrc = trigger.getAttribute('data-img');
      const caption = trigger.getAttribute('data-caption');

      if (modal && modalImg && modalCaption) {
        modalImg.src = imgSrc;
        modalCaption.innerText = caption;
        modal.classList.add('active');
      }
    });
  });

  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // Portfolio Filters
  const filterBtns = document.querySelectorAll('.filter-btn');
  const propertyCards = document.querySelectorAll('.property-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      propertyCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterCategory === 'all' || category === filterCategory) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // VIP Form Submission Handling
  const bookingForm = document.getElementById('vip-consultation-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      const name = document.getElementById('form-name')?.value || 'Client';
      const phone = document.getElementById('form-phone')?.value || '';
      const budget = document.getElementById('form-budget')?.value || '';
      const location = document.getElementById('form-location')?.value || '';

      submitBtn.innerHTML = '<span>⏳</span> Securing Confidential Advisory...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = '<span>✔</span> Advisory Request Received';
        submitBtn.style.background = '#2A4734';
        submitBtn.style.color = '#FFFFFF';

        // WhatsApp direct prompt
        const confirmWa = confirm(`Thank you, ${name}!\n\nDeepika Bhardwaj's private advisory desk has received your request.\n\nWould you like to open WhatsApp directly with Deepika Ma'am (+91 85869 76911) for instant priority assistance?`);
        if (confirmWa) {
          const text = encodeURIComponent(`Hello Deepika Ma'am (Luxora Realty), my name is ${name} (${phone}). I have submitted an advisory inquiry for ${location} with a budget of ${budget}. Looking forward to discussing curated developer-direct options.`);
          window.open(`https://wa.me/918586976911?text=${text}`, '_blank');
        }

        bookingForm.reset();
        setTimeout(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
        }, 4000);
      }, 1000);
    });
  }

  // Smooth Active Nav Link Tracking
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('active');
        } else {
          navLink.classList.remove('active');
        }
      }
    });
  });
});
