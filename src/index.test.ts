import 'dotenv/config';
import assert from 'node:assert/strict';
import test from 'node:test';

test('requires the port from environment config', () => {
  const port = process.env.PORT ?? '';
  assert.ok(port.length > 0);
});

test('requires the frontend URL from environment config', () => {
  const url = process.env.FRONTEND_URL ?? '';
  assert.ok(url.startsWith('http'));
});
