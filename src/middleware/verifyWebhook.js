const crypto = require('crypto');

module.exports = (req, res, next) => {
  try {
    const rawBody = req.body;
    const signature = req.headers['x-signature'];
    
    if (!signature) {
      return res.status(401).send('Missing signature');
    }
    
    const computed = crypto.createHmac('sha256', process.env.TEBEX_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');
      
    const sigBuf = Buffer.from(signature);
    const compBuf = Buffer.from(computed);
    
    if (sigBuf.length !== compBuf.length || !crypto.timingSafeEqual(sigBuf, compBuf)) {
      return res.status(401).send('Invalid signature');
    }
    
    req.body = JSON.parse(rawBody.toString('utf8'));
    next();
  } catch (err) {
    res.status(401).send('Verification failed');
  }
};
