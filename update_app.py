with open('public/js/app.js', 'r') as f:
    js = f.read()

# Replace the Tebex.checkout.init with a direct redirect for safety, or a popup with fallback
old_code = """          if (data.basketIdent && typeof Tebex !== 'undefined') {
            Tebex.checkout.init({ ident: data.basketIdent });
          }"""
new_code = """          if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          }"""

js = js.replace(old_code, new_code)

with open('public/js/app.js', 'w') as f:
    f.write(js)
