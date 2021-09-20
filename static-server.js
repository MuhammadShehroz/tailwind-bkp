const express = require('express');
const proxy = require('express-http-proxy');

const rootPath = process.env.ROOT_PATH;
const port = process.env.PORT;
const apiHost = process.env.API_HOST;

const app = express();

['/api', '/users', '/portal'].forEach((path) => {
  app.use(
    path,
    proxy(apiHost, { proxyReqPathResolver: (req) => `${path}${req.url}` })
  );
});

app.use(express.static(rootPath));

app.use(function (req, res) {
  res.status(404).sendFile('index.html', { root: rootPath });
});

app.listen(
  port,
  () => console.log(`Build successful. Listening on port ${port}!`) // eslint-disable-line no-console
);
