const test = require('node:test');
const assert = require('node:assert/strict');
const app = require('./index.js');

function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const http = require('node:http');
    const listener = server.listen(0, () => {
      const { port } = listener.address();
      const data = body ? JSON.stringify(body) : undefined;
      const req = http.request(
        { host: 'localhost', port, path, method, headers: data ? { 'Content-Type': 'application/json' } : {} },
        (res) => {
          let raw = '';
          res.on('data', (chunk) => (raw += chunk));
          res.on('end', () => {
            listener.close();
            resolve({ status: res.statusCode, body: raw ? JSON.parse(raw) : null });
          });
        },
      );
      req.on('error', reject);
      if (data) req.write(data);
      req.end();
    });
  });
}

test('GET /health returns ok', async () => {
  const res = await request(app, 'GET', '/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok' });
});

test('GET /inventory/:sku returns the item', async () => {
  const res = await request(app, 'GET', '/inventory/sku-kite-001');
  assert.equal(res.status, 200);
  assert.equal(res.body.sku, 'sku-kite-001');
});

test('GET /inventory/:sku 404s for an unknown sku', async () => {
  const res = await request(app, 'GET', '/inventory/does-not-exist');
  assert.equal(res.status, 404);
});
