import { db } from '../../lib/db';
import { DocumentType, KycStatus, IdentityVerification } from '@prisma/client';

export const createOrUpdateKyc = async (
  userId: string,
  documentType: DocumentType,
  documentUrl: string
): Promise<IdentityVerification> => {
  return await db.identityVerification.upsert({
    where: { userId },
    update: {
      documentType,
      documentUrl,
      status: KycStatus.PENDING,
      submittedAt: new Date(),
    },
    create: {
      userId,
      documentType,
      documentUrl,
      status: KycStatus.PENDING,
    },
  });
};

export const getKycStatus = async (userId: string) => {
  return await db.identityVerification.findUnique({
    where: { userId },
    select: {
      status: true,
      documentType: true,
      submittedAt: true,
      adminNotes: true,
    },
  });
};
