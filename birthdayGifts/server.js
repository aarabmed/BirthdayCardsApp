const express = require('express');
const next = require('next');
const { createProxyMiddleware } = require('http-proxy-middleware');

const conf = require('./next.config');

const dev = process.env.NODE_ENV !== 'production';
const port = parseInt(process.env.PORT, 10) || 3000;

const app = next({ dir: '.', dev });
const handler = app.getRequestHandler();

const devProxy = {
    '/api': {
      target: 'http://localhost:7000/',
      pathRewrite: { '^/api': '/' },
      changeOrigin: true,
    },
    '/images': {
      target: 'http://localhost:7000/images/',
      pathRewrite: { '^/images': '/' },
      changeOrigin: true,
    }
}


app.prepare().then(() => {
  const server = express();

  if (dev && devProxy) {
    Object.keys(devProxy).forEach(function (context) {
      server.use(context, createProxyMiddleware(devProxy[context]))
    })
  }

  server.all('*', (req, res) => handler(req, res))

  server.listen(port, (err) => {
    if (err) throw err
    console.info(`🚀 Ready on http://localhost:${port}`);
  })
})