const plans = require('../config/plans');

module.exports = async (req, res) => {
  try {
    const { plan, location } = req.body;
    const planConfig = plans[plan];
    
    if (!planConfig) {
      return res.status(400).json({ error: 'Invalid plan' });
    }
    
    const nodeId = location === 'colombia' ? process.env.NODE_COLOMBIA : process.env.NODE_USA;
    const auth = Buffer.from(`${process.env.TEBEX_PUBLIC_TOKEN}:${process.env.TEBEX_PRIVATE_KEY}`).toString('base64');
    
    const basketRes = await fetch('https://headless.tebex.io/api/accounts/baskets', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        complete_url: 'https://billing.solarcloud.lat?status=complete',
        cancel_url: 'https://billing.solarcloud.lat?status=cancel',
        custom: { plan, location, nodeId }
      })
    });
    
    const basketData = await basketRes.json();
    const basketIdent = basketData.ident;
    
    if (planConfig.tebexPackageId) {
      await fetch(`https://headless.tebex.io/api/baskets/${basketIdent}/packages`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ package_id: planConfig.tebexPackageId })
      });
    }
    
    res.json({ basketIdent, checkoutUrl: basketData.links.checkout });
  } catch (error) {
    res.status(500).json({ error: 'Checkout error' });
  }
};
