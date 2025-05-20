import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { except } from 'hono/combine';
import { jwt } from 'hono/jwt';

import { JWTPayload } from '../../types';
import { auth } from './auth';

export const asisten = new Hono().basePath('/asisten');

asisten.use(
  '/*',
  except('*/*/login', async (c, next) => {
    const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
    const jwtMiddleware = jwt({
      secret: JWT_SECRET,
    });
    return jwtMiddleware(c, next);
  }),
);

asisten.use(
  '/*',
  except('*/*/login', async (c, next) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    if (jwtPayload.role !== 'asisten') {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }
    return next();
  }),
);

asisten.get('/echo', (c) => {
  return c.json({ message: 'Hello from asisten!' });
});

asisten.route('/', auth);
