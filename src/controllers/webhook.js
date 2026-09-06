const plans = require('../config/plans');
const pterodactyl = require('./pterodactyl');

module.exports = async (req, res) => {
  try {
    const payload = req.body;
    
    const email = payload?.customer?.email || payload?.subject?.customer?.email || payload?.email;
    const { plan, location, nodeId } = payload.custom || {};
    
    if (email && plan) {
      const planConfig = plans[plan];
      if (planConfig) {
        const nestId = planConfig.type === 'minecraft' ? process.env.MC_NEST_ID : process.env.BOT_NEST_ID;
        const eggId = planConfig.type === 'minecraft' ? process.env.MC_EGG_ID : process.env.BOT_EGG_ID;
        
        const userId = await pterodactyl.createUser(email);
        await pterodactyl.createServer(userId, planConfig, nodeId, nestId, eggId);
      }
    }
    
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).send('Error processing webhook');
  }
};
