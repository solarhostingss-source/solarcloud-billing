const plans = require('../config/plans');
const xss = require('xss');

module.exports = async (req, res) => {
  try {
        const plan = xss(req.body.plan);
    const location = xss(req.body.location);
    const username = xss(req.body.username);
    const email = xss(req.body.email);
    const password = req.body.password; // Passwords should not be mangled by XSS if they contain special chars, but let's sanitize it gently or trust Tebex custom payload filtering. Actually XSS is for HTML rendering. But since Pterodactyl receives it, we should pass it raw, or strip HTML tags.
    // Let's use xss for all to be safe, except maybe password.
    const cleanPassword = xss(req.body.password);
    const planConfig = plans[plan];
    
    if (!planConfig) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    const nodeId = location === 'colombia' ? process.env.NODE_COLOMBIA : process.env.NODE_USA;
    
    // 1. Create Basket
    const basketRes = await fetch(`https://headless.tebex.io/api/accounts/${process.env.TEBEX_PUBLIC_TOKEN}/baskets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: req.body.email,
        complete_url: 'https://billing.solarcloud.lat?status=complete',
        cancel_url: 'https://billing.solarcloud.lat?status=cancel',
        custom: { plan, location, nodeId, username: req.body.username, email: req.body.email, password: cleanPassword }
      })
    });
    
    const basketResData = await basketRes.json();
    const basketIdent = basketResData.data.ident;
    
    // 2. Add Package to Basket
    let checkoutUrl = '';
    if (planConfig.tebexPackageId) {
      const pkgRes = await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ package_id: planConfig.tebexPackageId })
      });
      const pkgData = await pkgRes.json();
      checkoutUrl = pkgData.data.links.checkout;
    }
    
    res.json({ basketIdent, checkoutUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Checkout error' });
  }
};
