with open('src/controllers/checkout.js', 'r') as f:
    js = f.read()

old_ext = "const { plan, location, username, email } = req.body;"
new_ext = "const { plan, location, username, email, password } = req.body;"

js = js.replace(old_ext, new_ext)

old_custom = "custom: { plan, location, nodeId, username: req.body.username, email: req.body.email }"
new_custom = "custom: { plan, location, nodeId, username: req.body.username, email: req.body.email, password: req.body.password }"

js = js.replace(old_custom, new_custom)

with open('src/controllers/checkout.js', 'w') as f:
    f.write(js)
