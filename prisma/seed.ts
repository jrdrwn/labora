import { EventType } from '@/app/api/[[...route]]/constants';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      nama: 'Admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminadmin', 10),
    },
  });

  const event_pendaftaran_asisten = await prisma.event.upsert({
    where: {
      id:
        (
          await prisma.event.findFirst({
            where: { jenis: EventType.pendaftaran_asisten },
          })
        )?.id || 0,
    },
    update: {
      jenis: EventType.pendaftaran_asisten,
      admin_id: admin.id,
      mulai: new Date(),
      selesai: new Date(),
    },
    create: {
      jenis: EventType.pendaftaran_asisten,
      admin_id: admin.id,
      mulai: new Date(),
      selesai: new Date(),
    },
  });

  const event_pendaftaran_praktikan = await prisma.event.upsert({
    where: {
      id:
        (
          await prisma.event.findFirst({
            where: { jenis: EventType.pendaftaran_praktikan },
          })
        )?.id || 0,
    },
    update: {
      jenis: EventType.pendaftaran_praktikan,
      admin_id: admin.id,
      mulai: new Date(),
      selesai: new Date(),
    },
    create: {
      jenis: EventType.pendaftaran_praktikan,
      admin_id: admin.id,
      mulai: new Date(),
      selesai: new Date(),
    },
  });

  const event_praktikum = await prisma.event.upsert({
    where: {
      id:
        (
          await prisma.event.findFirst({
            where: { jenis: EventType.praktikum },
          })
        )?.id || 0,
    },
    update: {
      jenis: EventType.praktikum,
      admin_id: admin.id,
      mulai: new Date(),
      selesai: new Date(),
    },
    create: {
      jenis: EventType.praktikum,
      admin_id: admin.id,
      mulai: new Date(),
      selesai: new Date(),
    },
  });

  console.log({
    admin,
    event: {
      pendaftaran_asisten: event_pendaftaran_asisten,
      pendaftaran_praktikan: event_pendaftaran_praktikan,
      praktikum: event_praktikum,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
