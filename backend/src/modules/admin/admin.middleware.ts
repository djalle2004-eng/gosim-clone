import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/db';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return res.status(403).json({ message: 'Accès restreint aux administrateurs' });
  }
  next();
};

export const requireSuperAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  if (!user || user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({ message: 'Accès restreint au Super Administrateur' });
  }
  next();
};

// Generates an Express middleware that logs the requested action intelligently into PostgreSQL Postgres
export const audit = (action: string, resource: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // We capture the send method to perform auditing AFTER the request completes successfully
    const originalSend = res.json;
    res.json = function (body) {
      if (res.statusCode >= 200 && res.statusCode < 300) {
          const user = (req as any).user;
          if (user) {
              // Fire async natively without awaiting to prevent latency
              prisma.auditLog.create({
                  data: {
                      adminId: user.id,
                      action,
                      resource,
                      details: { params: req.params, body: req.body }
                  }
              }).catch(console.error);
          }
      }
      return originalSend.call(this, body);
    };
    next();
  };
};
