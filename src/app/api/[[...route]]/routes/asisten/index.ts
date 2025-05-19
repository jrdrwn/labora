import { Hono } from 'hono';

export const asisten = new Hono().basePath('/asisten');

asisten.get('/echo', (c) => {
  return c.json({ message: 'Hello from asisten!' });
});
