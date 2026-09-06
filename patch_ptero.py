with open('src/controllers/pterodactyl.js', 'r') as f:
    js = f.read()

old_def = "async function createUser(email, providedUsername) {\n  const username = providedUsername || email.split('@')[0] + '_' + Date.now().toString(36);\n  const password = crypto.randomBytes(16).toString('hex');"
new_def = "async function createUser(email, providedUsername, providedPassword) {\n  const username = providedUsername || email.split('@')[0] + '_' + Date.now().toString(36);\n  const password = providedPassword || crypto.randomBytes(16).toString('hex');"

js = js.replace(old_def, new_def)

with open('src/controllers/pterodactyl.js', 'w') as f:
    f.write(js)
