import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetAdmin() {
  console.log('🔄 Forced reset of Admin Account...');
  try {
    const hashedPassword = await bcrypt.hash('Admin@123', 12);

    await prisma.user.upsert({
      where: { email: 'admin@gosim.com' },
      update: {
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isVerified: true,
        isActive: true,
      },
      create: {
        email: 'admin@gosim.com',
        password: hashedPassword,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        isVerified: true,
        isActive: true,
      },
    });
    console.log('✅ Success! You can now login with:');
    console.log('Email: admin@gosim.com');
    console.log('Password: Admin@123');
  } catch (error) {
    console.error('❌ Error updating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();
