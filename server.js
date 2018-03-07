const express = require('express');
const compression = require('compression');
const mcache = require('memory-cache');
const next = require('next');

const dev = process.env.NODE_ENV;
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = dev == 'development' ? 3000 : 443;
const cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

app.prepare().then(() => {
  const server = express().use(compression());

  server.get('/p/:id', cache(10), (req, res) => {
    const actualPage = '/post'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  });

  server.get('*', cache(10), (req, res) => {
    return handle(req, res)
  });

  server.listen(PORT, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:' + PORT);
  });
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
});
