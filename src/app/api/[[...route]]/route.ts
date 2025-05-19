import { Hono } from 'hono';
import { type JwtVariables } from 'hono/jwt';
import { handle } from 'hono/vercel';

import { admin } from './routes/admin';
import { asisten } from './routes/asisten';
import { praktikan } from './routes/praktikan';

type Variables = JwtVariables;

const app = new Hono<{
  Variables: Variables;
}>().basePath('/api');

app.route('/', admin);
app.route('/', asisten);
app.route('/', praktikan);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
