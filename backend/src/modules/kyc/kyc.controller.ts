import { Request, Response } from 'express';
import { createOrUpdateKyc, getKycStatus } from './kyc.service';
import { DocumentType } from '@prisma/client';

export const uploadDocument = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: 'Non autorisé' });

    // Ensure Multer passed the file
    if (!req.file) {
      return res
        .status(400)
        .json({
          message: 'Aucun fichier détecté. Veuillez attacher un document.',
        });
    }

    const { documentType } = req.body;
    if (!Object.values(DocumentType).includes(documentType)) {
      return res
        .status(400)
        .json({
          message:
            'Type de document invalide (PASSPORT, NATIONAL_ID, DRIVERS_LICENSE).',
        });
    }

    // Since we are saving locally, we reconstruct the public URL
    // e.g., "http://localhost:5000/uploads/kyc/12345.jpg"
    const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';
    const relativePath = `/uploads/kyc/${req.file.filename}`;
    const fullUrl = `${BACKEND_URL}${relativePath}`;

    const kycRecord = await createOrUpdateKyc(
      user.id,
      documentType as DocumentType,
      fullUrl
    );

    res.status(201).json({
      message: 'Document KYC soumis avec succès pour vérification.',
      status: kycRecord.status,
    });
  } catch (error: any) {
    console.error('KYC Upload Error:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

export const checkStatus = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: 'Non autorisé' });

    const statusObj = await getKycStatus(user.id);
    if (!statusObj) {
      return res.json({ hasSubmitted: false });
    }

    return res.json({
      hasSubmitted: true,
      ...statusObj,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur interne' });
  }
};
