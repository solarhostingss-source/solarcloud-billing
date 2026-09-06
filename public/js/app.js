document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    observer.observe(el);
  });

  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const faqItem = button.parentElement;
      const isOpen = faqItem.classList.contains('open');
      
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('open');
      });

      if (!isOpen) {
        faqItem.classList.add('open');
      }
    });
  });

  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', async (e) => {
      const btn = e.target;
      const plan = btn.getAttribute('data-plan');
      const card = btn.closest('.plan-card');
      const select = card.querySelector('.location-select');
      const location = select ? select.value : 'default';

      const originalText = btn.textContent;
      btn.textContent = 'Processing...';
      btn.disabled = true;

      try {
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ plan, location })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  });

  document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
});
