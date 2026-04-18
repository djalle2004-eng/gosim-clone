-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'EMPLOYEE';
ALTER TYPE "Role" ADD VALUE 'RESELLER';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resellerId" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_resellerId_fkey" FOREIGN KEY ("resellerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
