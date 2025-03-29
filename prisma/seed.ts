// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@hercules.com' },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin',
        email: 'admin@hercules.com',
        password: hashedPassword,
        phone: '1234567890',
        role: 'ADMIN',
      },
    });

    console.log(`✅ Admin user created: ${admin.email}`);
  } else {
    console.log('ℹ️ Admin user already exists.');
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (err) => {
    console.error('❌ Error seeding:', err);
    await prisma.$disconnect();
    process.exit(1);
  });
