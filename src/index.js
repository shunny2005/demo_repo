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
  const allowPartial = Boolean(req.body?.allowPartial);

  if (quantity > item.quantity) {
    if (!allowPartial) return res.status(409).json({ error: 'insufficient_stock' });
    // Partial reservation: reserve whatever stock remains instead of
    // failing the whole request. Reserving 0 when the item is already
    // fully depleted is a valid (if unhelpful) partial fulfillment, not an
    // error -- the caller asked to accept less than requested.
    const reserved = item.quantity;
    item.quantity = 0;
    return res.json({ ...item, reserved, requested: quantity, partial: true });
  }

  item.quantity -= quantity;
  res.json({ ...item, reserved: quantity, requested: quantity, partial: false });
});

const port = process.env.PORT || 3100;
if (require.main === module) {
  app.listen(port, () => console.log(`demo_repo inventory service listening on ${port}`));
}

module.exports = app;
