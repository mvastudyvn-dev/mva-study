import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

import app from '../api/index.js';
import http from 'http';

const server = http.createServer(app);
server.listen(3005, async () => {
  try {
    const res = await fetch('http://localhost:3005/api/cron/cleanup');
    const json = await res.json();
    console.log('Response:', json);
  } catch (e) {
    console.error(e);
  } finally {
    server.close();
    process.exit(0);
  }
});
