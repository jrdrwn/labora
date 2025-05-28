import prisma from '@db';
import { Hono } from 'hono';

export const praktikan = new Hono().basePath('/praktikan');

praktikan.get('/', async (c) => {
  const praktikan = await prisma.praktikan.findMany({
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    where: {
      nama: {
        search: c.req.query('q') ? String(c.req.query('q')) : undefined,
      },
    },
    select: {
      id: true,
      nim: true,
      nama: true,
      email: true,
      kelaspraktikumpraktikan: {
        select: {
          id: true,
          perangkat: true,
          kelaspraktikum: {
            select: {
              nama: true,
              id: true,
              asisten: {
                select: {
                  id: true,
                  nama: true,
                  email: true,
                },
              }
            },
          },
        },
      },
    },
  });

  return c.json({
    status: true,
    data: praktikan,
  });
});

BigInt.prototype.toJSON = function () {
  return this.toString();
};
