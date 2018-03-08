NextJS Starter is a starter project containing every configurations you might want for your PWA Ready NextJS app.

# Installation:
The installation only requires to download the project dependencies through npm or yarn running:

```bash
$ cd nextjs-starter
$ npm install
```

Or

```bash
$ cd nextjs-starter
$ yarn install
```

# Building:
## Development:
### Client side routing only

```bash
$ yarn dev-offline
```

Or

```bash
$ npm run dev-offline
```

### Server Side Rendering
```bash
$ yarn dev
```

Or

```bash
$ npm run dev
```

## Production:
For production, you first need to create an SSL certificate for your domain. The fastest and most inexpensive option is to use [Let's Encrypt](https://letsencrypt.org/). When you're done producing your SSL certificate, make sure that your domain is defined in __server/index.js__. You can modify this file the following way :
```javascript
//SSL
const domain      = 'mydomain.com';
```

### Testing production

```bash
$ yarn prod
```

Or

```bash
$ npm run prod
```

### Deploying production
Make sure that you have [forever](https://www.npmjs.com/package/forever) installed globally, then run :

```bash
$ yarn start-prod
```

Or

```bash
$ npm run start-prod
```
