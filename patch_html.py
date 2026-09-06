import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

old_form = """        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required placeholder="you@example.com">
        </div>
        <button type="submit" class="submit-btn" id="confirmCheckoutBtn">Continue to Payment</button>"""

new_form = """        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" name="email" required placeholder="you@example.com">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" name="password" required placeholder="Choose a secure password" minlength="8">
        </div>
        <p style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 12px; text-align: center;">These will be your login credentials for panel.solarcloud.lat</p>
        <button type="submit" class="submit-btn" id="confirmCheckoutBtn">Continue to Payment</button>"""

html = html.replace(old_form, new_form)

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
