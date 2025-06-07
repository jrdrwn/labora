import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { AsistenStatus } from '../../constants';

export const asisten = new Hono().basePath('/asisten');

asisten.get('/', async (c) => {
  const asisten = await prisma.asisten.findMany({
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
      status: true,
      mata_kuliah_pilihan: true,
      dokumen_pendukung_url: true,
      komitmen_url: true,
      kelas: {
        select: {
          id: true,
          nama: true,
          mata_kuliah: {
            select: {
              id: true,
              nama: true,
              kode: true,
            },
          },
        },
      },
    },
  });

  const post_asisten = asisten.map(async (a) => {
    const mata_kuliah_pilihan = await prisma.mata_kuliah.findMany({
      where: {
        kode: {
          in: a.mata_kuliah_pilihan as string[],
        },
      },
      select: {
        id: true,
        kode: true,
        nama: true,
      },
    });
    return {
      ...a,
      mata_kuliah_pilihan,
    };
  });

  const asistenWithMataKuliah = await Promise.all(post_asisten);

  return c.json({
    status: true,
    data: asistenWithMataKuliah,
  });
});

asisten.put(
  '/',
  zValidator(
    'json',
    z.object({
      where: z.object({
        asisten_id: z.number().int().positive(),
      }),
      update: z.object({
        status: z
          .enum([
            AsistenStatus.diproses,
            AsistenStatus.diterima,
            AsistenStatus.ditolak,
          ])
          .optional(),
        kelas_id: z.number().int().positive().nullable().optional(),
      }),
    }),
  ),
  async (c) => {
    const json = c.req.valid('json');

    const asisten = await prisma.asisten.findFirst({
      where: {
        id: json.where.asisten_id,
      },
    });

    if (!asisten) {
      return c.json({ status: false, message: 'Asisten not found' }, 404);
    }

    if (json.update.kelas_id) {
      const kelas = await prisma.kelas.findFirst({
        where: {
          id: json.update.kelas_id,
        },
      });

      if (!kelas) {
        return c.json({ status: false, message: 'Kelas not found' }, 404);
      }

      if (kelas.asisten_id && kelas.asisten_id !== json.where.asisten_id) {
        return c.json(
          { status: false, message: 'Kelas already has an assistant' },
          400,
        );
      }

      const kelasByAsisten = await prisma.kelas.findFirst({
        where: {
          asisten_id: json.where.asisten_id,
        },
      });

      if (kelasByAsisten) {
        await prisma.kelas.update({
          where: {
            id: kelasByAsisten.id,
          },
          data: {
            asisten_id: null,
          },
        });
      }

      await prisma.kelas.update({
        where: {
          id: json.update.kelas_id,
        },
        data: {
          asisten_id: json.where.asisten_id,
        },
      });
    } else if (json.update.kelas_id === null) {
      const kelas = await prisma.kelas.findFirst({
        where: {
          asisten_id: json.where.asisten_id,
        },
      });
      if (!kelas) {
        return c.json({ status: false, message: 'Kelas not found' }, 404);
      }
      await prisma.kelas.update({
        where: {
          id: kelas.id,
        },
        data: {
          asisten_id: null,
        },
      });
    }

    await prisma.asisten.update({
      where: {
        id: json.where.asisten_id,
      },
      data: {
        status: json.update.status,
      },
    });

    return c.json({
      status: true,
    });
  },
);

asisten.delete('/', async (c) => {
  const json = await c.req.json<{
    asisten_id: number;
  }>();
  const asisten = await prisma.asisten.findFirst({
    where: {
      id: json.asisten_id,
    },
  });
  if (!asisten) {
    return c.json({ status: false, message: 'Asisten not found' }, 404);
  }

  const kelas = await prisma.kelas.findFirst({
    where: {
      asisten_id: json.asisten_id,
    },
  });

  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }

  await prisma.kelas.update({
    where: {
      id: kelas!.id,
    },
    data: {
      asisten_id: null,
    },
  });

  await prisma.asisten.delete({
    where: {
      id: json.asisten_id,
    },
  });

  return c.json(
    {
      status: true,
    },
    202,
  );
});

asisten.get(
  '/kelas',
  zValidator(
    'query',
    z.object({
      asisten_id: z.coerce.number().optional(),
    }),
  ),
  async (c) => {
    const query = c.req.valid('query');

    const asisten = await prisma.asisten.findFirst({
      where: {
        id: query.asisten_id,
      },
    });

    const kelas = await prisma.kelas.findMany({
      where: {
        mata_kuliah: {
          kode: {
            in: asisten?.mata_kuliah_pilihan as string[],
          },
        },
      },
      select: {
        id: true,
        nama: true,
        asisten: {
          select: {
            id: true,
            nama: true,
            nim: true,
          },
        },
        mata_kuliah: {
          select: {
            id: true,
            nama: true,
            kode: true,
          },
        },
      },
    });

    return c.json({
      status: true,
      data: kelas,
    });
  },
);

asisten.get('/:id', async (c) => {
  const asistenId = +c.req.param('id');
  const asisten = await prisma.asisten.findFirst({
    where: {
      id: asistenId,
    },
    select: {
      id: true,
      nim: true,
      nama: true,
      email: true,
      status: true,
      mata_kuliah_pilihan: true,
      komitmen_url: true,
      kelas: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });
  if (!asisten) {
    return c.json({ status: false, message: 'Asisten not found' }, 404);
  }
  return c.json({
    status: true,
    data: asisten,
  });
});
