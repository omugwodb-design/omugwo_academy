import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const systemeApiDevPlugin = () => ({
  name: 'systeme-api-dev-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      const url = req.url ? req.url.split('?')[0] : '';

      if (!url.startsWith('/api/systeme/')) {
        next();
        return;
      }

      const relativePath = url.replace(/^\/api\//, '');
      const handlerPath = path.resolve(__dirname, 'api', `${relativePath}.js`);

      if (!fs.existsSync(handlerPath)) {
        next();
        return;
      }

      try {
        const mod = await server.ssrLoadModule(`/api/${relativePath}.js`);
        const handler = mod.default;

        if (typeof handler !== 'function') {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: `Invalid API handler for ${url}` }));
          return;
        }

        req.query = Object.fromEntries(new URL(req.url || '', 'http://localhost').searchParams.entries());
        await handler(req, res);
      } catch (error) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          error: error instanceof Error ? error.message : 'Unexpected dev API error.',
        }));
      }
    });
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Inject env variables into process.env so they are available to Node.js 
  // processes (like simulated API handlers) during dev.
  Object.assign(process.env, env);

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), systemeApiDevPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.SYSTEME_IO_API_KEY': JSON.stringify(env.SYSTEME_IO_API_KEY),
      'process.env.SYSTEME_IO_WEBHOOK_SECRET': JSON.stringify(env.SYSTEME_IO_WEBHOOK_SECRET),
      'process.env.SYSTEME_IO_SYNC_CRON_SECRET': JSON.stringify(env.SYSTEME_IO_SYNC_CRON_SECRET),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
