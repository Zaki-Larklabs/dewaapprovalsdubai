const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3000', 10);
const ROOT = path.resolve(__dirname);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // Root redirect: default to new design prototypes if root index doesn't exist
  if (reqPath === '/' || reqPath === '') {
    if (fs.existsSync(path.join(ROOT, 'index.html'))) {
      reqPath = '/index.html';
    } else {
      res.writeHead(302, { Location: '/design/prototypes/' });
      res.end();
      return;
    }
  }

  // Alias /legacy to /_legacy/
  if (reqPath === '/legacy' || reqPath === '/legacy/') {
    res.writeHead(302, { Location: '/_legacy/index.html' });
    res.end();
    return;
  }

  // If path ends with slash, look for index.html inside
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }

  let filePath = path.join(ROOT, reqPath);

  // If file doesn't exist directly, check with .html extension
  if (!fs.existsSync(filePath) && fs.existsSync(filePath + '.html')) {
    filePath = filePath + '.html';
  }

  // Fallback: check inside _legacy if not found at root
  if (!fs.existsSync(filePath)) {
    const legacyCandidate = path.join(ROOT, '_legacy', reqPath);
    if (fs.existsSync(legacyCandidate) && fs.statSync(legacyCandidate).isFile()) {
      filePath = legacyCandidate;
    }
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head><title>404 Not Found</title><style>body{font-family:sans-serif;padding:40px;line-height:1.6;background:#0d1117;color:#e6edf3}a{color:#58a6ff;text-decoration:none}</style></head>
        <body>
          <h1>404 — Page Not Found</h1>
          <p>Available entrypoints:</p>
          <ul>
            <li><a href="/design/prototypes/">🚀 New Design Prototypes (Gate A)</a></li>
            <li><a href="/_legacy/index.html">📁 Legacy Approvals Site</a></li>
          </ul>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

function startServer(portToUse) {
  server.listen(portToUse, () => {
    console.log(`\n  ⚡ Abbadi Tech — Approvals Portal local server:`);
    console.log(`  > Prototypes: http://localhost:${portToUse}/design/prototypes/`);
    console.log(`  > Legacy:     http://localhost:${portToUse}/_legacy/index.html`);
    console.log(`  > Local:      http://localhost:${portToUse}/\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`  ⚠️  Port ${portToUse} is in use, trying ${portToUse + 1}...`);
      startServer(portToUse + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(PORT);
