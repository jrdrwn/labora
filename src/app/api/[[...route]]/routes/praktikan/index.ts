import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { except } from 'hono/combine';
import { jwt } from 'hono/jwt';

import { JWTPayload } from '../../types';
import { auth } from './auth';
import { event } from './event';
import { kelas } from './kelas';
import { overview } from './overview';

export const praktikan = new Hono().basePath('/praktikan');
praktikan.use(
  '/*',
  except('*/*/login', async (c, next) => {
    const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
    const jwtMiddleware = jwt({
      secret: JWT_SECRET,
    });
    return jwtMiddleware(c, next);
  }),
);

praktikan.use(
  '/*',
  except('*/*/login', async (c, next) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    if (jwtPayload.role !== 'praktikan') {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }
    return next();
  }),
);
praktikan.get('/echo', (c) => {
  return c.json({ message: 'Hello from praktikan!' });
});

praktikan.route('/', auth);
praktikan.route('/', event);
praktikan.route('/', kelas);
praktikan.route('/', overview);
