import { Hono } from 'hono';
import { handle } from 'hono/vercel';

export const app = new Hono().basePath('/asisten');

app.get('/echo', (c) => {
  return c.json({ message: 'Hello from asisten!' });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
