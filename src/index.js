const express = require('express');

const app = express();
app.use(express.json());

// In-memory demo inventory — not a real database, this is a demo target repo.
const inventory = new Map([
  ['sku-kite-001', { sku: 'sku-kite-001', name: 'Diamond Kite', quantity: 42 }],
  ['sku-kite-002', { sku: 'sku-kite-002', name: 'Box Kite', quantity: 17 }],
]);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/inventory/:sku', (req, res) => {
  const item = inventory.get(req.params.sku);
  if (!item) return res.status(404).json({ error: 'not_found' });
  res.json(item);
});

app.post('/inventory/:sku/reserve', (req, res) => {
  const item = inventory.get(req.params.sku);
  if (!item) return res.status(404).json({ error: 'not_found' });
  const quantity = Number(req.body?.quantity ?? 1);
  if (quantity > item.quantity) return res.status(409).json({ error: 'insufficient_stock' });
  item.quantity -= quantity;
  res.json(item);
});

const port = process.env.PORT || 3100;
if (require.main === module) {
  app.listen(port, () => console.log(`demo_repo inventory service listening on ${port}`));
}

module.exports = app;
