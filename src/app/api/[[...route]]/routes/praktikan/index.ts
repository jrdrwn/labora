import { Hono } from 'hono';

export const praktikan = new Hono().basePath('/praktikan');

praktikan.get('/echo', (c) => {
  return c.json({ message: 'Hello from praktikan!' });
});
