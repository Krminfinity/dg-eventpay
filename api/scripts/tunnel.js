#!/usr/bin/env node
const lt = require('localtunnel');
// .env から PORT を読み取り、サーバーとトンネルのポートを揃える
try { require('dotenv').config(); } catch {}

(async () => {
  const port = process.env.PORT ? Number(process.env.PORT) : 4000;
  try {
    const tunnel = await lt({ port });
    const url = tunnel.url;
    console.log(`TUNNEL_URL=${url}`);
    console.log(`Webhook URL: ${url}/webhooks/psp`);
    console.log('Hookdeck Destination に上記 Webhook URL を設定してください。');
    console.log('Press Ctrl+C to close the tunnel.');
  } catch (err) {
    console.error('Failed to start tunnel:', err?.message || err);
    process.exit(1);
  }
})();
