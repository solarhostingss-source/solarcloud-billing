const plans = require('../config/plans');

module.exports = async (req, res) => {
  try {
    const { plan, location } = req.body;
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
        complete_url: 'https://billing.solarcloud.lat?status=complete',
        cancel_url: 'https://billing.solarcloud.lat?status=cancel',
        custom: { plan, location, nodeId }
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
