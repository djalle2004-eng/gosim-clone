import { Request, Response, NextFunction } from 'express';
import prisma from '../../lib/db';

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const adminRoles = ['ADMIN', 'SUPER_ADMIN', 'EMPLOYEE', 'RESELLER'];
  if (!user || !adminRoles.includes(user.role)) {
    return res.status(403).json({
      message: 'Accès restreint aux membres du personnel et partenaires',
    });
  }
  next();
};

export const requireSuperAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  if (!user || user.role !== 'SUPER_ADMIN') {
    return res
      .status(403)
      .json({ message: 'Accès restreint au Super Administrateur' });
  }
  next();
};

// Generates an Express middleware that logs the requested action intelligently into PostgreSQL Postgres
export const audit = (action: string, resource: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const originalJson = res.json;

    res.json = function (body) {
      const user = (req as any).user;

      // Log only successful operations in the background
      if (res.statusCode >= 200 && res.statusCode < 300 && user) {
        prisma.auditLog
          .create({
            data: {
              adminId: user.id,
              action,
              resource,
              details: {
                params: req.params,
                query: req.query,
                // Avoid logging sensitive info like passwords
                body: {
                  ...req.body,
                  password: req.body.password ? '***' : undefined,
                },
              },
            },
          })
          .catch((err) => console.error('Audit Log Error:', err));
      }

      return originalJson.call(this, body);
    };

    next();
  };
};
