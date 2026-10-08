import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const existing = await prisma.clinic.findFirst({ where: { name: 'Clínica Sonrisa (ficticia)' } });
  if (existing) {
    console.log('Seed ya aplicado');
    return;
  }

  const clinic = await prisma.clinic.create({ data: { name: 'Clínica Sonrisa (ficticia)' } });

  const ana = await prisma.provider.create({ data: { clinicId: clinic.id, name: 'Dra. Ana Ficticia' } });
  const luis = await prisma.provider.create({ data: { clinicId: clinic.id, name: 'Dr. Luis Inventado' } });

  const sillón1 = await prisma.operatingUnit.create({ data: { clinicId: clinic.id, name: 'Sillón 1' } });
  const sillón2 = await prisma.operatingUnit.create({ data: { clinicId: clinic.id, name: 'Sillón 2' } });

  await prisma.procedure.createMany({
    data: [
      { clinicId: clinic.id, code: 'CONS', name: 'Consulta', defaultDurationMin: 30 },
      { clinicId: clinic.id, code: 'LIMP', name: 'Limpieza', defaultDurationMin: 45 },
      { clinicId: clinic.id, code: 'OBTU', name: 'Obturación', defaultDurationMin: 60 },
    ],
  });

  console.log('Seed aplicado:', { clinic: clinic.id, providers: [ana.id, luis.id], units: [sillón1.id, sillón2.id] });
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
