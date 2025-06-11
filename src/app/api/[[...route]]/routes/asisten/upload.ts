import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { imagekit } from '../../utils/imagekit';

export const upload = new Hono().basePath('/upload');

upload.post(
  '/',
  zValidator(
    'form',
    z.object({
      file: z
        .instanceof(File)
        .refine((file) => file.size > 0, {
          message: 'File must not be empty',
        })
        .refine((file) => file.size <= 10 * 1024 * 1024, {
          message: 'File size must not exceed 10MB',
        }),
      name: z.string().optional(),
    }),
  ),
  async (c) => {
    const form = c.req.valid('form');

    if (!form.file) {
      return c.json(
        {
          status: false,
          message: 'File not found',
        },
        400,
      );
    }

    try {
      const res = await imagekit.upload({
        file: Buffer.from(await form.file.arrayBuffer()),
        fileName: form.name || form.file.name,
        folder: process.env.IMAGEKIT_FOLDER || 'uploads',
        overwriteFile: true,
        useUniqueFileName: false,
      });

      return c.json({
        status: true,
        data: {
          url: res.url,
          fileId: res.fileId,
          name: res.name,
        },
      });
    } catch {
      return c.json(
        {
          status: false,
          message: 'Failed to upload file',
        },
        500,
      );
    }
  },
);
