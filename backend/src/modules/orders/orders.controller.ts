import { Request, Response } from 'express';
import * as ordersService from './orders.service';

export const create = async (req: Request, res: Response) => {
  try {
    const { planId, quantity, currency, price } = req.body;
    const userId = (req as any).user.id; // from JWT token middleware

    if (!planId || !price) {
      return res
        .status(400)
        .json({ message: 'Missing plan payload parameters.' });
    }

    const order = await ordersService.createOrder(
      userId,
      planId,
      quantity || 1,
      currency || 'USD',
      price
    );
    return res.status(201).json(order);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || 'Internal error' });
  }
};

export const getHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const orders = await ordersService.getUserOrders(userId);
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const getDetails = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const order = await ordersService.getOrderById(req.params.id, userId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    return res.status(500).json({ message: 'Internal error' });
  }
};

export const cancel = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const order = await ordersService.cancelOrder(req.params.id, userId);
    return res.json({ message: 'Order cancelled', order });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};

export const refund = async (req: Request, res: Response) => {
  try {
    // Usually guarded by an Admin Only middleware!
    const role = (req as any).user.role;
    if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await ordersService.refundOrder(req.params.id);
    return res.json({
      message: 'Order refunded securely. eSIMs have been destroyed.',
    });
  } catch (err: any) {
    return res.status(400).json({ message: err.message });
  }
};
