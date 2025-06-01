import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { EventType } from '../../constants';
import { JWTPayload } from '../../types';

export const event = new Hono().basePath('/event');

event.post(
  '/',
  zValidator(
    'json',
    z.object({
      mulai: z.coerce.date(),
      selesai: z.coerce.date(),
      jenis: z.enum([
        EventType.pendaftaran_asisten,
        EventType.pendaftaran_praktikan,
        EventType.praktikum,
      ]),
      nama: z.string().optional().default(''),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const validated = c.req.valid('json');

    const event = await prisma.event.findFirst({
      where: {
        admin_id: jwtPayload.sub,
        mulai: {
          gte: new Date(validated.mulai),
        },
        selesai: {
          lte: new Date(validated.selesai),
        },
      },
    });

    if (event) {
      return c.json({ status: false, message: 'Event already exists' }, 400);
    }

    await prisma.event.create({
      data: {
        admin_id: jwtPayload.sub,
        jenis: validated.jenis,
        mulai: new Date(validated.mulai),
        selesai: new Date(validated.selesai),
        nama: validated.nama,
      },
    });

    return c.json({
      status: true,
    });
  },
);

event.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;

  const events = await prisma.event.findMany({
    where: {
      admin_id: jwtPayload.sub,
    },
    select: {
      id: true,
      nama: true,
      jenis: true,
      mulai: true,
      selesai: true,
      admin: {
        select: {
          id: true,
          nama: true,
          email: true,
        },
      },
    },
  });

  return c.json({
    status: true,
    data: events,
  });
});

event.delete(
  '/',
  zValidator(
    'json',
    z.object({
      event_id: z.coerce.number().int().positive(),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');
    const event = await prisma.event.findFirst({
      where: {
        id: Number(json.event_id),
        admin_id: jwtPayload.sub,
      },
    });
    if (!event) {
      return c.json({ status: false, message: 'Event not found' }, 404);
    }

    await prisma.event.delete({
      where: {
        id: Number(json.event_id),
      },
    });

    return c.json({
      status: true,
    });
  },
);

event.put(
  '/',
  zValidator(
    'json',
    z.object({
      where: z.object({
        event_id: z.coerce.number().int().positive(),
      }),
      update: z.object({
        mulai: z.coerce.date().optional(),
        selesai: z.coerce.date().optional(),
        jenis: z
          .enum([
            EventType.pendaftaran_asisten,
            EventType.pendaftaran_praktikan,
            EventType.praktikum,
          ])
          .optional(),
        nama: z.string().optional(),
      }),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');

    let event;
    event = await prisma.event.findFirst({
      where: {
        id: Number(json.where.event_id),
        admin_id: jwtPayload.sub,
      },
    });
    if (!event) {
      return c.json({ status: false, message: 'Event not found' }, 404);
    }
    if (json.update?.mulai && json.update?.selesai) {
      if (new Date(json.update.mulai) > new Date(json.update.selesai)) {
        return c.json(
          { status: false, message: 'Mulai must be before Selesai' },
          400,
        );
      }
      event = await prisma.event.findFirst({
        where: {
          id: {
            not: Number(json.where.event_id),
          },
          admin_id: jwtPayload.sub,
          OR: [
            {
              mulai: {
                gt: new Date(json.update.mulai),
              },
            },
            {
              selesai: {
                gt: new Date(json.update.mulai),
              },
            },
            {
              selesai: {
                gt: new Date(json.update.selesai),
              },
            },
          ],
        },
      });
    } else if (json.update?.mulai) {
      if (new Date(json.update.mulai) > new Date(event.selesai!)) {
        return c.json(
          { status: false, message: 'Mulai must be before Selesai' },
          400,
        );
      }
      event = await prisma.event.findFirst({
        where: {
          id: {
            not: Number(json.where.event_id),
          },
          admin_id: jwtPayload.sub,
          OR: [
            {
              mulai: {
                gt: new Date(json.update.mulai),
              },
            },
            {
              selesai: {
                gt: new Date(json.update.mulai),
              },
            },
          ],
        },
      });
    } else if (json.update?.selesai) {
      if (new Date(event.mulai!) > new Date(json.update.selesai)) {
        return c.json(
          { status: false, message: 'Mulai must be before Selesai' },
          400,
        );
      }
      event = await prisma.event.findFirst({
        where: {
          id: {
            not: Number(json.where.event_id),
          },
          admin_id: jwtPayload.sub,
          selesai: {
            // lte: new Date(json.update.selesai),
            gt: new Date(json.update.selesai),
          },
        },
      });
    }

    if (event) {
      return c.json({ status: false, message: 'Event already exists' }, 400);
    }

    await prisma.event.update({
      where: {
        id: Number(json.where.event_id),
      },
      data: {
        ...json.update,
      },
    });

    return c.json({
      status: true,
    });
  },
);
