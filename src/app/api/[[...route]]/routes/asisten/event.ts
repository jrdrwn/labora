import prisma from '@db';
import { Hono } from 'hono';

export const event = new Hono().basePath('/event');

event.get('/', async (c) => {
  const events = await prisma.event.findMany({
    orderBy: {
      mulai: 'desc',
    },
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
  });

  return c.json({
    status: true,
    data: events,
  });
});
