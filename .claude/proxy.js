// Transparent TCP forwarder: localhost:8891 → localhost:8889.
// We do not parse HTTP — just relay bytes. Anything else we
// tried (Node http.request) altered headers (multi-Link merged,
// header casing) enough to break Next.js's RSC client bootstrap,
// so this version is byte-for-byte transparent.

const net = require('net');
const port = parseInt(process.env.PORT || '8891', 10);
const upstreamPort = parseInt(process.env.UPSTREAM_PORT || '8889', 10);
const upstreamHost = '127.0.0.1';

const server = net.createServer((client) => {
  const upstream = net.connect(upstreamPort, upstreamHost, () => {
    client.pipe(upstream);
    upstream.pipe(client);
  });
  upstream.on('error', (e) => {
    client.end(`HTTP/1.1 502 Bad Gateway\r\n\r\nupstream: ${e.message}`);
  });
  client.on('error', () => upstream.destroy());
});

server.listen(port, () => {
  process.stderr.write(
    `Preview TCP proxy → ${upstreamHost}:${upstreamPort} on :${port}\n`,
  );
});
