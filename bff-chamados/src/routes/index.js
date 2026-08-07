const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const routesPath = __dirname;

fs.readdirSync(routesPath).forEach((file) => {
  if (file === 'index.js' || !file.endsWith('.js')) return;

  const routeName = file.replace('.js', '');
  const routeModule = require(path.join(routesPath, file));
  const routePath = routeName === 'health' ? '/health' : `/api/${routeName}`;

  router.use(routePath, routeModule);
  console.log(`🚀 Rota registrada: ${routePath} -> routes/${file}`);
});

module.exports = router;