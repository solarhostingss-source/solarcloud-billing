require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const checkoutController = require('./controllers/checkout');
const webhookController = require('./controllers/webhook');
const verifyWebhook = require('./middleware/verifyWebhook');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Headers (Helmet)
// Configure Content Security Policy to allow Tebex scripts and our assets
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://js.tebex.io"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://*"],
      connectSrc: ["'self'", "https://headless.tebex.io"]
    }
  },
  crossOriginEmbedderPolicy: false // Allows loading external resources like Tebex JS
}));

// Strict CORS
app.use(cors({
  origin: ['https://billing.solarcloud.lat', 'https://solarcloud.lat', 'http://localhost:3000'],
  methods: ['GET', 'POST']
}));

// Rate Limiting on API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});

app.post('/webhook/tebex', express.raw({ type: 'application/json' }), verifyWebhook, webhookController);

app.use(express.json({ limit: '10kb' })); // Limit body size to prevent DoS
app.use(express.static(path.join(__dirname, '../public')));

app.post('/api/checkout', apiLimiter, checkoutController);

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
