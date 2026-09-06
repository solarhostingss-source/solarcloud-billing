import re

with open('public/js/app.js', 'r') as f:
    js = f.read()

# Replace the click listener on .buy-button
old_click = """  document.querySelectorAll('.buy-button').forEach(button => {
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
  });"""

new_click = """  const modal = document.getElementById('checkoutModal');
  const closeModal = document.getElementById('closeModal');
  const checkoutForm = document.getElementById('checkoutForm');
  const confirmBtn = document.getElementById('confirmCheckoutBtn');
  
  let currentPlan = '';
  let currentLocation = '';

  document.querySelectorAll('.buy-button').forEach(button => {
    button.addEventListener('click', (e) => {
      const btn = e.target;
      currentPlan = btn.getAttribute('data-plan');
      const card = btn.closest('.plan-card');
      const select = card.querySelector('.location-select');
      currentLocation = select ? select.value : 'default';
      
      modal.classList.add('active');
    });
  });

  closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  });

  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;

    const originalText = confirmBtn.textContent;
    confirmBtn.textContent = 'Processing...';
    confirmBtn.disabled = true;

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan: currentPlan, location: currentLocation, username, email })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
        }
      } else {
        alert('Error starting checkout. Please try again.');
      }
    } catch (error) {
      console.error(error);
      alert('Network error.');
    } finally {
      confirmBtn.textContent = originalText;
      confirmBtn.disabled = false;
    }
  });"""

js = js.replace(old_click, new_click)

with open('public/js/app.js', 'w') as f:
    f.write(js)
