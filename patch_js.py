with open('public/js/app.js', 'r') as f:
    js = f.read()

old_js = """    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;"""

new_js = """    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;"""

js = js.replace(old_js, new_js)

old_body = "body: JSON.stringify({ plan: currentPlan, location: currentLocation, username, email })"
new_body = "body: JSON.stringify({ plan: currentPlan, location: currentLocation, username, email, password })"

js = js.replace(old_body, new_body)

with open('public/js/app.js', 'w') as f:
    f.write(js)
