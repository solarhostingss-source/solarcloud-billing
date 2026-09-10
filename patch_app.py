with open('src/app.js', 'r', encoding='utf-8') as f:
    app_js = f.read()

# Make sure we don't duplicate
if 'helmet' not in app_js:
    # Let's completely rewrite app.js since it's probably simple
    pass

