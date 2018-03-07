// Serving dependencies
const express     = require('express');
const compression = require('compression');
const mcache      = require('memory-cache');
const fs          = require('fs');
const http        = require('http');
const https       = require('https');
const {parse}     = require('url');
//Environment
const env         = process.env.NODE_ENV;

//SSL
const domain      = 'mydomain.com';
const privateKey  = null;
const certificate = null;

// Setting SSL if production only
if (env == "production") {
  // Setting SSL Private Key and handling potential errors
  try {
    privateKey = fs.readFileSync('/etc/letsencrypt/live/'+domain+'/privkey.pem', 'utf8'); // --> https://letsencrypt.org/
    console.log('Successfuly retrieving SSL private key', privateKey);
  } catch(err) {
    switch(err.code) {
      case 'ENOENT': {
        console.error(new Error('SSL Private Key not Found.'));
      }; break;

      case 'EACCES': {
        console.error(new Error('EACCES: you need to authentify as an admin to read your SSL Private Key.'));
      }; break;

      default: {
        console.error(new Error('An error occured while trying to read your SSL Private Key.'));
      }
    }
  }

  // Setting SSL Certificate and handling potential errors
  try {
    certificate = fs.readFileSync('/etc/letsencrypt/live/'+domain+'/cert.pem', 'utf8'); // --> https://letsencrypt.org/
    console.log('Successfuly retrieving SSL certificate', certificate);
  } catch(err) {
    switch(err.code) {
      case 'ENOENT': {
        console.error(new Error('SSL Certificate not Found.'));
      }; break;

      case 'EACCES': {
        console.error(new Error('EACCES: you need to authentify as an admin to read your SSL Certificate.'));
      }; break;

      default: {
        console.error(new Error('An error occured while trying to read your SSL Certificate.'));
      }
    }
  }
}

// Next.JS
const next        = require('next');

// App
const app         = next({dir:'./src', env });
const handle      = app.getRequestHandler();

// Config
const PORT        = env == 'development' ? 3000 : 443;
const cache       = (duration) => {
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
  const serverApp = express().use(compression());
  const httpServer = http.createServer(serverApp);
  const httpsServer = https.createServer({key: privateKey, cert: certificate}, serverApp);

  serverApp.get('/p/:id', cache(10), (req, res) => {
    const actualPage = '/post'
    const queryParams = { id: req.params.id }
    app.render(req, res, actualPage, queryParams)
  });

  serverApp.get('*', cache(10), (req, res) => {
    return handle(req, res)
  });

  switch (env) {
    case 'development': httpServer.listen(PORT, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:' + PORT);
    }); break;

    case 'production': httpsServer.listen(PORT, (err) => {
      if (err) throw err
      console.log('> Ready on https://localhost:' + PORT);
    }); break;
  }
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
});
