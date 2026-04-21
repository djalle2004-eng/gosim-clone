import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function resetAdmin() {
  console.log('🔄 Forced reset of Admin Account...');
  try {
    const hashedPassword = await bcrypt.hash('Admin@123456', 12);
    const email = 'admin@soufsim.dz';

    await prisma.user.upsert({
      where: { email },
      update: {
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        isVerified: true,
        isActive: true,
      },
      create: {
        email,
        password: hashedPassword,
        firstName: 'SoufSim',
        lastName: 'Admin',
        role: 'SUPER_ADMIN',
        isVerified: true,
        isActive: true,
      },
    });
    console.log('✅ Success! You can now login with:');
    console.log(`Email: ${email}`);
    console.log('Password: Admin@123456');
  } catch (error) {
    console.error('❌ Error updating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdmin();
