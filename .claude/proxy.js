const http = require('http');
const port = process.env.PORT || 8891;
const upstreamPort = parseInt(process.env.UPSTREAM_PORT || '8889', 10);

// Only the portal root needs the href="//" → href="/" fix.
const needsRewrite = (url) => url === '/' || url.startsWith('/?');

http.createServer((req, res) => {
  // Preserve original headers; just rewrite Host so upstream
  // matches its expected vhost. Do NOT remove or modify other
  // headers — Next.js streams RSC chunks and is sensitive to
  // anything that breaks transfer-encoding or buffering.
  const upstreamHeaders = { ...req.headers, host: `localhost:${upstreamPort}` };
  if (needsRewrite(req.url)) {
    upstreamHeaders['accept-encoding'] = 'identity';
  }

  const opts = {
    hostname: '127.0.0.1',
    port: upstreamPort,
    path: req.url,
    method: req.method,
    headers: upstreamHeaders,
  };

  const proxy = http.request(opts, (pr) => {
    const ct = pr.headers['content-type'] || '';

    if (needsRewrite(req.url) && ct.includes('text/html')) {
      const chunks = [];
      pr.on('data', (d) => chunks.push(d));
      pr.on('end', () => {
        const body = Buffer.concat(chunks).toString('utf8');
        const rewritten = body.replace(/href="\/\/"/g, 'href="/"');
        const out = Buffer.from(rewritten, 'utf8');
        const hdrs = { ...pr.headers };
        delete hdrs['transfer-encoding'];
        delete hdrs['content-length'];
        hdrs['content-length'] = String(out.length);
        res.writeHead(pr.statusCode, hdrs);
        res.end(out);
      });
    } else {
      // Pass-through with original headers verbatim — preserve
      // every Set-Cookie, Link, and Vary line, in original order
      // (multi-value headers must remain split, not merged).
      res.writeHead(pr.statusCode, pr.statusMessage, pr.rawHeaders);
      pr.pipe(res, { end: true });
    }
  });

  proxy.on('error', (e) => {
    res.writeHead(502);
    res.end(`Proxy error: ${e.message}`);
  });
  req.pipe(proxy, { end: true });
}).listen(port, () =>
  process.stderr.write(`Preview proxy → 127.0.0.1:${upstreamPort} on :${port}\n`)
);
