import { Hono } from 'hono';
import { handle } from 'hono/vercel';

import * as admin from './routes/admin';
import * as asisten from './routes/asisten';
import * as praktikan from './routes/praktikan';

const app = new Hono().basePath('/api');

app.route('/', admin.app);
app.route('/', asisten.app);
app.route('/', praktikan.app);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
