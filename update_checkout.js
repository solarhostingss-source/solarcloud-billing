const fs = require('fs');
let code = fs.readFileSync('src/controllers/checkout.js', 'utf8');

if (!code.includes("const xss = require('xss');")) {
    code = code.replace("const plans = require('../config/plans');", "const plans = require('../config/plans');\nconst xss = require('xss');");
    
    // Replace: const { plan, location, username, email, password } = req.body;
    code = code.replace("const { plan, location, username, email, password } = req.body;", 
"""    const plan = xss(req.body.plan);
    const location = xss(req.body.location);
    const username = xss(req.body.username);
    const email = xss(req.body.email);
    const password = xss(req.body.password);""");

    fs.writeFileSync('src/controllers/checkout.js', code);
}
