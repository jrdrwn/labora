import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { except } from 'hono/combine';
import { jwt } from 'hono/jwt';

import { JWTPayload } from '../../types';
import { asisten } from './asisten';
import { auth } from './auth';
import { event } from './event';
import { jadwal } from './jadwal';
import { kelas } from './kelas';
import { mataKuliahPraktikum } from './mata-kuliah-praktikum';
import { praktikan } from './praktikan';
import { ruangan } from './ruangan';

export const admin = new Hono().basePath('/admin');

admin.use(
  '/*',
  except('*/*/login', async (c, next) => {
    const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
    const jwtMiddleware = jwt({
      secret: JWT_SECRET,
    });
    return jwtMiddleware(c, next);
  }),
);

admin.use(
  '/*',
  except('*/*/login', async (c, next) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    if (jwtPayload.role !== 'admin') {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }
    return next();
  }),
);

admin.get('/echo', (c) => {
  return c.json({ message: 'Hello from admin!' });
});

admin.route('/', auth);
admin.route('/', event);
admin.route('/', ruangan);
admin.route('/', mataKuliahPraktikum);
admin.route('/', kelas);
admin.route('/', jadwal);
admin.route('/', asisten);
admin.route('/', praktikan);
