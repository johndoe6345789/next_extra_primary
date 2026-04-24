const http = require('http');
const port = process.env.PORT || 8891;

// Only the portal root needs the href="//" → href="/" fix.
const needsRewrite = (url) => url === '/' || url.startsWith('/?');

http.createServer((req, res) => {
  const upstreamHeaders = { ...req.headers, host: 'localhost:8889' };
  // Force plain response so we can string-replace without
  // decompressing binary gzip/br content.
  if (needsRewrite(req.url)) upstreamHeaders['accept-encoding'] = 'identity';

  const opts = {
    hostname: 'localhost',
    port: 8889,
    path: req.url,
    method: req.method,
    headers: upstreamHeaders,
  };

  const proxy = http.request(opts, (pr) => {
    const ct = pr.headers['content-type'] || '';

    if (needsRewrite(req.url) && ct.includes('text/html')) {
      let body = '';
      pr.setEncoding('utf8');
      pr.on('data', (d) => { body += d; });
      pr.on('end', () => {
        const rewritten = body.replace(/href="\/\/"/g, 'href="/"');
        const hdrs = { ...pr.headers };
        delete hdrs['transfer-encoding'];
        hdrs['content-length'] = Buffer.byteLength(rewritten);
        res.writeHead(pr.statusCode, hdrs);
        res.end(rewritten);
      });
    } else {
      res.writeHead(pr.statusCode, pr.headers);
      pr.pipe(res, { end: true });
    }
  });

  proxy.on('error', (e) => {
    res.writeHead(502);
    res.end(`Proxy error: ${e.message}`);
  });
  req.pipe(proxy, { end: true });
}).listen(port, () =>
  process.stderr.write(`Preview proxy → localhost:8889 on :${port}\n`)
);
