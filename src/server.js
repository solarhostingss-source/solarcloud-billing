require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const checkoutController = require('./controllers/checkout');
const webhookController = require('./controllers/webhook');
const verifyWebhook = require('./middleware/verifyWebhook');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.post('/webhook/tebex', express.raw({ type: 'application/json' }), verifyWebhook, webhookController);

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/checkout', checkoutController);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
