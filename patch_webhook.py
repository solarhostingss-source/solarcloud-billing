with open('src/controllers/webhook.js', 'r') as f:
    js = f.read()

old_ext = "const { plan, location, nodeId, username, email: customEmail } = payload.custom || {};"
new_ext = "const { plan, location, nodeId, username, password, email: customEmail } = payload.custom || {};"

js = js.replace(old_ext, new_ext)

old_call = "const userId = await pterodactyl.createUser(email, username);"
new_call = "const userId = await pterodactyl.createUser(email, username, password);"

js = js.replace(old_call, new_call)

with open('src/controllers/webhook.js', 'w') as f:
    f.write(js)
