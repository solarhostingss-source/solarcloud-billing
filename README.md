# Solar Cloud Billing

Sistema de facturación para `billing.solarcloud.lat`.

## Stack

- **Frontend:** HTML5 + CSS3 + Vanilla JS + Lucide Icons + Tebex.js
- **Backend:** Node.js + Express
- **Integrations:** Tebex Headless API, Pterodactyl Application API
- **Process Manager:** PM2
- **Reverse Proxy:** Nginx

## Deployment on VPS

### 1. Clone the repo

```bash
cd /var/www
git clone https://github.com/solarhostingss-source/solarcloud-billing.git
cd solarcloud-billing
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
nano .env
```

Fill in `PTERODACTYL_API_KEY` with your Application API key from the Pterodactyl admin panel.

### 3. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
```

### 4. Nginx config

Create `/etc/nginx/sites-available/billing.solarcloud.lat`:

```nginx
server {
    listen 80;
    server_name billing.solarcloud.lat;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/billing.solarcloud.lat /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d billing.solarcloud.lat
```

### 5. Tebex Webhook

In your Tebex dashboard, set the webhook URL to:
```
https://billing.solarcloud.lat/webhook/tebex
```
